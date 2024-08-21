import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authslice from "./AuthSlice";
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
  } from 'redux-persist'
  import storage from 'redux-persist/lib/storage'
  import { PersistGate } from 'redux-persist/integration/react'
import postSlice from "./postSlice.js";
import socketSlice from "./socketSlice";
import chatslice from "./chatslice";
import rtnSlice from "./rtnSlice";
  const persistConfig = {
    key: 'root',
    version: 1,
    storage,
  }
  const rootReducer=combineReducers({
    auth:authslice,
    post:postSlice,
    socketio:socketSlice,
    chat:chatslice,
    realTimeNotification:rtnSlice
  })
  const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store=configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
});
