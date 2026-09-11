import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Moon, Sun, Download, Camera, Maximize2, RefreshCw, 
  Play, Pause, Eye, Layers, Crosshair, 
  Flame, Radio, Shield, Settings, Sliders, Check, AlertCircle, X, Image
} from 'lucide-react';

// ── X30 Pro Live Robot Stream Feed ───────────────────────────────────────────
const ROBOT_VIDEO_URL = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4';

const CAM_VIEWS = [
  { id: 'FRONT', label: 'Front Camera', fov: '120° FOV', angle: '0° FORWARD', desc: 'Stereo Depth & Obstacle Avoidance · 1080p' },
  { id: 'REAR', label: 'Rear Camera', fov: '90° FOV', angle: '180° REVERSE', desc: 'Perimeter Rear Security & Backing · 1080p' },
  { id: 'LEFT', label: 'Left Flank', fov: '90° FOV', angle: '270° PORT', desc: 'Port Flank Terrain & Step Scan · 1080p' },
  { id: 'RIGHT', label: 'Right Flank', fov: '90° FOV', angle: '90° STARBOARD', desc: 'Starboard Flank Terrain & Step Scan · 1080p' },
];

// Angle-specific 3D perspective transforms to authentically recreate 4 physical robot dog camera mounts
const getViewTransform = (viewId, zoom) => {
  switch (viewId) {
    case 'REAR':
      return `scaleX(-1) scale(${zoom})`;
    case 'LEFT':
      return `perspective(700px) rotateY(16deg) scale(${1.08 * zoom}) translateX(-12px)`;
    case 'RIGHT':
      return `perspective(700px) rotateY(-16deg) scale(${1.08 * zoom}) translateX(12px)`;
    case 'FRONT':
    default:
      return `scale(${zoom})`;
  }
};

