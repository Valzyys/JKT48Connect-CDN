import axios from "axios";

const GITHUB_TOKEN = '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';
const GITHUB_USERNAME = "Valzyys"; // Ganti dengan username GitHub
const GITHUB_REPO = "JKT48Connect-CDN"; // Ganti dengan nama repository
const BRANCH = "main"; // Branch yang digunakan

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { file, filename } = req.query;
    if (!file || !filename) {
      return res.status(400).json({ error: "File and filename are required" });
    }

    const filePath = `public/images/${filename}`;

    // Cek apakah file sudah ada di repository (dapatkan SHA)
    let sha = null;
    try {
      const { data: fileData } = await axios.get(
        `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${filePath}`,
        { headers: { Authorization: `token ${GITHUB_TOKEN}` } }
      );
      sha = fileData.sha;
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error("🔴 Error saat mendapatkan SHA:", error.response?.data || error.message);
        return res.status(500).json({ error: "Failed to fetch existing file info" });
      }
    }

    console.log(`🟢 SHA File: ${sha ? sha : "File baru, tidak ada SHA"}`);

    // Commit file ke GitHub
    const response = await axios.put(
      `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${filePath}`,
      {
        message: `Upload ${filename}`,
        content: Buffer.from(file, "base64").toString("base64"),
        branch: BRANCH,
        sha: sha || undefined
      },
      { headers: { Authorization: `token ${GITHUB_TOKEN}` } }
    );

    console.log("🟢 File berhasil diunggah ke GitHub:", response.data);

    const fileUrl = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPO}/${BRANCH}/${filePath}`;
    return res.status(200).json({ success: true, url: fileUrl });

  } catch (error) {
    console.error("🔴 Upload Error:", error.response?.data || error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
