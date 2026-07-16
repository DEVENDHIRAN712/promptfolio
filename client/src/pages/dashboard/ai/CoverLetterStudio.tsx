import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Copy, Check, RefreshCw, Sparkles, Send, Cpu, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/axios';

export const CoverLetterStudio: React.FC = () => {
  const [jobTitle, setJobTitle] = useState('Senior Full Stack Software Engineer');
  const [company, setCompany] = useState('Apple');
  const [jobDescription, setJobDescription] = useState('Seeking an experienced engineer capable of delivering highly performant React web applications and robust Node.js backend services. Experience with distributed systems, clean code architecture, and mentoring junior engineers is a plus.');
  const [generatedLetter, setGeneratedLetter] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'text' | 'structured'>('text');

  const generateMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/ai/generate-cover-letter', { jobTitle, company, jobDescription });
      return res.data.coverLetter;
    },
    onSuccess: (data) => {
      setGeneratedLetter(data);
    },
  });

  const handleCopyText = () => {
    if (!generatedLetter?.fullCoverLetterText) return;
    navigator.clipboard.writeText(generatedLetter.fullCoverLetterText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Configuration Card */}
      <Card className="border-slate-800/80 bg-slate-900/60 backdrop-blur">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-emerald-400" /> Tailored Cover Letter Generator
              </CardTitle>
              <CardDescription>
                Map your candidate experience directly to the target company&apos;s job requirements and pain points
              </CardDescription>
            </div>
            <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono">
              RECRUITER HOOK ENGINE
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="clJobTitle" className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Target Job Title
              </Label>
              <Input
                id="clJobTitle"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Senior Full Stack Engineer"
                className="bg-slate-950/80 border-slate-800 font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="clCompany" className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Target Company
              </Label>
              <Input
                id="clCompany"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Vercel / Stripe / Apple"
                className="bg-slate-950/80 border-slate-800 font-semibold"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="clJD" className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Paste Target Job Description (Requirements &amp; Responsibilities)
            </Label>
            <Textarea
              id="clJD"
              rows={4}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job posting requirements or key expectations here..."
              className="bg-slate-950/80 border-slate-800 text-xs leading-relaxed font-mono"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-slate-400">
              Avoids generic templates. Opens with an authoritative hook proving exact technical alignment.
            </p>
            <Button
              onClick={() => generateMutation.mutate()}
              disabled={generateMutation.isPending || !jobTitle.trim() || !company.trim()}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold px-6 shadow-lg shadow-emerald-500/20"
            >
              {generateMutation.isPending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Drafting Letter...
                </>
              ) : generatedLetter ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" /> Regenerate Letter
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" /> Generate Cover Letter
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
            className="p-8 rounded-2xl bg-slate-900/80 border border-emerald-500/30 backdrop-blur text-center space-y-4 shadow-xl"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto animate-bounce">
              <Cpu className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-white">Matching Candidate Achievements to {company}...</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Analyzing required skills in the job description, connecting relevant projects and work history metrics, and writing high-converting recruiter hook.
              </p>
            </div>
            <div className="w-48 h-1.5 bg-slate-800 rounded-full mx-auto overflow-hidden">
              <motion.div
                className="w-full h-full bg-gradient-to-r from-emerald-500 to-teal-500 origin-left"
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
          <strong>Cover Letter Generation Error:</strong> {(generateMutation.error as any)?.response?.data?.message || (generateMutation.error as Error)?.message || 'Failed to generate cover letter.'}
        </div>
      )}

      {/* Generated Cover Letter Output Studio */}
      {generatedLetter && !generateMutation.isPending && (
        <Card className="border-slate-800/80 bg-slate-900/60 backdrop-blur shadow-2xl">
          <CardHeader className="border-b border-slate-800/80 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-bold text-white">
                Cover Letter for {company}
              </CardTitle>
              <CardDescription className="text-xs">
                Tailored for {jobTitle} &bull; Ready to copy into application forms or email
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveTab('text')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                    activeTab === 'text' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Formatted Text
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('structured')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                    activeTab === 'structured' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Alignment Analysis
                </button>
              </div>

              <Button
                size="sm"
                onClick={handleCopyText}
                className="bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold shadow-md shadow-emerald-600/20"
              >
                {copied ? <Check className="w-3.5 h-3.5 mr-1 text-white" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                {copied ? 'Copied Full Text' : 'Copy Plain Text'}
              </Button>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {activeTab === 'text' ? (
              <div className="p-6 sm:p-8 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap max-h-[650px] overflow-y-auto">
                {generatedLetter.fullCoverLetterText}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Alignment Highlights */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" /> Why This Letter Converts
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    {Array.isArray(generatedLetter.alignmentHighlights) && generatedLetter.alignmentHighlights.map((note: string, i: number) => (
                      <div key={i} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                        {note}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Structured Paragraph Themes */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Paragraph Theme Breakdown
                  </h4>
                  {Array.isArray(generatedLetter.bodyParagraphs) && generatedLetter.bodyParagraphs.map((para: any, i: number) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                      <strong className="text-sm text-emerald-400 block">{para.theme}</strong>
                      <p className="text-xs text-slate-300 leading-relaxed">{para.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CoverLetterStudio;
