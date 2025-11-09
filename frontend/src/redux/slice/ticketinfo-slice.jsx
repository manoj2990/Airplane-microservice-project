

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ticketinfo: {},
  loading: false,
  error: null,
};

const TicketSlice = createSlice({
  name: "ticket",
  initialState,
  reducers: {
    setticketinfo: (state, action) => {
     
      state.ticketinfo = action.payload;
    },
  
   
    setticketLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setticketinfo,
 
  setticketLoading,
  setError,
} = TicketSlice.actions;

export default TicketSlice.reducer;
