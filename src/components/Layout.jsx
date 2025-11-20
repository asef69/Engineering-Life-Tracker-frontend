import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/todos', label: 'Todos', icon: '✓' },
    { path: '/routines', label: 'Routines', icon: '📚' },
    { path: '/expenses', label: 'Expenses', icon: '💰' },
    { path: '/cgpa', label: 'CGPA', icon: '🎓' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ];

  // Get user initials for avatar
  const getUserInitials = () => {
    const name = user?.name || 'User';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Top Navbar */}
      <nav className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-lg backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link 
                to="/dashboard" 
                className="group flex items-center space-x-3 transition-transform hover:scale-105"
              >
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg group-hover:bg-white/30 transition-all">
                  <span className="text-2xl">🎯</span>
                </div>
                <span className="text-2xl font-bold text-white tracking-tight">
                  Engineering Life Tracker
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-6">
              {/* User Profile Section */}
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 hover:bg-white/20 transition-all cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold shadow-lg">
                  {getUserInitials()}
                </div>
                <span className="text-white font-medium hidden sm:block">
                  {user?.name || 'User'}
                </span>
              </div>
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="group relative px-6 py-2.5 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-lg border border-white/30 hover:bg-white/30 hover:border-white/50 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <span>Logout</span>
                  <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Enhanced Sidebar */}
        <aside className="w-72 bg-white/80 backdrop-blur-lg shadow-xl border-r border-gray-200/50 min-h-[calc(100vh-5rem)]">
          <nav className="p-6">
            <div className="mb-6">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-3">
                Navigation
              </h2>
            </div>
            <ul className="space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`group relative flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 transform scale-[1.02]'
                          : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 hover:shadow-md'
                      }`}
                    >
                      {/* Active indicator */}
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                      )}
                      
                      {/* Icon */}
                      <span className={`text-xl transform transition-transform group-hover:scale-110 ${
                        isActive ? 'drop-shadow-lg' : ''
                      }`}>
                        {item.icon}
                      </span>
                      
                      {/* Label */}
                      <span className={`font-medium ${
                        isActive ? 'text-white' : 'group-hover:text-blue-700'
                      }`}>
                        {item.label}
                      </span>
                      
                      {/* Hover arrow */}
                      {!isActive && (
                        <span className="ml-auto opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all text-blue-600">
                          →
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
            
            {/* Decorative element */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="px-4 py-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl border border-purple-200/50">
                <p className="text-xs text-gray-600 font-medium">
                  🚀 Track your engineering journey
                </p>
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
};

export default Layout;

