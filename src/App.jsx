import { useState } from 'react';
import Layout from './components/layout/Layout';
import Overview from './pages/Overview';
import Controls from './pages/Controls';
import CameraFeed from './pages/Camera';
import Logs from './pages/Logs';
import Settings from './pages/Settings';

const PAGES = {
  overview: Overview,
  controls: Controls,
  camera: CameraFeed,
  logs: Logs,
  settings: Settings,
};

export default function App() {
  const [activePage, setActivePage] = useState('overview');

  const PageComponent = PAGES[activePage] || Overview;

  return (
    <Layout activePage={activePage} setActivePage={setActivePage}>
      <PageComponent />
    </Layout>
  );
}
