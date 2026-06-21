type VercelRequest = any; type VercelResponse = any;
import { query } from "../server/db";
import { encrypt } from "../server/crypto";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS — allow your frontend
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();

  // POST — save a key
  if (req.method === "POST") {
    const { id, name, value } = req.body;
    if (!id || !value) {
      return res.status(400).json({ error: "id and value are required" });
    }
    try {
      const encrypted = encrypt(value);
      await query(
        `INSERT INTO keys (id, name, encrypted_value)
         VALUES ($1, $2, $3)
         ON CONFLICT (id) DO UPDATE SET encrypted_value = $3, created_at = NOW()`,
        [id, name || id, encrypted]
      );
      return res.json({ success: true, id, connected: true });
    } catch (err: any) {
      console.error("Save key error:", err);
      return res.status(500).json({ error: err.message });
    }
  }

  // GET — check which keys are connected
  if (req.method === "GET") {
    try {
      const { rows } = await query("SELECT id, name, created_at FROM keys");
      const connected: Record<string, boolean> = {};
      for (const row of rows) connected[row.id] = true;
      return res.json({ connected, count: rows.length });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // DELETE — remove a key (use ?id=instagram)
  if (req.method === "DELETE") {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "?id= is required" });
    try {
      await query("DELETE FROM keys WHERE id = $1", [id]);
      return res.json({ success: true, removed: true });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
