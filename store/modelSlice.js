import { createSlice } from '@reduxjs/toolkit';

const modelSlice = createSlice({
  name: 'model',
  initialState: {
    models: [],
    selectedModel: null,
  },
  reducers: {
    setModels: (state, action) => {
      state.models = action.payload;
    },
    setSelectedModel: (state, action) => {
      state.selectedModel = action.payload;
    },
  },
});

export const { setModels, setSelectedModel } = modelSlice.actions;
export default modelSlice.reducer;
