import { writeFile } from "fs/promises";
import path from "path";
import { existsSync, mkdirSync } from "fs";

/**
 * API Upload untuk CDN
 */
export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { file, filename } = req.body;
    if (!file || !filename) {
      return res.status(400).json({ error: "File and filename are required" });
    }

    // Validasi ekstensi file (hanya gambar/video/audio)
    const allowedExtensions = ["jpg", "jpeg", "png", "gif", "mp4", "mp3", "wav", "webm"];
    const ext = filename.split(".").pop().toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      return res.status(400).json({ error: "File type not supported" });
    }

    // Buat folder uploads jika belum ada
    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    // Simpan file ke server
    const filePath = path.join(uploadDir, filename);
    const buffer = Buffer.from(file, "base64");

    await writeFile(filePath, buffer);

    return res.status(200).json({
      success: true,
      url: `/uploads/${filename}`
    });

  } catch (error) {
    console.error("Upload Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
