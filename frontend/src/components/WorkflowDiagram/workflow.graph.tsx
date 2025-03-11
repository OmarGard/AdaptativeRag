import {workflowStages} from '../../redux/slices/workflow.slice';


const baseNodes = [
    { id: workflowStages.start.key, position: { x: 500, y: 0 }, data: { label: workflowStages.start.label } },
    { id: workflowStages.web_search.key, position: { x: 250, y: 250 }, data: { label: workflowStages.web_search.label } },
    { id: workflowStages.generate.key, position: { x: 250, y: 500 }, data: { label: workflowStages.generate.label } },
    { id: workflowStages.transform_query.key, position: { x: 1000, y: 750 }, data: { label: workflowStages.transform_query.label } },
    { id: workflowStages.retrieve.key, position: { x: 1000, y: 1000 }, data: { label: workflowStages.retrieve.label } },
    { id: workflowStages.grade_documents.key, position: { x: 500, y: 1250 }, data: { label: workflowStages.grade_documents.label } },
    { id: workflowStages.end.key, position: { x: 200, y: 750 }, data: { label: workflowStages.end.label } }
  ];
  const baseEdges = [
    { id: 'e1', source: workflowStages.start.key, target: workflowStages.web_search.key, animated: false },
    { id: 'e2', source: workflowStages.start.key, target: workflowStages.retrieve.key, animated: false },
    { id: 'e3', source: workflowStages.web_search.key, target: workflowStages.generate.key, animated: false },
    { id: 'e4', source: workflowStages.generate.key, target: workflowStages.end.key, animated: false },
    { id: 'e5', source: workflowStages.generate.key, target: workflowStages.transform_query.key, animated: false },
    { id: 'e6', source: workflowStages.transform_query.key, target: workflowStages.retrieve.key, animated: false },
    { id: 'e7', source: workflowStages.retrieve.key, target: workflowStages.grade_documents.key, animated: false },
    { id: 'e8', source: workflowStages.grade_documents.key, target: workflowStages.generate.key, animated: false },
    { id: 'e9', source: workflowStages.generate.key, target: workflowStages.generate.key, animated: false },
    { id: 'e10', source: workflowStages.grade_documents.key, target: workflowStages.transform_query.key, animated: false },
  ];

export {baseNodes, baseEdges};
