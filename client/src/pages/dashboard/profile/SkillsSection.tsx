import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Cpu, Plus, Trash2, Layers, Sparkles, CheckCircle2, ShieldAlert, Code2, Terminal, Database, Cloud, Brain, Wrench } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import api from '@/lib/axios';

interface SkillsSectionProps {
  skills: any[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    category: 'Frontend' as 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'AI/ML' | 'Other',
    proficiency: 'Intermediate' as 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert',
    yearsOfExperience: 2,
  });

  const addMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await api.post('/profile/skill', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['completeProfile'] });
      setFormData({ ...formData, name: '' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/profile/skill/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['completeProfile'] });
    },
  });

  const categories = ['Frontend', 'Backend', 'Database', 'DevOps', 'AI/ML', 'Other'];

  const getDomainIcon = (cat: string) => {
    switch (cat) {
      case 'Frontend': return <Code2 className="w-3.5 h-3.5 text-blue-400" />;
      case 'Backend': return <Terminal className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Database': return <Database className="w-3.5 h-3.5 text-amber-400" />;
      case 'DevOps': return <Cloud className="w-3.5 h-3.5 text-cyan-400" />;
      case 'AI/ML': return <Brain className="w-3.5 h-3.5 text-purple-400" />;
      default: return <Wrench className="w-3.5 h-3.5 text-pink-400" />;
    }
  };

  const getProficiencyColor = (prof: string) => {
    switch (prof) {
      case 'Expert': return 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-glow-sm';
      case 'Advanced': return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'Intermediate': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      default: return 'bg-surface-2 text-muted-foreground border-border';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <Card variant="glass" className="border-border p-6 shadow-md">
        <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
          <Cpu className="w-5 h-5 text-primary" /> Technical Competencies &amp; Stack Architecture
        </CardTitle>
        <CardDescription>
          Add and organize your specialized technologies, languages, frameworks, and domain proficiencies
        </CardDescription>
      </Card>

      {/* Quick Add Skill Bar */}
      <Card variant="glass" className="border-primary/40 bg-surface-2/90 shadow-glow-primary p-5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!formData.name.trim()) return;
            addMutation.mutate(formData);
          }}
          className="flex flex-col md:flex-row items-end gap-3"
        >
          <div className="flex-1 space-y-1.5 w-full">
            <Label htmlFor="skillName" className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-primary" /> Skill / Technology Name
            </Label>
            <Input
              id="skillName"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. React 19, TypeScript, PyTorch, Docker, Kubernetes"
              className="h-10 text-sm font-semibold"
            />
          </div>

          <div className="w-full md:w-44 space-y-1.5">
            <Label htmlFor="category" className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 font-bold">
              Domain
            </Label>
            <select
              id="category"
              value={formData.category}
              onChange={(e: any) => setFormData({ ...formData, category: e.target.value })}
              className="flex h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-xs font-medium text-slate-900 focus:ring-1 focus:ring-primary focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c} value={c} className="bg-white text-slate-900">{c}</option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-36 space-y-1.5">
            <Label htmlFor="proficiency" className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 font-bold">
              Proficiency
            </Label>
            <select
              id="proficiency"
              value={formData.proficiency}
              onChange={(e: any) => setFormData({ ...formData, proficiency: e.target.value })}
              className="flex h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-xs font-medium text-slate-900 focus:ring-1 focus:ring-primary focus:outline-none"
            >
              <option value="Beginner" className="bg-white text-slate-900">Beginner</option>
              <option value="Intermediate" className="bg-white text-slate-900">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>

          <Button
            type="submit"
            variant="glow"
            isLoading={addMutation.isPending}
            disabled={!formData.name.trim()}
            className="w-full md:w-auto h-10 px-5 font-bold shrink-0 text-xs"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Add Competency
          </Button>
        </form>
      </Card>

      {/* Categorized Skills Grid */}
      {skills.length === 0 ? (
        <EmptyState
          icon={Cpu}
          title="No Technical Competencies Documented"
          description="Your skill matrix is empty. Add your frontend, backend, AI/ML, and DevOps proficiencies above, or automatically extract them in the Resume Studio."
          actionLabel="Focus Skill Name Input"
          onAction={() => document.getElementById('skillName')?.focus()}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((category) => {
            const catSkills = skills.filter((s) => s.category === category);
            if (catSkills.length === 0) return null;

            return (
              <Card key={category} variant="interactive" className="border-border p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-border/80 pb-3 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-surface-2 border border-border">
                        {getDomainIcon(category)}
                      </div>
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
                        {category}
                      </h4>
                    </div>
                    <Badge variant="secondary" className="text-[10px] font-mono px-2 py-0.5">
                      {catSkills.length} {catSkills.length === 1 ? 'skill' : 'skills'}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {catSkills.map((skill) => (
                      <div
                        key={skill._id}
                        className="inline-flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-xl bg-surface-1 border border-border text-xs text-foreground group hover:border-primary/50 transition-all shadow-sm"
                      >
                        <span className="font-bold">{skill.name}</span>
                        <Badge variant="outline" className={`text-[9px] font-mono uppercase font-black px-1.5 py-0 rounded ${getProficiencyColor(skill.proficiency)}`}>
                          {skill.proficiency}
                        </Badge>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete skill "${skill.name}"?`)) {
                              deleteMutation.mutate(skill._id);
                            }
                          }}
                          className="text-muted-foreground hover:text-destructive p-0.5 rounded transition-colors ml-0.5"
                          title="Remove skill"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SkillsSection;
