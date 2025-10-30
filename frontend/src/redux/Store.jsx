
import {combineReducers} from 'redux';
import { configureStore } from "@reduxjs/toolkit";
import flightReducer from './slice/Flight-slice';
import userSearchSlice from './slice/user-search'
import bookingReducer from './slice/booking-slice'
import authReducer from './slice/Authuser-slice'
import ticketReducer from './slice/ticketinfo-slice'


import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
};


const rootReducer = combineReducers({
  flight: flightReducer,
  userSearch: userSearchSlice,
  booking: bookingReducer,
  auth: authReducer,
  ticket: ticketReducer
});

const persistedReducer = persistReducer(persistConfig,  rootReducer);

export const store = configureStore({
  reducer: persistedReducer
});

export const persistor = persistStore(store);