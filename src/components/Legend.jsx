import { NODE_COLORS } from '../constants';

export default function Legend() {
  return (
    <div>
      <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#f1f5f9' }}>
        Legend
      </h3>
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
              border: '2px solid #475569'
            }} />
            <span style={{ fontSize: '13px', color: '#cbd5e1' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
