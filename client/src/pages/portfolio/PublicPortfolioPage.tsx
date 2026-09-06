import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { IPublicPortfolioData, PortfolioThemeType } from './types';
import SeoHead from './SeoHead';
import AppleTheme from './themes/AppleTheme';
import GlassTheme from './themes/GlassTheme';
import MinimalTheme from './themes/MinimalTheme';
import CyberpunkTheme from './themes/CyberpunkTheme';
import TerminalTheme from './themes/TerminalTheme';
import ModernSaasTheme from './themes/ModernSaasTheme';
import NeoBrutalistTheme from './themes/NeoBrutalistTheme';
import AuroraPrismTheme from './themes/AuroraPrismTheme';
import CreativeStudioTheme from './themes/CreativeStudioTheme';
import ArchitectGridTheme from './themes/ArchitectGridTheme';
import { Sparkles, Palette, AlertCircle, ArrowLeft, Loader2, Info } from 'lucide-react';

const themesList: { id: PortfolioThemeType; label: string; descriptor: string; bg: string }[] = [
  { id: 'Apple', label: 'Apple Pro', descriptor: 'Clean • Premium • Product', bg: 'bg-[#111827] text-white border-blue-500' },
  { id: 'Glass', label: 'Executive Glass', descriptor: 'Elegant • Layered • Modern', bg: 'bg-indigo-950 text-indigo-200 border-indigo-500' },
  { id: 'Minimal', label: 'Swiss Minimal', descriptor: 'Monochrome • Stark • Clean', bg: 'bg-zinc-900 text-white border-zinc-700' },
  { id: 'Cyberpunk', label: 'Modern Technical', descriptor: 'Bold • Neon • Cybernetic', bg: 'bg-black text-cyan-400 border-pink-500 font-mono' },
  { id: 'Developer Terminal', label: 'Dev Terminal', descriptor: 'CLI • Interactive • Bash', bg: 'bg-slate-950 text-emerald-400 border-emerald-500 font-mono' },
  { id: 'Modern SaaS', label: 'Modern SaaS', descriptor: 'Sleek • Mesh • High-Impact', bg: 'bg-blue-900 text-white border-blue-400' },
  { id: 'Neo Brutalist', label: 'Neo Brutalist', descriptor: 'Raw • High-Contrast • Stark', bg: 'bg-yellow-300 text-black border-black font-black' },
  { id: 'Aurora Prism', label: 'Aurora Prism', descriptor: 'Vibrant • Iridescent • Glow', bg: 'bg-slate-900 text-pink-300 border-pink-500' },
  { id: 'Creative Studio', label: 'Creative Studio', descriptor: 'Gallery • Editorial • Story', bg: 'bg-stone-900 text-amber-300 border-amber-400 font-serif' },
  { id: 'Architect Grid', label: 'Architect Grid', descriptor: 'Technical • Blueprint • CAD', bg: 'bg-[#0B132B] text-cyan-300 border-cyan-500 font-mono' },
];

