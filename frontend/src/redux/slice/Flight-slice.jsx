
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  flights: [],
  loading: false,
  error: null,
};

const flightSlice = createSlice({
  name: "flight",
  initialState,
    reducers: {
    setFlights: (state, action) => {
      console.log("trigger flight slice-->",action.payload)
      state.flights = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { 
    setFlights, 
    setLoading, 
    setError } = flightSlice.actions;

export default flightSlice.reducer;