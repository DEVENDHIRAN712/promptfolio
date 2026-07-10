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
  Award,
  BookOpen,
  UserCheck,
  Activity,
  Cpu,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/axios';

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
      <div className="flex items-center justify-center h-96 text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
          <span className="text-sm font-medium">Loading workspace metrics...</span>
        </div>
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
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/50 to-blue-950/40 border border-slate-800 backdrop-blur">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400">
            <Sparkles className="w-3.5 h-3.5" /> AI CAREER OPERATING SYSTEM
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Welcome to your Command Center
          </h1>
          <p className="text-sm text-slate-400 max-w-xl">
            Monitor real-time profile completion, analyze resume health scores, and synchronize your live GitHub contributions into high-impact portfolio credentials.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/dashboard/profile">
            <Button className="bg-blue-600 hover:bg-blue-500 font-semibold shadow-lg shadow-blue-600/20">
              Edit Modular Profile <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Core Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Profile Completion Card */}
        <Card className="border-slate-800/80 bg-slate-900/60 backdrop-blur">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Profile Completion</span>
              <UserCheck className="w-4 h-4 text-blue-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-white">{completion}%</span>
              <Badge variant="secondary" className="text-xs font-bold text-blue-400 bg-blue-500/10">
                {completion >= 80 ? 'Excellent' : completion >= 50 ? 'Good' : 'Getting Started'}
              </Badge>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completion}%` }}
                transition={{ duration: 0.8 }}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Resume Health Score Card */}
        <Card className="border-slate-800/80 bg-slate-900/60 backdrop-blur">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Resume Uploaded</span>
              <FileText className="w-4 h-4 text-purple-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-white truncate">
                {resume ? `${resume.healthScore} / 100` : 'Not Uploaded'}
              </span>
              <Badge
                variant="secondary"
                className={`text-xs font-bold ${resume ? 'text-purple-400 bg-purple-500/10' : 'text-slate-500 bg-slate-800'}`}
              >
                {resume ? 'Analyzed' : 'Pending'}
              </Badge>
            </div>
            <p className="text-xs text-slate-400 truncate">
              {resume ? `Parsed file: ${resume.originalName}` : 'Upload PDF in Resume Studio'}
            </p>
          </CardContent>
        </Card>

        {/* GitHub Connection Card */}
        <Card className="border-slate-800/80 bg-slate-900/60 backdrop-blur">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">GitHub Connected</span>
              <GitBranch className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-black text-white truncate">
                {github ? `@${github.username}` : 'Not Connected'}
              </span>
              <Badge
                variant="secondary"
                className={`text-xs font-bold ${github ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500 bg-slate-800'}`}
              >
                {github ? 'Synced' : 'Connect'}
              </Badge>
            </div>
            <p className="text-xs text-slate-400">
              {github ? `Tracking ${github.publicRepos} public repositories` : 'Link public GitHub username'}
            </p>
          </CardContent>
        </Card>

        {/* Projects Imported Card */}
        <Card className="border-slate-800/80 bg-slate-900/60 backdrop-blur">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Projects Imported</span>
              <Layers className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-white">{projectsCount}</span>
              <Badge variant="secondary" className="text-xs font-bold text-amber-400 bg-amber-500/10">
                Portfolio Items
              </Badge>
            </div>
            <p className="text-xs text-slate-400">
              {skillsCount} Skills &bull; {experiencesCount} Roles listed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AI Suggestions & Quick Actions Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Suggestions Card (Spans 2 columns) */}
        <Card className="lg:col-span-2 border-slate-800/80 bg-slate-900/60 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-white">AI Portfolio Status & Suggestions</CardTitle>
                <p className="text-xs text-slate-400">Real-time career optimization diagnostics</p>
              </div>
            </div>
            <Badge className="bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-mono">
              STATUS: {data?.profile?.aiStatus?.toUpperCase() || 'OPTIMIZED'}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Modular Profile Foundation Active</h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    Your database models are decoupled cleanly. You can update individual sections (Experience, Education, Skills) without locking up the full bio.
                  </p>
                </div>
              </div>
            </div>

            {!resume && (
              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-white">Action Recommended: Upload Resume PDF</h4>
                      <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                        Upload your latest PDF in our Resume Studio. Our AI regex parsing engine will automatically extract candidate skills and summary text for instant review.
                      </p>
                    </div>
                  </div>
                  <Link to="/dashboard/resume">
                    <Button size="sm" variant="outline" className="text-xs border-purple-500/40 text-purple-300 hover:bg-purple-500/20">
                      Upload Now
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {!github && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <GitBranch className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-white">Action Recommended: Connect GitHub Username</h4>
                      <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                        No Personal Access Token needed. Link your public GitHub username to inspect stars, language breakdowns, and import top projects directly.
                      </p>
                    </div>
                  </div>
                  <Link to="/dashboard/github">
                    <Button size="sm" variant="outline" className="text-xs border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/20">
                      Link GitHub
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {resume && github && (
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between">
                <p className="text-xs text-slate-200">
                  Your resume and GitHub integration are active. Continue adding detailed work history and live project links!
                </p>
                <Link to="/dashboard/profile">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-xs shrink-0">
                    Manage Profile
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card className="border-slate-800/80 bg-slate-900/60 backdrop-blur flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" /> Quick Actions
            </CardTitle>
            <p className="text-xs text-slate-400">One-click navigation to career workflows</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/dashboard/profile" className="block">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-900/80 transition-all flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Edit Modular Sections</p>
                    <p className="text-xs text-slate-400">About, Experience, Education & Skills</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
              </div>
            </Link>

            <Link to="/dashboard/resume" className="block">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-900/80 transition-all flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Interactive Resume Studio</p>
                    <p className="text-xs text-slate-400">Parse PDF &amp; review candidate data</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
              </div>
            </Link>

            <Link to="/dashboard/github" className="block">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900/80 transition-all flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <GitBranch className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Import GitHub Repos</p>
                    <p className="text-xs text-slate-400">Public username repository synchronization</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Feed */}
      <Card className="border-slate-800/80 bg-slate-900/60 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" /> Recent Activity Feed
          </CardTitle>
          <p className="text-xs text-slate-400">Live operational milestones recorded in your career timeline</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4 p-3 rounded-lg bg-slate-950/40 border border-slate-800/60">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Workspace Session Initialized</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Authentication bearer token verified. Modular profile system ready for edits.
              </p>
              <span className="text-[10px] text-slate-500 font-mono mt-1 block">Just now</span>
            </div>
          </div>

          {resume && (
            <div className="flex items-start gap-4 p-3 rounded-lg bg-slate-950/40 border border-slate-800/60">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Resume PDF Processed</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Uploaded &ldquo;{resume.originalName}&rdquo; &bull; Health score calculated at {resume.healthScore}/100.
                </p>
                <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                  {new Date(resume.uploadedAt).toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {github && (
            <div className="flex items-start gap-4 p-3 rounded-lg bg-slate-950/40 border border-slate-800/60">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                <GitBranch className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">GitHub Username Synchronized</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Connected public profile @{github.username} ({github.publicRepos} public repositories available).
                </p>
                <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                  {new Date(github.lastSyncedAt).toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
