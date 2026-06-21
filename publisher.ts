import { query } from "./db";
import { decrypt } from "./crypto";

const API_VERSION = process.env.META_API_VERSION || "v21.0";

/**
 * AI #1: Check for scheduled posts and publish them.
 * Called every minute by the /api/tick endpoint.
 */
export async function runScheduledPosts() {
  const { rows } = await query(
    `SELECT * FROM posts
     WHERE status = 'scheduled'
     AND scheduled_at <= NOW()
     ORDER BY scheduled_at ASC`
  );

  if (rows.length === 0) return;

  console.log(`[publisher] Found ${rows.length} posts to publish`);

  for (const post of rows) {
    try {
      await publishPost(post);
      await query("UPDATE posts SET status = 'published', published_at = NOW() WHERE id = $1", [post.id]);
      console.log(`[publisher] Published post ${post.id} to ${post.platform}`);
    } catch (err: any) {
      console.error(`[publisher] Failed post ${post.id}:`, err.message);
      await query("UPDATE posts SET status = 'failed' WHERE id = $1", [post.id]);
    }
  }
}

async function publishPost(post: any) {
  const { rows } = await query(
    "SELECT encrypted_value FROM keys WHERE id = $1",
    [post.platform === "instagram" ? "instagram" : "facebook"]
  );

  if (rows.length === 0) {
    throw new Error(`No token for platform: ${post.platform}`);
  }

  const token = decrypt(rows[0].encrypted_value);

  if (post.platform === "instagram") {
    await publishToInstagram(post, token);
  } else {
    await publishToFacebook(post, token);
  }
}

async function publishToInstagram(post: any, token: string) {
  const accountId = process.env.INSTAGRAM_ACCOUNT_ID;
  if (!accountId) throw new Error("INSTAGRAM_ACCOUNT_ID not set");

  // Step 1: Create media container
  const createRes = await fetch(
    `https://graph.facebook.com/${API_VERSION}/${accountId}/media`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image_url: post.image_url || "https://via.placeholder.com/1080",
        caption: post.caption,
        access_token: token,
      }),
    }
  );
  if (!createRes.ok) throw new Error(`Instagram create failed: ${await createRes.text()}`);
  const createData = await createRes.json();

  // Step 2: Publish
  const publishRes = await fetch(
    `https://graph.facebook.com/${API_VERSION}/${accountId}/media_publish`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        creation_id: createData.id,
        access_token: token,
      }),
    }
  );
  if (!publishRes.ok) throw new Error(`Instagram publish failed: ${await publishRes.text()}`);
}

async function publishToFacebook(post: any, token: string) {
  const pageId = process.env.FACEBOOK_PAGE_ID;
  if (!pageId) throw new Error("FACEBOOK_PAGE_ID not set");

  const res = await fetch(
    `https://graph.facebook.com/${API_VERSION}/${pageId}/feed`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: post.caption,
        access_token: token,
      }),
    }
  );
  if (!res.ok) throw new Error(`Facebook publish failed: ${await res.text()}`);
}
