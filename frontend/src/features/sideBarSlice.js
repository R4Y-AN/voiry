// playSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showSideBar: false,
};

export const sideBarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    sideBar: (state,action) => {
      state.showSideBar = action.payload;
    },
  },
});

export const { sideBar } = sideBarSlice.actions;
