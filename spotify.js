const axios = require("axios");

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

async function getSpotifyAccessToken() {
  const tokenUrl = "https://accounts.spotify.com/api/token";
  const authString = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );

  try {
    const response = await axios.post(
      tokenUrl,
      new URLSearchParams({ grant_type: "client_credentials" }),
      {
        headers: {
          Authorization: `Basic ${authString}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const accessToken = response.data.access_token;
    console.log("Spotify access token acquired.");
    return accessToken;
  } catch (error) {
    console.error(
      "Error fetching Spotify token:",
      error.response?.data || error.message
    );
    throw error;
  }
}

async function searchSpotifyTracks(
  keywords,
  accessToken,
  market = "US",
  maxTracks = 500
) {
  const allTracks = [];
  const pageSize = 50;
  const maxPages = Math.ceil(maxTracks / pageSize);

  for (let i = 0; i < maxPages; i++) {
    const offset = i * pageSize;
    const query = encodeURIComponent(keywords);
    const url = `https://api.spotify.com/v1/search?q=${query}&type=track&limit=${pageSize}&offset=${offset}&market=${market}`;

    console.log(`Fetching Spotify page ${i + 1}, offset ${offset}`);

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const tracks = response.data.tracks.items;
      console.log(`Page ${i + 1} returned ${tracks.length} tracks.`);

      allTracks.push(...tracks);

      if (tracks.length < pageSize) {
        console.log("No more results available from Spotify.");
        break;
      }
    } catch (error) {
      console.error(
        "Error fetching Spotify results:",
        error.response?.data || error.message
      );
      break;
    }
  }

  console.log(`Total tracks retrieved from Spotify: ${allTracks.length}`);
  return allTracks;
}

module.exports = { getSpotifyAccessToken, searchSpotifyTracks };
