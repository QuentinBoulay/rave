import { createSlice } from '@reduxjs/toolkit';

const modelSlice = createSlice({
  name: 'model',
  initialState: {
    models: [],
    selectedModel: '',
  },
  reducers: {
    setModels: (state, action) => {
      state.models = action.payload;
    },
    setSelectedModel: (state, action) => {
      console.log(action.payload)
      state.selectedModel = action.payload;
      console.log(state.selectedModel)
    },
  },
});

export const { setModels, setSelectedModel } = modelSlice.actions;
export default modelSlice.reducer;
