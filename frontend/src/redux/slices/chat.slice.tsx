// chatSlice.js
import { createSlice } from '@reduxjs/toolkit';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

interface ChatState {
  messages: Message[];
}

const initialState: ChatState = {
  messages: []  // each message: { role: 'user' | 'assistant', text: string }
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addUserMessage: (state, action) => {
      state.messages.push({ role: 'user', text: action.payload });
    },
    addAssistantMessage: (state, action) => {
      state.messages.push({ role: 'assistant', text: action.payload });
    },
    resetChat: (state) => {
      state.messages = [];
    }
  }
});

export const { addUserMessage, addAssistantMessage, resetChat } = chatSlice.actions;
export default chatSlice.reducer;
export type { Message, ChatState };
