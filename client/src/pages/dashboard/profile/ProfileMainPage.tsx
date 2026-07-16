import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Briefcase,
  BookOpen,
  Cpu,
  Layers,
  Award,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { AboutSection } from './AboutSection';
import { ExperienceSection } from './ExperienceSection';
import { EducationSection } from './EducationSection';
import { SkillsSection } from './SkillsSection';
import { ProjectsSection } from './ProjectsSection';
import { CertificatesSection } from './CertificatesSection';
import api from '@/lib/axios';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type StepId = 'about' | 'experience' | 'education' | 'skills' | 'projects' | 'certificates';

interface StepItem {
  id: StepId;
  stepNum: number;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  isComplete: (data: any) => boolean;
  count: (data: any) => number | null;
}

export const ProfileMainPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<StepId>('about');

  const { data, isLoading, error } = useQuery({
    queryKey: ['completeProfile'],
    queryFn: async () => {
      const res = await api.get('/profile/all');
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-8 pb-14">
        <Skeleton className="h-32 w-full rounded-2xl bg-white border border-[#E2E8F0]" />
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl bg-white border border-[#E2E8F0]" />
          ))}
        </div>
        <Skeleton className="h-[500px] w-full rounded-2xl bg-white border border-[#E2E8F0]" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-[#EF4444] p-8 text-center max-w-lg mx-auto mt-12 bg-white">
        <div className="w-12 h-12 rounded-2xl bg-[#FEF2F2] flex items-center justify-center text-[#EF4444] mx-auto mb-4">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-[#111827]">Failed to load career profile data</h3>
        <p className="text-xs text-[#64748B] mt-1 font-mono">{(error as Error).message}</p>
        <Button variant="outline" className="mt-6 border-[#E2E8F0]" onClick={() => window.location.reload()}>
          Retry Connection
        </Button>
      </Card>
    );
  }

  const steps: StepItem[] = [
    {
      id: 'about',
      stepNum: 1,
      label: 'Identity & Headline',
      desc: 'Core bio, title, & socials',
      icon: User,
      isComplete: (d) => Boolean(d?.profile?.title && d?.profile?.bio),
      count: () => null,
    },
    {
      id: 'experience',
      stepNum: 2,
      label: 'Work Experience',
      desc: 'Employment roles & metrics',
      icon: Briefcase,
      isComplete: (d) => Boolean(d?.experiences && d.experiences.length > 0),
      count: (d) => (d?.experiences ? d.experiences.length : 0),
    },
    {
      id: 'education',
      stepNum: 3,
      label: 'Education & Degrees',
      desc: 'Academic background & honours',
      icon: BookOpen,
      isComplete: (d) => Boolean(d?.educations && d.educations.length > 0),
      count: (d) => (d?.educations ? d.educations.length : 0),
    },
    {
      id: 'skills',
      stepNum: 4,
      label: 'Verified Competencies',
      desc: 'Technical tokens & ratings',
      icon: Cpu,
      isComplete: (d) => Boolean(d?.skills && d.skills.length > 0),
      count: (d) => (d?.skills ? d.skills.length : 0),
    },
    {
      id: 'projects',
      stepNum: 5,
      label: 'Engineering Projects',
      desc: 'Case studies & live demos',
      icon: Layers,
      isComplete: (d) => Boolean(d?.projects && d.projects.length > 0),
      count: (d) => (d?.projects ? d.projects.length : 0),
    },
    {
      id: 'certificates',
      stepNum: 6,
      label: 'Certifications & Awards',
      desc: 'Professional credentials',
      icon: Award,
      isComplete: (d) => Boolean(d?.certificates && d.certificates.length > 0),
      count: (d) => (d?.certificates ? d.certificates.length : 0),
    },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === activeTab);
  const currentStep = steps[currentStepIndex];
  const prevStep = currentStepIndex > 0 ? steps[currentStepIndex - 1] : null;
  const nextStep = currentStepIndex < steps.length - 1 ? steps[currentStepIndex + 1] : null;

  const completedCount = steps.filter((s) => s.isComplete(data)).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="space-y-8 pb-16">
      {/* Guided Banner */}
      <div className="rounded-2xl bg-white border border-[#E2E8F0] shadow-sm p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#4F46E5] uppercase tracking-wider">
              Profile Setup Studio
            </span>
            <span className="text-slate-300 hidden sm:inline">&bull;</span>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#10B981] bg-[#ECFDF5] border border-[#D1FAE5] px-2 py-0.5 rounded font-bold uppercase tracking-wider select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              Auto Save Enabled
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight">
            Build Your Developer Profile
          </h1>
          <p className="text-sm text-[#64748B] max-w-2xl leading-relaxed">
            Complete each focused section step-by-step. Our simple form format allows you to refine individual items quickly and easily.
          </p>
        </div>

        <div className="flex flex-col items-start sm:items-end gap-2 bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] shrink-0 min-w-[220px]">
          <div className="flex items-center justify-between w-full gap-4 text-xs">
            <span className="text-[#64748B] font-semibold">Progress Rate:</span>
            <span className="text-[#4F46E5] font-bold">{completedCount} of 6 Steps</span>
          </div>
          <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
            <div
              style={{ width: `${progressPercent}%` }}
              className="bg-[#4F46E5] h-full rounded-full transition-all duration-300"
            />
          </div>
          <span className="text-xs text-[#64748B]">
            Overall Health: <span className="text-[#111827] font-bold">{data?.completionPercentage || 0}%</span>
          </span>
        </div>
      </div>

      {/* Guided Progressive Step Indicator Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = activeTab === step.id;
          const complete = step.isComplete(data);
          const count = step.count(data);

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => setActiveTab(step.id)}
              className={cn(
                "p-3.5 rounded-xl border transition-all duration-150 text-left flex flex-col justify-between relative group select-none overflow-hidden min-h-[92px] shadow-sm",
                isActive
                  ? "border-[#4F46E5] bg-[#EEF2FF] shadow-sm z-10 scale-[1.01]"
                  : complete
                  ? "border-[#D1FAE5] bg-white hover:border-[#10B981] hover:bg-[#F8FAFC]"
                  : "border-[#E2E8F0] bg-white hover:border-[#CBD5E1] hover:bg-[#F8FAFC]"
              )}
            >
              <div className="flex items-center justify-between w-full">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0",
                  isActive
                    ? "bg-[#4F46E5] text-white"
                    : complete
                    ? "bg-[#ECFDF5] text-[#10B981] border border-[#D1FAE5]"
                    : "bg-[#F8FAFC] text-[#64748B] group-hover:text-[#111827]"
                )}>
                  {complete && !isActive ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>

                <div className="flex items-center gap-1.5">
                  {count !== null && (
                    <span className={cn(
                      "text-[10px] font-mono px-2 py-0.5 rounded-full font-bold",
                      isActive ? "bg-white text-[#4F46E5]" : "bg-[#F1F5F9] text-[#64748B]"
                    )}>
                      {count}
                    </span>
                  )}
                  <span className={cn(
                    "text-[10px] font-mono font-bold uppercase",
                    isActive ? "text-[#4F46E5]" : complete ? "text-[#10B981]" : "text-[#64748B]"
                  )}>
                    Step {step.stepNum}
                  </span>
                </div>
              </div>

              <div className="mt-2.5">
                <p className={cn(
                  "text-xs font-bold leading-tight tracking-tight truncate",
                  isActive ? "text-[#111827]" : "text-[#111827]"
                )}>
                  {step.label}
                </p>
                <p className="text-[10px] text-[#64748B] truncate mt-0.5">
                  {step.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Current Step Section Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] border border-[#E0E7FF] flex items-center justify-center text-[#4F46E5]">
            <currentStep.icon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#111827] tracking-tight">
                Step {currentStep.stepNum}: {currentStep.label}
              </h2>
              {currentStep.isComplete(data) && (
                <Badge variant="success" className="text-[10px] uppercase font-bold px-2 py-0.5">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Section Complete
                </Badge>
              )}
            </div>
            <p className="text-xs text-[#64748B]">{currentStep.desc} &bull; Step {currentStep.stepNum} of 6</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          {prevStep && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab(prevStep.id)}
              className="text-xs gap-1.5 font-semibold border-[#E2E8F0]"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back: {prevStep.label}</span>
            </Button>
          )}
          {nextStep && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setActiveTab(nextStep.id)}
              className="text-xs gap-1.5 font-semibold text-[#4F46E5] bg-[#EEF2FF] hover:bg-[#E0E7FF]"
            >
              <span>Next: {nextStep.label}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Render Active Step Section */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.15 }}
          className="pt-1"
        >
          {activeTab === 'about' && <AboutSection profile={data?.profile} />}
          {activeTab === 'experience' && <ExperienceSection experiences={data?.experiences || []} />}
          {activeTab === 'education' && <EducationSection educations={data?.educations || []} />}
          {activeTab === 'skills' && <SkillsSection skills={data?.skills || []} />}
          {activeTab === 'projects' && <ProjectsSection projects={data?.projects || []} />}
          {activeTab === 'certificates' && <CertificatesSection certificates={data?.certificates || []} />}
        </motion.div>
      </AnimatePresence>

      {/* Bottom Step Progression Action Bar */}
      <Card variant="default" className="p-5 border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#64748B] font-mono font-bold text-xs">
            {currentStep.stepNum}/6
          </div>
          <div>
            <p className="text-xs font-bold text-[#111827]">Step Completed?</p>
            <p className="text-xs text-[#64748B]">Proceed to the next module or return to your Overview</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {prevStep && (
            <Button
              variant="outline"
              onClick={() => setActiveTab(prevStep.id)}
              className="text-xs font-semibold gap-1.5 flex-1 sm:flex-none border-[#E2E8F0]"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Step {prevStep.stepNum}: {prevStep.label}</span>
            </Button>
          )}
          {nextStep ? (
            <Button
              variant="default"
              onClick={() => setActiveTab(nextStep.id)}
              className="text-xs font-bold gap-1.5 px-6 flex-1 sm:flex-none shadow-sm"
            >
              <span>Proceed to Step {nextStep.stepNum}: {nextStep.label}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              variant="default"
              onClick={() => window.location.href = '/dashboard'}
              className="text-xs font-bold gap-1.5 px-6 flex-1 sm:flex-none shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>All 6 Steps Complete &bull; Return to Overview</span>
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ProfileMainPage;
