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
      new URLSearchParams({
        grant_type: "client_credentials",
      }),
      {
        headers: {
          Authorization: `Basic ${authString}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const accessToken = response.data.access_token;
    console.log("Spotify access token:", accessToken);
    return accessToken;
  } catch {
    console.error(
      "Error fetching Spotify token:",
      error.response?.data || error.message
    );
    throw error;
  }
}

async function searchSpotifyTrack(keywords, accessToken, market = "US") {
  const query = encodeURIComponent(keywords);
  const url = `https://api.spotify.com/v1/search?q=${query}&type=track&limit=50&market=${market}`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const tracks = response.data.tracks.items;

    // Log all matches for debugging
    tracks.forEach((track, i) => {
      const artists = track.artists.map((a) => a.name).join(", ");
      console.log(`${i + 1}. ${track.name} by ${artists}`);
    });

    return tracks; // ✅ return array
  } catch (error) {
    console.error(
      "Error searching Spotify:",
      error.response?.data || error.message
    );
    return []; // Return empty array on failure
  }
};

module.exports = { getSpotifyAccessToken, searchSpotifyTrack };
