import { combineReducers } from "redux";
import { userSlice } from "../features/userSlice";
import { playSlice } from "../features/playSlice";
import { sideBarSlice } from "../features/sideBarSlice";

export const rootReducer = combineReducers({
  user: userSlice.reducer,
  audio: playSlice.reducer,
  sideBar: sideBarSlice.reducer,
});