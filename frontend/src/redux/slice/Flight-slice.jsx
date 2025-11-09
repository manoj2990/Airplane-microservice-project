
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  flights: [],
  loading: false,
  error: false,
  errorStatus: null, // Store HTTP status code for specific error handling (429, 404, 500, etc.)
  errorMessage: null, // Store error message for display
};

const flightSlice = createSlice({
  name: "flight",
  initialState,
    reducers: {
    setFlights: (state, action) => {
    
      state.flights = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload !== undefined ? action.payload : true;
      // Reset error status and message when clearing error
      if (!action.payload) {
        state.errorStatus = null;
        state.errorMessage = null;
      }
    },
    setErrorStatus: (state, action) => {
      state.errorStatus = action.payload?.status || action.payload;
      state.error = true;
      state.errorMessage = action.payload?.message || null;
    },
  },
});

export const { 
    setFlights, 
    setLoading, 
    setError,
    setErrorStatus } = flightSlice.actions;

export default flightSlice.reducer;