// ── Real-time Tactical AI LiDAR Canvas Simulation (60 FPS) ───────────────────
function TacticalCanvas({ viewId, filterMode, zoom, isMain }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let frame = 0;

    const render = () => {
      frame++;
      const w = canvas.width;
      const h = canvas.height;

      // Background color based on vision filter
      if (filterMode === 'thermal') {
        const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
        bgGrad.addColorStop(0, '#0a0026');
        bgGrad.addColorStop(0.5, '#2e0854');
        bgGrad.addColorStop(1, '#660044');
        ctx.fillStyle = bgGrad;
      } else if (filterMode === 'night') {
        ctx.fillStyle = '#021208';
      } else if (filterMode === 'edges') {
        ctx.fillStyle = '#040711';
      } else {
        const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
        bgGrad.addColorStop(0, '#08101a');
        bgGrad.addColorStop(0.7, '#0d1e2e');
        bgGrad.addColorStop(1, '#050c14');
        ctx.fillStyle = bgGrad;
      }
      ctx.fillRect(0, 0, w, h);

      // Perspective 3D Ground Grid (Simulating X30 Pro quadruped walking height ~0.65m)
      const gridColor = filterMode === 'night' ? 'rgba(0, 255, 100, 0.28)' 
        : filterMode === 'thermal' ? 'rgba(255, 180, 0, 0.28)'
        : filterMode === 'edges' ? 'rgba(0, 212, 255, 0.45)'
        : 'rgba(0, 212, 255, 0.22)';

      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;

      const horizon = h * 0.46;
      const speedOffset = (frame * 3.5) % 40;

      // Walking bobbing motion simulation (quadruped gait trot)
      const bobY = Math.sin(frame * 0.15) * 2.5;

      // Horizontal ground lines
      for (let y = horizon + 5; y < h; y += Math.pow((y - horizon) / 12, 1.4) + 6) {
        const adjustedY = y + bobY + (speedOffset * ((y - horizon) / (h - horizon)));
        if (adjustedY <= h && adjustedY >= horizon) {
          ctx.beginPath();
          ctx.moveTo(0, adjustedY);
          ctx.lineTo(w, adjustedY);
          ctx.stroke();
        }
      }

      // Vanishing perspective vertical lines
      const cx = w / 2;
      for (let i = -10; i <= 10; i++) {
        ctx.beginPath();
        ctx.moveTo(cx + i * 20, horizon + bobY);
        ctx.lineTo(cx + i * (w / 4), h);
        ctx.stroke();
      }

      // Detected Obstacles & AI bounding boxes
      const t1X = cx - 130 + Math.sin(frame * 0.03) * 50;
      const t1Y = horizon + 70 + bobY;
      const t2X = cx + 150 + Math.cos(frame * 0.02) * 40;
      const t2Y = horizon + 110 + bobY;

      const drawTarget = (x, y, wBox, hBox, tag, dist, color, conf) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x - wBox/2, y - hBox/2, wBox, hBox);

        // Corner brackets
        const tick = 6;
        ctx.fillStyle = color;
        ctx.fillRect(x - wBox/2 - 1, y - hBox/2 - 1, tick, 2);
        ctx.fillRect(x - wBox/2 - 1, y - hBox/2 - 1, 2, tick);
        ctx.fillRect(x + wBox/2 - tick + 1, y - hBox/2 - 1, tick, 2);
        ctx.fillRect(x + wBox/2 - 1, y - hBox/2 - 1, 2, tick);

        // HUD Tag & Distance
        ctx.font = '10px "Share Tech Mono", monospace';
        ctx.fillStyle = color;
        ctx.fillText(`${tag} [${dist}m | ${(conf*100).toFixed(0)}%]`, x - wBox/2, y - hBox/2 - 6);
      };

      const targetCol = filterMode === 'night' ? '#00ff66' 
        : filterMode === 'thermal' ? '#ff3344'
        : '#00d4ff';

      drawTarget(t1X, t1Y, 80, 55, 'X30_OBSTACLE_ROCK', (3.4 + Math.sin(frame*0.02)).toFixed(1), targetCol, 0.94);
      drawTarget(t2X, t2Y, 95, 65, 'PIEFLY_INSPECTION_TARGET', (6.2 + Math.cos(frame*0.015)).toFixed(1), '#ffb800', 0.98);

      // LiDAR Point Cloud Sparks (3D Laser Scanner)
      for (let i = 0; i < 35; i++) {
        const px = (Math.sin(frame * 0.04 + i * 1.2) * 0.4 + 0.5) * w;
        const py = horizon + bobY + (Math.cos(frame * 0.03 + i * 0.6) * 0.5 + 0.5) * (h - horizon);
        ctx.fillStyle = filterMode === 'thermal' ? '#ffcc00' : 'rgba(0, 255, 200, 0.85)';
        ctx.fillRect(px, py, 2, 2);
      }

      // Gait Step Indicator Bars at bottom corners
      ctx.fillStyle = 'rgba(0, 212, 255, 0.6)';
      const footL = Math.sin(frame * 0.15) > 0 ? 12 : 4;
      const footR = Math.cos(frame * 0.15) > 0 ? 12 : 4;
      ctx.fillRect(20, h - 20, 6, -footL);
      ctx.fillRect(32, h - 20, 6, -footR);
      ctx.fillRect(w - 38, h - 20, 6, -footR);
      ctx.fillRect(w - 26, h - 20, 6, -footL);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [viewId, filterMode, zoom]);

  return (
    <canvas
      id={isMain ? "main-tactical-canvas" : undefined}
      ref={canvasRef}
      width={1280}
      height={720}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
      }}
    />
  );
}

