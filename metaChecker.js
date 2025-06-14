const fs = require("fs");
const path = require("path");

// Load the full meta sound collection JSON
const metaPath =
  process.env.META_SONG_JSON ||
  path.join(__dirname, "meta_sound_collection.json");

const metaTracks = JSON.parse(fs.readFileSync(metaPath, "utf-8"));

// Check if a Spotify track matches a Meta-approved track
function isMetaMatch(spotifyTrack) {
  const spotifyTitle = spotifyTrack.name.toLowerCase().trim();
  const spotifyArtists = spotifyTrack.artists.map((a) =>
    a.name.toLowerCase().trim()
  );

  return metaTracks.some(
    (meta) =>
      meta.title.toLowerCase().trim() === spotifyTitle &&
      spotifyArtists.includes(meta.artist.toLowerCase().trim())
  );
}

// Return the best match if found, or fallback track
function getTopMetaApprovedTracks(spotifyTracks, limit = 10) {
  const approvedTracks = [];

  for (let track of spotifyTracks) {
    const title = track.name.toLowerCase().trim();
    const artists = track.artists.map((a) => a.name.toLowerCase().trim());

    const isMatch = metaTracks.some(
      (meta) =>
        meta.title.toLowerCase().trim() === title &&
        artists.includes(meta.artist.toLowerCase().trim())
    );

    if (isMatch) {
      approvedTracks.push({
        title: track.name,
        artist: track.artists[0].name,
        spotify_url: track.external_urls.spotify,
        preview_url: track.preview_url,
      });
    }

    if (approvedTracks.length >= limit) break;
  }

  return approvedTracks;
}

module.exports = { getTopMetaApprovedTracks };
