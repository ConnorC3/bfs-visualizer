export default function QueueVisualization({ queue }) {
  return (
    <div>
      <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#f1f5f9' }}>
        Queue {queue.length > 0 && `(${queue.length})`}
      </h3>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        padding: '12px',
        backgroundColor: '#0f172a',
        borderRadius: '8px',
        minHeight: '60px',
        border: '1px solid #334155'
      }}>
        {queue.length === 0 ? (
          <div style={{ color: '#64748b', fontSize: '13px', margin: 'auto' }}>
            Empty
          </div>
        ) : (
          queue.map((nodeId, index) => (
            <div
              key={`${nodeId}-${index}`}
              style={{
                padding: '8px 12px',
                backgroundColor: index === 0 ? '#fbbf24' : '#0ea5e9',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#1e293b',
                border: index === 0 ? '2px solid #f59e0b' : '1px solid #0284c7'
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
