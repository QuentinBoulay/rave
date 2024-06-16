import { createSlice } from '@reduxjs/toolkit';

const audioSlice = createSlice({
  name: 'audio',
  initialState: {
    recordings: [],
    selectedAudio: null,
    convertedAudios: [],
  },
  reducers: {
    addRecording: (state, action) => {
      console.log(action.payload)
      state.recordings = [...state.recordings, action.payload];
    },
    removeRecording: (state, action) => {
      state.recordings = state.recordings.filter(recording => recording.uri!== action.payload);
    },
    setSelectedAudio: (state, action) => {
      state.selectedAudio = action.payload;
    },
    addConvertedAudio: (state, action) => {
      state.convertedAudios.push(action.payload);
    },
    removeConvertedAudio: (state, action) => {
      state.convertedAudios = state.convertedAudios.filter(
        (audio) => audio.uri !== action.payload
      );
    },
  },
});

export const { addRecording, removeRecording, setSelectedAudio, addConvertedAudio, removeConvertedAudio } = audioSlice.actions;
export default audioSlice.reducer;
