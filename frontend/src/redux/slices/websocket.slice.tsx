import { createSlice } from "@reduxjs/toolkit";

export const websocketSlice = createSlice({
  name: "websocket",
  initialState: {
    message: null,
    isConnected: false,
  },
  reducers: {
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    setConnected: (state, action) => {
      state.isConnected = action.payload;
    },
  },
});

export const { setMessage, setConnected } = websocketSlice.actions;
export default websocketSlice.reducer;
