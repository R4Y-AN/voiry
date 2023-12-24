// playSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentAudioId: null,
  currentAudioPlaying: null,
};

export const playSlice = createSlice({
  name: "audio",
  initialState,
  reducers: {
    playAudio: (state, action) => {
      const { id,audioPlayer } = action.payload;
      state.currentAudioPlaying = id === state.currentAudioId ? null : audioPlayer;
      state.currentAudioId = id === state.currentAudioId ? null : id;
    },
  },
});

export const { playAudio } = playSlice.actions;
