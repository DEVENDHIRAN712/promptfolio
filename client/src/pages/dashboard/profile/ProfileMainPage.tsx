import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { User, Briefcase, BookOpen, Cpu, Layers, Award, Sparkles } from 'lucide-react';
import { AboutSection } from './AboutSection';
import { ExperienceSection } from './ExperienceSection';
import { EducationSection } from './EducationSection';
import { SkillsSection } from './SkillsSection';
import { ProjectsSection } from './ProjectsSection';
import { CertificatesSection } from './CertificatesSection';
import api from '@/lib/axios';

export const ProfileMainPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'about' | 'experience' | 'education' | 'skills' | 'projects' | 'certificates'>('about');

  const { data, isLoading, error } = useQuery({
    queryKey: ['completeProfile'],
    queryFn: async () => {
      const res = await api.get('/profile/all');
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96 text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
          <span className="text-sm font-medium">Loading modular profile sections...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-center">
        <p className="font-bold">Failed to load profile data.</p>
        <p className="text-xs mt-1">{(error as Error).message}</p>
      </div>
    );
  }

  const tabs = [
    { id: 'about', label: 'About & Identity', icon: User, count: null },
    { id: 'experience', label: 'Experience', icon: Briefcase, count: data?.experiences?.length || 0 },
    { id: 'education', label: 'Education', icon: BookOpen, count: data?.educations?.length || 0 },
    { id: 'skills', label: 'Skills', icon: Cpu, count: data?.skills?.length || 0 },
    { id: 'projects', label: 'Projects', icon: Layers, count: data?.projects?.length || 0 },
    { id: 'certificates', label: 'Certificates', icon: Award, count: data?.certificates?.length || 0 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400">
            <Sparkles className="w-3.5 h-3.5" /> MODULAR CAREER PROFILE
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Profile Sections Architecture
          </h1>
          <p className="text-sm text-slate-400">
            Each section operates independently. Edit your work roles without touching your summary or degrees.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
          <span>COMPLETION:</span>
          <span className="text-blue-400 font-bold text-sm">{data?.completionPercentage || 0}%</span>
        </div>
      </div>

      {/* Navigation Tabs Pill Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800/60 no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shrink-0 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800/80'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className={`text-[11px] font-mono px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Render Active Section Component */}
      <div className="pt-2">
        {activeTab === 'about' && <AboutSection profile={data?.profile} />}
        {activeTab === 'experience' && <ExperienceSection experiences={data?.experiences || []} />}
        {activeTab === 'education' && <EducationSection educations={data?.educations || []} />}
        {activeTab === 'skills' && <SkillsSection skills={data?.skills || []} />}
        {activeTab === 'projects' && <ProjectsSection projects={data?.projects || []} />}
        {activeTab === 'certificates' && <CertificatesSection certificates={data?.certificates || []} />}
      </div>
    </div>
  );
};

export default ProfileMainPage;
