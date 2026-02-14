export default function StepDescription({ mode, bfsState }) {
  const getStepDescription = () => {
    if (mode === 'CONSTRUCTION' || mode === 'BFS_READY') {
      return 'Ready to start BFS';
    }
    if (mode === 'BFS_COMPLETE') {
      return 'BFS Complete!';
    }
    
    if (bfsState.step === 'DEQUEUE') {
      return 'Next: Dequeue node from front of queue';
    } else if (bfsState.step === 'PROCESS_NEIGHBORS') {
      return `Processing neighbors of node ${bfsState.current}`;
    } else if (bfsState.step === 'MARK_VISITED') {
      return `Marking node ${bfsState.current} as visited`;
    }
  };

  return (
    <div style={{
      padding: '12px',
      backgroundColor: '#1e3a8a',
      borderRadius: '8px',
      fontSize: '14px',
      color: '#bfdbfe',
      border: '1px solid #3b82f6'
    }}>
      {getStepDescription()}
    </div>
  );
}
