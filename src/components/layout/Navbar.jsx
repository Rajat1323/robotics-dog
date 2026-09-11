import { Power, Bell, Shield, Clock } from 'lucide-react';

export default function Navbar({ telemetry }) {
  const { connected, uptime, uptimeFormatted, battery } = telemetry;

  return (
    <nav className="navbar">
      {/* Brand */}
      <div className="navbar-brand">
        <div className="navbar-logo">FGX</div>
        <div>
          <div className="navbar-title">
            <span>FlyGround</span>X
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'Share Tech Mono, monospace', letterSpacing: 2 }}>
            BY PIEFLY AEROSPACE · X30 PRO PLATFORM v1.0
          </div>
        </div>
      </div>

      {/* Center */}
      <div className="navbar-center">
        <div className={`connection-badge ${connected ? 'online' : 'offline'}`}>
          <div className={`status-dot ${connected ? 'online' : 'offline'}`} />
          {connected ? 'CONNECTED' : 'OFFLINE'}
        </div>

        <div className="uptime-display">
          <Clock size={12} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
          UP: {uptimeFormatted}
        </div>
      </div>

      {/* Right */}
      <div className="navbar-right">
        <button className="icon-btn" title="Notifications">
          <Bell size={16} />
        </button>
        <button className="icon-btn" title="Shield/Security">
          <Shield size={16} />
        </button>
        <button
          className="e-stop-btn"
          onClick={() => alert('⚠️ EMERGENCY STOP ACTIVATED')}
          title="Emergency Stop"
        >
          <Power size={14} />
          E-STOP
        </button>
      </div>
    </nav>
  );
}
