import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { User, MapPin, Briefcase, Link as LinkIcon, Check, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import api from '@/lib/axios';

interface AboutSectionProps {
  profile: any;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ profile }) => {
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

  const [successMessage, setSuccessMessage] = useState(false);

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await api.put('/profile/about', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['completeProfile'] });
      setSuccessMessage(true);
      setTimeout(() => setSuccessMessage(false), 3000);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <Card className="border-slate-800/80 bg-slate-900/60 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
          <User className="w-5 h-5 text-blue-400" /> About &amp; Professional Identity
        </CardTitle>
        <CardDescription>
          Independently update your core title, summary bio, location, and social links
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {successMessage && (
            <div className="p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-2">
              <Check className="w-4 h-4" /> About section saved successfully!
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Professional Headline / Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Senior Full Stack Engineer"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Current Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="San Francisco, CA (Remote)"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar">Avatar Image URL</Label>
            <Input
              id="avatar"
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Professional Summary / Bio</Label>
            <Textarea
              id="bio"
              rows={4}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Write a concise overview of your technical expertise and career goals..."
            />
          </div>

          <div className="pt-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Social &amp; Portfolio Links</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="linkedin" className="text-xs">LinkedIn URL</Label>
                <Input
                  id="linkedin"
                  value={formData.socialLinks.linkedin}
                  onChange={(e) => setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, linkedin: e.target.value }
                  })}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="github" className="text-xs">GitHub Profile URL</Label>
                <Input
                  id="github"
                  value={formData.socialLinks.github}
                  onChange={(e) => setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, github: e.target.value }
                  })}
                  placeholder="https://github.com/username"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="twitter" className="text-xs">Twitter / X URL</Label>
                <Input
                  id="twitter"
                  value={formData.socialLinks.twitter}
                  onChange={(e) => setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, twitter: e.target.value }
                  })}
                  placeholder="https://x.com/username"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="portfolio" className="text-xs">Personal Website / Portfolio</Label>
                <Input
                  id="portfolio"
                  value={formData.socialLinks.portfolio}
                  onChange={(e) => setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, portfolio: e.target.value }
                  })}
                  placeholder="https://mywebsite.com"
                />
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="border-t border-slate-800/60 pt-4 flex justify-end">
          <Button type="submit" disabled={mutation.isPending} className="bg-blue-600 hover:bg-blue-500 font-semibold px-6">
            {mutation.isPending ? 'Saving...' : 'Save About Section'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AboutSection;
