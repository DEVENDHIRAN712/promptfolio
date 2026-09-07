import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Copy, Check, RefreshCw, ShieldCheck, Award, Briefcase, Cpu, Download, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/axios';

export const ResumeStudioAI: React.FC = () => {
  const [style, setStyle] = useState<'ATS' | 'Modern' | 'Minimal'>('ATS');
  const [jobTitle, setJobTitle] = useState('Senior Full Stack Software Engineer');
  const [targetCompany, setTargetCompany] = useState('Apple / Vercel / Google');
  const [jobDescription, setJobDescription] = useState('');
  const [generatedResume, setGeneratedResume] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'visual' | 'raw'>('visual');

  const generateMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/ai/generate-resume', { style, jobTitle, targetCompany, jobDescription });
      return res.data.resume;
    },
    onSuccess: (data) => {
      setGeneratedResume(data);
    },
  });

  const handleCopyJson = () => {
    if (!generatedResume) return;
    navigator.clipboard.writeText(JSON.stringify(generatedResume, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const atsAnalysis = generatedResume?.atsAnalysis;

  return (
    <div className="space-y-6">
      {/* Configuration Card */}
      <Card className="border-slate-800/80 bg-slate-900/60 backdrop-blur">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" /> Tailored AI Resume Generator
              </CardTitle>
              <CardDescription>
                Formulate an ATS-optimized, Modern architectural, or Minimal high-signal resume tailored directly to your target company
              </CardDescription>
            </div>
            <Badge className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-mono">
              KEYWORD ENGINE
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="styleSelector" className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Formatting Style
              </Label>
              <select
                id="styleSelector"
                value={style}
                onChange={(e: any) => setStyle(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-semibold"
              >
                <option value="ATS" className="bg-white text-slate-900">ATS (Applicant Tracking System Optimized)</option>
                <option value="Modern" className="bg-white text-slate-900">Modern (Architectural &amp; Leadership Focus)</option>
                <option value="Minimal" className="bg-white text-slate-900">Minimal (High-Signal 1-Page Executive)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="targetJobTitle" className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Target Job Title
              </Label>
              <Input
                id="targetJobTitle"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Senior Backend Engineer"
                className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="targetCompany" className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Target Company / Industry context
              </Label>
              <Input
                id="targetCompany"
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
                placeholder="Fintech Startup / Fortune 500"
                className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-semibold"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="jobDescription" className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Target Job Description (Optional for ATS Keyword Match Analysis)
            </Label>
            <Textarea
              id="jobDescription"
              rows={3}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description or technical requirements here to calculate exact ATS Keyword Match..."
              className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-xs leading-relaxed font-mono"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-slate-400">
              {style === 'ATS' && 'Maximizes action verbs, quantifiable metrics, and exact keyword matches for automated parsing.'}
              {style === 'Modern' && 'Emphasizes system architecture, open-source repositories, and technical leadership impact.'}
              {style === 'Minimal' && 'Zero filler. Condenses highlights and technical competency clusters into ultra-clean formatting.'}
            </p>
            <Button
              onClick={() => generateMutation.mutate()}
              disabled={generateMutation.isPending || !jobTitle.trim()}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold px-6 shadow-lg shadow-purple-500/20"
            >
              {generateMutation.isPending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Tailoring Resume...
                </>
              ) : generatedResume ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" /> Regenerate Resume
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" /> Generate Tailored Resume
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Loading State Diagnostic Shimmer */}
      <AnimatePresence>
        {generateMutation.isPending && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="p-8 rounded-2xl bg-slate-900/80 border border-purple-500/30 backdrop-blur text-center space-y-4 shadow-xl"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 mx-auto animate-bounce">
              <Cpu className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-white">Tailoring Candidate Tokens to {jobTitle}...</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Running deterministic ATS keyword analysis, rewriting work experience bullet points for scannable impact, and formatting JSON.
              </p>
            </div>
            <div className="w-48 h-1.5 bg-slate-800 rounded-full mx-auto overflow-hidden">
              <motion.div
                className="w-full h-full bg-gradient-to-r from-purple-500 to-indigo-500 origin-left"
                animate={{ scaleX: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      {generateMutation.isError && (
        <div className="p-4 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-sm">
          <strong>AI Resume Generation Error:</strong> {(generateMutation.error as any)?.response?.data?.message || (generateMutation.error as Error)?.message || 'Failed to generate resume.'}
        </div>
      )}

      {/* Generated Resume Studio Output */}
      {generatedResume && !generateMutation.isPending && (
        <Card className="border-slate-800/80 bg-slate-900/60 backdrop-blur shadow-2xl">
          <CardHeader className="border-b border-slate-800/80 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="text-xl font-bold text-white">
                  {generatedResume.header?.fullName || 'Candidate'} &minus; {style} Resume
                </CardTitle>
                {atsAnalysis?.hasJobDescription ? (
                  <Badge className={`text-xs font-mono border ${
                    atsAnalysis.matchPercentage >= 75
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      : atsAnalysis.matchPercentage >= 50
                      ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                      : 'bg-red-500/15 text-red-400 border-red-500/30'
                  }`}>
                    ATS Match: {atsAnalysis.matchPercentage}%
                  </Badge>
                ) : (
                  <Badge className="bg-slate-800 text-slate-300 border border-slate-700 text-xs font-mono">
                    Resume Health: {atsAnalysis?.resumeHealthScore ?? 85}/100
                  </Badge>
                )}
              </div>
              <CardDescription className="text-xs pt-1">
                {atsAnalysis?.hasJobDescription
                  ? atsAnalysis.message
                  : `Resume Health Score computed. Add a Job Description to calculate ATS Match.`}
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveTab('visual')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                    activeTab === 'visual' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Document View
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('raw')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                    activeTab === 'raw' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  JSON Schema
                </button>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyJson}
                className="text-xs border-slate-700 bg-slate-950/80 hover:bg-slate-800 text-slate-200"
              >
                {copied ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                {copied ? 'Copied JSON' : 'Copy JSON'}
              </Button>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {activeTab === 'raw' ? (
              <pre className="p-4 rounded-xl bg-slate-950 text-purple-300 font-mono text-xs overflow-x-auto max-h-[600px] border border-slate-800">
                {JSON.stringify(generatedResume, null, 2)}
              </pre>
            ) : (
              <div className="space-y-6 max-w-4xl mx-auto p-6 sm:p-8 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl text-slate-100">
                {/* Header */}
                <div className="border-b border-slate-800 pb-5 text-center space-y-1.5">
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {generatedResume.header?.fullName || 'Candidate Name'}
                  </h2>
                  <p className="text-sm font-bold text-purple-400 tracking-wide uppercase">
                    {generatedResume.header?.headline || jobTitle}
                  </p>
                  <div className="flex flex-wrap justify-center gap-3 text-xs text-slate-400 font-mono pt-1">
                    {generatedResume.header?.location && <span>{generatedResume.header.location}</span>}
                    {generatedResume.header?.email && <span>&bull; {generatedResume.header.email}</span>}
                    {generatedResume.header?.phone && <span>&bull; {generatedResume.header.phone}</span>}
                    {generatedResume.header?.links?.github && <span>&bull; {generatedResume.header.links.github}</span>}
                  </div>
                </div>

                {/* Executive Summary */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400">Professional Summary</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {generatedResume.executiveSummary}
                  </p>
                </div>

                {/* Deterministic ATS Score & Requirement Breakdown */}
                {atsAnalysis?.hasJobDescription ? (
                  <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" /> Deterministic ATS Evaluation ({atsAnalysis.matchPercentage}%)
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">{atsAnalysis.message}</p>
                      </div>
                      {atsAnalysis.scoreBreakdown && (
                        <div className="flex flex-wrap gap-2 text-[11px] font-mono">
                          <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                            Tech: {atsAnalysis.scoreBreakdown.technicalSkills.score}/40
                          </span>
                          <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                            Resp: {atsAnalysis.scoreBreakdown.responsibilities.score}/25
                          </span>
                          <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                            Exp: {atsAnalysis.scoreBreakdown.experience.score}/15
                          </span>
                          <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                            Edu: {atsAnalysis.scoreBreakdown.education.score}/10
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Required vs Preferred Skills */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                          <span>Required Technical Skills</span>
                          <span className="text-emerald-400 font-mono">
                            {(atsAnalysis.matchedRequiredKeywords || []).length} / {((atsAnalysis.matchedRequiredKeywords || []).length + (atsAnalysis.missingRequiredKeywords || []).length) || (atsAnalysis.matchedKeywords || []).length} Matched
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {(atsAnalysis.matchedRequiredKeywords || atsAnalysis.matchedKeywords || []).map((kw: string, i: number) => (
                            <Badge key={i} className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[11px] font-mono">
                              ✓ {kw}
                            </Badge>
                          ))}
                          {(atsAnalysis.missingRequiredKeywords || []).map((kw: string, i: number) => (
                            <Badge key={i} variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20 text-[11px] font-mono">
                              ✗ {kw}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                          <span>Preferred Skills &amp; Competencies</span>
                          <span className="text-purple-400 font-mono">
                            {(atsAnalysis.matchedPreferredKeywords || []).length} / {((atsAnalysis.matchedPreferredKeywords || []).length + (atsAnalysis.missingPreferredKeywords || []).length) || '0'} Matched
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {(atsAnalysis.matchedPreferredKeywords || []).map((kw: string, i: number) => (
                            <Badge key={i} className="bg-purple-500/15 text-purple-300 border border-purple-500/30 text-[11px] font-mono">
                              ✓ {kw}
                            </Badge>
                          ))}
                          {(atsAnalysis.missingPreferredKeywords || []).map((kw: string, i: number) => (
                            <Badge key={i} variant="outline" className="bg-slate-950 text-slate-400 border-slate-800 text-[11px] font-mono">
                              - {kw}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Missing Requirements Warnings if any */}
                    {Array.isArray(atsAnalysis.missingRequirements) && atsAnalysis.missingRequirements.length > 0 && (
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs space-y-1">
                        <span className="font-bold uppercase tracking-wider block text-[11px]">Key Gaps Identified:</span>
                        <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                          {atsAnalysis.missingRequirements.slice(0, 4).map((gap: string, i: number) => (
                            <li key={i}>{gap}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
                    <span>Add a Job Description during generation to calculate exact ATS Match percentage &amp; Skill Breakdown.</span>
                    <Badge variant="outline" className="bg-slate-950 text-slate-400 border-slate-700">
                      Resume Health: {atsAnalysis?.resumeHealthScore ?? 85}/100
                    </Badge>
                  </div>
                )}

                {/* Skills Grid */}
                {generatedResume.skillsSection && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400">Technical Competencies</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {generatedResume.skillsSection.languagesAndCore && (
                        <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                          <strong className="text-white block mb-1">Languages &amp; Core:</strong>
                          <span className="text-slate-300">{generatedResume.skillsSection.languagesAndCore.join(', ')}</span>
                        </div>
                      )}
                      {generatedResume.skillsSection.frameworksAndLibraries && (
                        <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                          <strong className="text-white block mb-1">Frameworks &amp; Libraries:</strong>
                          <span className="text-slate-300">{generatedResume.skillsSection.frameworksAndLibraries.join(', ')}</span>
                        </div>
                      )}
                      {generatedResume.skillsSection.cloudAndDevOps && (
                        <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                          <strong className="text-white block mb-1">Cloud &amp; DevOps:</strong>
                          <span className="text-slate-300">{generatedResume.skillsSection.cloudAndDevOps.join(', ')}</span>
                        </div>
                      )}
                      {generatedResume.skillsSection.architectureAndMethodologies && (
                        <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                          <strong className="text-white block mb-1">Architecture &amp; Scale:</strong>
                          <span className="text-slate-300">{generatedResume.skillsSection.architectureAndMethodologies.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Experience */}
                {Array.isArray(generatedResume.experience) && generatedResume.experience.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400">Professional Work History</h3>
                    <div className="space-y-5">
                      {generatedResume.experience.map((exp: any, idx: number) => (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm font-bold">
                            <span className="text-white">{exp.role} &bull; <span className="text-purple-400">{exp.company}</span></span>
                            <span className="text-xs font-mono text-slate-400">{exp.dateRange} | {exp.location}</span>
                          </div>
                          <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-300 pl-1 leading-relaxed">
                            {Array.isArray(exp.bullets) && exp.bullets.map((bullet: string, bIdx: number) => (
                              <li key={bIdx}>{bullet}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResumeStudioAI;
