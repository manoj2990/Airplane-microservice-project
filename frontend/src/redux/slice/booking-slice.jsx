import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  booking: {},
  bookedSeats: [],
  frozenSeats: [],
  UserselectedSeats: [],
  loading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setBooking: (state, action) => {
  
      state.booking = action.payload;
    },
    setBookedSeats: (state, action) => {
      const merged = [...state.bookedSeats, ...action.payload];
      const BookedSeats = [...new Set(merged)];

      state.bookedSeats = BookedSeats;
    },
    setFrozenSeats: (state, action) => {
      
      const merged = [...state.frozenSeats, ...action.payload];
      const uniqueSeats = [...new Set(merged)];

      state.frozenSeats = uniqueSeats;
    },

    setReleasedSeats: (state, action) => {
     
      const releasedSeats = action.payload; 
      state.frozenSeats = state.frozenSeats.filter(
        (s) => !releasedSeats.includes(s)
      );
    },

    setUserselectedseats: (state, action) => {
  
      state.selectedSeats = action.payload;
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
  setBooking,
  setBookedSeats,
  setFrozenSeats,
  setReleasedSeats,
  setUserselectedseats,
  setLoading,
  setError,
} = bookingSlice.actions;

export default bookingSlice.reducer;
