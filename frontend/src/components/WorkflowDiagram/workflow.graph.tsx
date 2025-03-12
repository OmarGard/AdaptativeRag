import {workflowStages} from '../../redux/slices/workflow.slice';
import { MarkerType } from '@xyflow/react';
import { type Node, type Edge, Position } from '@xyflow/react';
import { CSSProperties } from 'react';
const defaultNodesStyle: CSSProperties = {
  fontSize: '16px'  // increase font size
}
const baseNodes: Node[] = [
    { 
      id: workflowStages.start.key, 
      position: { x: 500, y: 0 }, 
      data: { label: workflowStages.start.label },
      style: {
        ...defaultNodesStyle
      }
    },
    { 
      id: workflowStages.web_search.key, 
      position: { x: 250, y: 250 }, 
      data: { label: workflowStages.web_search.label },
      style: {
        ...defaultNodesStyle
      }
    },
    { 
      id: workflowStages.generate.key, 
      position: { x: 250, y: 500 }, 
      data: { label: workflowStages.generate.label },
      style: {
        ...defaultNodesStyle
      }
    },
    { 
      id: workflowStages.transform_query.key, 
      position: { x: 1000, y: 750 }, 
      data: { label: workflowStages.transform_query.label },
      style: {
        ...defaultNodesStyle
      } 
    },
    { 
      id: workflowStages.retrieve.key, 
      position: { x: 1000, y: 1000 }, 
      data: { label: workflowStages.retrieve.label } 
    },
    { 
      id: workflowStages.grade_documents.key, 
      position: { x: 500, y: 1250 }, 
      data: { label: workflowStages.grade_documents.label },
      style: {
        ...defaultNodesStyle
      },
      sourcePosition: Position.Bottom,
    },
    { 
      id: workflowStages.end.key, 
      position: { x: 200, y: 750 }, 
      data: { label: workflowStages.end.label },
      style: {
        ...defaultNodesStyle
      }
    }
  ];

  const edgesDefaultStyle: CSSProperties = {
    strokeWidth: 3,
  };

  const baseEdges: Edge[] = [
    { id: 'e1', 
      source: workflowStages.start.key, 
      target: workflowStages.web_search.key, 
      animated: false, 
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 10,
      },
      style: {
        ...edgesDefaultStyle
      }
    },
    { id: 'e2', 
      source: workflowStages.start.key, 
      target: workflowStages.retrieve.key, 
      animated: false,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
      style: {
        ...edgesDefaultStyle
      }
    },
    { id: 'e3', 
      source: workflowStages.web_search.key, 
      target: workflowStages.generate.key, 
      animated: false,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
      style: {
        ...edgesDefaultStyle
      }
    },
    { id: 'e4', 
      source: workflowStages.generate.key, 
      target: workflowStages.end.key, 
      animated: false,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
      style: {
        ...edgesDefaultStyle
      }
    },
    { id: 'e5', 
      source: workflowStages.generate.key, 
      target: workflowStages.transform_query.key, 
      animated: false,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
      style: {
        ...edgesDefaultStyle
      }
    },
    { id: 'e6', 
      source: workflowStages.transform_query.key, 
      target: workflowStages.retrieve.key, 
      animated: false,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
      style: {
        ...edgesDefaultStyle
      }
    },
    { id: 'e7', 
      source: workflowStages.retrieve.key, 
      target: workflowStages.grade_documents.key, 
      animated: false,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      }
    },
    { id: 'e8', 
      source: workflowStages.grade_documents.key, 
      target: workflowStages.generate.key, 
      animated: false,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      }
    },
    { id: 'e9', 
      source: workflowStages.generate.key, 
      target: workflowStages.generate.key, 
      animated: false,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      }
    },
    { id: 'e10', 
      source: workflowStages.grade_documents.key, 
      target: workflowStages.transform_query.key, 
      animated: false,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
      style: {
        ...edgesDefaultStyle
      }
    },
  ];

export {baseNodes, baseEdges};
