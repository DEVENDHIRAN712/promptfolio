import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Copy, Check, RefreshCw, Layers, Award, Briefcase, Code, ExternalLink, Save, Cpu } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/axios';

export const PortfolioStudio: React.FC = () => {
  const queryClient = useQueryClient();
  const [focusArea, setFocusArea] = useState('Full Stack Software Engineering & Cloud Systems');
  const [generatedData, setGeneratedData] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'visual' | 'raw'>('visual');

  const generateMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/ai/generate-portfolio', { focusArea });
      return res.data.portfolio;
    },
    onSuccess: (data) => {
      setGeneratedData(data);
      setSaved(false);
    },
  });

  const handleCopyJson = () => {
    if (!generatedData) return;
    navigator.clipboard.writeText(JSON.stringify(generatedData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveToProfile = async () => {
    if (!generatedData) return;
    try {
      if (generatedData.heroSection?.headline || generatedData.aboutSummary) {
        await api.put('/profile/about', {
          title: generatedData.portfolioTitle || generatedData.heroSection?.headline || '',
          bio: generatedData.aboutSummary || '',
        });
        queryClient.invalidateQueries({ queryKey: ['completeProfile'] });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert('Failed to save portfolio highlights to profile.');
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
                <Sparkles className="w-5 h-5 text-blue-400" /> AI Portfolio Generator
              </CardTitle>
              <CardDescription>
                Synthesize your complete profile experience, skills, and projects into structured JSON portfolio architecture
              </CardDescription>
            </div>
            <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-mono">
              STRICT JSON ENGINE
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="focusArea" className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Target Career Domain / Focus Keywords
            </Label>
            <Input
              id="focusArea"
              value={focusArea}
              onChange={(e) => setFocusArea(e.target.value)}
              placeholder="e.g. Distributed AI Systems, React 19 Frontend Architecture, Cloud DevOps"
              className="bg-slate-950/80 border-slate-800 text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-slate-400">
              Gemini will evaluate all your experiences, GitHub repositories, and competencies to formulate your portfolio.
            </p>
            <Button
              onClick={() => generateMutation.mutate()}
              disabled={generateMutation.isPending}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold px-6 shadow-lg shadow-blue-500/20"
            >
              {generateMutation.isPending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Synthesizing Portfolio...
                </>
              ) : generatedData ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" /> Regenerate Portfolio
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" /> Generate Structured Portfolio
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
              <h4 className="text-base font-bold text-white">Synthesizing Candidate Intelligence...</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Analyzing work history bullet points, formatting domain competency clusters, and crafting high-impact recruiter elevator pitch in strict JSON.
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
          <strong>AI Generation Error:</strong> {(generateMutation.error as any)?.response?.data?.message || (generateMutation.error as Error)?.message || 'Failed to generate portfolio JSON.'}
        </div>
      )}

      {/* Generated Portfolio Output Studio */}
      {generatedData && !generateMutation.isPending && (
        <Card className="border-slate-800/80 bg-slate-900/60 backdrop-blur shadow-2xl">
          <CardHeader className="border-b border-slate-800/80 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-400" /> {generatedData.portfolioTitle || 'AI Portfolio Architecture'}
              </CardTitle>
              <CardDescription>Structured JSON ready for frontend integration or recruiter presentation</CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveTab('visual')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                    activeTab === 'visual' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Visual Preview
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('raw')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                    activeTab === 'raw' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Raw JSON
                </button>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyJson}
                className="text-xs border-slate-700 bg-slate-950/80 hover:bg-slate-800"
              >
                {copied ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                {copied ? 'Copied JSON' : 'Copy JSON'}
              </Button>

              <Button
                size="sm"
                onClick={handleSaveToProfile}
                disabled={saved}
                className="bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold"
              >
                {saved ? <Check className="w-3.5 h-3.5 mr-1" /> : <Save className="w-3.5 h-3.5 mr-1" />}
                {saved ? 'Applied to Profile' : 'Apply Bio & Title'}
              </Button>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {activeTab === 'raw' ? (
              <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto max-h-[600px] border border-slate-800">
                {JSON.stringify(generatedData, null, 2)}
              </pre>
            ) : (
              <div className="space-y-8">
                {/* Hero & Elevator Pitch */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950/40 border border-slate-800 space-y-4">
                  <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs font-mono uppercase">
                    Recruiter 45-Second Elevator Pitch
                  </Badge>
                  <p className="text-base sm:text-lg font-bold text-white leading-relaxed italic">
                    &ldquo;{generatedData.recruiterElevatorPitch || generatedData.heroSection?.subHeadline}&rdquo;
                  </p>
                  <div className="pt-2 border-t border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h3 className="text-sm font-black text-blue-400 uppercase tracking-wider">
                      {generatedData.heroSection?.headline}
                    </h3>
                    {generatedData.heroSection?.callToAction && (
                      <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                        CTA: {generatedData.heroSection.callToAction}
                      </span>
                    )}
                  </div>
                </div>

                {/* About Narrative */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-blue-400" /> Executive Summary Narrative
                  </h4>
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {generatedData.aboutSummary}
                  </div>
                </div>

                {/* Core Competencies */}
                {Array.isArray(generatedData.coreCompetencies) && generatedData.coreCompetencies.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-blue-400" /> Core Competency Clusters
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {generatedData.coreCompetencies.map((comp: any, idx: number) => (
                        <div key={idx} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                          <h5 className="text-sm font-bold text-white">{comp.domain}</h5>
                          <div className="flex flex-wrap gap-1.5">
                            {Array.isArray(comp.skills) && comp.skills.map((s: string, i: number) => (
                              <span key={i} className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
                                {s}
                              </span>
                            ))}
                          </div>
                          {comp.whyItMatters && (
                            <p className="text-xs text-slate-400 italic pt-1 border-t border-slate-900/80">
                              {comp.whyItMatters}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Featured Case Studies */}
                {Array.isArray(generatedData.featuredCaseStudies) && generatedData.featuredCaseStudies.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Code className="w-4 h-4 text-blue-400" /> Architecture &amp; Case Studies
                    </h4>
                    <div className="grid grid-cols-1 gap-4">
                      {generatedData.featuredCaseStudies.map((cs: any, idx: number) => (
                        <div key={idx} className="p-5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <h5 className="text-base font-bold text-white">{cs.title}</h5>
                            <div className="flex gap-2">
                              {cs.githubRepoUrl && (
                                <a href={cs.githubRepoUrl} target="_blank" rel="noreferrer" className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-mono">
                                  Repo <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                              {cs.liveDemoUrl && (
                                <a href={cs.liveDemoUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline flex items-center gap-1 font-mono">
                                  Live <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                              <span className="font-bold text-slate-400 block mb-0.5">Problem Statement</span>
                              <span className="text-slate-200">{cs.problemStatement}</span>
                            </div>
                            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                              <span className="font-bold text-blue-400 block mb-0.5">Architectural Solution</span>
                              <span className="text-slate-200">{cs.architectureSolution}</span>
                            </div>
                            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                              <span className="font-bold text-emerald-400 block mb-0.5">Impact &amp; Metrics</span>
                              <span className="text-slate-200">{cs.impactMetrics}</span>
                            </div>
                          </div>

                          {Array.isArray(cs.technologies) && cs.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {cs.technologies.map((t: string, i: number) => (
                                <span key={i} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 text-[11px] font-mono">
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}
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

export default PortfolioStudio;
