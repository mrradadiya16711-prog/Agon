type VercelRequest = any; type VercelResponse = any;
import { query } from "../server/db";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") return res.status(204).end();

  try {
    const { rows } = await query(
      "SELECT metric, insight, action, created_at FROM rules ORDER BY created_at DESC LIMIT 10"
    );
    return res.json({ rules: rows });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
