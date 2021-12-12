import { atom } from "recoil";

export const currentTrackIdState = atom({
  key: "currentTrackIdState",
  //the below ID is constant
  default: null,
});

export const isPlayingState = atom({
  key: "isPlayingState",
  //the below ID is constant
  default: false,
});

//we need those two to control the songs while playing and add the play song functionality
