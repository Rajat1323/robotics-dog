import { motion } from 'framer-motion';
import {
  Battery, Zap, Thermometer, Wifi,
  Activity, Cpu, Radio
} from 'lucide-react';
import { useTelemetryCtx } from '../components/layout/Layout';
import StatCard from '../components/dashboard/StatCard';
import { SpeedChart, PowerChart } from '../components/dashboard/SpeedChart';
import TorqueChart from '../components/dashboard/TorqueChart';
import OrientationCube from '../components/dashboard/OrientationCube';
import GaitSelector from '../components/dashboard/GaitSelector';
import FootContactMap from '../components/dashboard/FootContactMap';
import { SensorGrid, LidarGrid } from '../components/dashboard/SensorGrid';

export default function Overview() {
  const {
    battery, speed, temperature, signal, signalStrength,
    orientation, imu, lidar, footContact, torque, power,
    gait, setGait, speedHistory, powerHistory,
  } = useTelemetryCtx();

  const tempColor = temperature > 60 ? 'red' : temperature > 50 ? 'yellow' : 'green';
  const sigColor = signal > -65 ? 'green' : signal > -75 ? 'yellow' : 'red';

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title">
          <div className="page-title-accent" />
          Dashboard Overview
          <span className="tag cyan" style={{ fontSize: 11 }}>LIVE</span>
        </div>
        <div className="page-subtitle">
          Real-time telemetry · FlyGroundX Platform · Powered by Piefly Aerospace
        </div>
      </div>

      {/* Stat Cards */}
      <div className="stat-cards-grid">
        <StatCard
          label="Battery Level"
          value={battery.toFixed(1)}
          unit="%"
          color="green"
          icon={Battery}
          trend={-1}
          trendLabel="Draining"
        />
        <StatCard
          label="Current Speed"
          value={speed.toFixed(2)}
          unit="m/s"
          color="cyan"
          icon={Zap}
          trend={1}
          trendLabel="Live"
        />
        <StatCard
          label="Body Temp"
          value={temperature.toFixed(1)}
          unit="°C"
          color={tempColor}
          icon={Thermometer}
          trendLabel="Nominal"
        />
        <StatCard
          label="Signal"
          value={signal}
          unit="dBm"
          color={sigColor}
          icon={Wifi}
          trendLabel={signalStrength}
        />
      </div>

      {/* Charts Row */}
      <div className="charts-grid">
        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-8">
              <div className="card-accent-line" />
              <span className="card-title">Velocity Over Time</span>
            </div>
            <span className="tag cyan">m/s</span>
          </div>
          <SpeedChart data={speedHistory} />
        </div>

        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-8">
              <div className="card-accent-line" style={{ background: 'linear-gradient(180deg, #7c3aed, transparent)' }} />
              <span className="card-title">Power Consumption</span>
            </div>
            <span className="tag cyan" style={{ color: '#a78bfa', borderColor: 'rgba(124,58,237,0.3)', background: 'rgba(124,58,237,0.1)' }}>
              {power}W
            </span>
          </div>
          <PowerChart data={powerHistory} />
        </div>
      </div>

      {/* Bottom Grid: Orientation | Torque | Gait | Foot | IMU | LiDAR */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
        {/* Orientation Cube */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-8">
              <div className="card-accent-line" />
              <span className="card-title">Orientation (IMU)</span>
            </div>
          </div>
          <OrientationCube orientation={orientation} />
        </div>

        {/* Torque */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-8">
              <div className="card-accent-line" />
              <span className="card-title">Joint Torque</span>
            </div>
            <span className="tag cyan">Nm</span>
          </div>
          <TorqueChart torque={torque} />
        </div>

        {/* Gait */}
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
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr 1.4fr', gap: 16 }}>
        {/* Foot Contact */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-8">
              <div className="card-accent-line" />
              <span className="card-title">Foot Contact</span>
            </div>
          </div>
          <FootContactMap footContact={footContact} />
        </div>

        {/* IMU Sensors */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-8">
              <div className="card-accent-line" />
              <span className="card-title">IMU Sensors</span>
            </div>
            <span className="tag cyan">LIVE</span>
          </div>
          <SensorGrid imu={imu} />
        </div>

        {/* LiDAR */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-8">
              <div className="card-accent-line" style={{ background: 'linear-gradient(180deg, var(--accent-yellow), transparent)' }} />
              <span className="card-title">LiDAR Distances</span>
            </div>
            <span className="tag yellow">360°</span>
          </div>
          <LidarGrid lidar={lidar} />
        </div>
      </div>
    </div>
  );
}
