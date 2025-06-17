const fs = require("fs");
const path = require("path");

const metaPath =
  process.env.META_SONG_JSON ||
  path.join(__dirname, "meta_sound_collection.json");
const metaTracks = JSON.parse(fs.readFileSync(metaPath, "utf-8"));

function isMetaMatch(spotifyTrack) {
  const spotifyTitle = spotifyTrack.name.toLowerCase().trim();
  const spotifyArtists = spotifyTrack.artists.map((a) =>
    a.name.toLowerCase().trim()
  );

  const match = metaTracks.find(
    (meta) =>
      meta.title.toLowerCase().trim() === spotifyTitle &&
      spotifyArtists.includes(meta.artist.toLowerCase().trim())
  );

  if (!match) {
    console.log(
      `No match for: "${spotifyTitle}" by [${spotifyArtists.join(", ")}]`
    );
  } else {
    console.log(`Meta match found: "${spotifyTitle}" by ${spotifyArtists[0]}`);
  }

  return Boolean(match);
}

function getTopMetaApprovedTracks(spotifyTracks, limit = 10) {
  const approvedTracks = [];

  for (const track of spotifyTracks) {
    if (isMetaMatch(track)) {
      approvedTracks.push({
        title: track.name,
        artist: track.artists[0].name,
        spotify_url: track.external_urls.spotify,
        preview_url: track.preview_url,
      });

      if (approvedTracks.length >= limit) {
        console.log("Reached approved track limit.");
        break;
      }
    }
  }

  console.log(`Total Meta-approved tracks found: ${approvedTracks.length}`);
  return approvedTracks;
}

module.exports = { getTopMetaApprovedTracks, isMetaMatch };
