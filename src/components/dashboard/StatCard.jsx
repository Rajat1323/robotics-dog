import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function StatCard({ label, value, unit, color = 'cyan', icon: Icon, trend, trendLabel }) {
  return (
    <motion.div
      className={`stat-card ${color}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className={`stat-icon-wrap ${color}`}>
        {Icon && <Icon size={20} />}
      </div>
      <div className={`stat-value ${color}`}>
        {value}
        {unit && <span style={{ fontSize: 14, fontWeight: 400, marginLeft: 4, color: 'var(--text-muted)' }}>{unit}</span>}
      </div>
      <div className="stat-label">{label}</div>
      {trend !== undefined && (
        <div className={`stat-change ${trend > 0 ? 'up' : trend < 0 ? 'down' : ''}`}>
          {trend > 0 ? <TrendingUp size={12} /> : trend < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
          <span>{trendLabel}</span>
        </div>
      )}
    </motion.div>
  );
}
