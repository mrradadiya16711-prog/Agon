import { query } from "./db";
import { decrypt } from "./crypto";

const BASE_URL = process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1";
const MODEL = "meta/llama-3.1-70b-instruct";

/** Get a decrypted key from the database (user pasted it in the Connect page). */
async function getStoredKey(id: string): Promise<string | null> {
  const { rows } = await query("SELECT encrypted_value FROM keys WHERE id = $1", [id]);
  if (rows.length === 0) return null;
  return decrypt(rows[0].encrypted_value);
}

/**
 * Get an NVIDIA API key.
 * Tries env vars first (set in Vercel), then falls back to stored key.
 * keyIndex 1 = AI #1 (Creator), keyIndex 2 = AI #2 (Optimizer)
 */
async function getNvidiaKey(keyIndex = 1): Promise<string | null> {
  const envKey = keyIndex === 1
    ? process.env.NVIDIA_API_KEY_1
    : process.env.NVIDIA_API_KEY_2;

  if (envKey && !envKey.startsWith("nvapi-your")) {
    return envKey;
  }

  // Fall back to stored key (user pasted it in the frontend)
  return getStoredKey("nvidia");
}

/** AI #1: Generate a social media post caption. */
export async function generatePost(prompt: string, brandVoice = ""): Promise<string> {
  const apiKey = await getNvidiaKey(1);
  if (!apiKey) {
    throw new Error("No NVIDIA API key found. Add NVIDIA_API_KEY_1 to Vercel env vars or paste it in the Connect page.");
  }

  const systemPrompt = `You are a social media copywriter for a restaurant.
Write engaging Instagram/Facebook captions.
${brandVoice ? `Brand voice: ${brandVoice}` : ""}
Keep it under 150 characters. Include 2-3 relevant hashtags. No emojis unless asked.`;

  const response = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 200,
    }),
  });

  if (!response.ok) {
    throw new Error(`NVIDIA API error ${response.status}: ${await response.text()}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content?.trim() || "";
}

/** AI #2: Analyze analytics data and generate optimization insights. */
export async function generateInsights(analyticsSummary: any): Promise<any[]> {
  const apiKey = await getNvidiaKey(2);
  if (!apiKey) {
    throw new Error("No NVIDIA API key found for AI #2. Add NVIDIA_API_KEY_2 to Vercel env vars.");
  }

  const systemPrompt = `You are an analytics optimizer for a restaurant's social media.
Given performance data, find patterns and write actionable rules.
Respond in JSON array format:
[{"metric": "...", "insight": "...", "action": "..."}]
Keep insights short and specific. Max 4 rules.`;

  const response = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Analytics summary:\n${JSON.stringify(analyticsSummary)}` },
      ],
      temperature: 0.4,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    throw new Error(`NVIDIA API error ${response.status}: ${await response.text()}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content?.trim() || "[]";

  try {
    return JSON.parse(content);
  } catch {
    return [];
  }
}
