import React from 'react';
import { ShieldCheck, Cpu, Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/useAuthStore';

export const Navbar: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur sticky top-0 z-40 px-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h1 className="text-sm font-bold text-slate-200">
          Career OS &bull; <span className="text-white font-mono">{user?.name}&apos;s Workspace</span>
        </h1>
        <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] uppercase font-bold px-2 py-0.5">
          <ShieldCheck className="w-3 h-3 mr-1 inline" /> Active Session
        </Badge>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-full">
          <Cpu className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
          <span>AI Engine: OPTIMIZED</span>
        </div>

        <button
          type="button"
          className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors relative"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
