import { ChevronDownIcon } from "@heroicons/react/outline";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { shuffle } from "lodash";
import { useRecoilState, useRecoilValue } from "recoil";
import { playlistState, playlistIdState } from "../atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";
import Songs from "./Songs";

const Center = () => {
  const { data: session } = useSession();
  const colors = [
    "from-indigo-500",
    "from-blue-500",
    "from-green-500",
    "from-yellow-500",
    "from-pink-500",
    "from-purple-500",
    "from-red-500",
    "from-cyan-500",
    "from-orange-500",
    "from-gray-500",
  ];
  const [color, setColor] = useState(null);

  //Playlist Id
  //const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);
  //we use useRecoilValue to get a read only value because in an array the user can change it accidentally
  const playlistId = useRecoilValue(playlistIdState);

  const [playlist, setPlaylist] = useRecoilState(playlistState);

  const spotifyApi = useSpotify();

  useEffect(() => {
    //change colors array order
    setColor(shuffle(colors).pop());
  }, [playlistId]);

  useEffect(() => {
    spotifyApi
      .getPlaylist(playlistId)
      .then(function (data) {
        setPlaylist(data.body);
      })
      .catch(function (err) {
        console.log(err);
      });
  }, [spotifyApi, playlistId]);
  console.log("Playlist : ", playlist);
  return (
    <div className="flex-grow text-white h-screen overflow-y-scroll scrollbar-hide">
      <header className="absolute top-5 right-8 ">
        <div className="flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2">
          <img
            src="https://lh3.googleusercontent.com/a-/AOh14GgoXFgtdWDuIRUqizulPO_JWsdQA5-OZBpuSatg=s288-p-no"
            alt={session?.user.image}
            className="rounded-full w-10 h-10"
          />
          <h2>{session?.user?.name}</h2>
          <ChevronDownIcon className="h-5 w-5"></ChevronDownIcon>
        </div>
      </header>
      <section
        className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 p-8`}
      >
        <img
          src={playlist?.images?.[0].url}
          alt=""
          className="h-44 w-44 shadow-2xl"
        />
        <div className="">
          <p>PLAYLIST</p>
          <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">
            {playlist?.name}
          </h1>
        </div>
      </section>
      <div className="">
        <Songs />
      </div>
    </div>
  );
};

export default Center;
