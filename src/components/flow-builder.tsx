'use client';

// This is the main component for the flow builder.
// It uses React Flow for the canvas and manages the state of nodes and edges.
import React, { useRef, useCallback, useMemo } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  Connection,
  Edge,
  Node,
  useReactFlow,
  applyNodeChanges,
  NodeChange,
} from 'reactflow';
// Import React Flow's stylesheet for default styling.
import 'reactflow/dist/style.css';

import { Header } from './header';
import { Sidebar } from './sidebar';
import { TextNode } from './nodes/text-node';
import { useToast } from '@/hooks/use-toast';

// Initial node to start with.
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'textNode',
    data: { label: 'Start Flow Here' },
    position: { x: 250, y: 150 },
  },
];

// Helper to generate unique IDs for new nodes.
let id = 2;
const getId = () => `${id++}`;

// The core logic of the flow builder is wrapped in this component.
// It's separate to be able to use the useReactFlow hook, which requires a ReactFlowProvider context.
function FlowBuilderInternal() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition, getEdges } = useReactFlow();
  const { toast } = useToast();

  // Defines the custom node types available in the flow builder.
  const nodeTypes = useMemo(() => ({ textNode: TextNode }), []);

  // Finds the currently selected node to pass to the settings panel.
  const selectedNode = useMemo(() => nodes.find((node) => node.selected), [nodes]);

  // Handles node changes from React Flow, including selection.
  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      onNodesChange(changes);
      // Manually find selection change to ensure the latest state is captured.
      const selectionChange = changes.find((change) => change.type === 'select');
      if (selectionChange) {
        setNodes((currentNodes) => applyNodeChanges(changes, currentNodes));
      }
    },
    [onNodesChange, setNodes]
  );

  // Handles new connections between nodes.
  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );
  
  // Prevents connecting a source handle that already has an outgoing edge.
  const isValidConnection = useCallback(
    (connection: Connection) => {
      const allEdges = getEdges();
      const sourceHasEdge = allEdges.some(
        (edge) => edge.source === connection.source && edge.sourceHandle === connection.sourceHandle
      );
      return !sourceHasEdge;
    },
    [getEdges]
  );

  // Allows dropping elements onto the canvas.
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handles dropping a new node from the panel onto the canvas.
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current) {
        return;
      }

      const type = event.dataTransfer.getData('application/reactflow');

      // Check if the dropped element is a valid node type.
      if (typeof type === 'undefined' || !type) {
        return;
      }
      
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: getId(),
        type,
        position,
        data: { label: `Text message` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes]
  );
  
  // Updates the label of the currently selected node.
  const updateNodeLabel = useCallback(
    (label: string) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === selectedNode?.id) {
            return {
              ...node,
              data: { ...node.data, label },
            };
          }
          return node;
        })
      );
    },
    [selectedNode, setNodes]
  );

  // Deselects all nodes, used for the back button in settings.
  const deselectNode = useCallback(() => {
    setNodes((nds) => nds.map((n) => ({ ...n, selected: false })));
  }, [setNodes]);

  // Validates and "saves" the flow.
  const onSave = useCallback(() => {
    // If there's only one node or fewer, no need to check connections.
    if (nodes.length <= 1) {
      toast({ title: 'Flow Saved!', description: 'Your flow has been saved successfully.' });
      return;
    }

    // Find all nodes that are targets of an edge.
    const targetNodeIds = new Set(edges.map((edge) => edge.target));
    // Filter for nodes that are not a target of any edge.
    const nodesWithoutTarget = nodes.filter((node) => !targetNodeIds.has(node.id));

    // If more than one node has an empty target handle, show an error.
    if (nodesWithoutTarget.length > 1) {
      toast({
        variant: 'destructive',
        title: 'Error: Unconnected Nodes',
        description: 'More than one node has an empty target. Please connect all nodes.',
      });
    } else {
      toast({
        title: 'Flow Saved!',
        description: 'Your flow has been saved successfully.',
      });
      console.log('Flow is valid:', { nodes, edges });
    }
  }, [nodes, edges, toast]);

  return (
    <div className="flex flex-col h-screen w-screen bg-background">
      <Header onSave={onSave} />
      <div className="flex flex-grow h-full">
        <div className="flex-grow h-full" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={handleNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onDragOver={onDragOver}
            onDrop={onDrop}
            isValidConnection={isValidConnection}
            fitView
          >
            <Controls />
            <MiniMap />
            <Background gap={16} />
          </ReactFlow>
        </div>
        <Sidebar
          selectedNode={selectedNode}
          updateNodeLabel={updateNodeLabel}
          deselectNode={deselectNode}
        />
      </div>
    </div>
  );
}

// The main export wraps the builder in ReactFlowProvider to enable hooks.
export default function FlowBuilder() {
  return (
    <ReactFlowProvider>
      <FlowBuilderInternal />
    </ReactFlowProvider>
  );
}
