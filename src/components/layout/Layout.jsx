import { useTelemetry } from '../../hooks/useTelemetry';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

// Create context so all pages can access telemetry
import { createContext, useContext } from 'react';

export const TelemetryContext = createContext(null);
export const useTelemetryCtx = () => useContext(TelemetryContext);

export default function Layout({ children, activePage, setActivePage }) {
  const telemetry = useTelemetry();

  return (
    <TelemetryContext.Provider value={telemetry}>
      <div className="app-layout">
        <Navbar telemetry={telemetry} />
        <div className="main-wrapper">
          <Sidebar activePage={activePage} setActivePage={setActivePage} telemetry={telemetry} />
          <main className="page-content grid-bg">
            {children}
          </main>
        </div>
      </div>
    </TelemetryContext.Provider>
  );
}
