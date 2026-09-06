import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Globe,
  Sparkles,
  ExternalLink,
  Check,
  Copy,
  CheckCircle2,
  AlertCircle,
  Palette,
  Eye,
  Pencil
} from 'lucide-react';
import api from '@/lib/axios';
import { PortfolioThemeType } from '../portfolio/types';
import { cn } from '@/lib/utils';
import Avatar from '@/components/ui/Avatar';
import EditProfileModal from '@/components/dashboard/EditProfileModal';

interface PortfolioPublishingCardProps {
  profile?: {
    username?: string;
    theme?: PortfolioThemeType;
    isPublished?: boolean;
    avatar?: string;
  };
  userId?: string;
  userName?: string;
  fullProfileData?: any;
}

const themeDescriptions: { id: PortfolioThemeType; name: string; desc: string; previewColor: string; accentBadge: string }[] = [
  { id: 'Apple', name: 'Apple Pro', desc: 'Clean typography, subtle spacing, human-designed aesthetic with generous whitespace.', previewColor: 'bg-[#F8FAFC] border-[#E2E8F0]', accentBadge: 'bg-[#F1F5F9] text-[#111827]' },
  { id: 'Glass', name: 'Executive Glass', desc: 'Crisp layered cards, smooth shadows, professional light contrast.', previewColor: 'bg-[#EEF2FF] border-[#E0E7FF]', accentBadge: 'bg-[#EEF2FF] text-[#4F46E5]' },
  { id: 'Minimal', name: 'Swiss Minimal', desc: 'High-signal structural layout, sharp borders, stark contrast, zero visual noise.', previewColor: 'bg-white border-[#111827]', accentBadge: 'bg-[#111827] text-white' },
  { id: 'Cyberpunk', name: 'Modern Technical', desc: 'Monospace engineering grid, high precision technical data density.', previewColor: 'bg-[#F8FAFC] border-[#4F46E5]', accentBadge: 'bg-[#EEF2FF] text-[#4F46E5] font-mono' },
  { id: 'Developer Terminal', name: 'Dev Terminal', desc: 'Clean command-line interface, syntax highlighting, engineering accuracy.', previewColor: 'bg-[#F1F5F9] border-[#CBD5E1]', accentBadge: 'bg-[#E2E8F0] text-[#111827] font-mono' },
  { id: 'Modern SaaS', name: 'Modern SaaS', desc: 'Stripe & Linear light mode inspired, subtle borders, crisp feature presentation.', previewColor: 'bg-white border-[#4F46E5]', accentBadge: 'bg-[#EEF2FF] text-[#4F46E5]' },
];

