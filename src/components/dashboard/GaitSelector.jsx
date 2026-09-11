// Gait mode selector
const GAITS = [
  { id: 'WALK', label: 'Walk', emoji: '🐾', desc: '0.8 m/s' },
  { id: 'TROT', label: 'Trot', emoji: '⚡', desc: '2.5 m/s' },
  { id: 'CRAWL', label: 'Crawl', emoji: '🦎', desc: '0.3 m/s' },
  { id: 'BOUND', label: 'Bound', emoji: '🚀', desc: '7.0 m/s' },
];

export default function GaitSelector({ gait, setGait }) {
  return (
    <div className="gait-grid">
      {GAITS.map(({ id, label, emoji, desc }) => (
        <button
          key={id}
          className={`gait-btn ${gait === id ? 'active' : ''}`}
          onClick={() => setGait(id)}
        >
          <span style={{ fontSize: 20 }}>{emoji}</span>
          <span>{label}</span>
          <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'Share Tech Mono' }}>{desc}</span>
        </button>
      ))}
    </div>
  );
}
