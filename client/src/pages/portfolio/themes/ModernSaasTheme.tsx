import React from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, ExternalLink, Globe, Download,
  Briefcase, GraduationCap, Award, Code, Sparkles, ChevronRight, CheckCircle, ArrowUpRight
} from 'lucide-react';
import { IThemeProps } from '../types';
import { GithubIcon, LinkedinIcon, TwitterIcon } from '../SocialIcons';

export const ModernSaasTheme: React.FC<IThemeProps> = ({ data }) => {
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
  const [visitors, setVisitors] = React.useState(2940);
  React.useEffect(() => {
    const timer = setInterval(() => {
      setVisitors((prev) => prev + Math.floor(Math.random() * 4) + 1);
    }, 4200);
    return () => clearInterval(timer);
  }, []);

  const saasCard = "p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950/95 border border-slate-800/80 hover:border-slate-700/80 shadow-2xl transition-all relative overflow-hidden group";

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans antialiased selection:bg-blue-600 selection:text-white relative overflow-x-hidden">
      {/* Vercel / Linear Radial Mesh Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-blue-600/15 via-indigo-600/10 to-transparent blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 w-[800px] h-[350px] bg-gradient-to-t from-purple-600/10 to-transparent blur-[130px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-12 py-16 sm:py-24 space-y-24">
        {/* 1. Hero Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 p-8 sm:p-14 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-blue-950/40 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-6 max-w-2xl relative z-10 text-center lg:text-left">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold shadow-inner">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Verified Engineering Portfolio</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Available for Hire
              </div>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08] text-left">
              {user.name}
            </h1>

            <p className="text-xl sm:text-2xl font-bold text-slate-300 text-left">
              {profile.title || 'Full Stack Software Engineer'}
            </p>

            {profile.bio && (
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-light text-left">
                {profile.bio}
              </p>
            )}

            {profile.location && (
              <div className="flex items-center justify-center lg:justify-start gap-1.5 text-sm font-medium text-slate-400">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span>{profile.location}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              {latestResume?.fileUrl && (
                <a
                  href={latestResume.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-600/25 transition-all transform hover:scale-105"
                >
                  <Download className="w-4 h-4" /> Download Resume PDF
                </a>
              )}

              <a
                href={`mailto:${user.email}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-sm font-bold shadow-lg transition-all transform hover:scale-105"
              >
                Get in Touch
              </a>

              {profile.socialLinks?.github && <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" className="p-3 rounded-2xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all"><GithubIcon className="w-5 h-5" /></a>}
              {profile.socialLinks?.linkedin && <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="p-3 rounded-2xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all"><LinkedinIcon className="w-5 h-5" /></a>}
            </div>

            {/* SaaS Statistics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-slate-800/80 text-left">
              <div className="space-y-1">
                <span className="block text-2xl font-black text-white">{projects?.length || 0}</span>
                <span className="block text-xs uppercase tracking-wider text-slate-400 font-semibold">Projects Showcase</span>
              </div>
              <div className="space-y-1">
                <span className="block text-2xl font-black text-white">{yearsOfExperience}</span>
                <span className="block text-xs uppercase tracking-wider text-slate-400 font-semibold">Years Experience</span>
              </div>
              <div className="space-y-1">
                <span className="block text-2xl font-black text-white">{skills?.length || 0}</span>
                <span className="block text-xs uppercase tracking-wider text-slate-400 font-semibold">Skills Verified</span>
              </div>
              <div className="space-y-1">
                <span className="block text-2xl font-black text-blue-400 font-mono">{visitors}</span>
                <span className="block text-xs uppercase tracking-wider text-slate-400 font-semibold">Visitors</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 relative z-10">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-500 to-indigo-500 opacity-40 blur-xl group-hover:opacity-70 transition-opacity animate-pulse" />
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={user.name}
                  className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-3xl object-cover border border-slate-800 shadow-2xl"
                />
              ) : (
                <div className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl flex items-center justify-center text-5xl font-black text-white select-none">
                  {user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. About Bio */}
        {profile.bio && (
          <div className={saasCard}>
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-4 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Professional Summary
            </h2>
            <p className="text-lg sm:text-2xl text-slate-200 leading-relaxed font-normal">
              {profile.bio}
            </p>
          </div>
        )}

        {/* 3. Experience */}
        {experiences && experiences.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
                <Briefcase className="w-6 h-6 text-blue-500" /> Career Experience
              </h2>
              <span className="text-xs font-mono text-slate-400">{experiences.length} Positions</span>
            </div>

            <div className="space-y-6">
              {experiences.map((exp) => (
                <motion.div key={exp._id} whileHover={{ scale: 1.008 }} className={saasCard}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white tracking-tight">{exp.role}</h3>
                      <p className="text-base font-semibold text-blue-400 mt-0.5">{exp.company}</p>
                    </div>
                    <span className="text-xs font-mono px-3.5 py-1.5 rounded-full bg-slate-950 text-slate-300 border border-slate-800 shrink-0">
                      {exp.startDate} &minus; {exp.current ? 'Present' : exp.endDate || 'Present'}
                    </span>
                  </div>
                  {exp.description && <p className="text-sm sm:text-base text-slate-300 leading-relaxed whitespace-pre-wrap">{exp.description}</p>}
                  {Array.isArray(exp.technologies) && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-800/60 mt-4">
                      {exp.technologies.map((t, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-xl bg-slate-950 text-slate-300 text-xs font-mono border border-slate-800">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Skills */}
        {skills && skills.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
                <Code className="w-6 h-6 text-blue-500" /> Skills &amp; Technologies
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {skills.map((skill) => (
                <motion.div key={skill._id} whileHover={{ y: -3 }} className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center justify-between gap-3 shadow-md">
                  <span className="text-sm font-bold text-white truncate">{skill.name}</span>
                  {skill.proficiency && (
                    <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                      {skill.proficiency}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* 5. Projects */}
        {projects && projects.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-blue-500" /> Case Studies &amp; Projects
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj) => (
                <div key={proj._id} className={`${saasCard} flex flex-col justify-between`}>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                        {proj.title} <ArrowUpRight className="w-5 h-5 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h3>
                      <div className="flex items-center gap-2">
                        {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white"><GithubIcon className="w-4 h-4" /></a>}
                        {proj.liveUrl && <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white"><ExternalLink className="w-4 h-4" /></a>}
                      </div>
                    </div>
                    {proj.description && <p className="text-sm text-slate-300 leading-relaxed">{proj.description}</p>}
                  </div>
                  {Array.isArray(proj.technologies) && proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-800/60 mt-4">
                      {proj.technologies.map((t, idx) => <span key={idx} className="text-xs font-mono text-blue-400">#{t}</span>)}
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
            <div className={saasCard}>
              <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                <GraduationCap className="w-5 h-5 text-blue-500" /> Academic Credentials
              </h3>
              <div className="space-y-6">
                {educations.map((edu) => (
                  <div key={edu._id} className="border-b border-slate-800/80 pb-4 last:border-0 last:pb-0">
                    <h4 className="text-base font-bold text-white">{edu.degree}</h4>
                    <p className="text-sm font-semibold text-blue-400">{edu.institution}</p>
                    <p className="text-xs font-mono text-slate-400 pt-1">{edu.startDate} &minus; {edu.current ? 'Present' : edu.endDate || 'Completed'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {certificates && certificates.length > 0 && (
            <div className={saasCard}>
              <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                <Award className="w-5 h-5 text-blue-500" /> Verified Certifications
              </h3>
              <div className="space-y-4">
                {certificates.map((cert) => (
                  <div key={cert._id} className="flex items-center justify-between border-b border-slate-800/80 pb-3 last:border-0 last:pb-0">
                    <div>
                      <h4 className="text-sm font-bold text-white">{cert.title}</h4>
                      <p className="text-xs text-slate-400">{cert.issuer} &bull; {cert.issueDate}</p>
                    </div>
                    {cert.credentialUrl && <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline flex items-center gap-1 font-semibold">Verify <ChevronRight className="w-3.5 h-3.5" /></a>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 7. Contact & Footer */}
        <footer className="pt-12 pb-24 text-center space-y-8">
          <div className={`${saasCard} max-w-2xl mx-auto space-y-4 text-center`}>
            <h3 className="text-2xl sm:text-3xl font-black text-white">Ready for High-Impact Engineering?</h3>
            <p className="text-sm sm:text-base text-slate-300">Connect via direct email to discuss engineering roles, architectural consultation, or team expansion.</p>
            <div className="pt-2">
              <a href={`mailto:${user.email}`} className="inline-block px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/25 transition-all transform hover:scale-105">
                Contact {user.name} Directly
              </a>
            </div>
          </div>

          <div className="text-xs font-mono text-slate-500">
            &copy; {new Date().getFullYear()} {user.name}. All rights reserved. &bull; Modern SaaS Theme by Promptfolio Career OS.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ModernSaasTheme;
