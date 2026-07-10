import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Layers, Plus, Trash2, ExternalLink, GitBranch, Star, GitFork, Edit2, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/axios';

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
      <Card className="border-slate-800/80 bg-slate-900/60 backdrop-blur">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-400" /> Featured &amp; Open-Source Projects
            </CardTitle>
            <CardDescription>
              Manage manual project showcases and repositories imported from your public GitHub
            </CardDescription>
          </div>
          {!isAdding && (
            <Button
              onClick={() => {
                setFormData(initialFormState);
                setIsAdding(true);
                setEditingId(null);
              }}
              size="sm"
              className="bg-blue-600 hover:bg-blue-500 font-semibold text-xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Project
            </Button>
          )}
        </CardHeader>

        {isAdding && (
          <CardContent className="border-t border-slate-800/80 pt-4 bg-slate-950/40">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addMutation.mutate(formData);
              }}
              className="space-y-4"
            >
              <h4 className="text-sm font-bold text-white">Add Manual Project Entry</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="projTitle">Project Title</Label>
                  <Input
                    id="projTitle"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="AI Career Operating System"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="technologies">Technologies (comma separated)</Label>
                  <Input
                    id="technologies"
                    value={formData.technologies}
                    onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                    placeholder="React 19, TypeScript, Tailwind CSS, Mongoose"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="liveUrl">Live Demo / Production URL</Label>
                  <Input
                    id="liveUrl"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    placeholder="https://myproject.app"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="githubUrl">GitHub Repository URL</Label>
                  <Input
                    id="githubUrl"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="https://github.com/username/project"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">Project Description</Label>
                <Textarea
                  id="description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Built an autonomous AI system that parses resumes and tracks career growth metrics..."
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-900 text-blue-600"
                />
                <Label htmlFor="featured" className="text-xs cursor-pointer">Highlight this project as Featured on my portfolio</Label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={addMutation.isPending} className="bg-blue-600 hover:bg-blue-500">
                  {addMutation.isPending ? 'Saving...' : 'Save Project'}
                </Button>
              </div>
            </form>
          </CardContent>
        )}

        <CardContent className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.length === 0 && !isAdding ? (
            <div className="col-span-2 text-center py-8 text-slate-500 border border-dashed border-slate-800 rounded-xl">
              <p className="text-sm">No portfolio projects added yet.</p>
              <p className="text-xs text-slate-600 mt-1">Add a manual project or import directly from the GitHub Sync section.</p>
            </div>
          ) : (
            projects.map((proj) => (
              <div
                key={proj._id}
                className="p-5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
              >
                {editingId === proj._id ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      updateMutation.mutate({ id: proj._id, data: formData });
                    }}
                    className="space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-blue-400">Editing Project</h4>
                      <Button type="button" variant="ghost" size="sm" onClick={() => setEditingId(null)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Project Title"
                    />
                    <Textarea
                      rows={2}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Description"
                    />
                    <Input
                      value={formData.technologies}
                      onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                      placeholder="Technologies (comma separated)"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        value={formData.liveUrl}
                        onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                        placeholder="Live URL"
                      />
                      <Input
                        value={formData.githubUrl}
                        onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                        placeholder="GitHub URL"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <Button type="button" variant="outline" size="sm" onClick={() => setEditingId(null)}>
                        Cancel
                      </Button>
                      <Button type="submit" size="sm" disabled={updateMutation.isPending} className="bg-blue-600">
                        Update
                      </Button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-white leading-tight">{proj.title}</h4>
                          {proj.source === 'github' && (
                            <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] uppercase">
                              <GitBranch className="w-3 h-3 mr-1 inline" /> GitHub
                            </Badge>
                          )}
                          {proj.featured && (
                            <Badge className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] uppercase">
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
                            className="h-7 w-7 p-0 text-slate-400 hover:text-white"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (confirm(`Delete project "${proj.title}"?`)) {
                                deleteMutation.mutate(proj._id);
                              }
                            }}
                            className="h-7 w-7 p-0 text-slate-400 hover:text-red-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                        {proj.description || 'No description provided.'}
                      </p>

                      {Array.isArray(proj.technologies) && proj.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {proj.technologies.map((tech: string, i: number) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 text-[11px] font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs text-slate-400">
                      <div className="flex items-center gap-3">
                        {proj.stars > 0 && (
                          <span className="flex items-center gap-1 text-amber-400">
                            <Star className="w-3.5 h-3.5 fill-amber-400" /> {proj.stars}
                          </span>
                        )}
                        {proj.forks > 0 && (
                          <span className="flex items-center gap-1 text-slate-400">
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
                            className="hover:text-white transition-colors flex items-center gap-1 font-mono"
                          >
                            Code <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {proj.liveUrl && (
                          <a
                            href={proj.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-400 hover:underline flex items-center gap-1 font-mono"
                          >
                            Demo <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectsSection;
