import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDropzone } from 'react-dropzone';
import { FileText, UploadCloud, CheckCircle, AlertCircle, Sparkles, RefreshCw, Eye, Edit3, ArrowRight, ShieldCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/axios';

export const ResumeStudioPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [activeResume, setActiveResume] = useState<any | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Editable review state
  const [reviewForm, setReviewForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    summary: '',
    skillsStr: '',
    applyToProfile: true,
  });

  const { data: resumesData, isLoading } = useQuery({
    queryKey: ['userResumes'],
    queryFn: async () => {
      const res = await api.get('/resume');
      return res.data.resumes;
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('resume', file);
      const res = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['userResumes'] });
      queryClient.invalidateQueries({ queryKey: ['completeProfile'] });
      setUploading(false);
      setActiveResume(data.resume);
      setReviewForm({
        fullName: data.parsedData.fullName || '',
        email: data.parsedData.email || '',
        phone: data.parsedData.phone || '',
        summary: data.parsedData.summary || '',
        skillsStr: Array.isArray(data.parsedData.skills) ? data.parsedData.skills.join(', ') : '',
        applyToProfile: true,
      });
    },
    onError: (err: any) => {
      setUploading(false);
      setUploadError(err.response?.data?.message || 'Failed to upload and parse PDF file.');
    },
  });

  const saveReviewMutation = useMutation({
    mutationFn: async () => {
      if (!activeResume) return;
      const skillsArray = reviewForm.skillsStr.split(',').map(s => s.trim()).filter(Boolean);
      const res = await api.put(`/resume/save/${activeResume._id}`, {
        fullName: reviewForm.fullName,
        email: reviewForm.email,
        phone: reviewForm.phone,
        summary: reviewForm.summary,
        skills: skillsArray,
        applyToProfile: reviewForm.applyToProfile,
      });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['userResumes'] });
      queryClient.invalidateQueries({ queryKey: ['completeProfile'] });
      setActiveResume(data.resume);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    },
  });

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    setUploadError(null);
    setSaveSuccess(false);
    setUploading(true);
    uploadMutation.mutate(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-400">
            <Sparkles className="w-3.5 h-3.5" /> AI PARSING ENGINE
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Interactive Resume Studio
          </h1>
          <p className="text-sm text-slate-400">
            Drop your PDF resume below. Inspect extracted candidate data and review every field before syncing.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Dropzone & Upload History */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-slate-800/80 bg-slate-900/60 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-purple-400" /> Upload PDF Resume
              </CardTitle>
              <CardDescription>Supported format: PDF (up to 10MB)</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[220px] ${
                  isDragActive
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-slate-800 hover:border-slate-700 bg-slate-950/50 hover:bg-slate-950/80'
                }`}
              >
                <input {...getInputProps()} />
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4 shadow-inner">
                  {uploading ? <RefreshCw className="w-6 h-6 animate-spin text-purple-400" /> : <UploadCloud className="w-7 h-7" />}
                </div>

                {uploading ? (
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-white">Extracting text &amp; candidate tokens...</p>
                    <p className="text-xs text-slate-400">Running heuristic regex mapping on PDF buffer</p>
                  </div>
                ) : isDragActive ? (
                  <p className="text-sm font-bold text-purple-400">Drop the PDF resume file here...</p>
                ) : (
                  <div className="space-y-1.5">
                    <p className="text-sm font-semibold text-white">
                      Drag &amp; drop PDF resume here, or <span className="text-purple-400 underline">browse</span>
                    </p>
                    <p className="text-xs text-slate-500">Instant extraction of summary and core skills</p>
                  </div>
                )}
              </div>

              {uploadError && (
                <div className="mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upload History List */}
          <Card className="border-slate-800/80 bg-slate-900/60 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" /> Upload History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoading ? (
                <p className="text-xs text-slate-500 py-4 text-center">Loading resume history...</p>
              ) : !resumesData || resumesData.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center border border-dashed border-slate-800 rounded-xl">
                  No resumes uploaded yet.
                </p>
              ) : (
                resumesData.map((res: any) => (
                  <div
                    key={res._id}
                    onClick={() => {
                      setActiveResume(res);
                      setReviewForm({
                        fullName: res.parsedData?.fullName || '',
                        email: res.parsedData?.email || '',
                        phone: res.parsedData?.phone || '',
                        summary: res.parsedData?.summary || '',
                        skillsStr: Array.isArray(res.parsedData?.skills) ? res.parsedData.skills.join(', ') : '',
                        applyToProfile: true,
                      });
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      activeResume?._id === res._id
                        ? 'bg-purple-500/15 border-purple-500/40 text-white shadow-sm'
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FileText className="w-4 h-4 text-purple-400 shrink-0" />
                      <div className="overflow-hidden">
                        <p className="text-xs font-semibold truncate">{res.originalName}</p>
                        <p className="text-[10px] text-slate-500 font-mono">
                          {new Date(res.uploadedAt).toLocaleDateString()} &bull; {Math.round(res.fileSize / 1024)} KB
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="outline" className="text-[10px] font-mono text-purple-400 border-purple-500/30">
                        Score {res.healthScore}
                      </Badge>
                      {res.reviewed && (
                        <span title="Reviewed & Applied">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Extracted Information Review Studio */}
        <div className="lg:col-span-7">
          {!activeResume ? (
            <Card className="border-slate-800/80 bg-slate-900/60 backdrop-blur h-full min-h-[460px] flex items-center justify-center text-center p-8">
              <div className="max-w-md space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 mx-auto">
                  <Edit3 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white">No Resume Selected for Review</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Upload a PDF resume or select one from your upload history on the left to inspect extracted information and edit mapping before applying to your profile.
                </p>
              </div>
            </Card>
          ) : (
            <Card className="border-slate-800/80 bg-slate-900/60 backdrop-blur">
              <CardHeader className="border-b border-slate-800/80 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" /> Extracted Candidate Data Review
                    </CardTitle>
                    <CardDescription>Verify and edit parsed PDF fields before saving</CardDescription>
                  </div>
                  <Badge className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-mono self-start">
                    Health Score: {activeResume.healthScore}/100
                  </Badge>
                </div>
              </CardHeader>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  saveReviewMutation.mutate();
                }}
              >
                <CardContent className="space-y-4 pt-6">
                  {saveSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" /> Reviewed data successfully saved and applied!
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="fullName" className="text-xs">Candidate Name</Label>
                      <Input
                        id="fullName"
                        value={reviewForm.fullName}
                        onChange={(e) => setReviewForm({ ...reviewForm, fullName: e.target.value })}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs">Extracted Email</Label>
                      <Input
                        id="email"
                        value={reviewForm.email}
                        onChange={(e) => setReviewForm({ ...reviewForm, email: e.target.value })}
                        placeholder="email@domain.com"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="phone" className="text-xs">Extracted Phone</Label>
                      <Input
                        id="phone"
                        value={reviewForm.phone}
                        onChange={(e) => setReviewForm({ ...reviewForm, phone: e.target.value })}
                        placeholder="+1 (555) 019-2831"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="summary" className="text-xs">Extracted Summary / Bio</Label>
                    <Textarea
                      id="summary"
                      rows={4}
                      value={reviewForm.summary}
                      onChange={(e) => setReviewForm({ ...reviewForm, summary: e.target.value })}
                      placeholder="Senior Full Stack Software Engineer with expertise in..."
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="skillsStr" className="text-xs">Detected Technical Skills (comma separated)</Label>
                    <Input
                      id="skillsStr"
                      value={reviewForm.skillsStr}
                      onChange={(e) => setReviewForm({ ...reviewForm, skillsStr: e.target.value })}
                      placeholder="React, TypeScript, Node.js, Express, MongoDB"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="applyProfile"
                        checked={reviewForm.applyToProfile}
                        onChange={(e) => setReviewForm({ ...reviewForm, applyToProfile: e.target.checked })}
                        className="rounded border-slate-700 bg-slate-900 text-purple-600 focus:ring-purple-500"
                      />
                      <Label htmlFor="applyProfile" className="text-xs font-semibold text-white cursor-pointer">
                        Auto-populate modular profile with these verified skills and summary
                      </Label>
                    </div>
                    <p className="text-[11px] text-slate-400 pl-6">
                      Checking this box will update your profile summary and add any new skills to your modular competencies list.
                    </p>
                  </div>
                </CardContent>

                <CardFooter className="border-t border-slate-800/60 pt-4 flex items-center justify-between">
                  <a
                    href={activeResume.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
                  >
                    <Eye className="w-4 h-4" /> View Original PDF File
                  </a>

                  <Button
                    type="submit"
                    disabled={saveReviewMutation.isPending}
                    className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-6 shadow-lg shadow-purple-600/20"
                  >
                    {saveReviewMutation.isPending ? 'Saving Review...' : 'Save & Apply Review'} <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeStudioPage;
