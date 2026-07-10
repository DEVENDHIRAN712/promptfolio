import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Cpu, Plus, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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

  const getProficiencyColor = (prof: string) => {
    switch (prof) {
      case 'Expert': return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      case 'Advanced': return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'Intermediate': return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      default: return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-slate-800/80 bg-slate-900/60 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-400" /> Technical Competencies &amp; Skills
          </CardTitle>
          <CardDescription>
            Add skills categorized by domain and rated by proficiency for AI portfolio matching
          </CardDescription>
        </CardHeader>

        {/* Add Skill Form */}
        <CardContent className="border-b border-slate-800/60 pb-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!formData.name.trim()) return;
              addMutation.mutate(formData);
            }}
            className="flex flex-col sm:flex-row items-end gap-3"
          >
            <div className="flex-1 space-y-1.5 w-full">
              <Label htmlFor="skillName" className="text-xs">Skill / Technology Name</Label>
              <Input
                id="skillName"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. React 19, TypeScript, Docker"
              />
            </div>

            <div className="w-full sm:w-40 space-y-1.5">
              <Label htmlFor="category" className="text-xs">Domain</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e: any) => setFormData({ ...formData, category: e.target.value })}
                className="flex h-9 w-full rounded-md border border-slate-800 bg-slate-900/80 px-3 text-sm text-slate-100 focus:ring-1 focus:ring-blue-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="w-full sm:w-36 space-y-1.5">
              <Label htmlFor="proficiency" className="text-xs">Proficiency</Label>
              <select
                id="proficiency"
                value={formData.proficiency}
                onChange={(e: any) => setFormData({ ...formData, proficiency: e.target.value })}
                className="flex h-9 w-full rounded-md border border-slate-800 bg-slate-900/80 px-3 text-sm text-slate-100 focus:ring-1 focus:ring-blue-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            <Button
              type="submit"
              disabled={addMutation.isPending || !formData.name.trim()}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 shrink-0 font-semibold"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Skill
            </Button>
          </form>
        </CardContent>

        {/* Categorized Skills Grid */}
        <CardContent className="pt-6 space-y-6">
          {skills.length === 0 ? (
            <div className="text-center py-8 text-slate-500 border border-dashed border-slate-800 rounded-xl">
              <p className="text-sm">No technical skills added yet.</p>
              <p className="text-xs text-slate-600 mt-1">Use the quick bar above or extract skills via Resume Studio.</p>
            </div>
          ) : (
            categories.map((category) => {
              const catSkills = skills.filter((s) => s.category === category);
              if (catSkills.length === 0) return null;

              return (
                <div key={category} className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/80 pb-1">
                    {category} ({catSkills.length})
                  </h4>
                  <div className="flex flex-wrap gap-2.5 pt-1">
                    {catSkills.map((skill) => (
                      <div
                        key={skill._id}
                        className="inline-flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-sm text-white group hover:border-slate-700 transition-all"
                      >
                        <span className="font-semibold">{skill.name}</span>
                        <Badge variant="outline" className={`text-[10px] uppercase font-bold px-1.5 py-0 ${getProficiencyColor(skill.proficiency)}`}>
                          {skill.proficiency}
                        </Badge>
                        <button
                          type="button"
                          onClick={() => deleteMutation.mutate(skill._id)}
                          className="text-slate-500 hover:text-red-400 p-0.5 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SkillsSection;
