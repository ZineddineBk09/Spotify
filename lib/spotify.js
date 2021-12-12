import SpotifyWebApi from "spotify-web-api-node";

const scopes = [
  "user-read-email",
  "playlist-read-private",
  "playlist-read-collaborative",
  "user-read-email",
  "streaming",
  "user-read-private",
  "user-library-read",
  //"user-library-modify",
  "user-top-read",
  "ugc-image-upload",
  "user-read-recently-played",
  "user-read-currently-playing",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-follow-read",
].join(",");

const params = {
  scope: scopes,
};

const queryParamsString = new URLSearchParams(params);

const LOGIN_URL =
  "https://accounts.spotify.com/authorize?" + queryParamsString.toString();

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
});

export default spotifyApi;
export { LOGIN_URL };
