import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { LayoutDashboard, Trophy, Users, UserCircle, Calendar, Radio, BarChart3, Table, Hammer, Download, FileText, MessageCircle, Bell, LogOut, Menu, X, Shield } from 'lucide-react';
import { useState } from 'react';

export default function Layout() {
  const { currentUser, logout, notifications } = useStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const unreadCount = notifications.filter(n => n.userId === currentUser?.id && !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/tournaments', icon: Trophy, label: 'Tournaments' },
    { to: '/teams', icon: Users, label: 'Teams' },
    { to: '/players', icon: UserCircle, label: 'Players' },
    { to: '/matches', icon: Calendar, label: 'Matches' },
    { to: '/live', icon: Radio, label: 'Live Scoreboard' },
    { to: '/leaderboard', icon: BarChart3, label: 'Leaderboard' },
    { to: '/points', icon: Table, label: 'Points Table' },
    { to: '/auction', icon: Hammer, label: 'Auction' },
    { to: '/chat', icon: MessageCircle, label: 'Chat' },
    { to: '/profile', icon: UserCircle, label: 'My Profile' },
    { to: '/notifications', icon: Bell, label: `Notifications${unreadCount > 0 ? ` (${unreadCount})` : ''}` },
  ];

  const adminItems = [
    { to: '/export', icon: Download, label: 'Export Data' },
    { to: '/audit', icon: FileText, label: 'Audit Logs' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-indigo-900 to-purple-900 text-white transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:in-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 border-b border-indigo-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-yellow-300" />
            </div>
            <div>
              <h1 className="font-bold text-sm">Campus Sports</h1>
              <p className="text-xs text-indigo-300">Management System</p>
            </div>
          </div>
        </div>

        <div className="p-4 border-b border-indigo-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">
              {currentUser?.fullName?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{currentUser?.fullName}</p>
              <p className="text-xs text-indigo-300 capitalize">{currentUser?.role?.replace('_', ' ')}</p>
            </div>
            {currentUser?.role === 'admin' && <Shield className="w-4 h-4 text-yellow-300" />}
          </div>
        </div>

        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-200px)]">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive ? 'bg-white/20 text-white font-medium' : 'text-indigo-200 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          ))}
          {currentUser?.role === 'admin' && (
            <>
              <div className="border-t border-indigo-700 my-3 pt-3">
                <p className="text-xs text-indigo-400 px-3 mb-2">ADMIN</p>
              </div>
              {adminItems.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive ? 'bg-white/20 text-white font-medium' : 'text-indigo-200 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </>
          )}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-indigo-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-indigo-200 hover:bg-white/10 hover:text-white w-full transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center gap-4 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-800">
              {currentUser?.role === 'admin' ? 'Admin Panel' : 
               currentUser?.role === 'player' ? 'Player Portal' :
               currentUser?.role === 'team_owner' ? 'Team Management' :
               currentUser?.role === 'referee' ? 'Referee Portal' : 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <NavLink to="/notifications" className="relative p-2 rounded-lg hover:bg-gray-100">
              <Bell className="w-5 h-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </NavLink>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