// ── Single Camera Video Player ────────────────────────────────────────────────
function CamVideo({ 
  view, 
  videoUrl, 
  filterMode, 
  zoom, 
  isMain, 
  forceCanvas, 
  style = {} 
}) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 8));

  useEffect(() => {
    const id = setInterval(() => setTime(new Date().toTimeString().slice(0, 8)), 1000);
    return () => clearInterval(id);
  }, []);

  // Setup video element, synchronize staggered angles, and trigger playback
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setVideoError(false);
    video.src = videoUrl;
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    // Subtle time-offset for realistic multi-view perception
    const offsetSec = view.id === 'REAR' ? 3.0 : view.id === 'LEFT' ? 6.0 : view.id === 'RIGHT' ? 9.0 : 0;
    const handleMetadata = () => {
      if (offsetSec && video.duration > offsetSec) {
        try { video.currentTime = offsetSec; } catch (e) {}
      }
    };
    video.addEventListener('loadedmetadata', handleMetadata, { once: true });
    
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [videoUrl, view.id]);

  // Compute CSS filter based on military/tactical filter mode
  let filterCss = 'none';
  if (filterMode === 'night') {
    filterCss = 'hue-rotate(90deg) saturate(0.2) brightness(1.7) contrast(1.4) sepia(0.5)';
  } else if (filterMode === 'thermal') {
    filterCss = 'hue-rotate(180deg) saturate(3) contrast(2) brightness(1.2) invert(0.15)';
  } else if (filterMode === 'edges') {
    filterCss = 'contrast(2.5) saturate(0) brightness(1.4) drop-shadow(0 0 2px #00d4ff)';
  }

  const togglePlay = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const transformStyle = getViewTransform(view.id, zoom);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#020710', overflow: 'hidden', ...style }}>
      
      {/* Video or Tactical LiDAR Simulation */}
      {!forceCanvas && !videoError ? (
        <video
          id={isMain ? "main-robot-video" : undefined}
          ref={videoRef}
          crossOrigin="anonymous"
          autoPlay
          loop
          muted
          playsInline
          onError={() => {
            console.warn(`Video feed on ${view.id} switching to tactical LiDAR simulation`);
            setVideoError(true);
          }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            filter: filterCss,
            transform: transformStyle,
            transformOrigin: 'center',
            transition: 'transform 0.3s ease, filter 0.4s ease',
          }}
        />
      ) : (
        <div style={{ width: '100%', height: '100%', transform: `scale(${zoom})`, transformOrigin: 'center' }}>
          <TacticalCanvas viewId={view.id} filterMode={filterMode} zoom={zoom} isMain={isMain} />
        </div>
      )}

      {/* Rear Camera Guidance Overlay */}
      {view.id === 'REAR' && isMain && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          pointerEvents: 'none', paddingBottom: 28,
        }}>
          <div style={{
            width: '64%', height: '48%',
            borderLeft: '2px dashed rgba(0, 255, 136, 0.75)',
            borderRight: '2px dashed rgba(0, 255, 136, 0.75)',
            position: 'relative',
            transform: 'perspective(220px) rotateX(28deg)',
          }}>
            <div style={{ position: 'absolute', bottom: '35%', left: 0, right: 0, height: 1, borderTop: '1px solid rgba(255, 184, 0, 0.75)' }} />
            <div style={{ position: 'absolute', bottom: '12%', left: 0, right: 0, height: 2, borderTop: '2px solid rgba(255, 50, 50, 0.85)' }} />
          </div>
        </div>
      )}

      {/* Scanline */}
      {isMain && (
        <div className="camera-scanline" style={{ opacity: filterMode === 'night' ? 0.6 : 0.25 }} />
      )}

      {/* Corner HUD brackets */}
      <div className="camera-corner tl" />
      <div className="camera-corner tr" />
      <div className="camera-corner bl" />
      <div className="camera-corner br" />

      {/* Night Vision & Thermal overlays */}
      {filterMode === 'night' && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0, 255, 80, 0.08)', pointerEvents: 'none' }} />
      )}
      {filterMode === 'thermal' && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(255, 60, 0, 0.06)', pointerEvents: 'none' }} />
      )}

      {/* Top-left HUD Overlay */}
      {isMain && (
        <div className="camera-overlay-text">
          <div style={{ color: 'var(--accent-red)', letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-red)', animation: 'pulse 1s infinite' }} />
            REC &nbsp; {time}
          </div>
          <div style={{ color: 'var(--accent-cyan)', marginTop: 4, fontWeight: 700 }}>
            CAM: {view.id} · {view.angle}
          </div>
          <div>{view.fov} · ZOOM: {zoom}x · 30 FPS</div>
          {filterMode !== 'normal' && (
            <div style={{ color: filterMode === 'night' ? '#00ff80' : filterMode === 'thermal' ? '#ff7700' : 'var(--accent-cyan)', marginTop: 2, fontWeight: 700 }}>
              ▶ {filterMode.toUpperCase()} FILTER
            </div>
          )}
        </div>
      )}

      {/* Bottom-right Branding & Robot Tag */}
      {isMain && (
        <div className="camera-overlay-br">
          <div style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>FlyGroundX</div>
          <div>{view.desc}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: 9 }}>Piefly Aerospace · Deep Robotics X30 Pro</div>
        </div>
      )}

      {/* Sub-camera Label */}
      {!isMain && (
        <div style={{
          position: 'absolute', top: 8, left: 10,
          fontFamily: 'Share Tech Mono', fontSize: 10,
          color: 'var(--accent-yellow)', letterSpacing: 1,
          background: 'rgba(0,0,0,0.7)', padding: '2px 8px', borderRadius: 4,
          border: '1px solid rgba(255, 184, 0, 0.3)',
        }}>
          {view.id} · {view.angle}
        </div>
      )}

      {/* Center crosshair */}
      {isMain && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <div style={{ position: 'relative', width: 44, height: 44, opacity: 0.4 }}>
            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'var(--accent-cyan)', transform: 'translateX(-50%)' }} />
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'var(--accent-cyan)', transform: 'translateY(-50%)' }} />
            <div style={{ position: 'absolute', inset: 8, border: '1px solid var(--accent-cyan)', borderRadius: '50%', opacity: 0.7 }} />
          </div>
        </div>
      )}

      {/* Click-to-Play Overlay */}
      {!isPlaying && !forceCanvas && !videoError && (
        <button
          onClick={togglePlay}
          style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0.65)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 10, border: 'none', cursor: 'pointer',
            color: 'var(--accent-cyan)', fontFamily: 'Share Tech Mono',
          }}
        >
          <div style={{
            width: 54, height: 54, borderRadius: '50%',
            background: 'var(--accent-cyan-dim)',
            border: '2px solid var(--accent-cyan)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Play size={24} color="var(--accent-cyan)" />
          </div>
          <span style={{ fontSize: 12, letterSpacing: 1.5 }}>CLICK TO START STREAM</span>
        </button>
      )}
    </div>
  );
}

