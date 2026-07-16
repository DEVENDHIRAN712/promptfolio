import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDropzone } from 'react-dropzone';
import { FileText, UploadCloud, CheckCircle2, AlertCircle, RefreshCw, Eye, Edit3, ArrowRight, ShieldCheck, Cpu, User, FileCheck, Zap } from 'lucide-react';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import api from '@/lib/axios';
import Avatar from '@/components/ui/Avatar';
import { useAuthStore } from '@/store/useAuthStore';

export const ResumeStudioPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [activeResume, setActiveResume] = useState<any | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const { data: profileData } = useQuery({
    queryKey: ['completeProfile'],
    queryFn: async () => {
      const res = await api.get('/profile/all');
      return res.data;
    },
  });

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

  const getHealthColor = (score: number) => {
    if (score >= 85) return 'text-[#10B981] bg-[#ECFDF5] border-[#D1FAE5]';
    if (score >= 65) return 'text-[#4F46E5] bg-[#EEF2FF] border-[#E0E7FF]';
    if (score >= 40) return 'text-[#F59E0B] bg-[#FFFBEB] border-[#FEF3C7]';
    return 'text-[#EF4444] bg-[#FEF2F2] border-[#FEE2E2]';
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#4F46E5]">
              <FileText className="w-3.5 h-3.5" /> Resume Review Studio
            </span>
            <span className="text-slate-300 hidden sm:inline">&bull;</span>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#10B981] bg-[#ECFDF5] border border-[#D1FAE5] px-2 py-0.5 rounded font-bold uppercase tracking-wider select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              Auto Save Enabled
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight">
            Verify and Refine Your Resume
          </h1>
          <p className="text-sm text-[#64748B] max-w-2xl leading-relaxed">
            Upload your PDF resume to parse its contents. Inspect information details, refine skills, and update your public portfolio.
          </p>
        </div>

        {activeResume && (
          <div className="flex items-center gap-3 shrink-0">
            <a
              href={activeResume.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] text-xs font-semibold text-[#111827] transition-all shadow-sm"
            >
              <Eye className="w-4 h-4 text-[#4F46E5]" /> View Original PDF
            </a>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Dropzone & Upload History Panel (Col 5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Drag and Drop Card */}
          <Card variant="default" className="p-6 shadow-sm">
            <CardTitle className="text-sm font-bold text-[#111827] flex items-center gap-2 mb-1">
              <UploadCloud className="w-4 h-4 text-[#4F46E5]" /> Resume PDF Upload
            </CardTitle>
            <CardDescription className="text-xs text-[#64748B] mb-4">
              Upload your resume in PDF format (up to 10MB) to populate your profile
            </CardDescription>

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[220px] group ${
                isDragActive
                  ? 'border-[#4F46E5] bg-[#EEF2FF]/50 scale-[0.99]'
                  : 'border-[#CBD5E1] hover:border-[#4F46E5] bg-[#F8FAFC] hover:bg-white'
              }`}
            >
              <input {...getInputProps()} />
              <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 transition-all ${
                isDragActive ? 'bg-[#4F46E5] border-[#4F46E5] text-white scale-110' : 'bg-white border-[#E2E8F0] text-[#4F46E5] group-hover:scale-105 shadow-sm'
              }`}>
                {uploading ? <RefreshCw className="w-6 h-6 animate-spin text-[#4F46E5]" /> : <UploadCloud className="w-6 h-6" />}
              </div>

              {uploading ? (
                <div className="space-y-1">
                  <p className="text-sm font-bold text-[#111827] flex items-center justify-center gap-2">
                    Extracting Candidate Tokens...
                  </p>
                  <p className="text-xs text-[#64748B] font-mono">
                    Running heuristic mapping &amp; skill matching
                  </p>
                </div>
              ) : isDragActive ? (
                <p className="text-sm font-bold text-[#4F46E5]">Release to parse PDF file...</p>
              ) : (
                <div className="space-y-1.5">
                  <p className="text-sm font-bold text-[#111827]">
                    Drag &amp; drop your PDF resume here, or <span className="text-[#4F46E5] underline underline-offset-4">browse</span>
                  </p>
                  <p className="text-xs text-[#64748B]">
                    Auto-detects contact details, executive bio &amp; skills
                  </p>
                </div>
              )}
            </div>

            {uploadError && (
              <div className="mt-4 p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FEE2E2] text-[#EF4444] text-xs font-medium flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}
          </Card>

          {/* Upload History Repository */}
          <Card variant="default" className="p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3 mb-4">
              <CardTitle className="text-sm font-bold text-[#111827] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#4F46E5]" /> Document History
              </CardTitle>
              {resumesData && resumesData.length > 0 && (
                <Badge variant="secondary" className="text-[10px] font-mono px-2 py-0.5">
                  {resumesData.length} {resumesData.length === 1 ? 'file' : 'files'}
                </Badge>
              )}
            </div>

            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
              {isLoading ? (
                <div className="py-8 text-center text-xs text-[#64748B] font-mono">
                  Loading resume documents...
                </div>
              ) : !resumesData || resumesData.length === 0 ? (
                <EmptyState
                  icon={FileText}
                  title="No Resumes Uploaded"
                  description="Drop your PDF resume in the box above to begin candidate review."
                />
              ) : (
                resumesData.map((res: any) => {
                  const isActive = activeResume?._id === res._id;
                  return (
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
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between group ${
                        isActive
                          ? 'bg-[#EEF2FF] border-[#4F46E5] shadow-sm'
                          : 'bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
                        <div className={`p-2 rounded-lg border shrink-0 ${
                          isActive ? 'bg-white border-[#E0E7FF] text-[#4F46E5]' : 'bg-white border-[#E2E8F0] text-[#64748B]'
                        }`}>
                          <FileCheck className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`text-xs font-bold truncate ${isActive ? 'text-[#111827]' : 'text-[#111827]'}`}>
                            {res.originalName}
                          </p>
                          <p className="text-[10px] text-[#64748B] font-mono flex items-center gap-2 mt-0.5">
                            <span>{new Date(res.uploadedAt).toLocaleDateString()}</span>
                            <span>&bull;</span>
                            <span>{Math.round(res.fileSize / 1024)} KB</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${getHealthColor(res.healthScore || 0)}`}>
                          Score {res.healthScore}
                        </span>
                        {res.reviewed && (
                          <span title="Reviewed & Applied to Profile" className="p-1 rounded-md bg-[#ECFDF5] border border-[#D1FAE5] text-[#10B981]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Document Editor Studio (Col 7) */}
        <div className="lg:col-span-7">
          {!activeResume ? (
            <Card variant="default" className="h-full min-h-[480px] flex flex-col items-center justify-center text-center p-10 shadow-sm">
              <div className="max-w-md space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#64748B] mx-auto shadow-sm">
                  <Edit3 className="w-7 h-7 text-[#4F46E5]" />
                </div>
                <h3 className="text-lg font-bold text-[#111827]">No Document Active in Editor</h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Select a resume from your history on the left or upload a new PDF document. The studio will extract your information into fields that you can verify and apply directly to your profile.
                </p>
              </div>
            </Card>
          ) : (
            <Card variant="default" className="p-6 shadow-sm">
              {/* Editor Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#F1F5F9]">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#EEF2FF] border border-[#E0E7FF] text-[#4F46E5]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-[#111827] flex items-center gap-2">
                      Extracted Candidate Token Editor
                    </CardTitle>
                    <CardDescription className="text-xs text-[#64748B] font-mono">
                      Document ID: {activeResume._id.slice(-8)} &bull; {activeResume.originalName}
                    </CardDescription>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 self-start sm:self-center">
                  <Badge variant="default" className="text-xs font-mono px-3 py-1 bg-[#F8FAFC] border-[#E2E8F0] text-[#111827] font-bold">
                    Health: <span className="text-[#4F46E5] ml-1">{activeResume.healthScore}/100</span>
                  </Badge>
                  {activeResume.reviewed && (
                    <Badge variant="success" className="text-xs font-mono px-2.5 py-1">
                      <CheckCircle2 className="w-3 h-3 mr-1 inline" /> Verified
                    </Badge>
                  )}
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  saveReviewMutation.mutate();
                }}
                className="space-y-6 pt-6"
              >
                {saveSuccess && (
                  <div className="p-4 rounded-xl bg-[#ECFDF5] border border-[#D1FAE5] text-[#10B981] text-xs font-bold flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                      <span>Document tokens verified and synced with modular profile!</span>
                    </div>
                    <Badge variant="success" className="text-[10px] font-mono">
                      SYNCED
                    </Badge>
                  </div>
                )}

                {/* Section 1: Contact Identity Tokens */}
                <div className="space-y-3 p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#4F46E5] flex items-center gap-2 border-b border-[#E2E8F0] pb-2">
                    <User className="w-3.5 h-3.5" /> 01. Contact Identity Tokens
                  </h4>
                  <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center pt-1.5">
                    <div className="shrink-0 flex flex-col items-center gap-1">
                      <Avatar
                        src={profileData?.profile?.avatar}
                        name={reviewForm.fullName || user?.name || 'User'}
                        sizeClass="w-16 h-16 rounded-xl text-lg shadow-sm border"
                      />
                      <span className="text-[9px] font-mono text-[#64748B] font-semibold">Avatar Preview</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1 w-full">
                      <div className="space-y-1.5">
                        <Label htmlFor="fullName" className="text-xs font-bold text-[#111827]">Candidate Name</Label>
                        <Input
                          id="fullName"
                          value={reviewForm.fullName}
                          onChange={(e) => setReviewForm({ ...reviewForm, fullName: e.target.value })}
                          placeholder="John Doe"
                          className="h-10 text-xs font-semibold"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-xs font-bold text-[#111827]">Extracted Email</Label>
                        <Input
                          id="email"
                          value={reviewForm.email}
                          onChange={(e) => setReviewForm({ ...reviewForm, email: e.target.value })}
                          placeholder="email@domain.com"
                          className="h-10 text-xs font-mono"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="phone" className="text-xs font-bold text-[#111827]">Extracted Phone</Label>
                        <Input
                          id="phone"
                          value={reviewForm.phone}
                          onChange={(e) => setReviewForm({ ...reviewForm, phone: e.target.value })}
                          placeholder="+1 (555) 019-2831"
                          className="h-10 text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Executive Summary / Bio */}
                <div className="space-y-3 p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#4F46E5] flex items-center gap-2 border-b border-[#E2E8F0] pb-2">
                    <FileText className="w-3.5 h-3.5" /> 02. Executive Bio &amp; Professional Summary
                  </h4>
                  <div className="space-y-1.5 pt-1">
                    <Textarea
                      id="summary"
                      rows={4}
                      value={reviewForm.summary}
                      onChange={(e) => setReviewForm({ ...reviewForm, summary: e.target.value })}
                      placeholder="Senior Software Engineer with experience in distributed systems..."
                      className="text-xs leading-relaxed resize-y p-3.5 bg-white border-[#E2E8F0]"
                    />
                    <p className="text-xs text-[#64748B]">
                      This summary will automatically become your primary &ldquo;About Me&rdquo; introduction when applied.
                    </p>
                  </div>
                </div>

                {/* Section 3: Technical Skills Matrix */}
                <div className="space-y-3 p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#4F46E5] flex items-center gap-2 border-b border-[#E2E8F0] pb-2">
                    <Cpu className="w-3.5 h-3.5" /> 03. Detected Stack Matrix &amp; Skill Tokens
                  </h4>
                  <div className="space-y-3 pt-1">
                    <Input
                      id="skillsStr"
                      value={reviewForm.skillsStr}
                      onChange={(e) => setReviewForm({ ...reviewForm, skillsStr: e.target.value })}
                      placeholder="React, TypeScript, Node.js, Express, MongoDB, Docker"
                      className="h-10 text-xs font-mono"
                    />

                    {reviewForm.skillsStr.trim() && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {reviewForm.skillsStr.split(',').map((skill, idx) => {
                          const trimmed = skill.trim();
                          if (!trimmed) return null;
                          return (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="bg-white border-[#E2E8F0] text-[#111827] font-mono text-[10px] px-2.5 py-0.5 font-bold shadow-sm"
                            >
                              <Zap className="w-2.5 h-2.5 mr-1 text-[#4F46E5] inline" />
                              {trimmed}
                            </Badge>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Section 4: Auto-populate Sync Control */}
                <div className="p-4 rounded-xl bg-[#EEF2FF] border border-[#E0E7FF] flex items-start gap-3.5">
                  <input
                    type="checkbox"
                    id="applyProfile"
                    checked={reviewForm.applyToProfile}
                    onChange={(e) => setReviewForm({ ...reviewForm, applyToProfile: e.target.checked })}
                    className="mt-0.5 rounded border-[#CBD5E1] text-[#4F46E5] focus:ring-[#4F46E5] h-4 w-4 shrink-0 cursor-pointer"
                  />
                  <div className="space-y-1">
                    <Label htmlFor="applyProfile" className="text-xs font-bold text-[#111827] cursor-pointer flex items-center gap-1.5">
                      <span>Auto-populate modular profile with verified skills and summary</span>
                      <Badge variant="default" className="text-[10px] font-semibold px-1.5 py-0">
                        Recommended
                      </Badge>
                    </Label>
                    <p className="text-xs text-[#64748B] leading-relaxed">
                      Checking this box will immediately update your central Profile summary and inject any missing technical competencies into your skills section.
                    </p>
                  </div>
                </div>

                {/* Footer Bar */}
                <div className="pt-4 border-t border-[#F1F5F9] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-xs text-[#64748B] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" /> Inspect every field before final sync
                  </p>

                  <Button
                    type="submit"
                    variant="default"
                    isLoading={saveReviewMutation.isPending}
                    className="w-full sm:w-auto font-bold px-8 h-10 text-xs shadow-sm"
                  >
                    Save &amp; Apply Review <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </div>
              </form>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeStudioPage;
