export default function BFSControls({
  mode,
  nodes,
  startNode,
  isPlaying,
  onSetStartNode,
  onInitializeBFS,
  onStepBFS,
  onTogglePlay,
  onResetBFS
}) {
  return (
    <div>
      <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#1e293b' }}>
        BFS Controls
      </h3>
      
      {/* Start node selector */}
      <div style={{ marginBottom: '12px' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '6px', 
          fontSize: '14px', 
          color: '#475569' 
        }}>
          Start Node:
        </label>
        <select
          value={startNode || ''}
          onChange={(e) => onSetStartNode(Number(e.target.value))}
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
        onClick={onInitializeBFS}
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
              onClick={onStepBFS}
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
              onClick={onTogglePlay}
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
            onClick={onResetBFS}
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
  );
}
