import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, ExternalLink, Download,
  Briefcase, GraduationCap, Award, Code, Sparkles, ChevronDown, ChevronUp, CheckCircle2, Layers, Cpu
} from 'lucide-react';
import { IThemeProps } from '../types';
import { GithubIcon, LinkedinIcon } from '../SocialIcons';

export const ArchitectGridTheme: React.FC<IThemeProps> = ({ data }) => {
  const { user, profile, experiences, educations, skills, projects, certificates, githubConnection, latestResume } = data;
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);

  const toggleProject = (id: string) => {
    setExpandedProjectId(prev => prev === id ? null : id);
  };

  const gridCard = "p-6 sm:p-8 bg-[#0B132B]/90 border border-[#1C2541] rounded-xl shadow-xl hover:border-cyan-500/50 transition-all duration-200 relative group";

  return (
    <div className="min-h-screen bg-[#070A13] text-slate-200 font-mono antialiased relative selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
      {/* Blueprint Grid Background Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-15" style={{
        backgroundImage: 'linear-gradient(to right, #00B4D8 1px, transparent 1px), linear-gradient(to bottom, #00B4D8 1px, transparent 1px)',
        backgroundSize: '32px 32px'
      }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-10 py-16 sm:py-24 space-y-16">

        {/* Blueprint Header */}
        <header className="p-8 sm:p-12 bg-[#0B132B] border-2 border-[#1C2541] rounded-2xl shadow-2xl space-y-8 relative">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1C2541] pb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>ARCHITECTURAL SPECIFICATION // CAD.SYS.v4</span>
            </div>
            <div className="text-[10px] text-slate-400 uppercase tracking-widest bg-[#1C2541] px-3 py-1 rounded">
              GRID COORD: [37.7749° N, 122.4194° W]
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="space-y-4 flex-1">
              <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-none uppercase">
                {user.name}
              </h1>

              {profile.title && (
                <p className="text-lg sm:text-xl font-bold text-cyan-400">
                  SYSTEM ARCHITECT: {profile.title}
                </p>
              )}

              {profile.bio && (
                <p className="text-sm text-slate-300 leading-relaxed font-sans sm:font-mono bg-[#1C2541]/40 p-4 rounded-lg border border-[#1C2541]">
                  {profile.bio}
                </p>
              )}

              {profile.location && (
                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" /> LOCATION SPEC: {profile.location}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-3 text-xs font-bold">
                {latestResume?.fileUrl && (
                  <a
                    href={latestResume.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold uppercase transition-transform hover:scale-105"
                  >
                    <Download className="w-4 h-4" /> SPEC_RESUME.PDF
                  </a>
                )}

                <a
                  href={`mailto:${user.email}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1C2541] hover:bg-[#2A365C] text-cyan-300 border border-cyan-500/40 uppercase transition-transform hover:scale-105"
                >
                  TRANSMIT_SIGNAL
                </a>

                {profile.socialLinks?.github && (
                  <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" className="p-2.5 bg-[#1C2541] hover:bg-[#2A365C] border border-cyan-500/40 rounded-lg text-cyan-300">
                    <GithubIcon className="w-4 h-4" />
                  </a>
                )}

                {profile.socialLinks?.linkedin && (
                  <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="p-2.5 bg-[#1C2541] hover:bg-[#2A365C] border border-cyan-500/40 rounded-lg text-cyan-300">
                    <LinkedinIcon className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            <div className="shrink-0">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={user.name}
                  className="w-44 h-44 sm:w-52 sm:h-52 object-cover rounded-xl border-2 border-cyan-500/50 shadow-xl"
                />
              ) : (
                <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-xl border-2 border-cyan-500/50 bg-[#1C2541] flex items-center justify-center text-4xl font-black text-white select-none">
                  {user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
          </div>

          {/* Metric Specifications */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-[#1C2541] text-xs">
            <div className="p-3 bg-[#1C2541]/40 rounded-lg border border-[#1C2541]">
              <span className="block text-slate-400 text-[10px]">PROJECT_MODULES:</span>
              <span className="block text-white font-bold text-xl">{projects?.length || 0} UNITS</span>
            </div>
            <div className="p-3 bg-[#1C2541]/40 rounded-lg border border-[#1C2541]">
              <span className="block text-slate-400 text-[10px]">CAREER_NODES:</span>
              <span className="block text-white font-bold text-xl">{experiences?.length || 0} ROLES</span>
            </div>
            <div className="p-3 bg-[#1C2541]/40 rounded-lg border border-[#1C2541]">
              <span className="block text-slate-400 text-[10px]">SKILL_CAPABILITIES:</span>
              <span className="block text-white font-bold text-xl">{skills?.length || 0} KEYS</span>
            </div>
            <div className="p-3 bg-[#1C2541]/40 rounded-lg border border-[#1C2541]">
              <span className="block text-slate-400 text-[10px]">VERIFIED_TOKENS:</span>
              <span className="block text-cyan-400 font-bold text-xl">{certificates?.length || 0} CERTS</span>
            </div>
          </div>
        </header>

        {/* Projects Architecture */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#1C2541] pb-3">
            <h2 className="text-xl font-bold uppercase text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" /> // 01. DEPLOYED ARCHITECTURE &amp; PROJECTS
            </h2>
            <span className="text-xs text-slate-400">COUNT: [{projects?.length || 0}]</span>
          </div>

          {projects && projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj) => {
                const isExpanded = expandedProjectId === proj._id;
                return (
                  <div key={proj._id} className={`${gridCard} flex flex-col justify-between`}>
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-lg font-bold text-white uppercase">{proj.title}</h3>
                        <div className="flex items-center gap-2 shrink-0">
                          {proj.githubUrl && (
                            <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="p-2 bg-[#1C2541] text-cyan-300 hover:text-white rounded">
                              <GithubIcon className="w-4 h-4" />
                            </a>
                          )}
                          {proj.liveUrl && (
                            <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="p-2 bg-cyan-500 text-black hover:bg-cyan-400 rounded">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>

                      {proj.description && (
                        <p className={`text-xs text-slate-300 leading-relaxed ${isExpanded ? '' : 'line-clamp-3'}`}>
                          {proj.description}
                        </p>
                      )}

                      {proj.description && proj.description.length > 120 && (
                        <button
                          onClick={() => toggleProject(proj._id)}
                          type="button"
                          className="text-[11px] text-cyan-400 underline hover:text-cyan-300 flex items-center gap-1"
                        >
                          {isExpanded ? <>Close specs <ChevronUp className="w-3.5 h-3.5" /></> : <>Expand specs <ChevronDown className="w-3.5 h-3.5" /></>}
                        </button>
                      )}
                    </div>

                    {Array.isArray(proj.technologies) && proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-3 mt-3 border-t border-[#1C2541]">
                        {proj.technologies.map((t, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-[#1C2541] text-cyan-300 text-[10px] rounded">
                            [{t}]
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={gridCard}>
              <p className="text-xs text-slate-400 text-center">Projects will appear here when added.</p>
            </div>
          )}
        </section>

        {/* Experience Trace */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#1C2541] pb-3">
            <h2 className="text-xl font-bold uppercase text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-cyan-400" /> // 02. CAREER EXECUTION HISTORY
            </h2>
            <span className="text-xs text-slate-400">NODES: [{experiences?.length || 0}]</span>
          </div>

          {experiences && experiences.length > 0 ? (
            <div className="space-y-6">
              {experiences.map((exp) => (
                <div key={exp._id} className={gridCard}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-white uppercase">{exp.role}</h3>
                      <p className="text-xs text-cyan-400 font-bold">ORGANIZATION: @{exp.company}</p>
                    </div>
                    <span className="text-xs px-3 py-1 bg-[#1C2541] text-slate-300 border border-slate-700 rounded w-fit">
                      {exp.startDate} &minus; {exp.current ? 'ACTIVE' : exp.endDate || 'ACTIVE'}
                    </span>
                  </div>

                  {exp.description && (
                    <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                  )}

                  {Array.isArray(exp.technologies) && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-3 mt-3 border-t border-[#1C2541]">
                      {exp.technologies.map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-[#1C2541] text-slate-300 text-[10px] rounded">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className={gridCard}>
              <p className="text-xs text-slate-400 text-center">Experience will appear here when added.</p>
            </div>
          )}
        </section>

        {/* Competencies */}
        <section className="space-y-6">
          <div className="border-b border-[#1C2541] pb-3">
            <h2 className="text-xl font-bold uppercase text-white flex items-center gap-2">
              <Code className="w-5 h-5 text-cyan-400" /> // 03. TECHNICAL CAPABILITY SCHEMA
            </h2>
          </div>

          {skills && skills.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {skills.map((skill) => (
                <div key={skill._id} className="p-3 bg-[#0B132B] border border-[#1C2541] rounded-lg flex items-center justify-between">
                  <span className="font-bold text-white truncate">{skill.name}</span>
                  {skill.proficiency && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded">
                      {skill.proficiency}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className={gridCard}>
              <p className="text-xs text-slate-400 text-center">Skills will appear here when added.</p>
            </div>
          )}
        </section>

        {/* Education & Certs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className={gridCard}>
            <h3 className="text-lg font-bold text-white uppercase flex items-center gap-2 mb-4">
              <GraduationCap className="w-5 h-5 text-cyan-400" /> // 04. ACADEMY RECORDS
            </h3>
            {educations && educations.length > 0 ? (
              <div className="space-y-4">
                {educations.map((edu) => (
                  <div key={edu._id} className="border-b border-[#1C2541] pb-3 last:border-0">
                    <h4 className="text-sm font-bold text-white uppercase">{edu.degree}</h4>
                    <p className="text-xs text-cyan-400">{edu.institution}</p>
                    <p className="text-[10px] text-slate-400 pt-1">{edu.startDate} &minus; {edu.current ? 'Present' : edu.endDate || 'Completed'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-2">Education will appear here when added.</p>
            )}
          </div>

          <div className={gridCard}>
            <h3 className="text-lg font-bold text-white uppercase flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-cyan-400" /> // 05. CERTIFICATION SCHEMAS
            </h3>
            {certificates && certificates.length > 0 ? (
              <div className="space-y-3 text-xs">
                {certificates.map((cert) => (
                  <div key={cert._id} className="flex items-center justify-between border-b border-[#1C2541] pb-3 last:border-0">
                    <div>
                      <strong className="block text-white uppercase">{cert.title}</strong>
                      <span className="text-slate-400">{cert.issuer} &bull; {cert.issueDate}</span>
                    </div>
                    {cert.credentialUrl && <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="text-cyan-400 underline font-bold">VERIFY</a>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-2">Certificates will appear here when added.</p>
            )}
          </div>
        </div>

        {/* GitHub Connection */}
        <div className={gridCard}>
          <div className="flex items-center justify-between text-xs">
            <h3 className="text-lg font-bold text-white uppercase flex items-center gap-2">
              <GithubIcon className="w-4 h-4 text-white" /> // 06. GITHUB SPECIFICATION
            </h3>
            {githubConnection && githubConnection.username && (
              <span className="text-emerald-400 flex items-center gap-1 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> CONNECTED
              </span>
            )}
          </div>
          {githubConnection && githubConnection.username ? (
            <p className="text-xs text-slate-300 mt-2">
              CONNECTED HANDLE: <strong className="text-white">@{githubConnection.username}</strong>
              {typeof githubConnection.publicRepos === 'number' && githubConnection.publicRepos > 0 ? ` [${githubConnection.publicRepos} PUBLIC REPOS]` : ''}
            </p>
          ) : (
            <p className="text-xs text-slate-400 mt-2">GitHub profile not connected.</p>
          )}
        </div>

        {/* Footer */}
        <footer className="pt-12 pb-20 text-center space-y-6 border-t border-[#1C2541]">
          <div className={`${gridCard} max-w-xl mx-auto space-y-3`}>
            <h3 className="text-xl font-bold text-white uppercase">DIRECT INQUIRY // SIGNAL TRANSMISSION</h3>
            <p className="text-xs text-slate-300">Target Candidate: {user.name} ({user.email})</p>
            <a href={`mailto:${user.email}`} className="inline-block px-6 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase">
              TRANSMIT_EMAIL({user.name})
            </a>
          </div>

          <div className="text-[10px] text-slate-500">
            &copy; {new Date().getFullYear()} {user.name} &bull; Architect Grid Theme &bull; Promptfolio Career OS
          </div>
        </footer>

      </div>
    </div>
  );
};

export default ArchitectGridTheme;
