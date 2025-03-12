import '@xyflow/react/dist/style.css';
import { useSelector } from 'react-redux';
import { baseNodes, baseEdges} from './workflow.graph';
import { useEffect, useCallback, useState } from 'react';
import { ReactFlow, type ColorMode, Background, Controls } from '@xyflow/react';

const WorkflowDiagram = () => {
    // Alternatively, get currentStage from Redux inside this component:
    const currentStage = useSelector((state: any) => state.workflow.currentStage);
    const stages = useSelector((state: any) => state.workflow.stages);
    const [colorMode, setColorMode] = useState<ColorMode>('dark');
    
    const updateNode = useCallback((node: any) => {
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
                ...node.style,
                background: bgColor, 
                border: node.id === currentStage ? '3px solid #FFF' : '1px solid #555',
            }
        };
    }, [currentStage, stages]);

    useEffect(() => {
        if (currentStage === 'start') {
            baseNodes.forEach(node => updateNode(node));
        }
    }, [currentStage, updateNode]);

    // Update node colors based on stage
    const nodes = baseNodes.map(node => updateNode(node));

    return (
        <ReactFlow nodes={nodes} edges={baseEdges} fitView colorMode={colorMode} minZoom={0.1}>
            <Background color="#aaa" gap={16} />
            <Controls style={{ visibility: 'hidden' }} /> hide default controls if not needed
        </ReactFlow>
    );
};

export default WorkflowDiagram;
