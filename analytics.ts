type VercelRequest = any; type VercelResponse = any;
import { query } from "../server/db";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") return res.status(204).end();

  const { metric = "views", limit = 20 } = req.query;

  try {
    const { rows } = await query(
      `SELECT value, recorded_at FROM analytics
       WHERE metric = $1
       ORDER BY recorded_at DESC
       LIMIT $2`,
      [metric as string, parseInt(limit as string)]
    );

    const data = rows.reverse();
    const values = data.map((r: any) => r.value);

    return res.json({
      metric,
      values,
      hasRealData: values.length > 0,
      latest: values[values.length - 1] || 0,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
