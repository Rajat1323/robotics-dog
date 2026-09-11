import { useState } from 'react';
import { Save, RefreshCw } from 'lucide-react';

export default function Settings() {
  const [settings, setSettings] = useState({
    robotName: 'X30-PRO-ALPHA',
    robotId: 'DR-X30P-0047',
    ipAddress: '192.168.1.100',
    port: '9090',
    telemetryRate: '10',
    logLevel: 'INFO',
    nightVisionDefault: false,
    autoReconnect: true,
    enableLidar: true,
    enableImu: true,
    enableFootSensors: true,
    payloadType: 'None',
  });

  const [saved, setSaved] = useState(false);

  const update = (key, val) => setSettings(s => ({ ...s, [key]: val }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const ToggleField = ({ label, fieldKey }) => (
    <div className="setting-row">
      <span className="setting-label">{label}</span>
      <label className="toggle">
        <input type="checkbox" checked={settings[fieldKey]} onChange={e => update(fieldKey, e.target.checked)} />
        <div className="toggle-track" />
      </label>
    </div>
  );

  const InputField = ({ label, fieldKey, type = 'text' }) => (
    <div className="setting-row">
      <span className="setting-label">{label}</span>
      <input
        type={type}
        value={settings[fieldKey]}
        onChange={e => update(fieldKey, e.target.value)}
        className="setting-value"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 6, padding: '5px 10px', color: 'var(--accent-cyan)', fontFamily: 'Share Tech Mono', fontSize: 12, outline: 'none', width: 160 }}
      />
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <div className="page-title-accent" />
          Settings
        </div>
        <div className="page-subtitle">
          Robot configuration · Network · Telemetry preferences
        </div>
      </div>

      <div className="settings-grid">
        {/* Robot Identity */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-8">
              <div className="card-accent-line" />
              <span className="card-title">Robot Identity</span>
            </div>
          </div>
          <InputField label="Robot Name" fieldKey="robotName" />
          <InputField label="Robot ID" fieldKey="robotId" />
          <div className="setting-row">
            <span className="setting-label">Model</span>
            <span className="setting-value">Deep Robotics X30 Pro</span>
          </div>
          <div className="setting-row">
            <span className="setting-label">Firmware</span>
            <span className="setting-value">v3.2.1-stable</span>
          </div>
          <div className="setting-row">
            <span className="setting-label">DOF</span>
            <span className="setting-value">12-DOF</span>
          </div>
          <div className="setting-row">
            <span className="setting-label">Protection</span>
            <span className="setting-value" style={{ color: 'var(--accent-green)' }}>IP67 ✓</span>
          </div>
        </div>

        {/* Network */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-8">
              <div className="card-accent-line" />
              <span className="card-title">Network & Connectivity</span>
            </div>
          </div>
          <InputField label="IP Address" fieldKey="ipAddress" />
          <InputField label="Port" fieldKey="port" />
          <div className="setting-row">
            <span className="setting-label">Protocol</span>
            <span className="setting-value">WebSocket / ROS2</span>
          </div>
          <div className="setting-row">
            <span className="setting-label">Network Type</span>
            <span className="setting-value" style={{ color: 'var(--accent-green)' }}>5G + LTE Backup</span>
          </div>
          <ToggleField label="Auto-Reconnect" fieldKey="autoReconnect" />
        </div>

        {/* Telemetry */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-8">
              <div className="card-accent-line" />
              <span className="card-title">Telemetry</span>
            </div>
          </div>
          <InputField label="Update Rate (Hz)" fieldKey="telemetryRate" type="number" />
          <div className="setting-row">
            <span className="setting-label">Log Level</span>
            <select
              value={settings.logLevel}
              onChange={e => update('logLevel', e.target.value)}
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 6, padding: '5px 10px', color: 'var(--accent-cyan)', fontFamily: 'Share Tech Mono', fontSize: 12, outline: 'none' }}
            >
              {['DEBUG', 'INFO', 'WARN', 'ERROR'].map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <ToggleField label="Enable LiDAR" fieldKey="enableLidar" />
          <ToggleField label="Enable IMU" fieldKey="enableImu" />
          <ToggleField label="Foot Sensors" fieldKey="enableFootSensors" />
        </div>

        {/* Preferences */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-8">
              <div className="card-accent-line" />
              <span className="card-title">Preferences</span>
            </div>
          </div>
          <ToggleField label="Night Vision Default" fieldKey="nightVisionDefault" />
          <div className="setting-row">
            <span className="setting-label">Payload Type</span>
            <select
              value={settings.payloadType}
              onChange={e => update('payloadType', e.target.value)}
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 6, padding: '5px 10px', color: 'var(--accent-cyan)', fontFamily: 'Share Tech Mono', fontSize: 12, outline: 'none' }}
            >
              {['None', 'Robotic Arm', 'LiDAR Pod', 'Inspection Kit', 'Custom'].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="setting-row">
            <span className="setting-label">Theme</span>
            <span className="setting-value" style={{ color: 'var(--accent-cyan)' }}>Cyberpunk Dark</span>
          </div>

          {/* Save Button */}
          <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
            <button
              onClick={handleSave}
              style={{
                flex: 1,
                padding: '12px',
                background: saved ? 'var(--accent-green-dim)' : 'var(--accent-cyan-dim)',
                border: `1px solid ${saved ? 'var(--accent-green)' : 'var(--accent-cyan)'}`,
                borderRadius: 8,
                color: saved ? 'var(--accent-green)' : 'var(--accent-cyan)',
                fontFamily: 'Rajdhani',
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: 2,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'all 0.3s',
              }}
            >
              <Save size={14} />
              {saved ? 'SAVED ✓' : 'SAVE SETTINGS'}
            </button>
            <button
              style={{
                padding: '12px 16px',
                background: 'transparent',
                border: '1px solid var(--border-subtle)',
                borderRadius: 8,
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 6,
                fontSize: 12, fontFamily: 'Rajdhani', letterSpacing: 1,
                transition: 'all 0.2s',
              }}
            >
              <RefreshCw size={14} /> RESET
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
