// workflowSlice.js
import { createSlice } from '@reduxjs/toolkit';
interface WorkflowStage {
  key: string;
  label: string;
}
interface WorkflowStages {
  start: WorkflowStage;
  web_search: WorkflowStage ;
  retrieve: WorkflowStage;
  grade_documents: WorkflowStage;
  generate: WorkflowStage;
  transform_query: WorkflowStage;
  route_question: WorkflowStage;
  grade_generation_v_documents_and_question: WorkflowStage;
  decide_to_generate: WorkflowStage;
  end: WorkflowStage;
}

const workflowStages: WorkflowStages = {
  start: {
    label: "START",
    key: "start"
  },
  web_search: {
    label: "Web Search Stage",
    key: "web_search"
  },
  retrieve: {
    label: "Retrieve Stage",
    key: "retrieve"
  },
  grade_documents: {
    label: "Grade Documents Stage",
    key: "grade_documents"
  },
  generate: {
    label: "Generation Stage",
    key: "generate"
  },
  transform_query: {
    label: "Transform Query Stage",
    key: "transform_query"
  },
  route_question: {
    label: "Route Question Stage",
    key: "route_question"
  },
  grade_generation_v_documents_and_question: {
    label: "Verify Hallucinations Stage",
    key: "grade_generation_v_documents_and_question"
  },
  decide_to_generate: {
    label: "Decide to Generate or Transform Query Stage",
    key: "decide_to_generate"
  },
  end: {
    label: "END",
    key: "end"
  }
};

const resetInitialState = () => {
  return {
    currentStage: workflowStages.start.key,        // one of the stage keys or null when idle
    stages: Object.keys(workflowStages).reduce((acc: { [key: string]: { name: string, status: string } }, key) => {
        acc[key] = { name: key, status: 'pending' };
        return acc;
    }, {})
    // 'status' could be 'pending', 'active', or 'completed'
  }
};

const workflowSlice = createSlice({
  name: 'workflow',
  initialState: resetInitialState(),
  reducers: {
    updateWorkflowStage: (state, action) => {
      const newStage = action.payload;
      if(state.currentStage){
          state.stages[state.currentStage].status = 'completed';
      } 
      if(state.stages[newStage]){
        state.currentStage = newStage;
        state.stages[newStage].status = 'active';
        state.currentStage = newStage;
      }
    },
    resetWorkflow: (state) => {
      return resetInitialState();
    }
  }
});

export const { updateWorkflowStage, resetWorkflow } = workflowSlice.actions;
export { workflowStages }
export default workflowSlice.reducer;
