/**
 * UI Slice
 * Manages UI state like modals
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  celebrationsModalOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openCelebrationsModal: (state) => {
      state.celebrationsModalOpen = true;
    },
    closeCelebrationsModal: (state) => {
      state.celebrationsModalOpen = false;
    },
  },
});

export const { openCelebrationsModal, closeCelebrationsModal } = uiSlice.actions;
export default uiSlice.reducer;
