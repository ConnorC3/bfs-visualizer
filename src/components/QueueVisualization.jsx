export default function QueueVisualization({ queue }) {
  return (
    <div>
      <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#1e293b' }}>
        Queue {queue.length > 0 && `(${queue.length})`}
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
        {queue.length === 0 ? (
          <div style={{ color: '#94a3b8', fontSize: '13px', margin: 'auto' }}>
            Empty
          </div>
        ) : (
          queue.map((nodeId, index) => (
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
  );
}
