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
import { Sparkles, Palette, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';

const themesList: { id: PortfolioThemeType; label: string; bg: string }[] = [
  { id: 'Apple', label: 'Apple Pro', bg: 'bg-[#F8FAFC] text-[#111827] border-[#E2E8F0]' },
  { id: 'Glass', label: 'Executive Glass', bg: 'bg-[#EEF2FF] text-[#4F46E5] border-[#E0E7FF]' },
  { id: 'Minimal', label: 'Swiss Minimal', bg: 'bg-white text-[#111827] border-[#111827]' },
  { id: 'Cyberpunk', label: 'Modern Technical', bg: 'bg-[#F8FAFC] text-[#4F46E5] border-[#4F46E5] font-mono font-bold' },
  { id: 'Developer Terminal', label: 'Dev Terminal', bg: 'bg-[#F1F5F9] text-[#111827] border-[#CBD5E1] font-mono' },
  { id: 'Modern SaaS', label: 'Modern SaaS', bg: 'bg-[#4F46E5] text-white border-[#4F46E5]' },
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
      case 'Apple':
      default:
        return <AppleTheme data={data} theme="Apple" />;
    }
  };

  return (
    <div className="relative">
      <SeoHead data={data} slug={username || ''} />

      {/* Render Theme */}
      {renderSelectedTheme()}

      {/* Floating Theme Preview Switcher Bar */}
      {showThemePicker && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 p-2 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E2E8F0] shadow-lg max-w-full overflow-x-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#111827] border-r border-[#E2E8F0] shrink-0">
            <Palette className="w-4 h-4 text-[#4F46E5]" />
            <span className="hidden sm:inline">Theme Switcher:</span>
          </div>

          <div className="flex items-center gap-1.5">
            {themesList.map((t) => {
              const isSelected = currentTheme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTheme(t.id)}
                  type="button"
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
                    isSelected
                      ? `${t.bg} shadow-sm scale-102 border-[#4F46E5]`
                      : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] hover:text-[#111827] hover:bg-white'
                  }`}
                >
                  {isSelected && <Sparkles className="w-3 h-3" />}
                  {t.label}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setShowThemePicker(false)}
            type="button"
            className="px-2 py-1 text-[10px] uppercase font-bold text-[#64748B] hover:text-[#111827] shrink-0 ml-1"
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
          className="fixed bottom-6 right-6 z-50 p-3.5 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white shadow-lg transition-transform hover:scale-105 flex items-center gap-2 text-xs font-bold"
          title="Open Theme Switcher"
        >
          <Palette className="w-4 h-4" />
          <span className="hidden sm:inline">Change Theme</span>
        </button>
      )}
    </div>
  );
};

export default PublicPortfolioPage;
