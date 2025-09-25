// store/store.js
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // uses localStorage

import authSliceReducer from  './Redux/Authentication/AuthenticationSlice'
import kidsReducer from './Redux/Kids/KidsSlice'
import sessionReducer from './Redux/Sessions/sessionsSlice'
import bookingReducer from  './Redux/bookingSlice/bookingSlice'

// Combine reducers
const rootReducer = combineReducers({
    auth : authSliceReducer,
    kids : kidsReducer,
    sessions :sessionReducer,
    bookings : bookingReducer
});

// Persist config
const persistConfig = {
  key: "root",
  storage,
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Required for redux-persist
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Create persistor
export const persistor = persistStore(store);

export default store;
