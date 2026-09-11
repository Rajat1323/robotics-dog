export default function FootContactMap({ footContact }) {
  const legs = [
    { id: 'FL', label: 'FL', title: 'Front Left' },
    { id: 'FR', label: 'FR', title: 'Front Right' },
    { id: 'RL', label: 'RL', title: 'Rear Left' },
    { id: 'RR', label: 'RR', title: 'Rear Right' },
  ];

  return (
    <div>
      <div className="foot-contact-grid">
        {legs.map(({ id, label, title }) => (
          <div
            key={id}
            className={`foot-pad ${footContact[id] ? 'contact' : 'no-contact'}`}
            title={title}
          >
            <div style={{ fontSize: 16, marginBottom: 4 }}>
              {footContact[id] ? '●' : '○'}
            </div>
            <div>{label}</div>
            <div style={{ fontSize: 9, marginTop: 2, opacity: 0.7 }}>
              {footContact[id] ? 'GND' : 'AIR'}
            </div>
          </div>
        ))}
      </div>
      <div style={{
        textAlign: 'center',
        marginTop: 12,
        fontSize: 10,
        color: 'var(--text-muted)',
        fontFamily: 'Share Tech Mono',
        letterSpacing: 1,
      }}>
        {Object.values(footContact).filter(Boolean).length}/4 GROUNDED
      </div>
    </div>
  );
}
