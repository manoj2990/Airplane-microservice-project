import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userDetails: [],
  loading: false,
  error: null,

};

const AuthSlice = createSlice({
  name: "Auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
        console.log("trigeer setuser --->",action.payload)
      state.userDetails = action.payload;
      localStorage.setItem("userId",action.payload.id);
     
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    logout: (state) => {
      state.userDetails = [];
      state.error = null;
      // Clear localStorage items
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
    },
  },
});

export const { setUser, setLoading, setError, logout } = AuthSlice.actions;

export default AuthSlice.reducer;
