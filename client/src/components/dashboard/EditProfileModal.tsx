import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Briefcase, MapPin, Sparkles, X, Check, CheckCircle2, AlertCircle, Save, Globe, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore } from '@/store/useAuthStore';
import { useToast } from '@/components/ui/toast';
import api from '@/lib/axios';
import { AvatarUpload } from '@/pages/dashboard/profile/AvatarUpload';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileData?: any;
  fullProfileData?: any;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, profileData, fullProfileData }) => {
  const { user, checkAuth } = useAuthStore();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const activeProfileData = profileData || fullProfileData;
  const profile = activeProfileData?.profile;

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    title: profile?.title || '',
    location: profile?.location || '',
    bio: profile?.bio || '',
    avatar: profile?.avatar || '',
    socialLinks: {
      linkedin: profile?.socialLinks?.linkedin || '',
      github: profile?.socialLinks?.github || '',
      twitter: profile?.socialLinks?.twitter || '',
      portfolio: profile?.socialLinks?.portfolio || '',
    },
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync form state whenever modal opens or profileData/user changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        title: profile?.title || '',
        location: profile?.location || '',
        bio: profile?.bio || '',
        avatar: profile?.avatar || '',
        socialLinks: {
          linkedin: profile?.socialLinks?.linkedin || '',
          github: profile?.socialLinks?.github || '',
          twitter: profile?.socialLinks?.twitter || '',
          portfolio: profile?.socialLinks?.portfolio || '',
        },
      });
      setErrorMessage(null);
    }
  }, [isOpen, profile, user]);

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await api.put('/profile/about', data);
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['completeProfile'] });
      await checkAuth(); // Refresh Zustand user state
      toast({
        title: "Profile Updated",
        description: "Your basic account and profile information has been saved.",
        type: "success"
      });
      onClose();
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Failed to update profile details.';
      setErrorMessage(msg);
      toast({
        title: "Update Failed",
        description: msg,
        type: "error"
      });
    },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMessage('Full name cannot be empty.');
      return;
    }
    mutation.mutate(formData);
  };

  const handleCancel = () => {
    setErrorMessage(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/50 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white border border-[#E2E8F0] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden text-[#111827]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#E2E8F0] bg-white sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] border border-[#E0E7FF] flex items-center justify-center text-[#4F46E5]">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#111827] tracking-tight">Edit Basic Profile &amp; Account</h3>
                <p className="text-xs text-[#64748B]">Update your primary identity, contact info, and socials</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleCancel}
              className="w-8 h-8 rounded-lg bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#111827] transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-5 flex-1">
            {errorMessage && (
              <div className="p-4 rounded-xl bg-[#FEF2F2] border border-[#FEE2E2] text-[#EF4444] text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Avatar Section */}
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <AvatarUpload
                value={formData.avatar}
                onChange={(val) => setFormData({ ...formData, avatar: val })}
                name={formData.name || user?.name}
              />
            </div>

            {/* Account Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="edit-name" className="text-xs font-bold text-[#111827]">
                  Full Name <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-email" className="text-xs font-bold text-[#111827]">
                  Email Address
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 font-medium"
                />
              </div>
            </div>

            {/* Professional Headline & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="edit-title" className="text-xs font-bold text-[#111827]">
                  Professional Title
                </Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Senior Full Stack Software Engineer"
                  className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-location" className="text-xs font-bold text-[#111827]">
                  Geographic Location
                </Label>
                <Input
                  id="edit-location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="San Francisco, CA (Remote Friendly)"
                  className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 font-medium"
                />
              </div>
            </div>

            {/* Executive Bio */}
            <div className="space-y-1.5">
              <Label htmlFor="edit-bio" className="text-xs font-bold text-[#111827]">
                Executive Bio Summary
              </Label>
              <Textarea
                id="edit-bio"
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Brief professional summary displayed on your portfolio hero..."
                className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 font-medium text-xs leading-relaxed"
              />
            </div>

            {/* Social Links Grid */}
            <div className="space-y-2 pt-2 border-t border-[#F1F5F9]">
              <span className="text-xs font-bold text-[#111827] uppercase tracking-wider block">
                Social &amp; Web Links
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="edit-linkedin" className="text-[11px] font-semibold text-[#64748B]">LinkedIn URL</Label>
                  <Input
                    id="edit-linkedin"
                    value={formData.socialLinks.linkedin}
                    onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, linkedin: e.target.value } })}
                    placeholder="https://linkedin.com/in/username"
                    className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="edit-github" className="text-[11px] font-semibold text-[#64748B]">GitHub URL</Label>
                  <Input
                    id="edit-github"
                    value={formData.socialLinks.github}
                    onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, github: e.target.value } })}
                    placeholder="https://github.com/username"
                    className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="edit-twitter" className="text-[11px] font-semibold text-[#64748B]">Twitter / X URL</Label>
                  <Input
                    id="edit-twitter"
                    value={formData.socialLinks.twitter}
                    onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, twitter: e.target.value } })}
                    placeholder="https://x.com/username"
                    className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="edit-portfolio" className="text-[11px] font-semibold text-[#64748B]">Personal Website</Label>
                  <Input
                    id="edit-portfolio"
                    value={formData.socialLinks.portfolio}
                    onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, portfolio: e.target.value } })}
                    placeholder="https://mywebsite.dev"
                    className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F1F5F9]">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={mutation.isPending}
                className="text-xs font-semibold border-[#E2E8F0] px-5"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                isLoading={mutation.isPending}
                className="text-xs font-bold px-6 shadow-sm gap-1.5"
              >
                {!mutation.isPending && <Save className="w-3.5 h-3.5" />}
                <span>Save Changes</span>
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EditProfileModal;