export const PortfolioPublishingCard: React.FC<PortfolioPublishingCardProps> = ({ profile, userId, userName, fullProfileData }) => {
  const queryClient = useQueryClient();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const defaultSlug = profile?.username || (userName ? userName.toLowerCase().replace(/[^a-z0-9_-]/g, '-') : userId || 'my-portfolio');

  const [usernameInput, setUsernameInput] = useState(defaultSlug);
  const [selectedTheme, setSelectedTheme] = useState<PortfolioThemeType>(profile?.theme || 'Apple');
  const [isPublished, setIsPublished] = useState<boolean>(profile?.isPublished !== false);
  const [copied, setCopied] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (profile?.username) setUsernameInput(profile.username);
    if (profile?.theme) setSelectedTheme(profile.theme);
    if (profile?.isPublished !== undefined) setIsPublished(profile.isPublished);
  }, [profile]);

  const publishMutation = useMutation({
    mutationFn: async (payload: { username: string; theme: PortfolioThemeType; isPublished: boolean }) => {
      const res = await api.put('/profile/publish', payload);
      return res.data;
    },
    onSuccess: () => {
      setSuccessMessage('Portfolio publishing settings and theme updated successfully!');
      setErrorMessage('');
      queryClient.invalidateQueries({ queryKey: ['completeProfile'] });
      setTimeout(() => setSuccessMessage(''), 5000);
    },
    onError: (err: any) => {
      setErrorMessage(err?.response?.data?.message || 'Failed to update publishing settings.');
      setSuccessMessage('');
    },
  });

  const handleSaveAndPublish = () => {
    publishMutation.mutate({
      username: usernameInput.trim() || defaultSlug,
      theme: selectedTheme,
      isPublished,
    });
  };

  const currentSlug = (usernameInput.trim() || defaultSlug).toLowerCase().replace(/[^a-z0-9_-]/g, '-');
  const publicUrl = `${window.location.origin}/p/${currentSlug}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profileData={fullProfileData}
      />
      <Card variant="default" className="border-[#E2E8F0] shadow-sm overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#F1F5F9]">
        <div className="flex items-center gap-3.5">
          <div className="relative shrink-0 select-none">
            <Avatar
              src={profile?.avatar}
              name={userName || 'User'}
              sizeClass="w-12 h-12 rounded-xl text-lg border"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#EEF2FF] border border-[#E0E7FF] rounded-lg flex items-center justify-center text-[#4F46E5] shadow-xs">
              <Globe className="w-3 h-3" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <CardTitle className="text-lg font-bold text-[#111827] tracking-tight">
                Public Portfolio &amp; Deployment
              </CardTitle>
              <Badge variant={isPublished ? 'success' : 'amber'} showDot className="text-[10px] font-semibold px-2.5 py-0.5">
                {isPublished ? 'LIVE ON WEB' : 'PRIVATE'}
              </Badge>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Choose from 6 clean themes and configure your public URL slug (`/p/username`).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsEditModalOpen(true)}
            className="text-xs font-semibold gap-1.5 shadow-sm border-[#E2E8F0] text-[#111827]"
          >
            <Pencil className="w-3.5 h-3.5 text-[#4F46E5]" />
            <span>Edit Profile</span>
          </Button>
          <a
            href={`/p/${currentSlug}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm" className="text-xs font-semibold gap-1.5 shadow-sm border-[#E2E8F0]">
              <Eye className="w-3.5 h-3.5 text-[#4F46E5]" />
              <span>Preview Portfolio</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#64748B]" />
            </Button>
          </a>
        </div>
      </CardHeader>

      <CardContent className="p-6 sm:p-8 space-y-7">
        {/* URL Slug & Status Configuration Box */}
        <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              Public URL Address
            </label>
            <span className="text-[11px] text-[#64748B]">
              Shareable link: <span className="text-[#111827] font-mono font-semibold">{publicUrl}</span>
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1 flex items-center rounded-xl bg-white border border-[#E2E8F0] px-3.5 py-2 text-xs sm:text-sm font-mono text-[#64748B] focus-within:ring-2 focus-within:ring-[#4F46E5] focus-within:border-[#4F46E5] transition-all shadow-sm">
              <span className="text-[#94A3B8] select-none shrink-0 truncate">{window.location.origin}/p/</span>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="custom-username"
                className="bg-transparent text-[#111827] font-bold focus:outline-none flex-1 ml-0.5 w-full tracking-tight"
              />
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyUrl}
              className="h-10 text-xs font-semibold gap-1.5 px-4 shrink-0 shadow-sm border-[#E2E8F0]"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5 text-[#64748B]" />}
              <span>{copied ? 'Copied Link' : 'Copy URL'}</span>
            </Button>

            <button
              type="button"
              onClick={() => setIsPublished(!isPublished)}
              className={cn(
                "h-10 px-4 rounded-xl text-xs font-bold transition-all border shrink-0 flex items-center justify-center gap-2 shadow-sm",
                isPublished
                  ? "bg-[#ECFDF5] text-[#10B981] border-[#D1FAE5] hover:bg-[#D1FAE5]"
                  : "bg-[#FFFBEB] text-[#F59E0B] border-[#FEF3C7] hover:bg-[#FEF3C7]"
              )}
            >
              <span className={cn("w-2 h-2 rounded-full", isPublished ? "bg-[#10B981]" : "bg-[#F59E0B]")} />
              <span>{isPublished ? 'Status: Public (Active)' : 'Status: Private (Hidden)'}</span>
            </button>
          </div>
        </div>

        {/* 6 Themes Selector Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#4F46E5]" /> Select Portfolio Theme (6 Curated Styles)
            </label>
            <span className="text-xs text-[#4F46E5] font-semibold">Instant layout switching</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {themeDescriptions.map((t) => {
              const isSelected = selectedTheme === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTheme(t.id)}
                  className={cn(
                    "p-5 rounded-2xl cursor-pointer border-2 transition-all duration-150 relative flex flex-col justify-between overflow-hidden group min-h-[140px] shadow-sm select-none",
                    isSelected
                      ? "border-[#4F46E5] bg-[#EEF2FF]/50 scale-[1.01]"
                      : "border-[#E2E8F0] bg-white hover:border-[#CBD5E1] hover:bg-[#F8FAFC]"
                  )}
                >
                  <div className="space-y-2 relative z-10">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-[#111827] flex items-center gap-2 tracking-tight">
                        {t.name}
                      </span>
                      <span className={cn("text-[10px] px-2 py-0.5 rounded font-semibold", t.accentBadge)}>
                        Style #{themeDescriptions.findIndex(x => x.id === t.id) + 1}
                      </span>
                    </div>
                    <p className="text-xs text-[#64748B] leading-relaxed line-clamp-2">
                      {t.desc}
                    </p>
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-[#F1F5F9] mt-4 relative z-10 text-xs font-semibold">
                    <span className={isSelected ? "text-[#4F46E5] flex items-center gap-1.5 font-bold" : "text-[#64748B] group-hover:text-[#111827] transition-colors"}>
                      {isSelected ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#4F46E5]" /> Active Theme
                        </>
                      ) : (
                        'Select Theme'
                      )}
                    </span>
                    <span className={cn("transition-transform group-hover:translate-x-0.5", isSelected ? "text-[#4F46E5]" : "text-[#64748B]")}>
                      &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Feedback Messages */}
        {successMessage && (
          <div className="p-4 rounded-xl bg-[#ECFDF5] border border-[#D1FAE5] text-[#10B981] text-xs sm:text-sm font-semibold flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" /> {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="p-4 rounded-xl bg-[#FEF2F2] border border-[#FEE2E2] text-[#EF4444] text-xs sm:text-sm font-semibold flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-[#EF4444] shrink-0" /> {errorMessage}
          </div>
        )}

        {/* Save & Publish Action CTA */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#F1F5F9]">
          <Button
            type="button"
            variant="default"
            size="lg"
            onClick={handleSaveAndPublish}
            isLoading={publishMutation.isPending}
            className="font-semibold px-8 shadow-sm"
          >
            {!publishMutation.isPending && <Sparkles className="w-4 h-4 mr-2" />}
            <span>Save &amp; Deploy Portfolio</span>
          </Button>
        </div>
      </CardContent>
    </Card>
    <EditProfileModal
      isOpen={isEditModalOpen}
      onClose={() => setIsEditModalOpen(false)}
      fullProfileData={fullProfileData}
    />
    </>
  );
};

export default PortfolioPublishingCard;
