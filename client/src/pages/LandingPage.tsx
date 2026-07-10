import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Cpu, GitBranch, FileText, Layers, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold tracking-tight text-lg bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-blue-400">
              Promptfolio
            </span>
            <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider ml-1">OS v1.0</Badge>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link to="/register">
              <Button className="bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-lg shadow-blue-600/25 rounded-lg px-4 py-2 text-sm transition-all">
                Get Started <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden">
        {/* Subtle background glow effect */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/15 to-purple-600/15 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-4xl text-center space-y-6 relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold tracking-wide">
            <Cpu className="w-3.5 h-3.5" />
            THE AI-POWERED CAREER OPERATING SYSTEM
          </div>

          <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-[1.08] text-white">
            Architect your tech career with <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">autonomous precision.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
            Promptfolio synchronizes your public GitHub repositories, analyzes your PDF resumes with intelligence, and organizes your professional credentials into one unified dashboard.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-white text-slate-950 hover:bg-slate-200 font-semibold px-8 py-6 rounded-xl shadow-xl text-base transition-all">
                Launch Dashboard <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-slate-800 hover:bg-slate-900 text-slate-300 font-medium px-8 py-6 rounded-xl text-base">
                Sign In to Workspace
              </Button>
            </Link>
          </div>

          <div className="pt-8 flex items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Modular Profile Architecture</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> GitHub Public Sync</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Resume PDF Extraction</span>
          </div>
        </motion.div>

        {/* Linear & Vercel Style Feature Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 z-10"
        >
          <Card className="border-slate-800/80 bg-slate-900/40 backdrop-blur hover:border-slate-700 transition-all">
            <CardContent className="p-6 space-y-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Modular Profile Sections</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Independently update your bio, work experience, degrees, skills, and certifications without cumbersome monolithic forms.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-800/80 bg-slate-900/40 backdrop-blur hover:border-slate-700 transition-all">
            <CardContent className="p-6 space-y-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Interactive Resume Studio</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Drag and drop your PDF resume. Our parsing engine extracts candidate data instantly, allowing review and editing before saving.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-800/80 bg-slate-900/40 backdrop-blur hover:border-slate-700 transition-all">
            <CardContent className="p-6 space-y-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <GitBranch className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Zero-Config GitHub Sync</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Connect your public GitHub username to browse repositories, inspect star metrics, and import repositories into your portfolio with one click.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 px-6 text-center text-xs text-slate-500">
        Promptfolio Architecture &bull; Built with MERN, React 19, Vite, and Tailwind CSS v4 &bull; Apple, Linear & Vercel Design System
      </footer>
    </div>
  );
};

export default LandingPage;
