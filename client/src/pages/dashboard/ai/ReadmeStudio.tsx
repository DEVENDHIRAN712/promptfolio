import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Copy, Check, RefreshCw, Sparkles, Code, Terminal, Cpu, Save } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/axios';

export const ReadmeStudio: React.FC = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [projectName, setProjectName] = useState('Promptfolio AI Career Operating System');
  const [description, setDescription] = useState('Autonomous AI-powered career operating system with MERN stack, Gemini AI generation engine, and Apple + Linear + Vercel dark mode UI.');
  const [technologies, setTechnologies] = useState('React 19, TypeScript, Tailwind CSS v4, Node.js, Express, MongoDB, Gemini API');
  const [generatedReadme, setGeneratedReadme] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  // Fetch candidate projects so user can pick one with 1-click
  const { data: projects } = useQuery({
    queryKey: ['projectsListAI'],
    queryFn: async () => {
      const res = await api.get('/profile/all');
      return res.data.data?.projects || [];
    },
  });

  const handleProjectSelect = (id: string) => {
    setSelectedProjectId(id);
    if (!id) return;
    const proj = (projects || []).find((p: any) => p._id === id);
    if (proj) {
      setProjectName(proj.title);
      setDescription(proj.description || '');
      setTechnologies(Array.isArray(proj.technologies) ? proj.technologies.join(', ') : (proj.technologies || ''));
    }
  };

  const generateMutation = useMutation({
    mutationFn: async () => {
      const payload: any = { projectName, description, technologies: technologies.split(',').map((t) => t.trim()) };
      if (selectedProjectId) payload.projectId = selectedProjectId;
      const res = await api.post('/ai/generate-readme', payload);
      return res.data.readme;
    },
    onSuccess: (data) => {
      setGeneratedReadme(data);
      setSaved(false);
    },
  });

  const handleCopyMarkdown = () => {
    if (!generatedReadme?.markdown) return;
    navigator.clipboard.writeText(generatedReadme.markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveToProject = async () => {
    if (!selectedProjectId || !generatedReadme?.markdown) return;
    try {
      await api.put(`/profile/projects/${selectedProjectId}`, {
        description: generatedReadme.tagline || description,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert('Failed to save README highlights.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuration Card */}
      <Card className="border-slate-800/80 bg-slate-900/60 backdrop-blur">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" /> Production GitHub README Generator
              </CardTitle>
              <CardDescription>
                Generate world-class markdown with shields.io badges, installation snippets, and architecture breakdowns
              </CardDescription>
            </div>
            <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-mono">
              PRODUCTION MARKDOWN
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="projectSelect" className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Select Existing Project (Optional)
              </Label>
              <select
                id="projectSelect"
                value={selectedProjectId}
                onChange={(e) => handleProjectSelect(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 text-sm text-slate-100 focus:ring-1 focus:ring-amber-500"
              >
                <option value="">-- Or enter custom project details below --</option>
                {Array.isArray(projects) && projects.map((p: any) => (
                  <option key={p._id} value={p._id}>{p.title}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="rmProjectName" className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Project Title
              </Label>
              <Input
                id="rmProjectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="My Awesome App"
                className="bg-slate-950/80 border-slate-800 font-semibold"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="rmTech" className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Tech Stack &amp; Dependencies (Comma separated)
            </Label>
            <Input
              id="rmTech"
              value={technologies}
              onChange={(e) => setTechnologies(e.target.value)}
              placeholder="React 19, TypeScript, Node.js, MongoDB"
              className="bg-slate-950/80 border-slate-800 font-mono text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="rmDesc" className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Project Description &amp; Core Problem Solved
            </Label>
            <Textarea
              id="rmDesc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this application do? Why did you engineer it?"
              className="bg-slate-950/80 border-slate-800 text-xs font-mono"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-slate-400">
              Includes installation terminal code blocks, environment variable guidelines (`.env.example`), and contributing sections.
            </p>
            <Button
              onClick={() => generateMutation.mutate()}
              disabled={generateMutation.isPending || !projectName.trim()}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold px-6 shadow-lg shadow-amber-500/20"
            >
              {generateMutation.isPending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Structuring README...
                </>
              ) : generatedReadme ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" /> Regenerate README.md
                </>
              ) : (
                <>
                  <BookOpen className="w-4 h-4 mr-2" /> Generate README.md
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Loading State Diagnostic Shimmer */}
      <AnimatePresence>
        {generateMutation.isPending && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="p-8 rounded-2xl bg-slate-900/80 border border-amber-500/30 backdrop-blur text-center space-y-4 shadow-xl"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto animate-bounce">
              <Cpu className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-white">Synthesizing README.md for {projectName}...</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Generating shields.io SVG badges, formulating terminal installation commands (`git clone`, `npm run dev`), and building clean markdown architecture.
              </p>
            </div>
            <div className="w-48 h-1.5 bg-slate-800 rounded-full mx-auto overflow-hidden">
              <motion.div
                className="w-full h-full bg-gradient-to-r from-amber-500 to-orange-500 origin-left"
                animate={{ scaleX: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      {generateMutation.isError && (
        <div className="p-4 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-sm">
          <strong>README Generation Error:</strong> {(generateMutation.error as Error)?.message || 'Failed to generate README.'}
        </div>
      )}

      {/* Generated README Studio Output */}
      {generatedReadme && !generateMutation.isPending && (
        <Card className="border-slate-800/80 bg-slate-900/60 backdrop-blur shadow-2xl">
          <CardHeader className="border-b border-slate-800/80 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-amber-400" /> README.md &minus; {generatedReadme.projectTitle || projectName}
              </CardTitle>
              <CardDescription className="text-xs">
                {generatedReadme.tagline || 'Ready to commit to root folder'}
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={handleCopyMarkdown}
                className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-md shadow-amber-600/20"
              >
                {copied ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                {copied ? 'Copied README.md' : 'Copy Markdown Code'}
              </Button>
              {selectedProjectId && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSaveToProject}
                  disabled={saved}
                  className="text-xs border-slate-700 bg-slate-950/80 hover:bg-slate-800"
                >
                  {saved ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" /> : <Save className="w-3.5 h-3.5 mr-1" />}
                  {saved ? 'Saved to Project' : 'Save Project Tagline'}
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-amber-300 leading-relaxed whitespace-pre-wrap max-h-[700px] overflow-y-auto">
              {generatedReadme.markdown}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReadmeStudio;
