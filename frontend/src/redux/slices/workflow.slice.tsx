// workflowSlice.js
import { createSlice } from '@reduxjs/toolkit';
interface WorkflowStage {
  label: string;
}
interface WorkflowStages {
  web_search: WorkflowStage | null;
  retrieve: WorkflowStage | null;
  grade_documents: WorkflowStage | null;
  generate: WorkflowStage | null;
  transform_query: WorkflowStage | null;
  route_question: WorkflowStage | null;
  grade_generation_v_documents_and_question: WorkflowStage | null;
  decide_to_generate: WorkflowStage | null;
}

const workflowStages: WorkflowStages = {
  web_search: {
    label: "Web Search Stage"
  },
  retrieve: {
    label: "Retrieve Stage"
  },
  grade_documents: {
    label: "Grade Documents Stage"
  },
  generate: {
    label: "Generation Stage"
  },
  transform_query: {
    label: "Transform Query Stage"
  },
  route_question: {
    label: "Route Question Stage"
  },
  grade_generation_v_documents_and_question: {
    label: "Verify Hallucinations Stage"
  },
  decide_to_generate: {
    label: "Decide to Generate or Transform Query Stage"
  }
};

const workflowSlice = createSlice({
  name: 'workflow',
  initialState: {
    currentStage: null,        // one of the stage keys or null when idle
    stages: Object.keys(workflowStages).reduce((acc: { [key: string]: { name: string, status: string } }, key) => {
        acc[key] = { name: key, status: 'pending' };
        return acc;
    }, {})
    // 'status' could be 'pending', 'active', or 'completed'
  },
  reducers: {
    updateWorkflowStage: (state, action) => {
      const newStage = action.payload;
      if(state.currentStage){
          state.stages[state.currentStage].status = 'completed';
      } 
      state.currentStage = newStage;
      state.stages[newStage].status = 'active';
      state.currentStage = newStage;
      // Update statuses: mark all stages up to newStage as completed, and newStage as active
      
    },
    resetWorkflow: (state) => {
      state.currentStage = null;
      state.stages = Object.keys(workflowStages).reduce((acc: { [key: string]: { name: string, status: string } }, key) => {
        acc[key] = { name: key, status: 'pending' };
        return acc;
    }, {})
    }
  }
});

export const { updateWorkflowStage, resetWorkflow } = workflowSlice.actions;
export default workflowSlice.reducer;
