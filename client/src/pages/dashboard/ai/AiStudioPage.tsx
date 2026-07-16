import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, FileText, Mail, Share2, BookOpen, Cpu, ShieldCheck, Terminal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { PortfolioStudio } from './PortfolioStudio';
import { ResumeStudioAI } from './ResumeStudioAI';
import { CoverLetterStudio } from './CoverLetterStudio';
import { LinkedInStudio } from './LinkedInStudio';
import { ReadmeStudio } from './ReadmeStudio';

export type AiGeneratorType = 'portfolio' | 'resume' | 'cover-letter' | 'linkedin' | 'readme';

export const AiStudioPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AiGeneratorType>('portfolio');

  const studioTabs = [
    {
      id: 'portfolio' as AiGeneratorType,
      label: 'Portfolio Synthesis',
      desc: 'Structured profile data engine',
      icon: Sparkles,
      badge: 'PRO',
    },
    {
      id: 'resume' as AiGeneratorType,
      label: 'ATS Resume Tailoring',
      desc: 'Target job description matching',
      icon: FileText,
      badge: 'ATS 98+',
    },
    {
      id: 'cover-letter' as AiGeneratorType,
      label: 'Target Cover Letter',
      desc: 'Recruiter-ready narrative builder',
      icon: Mail,
    },
    {
      id: 'linkedin' as AiGeneratorType,
      label: 'LinkedIn Optimization',
      desc: 'Headlines, bio & keyword sync',
      icon: Share2,
    },
    {
      id: 'readme' as AiGeneratorType,
      label: 'README Architecture',
      desc: 'Shields.io markdown generator',
      icon: BookOpen,
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#4F46E5]">
            <Cpu className="w-3.5 h-3.5" /> AI ENGINEERING STUDIO
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight flex items-center gap-2.5">
            AI Content Studio <Sparkles className="w-5 h-5 text-[#4F46E5]" />
          </h1>
          <p className="text-sm text-[#64748B] max-w-2xl leading-relaxed">
            A cohesive workspace powered by decoupled prompt loaders and schema verification. Select a specialized studio below to generate verified candidate artifacts.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-center shrink-0">
          <Badge variant="default" className="text-xs font-mono px-3 py-1 bg-[#F8FAFC] border-[#E2E8F0] text-[#111827] font-semibold">
            <Terminal className="w-3.5 h-3.5 mr-1.5 text-[#4F46E5] inline" /> API: ONLINE
          </Badge>
          <Badge variant="success" className="text-xs font-mono px-2.5 py-1">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 inline" /> TYPE-SAFE JSON
          </Badge>
        </div>
      </div>

      {/* Workspace Navigation Bar */}
      <div className="p-1.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-wrap gap-1 items-center justify-between shadow-sm">
        {studioTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              type="button"
              className={`flex-1 min-w-[170px] flex items-center gap-3 px-4 py-2.5 rounded-xl text-left transition-all ${
                isActive
                  ? 'bg-white text-[#111827] font-bold shadow-sm border border-[#E2E8F0]'
                  : 'text-[#64748B] hover:text-[#111827] hover:bg-white/60 border border-transparent'
              }`}
            >
              <div className={`p-2 rounded-lg border shrink-0 transition-colors ${
                isActive ? 'bg-[#EEF2FF] border-[#E0E7FF] text-[#4F46E5]' : 'bg-white border-[#E2E8F0] text-[#64748B]'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-bold truncate">{tab.label}</p>
                  {tab.badge && (
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      isActive ? 'bg-[#EEF2FF] text-[#4F46E5]' : 'bg-[#F1F5F9] text-[#64748B]'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-[#64748B] truncate mt-0.5">{tab.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Unified Active Studio Canvas */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.15 }}
          className="pt-2"
        >
          {activeTab === 'portfolio' && <PortfolioStudio />}
          {activeTab === 'resume' && <ResumeStudioAI />}
          {activeTab === 'cover-letter' && <CoverLetterStudio />}
          {activeTab === 'linkedin' && <LinkedInStudio />}
          {activeTab === 'readme' && <ReadmeStudio />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AiStudioPage;
