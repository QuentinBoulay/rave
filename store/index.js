import { configureStore } from '@reduxjs/toolkit';
import audioReducer from './audioSlice';
import modelReducer from './modelSlice';

const store = configureStore({
  reducer: {
    audio: audioReducer,
    model: modelReducer,
  },
});

export default store;
