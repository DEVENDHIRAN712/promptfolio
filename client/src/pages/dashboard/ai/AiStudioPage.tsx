import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, FileText, Mail, Share2, BookOpen, Cpu, ShieldCheck, Zap } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PortfolioStudio } from './PortfolioStudio';
import { ResumeStudioAI } from './ResumeStudioAI';
import { CoverLetterStudio } from './CoverLetterStudio';
import { LinkedInStudio } from './LinkedInStudio';
import { ReadmeStudio } from './ReadmeStudio';

export type AiGeneratorType = 'portfolio' | 'resume' | 'cover-letter' | 'linkedin' | 'readme';

export const AiStudioPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AiGeneratorType>('portfolio');

  const generatorCards = [
    {
      id: 'portfolio' as AiGeneratorType,
      title: 'Portfolio Generator',
      subtitle: 'Structured JSON Architecture',
      description: 'Synthesizes your bio, experience, competencies, and case studies into recruiter-ready structured JSON (never HTML).',
      icon: Sparkles,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      activeColor: 'from-blue-600 to-indigo-600',
    },
    {
      id: 'resume' as AiGeneratorType,
      title: 'Resume Generator',
      subtitle: 'ATS / Modern / Minimal',
      description: 'Tailors your entire candidate history directly to target job titles with ATS keyword scoring and quantifiable bullet points.',
      icon: FileText,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      activeColor: 'from-purple-600 to-indigo-600',
    },
    {
      id: 'cover-letter' as AiGeneratorType,
      title: 'Cover Letter Studio',
      subtitle: 'Job Description Aligned',
      description: 'Maps your exact engineering achievements to the target company requirements with high-converting recruiter opening hooks.',
      icon: Mail,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      activeColor: 'from-emerald-600 to-teal-600',
    },
    {
      id: 'linkedin' as AiGeneratorType,
      title: 'LinkedIn Makeover',
      subtitle: 'Headlines, Bio & Rewrites',
      description: 'Generates 3 algorithm-optimized headline variations, an authoritative narrative About section, and scannable role rewrites.',
      icon: Share2,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/20',
      activeColor: 'from-cyan-600 to-blue-600',
    },
    {
      id: 'readme' as AiGeneratorType,
      title: 'GitHub README',
      subtitle: 'Production Markdown',
      description: 'Generates world-class README.md documentation complete with shields.io badges, installation snippets, and architecture notes.',
      icon: BookOpen,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
      activeColor: 'from-amber-600 to-orange-600',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-blue-950/40 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <Badge className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30 font-mono text-xs px-3 py-1">
              <Cpu className="w-3.5 h-3.5 mr-1 text-blue-400 inline animate-pulse" /> GEMINI 2.5 AI ENGINE
            </Badge>
            <Badge variant="outline" className="text-xs font-mono text-emerald-400 border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 inline" /> TYPE-SAFE &amp; VERIFIED
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            AI Career Intelligence Studio <Sparkles className="w-7 h-7 text-blue-400 animate-spin-slow" />
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
            Your personal AI engineering team. Powered by decoupled architecture, exponential backoff retries, and strict JSON verification to transform your profile into world-class career assets.
          </p>
        </div>

        <div className="flex flex-row md:flex-col items-start md:items-end gap-2 shrink-0 relative z-10 font-mono text-xs">
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 space-y-1">
            <span className="text-slate-500 block text-[11px] uppercase tracking-wider font-bold">API Status</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Online &amp; Ready
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Generator Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {generatorCards.map((card) => {
          const Icon = card.icon;
          const isActive = activeTab === card.id;

          return (
            <motion.button
              key={card.id}
              onClick={() => setActiveTab(card.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between h-full ${
                isActive
                  ? 'bg-slate-900/90 border-blue-500 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/50'
                  : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/70 hover:border-slate-700'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeStudioGlow"
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/5 pointer-events-none"
                />
              )}
              <div className="space-y-3 relative z-10">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl ${card.bgColor} border ${card.borderColor} flex items-center justify-center ${card.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {isActive && (
                    <Badge className="bg-blue-600 text-white text-[10px] uppercase font-bold px-2 py-0.5">
                      Active
                    </Badge>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">{card.title}</h3>
                  <span className="text-[11px] font-mono text-slate-400 block mt-0.5">{card.subtitle}</span>
                </div>

                <p className="text-xs text-slate-400/90 leading-normal line-clamp-2">
                  {card.description}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-slate-400 relative z-10">
                <span>Open Studio</span>
                <Zap className={`w-3.5 h-3.5 ${isActive ? card.color : 'text-slate-600'}`} />
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Active Generator Studio Workspace */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="pt-2"
      >
        {activeTab === 'portfolio' && <PortfolioStudio />}
        {activeTab === 'resume' && <ResumeStudioAI />}
        {activeTab === 'cover-letter' && <CoverLetterStudio />}
        {activeTab === 'linkedin' && <LinkedInStudio />}
        {activeTab === 'readme' && <ReadmeStudio />}
      </motion.div>
    </div>
  );
};

export default AiStudioPage;
