import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProductState {
  selectedFile: File | null;
  previewUrl: string | null;
  description: string | null;
  searchQuery: string | null;
  loading: boolean;
  visibleCount: number;
}

const initialState: ProductState = {
  selectedFile: null,
  previewUrl: null,
  description: null,
  searchQuery: null,
  loading: false,
  visibleCount: 5,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setSelectedFile(state, action: PayloadAction<File | null>) {
      state.selectedFile = action.payload;
    },
    setPreviewUrl(state, action: PayloadAction<string | null>) {
      state.previewUrl = action.payload;
    },
    setDescription(state, action: PayloadAction<string | null>) {
      state.description = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string | null>) {
      state.searchQuery = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    incrementVisibleCount(state, action: PayloadAction<number | undefined>) {
      const inc = action.payload ?? 5;
      state.visibleCount = Math.min(state.visibleCount + inc, 100);
    },
    resetProductState() {
      return initialState;
    },
  },
});

export const {
  setSelectedFile,
  setPreviewUrl,
  setDescription,
  setSearchQuery,
  setLoading,
  incrementVisibleCount,
  resetProductState,
} = productSlice.actions;

export default productSlice.reducer;
