import { useEffect, useRef } from 'react';

export default function OrientationCube({ orientation }) {
  const { roll, pitch, yaw } = orientation;

  // CSS 3D cube representing orientation
  const cubeStyle = {
    transform: `rotateX(${-pitch}deg) rotateY(${yaw * 0.3}deg) rotateZ(${roll}deg)`,
    transition: 'transform 0.5s ease',
    transformStyle: 'preserve-3d',
    width: 80,
    height: 80,
    position: 'relative',
  };

  const faceBase = {
    position: 'absolute',
    width: 80,
    height: 80,
    border: '1px solid rgba(0,212,255,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 10,
    fontFamily: 'Share Tech Mono',
    letterSpacing: 1,
    backfaceVisibility: 'hidden',
  };

  const faces = [
    { label: 'FRONT', style: { ...faceBase, background: 'rgba(0,212,255,0.12)', color: '#00d4ff', transform: 'translateZ(40px)' } },
    { label: 'REAR', style: { ...faceBase, background: 'rgba(0,212,255,0.06)', color: 'rgba(0,212,255,0.5)', transform: 'rotateY(180deg) translateZ(40px)' } },
    { label: 'LEFT', style: { ...faceBase, background: 'rgba(124,58,237,0.1)', color: '#a78bfa', transform: 'rotateY(-90deg) translateZ(40px)' } },
    { label: 'RIGHT', style: { ...faceBase, background: 'rgba(124,58,237,0.1)', color: '#a78bfa', transform: 'rotateY(90deg) translateZ(40px)' } },
    { label: 'TOP', style: { ...faceBase, background: 'rgba(0,255,136,0.1)', color: '#00ff88', transform: 'rotateX(90deg) translateZ(40px)' } },
    { label: 'BTM', style: { ...faceBase, background: 'rgba(255,51,102,0.08)', color: '#ff3366', transform: 'rotateX(-90deg) translateZ(40px)' } },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
      {/* 3D Cube */}
      <div style={{ perspective: 300, width: 80, height: 80 }}>
        <div style={cubeStyle}>
          {faces.map((f) => (
            <div key={f.label} style={f.style}>{f.label}</div>
          ))}
        </div>
      </div>

      {/* Values */}
      <div className="orientation-values">
        <div className="orient-val">
          <div className="orient-axis">ROLL</div>
          <div className="orient-num roll">{roll.toFixed(1)}°</div>
        </div>
        <div className="orient-val">
          <div className="orient-axis">PITCH</div>
          <div className="orient-num pitch">{pitch.toFixed(1)}°</div>
        </div>
        <div className="orient-val">
          <div className="orient-axis">YAW</div>
          <div className="orient-num yaw">{yaw.toFixed(1)}°</div>
        </div>
      </div>
    </div>
  );
}
