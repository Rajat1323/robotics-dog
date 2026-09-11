// Simulated real-time telemetry hook for X30 Pro
import { useState, useEffect, useRef } from 'react';

const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
const rand = (min, max) => Math.random() * (max - min) + min;
const randInt = (min, max) => Math.floor(rand(min, max));

const generateLogEntry = () => {
  const levels = ['INFO', 'INFO', 'INFO', 'WARN', 'DEBUG', 'ERROR'];
  const messages = {
    INFO: [
      'Gait controller: TROT mode active',
      'Foot contact FL: GROUNDED',
      'IMU calibration: OK',
      'Battery management system: NOMINAL',
      'Joint torque FL_HIP: 24.3 Nm',
      'Navigation module: STANDBY',
      'Payload interface: IDLE',
      'Telemetry uplink: 5G connected',
      'Thermal management: NOMINAL',
      'Position estimate updated',
    ],
    WARN: [
      'LiDAR FRONT: obstacle at 0.8m',
      'Battery: 35% remaining — consider recharging',
      'Joint temp RL_KNEE: 67°C',
      'Signal strength dropped to -72 dBm',
      'High torque demand on FR_HIP',
    ],
    ERROR: [
      'COMM: packet loss 12% on uplink',
      'Foot sensor FR: intermittent contact',
    ],
    DEBUG: [
      'Tick: 1042ms elapsed',
      'State machine: WALK → TROT transition',
      'PID loop: kp=1.2 ki=0.05 kd=0.8',
    ],
  };

  const level = levels[randInt(0, levels.length)];
  const msgs = messages[level];
  const msg = msgs[randInt(0, msgs.length)];
  const now = new Date();
  const time = now.toTimeString().slice(0, 8);
  return { id: Date.now() + Math.random(), time, level, msg };
};

export function useTelemetry() {
  const [battery, setBattery] = useState(78);
  const [speed, setSpeed] = useState(2.4);
  const [temperature, setTemperature] = useState(42.1);
  const [signal, setSignal] = useState(-58);
  const [orientation, setOrientation] = useState({ roll: 2.1, pitch: -1.3, yaw: 47.5 });
  const [imu, setImu] = useState({ ax: 0.12, ay: -0.08, az: 9.81, gx: 0.5, gy: -0.3, gz: 0.1 });
  const [lidar, setLidar] = useState({ front: 3.2, rear: 5.1, left: 1.8, right: 2.6 });
  const [footContact, setFootContact] = useState({ FL: true, FR: true, RL: true, RR: true });
  const [torque, setTorque] = useState({ FL: 18.4, FR: 20.1, RL: 17.8, RR: 19.5 });
  const [power, setPower] = useState(312);
  const [gait, setGait] = useState('TROT');
  const [connected, setConnected] = useState(true);
  const [uptime, setUptime] = useState(0);
  const [logs, setLogs] = useState(() => {
    const initial = [];
    for (let i = 0; i < 20; i++) initial.push(generateLogEntry());
    return initial;
  });

  // Speed history for chart
  const [speedHistory, setSpeedHistory] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({ t: i, v: rand(1.5, 3.5) }))
  );

  // Power history
  const [powerHistory, setPowerHistory] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({ t: i, v: randInt(250, 380) }))
  );

  const uptimeRef = useRef(uptime);
  uptimeRef.current = uptime;

  useEffect(() => {
    const interval = setInterval(() => {
      // Battery drains slowly
      setBattery(b => clamp(b - rand(0, 0.02), 0, 100));

      // Speed fluctuates
      setSpeed(s => clamp(s + rand(-0.3, 0.3), 0, 7));

      // Temperature
      setTemperature(t => clamp(t + rand(-0.2, 0.3), 30, 70));

      // Signal
      setSignal(s => clamp(s + randInt(-3, 3), -90, -20));

      // Orientation
      setOrientation(o => ({
        roll: clamp(o.roll + rand(-1, 1), -30, 30),
        pitch: clamp(o.pitch + rand(-1, 1), -30, 30),
        yaw: ((o.yaw + rand(-2, 2)) % 360 + 360) % 360,
      }));

      // IMU
      setImu({
        ax: rand(-0.5, 0.5),
        ay: rand(-0.5, 0.5),
        az: 9.81 + rand(-0.2, 0.2),
        gx: rand(-2, 2),
        gy: rand(-2, 2),
        gz: rand(-1, 1),
      });

      // LiDAR
      setLidar({
        front: clamp(rand(0.5, 8), 0.3, 10),
        rear: clamp(rand(1, 10), 0.5, 12),
        left: clamp(rand(0.5, 6), 0.3, 8),
        right: clamp(rand(0.5, 6), 0.3, 8),
      });

      // Foot contact
      setFootContact({
        FL: Math.random() > 0.05,
        FR: Math.random() > 0.05,
        RL: Math.random() > 0.05,
        RR: Math.random() > 0.05,
      });

      // Torque
      setTorque({
        FL: rand(10, 35),
        FR: rand(10, 35),
        RL: rand(10, 35),
        RR: rand(10, 35),
      });

      // Power
      setPower(randInt(250, 420));

      // Speed history
      setSpeedHistory(h => {
        const next = [...h.slice(1), { t: h[h.length - 1].t + 1, v: clamp(h[h.length - 1].v + rand(-0.5, 0.5), 0, 7) }];
        return next;
      });

      // Power history
      setPowerHistory(h => {
        const next = [...h.slice(1), { t: h[h.length - 1].t + 1, v: randInt(250, 420) }];
        return next;
      });

      // Uptime
      setUptime(u => u + 1);

      // Logs (occasionally)
      if (Math.random() < 0.4) {
        setLogs(l => [generateLogEntry(), ...l.slice(0, 199)]);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatUptime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const signalStrength = signal > -50 ? 'EXCELLENT' : signal > -65 ? 'GOOD' : signal > -75 ? 'FAIR' : 'WEAK';

  return {
    battery, speed, temperature, signal, signalStrength,
    orientation, imu, lidar, footContact, torque, power,
    gait, setGait,
    connected, setConnected,
    uptime, uptimeFormatted: formatUptime(uptime),
    logs, speedHistory, powerHistory,
  };
}
