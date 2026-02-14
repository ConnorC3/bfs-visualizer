import { NODE_RADIUS, NODE_COLORS } from '../constants';

export default function Node({ 
  node, 
  mode, 
  bfsState, 
  startNode, 
  selectedNodeForEdge 
}) {
  const getNodeColor = () => {
    if (mode === 'CONSTRUCTION' && node.id === selectedNodeForEdge) {
      return '#c084fc';
    }
    
    if (node.id === startNode && (mode === 'CONSTRUCTION' || mode === 'BFS_READY')) {
      return NODE_COLORS.start;
    }
    
    const state = bfsState.nodeStates.get(node.id);
    return NODE_COLORS[state] || NODE_COLORS.unvisited;
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: node.x - NODE_RADIUS,
        top: node.y - NODE_RADIUS,
        width: NODE_RADIUS * 2,
        height: NODE_RADIUS * 2,
        borderRadius: '50%',
        backgroundColor: getNodeColor(),
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
  );
}
