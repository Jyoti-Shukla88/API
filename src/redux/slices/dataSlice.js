// src/redux/slices/dataSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  version: null,
  data: null,
  loading: false,
  error: null,
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    FETCH_DATA_REQUEST: (state) => {
      state.loading = true;
      state.error = null;
    },
    FETCH_DATA_SUCCESS: (state, action) => {
      state.loading = false;
      state.data = action.payload.data;
      state.version = action.payload.version;
      state.error = null;
    },
    FETCH_DATA_FAILURE: (state, action) => {
      state.loading = false;
      state.error = action.payload.error;
    },
  },
});

export const { FETCH_DATA_REQUEST, 
  FETCH_DATA_SUCCESS, 
  FETCH_DATA_FAILURE 
} = dataSlice.actions;
export default dataSlice.reducer;
