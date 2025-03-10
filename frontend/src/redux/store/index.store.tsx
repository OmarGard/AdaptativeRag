import { configureStore } from '@reduxjs/toolkit';
import chatReducer from '../slices/chat.slice';
import workflowReducer from '../slices/workflow.slice';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    workflow: workflowReducer
    // ...other slices if any
  }
});
