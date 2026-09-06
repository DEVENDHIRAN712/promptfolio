import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, ExternalLink, Download,
  Briefcase, GraduationCap, Award, Code, Sparkles, ChevronDown, ChevronUp, CheckCircle2, Quote
} from 'lucide-react';
import { IThemeProps } from '../types';
import { GithubIcon, LinkedinIcon } from '../SocialIcons';

export const CreativeStudioTheme: React.FC<IThemeProps> = ({ data }) => {
  const { user, profile, experiences, educations, skills, projects, certificates, githubConnection, latestResume } = data;
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);

  const toggleProject = (id: string) => {
    setExpandedProjectId(prev => prev === id ? null : id);
  };

  const studioCard = "p-8 sm:p-10 bg-stone-900 border border-stone-800 rounded-3xl hover:border-amber-400/50 transition-all duration-300 shadow-xl";

  return (
    <div className="min-h-screen bg-[#12100E] text-stone-100 font-sans antialiased selection:bg-amber-400 selection:text-black">
      <div className="max-w-6xl mx-auto px-6 sm:px-12 py-16 sm:py-24 space-y-24">

        {/* Hero Section */}
        <header className="space-y-12 border-b border-stone-800 pb-16">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs uppercase font-mono tracking-widest text-amber-400 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20">
              CREATIVE STUDIO // EDITORIAL PORTFOLIO
            </span>
            <span className="text-xs font-mono text-stone-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Available for Select Engagements
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-2 space-y-6">
              <h1 className="text-5xl sm:text-7xl font-serif font-black tracking-tight text-stone-100 leading-tight">
                {user.name}
              </h1>

              {profile.title && (
                <p className="text-xl sm:text-2xl font-light text-amber-300 font-mono">
                  {profile.title}
                </p>
              )}

              {profile.location && (
                <p className="text-sm font-mono text-stone-400 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-400" /> {profile.location}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 pt-4">
                {latestResume?.fileUrl && (
                  <a
                    href={latestResume.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs uppercase tracking-wider transition-transform hover:scale-105"
                  >
                    <Download className="w-4 h-4" /> Download Resume
                  </a>
                )}

                <a
                  href={`mailto:${user.email}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-100 font-bold text-xs uppercase tracking-wider transition-transform hover:scale-105 border border-stone-700"
                >
                  Contact Candidate
                </a>

                {profile.socialLinks?.github && (
                  <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" className="p-3 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700">
                    <GithubIcon className="w-5 h-5" />
                  </a>
                )}
                {profile.socialLinks?.linkedin && (
                  <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="p-3 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700">
                    <LinkedinIcon className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>

            <div className="shrink-0 flex justify-center lg:justify-end">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={user.name}
                  className="w-56 h-56 sm:w-64 sm:h-64 rounded-3xl object-cover border-2 border-stone-700 shadow-2xl"
                />
              ) : (
                <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-3xl border-2 border-stone-700 bg-stone-800 flex items-center justify-center text-5xl font-serif text-amber-300 select-none">
                  {user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-stone-800 font-mono text-center sm:text-left">
            <div>
              <span className="block text-3xl font-serif font-black text-amber-300">{projects?.length || 0}</span>
              <span className="block text-[11px] text-stone-400 uppercase tracking-widest">Case Studies</span>
            </div>
            <div>
              <span className="block text-3xl font-serif font-black text-amber-300">{experiences?.length || 0}</span>
              <span className="block text-[11px] text-stone-400 uppercase tracking-widest">Career Roles</span>
            </div>
            <div>
              <span className="block text-3xl font-serif font-black text-amber-300">{skills?.length || 0}</span>
              <span className="block text-[11px] text-stone-400 uppercase tracking-widest">Competencies</span>
            </div>
            <div>
              <span className="block text-3xl font-serif font-black text-amber-300">{certificates?.length || 0}</span>
              <span className="block text-[11px] text-stone-400 uppercase tracking-widest">Certifications</span>
            </div>
          </div>
        </header>

        {/* Narrative Biography Block */}
        {profile.bio && (
          <div className={`${studioCard} relative overflow-hidden`}>
            <Quote className="w-12 h-12 text-amber-400/20 absolute top-6 right-6" />
            <h2 className="text-xs uppercase font-mono tracking-widest text-amber-400 mb-4">Editorial Overview</h2>
            <p className="text-xl sm:text-2xl font-serif leading-relaxed text-stone-200 font-light">
              &ldquo;{profile.bio}&rdquo;
            </p>
          </div>
        )}

        {/* Projects Gallery */}
        <section className="space-y-8">
          <div className="flex items-center justify-between border-b border-stone-800 pb-4">
            <h2 className="text-3xl font-serif font-bold text-stone-100 flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-amber-400" /> Featured Projects &amp; Work
            </h2>
            <span className="text-xs font-mono text-stone-400">{projects?.length || 0} Projects Showcase</span>
          </div>

          {projects && projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((proj) => {
                const isExpanded = expandedProjectId === proj._id;
                return (
                  <motion.div key={proj._id} whileHover={{ y: -4 }} className={`${studioCard} flex flex-col justify-between`}>
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-2xl font-serif font-bold text-stone-100">{proj.title}</h3>
                        <div className="flex items-center gap-2 shrink-0">
                          {proj.githubUrl && (
                            <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-stone-800 text-stone-300 hover:text-white">
                              <GithubIcon className="w-4 h-4" />
                            </a>
                          )}
                          {proj.liveUrl && (
                            <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-amber-400 text-black hover:bg-amber-300">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>

                      {proj.description && (
                        <p className={`text-sm text-stone-300 leading-relaxed font-light ${isExpanded ? '' : 'line-clamp-3'}`}>
                          {proj.description}
                        </p>
                      )}

                      {proj.description && proj.description.length > 120 && (
                        <button
                          onClick={() => toggleProject(proj._id)}
                          type="button"
                          className="text-xs font-mono font-semibold text-amber-400 hover:underline flex items-center gap-1"
                        >
                          {isExpanded ? <>Collapse details <ChevronUp className="w-3.5 h-3.5" /></> : <>Read case study details <ChevronDown className="w-3.5 h-3.5" /></>}
                        </button>
                      )}
                    </div>

                    {Array.isArray(proj.technologies) && proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-4 mt-4 border-t border-stone-800">
                        {proj.technologies.map((t, idx) => (
                          <span key={idx} className="px-3 py-1 rounded-full bg-stone-800 text-amber-300 text-xs font-mono border border-stone-700">
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
            <div className={studioCard}>
              <p className="text-sm font-mono text-stone-400 text-center">Projects will appear here when added.</p>
            </div>
          )}
        </section>

        {/* Experience Timeline */}
        <section className="space-y-8">
          <div className="flex items-center justify-between border-b border-stone-800 pb-4">
            <h2 className="text-3xl font-serif font-bold text-stone-100 flex items-center gap-3">
              <Briefcase className="w-6 h-6 text-amber-400" /> Career History
            </h2>
            <span className="text-xs font-mono text-stone-400">{experiences?.length || 0} Positions</span>
          </div>

          {experiences && experiences.length > 0 ? (
            <div className="space-y-6">
              {experiences.map((exp) => (
                <div key={exp._id} className={studioCard}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-2xl font-serif font-bold text-stone-100">{exp.role}</h3>
                      <p className="text-base font-semibold text-amber-400 font-mono mt-0.5">{exp.company}</p>
                    </div>
                    <span className="text-xs font-mono px-3.5 py-1 rounded-full bg-stone-800 text-stone-300 border border-stone-700 w-fit">
                      {exp.startDate} &minus; {exp.current ? 'Present' : exp.endDate || 'Present'}
                    </span>
                  </div>

                  {exp.description && (
                    <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-light whitespace-pre-wrap">{exp.description}</p>
                  )}

                  {Array.isArray(exp.technologies) && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-4 mt-4 border-t border-stone-800">
                      {exp.technologies.map((t, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-lg bg-stone-800 text-stone-300 text-xs font-mono border border-stone-700">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className={studioCard}>
              <p className="text-sm font-mono text-stone-400 text-center">Experience will appear here when added.</p>
            </div>
          )}
        </section>

        {/* Skills Matrix */}
        <section className="space-y-8">
          <div className="border-b border-stone-800 pb-4">
            <h2 className="text-3xl font-serif font-bold text-stone-100 flex items-center gap-3">
              <Code className="w-6 h-6 text-amber-400" /> Specialized Skills
            </h2>
          </div>

          {skills && skills.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
              {skills.map((skill) => (
                <div key={skill._id} className="p-4 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-between">
                  <span className="text-sm font-bold text-stone-100 truncate">{skill.name}</span>
                  {skill.proficiency && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20">
                      {skill.proficiency}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className={studioCard}>
              <p className="text-sm font-mono text-stone-400 text-center">Skills will appear here when added.</p>
            </div>
          )}
        </section>

        {/* Education & Certs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className={studioCard}>
            <h3 className="text-xl font-serif font-bold text-stone-100 flex items-center gap-2 mb-6">
              <GraduationCap className="w-5 h-5 text-amber-400" /> Academic Degrees
            </h3>
            {educations && educations.length > 0 ? (
              <div className="space-y-6">
                {educations.map((edu) => (
                  <div key={edu._id} className="border-b border-stone-800 pb-4 last:border-0 last:pb-0">
                    <h4 className="text-lg font-serif font-bold text-stone-100">{edu.degree}</h4>
                    <p className="text-sm font-mono text-amber-400">{edu.institution}</p>
                    <p className="text-xs font-mono text-stone-400 pt-1">{edu.startDate} &minus; {edu.current ? 'Present' : edu.endDate || 'Completed'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs font-mono text-stone-400 text-center py-2">Education will appear here when added.</p>
            )}
          </div>

          <div className={studioCard}>
            <h3 className="text-xl font-serif font-bold text-stone-100 flex items-center gap-2 mb-6">
              <Award className="w-5 h-5 text-amber-400" /> Industry Certifications
            </h3>
            {certificates && certificates.length > 0 ? (
              <div className="space-y-4 font-mono">
                {certificates.map((cert) => (
                  <div key={cert._id} className="flex items-center justify-between border-b border-stone-800 pb-3 last:border-0 last:pb-0 text-xs">
                    <div>
                      <h4 className="font-bold text-stone-100">{cert.title}</h4>
                      <p className="text-stone-400">{cert.issuer} &bull; {cert.issueDate}</p>
                    </div>
                    {cert.credentialUrl && <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="text-amber-400 font-bold underline">Verify</a>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs font-mono text-stone-400 text-center py-2">Certificates will appear here when added.</p>
            )}
          </div>
        </div>

        {/* GitHub Integration */}
        {githubConnection && githubConnection.username ? (
          <div className={studioCard}>
            <div className="flex items-center justify-between font-mono">
              <h3 className="text-xl font-serif font-bold text-stone-100 flex items-center gap-2">
                <GithubIcon className="w-5 h-5 text-stone-100" /> GitHub Connection
              </h3>
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified
              </span>
            </div>
            <p className="text-xs font-mono text-stone-400 mt-3">
              Connected handle: <strong className="text-stone-100">@{githubConnection.username}</strong>
              {typeof githubConnection.publicRepos === 'number' && githubConnection.publicRepos > 0 ? ` (${githubConnection.publicRepos} public repos)` : ''}
            </p>
          </div>
        ) : (
          <div className={`${studioCard} text-center py-6`}>
            <p className="text-xs font-mono text-stone-400">GitHub profile not connected.</p>
          </div>
        )}

        {/* Footer */}
        <footer className="pt-12 pb-24 text-center space-y-8">
          <div className={`${studioCard} max-w-2xl mx-auto text-center space-y-4`}>
            <h3 className="text-3xl font-serif font-bold text-stone-100">Inquire for Opportunities</h3>
            <p className="text-sm text-stone-300 font-light">Direct communications welcome via email.</p>
            <div className="pt-2">
              <a href={`mailto:${user.email}`} className="inline-block px-8 py-4 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs uppercase tracking-wider shadow-lg">
                Contact {user.name} Directly
              </a>
            </div>
          </div>

          <div className="text-xs font-mono text-stone-500">
            &copy; {new Date().getFullYear()} {user.name}. All rights reserved. &bull; Creative Studio Theme.
          </div>
        </footer>

      </div>
    </div>
  );
};

export default CreativeStudioTheme;
