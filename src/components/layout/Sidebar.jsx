import {
  LayoutDashboard, Gamepad2, Camera, FileText, Settings,
  Cpu, Wifi, BatteryMedium
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'controls', label: 'Controls', icon: Gamepad2 },
  { id: 'camera', label: 'Camera Feed', icon: Camera },
  { id: 'logs', label: 'System Logs', icon: FileText, badge: true },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ activePage, setActivePage, telemetry }) {
  const { battery, signal, connected, logs } = telemetry;

  const batteryColor = battery > 60 ? 'high' : battery > 30 ? 'mid' : 'low';
  const batteryTextColor = battery > 60 ? 'var(--accent-green)' : battery > 30 ? 'var(--accent-yellow)' : 'var(--accent-red)';

  const errorCount = logs.filter(l => l.level === 'ERROR').slice(0, 50).length;

  return (
    <aside className="sidebar">
      <div className="sidebar-section-label">NAVIGATION</div>

      {NAV_ITEMS.map(({ id, label, icon: Icon, badge }) => (
        <div
          key={id}
          className={`nav-item ${activePage === id ? 'active' : ''}`}
          onClick={() => setActivePage(id)}
        >
          <Icon size={16} className="nav-icon" />
          <span>{label}</span>
          {badge && errorCount > 0 && (
            <span className="nav-badge">{errorCount}</span>
          )}
        </div>
      ))}

      <div className="sidebar-divider" />
      <div className="sidebar-section-label">SYSTEM STATUS</div>

      {/* Battery */}
      <div className="sidebar-battery">
        <div className="battery-label">
          <span>BATTERY</span>
          <span style={{ color: batteryTextColor }}>{battery.toFixed(1)}%</span>
        </div>
        <div className="battery-bar-track">
          <div
            className={`battery-bar-fill ${batteryColor}`}
            style={{ width: `${battery}%` }}
          />
        </div>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 6, fontFamily: 'Share Tech Mono, monospace' }}>
          EST: {Math.round(battery * 2.88)}min remaining
        </div>
      </div>

      {/* Robot ID */}
      <div className="sidebar-robot-id">
        <div style={{ color: 'var(--accent-cyan)', fontWeight: 700, marginBottom: 4, fontSize: 11 }}>FlyGroundX</div>
        <div>ID: DR-X30P-0047</div>
        <div>FW: v3.2.1-stable</div>
        <div style={{ color: connected ? 'var(--accent-green)' : 'var(--accent-red)' }}>
          NET: {signal} dBm
        </div>
        <div>IP67 · 12-DOF</div>
        <div style={{ color: 'var(--text-muted)', fontSize: 9, marginTop: 4 }}>by Piefly Aerospace</div>
      </div>

      <div className="sidebar-divider" />

      {/* Quick status indicators */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--text-secondary)' }}>
          <Cpu size={12} style={{ color: 'var(--accent-cyan)' }} />
          <span style={{ fontFamily: 'Share Tech Mono' }}>CPU: 34%</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--text-secondary)' }}>
          <Wifi size={12} style={{ color: connected ? 'var(--accent-green)' : 'var(--accent-red)' }} />
          <span style={{ fontFamily: 'Share Tech Mono' }}>5G · LTE Backup</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--text-secondary)' }}>
          <BatteryMedium size={12} style={{ color: batteryTextColor }} />
          <span style={{ fontFamily: 'Share Tech Mono' }}>48V · 25Ah · LiPo</span>
        </div>
      </div>
    </aside>
  );
}
