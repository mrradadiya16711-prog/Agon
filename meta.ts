import { query } from "./db";
import { decrypt } from "./crypto";

const API_VERSION = process.env.META_API_VERSION || "v21.0";

async function getStoredKey(id: string): Promise<string | null> {
  const { rows } = await query("SELECT encrypted_value FROM keys WHERE id = $1", [id]);
  if (rows.length === 0) return null;
  return decrypt(rows[0].encrypted_value);
}

/**
 * Pull real analytics from Meta Insights API.
 * Called every minute by the /api/tick endpoint (pinged by uptime bot).
 */
export async function pullMetaAnalytics() {
  const igToken = await getStoredKey("instagram");
  const fbToken = await getStoredKey("facebook");

  if (!igToken && !fbToken) {
    console.log("[meta] No social tokens found, skipping");
    return;
  }

  if (igToken) {
    try {
      await pullInstagramInsights(igToken);
    } catch (err: any) {
      console.error("[meta] Instagram pull failed:", err.message);
    }
  }

  if (fbToken) {
    try {
      await pullFacebookInsights(fbToken);
    } catch (err: any) {
      console.error("[meta] Facebook pull failed:", err.message);
    }
  }
}

async function pullInstagramInsights(token: string) {
  const accountId = process.env.INSTAGRAM_ACCOUNT_ID;
  if (!accountId) {
    console.log("[meta] No INSTAGRAM_ACCOUNT_ID set, skipping Instagram");
    return;
  }

  const url = `https://graph.facebook.com/${API_VERSION}/${accountId}/insights?metric=impressions,reach,saves&period=day&access_token=${token}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Meta API ${response.status}: ${await response.text()}`);
  }

  const data = await response.json();
  for (const metric of data.data || []) {
    const value = metric.values?.[0]?.value || 0;
    await query(
      `INSERT INTO analytics (platform, metric, value) VALUES ('instagram', $1, $2)`,
      [metric.name, value]
    );
  }
  console.log(`[meta] Instagram insights saved: ${data.data?.length || 0} metrics`);
}

async function pullFacebookInsights(token: string) {
  const pageId = process.env.FACEBOOK_PAGE_ID;
  if (!pageId) {
    console.log("[meta] No FACEBOOK_PAGE_ID set, skipping Facebook");
    return;
  }

  const url = `https://graph.facebook.com/${API_VERSION}/${pageId}/insights?metric=page_impressions,page_reach&period=day&access_token=${token}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Meta API ${response.status}: ${await response.text()}`);
  }

  const data = await response.json();
  for (const metric of data.data || []) {
    const value = metric.values?.[0]?.value || 0;
    await query(
      `INSERT INTO analytics (platform, metric, value) VALUES ('facebook', $1, $2)`,
      [metric.name, value]
    );
  }
  console.log(`[meta] Facebook insights saved: ${data.data?.length || 0} metrics`);
}
