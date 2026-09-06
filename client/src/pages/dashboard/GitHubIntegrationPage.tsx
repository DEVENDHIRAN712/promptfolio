import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GitBranch, Search, Star, GitFork, ExternalLink, Download, 
  BookOpen, CheckCircle2, AlertCircle, RefreshCw, 
  Terminal, Filter, Code, X, FileText
} from 'lucide-react';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import api from '@/lib/axios';
import Avatar from '@/components/ui/Avatar';

export const GitHubIntegrationPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [usernameInput, setUsernameInput] = useState('');
  const [activeUsername, setActiveUsername] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLang, setSelectedLang] = useState<string>('All');
  
  const [selectedRepoForReadme, setSelectedRepoForReadme] = useState<any | null>(null);
  const [readmeContent, setReadmeContent] = useState<string | null>(null);
  const [readmeLoading, setReadmeLoading] = useState(false);
  
  const [importSuccessMsg, setImportSuccessMsg] = useState<string | null>(null);
  const [importErrorMsg, setImportErrorMsg] = useState<string | null>(null);
  const [importingRepoName, setImportingRepoName] = useState<string | null>(null);

  const { data: profileData } = useQuery({
    queryKey: ['completeProfile'],
    queryFn: async () => {
      const res = await api.get('/profile/all');
      return res.data;
    },
  });

  const connectedUsername = profileData?.githubConnection?.username || activeUsername || '';

  const { data: reposData, isLoading: reposLoading, refetch } = useQuery({
    queryKey: ['githubRepos', connectedUsername],
    queryFn: async () => {
      if (!connectedUsername) return null;
      const res = await api.get(`/github/repos?username=${encodeURIComponent(connectedUsername)}`);
      return res.data;
    },
    enabled: !!connectedUsername,
  });

  const connectMutation = useMutation({
    mutationFn: async (username: string) => {
      const res = await api.post('/github/connect', { username });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['completeProfile'] });
      setActiveUsername(data.connection.username);
      setImportErrorMsg(null);
      refetch();
    },
    onError: (err: any) => {
      setImportErrorMsg(err.response?.data?.message || 'Failed to verify public GitHub username.');
    },
  });

  const importMutation = useMutation({
    mutationFn: async (repo: any) => {
      setImportingRepoName(repo.name);
      const res = await api.post('/github/import', {
        name: repo.name,
        description: repo.description,
        htmlUrl: repo.htmlUrl,
        stars: repo.stars,
        forks: repo.forks,
        topics: repo.topics,
        language: repo.language,
        readme: '',
      });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['completeProfile'] });
      setImportSuccessMsg(`Repository "${data.project.title}" imported directly to your live portfolio grid!`);
      setImportErrorMsg(null);
      setImportingRepoName(null);
      setTimeout(() => setImportSuccessMsg(null), 4000);
    },
    onError: (err: any) => {
      setImportErrorMsg(err.response?.data?.message || 'Failed to import repository.');
      setImportSuccessMsg(null);
      setImportingRepoName(null);
    },
  });

  const handleFetchReadme = async (repo: any) => {
    try {
      setSelectedRepoForReadme(repo);
      setReadmeLoading(true);
      const res = await api.get(`/github/readme?username=${encodeURIComponent(connectedUsername)}&repo=${encodeURIComponent(repo.name)}&branch=${encodeURIComponent(repo.defaultBranch || 'main')}`);
      setReadmeContent(res.data.readme);
    } catch {
      setReadmeContent('Could not retrieve README text or file is missing.');
    } finally {
      setReadmeLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;
    setImportErrorMsg(null);
    connectMutation.mutate(usernameInput.trim());
  };

  const reposList = reposData?.repos || reposData?.repositories || [];

  const { filteredRepos, languages, totalStars, totalForks } = useMemo(() => {
    let stars = 0;
    let forks = 0;
    const langSet = new Set<string>(['All']);

    reposList.forEach((r: any) => {
      stars += r.stars || 0;
      forks += r.forks || 0;
      if (r.language) langSet.add(r.language);
    });

    const filtered = reposList.filter((r: any) => {
      const matchesQuery = !searchQuery.trim() || 
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (r.description && r.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (r.topics && r.topics.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase())));
      
      const matchesLang = selectedLang === 'All' || r.language === selectedLang;
      return matchesQuery && matchesLang;
    });

    return {
      filteredRepos: filtered,
      languages: Array.from(langSet),
      totalStars: stars,
      totalForks: forks,
    };
  }, [reposList, searchQuery, selectedLang]);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#4F46E5]">
            <GitBranch className="w-3.5 h-3.5" /> REPOSITORY INTELLIGENCE
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight">
            GitHub Telemetry Hub
          </h1>
          <p className="text-sm text-[#64748B] max-w-2xl leading-relaxed">
            Connect your public GitHub username to synchronize repositories, review code metadata, and import projects directly into your portfolio.
          </p>
        </div>

        {connectedUsername && (
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="px-3.5 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-mono font-bold text-[#111827] flex items-center gap-2 shadow-sm">
              <Terminal className="w-4 h-4 text-[#4F46E5]" /> @{connectedUsername}
            </div>
            <button
              onClick={() => refetch()}
              className="p-2 rounded-lg bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] text-[#64748B] hover:text-[#111827] transition-all shadow-sm"
              title="Refresh GitHub Telemetry"
            >
              <RefreshCw className={`w-4 h-4 ${reposLoading ? 'animate-spin text-[#4F46E5]' : ''}`} />
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {importSuccessMsg && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 rounded-xl bg-[#ECFDF5] border border-[#D1FAE5] text-[#10B981] text-xs font-bold flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
              <span>{importSuccessMsg}</span>
            </div>
            <Badge variant="success" className="text-[10px] font-mono">
              IMPORTED
            </Badge>
          </motion.div>
        )}

        {importErrorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 rounded-xl bg-[#FEF2F2] border border-[#FEE2E2] text-[#EF4444] text-xs font-bold flex items-center gap-2.5 shadow-sm"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{importErrorMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {!connectedUsername ? (
        <Card variant="default" className="p-8 text-center max-w-2xl mx-auto shadow-sm bg-white">
          <div className="space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-[#EEF2FF] border border-[#E0E7FF] flex items-center justify-center text-[#4F46E5] mx-auto shadow-sm">
              <GitBranch className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <CardTitle className="text-xl font-bold text-[#111827]">Connect Public GitHub Account</CardTitle>
              <CardDescription className="text-xs max-w-md mx-auto text-[#64748B] leading-relaxed">
                Enter any public GitHub username below to import public code repositories and calculate verified stars.
              </CardDescription>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
              <Input
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="e.g. torvalds"
                className="h-10 text-xs font-mono"
              />
              <Button
                type="submit"
                disabled={connectMutation.isPending}
                className="h-10 px-6 font-semibold text-xs shrink-0 shadow-sm"
              >
                Sync Repos
              </Button>
            </form>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card variant="default" className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm bg-white border-[#E2E8F0]">
            <div className="flex items-center gap-4">
              <Avatar
                src={profileData?.profile?.avatar}
                name={profileData?.profile?.fullName || connectedUsername}
                sizeClass="w-14 h-14 rounded-xl text-lg border"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#111827]">GitHub Repository Feed</h3>
                  <Badge variant="success" className="text-[9px] font-semibold">Active &amp; Synced</Badge>
                </div>
                <p className="text-xs text-[#64748B] font-mono">
                  Linked username: <span className="text-[#4F46E5] font-bold">@{connectedUsername}</span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => connectMutation.mutate('')}
                className="h-9 text-xs text-[#EF4444] border-transparent hover:bg-[#FEF2F2] hover:text-[#EF4444]"
              >
                Disconnect Account
              </Button>
            </div>
          </Card>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card variant="default" className="p-4 flex items-center gap-3.5 shadow-sm">
              <div className="p-2.5 rounded-xl bg-[#EEF2FF] border border-[#E0E7FF] text-[#4F46E5] shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-mono uppercase tracking-wider text-[#64748B] font-bold">Repos</p>
                <p className="text-xl font-bold text-[#111827] font-mono mt-0.5">{reposList.length}</p>
              </div>
            </Card>
            <Card variant="default" className="p-4 flex items-center gap-3.5 shadow-sm">
              <div className="p-2.5 rounded-xl bg-[#FFFBEB] border border-[#FEF3C7] text-[#F59E0B] shrink-0">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-mono uppercase tracking-wider text-[#64748B] font-bold">Stars</p>
                <p className="text-xl font-bold text-[#111827] font-mono mt-0.5">{totalStars}</p>
              </div>
            </Card>
            <Card variant="default" className="p-4 flex items-center gap-3.5 shadow-sm">
              <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] shrink-0">
                <GitFork className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-mono uppercase tracking-wider text-[#64748B] font-bold">Forks</p>
                <p className="text-xl font-bold text-[#111827] font-mono mt-0.5">{totalForks}</p>
              </div>
            </Card>
            <Card variant="default" className="p-4 flex items-center gap-3.5 shadow-sm">
              <div className="p-2.5 rounded-xl bg-[#ECFDF5] border border-[#D1FAE5] text-[#10B981] shrink-0">
                <Code className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-mono uppercase tracking-wider text-[#64748B] font-bold">Languages</p>
                <p className="text-xl font-bold text-[#111827] font-mono mt-0.5">{Math.max(0, languages.length - 1)}</p>
              </div>
            </Card>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search repositories by title or topic..."
                className="pl-10 h-10 text-xs bg-[#F8FAFC] border-[#E2E8F0]"
              />
            </div>
            <div className="flex items-center gap-2 shrink-0 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs text-[#64748B] flex items-center gap-1 font-semibold">
                <Filter className="w-3.5 h-3.5" /> Filter:
              </span>
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLang(lang)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${selectedLang === lang ? 'bg-[#4F46E5] text-white shadow-sm' : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#111827] border border-[#E2E8F0]'}`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {reposLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="p-6 rounded-xl bg-white border border-[#E2E8F0] animate-pulse h-40" />
              ))}
            </div>
          ) : filteredRepos.length === 0 ? (
            <EmptyState
              icon={GitBranch}
              title="No Repositories Found"
              description="Try adjusting your search criteria or language filter above."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredRepos.map((repo: any) => (
                <Card
                  key={repo.id || repo.name}
                  variant="default"
                  className="p-5 flex flex-col justify-between group shadow-sm hover:border-[#CBD5E1]"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold text-[#111827] truncate">{repo.name}</h3>
                      {repo.language && <Badge variant="secondary" className="text-[10px] bg-[#F8FAFC] border-[#E2E8F0] text-[#111827] font-semibold">{repo.language}</Badge>}
                    </div>
                    <p className="text-xs text-[#64748B] leading-relaxed line-clamp-2">{repo.description || 'No repository description provided.'}</p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-[#F1F5F9] flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-[#64748B] font-semibold">
                      <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-[#F59E0B]" /> {repo.stars}</span>
                      <span className="flex items-center gap-1"><GitFork className="w-3.5 h-3.5 text-[#64748B]" /> {repo.forks}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleFetchReadme(repo)} className="h-8 text-xs font-semibold border-[#E2E8F0]">
                        <FileText className="w-3.5 h-3.5 mr-1 text-[#4F46E5]" /> README
                      </Button>
                      <Button size="sm" onClick={() => importMutation.mutate(repo)} disabled={importingRepoName === repo.name} className="h-8 text-xs font-semibold bg-[#10B981] hover:bg-[#059669] text-white">
                        <Download className="w-3.5 h-3.5 mr-1" /> Import
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {selectedRepoForReadme && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setSelectedRepoForReadme(null)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="bg-white border border-[#E2E8F0] rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
            >
              <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
                <h3 className="text-sm font-bold text-[#111827]">{selectedRepoForReadme.name} &bull; README.md</h3>
                <button onClick={() => setSelectedRepoForReadme(null)} className="text-[#64748B] hover:text-[#111827]"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-6 overflow-y-auto font-mono text-xs leading-relaxed whitespace-pre-wrap max-h-[65vh] text-[#111827]">
                {readmeLoading ? "Loading README content..." : readmeContent}
              </div>
              <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3">
                <Button variant="outline" onClick={() => setSelectedRepoForReadme(null)} className="text-xs font-semibold border-[#E2E8F0]">
                  Close
                </Button>
                <Button onClick={() => { importMutation.mutate(selectedRepoForReadme); setSelectedRepoForReadme(null); }} className="bg-[#10B981] hover:bg-[#059669] text-white text-xs font-semibold">
                  Import Project to Portfolio
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GitHubIntegrationPage;
