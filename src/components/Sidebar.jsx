import GraphControls from './GraphControls';
import BFSControls from './BFSControls';
import SpeedControl from './SpeedControl';
import QueueVisualization from './QueueVisualization';
import StepDescription from './StepDescription';
import Legend from './Legend';

export default function Sidebar({
  mode,
  nodes,
  startNode,
  selectedNodeForEdge,
  bfsState,
  speed,
  isPlaying,
  onClearGraph,
  onSetStartNode,
  onInitializeBFS,
  onStepBFS,
  onTogglePlay,
  onResetBFS,
  onSetSpeed
}) {
  return (
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
      <h1 style={{ margin: 0, fontSize: '24px', color: '#1e293b' }}>
        BFS Visualizer
      </h1>
      
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
      
      <GraphControls
        mode={mode}
        selectedNodeForEdge={selectedNodeForEdge}
        onClearGraph={onClearGraph}
      />
      
      <BFSControls
        mode={mode}
        nodes={nodes}
        startNode={startNode}
        isPlaying={isPlaying}
        onSetStartNode={onSetStartNode}
        onInitializeBFS={onInitializeBFS}
        onStepBFS={onStepBFS}
        onTogglePlay={onTogglePlay}
        onResetBFS={onResetBFS}
      />
      
      <SpeedControl
        speed={speed}
        onSetSpeed={onSetSpeed}
      />
      
      {(mode === 'BFS_RUNNING' || mode === 'BFS_PAUSED' || mode === 'BFS_COMPLETE') && (
        <>
          <QueueVisualization queue={bfsState.queue} />
          <StepDescription mode={mode} bfsState={bfsState} />
        </>
      )}
      
      <Legend />
    </div>
  );
}
