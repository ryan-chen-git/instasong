require("dotenv").config();
const axios = require("axios");
const fs = require("fs");

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const playlistId = "0nwC4WbX0wGfH1Asj185R6";

async function getSpotifyAccessToken() {
  const tokenUrl = "https://accounts.spotify.com/api/token";
  const authString = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

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
    return response.data.access_token;
  } catch (error) {
    console.error("Error getting access token:", error.message);
    throw error;
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchPlaylistTracks(token, playlistId) {
  const limit = 100;
  const maxTracks = 10000;
  let offset = 0;
  let allTracks = [];

  while (offset < maxTracks) {
    const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=${limit}&offset=${offset}`;

    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const items = response.data.items;
      if (!items.length) break;

      const tracks = items
        .map(({ track }) => {
          if (!track) return null;
          return {
            id: track.id,
            title: track.name,
            artist: track.artists.map((a) => a.name).join(", "),
            popularity: track.popularity,
            spotify_url: track.external_urls.spotify,
            preview_url: track.preview_url,
          };
        })
        .filter(Boolean);

      allTracks.push(...tracks);
      offset += limit;

      console.log(`Fetched ${allTracks.length} / ${maxTracks} tracks...`);
      await sleep(350); // avoid rate limiting

    } catch (error) {
      console.error(`Error at offset ${offset}:`, error.response?.data || error.message);
      break;
    }
  }

  return allTracks;
}

async function main() {
  try {
    const token = await getSpotifyAccessToken();
    const tracks = await fetchPlaylistTracks(token, playlistId);
    fs.writeFileSync("cached_playlist.json", JSON.stringify(tracks, null, 2));
    console.log(`\nCached ${tracks.length} tracks to cached_playlist.json`);
  } catch (error) {
    console.error("Failed to fetch and cache playlist:", error);
  }
}

main();