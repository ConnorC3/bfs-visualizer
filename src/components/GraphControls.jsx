export default function GraphControls({ mode, selectedNodeForEdge, onClearGraph }) {
  return (
    <div>
      <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#1e293b' }}>
        Graph Controls
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          onClick={onClearGraph}
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
  );
}
