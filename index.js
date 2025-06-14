const express = require("express");
const multer = require("multer");
const path = require("path");
const app = express();
const PORT = 3000;
const vision = require("@google-cloud/vision");
const client = new vision.ImageAnnotatorClient({
  keyFilename: "google-cloud-vision-key.json",
});
const { getSpotifyAccessToken } = require("./spotify");

app.use(express.static(path.join(__dirname, "public")));

const upload = multer({ storage: multer.memoryStorage() });

app.post("/upload", upload.single("image"), async (req, res) => {
  console.log(req.file); // Logs file info to terminal
  try {
    const buffer = req.file.buffer; // Get image buffer from memory

    const [result] = await client.labelDetection({
      image: { content: buffer },
    });

    const labels = result.labelAnnotations.map((label) => label.description);

    res.json({ keywords: labels }); // Send JSON back to frontend
  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).json({ error: "Image analysis failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

getSpotifyAccessToken();
