// ChatInterface.jsx
import './adaptativeRag.styles.css';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateWorkflowStage , resetWorkflow, workflowStages } from '../../redux/slices/workflow.slice';
import WorkflowDiagram from '../WorkflowDiagram/workflow.component';  // custom component
import { addUserMessage, addAssistantMessage } from '../../redux/slices/chat.slice';  // action creators from Redux slices
import Chat from '../Chat/chat.component';  // custom component

const AdaptativeRag = () => {
  const dispatch = useDispatch();
  const wsMessage = useSelector((state: any) => state.websocket.message);

  useEffect(() => {
    dispatch({ type: "websocket/connect" });
    return () => {
      dispatch({ type: "websocket/disconnect" });
    };
  }, [dispatch]);

  useEffect(() => {
    if (wsMessage) {
      let data = JSON.parse(wsMessage);

      if (data.type === 'update_status') {
        dispatch(updateWorkflowStage(data.message));  // update current stage in Redux
      } else if (data.type === 'generation') {
        dispatch(updateWorkflowStage(workflowStages.end.key));
        dispatch(updateWorkflowStage('noKey'));
        dispatch(addAssistantMessage(data.message));  // append assistant's answer to chat
      } 
    }
  }, [wsMessage, dispatch]); // Runs every time message changes


  const sendQuestion = (input: string) => {
      if (!input.trim()) return;
      dispatch(resetWorkflow())
      let question = input.trim();
      // Update UI immediately with user message
      dispatch(addUserMessage(question));
      // Send question to backend via WebSocket
      dispatch({ type: "websocket/sendMessage", payload: JSON.stringify({ question }) });      
  };

  return (
    <div className="adaptative-rag">
      <div className="workflow-rag">
        <WorkflowDiagram />
      </div>
      <div className="chat-rag">
        <Chat parentSendQuestion={sendQuestion} />
      </div>
    </div>
    
  );
};

export default AdaptativeRag;
