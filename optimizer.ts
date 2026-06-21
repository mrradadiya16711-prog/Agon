import { query } from "./db";
import { generateInsights } from "./nvidia";

/**
 * AI #2: Reads analytics, finds patterns, writes rules back to AI #1.
 * Called every 15 minutes by the /api/optimize endpoint (pinged by uptime bot).
 */
export async function runOptimizer() {
  const { rows } = await query(
    `SELECT platform, metric, value, recorded_at
     FROM analytics
     WHERE recorded_at > NOW() - INTERVAL '24 hours'
     ORDER BY recorded_at ASC`
  );

  if (rows.length === 0) {
    console.log("[optimizer] No analytics data yet, skipping");
    return;
  }

  const summary = summarizeAnalytics(rows);
  const insights = await generateInsights(summary);

  if (!insights || insights.length === 0) {
    console.log("[optimizer] No new insights generated");
    return;
  }

  for (const rule of insights) {
    await query(
      `INSERT INTO rules (metric, insight, action) VALUES ($1, $2, $3)`,
      [rule.metric, rule.insight, rule.action]
    );
  }

  console.log(`[optimizer] AI #2 wrote ${insights.length} new rules`);
}

function summarizeAnalytics(rows: any[]) {
  const byMetric: Record<string, number[]> = {};
  for (const row of rows) {
    const key = `${row.platform}_${row.metric}`;
    if (!byMetric[key]) byMetric[key] = [];
    byMetric[key].push(row.value);
  }

  const summary: Record<string, any> = {};
  for (const [key, values] of Object.entries(byMetric)) {
    summary[key] = {
      total: values.reduce((a, b) => a + b, 0),
      avg: Math.round(values.reduce((a, b) => a + b, 0) / values.length),
      min: Math.min(...values),
      max: Math.max(...values),
      count: values.length,
    };
  }
  return summary;
}
