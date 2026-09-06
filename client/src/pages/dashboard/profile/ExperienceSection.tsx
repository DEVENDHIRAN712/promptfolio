import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Briefcase, Plus, Trash2, Edit3, CheckCircle2, X, Calendar, MapPin, Sparkles, Building2, Code2, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import api from '@/lib/axios';

interface ExperienceSectionProps {
  experiences: any[];
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experiences }) => {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const initialFormState = {
    company: '',
    role: '',
    location: '',
    startDate: '2023-01',
    endDate: '',
    current: false,
    description: '',
    technologies: '',
  };

  const [formData, setFormData] = useState(initialFormState);

  const addMutation = useMutation({
    mutationFn: async (data: typeof initialFormState) => {
      const payload = {
        ...data,
        technologies: data.technologies.split(',').map(t => t.trim()).filter(Boolean),
      };
      const res = await api.post('/profile/experience', payload);
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
      const res = await api.put(`/profile/experience/${id}`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['completeProfile'] });
      setEditingId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/profile/experience/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['completeProfile'] });
    },
  });

  const handleStartEdit = (exp: any) => {
    setEditingId(exp._id);
    setFormData({
      company: exp.company || '',
      role: exp.role || '',
      location: exp.location || '',
      startDate: exp.startDate || '',
      endDate: exp.endDate || '',
      current: exp.current || false,
      description: exp.description || '',
      technologies: Array.isArray(exp.technologies) ? exp.technologies.join(', ') : '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <Card variant="glass" className="border-border p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" /> Work Experience &amp; Positions
          </CardTitle>
          <CardDescription>
            Document your professional history, key engineering achievements, and technologies used per role
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
            <Plus className="w-4 h-4" /> Add Employment Role
          </Button>
        )}
      </Card>

      {/* Add New Role Drawer Card */}
      {isAdding && (
        <Card variant="glass" className="border-primary/60 bg-surface-2/90 shadow-glow-primary animate-in fade-in-50 duration-200">
          <CardHeader className="border-b border-border/80 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold text-foreground">Create New Employment Record</CardTitle>
                  <CardDescription className="text-[11px]">Enter details for your position. This will immediately reflect on your live portfolio.</CardDescription>
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
                  <Label htmlFor="company" className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#4F46E5]" /> Company Name
                  </Label>
                  <Input
                    id="company"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Vercel, Apple, Stripe, etc."
                    className="h-10 text-sm font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="role" className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-[#4F46E5]" /> Job Title / Role
                  </Label>
                  <Input
                    id="role"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="Senior Frontend Engineer"
                    className="h-10 text-sm font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="location" className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#4F46E5]" /> Location
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Cupertino, CA (Hybrid)"
                    className="h-10 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="startDate" className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#4F46E5]" /> Start Date
                  </Label>
                  <Input
                    id="startDate"
                    type="month"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="h-10 text-xs font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="endDate" className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#4F46E5]" /> End Date ({formData.current ? 'Present' : 'Select'})
                  </Label>
                  <Input
                    id="endDate"
                    type="month"
                    disabled={formData.current}
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="h-10 text-xs font-mono disabled:opacity-40"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-[#E2E8F0]">
                <input
                  type="checkbox"
                  id="current"
                  checked={formData.current}
                  onChange={(e) => setFormData({ ...formData, current: e.target.checked, endDate: '' })}
                  className="rounded border-[#E2E8F0] bg-white text-[#4F46E5] focus:ring-[#4F46E5] h-4 w-4"
                />
                <Label htmlFor="current" className="text-xs font-semibold text-slate-900 cursor-pointer">
                  I currently work at this role (Mark as active / Present position)
                </Label>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description" className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800">
                  Responsibilities &amp; Measurable Achievements
                </Label>
                <Textarea
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="• Spearheaded migration to React 19, reducing bundle latency by 35% across 4M active users.&#10;• Designed decoupled state management in Zustand and custom query caching via TanStack Query."
                  className="text-xs font-mono leading-relaxed resize-y p-3"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="technologies" className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-[#4F46E5]" /> Technologies Used (comma separated)
                </Label>
                <Input
                  id="technologies"
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  placeholder="React 19, TypeScript, Next.js, Tailwind CSS, GraphQL, AWS"
                  className="h-10 text-xs font-mono"
                />
                {formData.technologies && (
                  <div className="flex flex-wrap gap-1.5 pt-1.5">
                    {formData.technologies.split(',').map((t, idx) => t.trim() ? (
                      <Badge key={idx} variant="secondary" className="text-[10px] font-mono py-0.5">
                        {t.trim()}
                      </Badge>
                    ) : null)}
                  </div>
                )}
              </div>
            </CardContent>

            <CardFooter className="border-t border-border/80 pt-4 flex justify-end gap-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="glow" size="sm" isLoading={addMutation.isPending} className="font-bold px-6">
                Save Work Experience
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {/* Experience List / Timeline */}
      {experiences.length === 0 && !isAdding ? (
        <EmptyState
          icon={Briefcase}
          title="No Work Experience Documented"
          description="Your modular experience section is clean. Add your past and current engineering roles to showcase your track record to top recruiters."
          actionLabel="Add First Role"
          onAction={() => {
            setFormData(initialFormState);
            setIsAdding(true);
            setEditingId(null);
          }}
        />
      ) : (
        <div className="space-y-4">
          {experiences.map((exp) => (
            <Card
              key={exp._id}
              variant={editingId === exp._id ? "glass" : "interactive"}
              className={editingId === exp._id ? "border-primary/60 bg-surface-2/90 shadow-glow-primary" : "border-border"}
            >
              {editingId === exp._id ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    updateMutation.mutate({ id: exp._id, data: formData });
                  }}
                  className="p-6 space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-border/80 pb-3">
                    <h4 className="text-sm font-bold text-primary flex items-center gap-2">
                      <Edit3 className="w-4 h-4" /> Editing Role: {exp.role} at {exp.company}
                    </h4>
                    <Button type="button" variant="ghost" size="sm" onClick={() => setEditingId(null)} className="h-7 w-7 p-0">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Company"
                      className="h-10 text-sm font-semibold"
                    />
                    <Input
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      placeholder="Role"
                      className="h-10 text-sm font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Location"
                      className="h-10 text-xs"
                    />
                    <Input
                      type="month"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="h-10 text-xs font-mono"
                    />
                    <Input
                      type="month"
                      disabled={formData.current}
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="h-10 text-xs font-mono disabled:opacity-40"
                    />
                  </div>

                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-1 border border-border">
                    <input
                      type="checkbox"
                      id={`curr-${exp._id}`}
                      checked={formData.current}
                      onChange={(e) => setFormData({ ...formData, current: e.target.checked, endDate: '' })}
                      className="rounded border-border bg-surface-2 text-primary focus:ring-primary h-4 w-4"
                    />
                    <Label htmlFor={`curr-${exp._id}`} className="text-xs font-semibold text-foreground cursor-pointer">
                      I currently work at this company (Present role)
                    </Label>
                  </div>

                  <Textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Role responsibilities and achievements..."
                    className="text-xs font-mono p-3"
                  />

                  <Input
                    value={formData.technologies}
                    onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                    placeholder="Technologies (comma separated)"
                    className="h-10 text-xs font-mono"
                  />

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
                <div className="p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base font-black text-foreground">{exp.role}</h4>
                        {exp.current && (
                          <Badge variant="glass" className="text-[10px] font-mono px-2 py-0.2 uppercase text-purple-300 border-purple-500/40 bg-purple-500/10">
                            Active Role
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm font-bold text-primary flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-primary shrink-0" />
                        <span>{exp.company}</span>
                        {exp.location && (
                          <span className="text-xs text-muted-foreground font-normal flex items-center gap-1 font-mono">
                            &bull; <MapPin className="w-3 h-3 text-muted-foreground" /> {exp.location}
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-start">
                      <Badge variant="outline" className="text-xs font-mono bg-surface-2/80 text-muted-foreground border-border px-3 py-1">
                        <Calendar className="w-3.5 h-3.5 mr-1.5 inline text-primary" />
                        {exp.startDate} &minus; {exp.current ? 'Present' : exp.endDate || 'Present'}
                      </Badge>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setIsAdding(false);
                          handleStartEdit(exp);
                        }}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm(`Remove role "${exp.role} at ${exp.company}" from your career profile?`)) {
                            deleteMutation.mutate(exp._id);
                          }
                        }}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {exp.description && (
                    <div className="text-xs text-foreground/80 font-mono leading-relaxed bg-surface-1/50 p-3.5 rounded-xl border border-border/50 whitespace-pre-line">
                      {exp.description}
                    </div>
                  )}

                  {Array.isArray(exp.technologies) && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[11px] font-mono uppercase font-bold text-muted-foreground mr-1">Stack:</span>
                      {exp.technologies.map((tech: string, i: number) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="bg-surface-2 text-foreground/90 border-border font-mono text-[11px] px-2.5 py-0.5"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExperienceSection;
