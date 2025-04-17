const express = require('express');
const multer = require('multer');
const vision = require('@google-cloud/vision');
const path = require('path');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config(); // 👈 Load your .env file

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Multer setup (for image uploads)
const upload = multer({ dest: 'uploads/' });

// Google Cloud Vision client
const client = new vision.ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_VISION_KEY_PATH, // 👈 From .env
});

// Spotify credentials (from .env)
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

let spotifyAccessToken = null;
let tokenExpirationTime = 0;

// === Spotify Token Fetch ===
async function getSpotifyAccessToken() {
  if (spotifyAccessToken && Date.now() < tokenExpirationTime) {
    return spotifyAccessToken;
  }

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({ grant_type: 'client_credentials' }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization:
            'Basic ' +
            Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64'),
        },
      }
    );

    spotifyAccessToken = response.data.access_token;
    tokenExpirationTime = Date.now() + response.data.expires_in * 1000;
    return spotifyAccessToken;
  } catch (error) {
    console.error('Error getting Spotify token:', error.response?.data || error.message);
  }
}

// === Example Route ===
app.post('/upload', upload.single('photo'), async (req, res) => {
  try {
    const [result] = await client.labelDetection(req.file.path);
    const labels = result.labelAnnotations.map(label => label.description);
    res.json({ labels });
  } catch (error) {
    console.error('Vision API error:', error);
    res.status(500).json({ error: 'Vision API failed' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