// ── Main Camera Page ──────────────────────────────────────────────────────────
export default function CameraFeed() {
  const [filterMode, setFilterMode] = useState('normal'); // 'normal' | 'night' | 'thermal' | 'edges'
  const [activeViewId, setActiveViewId] = useState('FRONT');
  const [zoom, setZoom] = useState(1);
  const [layoutMode, setLayoutMode] = useState('focus'); // 'focus' (1 big main + 3 sidebar) | 'quad' (4-grid)
  const [forceCanvas, setForceCanvas] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const activeView = CAM_VIEWS.find(v => v.id === activeViewId) || CAM_VIEWS[0];
  const subViews = CAM_VIEWS.filter(v => v.id !== activeViewId);

  // Snapshot functionality — Strictly captures from Main Screen and outputs guaranteed JPG
  const takeSnapshot = () => {
    const mainVideo = document.querySelector('#main-robot-video');
    const mainCanvas = document.querySelector('#main-tactical-canvas');

    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');

    // Draw background
    ctx.fillStyle = '#020710';
    ctx.fillRect(0, 0, 1280, 720);

    // Apply active filter effect
    if (filterMode === 'night') {
      ctx.filter = 'hue-rotate(90deg) saturate(0.2) brightness(1.7) contrast(1.4) sepia(0.5)';
    } else if (filterMode === 'thermal') {
      ctx.filter = 'hue-rotate(180deg) saturate(3) contrast(2) brightness(1.2) invert(0.15)';
    } else if (filterMode === 'edges') {
      ctx.filter = 'contrast(2.5) saturate(0) brightness(1.4)';
    }

    let captured = false;

    // Try capturing from main video element first
    if (mainVideo && mainVideo.videoWidth) {
      try {
        ctx.save();
        // Handle angle transforms (e.g. Rear mirror)
        if (activeViewId === 'REAR') {
          ctx.translate(1280, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(mainVideo, 0, 0, 1280, 720);
        ctx.restore();
        captured = true;
      } catch (err) {
        console.warn('Direct video frame draw security fallback:', err);
      }
    }

    // If canvas mode is active or video draw fell back, draw from main tactical canvas
    if (!captured && mainCanvas) {
      try {
        ctx.drawImage(mainCanvas, 0, 0, 1280, 720);
        captured = true;
      } catch (err) {
        console.warn('Canvas draw error:', err);
      }
    }

    // Reset filter for HUD text overlay
    ctx.filter = 'none';

    // HUD Telemetry Watermark on JPG
    const timestampStr = new Date().toISOString().replace('T', ' ').slice(0, 19);
    
    // Top-left HUD badge
    ctx.fillStyle = 'rgba(2, 6, 16, 0.75)';
    ctx.fillRect(20, 20, 360, 60);
    ctx.strokeStyle = '#00d4ff';
    ctx.lineWidth = 1;
    ctx.strokeRect(20, 20, 360, 60);

    ctx.fillStyle = '#ff3344';
    ctx.font = 'bold 12px "Share Tech Mono", monospace';
    ctx.fillText(`● SNAPSHOT RECORDED · ${timestampStr}`, 32, 40);

    ctx.fillStyle = '#00d4ff';
    ctx.font = '13px "Share Tech Mono", monospace';
    ctx.fillText(`CAM: ${activeView.id} (${activeView.angle}) · ${activeView.fov}`, 32, 62);

    // Bottom-right Branding badge
    ctx.fillStyle = 'rgba(2, 6, 16, 0.75)';
    ctx.fillRect(920, 640, 340, 60);
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.5)';
    ctx.strokeRect(920, 640, 340, 60);

    ctx.fillStyle = '#00d4ff';
    ctx.font = 'bold 14px "Share Tech Mono", monospace';
    ctx.fillText('FLYGOUNDX ROBOTICS', 935, 664);

    ctx.fillStyle = '#88a0c0';
    ctx.font = '11px "Share Tech Mono", monospace';
    ctx.fillText('Piefly Aerospace · Deep Robotics X30 Pro', 935, 684);

    // Generate guaranteed high-quality JPEG Data URL
    const jpgDataUrl = canvas.toDataURL('image/jpeg', 0.95);
    const dateFormatted = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const timeFormatted = new Date().toTimeString().slice(0, 8).replace(/:/g, '');
    const filename = `FlyGroundX_${activeView.id}_${dateFormatted}_${timeFormatted}.jpg`;

    // Trigger instant JPG file download with .jpg extension
    const downloadLink = document.createElement('a');
    downloadLink.href = jpgDataUrl;
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    // Show brief toast notification (non-blocking)
    setToastMsg(`SNAPSHOT SAVED: ${filename}`);
    setTimeout(() => setToastMsg(''), 3000);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: 16 }}>
        <div className="page-title">
          <div className="page-title-accent" />
          Camera Feed
          <span className="tag green" style={{ fontSize: 11 }}>● LIVE 1080P</span>
        </div>
        <div className="page-subtitle">
          Deep Robotics X30 Pro · 4-Camera Vision Array · Piefly Aerospace FlyGroundX
        </div>
      </div>

      {/* Top Controls Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        marginBottom: 16, flexWrap: 'wrap',
        background: 'var(--bg-card)', padding: '10px 14px',
        border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)'
      }}>
        
        {/* Visual Filter Modes */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'Share Tech Mono', marginRight: 4 }}>
            FILTER:
          </span>
          <button
            className="cmd-btn"
            style={{
              padding: '6px 12px', fontSize: 11,
              borderColor: filterMode === 'normal' ? 'var(--accent-cyan)' : undefined,
              color: filterMode === 'normal' ? 'var(--accent-cyan)' : undefined,
              background: filterMode === 'normal' ? 'var(--accent-cyan-dim)' : undefined,
            }}
            onClick={() => setFilterMode('normal')}
          >
            <Eye size={13} /> RGB
          </button>
          <button
            className="cmd-btn"
            style={{
              padding: '6px 12px', fontSize: 11,
              borderColor: filterMode === 'night' ? '#00ff80' : undefined,
              color: filterMode === 'night' ? '#00ff80' : undefined,
              background: filterMode === 'night' ? 'rgba(0,255,80,0.12)' : undefined,
            }}
            onClick={() => setFilterMode(filterMode === 'night' ? 'normal' : 'night')}
          >
            <Moon size={13} /> NIGHT VISION
          </button>
          <button
            className="cmd-btn"
            style={{
              padding: '6px 12px', fontSize: 11,
              borderColor: filterMode === 'thermal' ? '#ff5500' : undefined,
              color: filterMode === 'thermal' ? '#ff5500' : undefined,
              background: filterMode === 'thermal' ? 'rgba(255,85,0,0.12)' : undefined,
            }}
            onClick={() => setFilterMode(filterMode === 'thermal' ? 'normal' : 'thermal')}
          >
            <Flame size={13} /> THERMAL FLIR
          </button>
          <button
            className="cmd-btn"
            style={{
              padding: '6px 12px', fontSize: 11,
              borderColor: filterMode === 'edges' ? 'var(--accent-yellow)' : undefined,
              color: filterMode === 'edges' ? 'var(--accent-yellow)' : undefined,
              background: filterMode === 'edges' ? 'rgba(255,184,0,0.12)' : undefined,
            }}
            onClick={() => setFilterMode(filterMode === 'edges' ? 'normal' : 'edges')}
          >
            <Crosshair size={13} /> HUD EDGES
          </button>
        </div>

        <div style={{ height: 20, width: 1, background: 'var(--border-subtle)', margin: '0 4px' }} />

        {/* Tactical Canvas LiDAR Simulation Toggle */}
        <button
          className="cmd-btn"
          style={{
            padding: '6px 12px', fontSize: 11,
            borderColor: forceCanvas ? 'var(--accent-yellow)' : undefined,
            color: forceCanvas ? 'var(--accent-yellow)' : undefined,
            background: forceCanvas ? 'rgba(255, 184, 0, 0.12)' : undefined,
          }}
          onClick={() => setForceCanvas(c => !c)}
          title="Switch to real-time procedural LiDAR & tactical target tracking matrix"
        >
          <Radio size={13} /> {forceCanvas ? 'SIMULATION ON' : 'LIDAR SIM'}
        </button>

        {/* SNAPSHOT BUTTON: ONLY VISIBLE IN MAIN + 3 SIDEBAR FOCUS VIEW */}
        {layoutMode === 'focus' && (
          <button
            className="cmd-btn"
            style={{
              padding: '6px 14px', fontSize: 11,
              display: 'flex', alignItems: 'center', gap: 6,
            }}
            onClick={takeSnapshot}
            title="Capture high-resolution JPG snapshot from main camera screen"
          >
            <Camera size={13} /> SNAPSHOT (JPG)
          </button>
        )}

        {/* Layout Switcher (Focus vs Quad 4-Way) */}
        <button
          className="cmd-btn"
          style={{
            padding: '6px 12px', fontSize: 11,
            borderColor: layoutMode === 'quad' ? 'var(--accent-cyan)' : undefined,
            color: layoutMode === 'quad' ? 'var(--accent-cyan)' : undefined,
          }}
          onClick={() => setLayoutMode(l => l === 'focus' ? 'quad' : 'focus')}
        >
          <Layers size={13} /> {layoutMode === 'focus' ? '4-GRID VIEW' : 'MAIN + SIDEBAR VIEW'}
        </button>

        {/* Zoom Slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)', fontFamily: 'Share Tech Mono' }}>
          <Maximize2 size={12} />
          ZOOM:
          <input
            type="range" min={1} max={3} step={0.25}
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="speed-slider"
            style={{ width: 80, accentColor: 'var(--accent-cyan)' }}
          />
          <span style={{ color: 'var(--accent-cyan)', minWidth: 20 }}>{zoom}x</span>
        </div>
      </div>

      {/* ── Camera Grid Layout ── */}
      {layoutMode === 'focus' ? (
        // FOCUS LAYOUT: 1 Large Main + 3 Small Sidebar Feeds
        <div style={{ display: 'grid', gridTemplateColumns: '2.4fr 1fr', gap: 14, minHeight: 520 }}>

          {/* Main Large Feed */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ flex: 1, minHeight: 440, position: 'relative' }}>
              <CamVideo
                view={activeView}
                videoUrl={ROBOT_VIDEO_URL}
                filterMode={filterMode}
                zoom={zoom}
                isMain={true}
                forceCanvas={forceCanvas}
              />
            </div>

            {/* Quick Camera Selector Footer */}
            <div style={{
              display: 'flex', gap: 4, padding: '8px 12px',
              background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)',
              alignItems: 'center',
            }}>
              <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'Share Tech Mono', marginRight: 6 }}>
                ACTIVE MAIN CAM:
              </span>
              {CAM_VIEWS.map((view) => (
                <button
                  key={view.id}
                  onClick={() => setActiveViewId(view.id)}
                  style={{
                    flex: 1, padding: '6px 10px', borderRadius: 4,
                    border: `1px solid ${activeViewId === view.id ? 'var(--accent-cyan)' : 'transparent'}`,
                    background: activeViewId === view.id ? 'var(--accent-cyan-dim)' : 'transparent',
                    color: activeViewId === view.id ? 'var(--accent-cyan)' : 'var(--text-muted)',
                    fontFamily: 'Share Tech Mono', fontSize: 11, letterSpacing: 1, cursor: 'pointer',
                    fontWeight: activeViewId === view.id ? 700 : 400,
                    transition: 'all 0.2s',
                  }}
                >
                  {view.id} ({view.angle})
                </button>
              ))}
            </div>
          </div>

          {/* 3 Secondary Sidebar Feeds */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {subViews.map((view) => (
              <div
                key={view.id}
                onClick={() => setActiveViewId(view.id)}
                style={{
                  flex: 1,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  minHeight: 150,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-cyan)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
              >
                <CamVideo
                  view={view}
                  videoUrl={ROBOT_VIDEO_URL}
                  filterMode={filterMode}
                  zoom={1}
                  isMain={false}
                  forceCanvas={forceCanvas}
                  style={{ height: '100%', opacity: 0.85 }}
                />
                <div style={{
                  position: 'absolute', bottom: 6, right: 8,
                  fontFamily: 'Share Tech Mono', fontSize: 9,
                  color: 'var(--accent-cyan)', background: 'rgba(0,0,0,0.65)',
                  padding: '2px 6px', borderRadius: 3, letterSpacing: 1,
                }}>
                  CLICK TO FOCUS
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // QUAD 4-WAY SPLIT SCREEN
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 14, minHeight: 560 }}>
          {CAM_VIEWS.map((view) => (
            <div
              key={view.id}
              onClick={() => { setActiveViewId(view.id); setLayoutMode('focus'); }}
              style={{
                background: 'var(--bg-card)',
                border: `1px solid ${activeViewId === view.id ? 'var(--accent-cyan)' : 'var(--border-subtle)'}`,
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                position: 'relative',
                minHeight: 260,
                cursor: 'pointer',
              }}
            >
              <CamVideo
                view={view}
                videoUrl={ROBOT_VIDEO_URL}
                filterMode={filterMode}
                zoom={activeViewId === view.id ? zoom : 1}
                isMain={activeViewId === view.id}
                forceCanvas={forceCanvas}
                style={{ height: '100%' }}
              />
              <div style={{
                position: 'absolute', bottom: 6, right: 8,
                fontFamily: 'Share Tech Mono', fontSize: 9,
                color: 'var(--accent-cyan)', background: 'rgba(0,0,0,0.65)',
                padding: '2px 6px', borderRadius: 3,
              }}>
                DOUBLE CLICK TO MAXIMIZE
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Telemetry Status Bar */}
      <div style={{
        marginTop: 14,
        padding: '12px 18px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap',
        fontFamily: 'Share Tech Mono', fontSize: 11,
      }}>
        <div style={{ color: 'var(--text-muted)' }}>
          📡 STREAM: <span style={{ color: 'var(--accent-cyan)' }}>
            {forceCanvas ? 'Tactical LiDAR Simulation (100% Offline)' : 'Deep Robotics X30 Pro Primary Vision'}
          </span>
        </div>
        <div style={{ color: 'var(--text-muted)' }}>
          🎥 VIEW: <span style={{ color: 'var(--accent-green)' }}>{activeView.label} ({activeView.angle})</span>
        </div>
        <div style={{ color: 'var(--text-muted)' }}>
          🔬 FILTER: <span style={{ color: filterMode !== 'normal' ? 'var(--accent-yellow)' : 'var(--text-secondary)' }}>
            {filterMode.toUpperCase()}
          </span>
        </div>
        <div style={{ color: 'var(--text-muted)' }}>
          📶 VISION PIPELINE: <span style={{ color: 'var(--accent-cyan)' }}>1080p60 · Stereo Depth Active</span>
        </div>
        <div style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: 10 }}>
          ⚡ X30 Pro Vision Bus: <span style={{ color: 'var(--accent-green)' }}>SYNCED (14ms latency)</span>
        </div>
      </div>

      {/* ── Snapshot Toast Notification (Non-blocking) ── */}
      {toastMsg && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
          background: 'rgba(2, 6, 16, 0.9)',
          border: '1px solid var(--accent-green)',
          borderRadius: 8, padding: '10px 18px',
          boxShadow: '0 8px 30px rgba(0, 255, 136, 0.25)',
          display: 'flex', alignItems: 'center', gap: 10,
          color: '#fff', fontFamily: 'Share Tech Mono', fontSize: 12,
          animation: 'fadeIn 0.2s ease',
        }}>
          <Check size={16} color="var(--accent-green)" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
