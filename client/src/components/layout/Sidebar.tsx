import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Sparkles, LayoutDashboard, UserCheck, FileText, GitBranch, LogOut, Cpu } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/lib/utils';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard, exact: true },
    { name: 'AI Career Studio', path: '/dashboard/ai', icon: Cpu, exact: false },
    { name: 'Modular Profile', path: '/dashboard/profile', icon: UserCheck, exact: false },
    { name: 'Resume Studio', path: '/dashboard/resume', icon: FileText, exact: false },
    { name: 'GitHub Intelligence', path: '/dashboard/github', icon: GitBranch, exact: false },
  ];

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-slate-950 flex flex-col justify-between h-screen sticky top-0 shrink-0">
      <div className="p-6 space-y-8">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold tracking-tight text-lg text-white">Promptfolio</span>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Workspace</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                    isActive
                      ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  )
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Footer & Logout */}
      <div className="p-4 border-t border-slate-900 space-y-3 bg-slate-950/50">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold text-white shrink-0">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">{user?.name || 'Engineer'}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email || 'user@workspace.com'}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          type="button"
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
