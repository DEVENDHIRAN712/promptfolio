import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { GitBranch, Search, Star, GitFork, ExternalLink, Download, Sparkles, BookOpen, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/axios';

export const GitHubIntegrationPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [usernameInput, setUsernameInput] = useState('');
  const [activeUsername, setActiveUsername] = useState<string | null>(null);
  const [selectedRepoForReadme, setSelectedRepoForReadme] = useState<any | null>(null);
  const [readmeContent, setReadmeContent] = useState<string | null>(null);
  const [readmeLoading, setReadmeLoading] = useState(false);
  const [importSuccessMsg, setImportSuccessMsg] = useState<string | null>(null);
  const [importErrorMsg, setImportErrorMsg] = useState<string | null>(null);

  // Check connected username
  const { data: profileData } = useQuery({
    queryKey: ['completeProfile'],
    queryFn: async () => {
      const res = await api.get('/profile/all');
      return res.data;
    },
  });

  const connectedUsername = profileData?.githubConnection?.username || activeUsername || '';

  // Query repositories
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
      refetch();
    },
    onError: (err: any) => {
      setImportErrorMsg(err.response?.data?.message || 'Failed to connect GitHub username.');
    },
  });

  const importMutation = useMutation({
    mutationFn: async (repo: any) => {
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
      setImportSuccessMsg(`Imported "${data.project.title}" to your portfolio projects!`);
      setImportErrorMsg(null);
      setTimeout(() => setImportSuccessMsg(null), 4000);
    },
    onError: (err: any) => {
      setImportErrorMsg(err.response?.data?.message || 'Failed to import repository.');
      setImportSuccessMsg(null);
    },
  });

  const handleFetchReadme = async (repo: any) => {
    try {
      setSelectedRepoForReadme(repo);
      setReadmeLoading(true);
      const res = await api.get(`/github/readme?username=${encodeURIComponent(connectedUsername)}&repo=${encodeURIComponent(repo.name)}&branch=${encodeURIComponent(repo.defaultBranch || 'main')}`);
      setReadmeContent(res.data.readme);
    } catch {
      setReadmeContent('Could not retrieve README text.');
    } finally {
      setReadmeLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;
    setImportErrorMsg(null);
    setImportSuccessMsg(null);
    connectMutation.mutate(usernameInput.trim());
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" /> ZERO PERSONAL ACCESS TOKEN REQUIRED
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            GitHub Public Intelligence
          </h1>
          <p className="text-sm text-slate-400">
            Link your public GitHub username to fetch live repository metadata, inspect README documents, and import verified codebases directly into your portfolio.
          </p>
        </div>
      </div>

      {importSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-2.5">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{importSuccessMsg}</span>
        </div>
      )}

      {importErrorMsg && (
        <div className="p-4 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-sm flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{importErrorMsg}</span>
        </div>
      )}

      {/* Connect Username Bar */}
      <Card className="border-slate-800/80 bg-slate-900/60 backdrop-blur">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-end gap-3">
            <div className="flex-1 space-y-2 w-full">
              <Label htmlFor="githubUsername" className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Public GitHub Username
              </Label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <Input
                  id="githubUsername"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="torvalds / vercel / your-username"
                  className="pl-10 font-mono"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={connectMutation.isPending || !usernameInput.trim()}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 font-semibold px-6 shrink-0"
            >
              {connectMutation.isPending ? 'Connecting...' : 'Connect & Fetch Repos'}
            </Button>
          </form>

          {connectedUsername && (
            <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-2">
                Connected account: <strong className="text-white font-mono">@{connectedUsername}</strong>
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => refetch()}
                className="text-xs text-emerald-400 hover:text-emerald-300 h-7"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh Repositories
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Repositories Grid & README Modal Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Repositories Grid */}
        <div className={selectedRepoForReadme ? 'lg:col-span-7 space-y-4' : 'lg:col-span-12 space-y-4'}>
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-emerald-400" /> Available Public Repositories
            </h3>
            {reposData?.repos && (
              <Badge className="bg-slate-800 text-slate-300 border-slate-700 text-xs">
                {reposData.repos.length} Repositories
              </Badge>
            )}
          </div>

          {reposLoading ? (
            <div className="p-12 text-center text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800/80">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-400 mb-2" />
              <p className="text-sm">Querying GitHub API for repositories...</p>
            </div>
          ) : !reposData?.repos || reposData.repos.length === 0 ? (
            <div className="p-12 text-center text-slate-500 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800">
              <GitBranch className="w-8 h-8 mx-auto text-slate-600 mb-3" />
              <p className="text-sm">No repositories loaded yet.</p>
              <p className="text-xs text-slate-600 mt-1">Enter a public username above to inspect repositories.</p>
            </div>
          ) : (
            <div className={`grid grid-cols-1 ${selectedRepoForReadme ? 'gap-4' : 'md:grid-cols-2 gap-4'}`}>
              {reposData.repos.map((repo: any) => (
                <Card
                  key={repo.id}
                  className="border-slate-800/80 bg-slate-900/60 backdrop-blur hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base font-bold text-white leading-tight font-mono">
                        {repo.name}
                      </CardTitle>
                      <Badge variant="outline" className="text-[10px] uppercase font-bold text-blue-400 border-blue-500/30 shrink-0">
                        {repo.language || 'Code'}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs text-slate-400 line-clamp-2 pt-1">
                      {repo.description || 'No description provided.'}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="py-2">
                    {repo.topics && repo.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {repo.topics.slice(0, 4).map((t: string, i: number) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400 text-[10px] font-mono"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="border-t border-slate-800/60 pt-3 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-amber-400 font-mono">
                        <Star className="w-3.5 h-3.5 fill-amber-400" /> {repo.stars}
                      </span>
                      <span className="flex items-center gap-1 font-mono">
                        <GitFork className="w-3.5 h-3.5" /> {repo.forks}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFetchReadme(repo)}
                        className="h-8 text-xs text-slate-300 hover:text-white"
                      >
                        <BookOpen className="w-3.5 h-3.5 mr-1" /> README
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => importMutation.mutate(repo)}
                        disabled={importMutation.isPending}
                        className="h-8 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-3 shadow-md shadow-emerald-600/20"
                      >
                        <Download className="w-3.5 h-3.5 mr-1" /> Import
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* README Preview Panel */}
        {selectedRepoForReadme && (
          <div className="lg:col-span-5">
            <Card className="border-slate-800/80 bg-slate-900/80 backdrop-blur sticky top-20">
              <CardHeader className="border-b border-slate-800/80 pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-white flex items-center gap-2 font-mono">
                    <BookOpen className="w-4 h-4 text-emerald-400" /> {selectedRepoForReadme.name} / README.md
                  </CardTitle>
                  <CardDescription className="text-xs">Fetched directly via GitHub RAW content</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedRepoForReadme(null)}
                  className="text-xs text-slate-400 hover:text-white h-7 px-2"
                >
                  Close
                </Button>
              </CardHeader>
              <CardContent className="p-4 max-h-[500px] overflow-y-auto">
                {readmeLoading ? (
                  <div className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-400 mb-2" />
                    <p className="text-xs font-mono">Fetching README from GitHub...</p>
                  </div>
                ) : (
                  <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                    {readmeContent || 'No README text available.'}
                  </pre>
                )}
              </CardContent>
              <CardFooter className="border-t border-slate-800/80 pt-3 flex justify-end gap-3">
                <a
                  href={selectedRepoForReadme.htmlUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white font-mono"
                >
                  Open on GitHub <ExternalLink className="w-3 h-3" />
                </a>
                <Button
                  size="sm"
                  onClick={() => importMutation.mutate(selectedRepoForReadme)}
                  disabled={importMutation.isPending}
                  className="bg-emerald-600 hover:bg-emerald-500 font-semibold text-xs shadow-md shadow-emerald-600/20"
                >
                  <Download className="w-3.5 h-3.5 mr-1" /> Import to Portfolio
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default GitHubIntegrationPage;
