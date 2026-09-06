import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  BarChart3, ShieldCheck, CheckCircle2, AlertTriangle, 
  Sparkles, Zap, FileText, Target, 
  Award, Briefcase, ChevronRight, GitBranch
} from 'lucide-react';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/axios';

export const AnalyticsPage: React.FC = () => {
  const [selectedRange, setSelectedRange] = useState<'30d' | '90d' | 'all'>('30d');

  const { data: profileData } = useQuery({
    queryKey: ['completeProfile'],
    queryFn: async () => {
      const res = await api.get('/profile/all');
      return res.data;
    },
  });

  const { data: resumesData } = useQuery({
    queryKey: ['userResumes'],
    queryFn: async () => {
      const res = await api.get('/resume');
      return res.data.resumes;
    },
  });

  const latestResume = resumesData && resumesData.length > 0 ? resumesData[0] : null;
  const completion = profileData?.completionPercentage || 0;
  const github = profileData?.githubConnection;

  const diagnosticItems = [
    {
      id: 'ats-keywords',
      title: 'ATS Resume Document Readability',
      status: latestResume ? (latestResume.healthScore >= 80 ? 'optimal' : 'warning') : 'action_required',
      score: latestResume ? `${latestResume.healthScore} / 100` : 'Not Uploaded',
      description: latestResume 
        ? `Parsed "${latestResume.originalName}". Document readability score calculated based on contact details, skills, and text structure.`
        : 'Upload a PDF resume in Resume Studio to allow automatic parsing and health score computation.',
      actionLabel: latestResume ? 'Inspect Resume' : 'Upload Resume',
      link: '/dashboard/resume',
    },
    {
      id: 'github-sync',
      title: 'GitHub Integration & Repository Sync',
      status: github ? 'optimal' : 'action_required',
      score: github ? `${github.publicRepos} Repos` : 'Not Linked',
      description: github 
        ? `Connected to public GitHub account @${github.username}. Tracking ${github.publicRepos} repositories.`
        : 'Connect your public GitHub account to display repository telemetry and import open-source projects.',
      actionLabel: github ? 'View Repositories' : 'Connect GitHub',
      link: '/dashboard/github',
    },
    {
      id: 'portfolio-visibility',
      title: 'Public Portfolio Deployment',
      status: profileData?.profile?.isPublished ? 'optimal' : 'warning',
      score: profileData?.profile?.isPublished ? 'Live' : 'Private',
      description: profileData?.profile?.isPublished && profileData?.profile?.username
        ? `Your portfolio is live at /p/${profileData.profile.username}. Select from 6 active themes.`
        : 'Publish your interactive portfolio in the Publishing Studio to make it accessible to recruiters.',
      actionLabel: profileData?.profile?.isPublished ? 'View Portfolio' : 'Publish Portfolio',
      link: profileData?.profile?.isPublished && profileData?.profile?.username ? `/p/${profileData.profile.username}` : '/dashboard/publishing',
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#4F46E5]">
            <BarChart3 className="w-3.5 h-3.5" /> CAREER TELEMETRY
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight">
            Intelligence &amp; Analytics Engine
          </h1>
          <p className="text-sm text-[#64748B] max-w-2xl leading-relaxed">
            Real-time evaluation of your candidate profile, ATS resume document health, and GitHub connection status.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] self-start sm:self-center">
          {(['30d', '90d', 'all'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setSelectedRange(range)}
              type="button"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase transition-all ${
                selectedRange === range
                  ? 'bg-white text-[#111827] shadow-sm border border-[#E2E8F0]'
                  : 'text-[#64748B] hover:text-[#111827]'
              }`}
            >
              {range === 'all' ? 'All Time' : range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Score Gauge Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ATS Readability Score */}
        <Card variant="default" className="p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#4F46E5]" /> ATS Document Health
              </span>
              <Badge variant={latestResume ? 'success' : 'secondary'} className="text-[10px] font-bold">
                {latestResume ? 'Parsed' : 'Pending Upload'}
              </Badge>
            </div>
            <div className="flex items-baseline gap-2 my-3">
              <span className="text-4xl sm:text-5xl font-bold text-[#111827] tracking-tight">
                {latestResume ? latestResume.healthScore : 'N/A'}
              </span>
              {latestResume && <span className="text-sm font-semibold text-[#64748B]">/ 100</span>}
            </div>
            <p className="text-xs text-[#64748B] leading-relaxed">
              {latestResume 
                ? `File: ${latestResume.originalName}. Parsed contact details and skill keywords.`
                : 'No PDF resume uploaded yet. Upload a resume in Resume Studio.'}
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-[#F1F5F9] flex items-center justify-between text-xs font-semibold">
            <span className="text-[#64748B]">Document Status</span>
            <span className="text-[#111827] font-bold">{latestResume ? 'Verified' : 'Not Uploaded'}</span>
          </div>
        </Card>

        {/* Profile Completion Rate */}
        <Card variant="default" className="p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-[#4F46E5]" /> Profile Completion
              </span>
              <Badge variant="default" className="text-[10px] font-bold px-2 py-0.5 bg-[#EEF2FF] border-[#E0E7FF] text-[#4F46E5]">
                {completion >= 80 ? 'Optimal' : completion >= 50 ? 'Progressing' : 'Initiating'}
              </Badge>
            </div>
            <div className="flex items-baseline gap-2 my-3">
              <span className="text-4xl sm:text-5xl font-bold text-[#111827] tracking-tight">
                {completion}%
              </span>
            </div>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Calculated based on bio, avatar, social links, experience, education, skills, and projects.
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-[#F1F5F9] flex items-center justify-between text-xs font-semibold">
            <span className="text-[#4F46E5] flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" /> {profileData?.skills?.length || 0} Skills &bull; {profileData?.projects?.length || 0} Projects
            </span>
            <span className="text-[#64748B]">Real Metric</span>
          </div>
        </Card>

        {/* GitHub Repositories */}
        <Card variant="default" className="p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
                <GitBranch className="w-3.5 h-3.5 text-[#10B981]" /> GitHub Public Repos
              </span>
              <Badge variant={github ? 'success' : 'secondary'} className="text-[10px] font-bold">
                {github ? 'Connected' : 'Not Linked'}
              </Badge>
            </div>
            <div className="flex items-baseline gap-2 my-3">
              <span className="text-4xl sm:text-5xl font-bold text-[#111827] tracking-tight">
                {github ? github.publicRepos : '0'}
              </span>
              <span className="text-sm font-semibold text-[#64748B]">Repos</span>
            </div>
            <p className="text-xs text-[#64748B] leading-relaxed">
              {github 
                ? `Account @${github.username} linked. Public repositories tracked.`
                : 'Connect your public GitHub username in GitHub Integration.'}
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-[#F1F5F9] flex items-center justify-between text-xs font-semibold">
            <span className="text-[#64748B]">Sync Status</span>
            <span className="text-[#111827] font-bold">{github ? 'Active' : 'Offline'}</span>
          </div>
        </Card>
      </div>

      {/* Diagnostic Matrix */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-base font-bold text-[#111827] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#4F46E5]" /> Career Diagnostic Report
            </h3>
            <p className="text-xs text-[#64748B]">
              Real-time status of your workspace components
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {diagnosticItems.map((item) => (
            <Card
              key={item.id}
              variant="default"
              className="p-5 transition-all shadow-sm hover:border-[#CBD5E1]"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl border shrink-0 ${
                    item.status === 'optimal'
                      ? 'bg-[#ECFDF5] border-[#D1FAE5] text-[#10B981]'
                      : item.status === 'warning'
                      ? 'bg-[#FFFBEB] border-[#FEF3C7] text-[#F59E0B]'
                      : 'bg-[#FEF2F2] border-[#FEE2E2] text-[#EF4444]'
                  }`}>
                    {item.status === 'optimal' ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : item.status === 'warning' ? (
                      <AlertTriangle className="w-5 h-5" />
                    ) : (
                      <Zap className="w-5 h-5" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-[#111827]">{item.title}</h4>
                      <Badge variant="secondary" className="text-[10px] font-mono px-2 py-0.5 bg-[#F8FAFC] border-[#E2E8F0] font-bold">
                        Status: {item.score}
                      </Badge>
                    </div>
                    <p className="text-xs text-[#64748B] leading-relaxed max-w-3xl">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  <a
                    href={item.link}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F8FAFC] hover:bg-white border border-[#E2E8F0] text-xs font-bold text-[#111827] transition-all group shadow-sm"
                  >
                    <span>{item.actionLabel}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#64748B] group-hover:text-[#4F46E5] transition-colors" />
                  </a>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recommendations Section */}
      <Card variant="default" className="p-6 shadow-sm bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] border border-[#E0E7FF] flex items-center justify-center text-[#4F46E5]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-[#111827]">
                Career Acceleration Insights
              </CardTitle>
              <CardDescription className="text-xs text-[#64748B]">
                Recommendations to strengthen your candidate presentation
              </CardDescription>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-5">
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#111827] flex items-center gap-2">
                <Award className="w-4 h-4 text-[#F59E0B]" /> Technical Positioning
              </span>
              <span className="text-[10px] font-semibold text-[#4F46E5] bg-[#EEF2FF] px-2 py-0.5 rounded border border-[#E0E7FF]">
                Profile Tip
              </span>
            </div>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Highlight your key technical achievements and core skills in your experience section to provide clear signals to recruiters.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#111827] flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#4F46E5]" /> Quantifiable Impact
              </span>
              <span className="text-[10px] font-semibold text-[#4F46E5] bg-[#EEF2FF] px-2 py-0.5 rounded border border-[#E0E7FF]">
                Recommended
              </span>
            </div>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Include specific outcomes and technology stacks in your project descriptions to demonstrate practical impact.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsPage;
