import React from "react";
import { useRecoilValue } from "recoil";
import { playlistState } from "../atoms/playlistAtom";
import Song from "./Song";

function Songs() {
  const playlist = useRecoilValue(playlistState);
  return (
    <div className="px-8 flex flex-col space-y-1 pb-28 text-gray-500">
      {playlist?.tracks.items.map(function (song, i) {
        return <Song key={song.track.id} song={song} order={i} />;
      })}
    </div>
  );
}

export default Songs;
