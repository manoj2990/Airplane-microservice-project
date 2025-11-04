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
      console.log("Triggered setBooking slice -->", action.payload);
      state.booking = action.payload;
    },
    setBookedSeats: (state, action) => {
      console.log("Triggered setBookedSeats slice -->", action.payload);
      const merged = [...state.bookedSeats, ...action.payload];
      const BookedSeats = [...new Set(merged)];

      state.bookedSeats = BookedSeats;
      console.log("my setBookedSeats seat --->",state.bookedSeats)
    },
    setFrozenSeats: (state, action) => {
      console.log("Triggered setFrozenSeats slice -->", action.payload);
      const merged = [...state.frozenSeats, ...action.payload];
      const uniqueSeats = [...new Set(merged)];

      state.frozenSeats = uniqueSeats;
      console.log("my freez seat --->",state.frozenSeats)
    },

    setReleasedSeats: (state, action) => {
      console.log("Triggered setReleasedSeats slice -->", action.payload);
      const releasedSeats = action.payload; 
      state.frozenSeats = state.frozenSeats.filter(
        (s) => !releasedSeats.includes(s)
      );
    },

    setUserselectedseats: (state, action) => {
        console.log("Triggered setUserselectedseats slice -->", action.payload);
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
