# instasong

Instasong is a web tool that recommends songs for Instagram posts based on image content. Upload a photo, and you'll receive a curated song that fits the mood or theme — using Google Cloud Vision, Cloudinary, and OpenAI APIs. 

# boring backstory to this project

This is my first personal project that was more meant to teach me rather than have useful functionality. Near the end of this project, I realize a huge issue: I have no way of knowing if the recommended song is available on Instagram. Unfortunately, the sound collection used by Instagram is not publically available, leading me to search for various methods to recommend songs that were likely, but never guaranteed, to be on instagram. Initially, the idea was that I would use the Google Cloud Vision API to extract keywords from the image, where I would then use the Spotify Search API to find songs related to those keywords. Halfway through, I found out that Spotify doesn't attach keywords to tracks and songs, only artists. Therefore, the search results only returned very obscure songs that always had the keywords in the song title. In other words, this variation of the project gave terrible recommendations that were never on Instagram. I then tried scraping a file of the tracks on the Meta Sound Collection website, which was nearly successful until I found out there were only about 4.6k tracks out of around 14k tracks that should have been present on Instagram. In addition, a lot of the tracks in the MSC weren't even available on Instagram. Basically, I was trying to cache a file of the songs available on Instagram so I could compare the Spotify Search results with these results to ensure the final recommendation was accurate and accessible on Instagram, which didn't work. My next methods were to use a public Spotify playlist of the top 10,000 most popular songs in the world (as of June 2025 at least, since Spotify playlists cap out at 10,000 songs) and try the YouTube Search API, both of which have many obvious flaws. I was midway through implementing these ideas before I discovered the OpenAI API, which could use GPT-4 with Vision. I knew immediately that this would be the most accurate solution, and it turned out to be true. I hate that using AI ended up being the best solution, since it feels like cheating, but I can't argue with the results. To make it feel as if I actually did something besides make a not so cleverly masked ChatGPT website useful for only a singular purpose (it is), I added a less accurate, but cheaper option to combine the Google Cloud Vision API with OpenAI API. I decided to remove certain files from .gitignore to show document my process and show proof of the cached files and code used to obtain them. So, you can see json files for the Meta Sound Collection and the 10,000 song Spotify playlist if you want, as well as the code I used to cache the files.

## Demo

No demo. I consider this a failed project. But on everyone's mama this works.

## Features

- Use GPT-4 with Vision to give song recommendation. (Same result as if you used Chat-GPT 4o, uploaded your image, and asked for a recommendation manually)
- Use Google Cloud Vision, to extract keywords. Then, use GPT-3.5 Turbo, an older model that cannot analyze images, to recommend songs based off the keywords.
- Incomplete feature (not available since it was only an idea to be tested) to allow users to use Spotify Recommendations API to fine tune the properties of the song they want, but would be unrelated to their image.

## Installation

Step-by-step instructions on how to install and run your project. Only usable as a locally run server.

```bash
git clone https://github.com/ryan-chen-git/instasong.git
cd instasong
npm install
node index.js
