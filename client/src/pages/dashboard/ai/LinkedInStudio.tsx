import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Copy, Check, RefreshCw, Sparkles, UserCheck, Briefcase, Cpu, Save } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/axios';

export const LinkedInStudio: React.FC = () => {
  const queryClient = useQueryClient();
  const [jobTarget, setJobTarget] = useState('Senior Full Stack & AI Software Engineer');
  const [focusArea, setFocusArea] = useState('Distributed Systems, React 19, High-Concurrency Node.js APIs');
  const [generatedLinkedIn, setGeneratedLinkedIn] = useState<any | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAbout, setCopiedAbout] = useState(false);
  const [appliedHeadline, setAppliedHeadline] = useState(false);

  const generateMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/ai/generate-linkedin', { jobTarget, focusArea });
      return res.data.linkedin;
    },
    onSuccess: (data) => {
      setGeneratedLinkedIn(data);
    },
  });

  const handleCopyHeadline = (headline: string, index: number) => {
    navigator.clipboard.writeText(headline);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAbout = () => {
    if (!generatedLinkedIn?.aboutSection?.fullAboutBio) return;
    navigator.clipboard.writeText(generatedLinkedIn.aboutSection.fullAboutBio);
    setCopiedAbout(true);
    setTimeout(() => setCopiedAbout(false), 2000);
  };

  const handleApplyToProfile = async (headline: string) => {
    try {
      await api.put('/profile/about', {
        title: headline,
        bio: generatedLinkedIn?.aboutSection?.fullAboutBio || '',
      });
      queryClient.invalidateQueries({ queryKey: ['completeProfile'] });
      setAppliedHeadline(true);
      setTimeout(() => setAppliedHeadline(false), 3000);
    } catch {
      alert('Failed to save headline and about bio to profile.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuration Card */}
      <Card className="border-slate-800/80 bg-slate-900/60 backdrop-blur">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <Share2 className="w-5 h-5 text-blue-400" /> LinkedIn Brand Makeover Studio
              </CardTitle>
              <CardDescription>
                Algorithm-optimized headlines, narrative About bio, and scannable experience role rewrites
              </CardDescription>
            </div>
            <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-mono">
              ALGORITHM OPTIMIZED
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="liJobTarget" className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Target Role / Career Goal
              </Label>
              <Input
                id="liJobTarget"
                value={jobTarget}
                onChange={(e) => setJobTarget(e.target.value)}
                placeholder="Staff / Senior Engineer"
                className="bg-slate-950/80 border-slate-800 text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="liFocusArea" className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Primary Keywords / Domain Focus
              </Label>
              <Input
                id="liFocusArea"
                value={focusArea}
                onChange={(e) => setFocusArea(e.target.value)}
                placeholder="Distributed AI, React 19, AWS"
                className="bg-slate-950/80 border-slate-800 text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-semibold"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-slate-400">
              Gemini will generate 3 keyword-dense headline variations and format your entire work history for scannability.
            </p>
            <Button
              onClick={() => generateMutation.mutate()}
              disabled={generateMutation.isPending || !jobTarget.trim()}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold px-6 shadow-lg shadow-blue-500/20"
            >
              {generateMutation.isPending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Optimizing Profile...
                </>
              ) : generatedLinkedIn ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" /> Regenerate Makeover
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" /> Generate LinkedIn Makeover
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
            className="p-8 rounded-2xl bg-slate-900/80 border border-blue-500/30 backdrop-blur text-center space-y-4 shadow-xl"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto animate-bounce">
              <Cpu className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-white">Engineering LinkedIn Algorithm Match...</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Formulating 220-character keyword headlines, structuring About bio with bullet symbols, and converting work roles into scannable achievement blocks.
              </p>
            </div>
            <div className="w-48 h-1.5 bg-slate-800 rounded-full mx-auto overflow-hidden">
              <motion.div
                className="w-full h-full bg-gradient-to-r from-blue-500 to-indigo-500 origin-left"
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
          <strong>LinkedIn Makeover Error:</strong> {(generateMutation.error as any)?.response?.data?.message || (generateMutation.error as Error)?.message || 'Failed to generate LinkedIn makeover.'}
        </div>
      )}

      {/* Generated LinkedIn Studio Output */}
      {generatedLinkedIn && !generateMutation.isPending && (
        <div className="space-y-6">
          {appliedHeadline && (
            <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-2">
              <Check className="w-4 h-4" /> Selected LinkedIn headline and About bio applied to your core profile!
            </div>
          )}

          {/* Headline Variations Card */}
          <Card className="border-slate-800/80 bg-slate-900/60 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-400" /> 3 Keyword-Optimized Headline Variations
              </CardTitle>
              <CardDescription className="text-xs">
                Copy and paste your favorite directly into your LinkedIn Headline setting (under 220 characters)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.isArray(generatedLinkedIn.headlineOptions) && generatedLinkedIn.headlineOptions.map((opt: any, idx: number) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <Badge variant="outline" className="text-[10px] font-mono text-blue-400 border-blue-500/30 uppercase">
                      {opt.style}
                    </Badge>
                    <p className="text-sm font-bold text-white tracking-tight">{opt.headline}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyHeadline(opt.headline, idx)}
                      className="text-xs h-8 border-slate-700 bg-slate-900/80"
                    >
                      {copiedIndex === idx ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                      {copiedIndex === idx ? 'Copied' : 'Copy'}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleApplyToProfile(opt.headline)}
                      className="text-xs h-8 bg-blue-600 hover:bg-blue-500"
                    >
                      <Save className="w-3.5 h-3.5 mr-1" /> Apply to Profile
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* About Section Card */}
          <Card className="border-slate-800/80 bg-slate-900/60 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-400" /> Scannable LinkedIn About Bio
                </CardTitle>
                <CardDescription className="text-xs">Designed with hooks above the fold and clear skill clusters</CardDescription>
              </div>
              <Button size="sm" onClick={handleCopyAbout} className="bg-blue-600 hover:bg-blue-500 text-xs">
                {copiedAbout ? <Check className="w-3.5 h-3.5 mr-1 text-white" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                {copiedAbout ? 'Copied About Bio' : 'Copy About Bio'}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                {generatedLinkedIn.aboutSection?.fullAboutBio}
              </div>
            </CardContent>
          </Card>

          {/* Experience Rewrites Card */}
          {Array.isArray(generatedLinkedIn.experienceRewrites) && generatedLinkedIn.experienceRewrites.length > 0 && (
            <Card className="border-slate-800/80 bg-slate-900/60 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-base font-bold text-white">Work Experience Rewrites for LinkedIn</CardTitle>
                <CardDescription className="text-xs">Copy these rewritten role descriptions directly into your LinkedIn Experience entries</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {generatedLinkedIn.experienceRewrites.map((exp: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-blue-400">{exp.linkedinTitle || exp.originalRole}</h4>
                      <Badge variant="secondary" className="text-xs font-mono bg-slate-900 text-slate-300">
                        {exp.company}
                      </Badge>
                    </div>
                    <div className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed pt-1">
                      {exp.linkedinDescription}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default LinkedInStudio;
