import { atom } from "recoil";

export const playlistIdState = atom({
  key: "playlistIdState",
  //the below ID is constant
  default: "4LnTQT9pZuyXG96WS9RNzU",
});

export const playlistState = atom({
  key: "playlistState",
  //the below ID is constant
  default: null,
});
