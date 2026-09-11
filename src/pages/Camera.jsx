import { useState } from 'react';
import { Camera, Moon, Sun, Download } from 'lucide-react';

const CAM_VIEWS = ['FRONT', 'REAR', 'LEFT', 'RIGHT'];

export default function CameraFeed() {
  const [nightVision, setNightVision] = useState(false);
  const [activeView, setActiveView] = useState('FRONT');
  const [zoom, setZoom] = useState(1);

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <div className="page-title-accent" />
          Camera Feed
        </div>
        <div className="page-subtitle">
          Multi-view camera system · IP67 Protected · 120° FOV
        </div>
      </div>

      {/* Controls Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <button
          className="cmd-btn"
          style={{ flexDirection: 'row', padding: '8px 16px', gap: 8 }}
          onClick={() => setNightVision(v => !v)}
        >
          {nightVision ? <Sun size={14} /> : <Moon size={14} />}
          {nightVision ? 'NIGHT ON' : 'NIGHT OFF'}
        </button>
        <button className="cmd-btn" style={{ flexDirection: 'row', padding: '8px 16px', gap: 8 }}>
          <Download size={14} /> SNAPSHOT
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)', fontFamily: 'Share Tech Mono' }}>
          ZOOM:
          <input
            type="range" min={1} max={4} step={0.5}
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="speed-slider"
            style={{ width: 100, accentColor: 'var(--accent-cyan)' }}
          />
          {zoom}x
        </div>
      </div>

      {/* Camera Grid */}
      <div className="camera-grid">
        {/* Main Camera */}
        <div className="camera-main">
          <div
            className="camera-feed"
            style={{
              filter: nightVision ? 'hue-rotate(90deg) saturate(0.3) brightness(1.4)' : 'none',
              minHeight: 400,
            }}
          >
            {/* Scanline */}
            <div className="camera-scanline" />

            {/* Corner brackets */}
            <div className="camera-corner tl" />
            <div className="camera-corner tr" />
            <div className="camera-corner bl" />
            <div className="camera-corner br" />

            {/* Overlay Info */}
            <div className="camera-overlay-text">
              <div>● REC  {new Date().toTimeString().slice(0, 8)}</div>
              <div style={{ color: 'var(--accent-cyan)', marginTop: 4 }}>CAM: {activeView}</div>
              <div>ZOOM: {zoom}x</div>
              {nightVision && <div style={{ color: 'var(--accent-green)' }}>NV: ON</div>}
            </div>

            <div className="camera-overlay-br">
              <div>DR-X30P-0047</div>
              <div>FOV: 120°</div>
              <div>4K · 30fps</div>
            </div>

            {/* Center crosshair */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <div className="camera-grid-center">
                <div className="camera-crosshair" />
              </div>
              <div style={{
                fontFamily: 'Share Tech Mono',
                fontSize: 12,
                color: 'var(--accent-cyan)',
                opacity: 0.5,
                letterSpacing: 3,
                textTransform: 'uppercase',
              }}>
                {activeView} CAMERA
              </div>
              <div style={{
                fontFamily: 'Share Tech Mono',
                fontSize: 10,
                color: 'var(--text-muted)',
                letterSpacing: 2,
              }}>
                LIVE STREAM ACTIVE
              </div>
            </div>

            {/* Simulated terrain scan lines */}
            {[...Array(5)].map((_, i) => (
              <div key={i} style={{
                position: 'absolute',
                bottom: `${15 + i * 8}%`,
                left: '10%',
                right: '10%',
                height: 1,
                background: `rgba(0,212,255,${0.03 + i * 0.01})`,
                borderRadius: 1,
              }} />
            ))}
          </div>

          {/* Camera Selector Bar */}
          <div style={{
            display: 'flex',
            gap: 2,
            padding: '8px',
            background: 'var(--bg-surface)',
            borderTop: '1px solid var(--border-subtle)',
          }}>
            {CAM_VIEWS.map((view) => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                style={{
                  flex: 1,
                  padding: '6px',
                  border: 'none',
                  borderRadius: 4,
                  background: activeView === view ? 'var(--accent-cyan-dim)' : 'transparent',
                  color: activeView === view ? 'var(--accent-cyan)' : 'var(--text-muted)',
                  fontFamily: 'Share Tech Mono',
                  fontSize: 11,
                  letterSpacing: 1,
                  cursor: 'pointer',
                  borderBottom: activeView === view ? '1px solid var(--accent-cyan)' : '1px solid transparent',
                  transition: 'all 0.2s',
                }}
              >
                {view}
              </button>
            ))}
          </div>
        </div>

        {/* Sub cameras */}
        {CAM_VIEWS.filter(v => v !== activeView).slice(0, 2).map((view) => (
          <div key={view} className="camera-sub" onClick={() => setActiveView(view)} style={{ cursor: 'pointer' }}>
            <div className="camera-label">{view}</div>
            <div
              className="camera-feed"
              style={{
                minHeight: 160,
                filter: nightVision ? 'hue-rotate(90deg) saturate(0.3) brightness(1.2)' : 'none',
                opacity: 0.7,
              }}
            >
              <div className="camera-corner tl" />
              <div className="camera-corner tr" />
              <div className="camera-corner bl" />
              <div className="camera-corner br" />
              <div style={{ fontFamily: 'Share Tech Mono', fontSize: 10, color: 'var(--accent-cyan)', opacity: 0.4, letterSpacing: 2 }}>
                {view}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
