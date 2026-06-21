type VercelRequest = any; type VercelResponse = any;
import { pullMetaAnalytics } from "../server/meta";
import { runScheduledPosts } from "../server/publisher";

/**
 * /api/tick — Pinged every minute by your uptime bot (e.g. UptimeRobot).
 *
 * Each ping triggers:
 *   1. Pull real analytics from Meta Insights API (AI #2's data source)
 *   2. Check for scheduled posts to publish (AI #1's publisher)
 *
 * This replaces node-cron — the uptime bot IS the cron.
 * Set up UptimeRobot: monitor type HTTP, interval 1 minute, URL: https://your-app.vercel.app/api/tick
 */
export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const results = { analytics: "skipped", posts: "skipped", ts: new Date().toISOString() };

  // 1. Pull real analytics from Meta
  try {
    await pullMetaAnalytics();
    results.analytics = "ok";
  } catch (err: any) {
    results.analytics = `error: ${err.message}`;
  }

  // 2. Check for scheduled posts to publish
  try {
    await runScheduledPosts();
    results.posts = "ok";
  } catch (err: any) {
    results.posts = `error: ${err.message}`;
  }

  // Always return 200 so the uptime bot sees the service as alive
  return res.status(200).json({ status: "ok", ...results });
}
