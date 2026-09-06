import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, ExternalLink, Download,
  Briefcase, GraduationCap, Award, Code, Sparkles, ChevronDown, ChevronUp, CheckCircle2, ShieldCheck
} from 'lucide-react';
import { IThemeProps } from '../types';
import { GithubIcon, LinkedinIcon } from '../SocialIcons';

export const AuroraPrismTheme: React.FC<IThemeProps> = ({ data }) => {
  const { user, profile, experiences, educations, skills, projects, certificates, githubConnection, latestResume } = data;
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);

  const toggleProject = (id: string) => {
    setExpandedProjectId(prev => prev === id ? null : id);
  };

  const prismCard = "p-8 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 hover:border-pink-500/40 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-300 relative group overflow-hidden";

  return (
    <div className="min-h-screen bg-[#060810] text-slate-100 font-sans antialiased relative selection:bg-pink-500/30 selection:text-pink-200 overflow-x-hidden">
      {/* Dynamic Aurora Ambient Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-pink-600/20 via-purple-600/15 to-cyan-500/20 blur-[160px] animate-pulse" />
        <div className="absolute bottom-10 right-1/4 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-emerald-600/15 via-indigo-600/20 to-pink-600/15 blur-[170px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-10 py-16 sm:py-24 space-y-24">
        
        {/* Hero Banner */}
        <div className={`${prismCard} flex flex-col md:flex-row items-center justify-between gap-12 border-slate-700/50`}>
          <div className="space-y-6 max-w-2xl flex-1 text-left">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-xs font-semibold text-pink-300">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>AURORA PRISM SHOWCASE</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Open for Hire
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-100 to-cyan-200 tracking-tight leading-none">
                {user.name}
              </h1>
              {profile.title && (
                <p className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400">
                  {profile.title}
                </p>
              )}
            </div>

            {profile.bio && (
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-light">
                {profile.bio}
              </p>
            )}

            {profile.location && (
              <div className="flex items-center gap-1.5 text-sm text-slate-400 font-medium">
                <MapPin className="w-4 h-4 text-pink-400" />
                <span>{profile.location}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              {latestResume?.fileUrl && (
                <a
                  href={latestResume.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-pink-500/25 transition-transform hover:scale-105"
                >
                  <Download className="w-4 h-4" /> Download Resume
                </a>
              )}

              <a
                href={`mailto:${user.email}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-white font-bold text-xs uppercase tracking-wider transition-transform hover:scale-105"
              >
                Send Direct Signal
              </a>

              {profile.socialLinks?.github && (
                <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" className="p-3 rounded-full bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white transition-colors">
                  <GithubIcon className="w-5 h-5" />
                </a>
              )}
              {profile.socialLinks?.linkedin && (
                <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="p-3 rounded-full bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white transition-colors">
                  <LinkedinIcon className="w-5 h-5" />
                </a>
              )}
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800 text-xs font-mono">
              <div>
                <span className="block text-2xl font-black text-white">{projects?.length || 0}</span>
                <span className="block text-[10px] uppercase text-cyan-400 tracking-wider">PROJECTS</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-white">{experiences?.length || 0}</span>
                <span className="block text-[10px] uppercase text-pink-400 tracking-wider">EXPERIENCE ROLES</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-white">{skills?.length || 0}</span>
                <span className="block text-[10px] uppercase text-purple-400 tracking-wider">SKILLS MATRIX</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-white">{certificates?.length || 0}</span>
                <span className="block text-[10px] uppercase text-emerald-400 tracking-wider">CERTIFICATES</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 relative">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 opacity-50 blur-lg animate-pulse" />
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={user.name}
                className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-3xl object-cover border-2 border-slate-700 shadow-2xl"
              />
            ) : (
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-3xl border-2 border-slate-700 bg-slate-900 shadow-2xl flex items-center justify-center text-5xl font-black text-white select-none">
                {user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* Narrative Bio */}
        {profile.bio && (
          <div className={prismCard}>
            <h2 className="text-xs font-mono uppercase tracking-widest text-pink-400 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" /> Executive Narrative Summary
            </h2>
            <p className="text-lg sm:text-xl text-slate-200 leading-relaxed font-light">
              {profile.bio}
            </p>
          </div>
        )}

        {/* Projects Showcase */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-pink-400" /> Featured Projects &amp; Case Studies
            </h2>
            <span className="text-xs font-mono text-cyan-400">{projects?.length || 0} Case Studies</span>
          </div>

          {projects && projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj) => {
                const isExpanded = expandedProjectId === proj._id;
                return (
                  <motion.div key={proj._id} whileHover={{ y: -4 }} className={`${prismCard} flex flex-col justify-between`}>
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-xl font-bold text-white tracking-tight">{proj.title}</h3>
                        <div className="flex items-center gap-2 shrink-0">
                          {proj.githubUrl && (
                            <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200">
                              <GithubIcon className="w-4 h-4" />
                            </a>
                          )}
                          {proj.liveUrl && (
                            <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>

                      {proj.description && (
                        <p className={`text-sm text-slate-300 leading-relaxed ${isExpanded ? '' : 'line-clamp-3'}`}>
                          {proj.description}
                        </p>
                      )}

                      {proj.description && proj.description.length > 120 && (
                        <button
                          onClick={() => toggleProject(proj._id)}
                          type="button"
                          className="text-xs font-mono font-semibold text-cyan-400 hover:underline flex items-center gap-1"
                        >
                          {isExpanded ? <>Show Less <ChevronUp className="w-3.5 h-3.5" /></> : <>Read Full Case Study <ChevronDown className="w-3.5 h-3.5" /></>}
                        </button>
                      )}
                    </div>

                    {Array.isArray(proj.technologies) && proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-4 mt-4 border-t border-slate-800/80">
                        {proj.technologies.map((t, idx) => (
                          <span key={idx} className="px-2.5 py-0.5 rounded-lg bg-pink-500/10 text-pink-300 border border-pink-500/20 text-xs font-mono">
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className={prismCard}>
              <p className="text-sm text-slate-400 text-center">Projects will appear here when added.</p>
            </div>
          )}
        </section>

        {/* Experience Timeline */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Briefcase className="w-6 h-6 text-purple-400" /> Career History
            </h2>
            <span className="text-xs font-mono text-pink-400">{experiences?.length || 0} Positions</span>
          </div>

          {experiences && experiences.length > 0 ? (
            <div className="space-y-6">
              {experiences.map((exp) => (
                <div key={exp._id} className={prismCard}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-white">{exp.role}</h3>
                      <p className="text-sm font-semibold text-pink-300">{exp.company}</p>
                    </div>
                    <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-800 text-cyan-300 border border-slate-700 w-fit">
                      {exp.startDate} &minus; {exp.current ? 'Present' : exp.endDate || 'Present'}
                    </span>
                  </div>

                  {exp.description && (
                    <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                  )}

                  {Array.isArray(exp.technologies) && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-4 mt-3 border-t border-slate-800">
                      {exp.technologies.map((t, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-lg bg-slate-800/60 text-cyan-300 text-xs font-mono border border-slate-700">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className={prismCard}>
              <p className="text-sm text-slate-400 text-center">Experience will appear here when added.</p>
            </div>
          )}
        </section>

        {/* Verified Skills */}
        <section className="space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Code className="w-6 h-6 text-cyan-400" /> Technical Capabilities
            </h2>
          </div>

          {skills && skills.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {skills.map((skill) => (
                <motion.div key={skill._id} whileHover={{ scale: 1.03 }} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <span className="text-sm font-bold text-white truncate">{skill.name}</span>
                  {skill.proficiency && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {skill.proficiency}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className={prismCard}>
              <p className="text-sm text-slate-400 text-center">Skills will appear here when added.</p>
            </div>
          )}
        </section>

        {/* Education & Certifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className={prismCard}>
            <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
              <GraduationCap className="w-5 h-5 text-purple-400" /> Academic Credentials
            </h3>
            {educations && educations.length > 0 ? (
              <div className="space-y-4">
                {educations.map((edu) => (
                  <div key={edu._id} className="border-b border-slate-800 pb-3 last:border-0">
                    <h4 className="text-base font-bold text-white">{edu.degree}</h4>
                    <p className="text-sm text-pink-300">{edu.institution}</p>
                    <p className="text-xs font-mono text-slate-400 pt-1">{edu.startDate} &minus; {edu.current ? 'Present' : edu.endDate || 'Completed'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-2">Education will appear here when added.</p>
            )}
          </div>

          <div className={prismCard}>
            <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-pink-400" /> Professional Certifications
            </h3>
            {certificates && certificates.length > 0 ? (
              <div className="space-y-3">
                {certificates.map((cert) => (
                  <div key={cert._id} className="flex items-center justify-between border-b border-slate-800 pb-3 last:border-0 text-xs">
                    <div>
                      <h4 className="font-bold text-white">{cert.title}</h4>
                      <p className="text-slate-400">{cert.issuer} &bull; {cert.issueDate}</p>
                    </div>
                    {cert.credentialUrl && <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="text-pink-400 font-semibold underline">Verify</a>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-2">Certificates will appear here when added.</p>
            )}
          </div>
        </div>

        {/* GitHub Integration */}
        {githubConnection && githubConnection.username ? (
          <div className={prismCard}>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <GithubIcon className="w-5 h-5 text-white" /> Verified GitHub Connection
              </h3>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Connected
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Connected GitHub handle: <strong className="text-white">@{githubConnection.username}</strong>
              {typeof githubConnection.publicRepos === 'number' && githubConnection.publicRepos > 0 ? ` (${githubConnection.publicRepos} public repositories)` : ''}
            </p>
          </div>
        ) : (
          <div className={`${prismCard} text-center py-6`}>
            <p className="text-xs text-slate-400 font-medium">GitHub profile not connected.</p>
          </div>
        )}

        {/* Footer */}
        <footer className="pt-12 pb-20 text-center space-y-6">
          <div className={`${prismCard} max-w-2xl mx-auto space-y-4`}>
            <h3 className="text-2xl font-bold text-white">Let&apos;s Build Exceptional Software</h3>
            <p className="text-sm text-slate-300">Reach candidate directly via email or LinkedIn.</p>
            <a href={`mailto:${user.email}`} className="inline-block px-8 py-3.5 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 font-bold text-xs uppercase tracking-wider text-white shadow-xl">
              Contact {user.name} Directly
            </a>
          </div>

          <div className="text-xs font-mono text-slate-500">
            &copy; {new Date().getFullYear()} {user.name} &bull; Aurora Prism Theme &bull; Promptfolio Career OS
          </div>
        </footer>

      </div>
    </div>
  );
};

export default AuroraPrismTheme;
