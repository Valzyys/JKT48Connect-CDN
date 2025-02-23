import { writeFile } from "fs/promises";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { file, filename } = req.body;
  if (!file || !filename) {
    return res.status(400).json({ error: "File and filename are required" });
  }

  try {
    const buffer = Buffer.from(file, "base64");
    const filePath = path.join(process.cwd(), "public/uploads", filename);

    await writeFile(filePath, buffer);
    
    return res.status(200).json({
      success: true,
      url: `/uploads/${filename}`
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to upload file" });
  }
}
