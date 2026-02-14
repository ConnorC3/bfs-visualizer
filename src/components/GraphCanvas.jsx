import { forwardRef } from 'react';
import Node from './Node';
import Edge from './Edge';

const GraphCanvas = forwardRef(({
  nodes,
  edges,
  mode,
  bfsState,
  startNode,
  selectedNodeForEdge,
  onCanvasClick,
  onNodeClick
}, ref) => {
  const handleCanvasClick = (e) => {
    if (mode !== 'CONSTRUCTION') return;
    
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if clicking on existing node
    const clickedNode = findNodeAtPosition(x, y);
    
    if (clickedNode) {
      onNodeClick(clickedNode);
    } else if (!selectedNodeForEdge) {
      onCanvasClick(x, y);
    }
  };

  const findNodeAtPosition = (x, y) => {
    const NODE_RADIUS = 25;
    for (let [id, node] of nodes) {
      const distance = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2);
      if (distance <= NODE_RADIUS) {
        return id;
      }
    }
    return null;
  };

  return (
    <div
      ref={ref}
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
        {Array.from(edges).map(edge => (
          <Edge
            key={edge}
            edge={edge}
            nodes={nodes}
          />
        ))}
      </svg>
      
      {/* Render nodes */}
      {Array.from(nodes.values()).map(node => (
        <Node
          key={node.id}
          node={node}
          mode={mode}
          bfsState={bfsState}
          startNode={startNode}
          selectedNodeForEdge={selectedNodeForEdge}
        />
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
  );
});

GraphCanvas.displayName = 'GraphCanvas';

export default GraphCanvas;
