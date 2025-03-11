// WorkflowDiagram.jsx
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';  // make sure to import the default CSS
import { useSelector } from 'react-redux';
import { baseNodes, baseEdges} from './workflow.graph';

const WorkflowDiagram = () => {
  // Alternatively, get currentStage from Redux inside this component:
    const currentStage = useSelector((state: any) => state.workflow.currentStage);
    const stages = useSelector((state: any) => state.workflow.stages);

  // Update node colors based on stage
    const nodes = baseNodes.map(node => {
        let bgColor = '#37474f';  // default dark gray

        if(node.id && stages[node.id]?.status === 'active') {
            bgColor = '#ef6c00';    // highlight current stage (orange)
        } else if(node.id && stages[node.id]?.status === 'completed') {
            bgColor = '#2e7d32';    // completed stage (green)
        }

        return {
            ...node,
            id: node.id,
            data: { label: node.data?.label },
            style: { 
                background: bgColor, 
                color: '#fff', 
                border: node.id === currentStage ? '3px solid #FFF' : '1px solid #555' 
            }
        };
    });

    return (
        <ReactFlow nodes={nodes} edges={baseEdges} fitView>
            <Background color="#aaa" gap={16} />
            <Controls style={{ visibility: 'hidden' }} /> {/* hide default controls if not needed */}
        </ReactFlow>
    );
};

export default WorkflowDiagram;
