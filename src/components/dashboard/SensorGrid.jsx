// IMU + LiDAR sensor grid
export function SensorGrid({ imu }) {
  const sensors = [
    { name: 'ACC-X', value: imu.ax.toFixed(3), unit: 'm/s²', color: '#ff6b6b' },
    { name: 'ACC-Y', value: imu.ay.toFixed(3), unit: 'm/s²', color: '#00ff88' },
    { name: 'ACC-Z', value: imu.az.toFixed(3), unit: 'm/s²', color: '#00d4ff' },
    { name: 'GYR-X', value: imu.gx.toFixed(2), unit: '°/s', color: '#ff6b6b' },
    { name: 'GYR-Y', value: imu.gy.toFixed(2), unit: '°/s', color: '#00ff88' },
    { name: 'GYR-Z', value: imu.gz.toFixed(2), unit: '°/s', color: '#00d4ff' },
  ];

  return (
    <div className="sensor-grid">
      {sensors.map(({ name, value, unit, color }) => (
        <div className="sensor-item" key={name}>
          <div className="sensor-name">{name}</div>
          <div className="sensor-value" style={{ color }}>
            {value}
            <span className="sensor-unit">{unit}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function LidarGrid({ lidar }) {
  const directions = [
    { dir: '▲ FRONT', value: lidar.front },
    { dir: '▼ REAR', value: lidar.rear },
    { dir: '◄ LEFT', value: lidar.left },
    { dir: '► RIGHT', value: lidar.right },
  ];

  const getBarWidth = (val) => Math.min((val / 10) * 100, 100);
  const getColor = (val) => val < 1 ? 'var(--accent-red)' : val < 2 ? 'var(--accent-yellow)' : 'var(--accent-yellow)';

  return (
    <div className="lidar-grid">
      {directions.map(({ dir, value }) => (
        <div className="lidar-item" key={dir}>
          <div className="lidar-dir">{dir}</div>
          <div className="lidar-dist" style={{ color: getColor(value) }}>
            {value.toFixed(1)}<span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 2 }}>m</span>
          </div>
          <div className="lidar-bar">
            <div className="lidar-bar-fill" style={{ width: `${getBarWidth(value)}%`, background: `linear-gradient(90deg, ${getColor(value)}, transparent)` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
