import { createSlice } from '@reduxjs/toolkit';

// Création du slice pour gérer l'état des audios
const audioSlice = createSlice({
  name: 'audio',
  initialState: {
    recordings: [], // Liste des enregistrements
    selectedAudio: null, // Audio sélectionné
    convertedAudios: [], // Liste des audios convertis
  },
  reducers: {
    // Ajoute un enregistrement à la liste
    addRecording: (state, action) => {
      state.recordings = [...state.recordings, action.payload];
    },
    // Supprime un enregistrement de la liste
    removeRecording: (state, action) => {
      state.recordings = state.recordings.filter(recording => recording.uri !== action.payload);
    },
    // Définit l'audio sélectionné
    setSelectedAudio: (state, action) => {
      state.selectedAudio = action.payload;
    },
    // Ajoute un audio converti à la liste
    addConvertedAudio: (state, action) => {
      state.convertedAudios = [...state.convertedAudios, action.payload];
    },
    // Supprime un audio converti de la liste
    removeConvertedAudio: (state, action) => {
      state.convertedAudios = state.convertedAudios.filter(
        (audio) => audio !== action.payload
      );
    },
  },
});

// Export des actions pour les utiliser dans les composants
export const { addRecording, removeRecording, setSelectedAudio, addConvertedAudio, removeConvertedAudio } = audioSlice.actions;

// Export du reducer pour l'ajouter au store Redux
export default audioSlice.reducer;
