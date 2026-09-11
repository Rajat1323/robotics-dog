import { useState } from 'react';
import {
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
  RotateCcw, RotateCw, Minus, Plus,
  PersonStanding, Dog, Hand, Layers,
  Zap, Shield
} from 'lucide-react';
import { useTelemetryCtx } from '../components/layout/Layout';
import GaitSelector from '../components/dashboard/GaitSelector';

const CMD_LOG_MAX = 30;

export default function Controls() {
  const { gait, setGait, speed } = useTelemetryCtx();
  const [speedVal, setSpeedVal] = useState(3.0);
  const [heightVal, setHeightVal] = useState(50);
  const [cmdLog, setCmdLog] = useState([]);
  const [lastCmd, setLastCmd] = useState(null);
  const [activeBtn, setActiveBtn] = useState(null);

  const sendCmd = (cmd) => {
    setLastCmd(cmd);
    setActiveBtn(cmd);
    const entry = {
      id: Date.now(),
      time: new Date().toTimeString().slice(0, 8),
      cmd,
    };
    setCmdLog(l => [entry, ...l.slice(0, CMD_LOG_MAX - 1)]);
    setTimeout(() => setActiveBtn(null), 200);
  };

  const commands = [
    { id: 'SIT', label: 'Sit', icon: Dog },
    { id: 'STAND', label: 'Stand', icon: PersonStanding },
    { id: 'WAVE', label: 'Wave', icon: Hand },
    { id: 'ROLL', label: 'Roll Over', icon: RotateCw },
    { id: 'BALANCE', label: 'Balance', icon: Layers },
    { id: 'SPRINT', label: 'Sprint', icon: Zap },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <div className="page-title-accent" />
          Control Panel
        </div>
        <div className="page-subtitle">
          Send movement commands · FlyGroundX Platform · DR-X30P-0047
        </div>
      </div>

      <div className="controls-layout">
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* D-Pad */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center gap-8">
                <div className="card-accent-line" />
                <span className="card-title">Directional Control</span>
              </div>
              {lastCmd && <span className="tag cyan">{lastCmd}</span>}
            </div>
            <div className="dpad-container">
              <div className="dpad-row">
                <button
                  className="dpad-btn"
                  style={activeBtn === 'FORWARD' ? { background: 'var(--accent-cyan)', color: 'var(--bg-base)' } : {}}
                  onClick={() => sendCmd('FORWARD')}
                  title="Move Forward"
                >
                  <ArrowUp size={28} />
                </button>
              </div>
              <div className="dpad-row">
                <button
                  className="dpad-btn"
                  style={activeBtn === 'LEFT' ? { background: 'var(--accent-cyan)', color: 'var(--bg-base)' } : {}}
                  onClick={() => sendCmd('LEFT')}
                  title="Turn Left"
                >
                  <ArrowLeft size={28} />
                </button>
                <div className="dpad-center">
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--accent-cyan-dim)', border: '1px solid var(--border-active)' }} />
                </div>
                <button
                  className="dpad-btn"
                  style={activeBtn === 'RIGHT' ? { background: 'var(--accent-cyan)', color: 'var(--bg-base)' } : {}}
                  onClick={() => sendCmd('RIGHT')}
                  title="Turn Right"
                >
                  <ArrowRight size={28} />
                </button>
              </div>
              <div className="dpad-row">
                <button
                  className="dpad-btn"
                  style={activeBtn === 'BACKWARD' ? { background: 'var(--accent-cyan)', color: 'var(--bg-base)' } : {}}
                  onClick={() => sendCmd('BACKWARD')}
                  title="Move Backward"
                >
                  <ArrowDown size={28} />
                </button>
              </div>

              {/* Rotate */}
              <div className="dpad-row" style={{ marginTop: 8, gap: 16 }}>
                <button className="dpad-btn" style={{ width: 52, height: 52, fontSize: 14 }} onClick={() => sendCmd('ROTATE_L')} title="Rotate Left">
                  <RotateCcw size={20} />
                </button>
                <button className="dpad-btn" style={{ width: 52, height: 52, fontSize: 14 }} onClick={() => sendCmd('STOP')} title="Stop">
                  <div style={{ width: 14, height: 14, background: 'var(--accent-red)', borderRadius: 2 }} />
                </button>
                <button className="dpad-btn" style={{ width: 52, height: 52, fontSize: 14 }} onClick={() => sendCmd('ROTATE_R')} title="Rotate Right">
                  <RotateCw size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Speed Control */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center gap-8">
                <div className="card-accent-line" />
                <span className="card-title">Speed Control</span>
              </div>
              <span className="tag cyan">{speedVal.toFixed(1)} m/s</span>
            </div>
            <div className="speed-slider-wrap" style={{ padding: '10px 4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <Minus size={14} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => setSpeedVal(v => Math.max(0, v - 0.5))} />
                <input
                  type="range" min={0} max={7} step={0.1}
                  value={speedVal}
                  onChange={(e) => setSpeedVal(parseFloat(e.target.value))}
                  className="speed-slider"
                  style={{ flex: 1, accentColor: 'var(--accent-cyan)' }}
                />
                <Plus size={14} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => setSpeedVal(v => Math.min(7, v + 0.5))} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)', fontFamily: 'Share Tech Mono' }}>
                <span>0 m/s</span>
                <span>MAX WALK: 7 m/s</span>
              </div>
            </div>
          </div>

          {/* Body Height */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center gap-8">
                <div className="card-accent-line" />
                <span className="card-title">Body Height</span>
              </div>
              <span className="tag cyan">{heightVal}%</span>
            </div>
            <div style={{ padding: '10px 4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Minus size={14} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => setHeightVal(v => Math.max(20, v - 5))} />
                <input
                  type="range" min={20} max={100} step={5}
                  value={heightVal}
                  onChange={(e) => setHeightVal(parseInt(e.target.value))}
                  className="speed-slider"
                  style={{ flex: 1, accentColor: 'var(--accent-purple)' }}
                />
                <Plus size={14} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => setHeightVal(v => Math.min(100, v + 5))} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Gait Mode */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center gap-8">
                <div className="card-accent-line" />
                <span className="card-title">Gait Mode</span>
              </div>
              <span className="tag green">{gait}</span>
            </div>
            <GaitSelector gait={gait} setGait={setGait} />
          </div>

          {/* Commands */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center gap-8">
                <div className="card-accent-line" />
                <span className="card-title">Behavior Commands</span>
              </div>
            </div>
            <div className="cmd-grid">
              {commands.map(({ id, label, icon: Icon }) => (
                <button key={id} className="cmd-btn" onClick={() => sendCmd(id)}>
                  <Icon size={20} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Command Log */}
          <div className="card" style={{ flex: 1 }}>
            <div className="card-header">
              <div className="flex items-center gap-8">
                <div className="card-accent-line" />
                <span className="card-title">Command Log</span>
              </div>
              <span className="tag cyan">{cmdLog.length}</span>
            </div>
            <div style={{ maxHeight: 180, overflowY: 'auto', fontFamily: 'Share Tech Mono', fontSize: 11 }}>
              {cmdLog.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 20, letterSpacing: 1 }}>
                  No commands sent yet
                </div>
              ) : cmdLog.map((entry) => (
                <div key={entry.id} style={{ display: 'flex', gap: 12, padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>{entry.time}</span>
                  <span style={{ color: 'var(--accent-cyan)' }}>→</span>
                  <span style={{ color: 'var(--text-primary)' }}>{entry.cmd}</span>
                  <span style={{ color: 'var(--accent-green)', marginLeft: 'auto' }}>SENT</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
