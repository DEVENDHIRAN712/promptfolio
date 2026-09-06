import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Sparkles,
  CheckCircle2,
  FileText,
  GitBranch,
  Layers,
  ArrowRight,
  TrendingUp,
  UserCheck,
  Activity,
  Globe,
  Plus
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/axios';
import { PortfolioPublishingCard } from '@/pages/dashboard/PortfolioPublishingCard';
import { Skeleton } from '@/components/ui/skeleton';
import Avatar from '@/components/ui/Avatar';

export const DashboardOverview: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['completeProfile'],
    queryFn: async () => {
      const res = await api.get('/profile/all');
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6 pb-12">
        <Skeleton className="h-36 w-full rounded-2xl bg-white border border-[#E2E8F0]" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Skeleton className="h-32 rounded-xl bg-white border border-[#E2E8F0]" />
          <Skeleton className="h-32 rounded-xl bg-white border border-[#E2E8F0]" />
          <Skeleton className="h-32 rounded-xl bg-white border border-[#E2E8F0]" />
          <Skeleton className="h-32 rounded-xl bg-white border border-[#E2E8F0]" />
        </div>
        <Skeleton className="h-80 w-full rounded-2xl bg-white border border-[#E2E8F0]" />
      </div>
    );
  }

  const completion = data?.completionPercentage || 0;
  const github = data?.githubConnection;
  const resume = data?.latestResume;
  const projectsCount = data?.projects?.length || 0;
  const skillsCount = data?.skills?.length || 0;
  const experiencesCount = data?.experiences?.length || 0;

  return (
    <div className="space-y-8 pb-14">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="rounded-2xl bg-white border border-[#E2E8F0] shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
          <Avatar
            src={data?.profile?.avatar}
            name={data?.user?.name || data?.profile?.username || 'User'}
            sizeClass="w-16 h-16 rounded-xl text-xl shrink-0"
          />
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#4F46E5]">
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              <span>Workspace Active &bull; Synced</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight">
              Welcome back to your workspace
            </h1>
            <p className="text-sm text-[#64748B] leading-relaxed">
              Manage your profile, sync work history, and publish your recruiter-ready portfolio instantly.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link to="/dashboard/profile">
            <Button variant="default" size="lg" className="font-semibold shadow-sm">
              <span>Update Profile</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
          <Link to="/dashboard/ai">
            <Button variant="outline" size="lg" className="font-semibold gap-2 border-[#E2E8F0] text-[#111827]">
              <Sparkles className="w-4 h-4 text-[#4F46E5]" />
              <span>AI Studio</span>
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Production Deployment Engine Card */}
      <PortfolioPublishingCard
        profile={data?.profile}
        userId={data?.profile?.userId}
        userName={data?.user?.name || data?.profile?.username || 'User'}
      />

      {/* Core Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Profile Completion Card */}
        <Card variant="default" className="p-5 space-y-3">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-xs font-semibold uppercase tracking-wider">Profile Health</span>
            <div className="w-8 h-8 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#4F46E5]">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-3xl font-bold text-[#111827] tracking-tight">{completion}%</span>
            <Badge variant="default" className="text-[10px] font-semibold">
              {completion >= 80 ? 'Optimal' : completion >= 50 ? 'Progressing' : 'Initiating'}
            </Badge>
          </div>
          <div className="w-full bg-[#F1F5F9] h-2 rounded-full overflow-hidden mt-2">
            <div
              style={{ width: `${completion}%` }}
              className="bg-[#4F46E5] h-full rounded-full transition-all duration-500"
            />
          </div>
        </Card>

        {/* Resume Health Score Card */}
        <Card variant="default" className="p-5 space-y-3">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-xs font-semibold uppercase tracking-wider">ATS Document</span>
            <div className="w-8 h-8 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#4F46E5]">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-2xl font-bold text-[#111827] truncate tracking-tight">
              {resume ? `${resume.healthScore} / 100` : 'Not Uploaded'}
            </span>
            <Badge
              variant={resume ? 'success' : 'secondary'}
              className="text-[10px] font-semibold"
            >
              {resume ? 'Analyzed' : 'Pending'}
            </Badge>
          </div>
          <p className="text-xs text-[#64748B] truncate">
            {resume ? `File: ${resume.originalName}` : 'Upload PDF in Resume Studio'}
          </p>
        </Card>

        {/* GitHub Connection Card */}
        <Card variant="default" className="p-5 space-y-3">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-xs font-semibold uppercase tracking-wider">GitHub Sync</span>
            <div className="w-8 h-8 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#10B981]">
              <GitBranch className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-xl font-bold text-[#111827] truncate tracking-tight">
              {github ? `@${github.username}` : 'Offline'}
            </span>
            <Badge
              variant={github ? 'success' : 'secondary'}
              className="text-[10px] font-semibold"
            >
              {github ? 'Connected' : 'Action Required'}
            </Badge>
          </div>
          <p className="text-xs text-[#64748B]">
            {github ? `Tracking ${github.publicRepos} public repos` : 'Link GitHub username'}
          </p>
        </Card>

        {/* Projects Imported Card */}
        <Card variant="default" className="p-5 space-y-3">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-xs font-semibold uppercase tracking-wider">Portfolio Nodes</span>
            <div className="w-8 h-8 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#F59E0B]">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-3xl font-bold text-[#111827] tracking-tight">{projectsCount}</span>
            <Badge variant="amber" className="text-[10px] font-semibold">
              Showcase Items
            </Badge>
          </div>
          <p className="text-xs text-[#64748B]">
            {skillsCount} Skills &bull; {experiencesCount} Positions
          </p>
        </Card>
      </div>

      {/* Quick Actions & Recommendations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommendations & Profile Health (Spans 2 columns) */}
        <Card variant="default" className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-[#F1F5F9]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#EEF2FF] flex items-center justify-center text-[#4F46E5]">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-[#111827]">Workspace Health &amp; Recommendations</CardTitle>
                <p className="text-xs text-[#64748B]">Actionable steps to improve your candidate presentation</p>
              </div>
            </div>
            <Badge variant="default" className="text-xs">
              Status: {completion >= 80 ? 'Optimal' : 'In Progress'}
            </Badge>
          </CardHeader>
          
          <CardContent className="space-y-4 pt-5">
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-[#111827]">Modular Data Structure Active</h4>
                  <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">
                    Your candidate profile sections are cleanly organized and ready to publish to `/p/username`.
                  </p>
                </div>
              </div>
            </div>

            {!resume && (
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-[#4F46E5] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#111827]">Upload your ATS Resume PDF</h4>
                    <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed max-w-md">
                      Let our parser extract your experience and verify technical skill tokens instantly.
                    </p>
                  </div>
                </div>
                <Link to="/dashboard/resume" className="shrink-0">
                  <Button size="sm" className="bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-xs">
                    Open Studio &rarr;
                  </Button>
                </Link>
              </div>
            )}

            {!github && (
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <GitBranch className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#111827]">Link your GitHub Username</h4>
                    <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed max-w-md">
                      Connect your public GitHub account to showcase total stars and code repositories without API keys.
                    </p>
                  </div>
                </div>
                <Link to="/dashboard/github" className="shrink-0">
                  <Button size="sm" className="bg-[#10B981] hover:bg-[#059669] text-white font-semibold text-xs">
                    Sync GitHub &rarr;
                  </Button>
                </Link>
              </div>
            )}

            {resume && github && (
              <div className="p-4 rounded-xl bg-[#EEF2FF] border border-[#E0E7FF] flex items-center justify-between">
                <p className="text-xs text-[#4F46E5] font-semibold">
                  All integrations (`Resume Studio` &amp; `GitHub Intelligence`) are connected and active!
                </p>
                <Link to="/dashboard/profile">
                  <Button size="sm" variant="default" className="text-xs font-semibold">
                    Manage Profile &rarr;
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Workflows Launcher Card */}
        <Card variant="default" className="flex flex-col justify-between">
          <CardHeader className="pb-4 border-b border-[#F1F5F9]">
            <CardTitle className="text-base font-bold text-[#111827] flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#4F46E5]" /> Quick Actions
            </CardTitle>
            <p className="text-xs text-[#64748B]">One-click shortcuts to key workspaces</p>
          </CardHeader>
          <CardContent className="space-y-3 pt-5">
            <Link to="/dashboard/profile" className="block">
              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-white transition-all flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#EEF2FF] flex items-center justify-center text-[#4F46E5]">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#111827]">Modular Profile Wizard</p>
                    <p className="text-xs text-[#64748B]">Edit bio, timeline &amp; competencies</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#64748B] group-hover:text-[#111827] transition-colors" />
              </div>
            </Link>

            <Link to="/dashboard/resume" className="block">
              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-white transition-all flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#EEF2FF] flex items-center justify-center text-[#4F46E5]">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#111827]">ATS Resume Studio</p>
                    <p className="text-xs text-[#64748B]">Parse PDF &amp; inspect tokens</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#64748B] group-hover:text-[#111827] transition-colors" />
              </div>
            </Link>

            <Link to="/dashboard/github" className="block">
              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-white transition-all flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#ECFDF5] flex items-center justify-center text-[#10B981]">
                    <GitBranch className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#111827]">GitHub Repository Browser</p>
                    <p className="text-xs text-[#64748B]">Import repositories instantly</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#64748B] group-hover:text-[#111827] transition-colors" />
              </div>
            </Link>

            <Link to="/dashboard/publishing" className="block">
              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-white transition-all flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#EEF2FF] flex items-center justify-center text-[#4F46E5]">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#111827]">Portfolio Publishing</p>
                    <p className="text-xs text-[#64748B]">Customize URL slug &amp; themes</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#64748B] group-hover:text-[#111827] transition-colors" />
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Operational Activity Feed */}
      <Card variant="default">
        <CardHeader className="pb-4 border-b border-[#F1F5F9]">
          <CardTitle className="text-base font-bold text-[#111827] flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#4F46E5]" /> Activity Feed
          </CardTitle>
          <p className="text-xs text-[#64748B]">Recent updates across your career workspace</p>
        </CardHeader>
        <CardContent className="space-y-3 pt-5">
          <div className="flex items-start gap-4 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <div className="w-9 h-9 rounded-lg bg-[#EEF2FF] flex items-center justify-center text-[#4F46E5] shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-[#111827]">Workspace Session Active</p>
                <span className="text-xs text-[#64748B]">Just now</span>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                Workspace synced successfully. Profile details are ready for public deployment.
              </p>
            </div>
          </div>

          {resume && (
            <div className="flex items-start gap-4 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <div className="w-9 h-9 rounded-lg bg-[#EEF2FF] flex items-center justify-center text-[#4F46E5] shrink-0 mt-0.5">
                <FileText className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-[#111827]">ATS Document Processed</p>
                  <span className="text-xs text-[#64748B]">
                    {new Date(resume.uploadedAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Parsed &ldquo;{resume.originalName}&rdquo; &bull; ATS Readability score computed at <span className="font-semibold text-[#111827]">{resume.healthScore}/100</span>.
                </p>
              </div>
            </div>
          )}

          {github && (
            <div className="flex items-start gap-4 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <div className="w-9 h-9 rounded-lg bg-[#ECFDF5] flex items-center justify-center text-[#10B981] shrink-0 mt-0.5">
                <GitBranch className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-[#111827]">GitHub Telemetry Connected</p>
                  <span className="text-xs text-[#64748B]">
                    {new Date(github.lastSyncedAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Synchronized username <span className="font-semibold text-[#111827]">@{github.username}</span> ({github.publicRepos} repositories available).
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
