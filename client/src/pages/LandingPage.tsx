import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, CheckCircle2, Code2, Sparkles, FileText, 
  BarChart3, Layers, Zap, Shield, ChevronRight,
  Star, Quote
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] font-sans selection:bg-[#4F46E5]/20 selection:text-[#4F46E5]">
      {/* 1. Simple White Navigation */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 font-bold tracking-tight text-lg text-[#111827]">
            <div className="w-8 h-8 rounded-lg bg-[#4F46E5] flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <span>Promptfolio</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#64748B]">
            <a href="#features" className="hover:text-[#111827] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[#111827] transition-colors">How it works</a>
            <a href="#testimonials" className="hover:text-[#111827] transition-colors">Testimonials</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" className="font-semibold text-[#64748B] hover:text-[#111827]">
                Sign in
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="default" className="font-semibold shadow-sm">
                Get started <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section with Large Whitespace & Beautiful Typography */}
      <section className="pt-20 pb-28 px-6 max-w-6xl mx-auto text-center relative overflow-hidden">
        {/* Minimal geometric decoration & clean grid pattern */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-70" />
        <div className="absolute top-10 left-10 w-24 h-24 bg-indigo-50/40 rounded-full border border-indigo-100/30 -z-10 animate-pulse-subtle pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-slate-50/50 rounded-2xl border border-slate-100 -z-10 rotate-12 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-3xl mx-auto space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E2E8F0] text-xs font-semibold text-[#4F46E5] shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span>The modern portfolio builder for software engineers</span>
          </div>

          <h1 className="text-4xl sm:text-[56px] font-extrabold text-[#111827] tracking-tight leading-[1.12]">
            Build a portfolio recruiters actually remember.
          </h1>

          <p className="text-lg sm:text-xl text-[#64748B] font-normal leading-relaxed max-w-2xl mx-auto">
            One place to build your developer profile, resume, and portfolio. Sync your GitHub activity, verified skills, and work history into a clean, recruiter-ready personal website.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link to="/register">
              <Button size="xl" className="w-full sm:w-auto bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold px-8 shadow-md">
                Create your portfolio <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
            <a href="#features">
              <Button size="xl" variant="outline" className="w-full sm:w-auto font-semibold px-6 border-[#E2E8F0] hover:bg-white text-[#111827]">
                Explore features
              </Button>
            </a>
          </div>

          <div className="pt-8 flex items-center justify-center gap-6 text-xs text-[#64748B] font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" /> No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" /> GitHub sync included
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" /> ATS optimized
            </span>
          </div>
        </motion.div>

        {/* Hero Mockup Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="mt-16 rounded-2xl bg-white border border-[#E2E8F0] shadow-xl overflow-hidden max-w-4xl mx-auto text-left"
        >
          <div className="bg-[#F8FAFC] border-b border-[#E2E8F0] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#EF4444]/60" />
              <div className="w-3 h-3 rounded-full bg-[#F59E0B]/60" />
              <div className="w-3 h-3 rounded-full bg-[#10B981]/60" />
              <span className="ml-2 text-xs font-mono text-[#64748B]">promptfolio.app/p/alex-rivas</span>
            </div>
            <div className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EEF2FF] text-[#4F46E5] border border-[#E0E7FF]">
              Live Preview
            </div>
          </div>
          <div className="p-8 sm:p-10 space-y-8 bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-[#F1F5F9] pb-8">
              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-bold text-[#111827]">Alex Rivas</h3>
                <p className="text-base font-medium text-[#64748B]">Senior Staff Engineer @ CloudScale &bull; Open Source Maintainer</p>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="px-4 py-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-semibold text-[#111827]">
                  GitHub &bull; 1.4k Stars
                </div>
                <div className="px-4 py-2 rounded-lg bg-[#4F46E5] text-white text-xs font-semibold shadow-sm">
                  Download Resume
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">Current Role</div>
                <div className="font-bold text-sm text-[#111827]">Principal Infrastructure Lead</div>
                <div className="text-xs text-[#64748B]">Architecting distributed consensus protocols in Rust and Go.</div>
              </div>
              <div className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">Core Stack</div>
                <div className="font-bold text-sm text-[#111827]">Rust &bull; TypeScript &bull; Kubernetes</div>
                <div className="text-xs text-[#64748B]">18 verified competencies with production deployment scores.</div>
              </div>
              <div className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">ATS Readability</div>
                <div className="font-bold text-sm text-[#10B981] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> 98/100 Top Tier
                </div>
                <div className="text-xs text-[#64748B]">Optimized for engineering managers and automated screeners.</div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3. Feature Cards Section */}
      <section id="features" className="py-24 px-6 max-w-6xl mx-auto border-t border-[#E2E8F0]">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-[#111827]">
            Everything you need to present your engineering career.
          </h2>
          <p className="text-base text-[#64748B]">
            Thoughtfully crafted tools designed by engineers to remove friction and present your work with clarity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#111827]">GitHub Repository Sync</h3>
            <p className="text-sm text-[#64748B] leading-relaxed">
              Import your public repositories with one click. Showcase star counts, forks, and primary languages without writing documentation from scratch.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#111827]">ATS Resume Studio</h3>
            <p className="text-sm text-[#64748B] leading-relaxed">
              Upload your existing PDF resume and let our intelligent parser structure your work history, academic background, and competencies cleanly.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#111827]">Handcrafted Themes</h3>
            <p className="text-sm text-[#64748B] leading-relaxed">
              Publish to `/p/yourname` with clean, responsive themes inspired by top designers. Switch layouts instantly from your workspace.
            </p>
          </div>
        </div>
      </section>

      {/* 4. How it Works */}
      <section id="how-it-works" className="py-24 px-6 bg-white border-y border-[#E2E8F0]">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-bold tracking-tight text-[#111827]">
              How Promptfolio works
            </h2>
            <p className="text-base text-[#64748B]">
              Three simple steps to build and deploy your candidate presence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-full bg-[#4F46E5] text-white font-bold text-sm flex items-center justify-center shadow-sm">
                1
              </div>
              <h3 className="text-lg font-bold text-[#111827]">Connect &amp; Import</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Connect your GitHub username or upload your existing resume. Our parser organizes your work experience and skills instantly.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-10 h-10 rounded-full bg-[#4F46E5] text-white font-bold text-sm flex items-center justify-center shadow-sm">
                2
              </div>
              <h3 className="text-lg font-bold text-[#111827]">Refine in the Studio</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Use the guided step wizard or AI Studio to tailor your executive bio, project case studies, and target cover letters.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-10 h-10 rounded-full bg-[#4F46E5] text-white font-bold text-sm flex items-center justify-center shadow-sm">
                3
              </div>
              <h3 className="text-lg font-bold text-[#111827]">Publish &amp; Share</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Deploy your public URL slug to share with hiring managers, recruiters, and hackathon judges with verified readability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Static Testimonials */}
      <section id="testimonials" className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-[#111827]">
            Trusted by modern engineering leaders
          </h2>
          <p className="text-base text-[#64748B]">
            Here is what software engineers and hiring managers say about Promptfolio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-6">
            <div className="flex items-center gap-1 text-[#F59E0B]">
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
            </div>
            <p className="text-sm text-[#111827] leading-relaxed italic">
              &ldquo;Promptfolio gave me a clean, human-feeling portfolio that didn&apos;t look like a cookie-cutter template. I received three staff engineering interviews within two weeks of sharing my custom link.&rdquo;
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="w-10 h-10 rounded-full bg-[#E0E7FF] text-[#4F46E5] font-bold text-xs flex items-center justify-center">
                SD
              </div>
              <div>
                <div className="text-sm font-bold text-[#111827]">Sarah Davis</div>
                <div className="text-xs text-[#64748B]">Senior Frontend Architect @ Vercel ecosystem</div>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-6">
            <div className="flex items-center gap-1 text-[#F59E0B]">
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
            </div>
            <p className="text-sm text-[#111827] leading-relaxed italic">
              &ldquo;As a hiring manager, I sift through hundreds of cluttered PDF resumes every week. When a candidate shares a Promptfolio link, I can immediately verify their GitHub repositories and career timeline with zero eye strain.&rdquo;
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="w-10 h-10 rounded-full bg-[#E0E7FF] text-[#4F46E5] font-bold text-xs flex items-center justify-center">
                MK
              </div>
              <div>
                <div className="text-sm font-bold text-[#111827]">Marcus Chen</div>
                <div className="text-xs text-[#64748B]">VP of Engineering @ Apex Systems</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Professional CTA Banner */}
      <section className="py-20 px-6 max-w-5xl mx-auto mb-20">
        <div className="p-12 rounded-3xl bg-[#4F46E5] text-white text-center space-y-6 shadow-lg">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Ready to elevate your engineering portfolio?
          </h2>
          <p className="text-base text-indigo-100 max-w-xl mx-auto">
            Get started today and create a clean, recruiter-approved developer presence in minutes.
          </p>
          <div className="pt-2">
            <Link to="/register">
              <Button size="xl" className="bg-white text-[#4F46E5] hover:bg-slate-100 font-bold px-8 shadow-md">
                Build your portfolio now <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="bg-white border-t border-[#E2E8F0] py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[#64748B]">
          <div className="flex items-center gap-2 font-bold text-sm text-[#111827]">
            <Sparkles className="w-4 h-4 text-[#4F46E5]" />
            <span>Promptfolio</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="hover:text-[#111827] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[#111827] transition-colors">How it works</a>
            <Link to="/login" className="hover:text-[#111827] transition-colors">Sign in</Link>
          </div>
          <div>
            &copy; {new Date().getFullYear()} Promptfolio. Crafted for developers.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
