import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ShieldCheck, Bell, Search, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/useAuthStore';
import { useToast } from '@/components/ui/toast';
import api from '@/lib/axios';
import Avatar from '@/components/ui/Avatar';

export const Navbar: React.FC = () => {
  const { user } = useAuthStore();
  const { toast } = useToast();

  const { data: profileData } = useQuery({
    queryKey: ['completeProfile'],
    queryFn: async () => {
      const res = await api.get('/profile/all');
      return res.data;
    },
    enabled: !!user,
  });

  const handleCommandMenu = () => {
    toast({
      title: "Quick Command Search",
      description: "Use ⌘K to jump between profile sections and AI tools.",
      type: "info"
    });
  };

  const usernameSlug = profileData?.profile?.username || (user?.name ? user.name.toLowerCase().replace(/[^a-z0-9_-]/g, '-') : 'portfolio');

  return (
    <header className="h-16 border-b border-[#E2E8F0] bg-white sticky top-0 z-40 px-6 sm:px-8 flex items-center justify-between transition-all duration-150 shadow-sm">
      {/* Left: Breadcrumbs & Status */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#111827]">
          <span className="text-[#64748B]">Dashboard</span>
          <span className="text-[#CBD5E1]">/</span>
          <span className="text-[#111827] font-bold">Overview</span>
        </div>
        <Badge variant="success" showDot className="hidden sm:inline-flex px-2.5 py-0.5 text-[11px]">
          Live Workspace
        </Badge>
      </div>

      {/* Center: Search Bar Trigger */}
      <div className="hidden md:flex items-center max-w-md w-full mx-4">
        <button
          onClick={handleCommandMenu}
          type="button"
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-white hover:border-[#CBD5E1] text-xs text-[#64748B] transition-all duration-150 group shadow-sm"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-[#64748B] group-hover:text-[#111827] transition-colors" />
            <span className="group-hover:text-[#111827] transition-colors">Search repositories, documents, or settings...</span>
          </div>
          <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white border border-[#E2E8F0] text-[10px] font-mono font-medium text-[#64748B] shadow-sm">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Quick Actions & Preview */}
      <div className="flex items-center gap-3">
        <a
          href={`/p/${usernameSlug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-xs font-semibold text-white transition-all shadow-sm"
        >
          <span>Preview Portfolio</span>
          <ExternalLink className="w-3.5 h-3.5 text-indigo-100" />
        </a>

        <button
          type="button"
          onClick={() => toast({ title: "Workspace Status", description: `Your profile completion score is currently ${profileData?.completionPercentage || 0}%.`, type: "info" })}
          className="w-9 h-9 rounded-lg bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#111827] transition-all relative shadow-sm"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#4F46E5]" />
        </button>

        <div className="h-8 w-px bg-[#E2E8F0] mx-1 hidden sm:block" />

        <Link to="/dashboard/profile" className="shrink-0">
          <Avatar
            src={profileData?.profile?.avatar}
            name={user?.name}
            sizeClass="w-9 h-9 rounded-lg"
          />
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
