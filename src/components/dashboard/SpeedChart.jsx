import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, AreaChart, Area, ReferenceLine
} from 'recharts';

const CustomTooltip = ({ active, payload, label, unit = '' }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-active)',
        borderRadius: 6,
        padding: '8px 12px',
        fontFamily: 'Share Tech Mono, monospace',
        fontSize: 12,
        color: 'var(--accent-cyan)',
      }}>
        {payload[0].value.toFixed(2)}{unit}
      </div>
    );
  }
  return null;
};

export function SpeedChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="speedGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,212,255,0.06)" />
        <XAxis dataKey="t" hide />
        <YAxis domain={[0, 8]} tick={{ fill: 'var(--text-muted)', fontSize: 10, fontFamily: 'Share Tech Mono' }} />
        <Tooltip content={<CustomTooltip unit=" m/s" />} />
        <ReferenceLine y={5} stroke="rgba(255,170,0,0.3)" strokeDasharray="4 4" />
        <Area
          type="monotone"
          dataKey="v"
          stroke="#00d4ff"
          strokeWidth={2}
          fill="url(#speedGrad)"
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function PowerChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="powerGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.06)" />
        <XAxis dataKey="t" hide />
        <YAxis domain={[200, 500]} tick={{ fill: 'var(--text-muted)', fontSize: 10, fontFamily: 'Share Tech Mono' }} />
        <Tooltip content={<CustomTooltip unit=" W" />} />
        <Area
          type="monotone"
          dataKey="v"
          stroke="#7c3aed"
          strokeWidth={2}
          fill="url(#powerGrad)"
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
