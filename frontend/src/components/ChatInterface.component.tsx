// ChatInterface.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TextField, IconButton, List, ListItem, ListItemAvatar, Avatar, ListItemText, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ReactFlow from 'reactflow';  // assuming reactflow is installed and CSS imported
import { addUserMessage, addAssistantMessage } from '../redux/slices/chat.slice';  // action creators from Redux slices
import { Message } from '../redux/slices/chat.slice';  // action creators from Redux slices
import { updateWorkflowStage } from '../redux/slices/workflow.slice';
import WorkflowDiagram from './WorkflowDiagram/workflow.component';  // custom component

const ChatInterface = () => {
  const dispatch = useDispatch();
  const messages = useSelector((state: any) => state.chat.messages);
  const currentStage = useSelector((state: any) => state.workflow.currentStage);
  const [input, setInput] = useState('');
  const ws = useRef<WebSocket | null>(null);

  // Connect to WebSocket on component mount
  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8000/ws');
    ws.current.onopen = () => console.log('WebSocket connection established');
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'update_status') {
        dispatch(updateWorkflowStage(data.message));  // update current stage in Redux
      } else if (data.type === 'generation') {
        dispatch(addAssistantMessage(data.message));  // append assistant's answer to chat
      } 
      // (Optional) handle partial answer chunks or other message types
    };
    ws.current.onclose = () => console.log('WebSocket connection closed');
    return () => {
      ws.current?.close();
    };
  }, [dispatch]);

  const sendQuestion = () => {
    if (!input.trim()) return;
    const question = input.trim();
    // Update UI immediately with user message
    dispatch(addUserMessage(question));
    // Send question to backend via WebSocket
    ws.current?.send(JSON.stringify({ question }));
    setInput('');
  };

  return (
    <Paper elevation={3} sx={{ p: 2, m: 2, height: '80vh', display: 'flex', flexDirection: 'column' }}>
      {/* Messages List */}
      <List sx={{ flexGrow: 1, overflowY: 'auto', mb: 1 }}>
        {messages.map((msg: Message, idx: number) => (
          <ListItem key={idx} alignItems="flex-start" 
                    sx={{ justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            {/* Avatar/Icon */}
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: msg.role === 'user' ? 'primary.main' : 'secondary.main' }}>
                {msg.role === 'user' ? '👩' : '🤖'}
              </Avatar>
            </ListItemAvatar>
            {/* Message Text */}
            <ListItemText 
              primary={msg.text} 
              primaryTypographyProps={{ 
                align: msg.role === 'user' ? 'right' : 'left',
                color: msg.role === 'user' ? 'text.primary' : 'secon</Avatar>dary.light'
              }} 
            />
          </ListItem>
        ))}
      </List>

      {/* React Flow diagram for workflow (could also be placed elsewhere in layout) */}
      <div style={{ height: 150, marginBottom: 8, background: '#212121', borderRadius: 8 }}>
        <WorkflowDiagram/>
      </div>

      {/* Input Field and Send Button */}
      <div style={{ display: 'flex' }}>
        <TextField 
          fullWidth 
          variant="outlined" 
          placeholder="Ask a question..." 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          onKeyDown={(e) => { if(e.key === 'Enter') sendQuestion(); }} 
        />
        <IconButton color="primary" onClick={sendQuestion} sx={{ ml: 1 }}>
          <SendIcon />
        </IconButton>
      </div>
    </Paper>
  );
};

export default ChatInterface;
