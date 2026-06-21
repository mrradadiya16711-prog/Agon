type VercelRequest = any; type VercelResponse = any;
import { query } from "../server/db";
import { generatePost } from "../server/nvidia";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  // POST — generate or schedule
  if (req.method === "POST") {
    const { action, prompt, caption, platform, scheduledAt, imageUrl } = req.body;

    // Generate a caption using AI #1
    if (action === "generate" || prompt) {
      try {
        const text = await generatePost(prompt);
        return res.json({ caption: text });
      } catch (err: any) {
        return res.status(500).json({ error: err.message });
      }
    }

    // Schedule a post
    if (caption && platform && scheduledAt) {
      try {
        const { rows } = await query(
          `INSERT INTO posts (caption, platform, image_url, status, scheduled_at)
           VALUES ($1, $2, $3, 'scheduled', $4)
           RETURNING *`,
          [caption, platform, imageUrl || null, scheduledAt]
        );
        return res.json({ post: rows[0] });
      } catch (err: any) {
        return res.status(500).json({ error: err.message });
      }
    }

    return res.status(400).json({ error: "Provide { prompt } to generate or { caption, platform, scheduledAt } to schedule" });
  }

  // GET — list posts
  if (req.method === "GET") {
    try {
      const { rows } = await query("SELECT * FROM posts ORDER BY created_at DESC LIMIT 50");
      return res.json({ posts: rows });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