export const PublicPortfolioPage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [activeTheme, setActiveTheme] = useState<PortfolioThemeType | null>(null);
  const [showThemePicker, setShowThemePicker] = useState<boolean>(true);

  const { data, isLoading, isError, error } = useQuery<IPublicPortfolioData>({
    queryKey: ['publicProfile', username],
    queryFn: async () => {
      const response = await api.get(`/profile/public/${encodeURIComponent(username || '')}`);
      return response.data;
    },
    enabled: Boolean(username),
    retry: 1,
  });

  useEffect(() => {
    if (data?.profile?.theme && !activeTheme) {
      setActiveTheme(data.profile.theme);
    }
  }, [data, activeTheme]);

  const currentTheme: PortfolioThemeType = activeTheme || data?.profile?.theme || 'Apple';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-[#111827] flex flex-col items-center justify-center p-6 space-y-4 font-sans">
        <Loader2 className="w-10 h-10 text-[#4F46E5] animate-spin" />
        <h2 className="text-xl font-bold tracking-tight">Loading Candidate Portfolio...</h2>
        <p className="text-sm text-[#64748B]">Retrieving verified resume, project case studies, and skills.</p>
      </div>
    );
  }

  if (isError || !data) {
    const errMsg = (error as any)?.response?.data?.message || 'The requested portfolio could not be found or is currently private.';
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-[#111827] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="max-w-md p-8 rounded-2xl bg-white border border-[#E2E8F0] space-y-6 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-[#FEF2F2] border border-[#FEE2E2] text-[#EF4444] flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-xl font-bold">Portfolio Unavailable</h1>
            <p className="text-xs text-[#64748B] leading-relaxed">{errMsg}</p>
          </div>
          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-xs transition-all shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Promptfolio Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const renderSelectedTheme = () => {
    switch (currentTheme) {
      case 'Glass':
        return <GlassTheme data={data} theme="Glass" />;
      case 'Minimal':
        return <MinimalTheme data={data} theme="Minimal" />;
      case 'Cyberpunk':
        return <CyberpunkTheme data={data} theme="Cyberpunk" />;
      case 'Developer Terminal':
        return <TerminalTheme data={data} theme="Developer Terminal" />;
      case 'Modern SaaS':
        return <ModernSaasTheme data={data} theme="Modern SaaS" />;
      case 'Neo Brutalist':
        return <NeoBrutalistTheme data={data} theme="Neo Brutalist" />;
      case 'Aurora Prism':
        return <AuroraPrismTheme data={data} theme="Aurora Prism" />;
      case 'Creative Studio':
        return <CreativeStudioTheme data={data} theme="Creative Studio" />;
      case 'Architect Grid':
        return <ArchitectGridTheme data={data} theme="Architect Grid" />;
      case 'Apple':
      default:
        return <AppleTheme data={data} theme="Apple" />;
    }
  };

  const activeThemeObj = themesList.find((t) => t.id === currentTheme) || themesList[0];

  return (
    <div className="relative">
      <SeoHead data={data} slug={username || ''} />

      {/* Render Theme */}
      {renderSelectedTheme()}

      {/* Floating Theme Preview Switcher Bar */}
      {showThemePicker && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col sm:flex-row items-center gap-2 p-2.5 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 shadow-2xl max-w-[95vw] sm:max-w-full overflow-x-auto text-slate-100">
          <div className="flex items-center gap-2 px-3 py-1 text-xs font-bold shrink-0 border-b sm:border-b-0 sm:border-r border-slate-700 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-1.5 text-indigo-400">
              <Palette className="w-4 h-4" />
              <span>Theme Switcher</span>
            </div>
            <span className="hidden md:inline-block text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
              {activeThemeObj.descriptor}
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full no-scrollbar">
            {themesList.map((t) => {
              const isSelected = currentTheme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTheme(t.id)}
                  type="button"
                  title={`${t.label}: ${t.descriptor}`}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
                    isSelected
                      ? `${t.bg} shadow-md scale-102 border-indigo-400 ring-2 ring-indigo-400/40`
                      : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {isSelected && <Sparkles className="w-3 h-3 text-amber-300" />}
                  {t.label}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setShowThemePicker(false)}
            type="button"
            className="px-2.5 py-1 text-[10px] uppercase font-bold text-slate-400 hover:text-white shrink-0 ml-auto sm:ml-1"
            title="Hide Switcher"
          >
            Hide
          </button>
        </div>
      )}

      {/* Show Pill if Hidden */}
      {!showThemePicker && (
        <button
          onClick={() => setShowThemePicker(true)}
          type="button"
          className="fixed bottom-6 right-6 z-50 p-3.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-2xl transition-transform hover:scale-105 flex items-center gap-2 text-xs font-bold border border-indigo-400/40"
          title="Open Theme Switcher"
        >
          <Palette className="w-4 h-4" />
          <span className="hidden sm:inline">Change Theme ({themesList.length})</span>
        </button>
      )}
    </div>
  );
};

export default PublicPortfolioPage;
