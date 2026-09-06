import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { User, MapPin, Briefcase, Link as LinkIcon, CheckCircle2, AlertCircle, Sparkles, Globe, Image as ImageIcon, Share2, Code2, MessageSquare } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import api from '@/lib/axios';
import { AvatarUpload } from './AvatarUpload';
import { useAuthStore } from '@/store/useAuthStore';

const GithubIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
);
const LinkedinIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);
const TwitterIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);

interface AboutSectionProps {
  profile: any;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ profile }) => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: profile?.title || '',
    bio: profile?.bio || '',
    location: profile?.location || '',
    avatar: profile?.avatar || '',
    socialLinks: {
      linkedin: profile?.socialLinks?.linkedin || '',
      github: profile?.socialLinks?.github || '',
      twitter: profile?.socialLinks?.twitter || '',
      portfolio: profile?.socialLinks?.portfolio || '',
    },
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        title: profile.title || '',
        bio: profile.bio || '',
        location: profile.location || '',
        avatar: profile.avatar || '',
        socialLinks: {
          linkedin: profile.socialLinks?.linkedin || '',
          github: profile.socialLinks?.github || '',
          twitter: profile.socialLinks?.twitter || '',
          portfolio: profile.socialLinks?.portfolio || '',
        },
      });
    }
  }, [profile]);

  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await api.put('/profile/about', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['completeProfile'] });
      setSuccessMessage(true);
      setErrorMessage(null);
      setTimeout(() => setSuccessMessage(false), 3500);
    },
    onError: (err: any) => {
      setErrorMessage(err.response?.data?.message || 'Failed to save professional identity.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Feedback Alert */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-in fade-in-50 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>About &amp; Professional Identity updated successfully across your live OS!</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-destructive/15 border border-destructive/30 text-destructive text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-in fade-in-50 duration-200">
          <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Card 1: Core Professional Identity & Location */}
      <Card variant="default" className="border-border shadow-md">
        <CardHeader className="pb-4 border-b border-border/80 flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] border border-[#E0E7FF] flex items-center justify-center text-[#4F46E5]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-foreground tracking-tight">
                Section 1: Headline &amp; Geographic Identity
              </CardTitle>
              <CardDescription>
                Define your primary professional headline, current location, and avatar display
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 font-mono">
                <Briefcase className="w-3.5 h-3.5 text-primary" /> Professional Headline / Title
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Senior Full Stack Engineer & AI Architect"
                className="h-11 text-sm font-medium"
              />
              <p className="text-[11px] text-muted-foreground/80">
                Displayed prominently below your name on the hero header.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 font-mono">
                <MapPin className="w-3.5 h-3.5 text-primary" /> Geographic Location
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="San Francisco, CA (Remote Friendly)"
                className="h-11 text-sm font-medium"
              />
              <p className="text-[11px] text-muted-foreground/80">
                City and state/country or remote availability.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-[#F1F5F9] mt-4">
            <AvatarUpload
              value={formData.avatar}
              onChange={(val) => setFormData({ ...formData, avatar: val })}
              name={user?.name}
            />
          </div>
        </CardContent>
      </Card>

      {/* Card 2: Executive Bio & Summary */}
      <Card variant="glass" className="border-border shadow-md">
        <CardHeader className="pb-4 border-b border-border/80 flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-foreground tracking-tight">
                Section 2: Executive Bio &amp; Technical Narrative
              </CardTitle>
              <CardDescription>
                A high-signal summary of your career focus, technical philosophy, and key domain experience
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 pt-6">
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono">
              Executive Narrative
            </Label>
            <Textarea
              id="bio"
              rows={5}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Full-stack engineer with 6+ years building distributed architectures, React/Next.js single-page applications, and AI integrations. Passionate about high-signal user interfaces and clean domain modeling..."
              className="text-sm font-medium leading-relaxed resize-y p-4"
            />
            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
              <span>Tip: Keep your bio actionable and quantitative when possible.</span>
              <span className="font-mono">{formData.bio.length} characters</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card 3: Social & Portfolio Ecosystem */}
      <Card variant="glass" className="border-border shadow-md">
        <CardHeader className="pb-4 border-b border-border/80 flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-cyan/15 border border-brand-cyan/25 flex items-center justify-center text-brand-cyan">
              <LinkIcon className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-foreground tracking-tight">
                Section 3: Social &amp; Portfolio Ecosystem Links
              </CardTitle>
              <CardDescription>
                Connect your external developer identities for one-click verification by recruiters and peers
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="linkedin" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2 font-mono">
                <LinkedinIcon className="w-4 h-4 text-blue-400" /> LinkedIn Profile URL
              </Label>
              <Input
                id="linkedin"
                value={formData.socialLinks.linkedin}
                onChange={(e) => setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, linkedin: e.target.value }
                })}
                placeholder="https://linkedin.com/in/username"
                className="h-11 text-xs font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="github" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2 font-mono">
                <GithubIcon className="w-4 h-4 text-foreground" /> GitHub Profile URL
              </Label>
              <Input
                id="github"
                value={formData.socialLinks.github}
                onChange={(e) => setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, github: e.target.value }
                })}
                placeholder="https://github.com/username"
                className="h-11 text-xs font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2 font-mono">
                <TwitterIcon className="w-4 h-4 text-cyan-400" /> Twitter / X Profile URL
              </Label>
              <Input
                id="twitter"
                value={formData.socialLinks.twitter}
                onChange={(e) => setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, twitter: e.target.value }
                })}
                placeholder="https://x.com/username"
                className="h-11 text-xs font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="portfolio" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2 font-mono">
                <Globe className="w-4 h-4 text-emerald-400" /> Personal Website / Portfolio
              </Label>
              <Input
                id="portfolio"
                value={formData.socialLinks.portfolio}
                onChange={(e) => setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, portfolio: e.target.value }
                })}
                placeholder="https://mycustomdomain.com"
                className="h-11 text-xs font-mono"
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="border-t border-border/80 pt-5 flex justify-end">
          <Button
            type="submit"
            variant="glow"
            size="lg"
            isLoading={mutation.isPending}
            className="font-bold px-8 shadow-lg"
          >
            {!mutation.isPending && <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-400" />}
            <span>Save Identity &amp; Headline</span>
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default AboutSection;
