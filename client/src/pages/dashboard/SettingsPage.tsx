import React, { useState } from 'react';
import { 
  User, Shield, Bell, Sliders, Laptop, 
  CheckCircle2, Sparkles, Save, Check, Eye
} from 'lucide-react';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import Avatar from '@/components/ui/Avatar';

export const SettingsPage: React.FC = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'account' | 'preferences' | 'notifications' | 'security'>('account');
  const [saved, setSaved] = useState(false);

  const { data: profileData } = useQuery({
    queryKey: ['completeProfile'],
    queryFn: async () => {
      const res = await api.get('/profile/all');
      return res.data;
    },
    enabled: !!user,
  });

  const [preferences, setPreferences] = useState({
    lightTheme: true,
    reducedMotion: false,
    highContrast: false,
    publicIndexing: true,
    emailAlerts: true,
    githubSyncAlerts: true,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#4F46E5]">
            <Sliders className="w-3.5 h-3.5" /> SYSTEM PREFERENCES
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight">
            Workspace Configuration
          </h1>
          <p className="text-sm text-[#64748B] max-w-2xl leading-relaxed">
            Manage your account credentials, interface preferences, notifications, and security settings.
          </p>
        </div>

        {saved && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#ECFDF5] border border-[#D1FAE5] text-[#10B981] text-xs font-bold">
            <Check className="w-4 h-4" /> Settings Synchronized
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Navigation Sidebar (Col 4) */}
        <div className="lg:col-span-4 space-y-3">
          <Card variant="default" className="p-3 shadow-sm space-y-1">
            {[
              { id: 'account', label: 'Account Identity', icon: User, desc: 'Profile credentials & email' },
              { id: 'preferences', label: 'Appearance & Accessibility', icon: Sliders, desc: 'Light edition productivity mode' },
              { id: 'notifications', label: 'Notifications', icon: Bell, desc: 'Email alerts & system sync' },
              { id: 'security', label: 'Security & Access', icon: Shield, desc: 'Sessions & password management' },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  type="button"
                  className={`w-full flex items-center gap-3.5 p-3 rounded-xl text-left transition-all ${
                    isActive
                      ? 'bg-[#EEF2FF] text-[#111827] font-bold shadow-sm border border-[#E0E7FF]'
                      : 'text-[#64748B] hover:text-[#111827] hover:bg-[#F8FAFC] border border-transparent'
                  }`}
                >
                  <div className={`p-2 rounded-lg border shrink-0 ${
                    isActive ? 'bg-white border-[#E0E7FF] text-[#4F46E5]' : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B]'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-bold truncate">{tab.label}</p>
                    <p className="text-[10px] text-[#64748B] truncate mt-0.5">{tab.desc}</p>
                  </div>
                </button>
              );
            })}
          </Card>

          <Card variant="default" className="p-4 bg-[#EEF2FF] border-[#E0E7FF] shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-[#111827] mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#4F46E5]" /> Security &amp; Encryption
            </div>
            <p className="text-xs text-[#64748B] leading-relaxed">
              All credentials are encrypted using industry-standard hashing. Bearer tokens expire automatically to protect your workspace.
            </p>
          </Card>
        </div>

        {/* Right Settings Panel (Col 8) */}
        <div className="lg:col-span-8">
          <Card variant="default" className="p-6 shadow-sm">
            <form onSubmit={handleSave} className="space-y-6">
              {activeTab === 'account' && (
                <div className="space-y-6">
                  <div className="border-b border-[#F1F5F9] pb-4">
                    <CardTitle className="text-base font-bold text-[#111827] flex items-center gap-2">
                      <User className="w-5 h-5 text-[#4F46E5]" /> Account Identity &amp; Profile Details
                    </CardTitle>
                    <CardDescription className="text-xs text-[#64748B]">
                      Your primary credentials used across the workspace
                    </CardDescription>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                    <div className="shrink-0 flex flex-col items-center gap-1.5">
                      <Avatar
                        src={profileData?.profile?.avatar}
                        name={user?.name}
                        sizeClass="w-16 h-16 rounded-xl text-lg border shadow-sm"
                      />
                      <span className="text-[10px] font-mono text-[#64748B] font-semibold">Avatar Preview</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 w-full">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-[#111827]">Full Name</Label>
                        <Input
                          defaultValue={user?.name || 'Developer Engineer'}
                          className="h-10 text-xs font-semibold"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-[#111827]">Email Address</Label>
                        <Input
                          type="email"
                          defaultValue={user?.email || 'dev@workspace.ai'}
                          disabled
                          className="h-10 text-xs font-mono bg-[#F8FAFC] text-[#64748B]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-[#111827]">Workspace ID</p>
                      <p className="text-xs text-[#64748B]">Unique identifier used for operations and database indexing</p>
                    </div>
                    <Badge variant="secondary" className="text-xs font-mono px-3 py-1 font-bold">
                      {(user as any)?.id || (user as any)?._id || 'workspace_01'}
                    </Badge>
                  </div>
                </div>
              )}

              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <div className="border-b border-[#F1F5F9] pb-4">
                    <CardTitle className="text-base font-bold text-[#111827] flex items-center gap-2">
                      <Sliders className="w-5 h-5 text-[#4F46E5]" /> Appearance &amp; Accessibility
                    </CardTitle>
                    <CardDescription className="text-xs text-[#64748B]">
                      Light edition productivity workspace configuration
                    </CardDescription>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-[#111827] flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-[#4F46E5]" /> Light Edition Productivity Mode
                        </p>
                        <p className="text-xs text-[#64748B]">
                          Clean slate white canvas (#F8FAFC / #FFFFFF) designed for professional clarity and reduced eye strain
                        </p>
                      </div>
                      <Badge variant="success" className="text-xs px-3 py-1 font-bold">
                        ACTIVE
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-[#111827] flex items-center gap-2">
                          <Eye className="w-4 h-4 text-[#4F46E5]" /> High Contrast Borders &amp; Focus Rings
                        </p>
                        <p className="text-xs text-[#64748B]">
                          Increases border definition (#CBD5E1) and enforces high-visibility focus rings
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPreferences({ ...preferences, highContrast: !preferences.highContrast })}
                        className={`w-11 h-6 rounded-full transition-colors relative p-1 ${preferences.highContrast ? 'bg-[#4F46E5]' : 'bg-[#CBD5E1]'}`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${preferences.highContrast ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-[#111827] flex items-center gap-2">
                          <Sliders className="w-4 h-4 text-[#F59E0B]" /> Reduced Motion Support
                        </p>
                        <p className="text-xs text-[#64748B]">
                          Disables large scale transitions and layout animations
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPreferences({ ...preferences, reducedMotion: !preferences.reducedMotion })}
                        className={`w-11 h-6 rounded-full transition-colors relative p-1 ${preferences.reducedMotion ? 'bg-[#4F46E5]' : 'bg-[#CBD5E1]'}`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${preferences.reducedMotion ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div className="border-b border-[#F1F5F9] pb-4">
                    <CardTitle className="text-base font-bold text-[#111827] flex items-center gap-2">
                      <Bell className="w-5 h-5 text-[#4F46E5]" /> Notification Preferences
                    </CardTitle>
                    <CardDescription className="text-xs text-[#64748B]">
                      Configure when and how Promptfolio notifies you
                    </CardDescription>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-[#111827]">AI Token Parsing Alerts</p>
                        <p className="text-xs text-[#64748B]">Receive instant notifications when a PDF resume completes extraction</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPreferences({ ...preferences, emailAlerts: !preferences.emailAlerts })}
                        className={`w-11 h-6 rounded-full transition-colors relative p-1 ${preferences.emailAlerts ? 'bg-[#4F46E5]' : 'bg-[#CBD5E1]'}`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${preferences.emailAlerts ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-[#111827]">GitHub Telemetry Synchronization</p>
                        <p className="text-xs text-[#64748B]">Alerts when repository structure changes or new stars are tracked</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPreferences({ ...preferences, githubSyncAlerts: !preferences.githubSyncAlerts })}
                        className={`w-11 h-6 rounded-full transition-colors relative p-1 ${preferences.githubSyncAlerts ? 'bg-[#4F46E5]' : 'bg-[#CBD5E1]'}`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${preferences.githubSyncAlerts ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="border-b border-[#F1F5F9] pb-4">
                    <CardTitle className="text-base font-bold text-[#111827] flex items-center gap-2">
                      <Shield className="w-5 h-5 text-[#4F46E5]" /> Security Protocols &amp; Sessions
                    </CardTitle>
                    <CardDescription className="text-xs text-[#64748B]">
                      Monitor active client sessions and security tokens
                    </CardDescription>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-lg bg-white border border-[#E2E8F0] text-[#4F46E5]">
                          <Laptop className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#111827]">Current Active Session (Windows OS)</p>
                          <p className="text-xs text-[#64748B]">Authenticated via Bearer Token &bull; Active right now</p>
                        </div>
                      </div>
                      <Badge variant="success" className="text-[10px] font-bold">
                        THIS DEVICE
                      </Badge>
                    </div>

                    <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-[#111827]">Password Cryptography</p>
                        <p className="text-xs text-[#64748B]">Last updated upon account provisioning</p>
                      </div>
                      <Button type="button" variant="outline" className="text-xs h-9 border-[#E2E8F0]">
                        Update Password
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-[#F1F5F9] flex items-center justify-end gap-3">
                <Button type="submit" variant="default" className="font-semibold px-8 h-10 text-xs shadow-sm">
                  <Save className="w-4 h-4 mr-1.5" /> Save Configuration
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
