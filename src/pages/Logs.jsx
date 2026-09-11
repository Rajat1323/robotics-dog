import { useState, useRef, useEffect } from 'react';
import { useTelemetryCtx } from '../components/layout/Layout';
import { Trash2, Filter } from 'lucide-react';

const LEVELS = ['ALL', 'INFO', 'WARN', 'ERROR', 'DEBUG'];

export default function Logs() {
  const { logs } = useTelemetryCtx();
  const [filter, setFilter] = useState('ALL');
  const bottomRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [localLogs, setLocalLogs] = useState(logs);

  useEffect(() => {
    setLocalLogs(logs);
  }, [logs]);

  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [localLogs, autoScroll]);

  const filtered = filter === 'ALL' ? localLogs : localLogs.filter(l => l.level === filter);
  const counts = {
    ALL: localLogs.length,
    INFO: localLogs.filter(l => l.level === 'INFO').length,
    WARN: localLogs.filter(l => l.level === 'WARN').length,
    ERROR: localLogs.filter(l => l.level === 'ERROR').length,
    DEBUG: localLogs.filter(l => l.level === 'DEBUG').length,
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <div className="page-title-accent" />
          System Logs
        </div>
        <div className="page-subtitle">
          Live event stream · Robot runtime log · X30 PRO
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        {/* Summary badges */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          {[
            { label: 'TOTAL', count: counts.ALL, color: 'cyan' },
            { label: 'INFO', count: counts.INFO, color: 'cyan' },
            { label: 'WARN', count: counts.WARN, color: 'yellow' },
            { label: 'ERROR', count: counts.ERROR, color: 'red' },
            { label: 'DEBUG', count: counts.DEBUG, color: 'purple' },
          ].map(({ label, count, color }) => (
            <div key={label} style={{
              padding: '8px 14px',
              borderRadius: 8,
              background: `var(--accent-${color}-dim, rgba(0,212,255,0.1))`,
              border: `1px solid rgba(0,212,255,0.15)`,
              fontFamily: 'Share Tech Mono',
              fontSize: 11,
              color: color === 'purple' ? '#a78bfa' : `var(--accent-${color})`,
              display: 'flex', gap: 8, alignItems: 'center',
            }}>
              <span style={{ opacity: 0.7 }}>{label}</span>
              <span style={{ fontWeight: 700, fontSize: 14, fontFamily: 'Rajdhani' }}>{count}</span>
            </div>
          ))}

          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted)', fontFamily: 'Share Tech Mono', cursor: 'pointer' }}>
              <input type="checkbox" checked={autoScroll} onChange={e => setAutoScroll(e.target.checked)} />
              AUTO-SCROLL
            </label>
            <button
              onClick={() => setLocalLogs([])}
              style={{ background: 'var(--accent-red-dim)', border: '1px solid rgba(255,51,102,0.2)', borderRadius: 6, color: 'var(--accent-red)', padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontFamily: 'Share Tech Mono' }}
            >
              <Trash2 size={12} /> CLEAR
            </button>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="log-filters">
          <Filter size={14} style={{ color: 'var(--text-muted)', alignSelf: 'center' }} />
          {LEVELS.map((level) => (
            <button
              key={level}
              className={`log-filter-btn ${filter === level ? `active-${level}` : ''}`}
              onClick={() => setFilter(level)}
              style={{ color: filter !== level ? 'var(--text-muted)' : undefined }}
            >
              {level} {counts[level] !== undefined ? `(${counts[level]})` : ''}
            </button>
          ))}
        </div>

        {/* Log output */}
        <div className="log-container">
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40, letterSpacing: 2 }}>
              NO LOGS MATCHING FILTER
            </div>
          ) : (
            [...filtered].reverse().map((entry) => (
              <div key={entry.id} className="log-entry">
                <span className="log-time">{entry.time}</span>
                <span className={`log-level ${entry.level}`}>[{entry.level}]</span>
                <span className="log-msg">{entry.msg}</span>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
