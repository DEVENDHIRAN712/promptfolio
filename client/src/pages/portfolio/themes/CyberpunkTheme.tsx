import React from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, ExternalLink, Globe, Download,
  Briefcase, GraduationCap, Award, Code, Sparkles, Terminal, Zap
} from 'lucide-react';
import { IThemeProps } from '../types';
import { GithubIcon, LinkedinIcon, TwitterIcon } from '../SocialIcons';

export const CyberpunkTheme: React.FC<IThemeProps> = ({ data }) => {
  const { user, profile, experiences, educations, skills, projects, certificates, githubConnection, latestResume } = data;

  // 1. Calculate Years of Experience
  const yearsOfExperience = React.useMemo(() => {
    if (!experiences || experiences.length === 0) return 0;
    let totalMonths = 0;
    experiences.forEach((exp) => {
      const start = new Date(exp.startDate);
      const end = exp.current ? new Date() : (exp.endDate ? new Date(exp.endDate) : new Date());
      const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
      totalMonths += isNaN(months) ? 0 : months;
    });
    const yrs = Math.round((totalMonths / 12) * 10) / 10;
    return yrs > 0 ? yrs : 1;
  }, [experiences]);

  // 2. Mock visitor count
  const [visitors, setVisitors] = React.useState(3810);
  React.useEffect(() => {
    const timer = setInterval(() => {
      setVisitors((prev) => prev + Math.floor(Math.random() * 5) + 1);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  const cyberCard = "p-8 bg-black/80 border-2 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.35)] relative overflow-hidden group";

  return (
    <div className="min-h-screen bg-[#05050a] text-cyan-400 font-mono antialiased relative selection:bg-pink-500 selection:text-black">
      {/* Cyber Grid Pattern Background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20" style={{
        backgroundImage: 'linear-gradient(to right, #06b6d4 1px, transparent 1px), linear-gradient(to bottom, #ec4899 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-10 py-16 sm:py-24 space-y-24">
        {/* 1. Hero Section */}
        <div className="p-8 sm:p-12 bg-black border-2 border-pink-500 shadow-[0_0_35px_rgba(236,72,153,0.5)] flex flex-col md:flex-row items-center justify-between gap-10 relative">
          <div className="absolute top-0 right-0 bg-pink-500 text-black font-extrabold px-4 py-1 text-xs uppercase tracking-widest">
            CYBER // SYSTEM.v2
          </div>

          <div className="space-y-5 max-w-xl flex-1 text-left">
            <div className="flex flex-wrap gap-2.5">
              <div className="flex items-center gap-2 text-xs text-yellow-400 font-bold uppercase tracking-wider">
                <Zap className="w-4 h-4 text-yellow-400 animate-bounce" /> NEON CANDIDATE MATRIX
              </div>
              <div className="px-2.5 py-0.5 border border-emerald-500 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase">
                [ STATUS: OPEN_TO_ROLES ]
              </div>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-yellow-400 tracking-tight leading-none uppercase">
              {user.name}
            </h1>

            <p className="text-xl sm:text-2xl font-bold text-pink-400">
              &gt; {profile.title || 'FULL STACK CYBER ENGINEER'} _
            </p>

            {profile.bio && (
              <p className="text-sm text-cyan-200 leading-relaxed font-sans">
                {profile.bio}
              </p>
            )}

            {profile.location && (
              <div className="flex items-center gap-1.5 text-xs text-cyan-300 font-bold uppercase">
                <MapPin className="w-4 h-4 text-yellow-400" />
                <span>SECTOR: {profile.location}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-2">
              {latestResume?.fileUrl && (
                <a
                  href={latestResume.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-pink-600 hover:bg-pink-500 text-black font-black text-xs uppercase tracking-wider border border-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.7)] transition-all"
                >
                  <Download className="w-4 h-4" /> [ DOWNLOAD_RESUME ]
                </a>
              )}

              <a
                href={`mailto:${user.email}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-black hover:bg-cyan-500/10 text-cyan-400 font-black text-xs uppercase tracking-wider border border-cyan-400 transition-all"
              >
                [ DIRECT_SIGNAL_EMAIL ]
              </a>

              {profile.socialLinks?.github && <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" className="p-3 bg-black border border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all"><GithubIcon className="w-5 h-5" /></a>}
              {profile.socialLinks?.linkedin && <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="p-3 bg-black border border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all"><LinkedinIcon className="w-5 h-5" /></a>}
            </div>

            {/* Cyberpunk Statistics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-cyan-900/60 text-xs">
              <div className="border border-cyan-800 p-2 bg-black/40">
                <span className="block text-slate-400">PROJECTS:</span>
                <span className="block text-white font-bold">{projects?.length || 0} DEPLOYED</span>
              </div>
              <div className="border border-cyan-800 p-2 bg-black/40">
                <span className="block text-slate-400">EXPERIENCE:</span>
                <span className="block text-white font-bold">{yearsOfExperience} YRS</span>
              </div>
              <div className="border border-cyan-800 p-2 bg-black/40">
                <span className="block text-slate-400">SKILLS:</span>
                <span className="block text-white font-bold">{skills?.length || 0} COMPs</span>
              </div>
              <div className="border border-cyan-800 p-2 bg-black/40">
                <span className="block text-yellow-400 font-bold">MONITOR_VIEWS:</span>
                <span className="block text-yellow-300 font-mono">{visitors}</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-pink-500 blur-sm animate-pulse" />
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={user.name}
                className="relative w-48 h-48 sm:w-60 sm:h-60 object-cover border-2 border-cyan-400 grayscale contrast-125"
              />
            ) : (
              <div className="relative w-48 h-48 sm:w-60 sm:h-60 border-2 border-cyan-400 bg-black flex items-center justify-center text-4xl sm:text-5xl font-black text-cyan-400 select-none">
                {user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* 2. About Bio */}
        {profile.bio && (
          <div className={cyberCard}>
            <h2 className="text-xs uppercase font-black tracking-widest text-pink-400 mb-2">// 01. CANDIDATE BIO MATRIX</h2>
            <p className="text-base sm:text-lg text-cyan-200 leading-relaxed">{profile.bio}</p>
          </div>
        )}

        {/* 3. Experience Timeline */}
        {experiences && experiences.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-pink-400 uppercase flex items-center gap-3">
              <Terminal className="w-6 h-6 text-yellow-400" /> // 02. EXPERIENCE LOGS
            </h2>
            <div className="space-y-6">
              {experiences.map((exp) => (
                <div key={exp._id} className={cyberCard}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-xl font-black text-white uppercase tracking-tight">{exp.role}</h3>
                      <p className="text-sm font-bold text-yellow-400 uppercase">@{exp.company}</p>
                    </div>
                    <span className="text-xs px-3 py-1 bg-pink-500/20 text-pink-400 border border-pink-500 font-bold">
                      [{exp.startDate} &minus; {exp.current ? 'ACTIVE' : exp.endDate || 'ACTIVE'}]
                    </span>
                  </div>
                  {exp.description && <p className="text-sm text-cyan-100 leading-relaxed whitespace-pre-wrap">{exp.description}</p>}
                  {Array.isArray(exp.technologies) && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-4">
                      {exp.technologies.map((t, idx) => (
                        <span key={idx} className="px-2.5 py-0.5 bg-black border border-cyan-400 text-cyan-300 text-xs font-bold uppercase">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Skills Grid */}
        {skills && skills.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-pink-400 uppercase flex items-center gap-3">
              <Code className="w-6 h-6 text-yellow-400" /> // 03. CYBER COMPETENCIES
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {skills.map((skill) => (
                <div key={skill._id} className="p-4 bg-black border border-cyan-500 flex items-center justify-between shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                  <span className="text-xs font-black text-white uppercase truncate">{skill.name}</span>
                  {skill.proficiency && <span className="text-[9px] uppercase px-1.5 py-0.5 bg-pink-500 text-black font-extrabold">{skill.proficiency}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. Projects Grid */}
        {projects && projects.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-pink-400 uppercase flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-yellow-400" /> // 04. DEPLOYED SYSTEMS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj) => (
                <div key={proj._id} className={`${cyberCard} flex flex-col justify-between`}>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <h3 className="text-xl font-black text-white uppercase tracking-tight">{proj.title}</h3>
                      <div className="flex items-center gap-2">
                        {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="p-2.5 bg-black border border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all"><GithubIcon className="w-4 h-4" /></a>}
                        {proj.liveUrl && <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="p-2.5 bg-pink-600 hover:bg-pink-500 text-black font-bold transition-all"><ExternalLink className="w-4 h-4" /></a>}
                      </div>
                    </div>
                    {proj.description && <p className="text-xs text-cyan-200 leading-relaxed">{proj.description}</p>}
                  </div>
                  {Array.isArray(proj.technologies) && proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-cyan-900">
                      {proj.technologies.map((t, idx) => <span key={idx} className="text-[10px] text-yellow-400 font-bold uppercase">[{t}]</span>)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. Education & Certs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {educations && educations.length > 0 && (
            <div className={cyberCard}>
              <h3 className="text-xl font-black text-pink-400 uppercase mb-4">// 05. ACADEMY RECORDS</h3>
              <div className="space-y-4">
                {educations.map((edu) => (
                  <div key={edu._id} className="border-b border-cyan-900 pb-3 last:border-0">
                    <h4 className="text-sm font-black text-white uppercase">{edu.degree}</h4>
                    <p className="text-xs text-yellow-400 font-bold">{edu.institution}</p>
                    <p className="text-[10px] text-cyan-500 pt-1">[{edu.startDate} &minus; {edu.current ? 'ACTIVE' : edu.endDate || 'COMPLETED'}]</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {certificates && certificates.length > 0 && (
            <div className={cyberCard}>
              <h3 className="text-xl font-black text-pink-400 uppercase mb-4">// 06. CREDENTIAL TOKENS</h3>
              <div className="space-y-3">
                {certificates.map((cert) => (
                  <div key={cert._id} className="flex items-center justify-between border-b border-cyan-900 pb-3 last:border-0 text-xs">
                    <div>
                      <strong className="block text-white uppercase">{cert.title}</strong>
                      <span className="text-cyan-400">{cert.issuer} &bull; {cert.issueDate}</span>
                    </div>
                    {cert.credentialUrl && <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="text-pink-400 uppercase font-black underline">VERIFY</a>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 7. Footer */}
        <footer className="pt-12 pb-20 text-center space-y-6 border-t-2 border-cyan-500">
          <div className="p-8 bg-black border-2 border-pink-500 max-w-xl mx-auto space-y-4 shadow-[0_0_25px_rgba(236,72,153,0.4)]">
            <h3 className="text-2xl font-black text-white uppercase">INITIATE COLLABORATION PROTOCOL</h3>
            <p className="text-xs text-cyan-300">Transmit direct signals to candidate terminal below.</p>
            <a href={`mailto:${user.email}`} className="inline-block px-8 py-3 bg-yellow-400 text-black font-black text-xs uppercase tracking-wider hover:bg-yellow-300 transition-all">
              TRANSMIT_EMAIL_TO({user.name})
            </a>
          </div>

          <div className="text-[10px] font-mono uppercase text-cyan-600">
            &copy; {new Date().getFullYear()} {user.name} &bull; CYBERPUNK 2077 THEME &bull; PROMPTFOLIO CAREER OS
          </div>
        </footer>
      </div>
    </div>
  );
};

export default CyberpunkTheme;
