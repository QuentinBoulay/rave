import { createSlice } from '@reduxjs/toolkit';

// Création du slice pour gérer l'état des modèles
const modelSlice = createSlice({
  name: 'model',
  initialState: {
    models: [], // Liste des modèles disponibles
    selectedModel: '', // Modèle sélectionné
  },
  reducers: {
    // Action pour définir la liste des modèles
    setModels: (state, action) => {
      state.models = action.payload;
    },
    // Action pour définir le modèle sélectionné
    setSelectedModel: (state, action) => {
      state.selectedModel = action.payload;
    },
  },
});

// Export des actions pour les utiliser dans les composants
export const { setModels, setSelectedModel } = modelSlice.actions;

// Export du reducer pour l'ajouter au store Redux
export default modelSlice.reducer;
