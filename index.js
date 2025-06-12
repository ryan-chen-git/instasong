const express = require("express");
const multer = require("multer");
const path = require("path");
const app = express();
const PORT = 3000;
const vision = require("@google-cloud/vision");

app.use(express.static(path.join(__dirname, "public")));

const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("image"), (req, res) => {
  console.log(req.file); // Logs file info to terminal
  res.send("Image uploaded!");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

async function analyzeImage(image) {
  try {
    const client = new vision.ImageAnnotatorClient({
      keyFilename: "google-cloud-vision-key.json",
    });

    const [labels] = await client.labelDetection(image);
    const [safeSearch] = await client.safeSearchDetection(image);
    return { labels, safeSearch };
  } catch (error) {
    console.error("Error:", error);
  }
}

(async () => {
  const imageAn = await analyzeImage("images/image.png");
  console.log(imageAn.labels.labelAnnotations);
})();
