import axios from "axios";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN?.trim();
const GITHUB_USERNAME = "Valzyys"; 
const GITHUB_REPO = "JKT48Connect-CDN"; 
const BRANCH = "main"; 

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    if (!GITHUB_TOKEN) {
      console.error("🔴 ERROR: GITHUB_TOKEN tidak ditemukan!");
      return res.status(500).json({ error: "GitHub token missing!" });
    }

    const { file, filename } = req.query;
    if (!file || !filename) {
      console.error("🔴 ERROR: File dan filename wajib diisi!");
      return res.status(400).json({ error: "File and filename are required" });
    }

    const filePath = `public/images/${filename}`;

    const response = await axios.put(
      `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${filePath}`,
      {
        message: `Upload ${filename}`,
        content: file, 
        branch: BRANCH,
      },
      { headers: { Authorization: `Bearer ${GITHUB_TOKEN}` } }
    );

    console.log("🟢 File berhasil diunggah ke GitHub:", response.data);

    const fileUrl = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPO}/${BRANCH}/${filePath}`;
    return res.status(200).json({ success: true, url: fileUrl });

  } catch (error) {
    console.error("🔴 Upload Error:", error.response?.data || error.message);
    return res.status(500).json({
      error: "Internal Server Error",
      details: error.response?.data || error.message
    });
  }
}
