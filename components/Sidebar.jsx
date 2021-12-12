import React, { useEffect, useState } from "react";
import {
  HeartIcon,
  HomeIcon,
  LibraryIcon,
  PlusCircleIcon,
  RssIcon,
  SearchIcon,
} from "@heroicons/react/outline";
import { signOut, useSession } from "next-auth/react";
import useSpotify from "../hooks/useSpotify";
import spotifyApi from "../lib/spotify";
import { useRecoilState } from "recoil";
import { playlistIdState } from "../atoms/playlistAtom";

const Sidebar = () => {
  const spotifyApi = useSpotify();
  const [playlists, setPlaylists] = useState([]);

  //Playlist Id
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);

  //get user credentials
  const { data: session, status } = useSession();

  //log user
  console.log(session);

  useEffect(() => {
    //Check if token exists and get user playlists
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then(function (data) {
        setPlaylists(data.body.items);
      });
    }
  }, [session, spotifyApi]);

  return (
    <div className="text-gray-500 p-5 text-sm border-x-gray-900 overflow-y-scroll scrollbar-hide h-screen lg:text-sm sm:max-w-[12rem] lg:max-w-[15rem] hidden md:inline-flex pb-36">
      <div className="space-y-4">
        <button
          className="flex items-center space-x-2 hover:text-white"
          onClick={() => signOut()}
        >
          <p>LOGOUT</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <HomeIcon className="h-5 w-5"></HomeIcon>
          <p>Home</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <SearchIcon className="h-5 w-5"></SearchIcon>
          <p>Search</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <LibraryIcon className="h-5 w-5"></LibraryIcon>
          <p>Your Library</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-900" />

        {/* ------------------------------------------------------------------- */}

        <button className="flex items-center space-x-2 hover:text-white">
          <PlusCircleIcon className="h-5 w-5"></PlusCircleIcon>
          <p>Create Playlist</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <HeartIcon className="h-5 w-5"></HeartIcon>
          <p>Liked Songs</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <RssIcon className="h-5 w-5"></RssIcon>
          <p>Your Episodes</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-900" />

        {/* Playlists */}
        {playlists.map(function (playlist) {
          return (
            <p
              key={playlist.id}
              className="cursor-pointer hover:text-white"
              onClick={() => {
                setPlaylistId(playlist.id);
                console.log("playlis id : ", playlist.id);
              }}
            >
              {playlist.name}
            </p>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
