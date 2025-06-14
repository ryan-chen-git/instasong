const axios = require("axios");

const clientId = "93ef8b8e9aa047f88e04c7c7c0d5d3f0";
const clientSecret = "1f7c560abb684553a9337bd8406f862c";

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
};

module.exports = { getSpotifyAccessToken };