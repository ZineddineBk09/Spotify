import {
  HeartIcon,
  VolumeUpIcon as VolumeDownIcon,
} from "@heroicons/react/outline";
import {
  RewindIcon,
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  ReplyIcon,
  VolumeUpIcon,
  SwitchHorizontalIcon,
} from "@heroicons/react/solid";
import { debounce } from "lodash";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSongInfo from "../hooks/useSongInfo";
import useSpotify from "../hooks/useSpotify";

function Player() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(50);

  //custom Hook
  const songInfo = useSongInfo();
  console.log("songInfo : ", songInfo);

  const fetchCurrentSong = function () {
    if (!songInfo) {
      //if user didn't select song we use the last one played for 'songInfo'
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        console.log("Now Playing : ", data?.body?.item);

        setCurrentTrackId(data?.body?.item?.id);

        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(data?.body.is_playing);
        });
      });
    }
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackIdState) {
      //fetch the song info
      fetchCurrentSong();
      //set volume to 50 each time we change song
      setVolume(50);
    }
  }, [spotifyApi, session, currentTrackIdState]);

  //this use effect is just for extra security when the user change the volume
  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncedAdjustVolume();
    }
  }, [volume]);

  const debouncedAdjustVolume = useCallback(function () {
    
    //make the spotifyApi wait 500ms after we change the volume so that we don't let the user spam the API and make it expired
    
    debounce(function (volume) {
      spotifyApi.setVolume(volume).catch(function (err) {
        console.log(err);
      });
    }, 500);
  });

  const handlePlaying = function () {
    spotifyApi.getMyCurrentPlaybackState().then(function (data) {
      if (data.body.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false);
      } else {
        spotifyApi.play();
        setIsPlaying(true);
      }
    });
  };

  return (
    <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
      {/* Left */}
      <div className="flex items-center space-x-4">
        <img
          src={songInfo?.album.images?.[0]?.url}
          alt=""
          className="hidden md:inline h-10 w-10"
        />
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0]}</p>
        </div>
      </div>
      <div className="flex items-center justify-evenly">
        <SwitchHorizontalIcon className="button" />
        <RewindIcon className="button" />
        {isPlaying ? (
          <PauseIcon className="button w-10 h-10" onClick={handlePlaying} />
        ) : (
          <PlayIcon className="button w-10 h-10" onClick={handlePlaying} />
        )}
        <FastForwardIcon className="button" />
        <ReplyIcon className="button" />
      </div>
      {/* Right */}
      <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
        <VolumeDownIcon
          className="button"
          onClick={() => volume > 0 && setVolume(volume - 10)}
        />
        <input
          type="range"
          value={volume}
          min={0}
          max={100}
          className="w-14 md:w-28"
          onChange={function (e) {
            setVolume(Number(e.target.value));
          }}
        />
        <VolumeUpIcon
          className="button"
          onClick={() => volume < 100 && setVolume(volume + 10)}
        />
      </div>
    </div>
  );
}

export default Player;
