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
      state.bookedSeats = action.payload;
    },
    setFrozenSeats: (state, action) => {
      console.log("Triggered setFrozenSeats slice -->", action.payload);
      state.frozenSeats = action.payload;
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
  setUserselectedseats,
  setLoading,
  setError,
} = bookingSlice.actions;

export default bookingSlice.reducer;
