import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BookOpen, Plus, Trash2, Edit3, X, Calendar, GraduationCap, Award, Sparkles, Building, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
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
      {/* Top Action Header */}
      <Card variant="glass" className="border-border p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" /> Academic Credentials &amp; Degrees
          </CardTitle>
          <CardDescription>
            Document universities, bootcamps, and specialized educational foundations supporting your career
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
            <Plus className="w-4 h-4" /> Add Academic Credential
          </Button>
        )}
      </Card>

      {/* Add New Education Drawer Card */}
      {isAdding && (
        <Card variant="glass" className="border-primary/60 bg-surface-2/90 shadow-glow-primary animate-in fade-in-50 duration-200">
          <CardHeader className="border-b border-border/80 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold text-foreground">Add Academic Record</CardTitle>
                  <CardDescription className="text-[11px]">Specify degree and institution details.</CardDescription>
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
                  <Label htmlFor="institution" className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 font-bold flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-primary" /> Institution / University
                  </Label>
                  <Input
                    id="institution"
                    required
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    placeholder="Stanford University, MIT, Y Combinator School..."
                    className="h-10 text-sm font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="degree" className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 font-bold flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-primary" /> Degree / Qualification
                  </Label>
                  <Input
                    id="degree"
                    required
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    placeholder="Bachelor of Science (B.S.), Master of Engineering..."
                    className="h-10 text-sm font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="fieldOfStudy" className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 font-bold">
                    Major / Field of Study
                  </Label>
                  <Input
                    id="fieldOfStudy"
                    value={formData.fieldOfStudy}
                    onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
                    placeholder="Computer Science & AI"
                    className="h-10 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="startDate" className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 font-bold flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-primary" /> Start Date
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
                  <Label htmlFor="endDate" className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 font-bold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-primary" /> End Date ({formData.current ? 'Present' : 'Select'})
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 p-3 rounded-xl bg-surface-1/80 border border-border">
                  <input
                    type="checkbox"
                    id="currentEdu"
                    checked={formData.current}
                    onChange={(e) => setFormData({ ...formData, current: e.target.checked, endDate: '' })}
                    className="rounded border-border bg-surface-2 text-primary focus:ring-primary h-4 w-4"
                  />
                  <Label htmlFor="currentEdu" className="text-xs font-semibold text-slate-900 cursor-pointer">
                    I am currently enrolled at this institution
                  </Label>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="grade" className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 font-bold">
                    Grade / GPA / Honours (Optional)
                  </Label>
                  <Input
                    id="grade"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    placeholder="3.95 / 4.0 GPA or First Class Honours"
                    className="h-10 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description" className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 font-bold">
                  Societies, Publications &amp; Academic Achievements
                </Label>
                <Textarea
                  id="description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="• President of ACM Student Chapter & Lead AI Researcher.&#10;• Published paper on distributed transformer inference optimization."
                  className="text-xs font-mono leading-relaxed resize-y p-3"
                />
              </div>
            </CardContent>

            <CardFooter className="border-t border-border/80 pt-4 flex justify-end gap-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="glow" size="sm" isLoading={addMutation.isPending} className="font-bold px-6">
                Save Academic Record
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {/* Education List */}
      {educations.length === 0 && !isAdding ? (
        <EmptyState
          icon={GraduationCap}
          title="No Academic Credentials Added"
          description="Your education section is currently empty. Document degrees, bootcamps, or specialized diplomas to reinforce your technical foundation."
          actionLabel="Add Academic Record"
          onAction={() => {
            setFormData(initialFormState);
            setIsAdding(true);
            setEditingId(null);
          }}
        />
      ) : (
        <div className="space-y-4">
          {educations.map((edu) => (
            <Card
              key={edu._id}
              variant={editingId === edu._id ? "glass" : "interactive"}
              className={editingId === edu._id ? "border-primary/60 bg-surface-2/90 shadow-glow-primary" : "border-border"}
            >
              {editingId === edu._id ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    updateMutation.mutate({ id: edu._id, data: formData });
                  }}
                  className="p-6 space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-border/80 pb-3">
                    <h4 className="text-sm font-bold text-primary flex items-center gap-2">
                      <Edit3 className="w-4 h-4" /> Editing: {edu.degree} at {edu.institution}
                    </h4>
                    <Button type="button" variant="ghost" size="sm" onClick={() => setEditingId(null)} className="h-7 w-7 p-0">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      value={formData.institution}
                      onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                      placeholder="Institution"
                      className="h-10 text-sm font-semibold"
                    />
                    <Input
                      value={formData.degree}
                      onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                      placeholder="Degree"
                      className="h-10 text-sm font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Input
                      value={formData.fieldOfStudy}
                      onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
                      placeholder="Major / Field"
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-1 border border-border">
                      <input
                        type="checkbox"
                        id={`curr-edu-${edu._id}`}
                        checked={formData.current}
                        onChange={(e) => setFormData({ ...formData, current: e.target.checked, endDate: '' })}
                        className="rounded border-border bg-surface-2 text-primary focus:ring-primary h-4 w-4"
                      />
                      <Label htmlFor={`curr-edu-${edu._id}`} className="text-xs font-semibold text-foreground cursor-pointer">
                        Currently enrolled here
                      </Label>
                    </div>
                    <Input
                      value={formData.grade}
                      onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                      placeholder="Grade / GPA"
                      className="h-10 text-xs font-mono"
                    />
                  </div>

                  <Textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Academic activities, honors, research..."
                    className="text-xs font-mono p-3"
                  />

                  <div className="flex justify-end gap-2 pt-2 border-t border-border/80">
                    <Button type="button" variant="outline" size="sm" onClick={() => setEditingId(null)}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="glow" size="sm" isLoading={updateMutation.isPending} className="font-bold px-6">
                      Update Record
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base font-black text-foreground">{edu.degree}</h4>
                        {edu.current && (
                          <Badge variant="glass" className="text-[10px] font-mono px-2 py-0.2 uppercase text-purple-300 border-purple-500/40 bg-purple-500/10">
                            Currently Enrolled
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm font-bold text-primary flex items-center gap-2">
                        <Building className="w-4 h-4 text-primary shrink-0" />
                        <span>{edu.institution}</span>
                        {edu.fieldOfStudy && (
                          <span className="text-xs text-muted-foreground font-normal font-mono">
                            &bull; {edu.fieldOfStudy}
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-start">
                      <Badge variant="outline" className="text-xs font-mono bg-surface-2/80 text-muted-foreground border-border px-3 py-1">
                        <Calendar className="w-3.5 h-3.5 mr-1.5 inline text-primary" />
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
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm(`Remove "${edu.degree}" from your education records?`)) {
                            deleteMutation.mutate(edu._id);
                          }
                        }}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {edu.grade && (
                    <Badge variant="success" className="text-xs font-mono px-2.5 py-0.5">
                      <Award className="w-3.5 h-3.5 mr-1 inline text-emerald-400" />
                      Grade / Honours: {edu.grade}
                    </Badge>
                  )}

                  {edu.description && (
                    <div className="text-xs text-foreground/80 font-mono leading-relaxed bg-surface-1/50 p-3.5 rounded-xl border border-border/50 whitespace-pre-line">
                      {edu.description}
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

export default EducationSection;
