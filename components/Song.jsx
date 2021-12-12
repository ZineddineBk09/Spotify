import React from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSpotify from "../hooks/useSpotify";
import { millisToMinutesAndSeconds } from "../lib/time";

function Song({ song, order }) {
  const spotifyApi = useSpotify();

  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

  const playSong = function () {
    setCurrentTrackId(song.track.id);
    setIsPlaying(true);
    spotifyApi.play({
      uris: [song.track.uri],
    });
  };

  return (
    <div
      className="grid grid-cols-2 py-4 px-5 hover:bg-gray-900 cursor-pointer rounded-lg"
      onClick={() => playSong()}
    >
      <div className="flex items-center space-x-4">
        <p>{order + 1}</p>
        <img src={song?.track.album.images[0]?.url} className="w-10 h-10 " />

        <div>
          <p className="text-white">{song.track.name}</p>
          <p className="w-36 lg:w-64 truncate">
            {song.track.artists[0].name}
          </p>{" "}
        </div>
      </div>

      <div className="flex items-center justify-between ml-auto md:ml-0">
        <p className="w-40 hidden md:inline ">{song.track.album.name}</p>
        <p>{millisToMinutesAndSeconds(song.track.duration_ms)}</p>
      </div>
    </div>
  );
}

export default Song;
