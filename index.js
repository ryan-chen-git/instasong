require("dotenv").config();
const express = require("express");
const multer = require("multer");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;
const vision = require("@google-cloud/vision");
const client = new vision.ImageAnnotatorClient({
  keyFilename: "google-cloud-vision-key.json",
});
const { getSpotifyAccessToken, searchSpotifyTrack } = require("./spotify");
const { getTopMetaApprovedTracks } = require("./metaChecker");

app.use(express.static(path.join(__dirname, "public")));

const upload = multer({ storage: multer.memoryStorage() });

app.post("/upload", upload.single("image"), async (req, res) => {
  console.log(req.file); // Logs file info to terminal
  try {
    const buffer = req.file.buffer; // Get image buffer from memory
    const market = req.body.market || "US";

    const [result] = await client.labelDetection({
      image: { content: buffer },
    });

    const labels = result.labelAnnotations.map((label) => label.description);
    const searchQuery = labels.join(" ");
    const token = await getSpotifyAccessToken();
    const spotifyResults = await searchSpotifyTrack(searchQuery, token, market);

    // find up to 10 Meta-approved songs
    const approvedTracks = getTopMetaApprovedTracks(spotifyResults, 10);

    console.log("Keywords from image:", labels);
    res.json({
      keywords: labels,
      songs: approvedTracks,
      approved: approvedTracks.length > 0,
    });
  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).json({ error: "Image analysis failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
