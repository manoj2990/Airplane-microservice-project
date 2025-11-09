

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userSearch: null,
  loading: false,
  error: null,
};

const userSearchSlice = createSlice({
  name: "userSearchSlice",
  initialState,
    reducers: {
    setuserSearch: (state, action) => {
     
      state.userSearch = action.payload;
    },

  },
});

export const { 
    setuserSearch} = userSearchSlice.actions;

export default userSearchSlice.reducer;