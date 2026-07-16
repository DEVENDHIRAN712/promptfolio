import React from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, ExternalLink, Globe, Download,
  Briefcase, GraduationCap, Award, Code, Sparkles, ChevronRight
} from 'lucide-react';
import { IThemeProps } from '../types';
import { GithubIcon, LinkedinIcon, TwitterIcon } from '../SocialIcons';

export const GlassTheme: React.FC<IThemeProps> = ({ data }) => {
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
  const [visitors, setVisitors] = React.useState(2150);
  React.useEffect(() => {
    const timer = setInterval(() => {
      setVisitors((prev) => prev + Math.floor(Math.random() * 2) + 1);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const glassCard = "p-8 rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] hover:border-white/20 transition-all";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased relative overflow-x-hidden selection:bg-purple-500/30">
      {/* Deep Glowing Neon Backdrops */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-purple-600/30 via-pink-600/20 to-blue-600/30 blur-[140px] animate-pulse" />
        <div className="absolute bottom-10 right-1/4 w-[550px] h-[550px] rounded-full bg-gradient-to-l from-cyan-600/25 via-teal-600/20 to-indigo-600/25 blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-10 py-16 sm:py-24 space-y-24">
        {/* 1. Hero Section */}
        <div className={`${glassCard} flex flex-col md:flex-row items-center justify-between gap-12`}>
          <div className="space-y-6 max-w-2xl flex-1 text-left">
            <div className="flex flex-wrap gap-2.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-mono text-purple-300">
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                <span>VERIFIED PORTFOLIO FEED</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Open to Opportunities
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-purple-200 tracking-tight leading-tight">
                {user.name}
              </h1>
              <p className="text-xl sm:text-2xl font-semibold text-purple-300">
                {profile.title || 'Full Stack Software Engineer'}
              </p>
            </div>

            {profile.bio && (
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-light">
                {profile.bio}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
              {profile.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-pink-400" /> {profile.location}
                </span>
              )}
              <span>&bull;</span>
              <span>{yearsOfExperience} Years Exp</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              {latestResume?.fileUrl && (
                <a
                  href={latestResume.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-sm font-bold shadow-xl shadow-purple-500/25 transition-all transform hover:scale-105 active:scale-95 animate-pulse-subtle"
                >
                  <Download className="w-4 h-4" /> Download Resume
                </a>
              )}

              <a
                href={`mailto:${user.email}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 text-white text-sm font-bold transition-all transform hover:scale-105 active:scale-95"
              >
                Send Email Message
              </a>

              {profile.socialLinks?.github && (
                <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all">
                  <GithubIcon className="w-5 h-5" />
                </a>
              )}
              {profile.socialLinks?.linkedin && (
                <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all">
                  <LinkedinIcon className="w-5 h-5" />
                </a>
              )}
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10">
              <div>
                <span className="block text-2xl font-black text-white">{projects?.length || 0}</span>
                <span className="block text-[10px] font-mono uppercase tracking-wider text-purple-300">Projects</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-white">{yearsOfExperience}</span>
                <span className="block text-[10px] font-mono uppercase tracking-wider text-purple-300">Years Exp</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-white">{skills?.length || 0}</span>
                <span className="block text-[10px] font-mono uppercase tracking-wider text-purple-300">Skills Matrix</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-pink-400 font-mono">{visitors}</span>
                <span className="block text-[10px] font-mono uppercase tracking-wider text-purple-300">Page Views</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 mx-auto md:mx-0">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={user.name}
                className="w-48 h-48 sm:w-60 sm:h-60 rounded-3xl object-cover border-2 border-white/20 shadow-2xl"
              />
            ) : (
              <div className="w-48 h-48 sm:w-60 sm:h-60 rounded-3xl border-2 border-white/20 bg-slate-900 shadow-2xl flex items-center justify-center text-4xl sm:text-5xl font-black text-white select-none">
                {user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* 2. About Narrative */}
        {profile.bio && (
          <div className={glassCard}>
            <h2 className="text-xs font-mono uppercase tracking-widest text-pink-400 mb-3">Narrative Profile</h2>
            <p className="text-lg sm:text-xl text-slate-200 leading-relaxed font-light">{profile.bio}</p>
          </div>
        )}

        {/* 3. Experience */}
        {experiences && experiences.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3 px-2">
              <Briefcase className="w-6 h-6 text-purple-400" /> Work Experience
            </h2>
            <div className="space-y-6">
              {experiences.map((exp) => (
                <motion.div key={exp._id} whileHover={{ scale: 1.01 }} className={glassCard}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-white">{exp.role}</h3>
                      <p className="text-sm font-semibold text-pink-300">{exp.company}</p>
                    </div>
                    <span className="text-xs font-mono px-3 py-1 rounded-full bg-white/10 text-slate-300 border border-white/10 w-fit">
                      {exp.startDate} &minus; {exp.current ? 'Present' : exp.endDate || 'Present'}
                    </span>
                  </div>
                  {exp.description && <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{exp.description}</p>}
                  {Array.isArray(exp.technologies) && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-4">
                      {exp.technologies.map((t, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-lg bg-white/5 text-purple-200 text-xs font-mono border border-white/10">
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

        {/* 4. Skills Grid */}
        {skills && skills.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3 px-2">
              <Code className="w-6 h-6 text-purple-400" /> Verified Competencies
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {skills.map((skill) => (
                <motion.div key={skill._id} whileHover={{ y: -3 }} className="p-4 rounded-2xl bg-white/[0.05] backdrop-blur-xl border border-white/10 flex items-center justify-between">
                  <span className="text-sm font-bold text-white truncate">{skill.name}</span>
                  {skill.proficiency && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
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
            <h2 className="text-2xl font-bold text-white flex items-center gap-3 px-2">
              <Sparkles className="w-6 h-6 text-purple-400" /> Featured Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj) => (
                <div key={proj._id} className={`${glassCard} flex flex-col justify-between`}>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <h3 className="text-xl font-bold text-white">{proj.title}</h3>
                      <div className="flex items-center gap-2">
                        {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-white/10 text-white"><GithubIcon className="w-4 h-4" /></a>}
                        {proj.liveUrl && <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-purple-600 text-white"><ExternalLink className="w-4 h-4" /></a>}
                      </div>
                    </div>
                    {proj.description && <p className="text-sm text-slate-300 leading-relaxed">{proj.description}</p>}
                  </div>
                  {Array.isArray(proj.technologies) && proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                      {proj.technologies.map((t, idx) => <span key={idx} className="text-xs font-mono text-purple-300">#{t}</span>)}
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
            <div className={glassCard}>
              <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                <GraduationCap className="w-5 h-5 text-purple-400" /> Education
              </h3>
              <div className="space-y-4">
                {educations.map((edu) => (
                  <div key={edu._id} className="border-b border-white/10 pb-3 last:border-0">
                    <h4 className="text-base font-bold text-white">{edu.degree}</h4>
                    <p className="text-sm text-pink-300">{edu.institution}</p>
                    <p className="text-xs font-mono text-slate-400 pt-1">{edu.startDate} &minus; {edu.current ? 'Present' : edu.endDate || 'Completed'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {certificates && certificates.length > 0 && (
            <div className={glassCard}>
              <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-pink-400" /> Certifications
              </h3>
              <div className="space-y-3">
                {certificates.map((cert) => (
                  <div key={cert._id} className="flex items-center justify-between border-b border-white/10 pb-3 last:border-0">
                    <div>
                      <h4 className="text-sm font-bold text-white">{cert.title}</h4>
                      <p className="text-xs text-slate-400">{cert.issuer} &bull; {cert.issueDate}</p>
                    </div>
                    {cert.credentialUrl && <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="text-xs text-purple-300 flex items-center gap-1 font-semibold">Verify <ChevronRight className="w-3 h-3" /></a>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 7. Contact & Footer */}
        <footer className="pt-12 pb-20 text-center space-y-6">
          <div className={`${glassCard} max-w-2xl mx-auto space-y-4`}>
            <h3 className="text-2xl font-bold text-white">Let&apos;s Build Something Incredible</h3>
            <p className="text-sm text-slate-300">Available for innovative software architecture and consulting.</p>
            <a href={`mailto:${user.email}`} className="inline-block px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 font-bold text-sm text-white shadow-lg">
              Get in Touch with {user.name}
            </a>
          </div>

          <div className="text-xs font-mono text-slate-500">
            &copy; {new Date().getFullYear()} {user.name} &bull; Glassmorphism Theme by Promptfolio Career OS
          </div>
        </footer>
      </div>
    </div>
  );
};

export default GlassTheme;
