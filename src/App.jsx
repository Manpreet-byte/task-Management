import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { TaskProvider } from './contexts/TaskContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Kanban from './pages/Kanban';
import Statistics from './pages/Statistics';
import ActivityHistory from './pages/ActivityHistory';
import Archive from './pages/Archive';
import ExportImport from './pages/ExportImport';
import Calendar from './pages/Calendar';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import Search from './pages/Search';
import Productivity from './pages/Productivity';
import TeamMembers from './pages/TeamMembers';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <TaskProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="kanban" element={<Kanban />} />
                <Route path="statistics" element={<Statistics />} />
                <Route path="history" element={<ActivityHistory />} />
                <Route path="archive" element={<Archive />} />
                <Route path="export-import" element={<ExportImport />} />
                <Route path="calendar" element={<Calendar />} />
                <Route path="settings" element={<Settings />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="search" element={<Search />} />
                <Route path="productivity" element={<Productivity />} />
                <Route path="team" element={<TeamMembers />} />
              </Route>
              <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
          </TaskProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
