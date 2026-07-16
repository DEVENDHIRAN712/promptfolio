import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Sparkles, LayoutDashboard, UserCheck, FileText, GitBranch, LogOut, Globe, ArrowUpRight, ShieldCheck, BarChart3, Sliders } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/lib/utils';
import api from '@/lib/axios';
import Avatar from '@/components/ui/Avatar';

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  exact: boolean;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const { data: profileData } = useQuery({
    queryKey: ['completeProfile'],
    queryFn: async () => {
      const res = await api.get('/profile/all');
      return res.data;
    },
    enabled: !!user,
  });

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const usernameSlug = user?.name ? user.name.toLowerCase().replace(/[^a-z0-9_-]/g, '-') : 'portfolio';

  const navSections: NavSection[] = [
    {
      title: 'Overview',
      items: [
        { name: 'Home Dashboard', path: '/dashboard', icon: LayoutDashboard, exact: true, badge: '⌘1' },
        { name: 'Analytics & ATS', path: '/dashboard/analytics', icon: BarChart3, exact: false },
      ],
    },
    {
      title: 'Build & Sync',
      items: [
        { name: 'Profile Builder', path: '/dashboard/profile', icon: UserCheck, exact: false, badge: '⌘2' },
        { name: 'Resume Studio', path: '/dashboard/resume', icon: FileText, exact: false, badge: '⌘3' },
        { name: 'GitHub Integration', path: '/dashboard/github', icon: GitBranch, exact: false, badge: '⌘4' },
      ],
    },
    {
      title: 'AI Suite',
      items: [
        { name: 'AI Studio', path: '/dashboard/ai', icon: Sparkles, exact: false, badge: 'NEW' },
        { name: 'Portfolio Publishing', path: '/dashboard/publishing', icon: Globe, exact: false },
      ],
    },
    {
      title: 'System',
      items: [
        { name: 'Settings', path: '/dashboard/settings', icon: Sliders, exact: false },
      ],
    },
  ];

  return (
    <aside className="w-64 border-r border-[#E2E8F0] bg-white flex flex-col justify-between h-screen sticky top-0 shrink-0 select-none shadow-sm">
      <div className="p-5 space-y-7 overflow-y-auto max-h-[calc(100vh-120px)]">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#4F46E5] flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-base text-[#111827] block leading-none">
                Promptfolio
              </span>
              <div className="flex items-center gap-1.5 mt-1 select-none">
                <span className="text-[10px] font-mono text-[#64748B] uppercase tracking-wider block">
                  v2.0
                </span>
                <span className="text-[10px] text-slate-300">&bull;</span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  <span className="text-[9px] font-mono text-[#10B981] font-bold uppercase tracking-wider">
                    Online
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Workflow Navigation Groups */}
        <div className="space-y-6">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1.5">
              <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                {section.title}
              </p>
              <nav className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.exact}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center justify-between px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-150 group',
                          isActive
                            ? 'bg-[#EEF2FF] text-[#4F46E5] font-semibold'
                            : 'text-[#64748B] hover:text-[#111827] hover:bg-[#F8FAFC]'
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className="flex items-center gap-2.5">
                            <Icon
                              className={cn(
                                'w-4 h-4 shrink-0 transition-colors',
                                isActive ? 'text-[#4F46E5]' : 'text-[#64748B] group-hover:text-[#111827]'
                              )}
                            />
                            <span>{item.name}</span>
                          </div>
                          {item.badge && (
                            <span
                              className={cn(
                                'text-[10px] font-mono px-1.5 py-0.5 rounded transition-all',
                                isActive
                                  ? 'bg-white text-[#4F46E5] font-bold shadow-sm'
                                  : 'bg-[#F1F5F9] text-[#64748B] group-hover:bg-[#E2E8F0]'
                              )}
                            >
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          ))}

          {/* Deployment Quick Link Group */}
          <div className="space-y-1.5 pt-2 border-t border-[#F1F5F9]">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
              Public Page
            </p>
            <a
              href={`/p/${usernameSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-2 rounded-lg text-xs sm:text-sm font-medium text-[#64748B] hover:text-[#111827] hover:bg-[#F8FAFC] transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-[#4F46E5] shrink-0" />
                <span>View Portfolio</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#64748B] group-hover:text-[#111827] shrink-0" />
            </a>
          </div>
        </div>
      </div>

      {/* User Footer Account Dock */}
      <div className="p-3.5 border-t border-[#E2E8F0] bg-[#F8FAFC] space-y-3">
        <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl bg-white border border-[#E2E8F0] shadow-sm">
          <div className="relative shrink-0">
            <Avatar
              src={profileData?.profile?.avatar}
              name={user?.name}
              sizeClass="w-8 h-8 rounded-lg"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#10B981] border-2 border-white" />
          </div>
          <div className="overflow-hidden flex-1">
            <div className="flex items-center gap-1">
              <p className="text-xs font-bold text-[#111827] truncate">{user?.name || 'Engineer'}</p>
              <ShieldCheck className="w-3 h-3 text-[#10B981] shrink-0" />
            </div>
            <p className="text-[11px] text-[#64748B] truncate font-mono">{user?.email || 'dev@workspace.ai'}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          type="button"
          className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#EF4444] hover:bg-[#FEF2F2] border border-transparent transition-all duration-150"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
