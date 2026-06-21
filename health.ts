type VercelRequest = any; type VercelResponse = any;

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    db: !!process.env.DATABASE_URL,
    nvidia1: !!process.env.NVIDIA_API_KEY_1,
    nvidia2: !!process.env.NVIDIA_API_KEY_2,
  });
}
