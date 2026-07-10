import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Briefcase, Plus, Trash2, Edit2, Check, X, Calendar, MapPin } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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
      <Card className="border-slate-800/80 bg-slate-900/60 backdrop-blur">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-400" /> Work Experience
            </CardTitle>
            <CardDescription>Independently add and manage professional employment roles</CardDescription>
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
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Role
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
              <h4 className="text-sm font-bold text-white">Add New Employment Role</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="company">Company Name</Label>
                  <Input
                    id="company"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Vercel / Apple"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="role">Job Title / Role</Label>
                  <Input
                    id="role"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="Senior Frontend Engineer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Cupertino, CA"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="month"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="endDate">End Date ({formData.current ? 'Present' : 'Select'})</Label>
                  <Input
                    id="endDate"
                    type="month"
                    disabled={formData.current}
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="current"
                  checked={formData.current}
                  onChange={(e) => setFormData({ ...formData, current: e.target.checked, endDate: '' })}
                  className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
                />
                <Label htmlFor="current" className="text-xs cursor-pointer">I currently work at this company</Label>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">Role Responsibilities &amp; Achievements</Label>
                <Textarea
                  id="description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Led migration to React 19, improved performance by 40%..."
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="technologies">Technologies Used (comma separated)</Label>
                <Input
                  id="technologies"
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  placeholder="React, TypeScript, Next.js, GraphQL, AWS"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={addMutation.isPending} className="bg-blue-600 hover:bg-blue-500">
                  {addMutation.isPending ? 'Saving...' : 'Save Experience'}
                </Button>
              </div>
            </form>
          </CardContent>
        )}

        <CardContent className="pt-2 space-y-4">
          {experiences.length === 0 && !isAdding ? (
            <div className="text-center py-8 text-slate-500 border border-dashed border-slate-800 rounded-xl">
              <p className="text-sm">No work experience roles added yet.</p>
              <p className="text-xs text-slate-600 mt-1">Click &ldquo;Add Role&rdquo; above to get started.</p>
            </div>
          ) : (
            experiences.map((exp) => (
              <div
                key={exp._id}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all space-y-3"
              >
                {editingId === exp._id ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      updateMutation.mutate({ id: exp._id, data: formData });
                    }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-blue-400">Editing Role: {exp.role}</h4>
                      <Button type="button" variant="ghost" size="sm" onClick={() => setEditingId(null)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Company"
                      />
                      <Input
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        placeholder="Role"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Input
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="Location"
                      />
                      <Input
                        type="month"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      />
                      <Input
                        type="month"
                        disabled={formData.current}
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      />
                    </div>

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

                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={() => setEditingId(null)}>
                        Cancel
                      </Button>
                      <Button type="submit" size="sm" disabled={updateMutation.isPending} className="bg-blue-600">
                        {updateMutation.isPending ? 'Updating...' : 'Update'}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h4 className="text-base font-bold text-white">{exp.role}</h4>
                        <p className="text-sm font-semibold text-blue-400 flex items-center gap-2 mt-0.5">
                          <span>{exp.company}</span>
                          {exp.location && (
                            <span className="text-xs text-slate-400 font-normal flex items-center gap-1">
                              &bull; <MapPin className="w-3 h-3 inline" /> {exp.location}
                            </span>
                          )}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs font-mono text-slate-300 bg-slate-900 border border-slate-800">
                          <Calendar className="w-3 h-3 mr-1 inline" />
                          {exp.startDate} &minus; {exp.current ? 'Present' : exp.endDate || 'Present'}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setIsAdding(false);
                            handleStartEdit(exp);
                          }}
                          className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (confirm('Delete this experience?')) {
                              deleteMutation.mutate(exp._id);
                            }
                          }}
                          className="h-8 w-8 p-0 text-slate-400 hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>

                    {exp.description && (
                      <p className="text-xs text-slate-300 leading-relaxed">{exp.description}</p>
                    )}

                    {Array.isArray(exp.technologies) && exp.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {exp.technologies.map((tech: string, i: number) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400 text-[11px] font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
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

export default ExperienceSection;
