import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function TorqueChart({ torque }) {
  const data = [
    { leg: 'FL', value: torque.FL },
    { leg: 'FR', value: torque.FR },
    { leg: 'RL', value: torque.RL },
    { leg: 'RR', value: torque.RR },
  ];

  const getColor = (val) => {
    if (val > 28) return '#ff3366';
    if (val > 22) return '#ffaa00';
    return '#00d4ff';
  };

  return (
    <ResponsiveContainer width="100%" height={140}>
      <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barSize={28}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,212,255,0.06)" />
        <XAxis dataKey="leg" tick={{ fill: 'var(--text-secondary)', fontSize: 11, fontFamily: 'Share Tech Mono' }} />
        <YAxis domain={[0, 40]} tick={{ fill: 'var(--text-muted)', fontSize: 10, fontFamily: 'Share Tech Mono' }} />
        <Tooltip
          contentStyle={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-active)',
            borderRadius: 6,
            fontFamily: 'Share Tech Mono',
            fontSize: 12,
            color: 'var(--accent-cyan)',
          }}
          formatter={(v) => [`${v.toFixed(1)} Nm`, 'Torque']}
        />
        <Bar dataKey="value" radius={[4, 4, 0, 0]} isAnimationActive={false}>
          {data.map((entry) => (
            <Cell key={entry.leg} fill={getColor(entry.value)} fillOpacity={0.9} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
