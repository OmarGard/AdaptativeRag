// ChatInterface.jsx
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Paper } from '@mui/material';
import { updateWorkflowStage } from '../../redux/slices/workflow.slice';
import WorkflowDiagram from '../WorkflowDiagram/workflow.component';  // custom component
import { addUserMessage, addAssistantMessage } from '../../redux/slices/chat.slice';  // action creators from Redux slices
import Chat from './chat.component';  // custom component

const ChatInterface = () => {
  const dispatch = useDispatch();
  const wsMessage = useSelector((state: any) => state.websocket.message);
  const isConnected = useSelector((state: any) => state.websocket.isConnected);

  useEffect(() => {
    dispatch({ type: "websocket/connect" });

    return () => {
      dispatch({ type: "websocket/disconnect" });
    };
  }, [dispatch]);

  useEffect(() => {
    if (wsMessage) {
      console.log("New WebSocket Message:", wsMessage);
      let data = JSON.parse(wsMessage);

      if (data.type === 'update_status') {
        dispatch(updateWorkflowStage(data.message));  // update current stage in Redux
      } else if (data.type === 'generation') {
        dispatch(addAssistantMessage(data.message));  // append assistant's answer to chat
      } 
    }
  }, [wsMessage]); // Runs every time message changes


  const sendQuestion = (input: string) => {
      if (!input.trim()) return;
      let question = input.trim();
      // Update UI immediately with user message
      dispatch(addUserMessage(question));
      // Send question to backend via WebSocket
      dispatch({ type: "websocket/sendMessage", payload: JSON.stringify({ question }) });
  };
  
  return (
    <Paper elevation={3} sx={{ p: 2, m: 2, height: '80vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Chat interface */}
      <Chat parentSendQuestion={sendQuestion} />
      {/* React Flow diagram for workflow (could also be placed elsewhere in layout) */}
      <div style={{ height: 150, marginBottom: 8, background: '#212121', borderRadius: 8 }}>
        <WorkflowDiagram/>
      </div>

      
    </Paper>
  );
};

export default ChatInterface;
