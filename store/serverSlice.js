import { createSlice } from '@reduxjs/toolkit';

// Création du slice pour gérer l'état du serveur
const serverSlice = createSlice({
  name: 'server',
  initialState: {
    serverIP: '172.20.10.4', // Adresse IP par défaut du serveur
    port: '8000', // Port par défaut du serveur
  },
  reducers: {
    // Action pour définir l'adresse IP du serveur
    setServerIP: (state, action) => {
      state.serverIP = action.payload;
    },
    // Action pour définir le port du serveur
    setPort: (state, action) => {
      state.port = action.payload;
    },
  },
});

// Export des actions pour les utiliser dans les composants
export const { setServerIP, setPort } = serverSlice.actions;

// Export du reducer pour l'ajouter au store Redux
export default serverSlice.reducer;
