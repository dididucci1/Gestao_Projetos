import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Timeline from './pages/Timeline';
import Team from './pages/Team';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem('maze-theme') || 'green';
    const root = document.documentElement;
    root.classList.remove('theme-green', 'theme-dark', 'theme-blue');
    root.classList.add(`theme-${savedTheme}`);
  }, []);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/team" element={<Team />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
