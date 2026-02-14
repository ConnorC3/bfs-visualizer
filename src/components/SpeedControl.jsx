export default function SpeedControl({ speed, onSetSpeed }) {
  return (
    <div>
      <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#f1f5f9' }}>
        Animation Speed
      </h3>
      <div style={{ display: 'flex', gap: '8px' }}>
        {['slow', 'medium', 'fast'].map(s => (
          <button
            key={s}
            onClick={() => onSetSpeed(s)}
            style={{
              flex: 1,
              padding: '8px',
              backgroundColor: speed === s ? '#3b82f6' : '#0f172a',
              color: speed === s ? 'white' : '#cbd5e1',
              border: speed === s ? 'none' : '1px solid #475569',
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
  );
}
