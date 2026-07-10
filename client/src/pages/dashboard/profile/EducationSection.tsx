import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BookOpen, Plus, Trash2, Edit2, Check, X, Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/axios';

interface EducationSectionProps {
  educations: any[];
}

export const EducationSection: React.FC<EducationSectionProps> = ({ educations }) => {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const initialFormState = {
    institution: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '2019-09',
    endDate: '2023-06',
    current: false,
    grade: '',
    description: '',
  };

  const [formData, setFormData] = useState(initialFormState);

  const addMutation = useMutation({
    mutationFn: async (data: typeof initialFormState) => {
      const res = await api.post('/profile/education', data);
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
      const res = await api.put(`/profile/education/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['completeProfile'] });
      setEditingId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/profile/education/${id}`);
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
              <BookOpen className="w-5 h-5 text-blue-400" /> Education &amp; Academic Credentials
            </CardTitle>
            <CardDescription>Independently add and manage degrees, diplomas, and institutions</CardDescription>
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
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Education
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
              <h4 className="text-sm font-bold text-white">Add New Academic Credential</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="institution">Institution / University</Label>
                  <Input
                    id="institution"
                    required
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    placeholder="Stanford University / MIT"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="degree">Degree / Qualification</Label>
                  <Input
                    id="degree"
                    required
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    placeholder="Bachelor of Science (B.S.)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="fieldOfStudy">Field of Study / Major</Label>
                  <Input
                    id="fieldOfStudy"
                    value={formData.fieldOfStudy}
                    onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
                    placeholder="Computer Science"
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="currentEdu"
                    checked={formData.current}
                    onChange={(e) => setFormData({ ...formData, current: e.target.checked, endDate: '' })}
                    className="rounded border-slate-700 bg-slate-900 text-blue-600"
                  />
                  <Label htmlFor="currentEdu" className="text-xs cursor-pointer">I am currently enrolled here</Label>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="grade">Grade / GPA / Honours (Optional)</Label>
                  <Input
                    id="grade"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    placeholder="3.9 / 4.0 GPA or First Class Honours"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">Activities, Societies &amp; Notable Projects</Label>
                <Textarea
                  id="description"
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="President of ACM Club, Member of AI Lab..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={addMutation.isPending} className="bg-blue-600 hover:bg-blue-500">
                  {addMutation.isPending ? 'Saving...' : 'Save Education'}
                </Button>
              </div>
            </form>
          </CardContent>
        )}

        <CardContent className="pt-2 space-y-4">
          {educations.length === 0 && !isAdding ? (
            <div className="text-center py-8 text-slate-500 border border-dashed border-slate-800 rounded-xl">
              <p className="text-sm">No academic credentials added yet.</p>
              <p className="text-xs text-slate-600 mt-1">Click &ldquo;Add Education&rdquo; above to list your degrees.</p>
            </div>
          ) : (
            educations.map((edu) => (
              <div
                key={edu._id}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all space-y-3"
              >
                {editingId === edu._id ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      updateMutation.mutate({ id: edu._id, data: formData });
                    }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-blue-400">Editing: {edu.degree}</h4>
                      <Button type="button" variant="ghost" size="sm" onClick={() => setEditingId(null)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input
                        value={formData.institution}
                        onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                        placeholder="Institution"
                      />
                      <Input
                        value={formData.degree}
                        onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                        placeholder="Degree"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Input
                        value={formData.fieldOfStudy}
                        onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
                        placeholder="Major / Field"
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
                        <h4 className="text-base font-bold text-white">{edu.degree}</h4>
                        <p className="text-sm font-semibold text-blue-400 mt-0.5">
                          <span>{edu.institution}</span>
                          {edu.fieldOfStudy && (
                            <span className="text-xs text-slate-400 font-normal"> &bull; {edu.fieldOfStudy}</span>
                          )}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs font-mono text-slate-300 bg-slate-900 border border-slate-800">
                          <Calendar className="w-3 h-3 mr-1 inline" />
                          {edu.startDate} &minus; {edu.current ? 'Present' : edu.endDate || 'Present'}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setIsAdding(false);
                            setEditingId(edu._id);
                            setFormData({
                              institution: edu.institution || '',
                              degree: edu.degree || '',
                              fieldOfStudy: edu.fieldOfStudy || '',
                              startDate: edu.startDate || '',
                              endDate: edu.endDate || '',
                              current: edu.current || false,
                              grade: edu.grade || '',
                              description: edu.description || '',
                            });
                          }}
                          className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (confirm('Delete this education item?')) {
                              deleteMutation.mutate(edu._id);
                            }
                          }}
                          className="h-8 w-8 p-0 text-slate-400 hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>

                    {edu.grade && (
                      <p className="text-xs font-mono text-emerald-400">Grade / Honours: {edu.grade}</p>
                    )}

                    {edu.description && (
                      <p className="text-xs text-slate-300 leading-relaxed">{edu.description}</p>
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

export default EducationSection;
