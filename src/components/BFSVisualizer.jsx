import { useState, useEffect, useRef } from 'react';
import GraphCanvas from './GraphCanvas';
import Sidebar from './Sidebar';
import { SPEED_MAP } from '../constants';

export default function BFSVisualizer() {
  // Graph data
  const [nodes, setNodes] = useState(new Map());
  const [edges, setEdges] = useState(new Set());
  const [nextNodeId, setNextNodeId] = useState(1);
  
  // UI mode
  const [mode, setMode] = useState('CONSTRUCTION');
  
  // Construction mode state
  const [selectedNodeForEdge, setSelectedNodeForEdge] = useState(null);
  
  // BFS state
  const [startNode, setStartNode] = useState(null);
  const [bfsState, setBfsState] = useState({
    queue: [],
    visited: new Set(),
    current: null,
    nodeStates: new Map(),
    step: 'DEQUEUE',
    neighborsToProcess: []
  });
  
  // Animation control
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState('medium');
  
  const canvasRef = useRef(null);
  const playIntervalRef = useRef(null);

  // Clear play interval on cleanup
  useEffect(() => {
    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    };
  }, []);

  // Auto-play BFS
  useEffect(() => {
    if (isPlaying && mode === 'BFS_RUNNING') {
      playIntervalRef.current = setInterval(() => {
        stepBFS();
      }, SPEED_MAP[speed]);
    } else {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
        playIntervalRef.current = null;
      }
    }
    
    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    };
  }, [isPlaying, mode, speed, bfsState]);

  // Get neighbors of a node
  const getNeighbors = (nodeId) => {
    const neighbors = [];
    for (let edge of edges) {
      const [n1, n2] = edge.split('-').map(Number);
      if (n1 === nodeId) neighbors.push(n2);
      else if (n2 === nodeId) neighbors.push(n1);
    }
    return neighbors;
  };

  // Add node to canvas
  const handleCanvasClick = (x, y) => {
    if (mode !== 'CONSTRUCTION') return;
    
    const newNode = {
      id: nextNodeId,
      x,
      y,
      label: `${nextNodeId}`
    };
    
    setNodes(new Map(nodes.set(nextNodeId, newNode)));
    setNextNodeId(nextNodeId + 1);
  };

  // Handle node click for edge creation
  const handleNodeClick = (nodeId) => {
    if (mode !== 'CONSTRUCTION') return;
    
    if (selectedNodeForEdge === null) {
      setSelectedNodeForEdge(nodeId);
    } else if (selectedNodeForEdge === nodeId) {
      setSelectedNodeForEdge(null);
    } else {
      const edgeId = createEdgeId(selectedNodeForEdge, nodeId);
      setEdges(new Set(edges.add(edgeId)));
      setSelectedNodeForEdge(null);
    }
  };

  // Create edge ID (undirected, so normalize order)
  const createEdgeId = (node1, node2) => {
    return node1 < node2 ? `${node1}-${node2}` : `${node2}-${node1}`;
  };

  // Initialize BFS
  const initializeBFS = () => {
    if (!startNode || !nodes.has(startNode)) return;
    
    const initialNodeStates = new Map();
    for (let [id] of nodes) {
      initialNodeStates.set(id, 'unvisited');
    }
    initialNodeStates.set(startNode, 'queued');
    
    setBfsState({
      queue: [startNode],
      visited: new Set(),
      current: null,
      nodeStates: initialNodeStates,
      step: 'DEQUEUE',
      neighborsToProcess: []
    });
    
    setMode('BFS_RUNNING');
    setIsPlaying(false);
  };

  // Step through BFS
  const stepBFS = () => {
    if (mode !== 'BFS_RUNNING' && mode !== 'BFS_PAUSED') return;
    
    setBfsState(prevState => {
      const newState = { ...prevState };
      
      if (prevState.step === 'DEQUEUE') {
        if (prevState.queue.length === 0) {
          setMode('BFS_COMPLETE');
          setIsPlaying(false);
          return prevState;
        }
        
        const current = prevState.queue[0];
        newState.queue = prevState.queue.slice(1);
        newState.current = current;
        newState.nodeStates = new Map(prevState.nodeStates);
        newState.nodeStates.set(current, 'visiting');
        newState.step = 'PROCESS_NEIGHBORS';
        newState.neighborsToProcess = getNeighbors(current).filter(
          n => !prevState.visited.has(n) && prevState.nodeStates.get(n) === 'unvisited'
        );
        
      } else if (prevState.step === 'PROCESS_NEIGHBORS') {
        newState.nodeStates = new Map(prevState.nodeStates);
        const newQueue = [...prevState.queue];
        
        for (let neighbor of prevState.neighborsToProcess) {
          newState.nodeStates.set(neighbor, 'queued');
          newQueue.push(neighbor);
        }
        
        newState.queue = newQueue;
        newState.step = 'MARK_VISITED';
        
      } else if (prevState.step === 'MARK_VISITED') {
        newState.visited = new Set(prevState.visited);
        newState.visited.add(prevState.current);
        newState.nodeStates = new Map(prevState.nodeStates);
        newState.nodeStates.set(prevState.current, 'visited');
        newState.current = null;
        newState.step = 'DEQUEUE';
        newState.neighborsToProcess = [];
      }
      
      return newState;
    });
    
    setMode('BFS_RUNNING');
  };

  // Reset BFS
  const resetBFS = () => {
    setBfsState({
      queue: [],
      visited: new Set(),
      current: null,
      nodeStates: new Map(),
      step: 'DEQUEUE',
      neighborsToProcess: []
    });
    setMode('CONSTRUCTION');
    setIsPlaying(false);
  };

  // Clear graph
  const clearGraph = () => {
    setNodes(new Map());
    setEdges(new Set());
    setNextNodeId(1);
    setSelectedNodeForEdge(null);
    setStartNode(null);
    resetBFS();
  };

  // Toggle play/pause
  const togglePlay = () => {
    if (mode === 'BFS_RUNNING') {
      setIsPlaying(!isPlaying);
      setMode(isPlaying ? 'BFS_PAUSED' : 'BFS_RUNNING');
    }
  };

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      overflow: 'hidden'
    }}>
      <GraphCanvas
        ref={canvasRef}
        nodes={nodes}
        edges={edges}
        mode={mode}
        bfsState={bfsState}
        startNode={startNode}
        selectedNodeForEdge={selectedNodeForEdge}
        onCanvasClick={handleCanvasClick}
        onNodeClick={handleNodeClick}
      />
      
      <Sidebar
        mode={mode}
        nodes={nodes}
        startNode={startNode}
        selectedNodeForEdge={selectedNodeForEdge}
        bfsState={bfsState}
        speed={speed}
        isPlaying={isPlaying}
        onClearGraph={clearGraph}
        onSetStartNode={setStartNode}
        onInitializeBFS={initializeBFS}
        onStepBFS={stepBFS}
        onTogglePlay={togglePlay}
        onResetBFS={resetBFS}
        onSetSpeed={setSpeed}
      />
    </div>
  );
}
