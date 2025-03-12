import { configureStore } from '@reduxjs/toolkit';
import chatReducer from '../slices/chat.slice';
import workflowReducer from '../slices/workflow.slice';
import websocketReducer from '../slices/websocket.slice';
import { websocketMiddleware } from '../../middlewares/websocketMiddleware';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    workflow: workflowReducer,
    websocket: websocketReducer
    // ...other slices if any
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(websocketMiddleware)
});
