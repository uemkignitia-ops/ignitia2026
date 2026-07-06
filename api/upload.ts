import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "kmd4jukj";
const API_KEY = process.env.CLOUDINARY_API_KEY || "791127231192158";
const API_SECRET = process.env.CLOUDINARY_API_SECRET || "rYZ0ED3dGRxxyZc1X6Kd-6zKycY";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { file } = req.body;
    if (!file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const timestamp = Math.floor(Date.now() / 1000).toString();
    const folder = "ignitia/gallery";
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}${API_SECRET}`;

    const signature = crypto
      .createHash("sha1")
      .update(paramsToSign)
      .digest("hex");

    const formData = new URLSearchParams();
    formData.append("file", file);
    formData.append("api_key", API_KEY);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("folder", folder);

    const cldRes = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      }
    );

    const result = await cldRes.json();
    if (!cldRes.ok) {
      return res.status(400).json({ error: result.error?.message || "Cloudinary upload failed" });
    }

    return res.status(200).json({ secure_url: result.secure_url, public_id: result.public_id });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
}
