import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Layers, Plus, Trash2, ExternalLink, GitBranch, Star, GitFork, Edit3, X, Sparkles, Code2, Globe } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import api from '@/lib/axios';

const GithubIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
);

interface ProjectsSectionProps {
  projects: any[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const initialFormState = {
    title: '',
    description: '',
    liveUrl: '',
    githubUrl: '',
    technologies: '',
    featured: false,
  };

  const [formData, setFormData] = useState(initialFormState);

  const addMutation = useMutation({
    mutationFn: async (data: typeof initialFormState) => {
      const payload = {
        ...data,
        technologies: data.technologies.split(',').map(t => t.trim()).filter(Boolean),
        source: 'manual',
      };
      const res = await api.post('/profile/project', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['completeProfile'] });
      setIsAdding(false);
      setFormData(initialFormState);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof initialFormState }) => {
      const payload = {
        ...data,
        technologies: typeof data.technologies === 'string'
          ? data.technologies.split(',').map(t => t.trim()).filter(Boolean)
          : data.technologies,
      };
      const res = await api.put(`/profile/project/${id}`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['completeProfile'] });
      setEditingId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/profile/project/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['completeProfile'] });
    },
  });

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <Card variant="glass" className="border-border p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" /> Featured &amp; Open-Source Projects
          </CardTitle>
          <CardDescription>
            Showcase your best software engineering creations, live demos, and GitHub repositories
          </CardDescription>
        </div>

        {!isAdding && editingId === null && (
          <Button
            onClick={() => {
              setFormData(initialFormState);
              setIsAdding(true);
              setEditingId(null);
            }}
            variant="glow"
            size="sm"
            className="font-bold text-xs gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Project Showcase
          </Button>
        )}
      </Card>

      {/* Add New Project Drawer Card */}
      {isAdding && (
        <Card variant="glass" className="border-primary/60 bg-surface-2/90 shadow-glow-primary animate-in fade-in-50 duration-200">
          <CardHeader className="border-b border-border/80 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold text-foreground">Create Project Showcase</CardTitle>
                  <CardDescription className="text-[11px]">Enter details for your project or application.</CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsAdding(false)} className="h-8 w-8 p-0">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              addMutation.mutate(formData);
            }}
          >
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="projTitle" className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-primary" /> Project Title
                  </Label>
                  <Input
                    id="projTitle"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="AI Developer Portfolio Platform"
                    className="h-10 text-sm font-semibold"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="technologies" className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 font-bold flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-primary" /> Technologies (comma separated)
                  </Label>
                  <Input
                    id="technologies"
                    value={formData.technologies}
                    onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                    placeholder="React 19, TypeScript, Tailwind CSS, Express, MongoDB"
                    className="h-10 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="liveUrl" className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 font-bold flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-primary" /> Live Demo / Production URL
                  </Label>
                  <Input
                    id="liveUrl"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    placeholder="https://myproject.app"
                    className="h-10 text-xs font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="githubUrl" className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 font-bold flex items-center gap-1.5">
                    <GithubIcon className="w-3.5 h-3.5 text-primary" /> GitHub Repository URL
                  </Label>
                  <Input
                    id="githubUrl"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="https://github.com/username/project"
                    className="h-10 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description" className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 font-bold">
                  Architecture &amp; Key Features Description
                </Label>
                <Textarea
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="• Engineered an autonomous AI resume parser using Google Gemini and TanStack Query.&#10;• Designed a sleek glassmorphism UI with progressive disclosure and instant validation."
                  className="text-xs font-mono leading-relaxed resize-y p-3"
                />
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-surface-1/80 border border-border">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded border-border bg-surface-2 text-primary focus:ring-primary h-4 w-4"
                />
                <Label htmlFor="featured" className="text-xs font-semibold text-foreground cursor-pointer">
                  Highlight this project as Featured on my public portfolio
                </Label>
              </div>
            </CardContent>

            <CardFooter className="border-t border-border/80 pt-4 flex justify-end gap-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="glow" size="sm" isLoading={addMutation.isPending} className="font-bold px-6">
                Save Project Showcase
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {/* Projects Grid */}
      {projects.length === 0 && !isAdding ? (
        <EmptyState
          icon={Layers}
          title="No Portfolio Projects Added"
          description="You haven't added any project showcases yet. Add your manual highlights here or import your open-source repositories via the GitHub sync tool."
          actionLabel="Add Project Showcase"
          onAction={() => {
            setFormData(initialFormState);
            setIsAdding(true);
            setEditingId(null);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((proj) => (
            <Card
              key={proj._id}
              variant={editingId === proj._id ? "glass" : "interactive"}
              className={`p-5 flex flex-col justify-between space-y-4 ${
                editingId === proj._id ? "border-primary/60 bg-surface-2/90 shadow-glow-primary md:col-span-2" : "border-border"
              }`}
            >
              {editingId === proj._id ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    updateMutation.mutate({ id: proj._id, data: formData });
                  }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-border/80 pb-3">
                    <h4 className="text-sm font-bold text-primary flex items-center gap-2">
                      <Edit3 className="w-4 h-4" /> Editing Project: {proj.title}
                    </h4>
                    <Button type="button" variant="ghost" size="sm" onClick={() => setEditingId(null)} className="h-7 w-7 p-0">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Project Title"
                      className="h-10 text-sm font-semibold"
                    />
                    <Input
                      value={formData.technologies}
                      onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                      placeholder="Technologies (comma separated)"
                      className="h-10 text-xs font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      value={formData.liveUrl}
                      onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                      placeholder="Live URL"
                      className="h-10 text-xs font-mono"
                    />
                    <Input
                      value={formData.githubUrl}
                      onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                      placeholder="GitHub URL"
                      className="h-10 text-xs font-mono"
                    />
                  </div>

                  <Textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Project description and achievements..."
                    className="text-xs font-mono p-3"
                  />

                  <div className="flex items-center gap-2 p-2 rounded-lg bg-surface-1 border border-border">
                    <input
                      type="checkbox"
                      id={`feat-${proj._id}`}
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="rounded border-border bg-surface-2 text-primary focus:ring-primary h-4 w-4"
                    />
                    <Label htmlFor={`feat-${proj._id}`} className="text-xs font-semibold text-foreground cursor-pointer">
                      Featured Project on Portfolio
                    </Label>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-border/80">
                    <Button type="button" variant="outline" size="sm" onClick={() => setEditingId(null)}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="glow" size="sm" isLoading={updateMutation.isPending} className="font-bold px-6">
                      Save Changes
                    </Button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base font-black text-foreground leading-tight">{proj.title}</h4>
                        {proj.source === 'github' && (
                          <Badge variant="secondary" className="text-[10px] font-mono px-2 py-0.2 uppercase bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                            <GitBranch className="w-3 h-3 mr-1 inline" /> GitHub
                          </Badge>
                        )}
                        {proj.featured && (
                          <Badge variant="glass" className="text-[10px] font-mono px-2 py-0.2 uppercase text-purple-300 border-purple-500/40 bg-purple-500/10">
                            Featured
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setIsAdding(false);
                            setEditingId(proj._id);
                            setFormData({
                              title: proj.title || '',
                              description: proj.description || '',
                              liveUrl: proj.liveUrl || '',
                              githubUrl: proj.githubUrl || '',
                              technologies: Array.isArray(proj.technologies) ? proj.technologies.join(', ') : '',
                              featured: proj.featured || false,
                            });
                          }}
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (confirm(`Delete project "${proj.title}"?`)) {
                              deleteMutation.mutate(proj._id);
                            }
                          }}
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>

                    <div className="text-xs text-foreground/80 font-mono leading-relaxed bg-surface-1/50 p-3 rounded-xl border border-border/50 whitespace-pre-line line-clamp-4">
                      {proj.description || 'No description provided.'}
                    </div>

                    {Array.isArray(proj.technologies) && proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {proj.technologies.map((tech: string, i: number) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="bg-surface-2 text-foreground/90 border-border font-mono text-[10px] px-2 py-0.5"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border/80 text-xs font-mono text-muted-foreground">
                    <div className="flex items-center gap-3">
                      {proj.stars > 0 && (
                        <span className="flex items-center gap-1 text-amber-400 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" /> {proj.stars}
                        </span>
                      )}
                      {proj.forks > 0 && (
                        <span className="flex items-center gap-1">
                          <GitFork className="w-3.5 h-3.5" /> {proj.forks}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {proj.githubUrl && (
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-foreground transition-colors flex items-center gap-1 font-bold"
                        >
                          Code <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {proj.liveUrl && (
                        <a
                          href={proj.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:underline flex items-center gap-1 font-bold"
                        >
                          Demo <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsSection;
