import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  // Example future UI flags
  settingsOpen: boolean;
  cameraActive: boolean; // added
}

const initialState: UIState = {
  settingsOpen: false,
  cameraActive: false, // added
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setSettingsOpen(state, action: PayloadAction<boolean>) {
      state.settingsOpen = action.payload;
    },
    setCameraActive(state, action: PayloadAction<boolean>) { // added
      state.cameraActive = action.payload;
    },
  },
});

export const { setSettingsOpen, setCameraActive } = uiSlice.actions;
export default uiSlice.reducer;
