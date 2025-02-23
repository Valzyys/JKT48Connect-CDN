import { writeFile } from "fs/promises";
import path from "path";
import { existsSync, mkdirSync } from "fs";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { file, filename } = req.body;
    if (!file || !filename) {
      return res.status(400).json({ error: "File and filename are required" });
    }

    // Pastikan folder 'uploads' ada
    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    // Simpan file ke folder uploads
    const buffer = Buffer.from(file, "base64");
    const filePath = path.join(uploadDir, filename);

    await writeFile(filePath, buffer);

    return res.status(200).json({
      success: true,
      url: `/uploads/${filename}`,
    });

  } catch (error) {
    console.error("Upload Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
