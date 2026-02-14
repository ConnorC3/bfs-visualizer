import { useState, useEffect, useRef } from 'react';

// Constants
const NODE_RADIUS = 25;
const SPEED_MAP = {
    slow: 1500,
    medium: 750,
    fast: 300
};

const NODE_COLORS = {
    unvisited: '#e2e8f0',
    queued: '#fef08a',
    visiting: '#60a5fa',
    visited: '#86efac',
    start: '#f472b6'
};

// Main App Component
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

    // Add node to canvas
    const handleCanvasClick = (e) => {
    if (mode !== 'CONSTRUCTION') return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if clicking on existing node
    const clickedNode = findNodeAtPosition(x, y);
    
    if (clickedNode) {
        handleNodeClick(clickedNode);
    } else if (!selectedNodeForEdge) {
        // Add new node
        const newNode = {
        id: nextNodeId,
        x,
        y,
        label: `${nextNodeId}`
        };
        
        setNodes(new Map(nodes.set(nextNodeId, newNode)));
        setNextNodeId(nextNodeId + 1);
    }
    };

    // Find node at position
    const findNodeAtPosition = (x, y) => {
    for (let [id, node] of nodes) {
        const distance = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2);
        if (distance <= NODE_RADIUS) {
        return id;
        }
    }
    return null;
    };

    // Handle node click for edge creation
    const handleNodeClick = (nodeId) => {
    if (mode !== 'CONSTRUCTION') return;
    
    if (selectedNodeForEdge === null) {
        setSelectedNodeForEdge(nodeId);
    } else if (selectedNodeForEdge === nodeId) {
        // Clicked same node, cancel selection
        setSelectedNodeForEdge(null);
    } else {
        // Create edge
        const edgeId = createEdgeId(selectedNodeForEdge, nodeId);
        setEdges(new Set(edges.add(edgeId)));
        setSelectedNodeForEdge(null);
    }
    };

    // Create edge ID (undirected, so normalize order)
    const createEdgeId = (node1, node2) => {
    return node1 < node2 ? `${node1}-${node2}` : `${node2}-${node1}`;
    };

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
        // Step 1: Dequeue front node
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
        // Step 2: Process neighbors
        newState.nodeStates = new Map(prevState.nodeStates);
        const newQueue = [...prevState.queue];
        
        for (let neighbor of prevState.neighborsToProcess) {
            newState.nodeStates.set(neighbor, 'queued');
            newQueue.push(neighbor);
        }
        
        newState.queue = newQueue;
        newState.step = 'MARK_VISITED';
        
        } else if (prevState.step === 'MARK_VISITED') {
        // Step 3: Mark current as visited
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

    // Get node color based on state
    const getNodeColor = (nodeId) => {
    if (mode === 'CONSTRUCTION' && nodeId === selectedNodeForEdge) {
        return '#c084fc';
    }
    
    if (nodeId === startNode && (mode === 'CONSTRUCTION' || mode === 'BFS_READY')) {
        return NODE_COLORS.start;
    }
    
    const state = bfsState.nodeStates.get(nodeId);
    return NODE_COLORS[state] || NODE_COLORS.unvisited;
    };

    // Get current step description
    const getStepDescription = () => {
    if (mode === 'CONSTRUCTION' || mode === 'BFS_READY') return 'Ready to start BFS';
    if (mode === 'BFS_COMPLETE') return 'BFS Complete!';
    
    if (bfsState.step === 'DEQUEUE') {
        return `Next: Dequeue node from front of queue`;
    } else if (bfsState.step === 'PROCESS_NEIGHBORS') {
        return `Processing neighbors of node ${bfsState.current}`;
    } else if (bfsState.step === 'MARK_VISITED') {
        return `Marking node ${bfsState.current} as visited`;
    }
    };

    return (
    <div style={{
        display: 'flex',
        height: '100vh',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        overflow: 'hidden'
    }}>
        {/* Main Canvas */}
        <div
        ref={canvasRef}
        onClick={handleCanvasClick}
        style={{
            flex: 1,
            position: 'relative',
            backgroundColor: '#f8fafc',
            cursor: mode === 'CONSTRUCTION' ? 'crosshair' : 'default',
            overflow: 'hidden'
        }}
        >
        {/* Render edges */}
        <svg
            style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none'
            }}
        >
            {Array.from(edges).map(edge => {
            const [n1, n2] = edge.split('-').map(Number);
            const node1 = nodes.get(n1);
            const node2 = nodes.get(n2);
            if (!node1 || !node2) return null;
            
            return (
                <line
                key={edge}
                x1={node1.x}
                y1={node1.y}
                x2={node2.x}
                y2={node2.y}
                stroke="#94a3b8"
                strokeWidth="2"
                />
            );
            })}
        </svg>
        
        {/* Render nodes */}
        {Array.from(nodes.values()).map(node => (
            <div
            key={node.id}
            style={{
                position: 'absolute',
                left: node.x - NODE_RADIUS,
                top: node.y - NODE_RADIUS,
                width: NODE_RADIUS * 2,
                height: NODE_RADIUS * 2,
                borderRadius: '50%',
                backgroundColor: getNodeColor(node.id),
                border: node.id === bfsState.current ? '3px solid #1e40af' : '2px solid #64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '14px',
                color: '#1e293b',
                cursor: mode === 'CONSTRUCTION' ? 'pointer' : 'default',
                transition: 'background-color 0.3s ease, border 0.3s ease',
                userSelect: 'none',
                pointerEvents: mode === 'CONSTRUCTION' ? 'auto' : 'none'
            }}
            >
            {node.label}
            </div>
        ))}
        
        {/* Instructions overlay */}
        {nodes.size === 0 && mode === 'CONSTRUCTION' && (
            <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: '#64748b',
            fontSize: '18px'
            }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>Click to add nodes</div>
            <div>Click on two nodes to create edges</div>
            </div>
        )}
        </div>
        
        {/* Sidebar */}
        <div style={{
        width: '320px',
        backgroundColor: '#ffffff',
        borderLeft: '1px solid #e2e8f0',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        overflowY: 'auto'
        }}>
        <h1 style={{ margin: 0, fontSize: '24px', color: '#1e293b' }}>BFS Visualizer</h1>
        
        {/* Mode indicator */}
        <div style={{
            padding: '12px',
            backgroundColor: '#f1f5f9',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#475569'
        }}>
            <strong>Mode:</strong> {mode.replace('_', ' ')}
        </div>
        
        {/* Graph Controls */}
        <div>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#1e293b' }}>Graph Controls</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
                onClick={clearGraph}
                disabled={mode === 'BFS_RUNNING'}
                style={{
                padding: '10px 16px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: mode === 'BFS_RUNNING' ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                opacity: mode === 'BFS_RUNNING' ? 0.5 : 1
                }}
            >
                Clear Graph
            </button>
            
            {selectedNodeForEdge !== null && (
                <div style={{
                padding: '8px',
                backgroundColor: '#fef3c7',
                borderRadius: '6px',
                fontSize: '13px',
                color: '#92400e'
                }}>
                Node {selectedNodeForEdge} selected. Click another node to create edge.
                </div>
            )}
            </div>
        </div>
        
        {/* BFS Controls */}
        <div>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#1e293b' }}>BFS Controls</h3>
            
            {/* Start node selector */}
            <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#475569' }}>
                Start Node:
            </label>
            <select
                value={startNode || ''}
                onChange={(e) => setStartNode(Number(e.target.value))}
                disabled={mode !== 'CONSTRUCTION'}
                style={{
                width: '100%',
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                cursor: mode !== 'CONSTRUCTION' ? 'not-allowed' : 'pointer',
                opacity: mode !== 'CONSTRUCTION' ? 0.5 : 1
                }}
            >
                <option value="">Select start node</option>
                {Array.from(nodes.keys()).map(id => (
                <option key={id} value={id}>Node {id}</option>
                ))}
            </select>
            </div>
            
            {/* Initialize BFS */}
            <button
            onClick={initializeBFS}
            disabled={!startNode || mode !== 'CONSTRUCTION'}
            style={{
                width: '100%',
                padding: '10px 16px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: (!startNode || mode !== 'CONSTRUCTION') ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '12px',
                opacity: (!startNode || mode !== 'CONSTRUCTION') ? 0.5 : 1
            }}
            >
            Initialize BFS
            </button>
            
            {/* Playback controls */}
            {(mode === 'BFS_RUNNING' || mode === 'BFS_PAUSED' || mode === 'BFS_COMPLETE') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                <button
                    onClick={stepBFS}
                    disabled={mode === 'BFS_COMPLETE' || isPlaying}
                    style={{
                    flex: 1,
                    padding: '10px 16px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: (mode === 'BFS_COMPLETE' || isPlaying) ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    opacity: (mode === 'BFS_COMPLETE' || isPlaying) ? 0.5 : 1
                    }}
                >
                    Step
                </button>
                
                <button
                    onClick={togglePlay}
                    disabled={mode === 'BFS_COMPLETE'}
                    style={{
                    flex: 1,
                    padding: '10px 16px',
                    backgroundColor: '#8b5cf6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: mode === 'BFS_COMPLETE' ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    opacity: mode === 'BFS_COMPLETE' ? 0.5 : 1
                    }}
                >
                    {isPlaying ? 'Pause' : 'Play'}
                </button>
                </div>
                
                <button
                onClick={resetBFS}
                style={{
                    width: '100%',
                    padding: '10px 16px',
                    backgroundColor: '#64748b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                }}
                >
                Reset BFS
                </button>
            </div>
            )}
        </div>
        
        {/* Speed Control */}
        <div>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#1e293b' }}>Animation Speed</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
            {['slow', 'medium', 'fast'].map(s => (
                <button
                key={s}
                onClick={() => setSpeed(s)}
                style={{
                    flex: 1,
                    padding: '8px',
                    backgroundColor: speed === s ? '#3b82f6' : '#f1f5f9',
                    color: speed === s ? 'white' : '#475569',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '500',
                    textTransform: 'capitalize'
                }}
                >
                {s}
                </button>
            ))}
            </div>
        </div>
        
        {/* Queue Visualization */}
        {(mode === 'BFS_RUNNING' || mode === 'BFS_PAUSED' || mode === 'BFS_COMPLETE') && (
            <div>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#1e293b' }}>
                Queue {bfsState.queue.length > 0 && `(${bfsState.queue.length})`}
            </h3>
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                padding: '12px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                minHeight: '60px',
                border: '1px solid #e2e8f0'
            }}>
                {bfsState.queue.length === 0 ? (
                <div style={{ color: '#94a3b8', fontSize: '13px', margin: 'auto' }}>Empty</div>
                ) : (
                bfsState.queue.map((nodeId, index) => (
                    <div
                    key={`${nodeId}-${index}`}
                    style={{
                        padding: '8px 12px',
                        backgroundColor: index === 0 ? '#fef08a' : '#e0f2fe',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#1e293b',
                        border: index === 0 ? '2px solid #eab308' : '1px solid #0ea5e9'
                    }}
                    >
                    {nodeId}
                    </div>
                ))
                )}
            </div>
            </div>
        )}
        
        {/* Step description */}
        {(mode === 'BFS_RUNNING' || mode === 'BFS_PAUSED' || mode === 'BFS_COMPLETE') && (
            <div style={{
            padding: '12px',
            backgroundColor: '#eff6ff',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#1e40af',
            border: '1px solid #bfdbfe'
            }}>
            {getStepDescription()}
            </div>
        )}
        
        {/* Legend */}
        <div>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#1e293b' }}>Legend</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {Object.entries({
                'Unvisited': 'unvisited',
                'In Queue': 'queued',
                'Currently Processing': 'visiting',
                'Visited': 'visited',
                'Start Node': 'start'
            }).map(([label, state]) => (
                <div key={state} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: NODE_COLORS[state],
                    border: '2px solid #64748b'
                }} />
                <span style={{ fontSize: '13px', color: '#475569' }}>{label}</span>
                </div>
            ))}
            </div>
        </div>
        </div>
    </div>
    );
}

// // Render the app
// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<BFSVisualizer />);
