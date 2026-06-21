type VercelRequest = any; type VercelResponse = any;
import { runOptimizer } from "../server/optimizer";

/**
 * /api/optimize — Pinged every 15 minutes by your uptime bot.
 *
 * Each ping triggers AI #2 (Optimizer):
 *   - Reads the last 24h of analytics data
 *   - Calls NVIDIA NIM to find patterns
 *   - Writes improvement rules back to the database (AI #1 reads these next)
 *
 * Set up a SECOND UptimeRobot monitor: interval 15 minutes, URL: https://your-app.vercel.app/api/optimize
 */
export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    await runOptimizer();
    return res.status(200).json({ status: "ok", optimizer: "ran", ts: new Date().toISOString() });
  } catch (err: any) {
    console.error("[optimize] failed:", err.message);
    // Still return 200 so uptime bot doesn't alert on expected errors (e.g. no data yet)
    return res.status(200).json({ status: "ok", optimizer: `error: ${err.message}`, ts: new Date().toISOString() });
  }
}
