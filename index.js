const express = require("express");
const multer = require("multer");
const { OpenAI } = require("openai");
const vision = require("@google-cloud/vision");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const upload = multer({ storage: multer.memoryStorage() });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const visionClient = new vision.ImageAnnotatorClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/recommend", upload.single("image"), async (req, res) => {
  const mode = req.body.mode || "gpt35";
  const genre = req.body.genre || "";
  const mood = req.body.mood || "";

  const genreText = genre ? ` Genre: ${genre}.` : "";
  const moodText = mood ? ` Mood: ${mood}.` : "";

  try {
    if (mode === "gpt4") {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "image" },
        async (error, result) => {
          if (error)
            return res.status(500).json({ error: "Cloudinary upload failed." });

          const imageUrl = result.secure_url;
          console.log("Cloudinary URL:", imageUrl);

          const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
              {
                role: "user",
                content: [
                  { type: "image_url", image_url: { url: imageUrl } },
                  {
                    type: "text",
                    text: `No extra words. Give ONLY list of 10 songs that MUST match given image for an Instagram post. If provided, use this genre:${genreText} and this mood:${moodText}`,
                  },
                ],
              },
            ],
            max_tokens: 250,
          });

          const song = completion.choices[0].message.content;
          res.json({ song });
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    } else {
      const [result] = await visionClient.labelDetection({
        image: { content: req.file.buffer },
      });
      const labels = result.labelAnnotations.map((label) => label.description);
      console.log("Keywords from image:", labels);

      const prompt = `No extra words. Give ONLY list of 10 songs that MUST match given keywords tags of an image for an Instagram post. If provided, use this genre:${genreText} and this mood:${moodText} Tags: ${labels.join(
        ", "
      )}`;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 250,
      });

      const song = completion.choices[0].message.content;
      res.json({ song });
    }
  } catch (err) {
    console.error("Error handling /recommend:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// require("dotenv").config();
// const express = require("express");
// const multer = require("multer");
// const path = require("path");
// const app = express();
// const PORT = process.env.PORT || 3000;
// const vision = require("@google-cloud/vision");
// const client = new vision.ImageAnnotatorClient({
//   keyFilename: "google-cloud-vision-key.json",
// });
// const { getSpotifyAccessToken, searchSpotifyTracks } = require("./spotify");
// const { getTopMetaApprovedTracks } = require("./metaChecker");

// app.use(express.static(path.join(__dirname, "public")));

// const upload = multer({ storage: multer.memoryStorage() });

// app.post("/upload", upload.single("image"), async (req, res) => {
//   console.log(req.file); // Logs file info to terminal
//   try {
//     const buffer = req.file.buffer; // Get image buffer from memory
//     const market = req.body.market || "US";

//     const [result] = await client.labelDetection({
//       image: { content: buffer },
//     });

//     const labels = result.labelAnnotations.map((label) => label.description);
//     const searchQuery = labels.join(" ");
//     const token = await getSpotifyAccessToken();
//     const spotifyResults = await searchSpotifyTracks(searchQuery, token, market);

//     // find up to 10 Meta-approved songs
//     const approvedTracks = getTopMetaApprovedTracks(spotifyResults, 10);

//     console.log("Keywords from image:", labels);
//     res.json({
//       keywords: labels,
//       songs: approvedTracks,
//       approved: approvedTracks.length > 0,
//     });
//   } catch (error) {
//     console.error("Error processing image:", error);
//     res.status(500).json({ error: "Image analysis failed" });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });
