import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import PlayerDashboard from './pages/PlayerDashboard';
import TeamOwnerDashboard from './pages/TeamOwnerDashboard';
import RefereeDashboard from './pages/RefereeDashboard';
import Tournaments from './pages/Tournaments';
import Teams from './pages/Teams';
import Players from './pages/Players';
import Matches from './pages/Matches';
import LiveScoreboard from './pages/LiveScoreboard';
import Leaderboard from './pages/Leaderboard';
import PointsTable from './pages/PointsTable';
import Auction from './pages/Auction';
import Export from './pages/Export';
import AuditLogs from './pages/AuditLogs';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import PlayerDetail from './pages/PlayerDetail';
import TeamDetail from './pages/TeamDetail';
import TournamentDetail from './pages/TournamentDetail';
import MatchDetail from './pages/MatchDetail';
import EventRegistrations from './pages/EventRegistrations';
import MyEvents from './pages/MyEvents';

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const currentUser = useStore(s => s.currentUser);
  if (!currentUser) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) return <Navigate to="/" />;
  return <>{children}</>;
}

function DashboardRouter() {
  const currentUser = useStore(s => s.currentUser);
  if (!currentUser) return <Navigate to="/login" />;
  switch (currentUser.role) {
    case 'admin': return <AdminDashboard />;
    case 'player': return <PlayerDashboard />;
    case 'team_owner': return <TeamOwnerDashboard />;
    case 'referee': return <RefereeDashboard />;
    default: return <PlayerDashboard />;
  }
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<DashboardRouter />} />
          <Route path="tournaments" element={<ProtectedRoute><Tournaments /></ProtectedRoute>} />
          <Route path="tournament/:id" element={<ProtectedRoute><TournamentDetail /></ProtectedRoute>} />
          <Route path="teams" element={<ProtectedRoute><Teams /></ProtectedRoute>} />
          <Route path="team/:id" element={<ProtectedRoute><TeamDetail /></ProtectedRoute>} />
          <Route path="players" element={<ProtectedRoute><Players /></ProtectedRoute>} />
          <Route path="player/:id" element={<ProtectedRoute><PlayerDetail /></ProtectedRoute>} />
          <Route path="matches" element={<ProtectedRoute><Matches /></ProtectedRoute>} />
          <Route path="match/:id" element={<ProtectedRoute><MatchDetail /></ProtectedRoute>} />
          <Route path="live" element={<ProtectedRoute><LiveScoreboard /></ProtectedRoute>} />
          <Route path="leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
          <Route path="points" element={<ProtectedRoute><PointsTable /></ProtectedRoute>} />
          <Route path="auction" element={<ProtectedRoute><Auction /></ProtectedRoute>} />
          <Route path="events" element={<ProtectedRoute><MyEvents /></ProtectedRoute>} />
          <Route path="registrations" element={<ProtectedRoute allowedRoles={['admin']}><EventRegistrations /></ProtectedRoute>} />
          <Route path="export" element={<ProtectedRoute allowedRoles={['admin']}><Export /></ProtectedRoute>} />
          <Route path="audit" element={<ProtectedRoute allowedRoles={['admin']}><AuditLogs /></ProtectedRoute>} />
          <Route path="chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
