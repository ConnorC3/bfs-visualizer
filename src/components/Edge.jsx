export default function Edge({ edge, nodes }) {
  const [n1, n2] = edge.split('-').map(Number);
  const node1 = nodes.get(n1);
  const node2 = nodes.get(n2);
  
  if (!node1 || !node2) return null;
  
  return (
    <line
      x1={node1.x}
      y1={node1.y}
      x2={node2.x}
      y2={node2.y}
      stroke="#64748b"
      strokeWidth="2"
    />
  );
}
