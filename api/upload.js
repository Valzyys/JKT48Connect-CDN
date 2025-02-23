export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {  // Ubah dari GET ke POST
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { file, filename } = req.body; // Ambil dari body request
    if (!file || !filename) {
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
