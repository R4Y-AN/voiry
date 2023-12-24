import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isLoading: true,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser: (state, action) => {
      state.user = action.payload;
    },
    logoutUser: (state) => {
      state.user = null;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setSavedAudios:(state,action)=>{
      if(state.user){
        state.user.savedAudios = action.payload;
      }
    }
  },
});

export const { loginUser, logoutUser, setLoading,setSavedAudios } = userSlice.actions;