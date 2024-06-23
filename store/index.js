import { configureStore } from '@reduxjs/toolkit';
import audioReducer from './audioSlice';
import modelReducer from './modelSlice';
import serverReducer from './serverSlice';

// Configuration du store Redux
const store = configureStore({
  reducer: {
    audio: audioReducer, // Associe le reducer audio
    model: modelReducer, // Associe le reducer model
    server: serverReducer, // Associe le reducer server
  },
});

export default store; // Exporte le store pour l'utiliser dans l'application
