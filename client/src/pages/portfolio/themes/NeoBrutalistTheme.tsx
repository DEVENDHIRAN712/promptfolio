import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, ExternalLink, Download,
  Briefcase, GraduationCap, Award, Code, Sparkles, ChevronDown, ChevronUp, CheckCircle2
} from 'lucide-react';
import { IThemeProps } from '../types';
import { GithubIcon, LinkedinIcon } from '../SocialIcons';

export const NeoBrutalistTheme: React.FC<IThemeProps> = ({ data }) => {
  const { user, profile, experiences, educations, skills, projects, certificates, githubConnection, latestResume } = data;
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  const toggleProject = (id: string) => {
    setExpandedProject(prev => prev === id ? null : id);
  };

  const brutCard = "p-6 sm:p-8 bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1 hover:translate-x-1";

  return (
    <div className="min-h-screen bg-[#FFFBEB] text-black font-sans antialiased selection:bg-yellow-300 selection:text-black">
      <div className="max-w-5xl mx-auto px-6 sm:px-10 py-16 sm:py-24 space-y-16">
        
        {/* Hero Section */}
        <header className="p-8 sm:p-12 bg-yellow-300 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="px-4 py-1.5 bg-black text-white font-mono text-xs font-black uppercase tracking-wider border-2 border-black">
              NEO-BRUTALIST // VERIFIED PORTFOLIO
            </span>
            <span className="px-3 py-1 bg-lime-300 border-2 border-black text-xs font-bold font-mono">
              [ STATUS: OPEN FOR HIRING ]
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="space-y-4 flex-1">
              <h1 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase leading-none">
                {user.name}
              </h1>

              {profile.title && (
                <p className="text-xl sm:text-2xl font-bold bg-white border-2 border-black px-3 py-1 inline-block">
                  {profile.title}
                </p>
              )}

              {profile.bio && (
                <p className="text-base sm:text-lg font-medium leading-relaxed max-w-2xl bg-amber-50 border-2 border-black p-4">
                  {profile.bio}
                </p>
              )}

              {profile.location && (
                <p className="text-sm font-bold flex items-center gap-1.5 font-mono">
                  <MapPin className="w-4 h-4 text-black" /> LOCATION: {profile.location}
                </p>
              )}

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-4 font-mono font-bold text-xs">
                {latestResume?.fileUrl && (
                  <a
                    href={latestResume.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 bg-pink-400 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-pink-300 transition-all active:translate-x-1 active:translate-y-1"
                  >
                    <Download className="w-4 h-4" /> RESUME.PDF
                  </a>
                )}

                <a
                  href={`mailto:${user.email}`}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-cyan-300 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-cyan-200 transition-all active:translate-x-1 active:translate-y-1"
                >
                  EMAIL CANDIDATE
                </a>

                {profile.socialLinks?.github && (
                  <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" className="p-3 bg-white border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-100">
                    <GithubIcon className="w-5 h-5" />
                  </a>
                )}

                {profile.socialLinks?.linkedin && (
                  <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="p-3 bg-white border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-100">
                    <LinkedinIcon className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>

            {/* Avatar block */}
            <div className="shrink-0">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={user.name}
                  className="w-44 h-44 sm:w-52 sm:h-52 object-cover border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white"
                />
              ) : (
                <div className="w-44 h-44 sm:w-52 sm:h-52 border-4 border-black bg-purple-300 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-5xl font-black">
                  {user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t-4 border-black font-mono">
            <div className="bg-white border-2 border-black p-3 text-center">
              <span className="block text-2xl font-black">{projects?.length || 0}</span>
              <span className="block text-[11px] font-bold">PROJECTS</span>
            </div>
            <div className="bg-white border-2 border-black p-3 text-center">
              <span className="block text-2xl font-black">{experiences?.length || 0}</span>
              <span className="block text-[11px] font-bold">ROLES</span>
            </div>
            <div className="bg-white border-2 border-black p-3 text-center">
              <span className="block text-2xl font-black">{skills?.length || 0}</span>
              <span className="block text-[11px] font-bold">SKILLS</span>
            </div>
            <div className="bg-white border-2 border-black p-3 text-center">
              <span className="block text-2xl font-black">{certificates?.length || 0}</span>
              <span className="block text-[11px] font-bold">CERTS</span>
            </div>
          </div>
        </header>

        {/* Featured Projects Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b-4 border-black pb-3">
            <h2 className="text-2xl font-black tracking-tight uppercase flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-pink-500" /> FEATURED PROJECTS &amp; CASE STUDIES
            </h2>
            <span className="font-mono text-xs font-bold px-3 py-1 bg-black text-white">
              [{projects?.length || 0} ITEMS]
            </span>
          </div>

          {projects && projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj) => {
                const isExpanded = expandedProject === proj._id;
                return (
                  <motion.div key={proj._id} className={brutCard}>
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-2xl font-black uppercase tracking-tight">{proj.title}</h3>
                        <div className="flex items-center gap-2 shrink-0">
                          {proj.githubUrl && (
                            <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="p-2 bg-yellow-300 border-2 border-black hover:bg-yellow-400">
                              <GithubIcon className="w-4 h-4" />
                            </a>
                          )}
                          {proj.liveUrl && (
                            <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="p-2 bg-pink-400 border-2 border-black hover:bg-pink-500">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>

                      {proj.description && (
                        <p className={`text-sm font-medium leading-relaxed ${isExpanded ? '' : 'line-clamp-3'}`}>
                          {proj.description}
                        </p>
                      )}

                      {proj.description && proj.description.length > 120 && (
                        <button
                          onClick={() => toggleProject(proj._id)}
                          type="button"
                          className="text-xs font-mono font-bold underline flex items-center gap-1 hover:text-pink-600"
                        >
                          {isExpanded ? <>Collapse details <ChevronUp className="w-3.5 h-3.5" /></> : <>Expand case study <ChevronDown className="w-3.5 h-3.5" /></>}
                        </button>
                      )}
                    </div>

                    {Array.isArray(proj.technologies) && proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-4 mt-4 border-t-2 border-black font-mono">
                        {proj.technologies.map((t, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-black text-white text-[11px] font-bold uppercase">
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
            <div className={brutCard}>
              <p className="text-sm font-bold font-mono text-slate-600 text-center">Projects will appear here when added.</p>
            </div>
          )}
        </section>

        {/* Experience Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b-4 border-black pb-3">
            <h2 className="text-2xl font-black tracking-tight uppercase flex items-center gap-3">
              <Briefcase className="w-6 h-6 text-cyan-500" /> WORK EXPERIENCE
            </h2>
            <span className="font-mono text-xs font-bold px-3 py-1 bg-black text-white">
              [{experiences?.length || 0} ROLES]
            </span>
          </div>

          {experiences && experiences.length > 0 ? (
            <div className="space-y-6">
              {experiences.map((exp) => (
                <div key={exp._id} className={brutCard}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-xl font-black uppercase">{exp.role}</h3>
                      <p className="text-sm font-bold text-pink-600 font-mono">@{exp.company}</p>
                    </div>
                    <span className="text-xs font-mono font-bold px-3 py-1 bg-cyan-200 border-2 border-black w-fit">
                      {exp.startDate} &minus; {exp.current ? 'PRESENT' : exp.endDate || 'PRESENT'}
                    </span>
                  </div>

                  {exp.description && (
                    <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                  )}

                  {Array.isArray(exp.technologies) && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-4 mt-3 border-t-2 border-black font-mono">
                      {exp.technologies.map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-yellow-200 border border-black text-xs font-bold uppercase">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className={brutCard}>
              <p className="text-sm font-bold font-mono text-slate-600 text-center">Experience will appear here when added.</p>
            </div>
          )}
        </section>

        {/* Skills Matrix Section */}
        <section className="space-y-6">
          <div className="border-b-4 border-black pb-3">
            <h2 className="text-2xl font-black tracking-tight uppercase flex items-center gap-3">
              <Code className="w-6 h-6 text-purple-500" /> COMPETENCIES &amp; SKILLS
            </h2>
          </div>

          {skills && skills.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
              {skills.map((skill) => (
                <div key={skill._id} className="p-3 bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between">
                  <span className="text-xs font-black uppercase truncate">{skill.name}</span>
                  {skill.proficiency && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-yellow-300 border border-black uppercase">
                      {skill.proficiency}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className={brutCard}>
              <p className="text-sm font-bold font-mono text-slate-600 text-center">Skills will appear here when added.</p>
            </div>
          )}
        </section>

        {/* Education & Certifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className={brutCard}>
            <h3 className="text-xl font-black uppercase flex items-center gap-2 mb-4">
              <GraduationCap className="w-5 h-5 text-black" /> EDUCATION
            </h3>
            {educations && educations.length > 0 ? (
              <div className="space-y-4">
                {educations.map((edu) => (
                  <div key={edu._id} className="border-b-2 border-black pb-3 last:border-0">
                    <h4 className="font-black text-sm uppercase">{edu.degree}</h4>
                    <p className="text-xs font-bold text-pink-600">{edu.institution}</p>
                    <p className="text-[11px] font-mono text-slate-600 pt-1">{edu.startDate} &minus; {edu.current ? 'Present' : edu.endDate || 'Completed'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs font-mono font-bold text-slate-600 text-center py-2">Education will appear here when added.</p>
            )}
          </div>

          <div className={brutCard}>
            <h3 className="text-xl font-black uppercase flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-black" /> CERTIFICATIONS
            </h3>
            {certificates && certificates.length > 0 ? (
              <div className="space-y-3 font-mono">
                {certificates.map((cert) => (
                  <div key={cert._id} className="flex items-center justify-between border-b-2 border-black pb-3 last:border-0 text-xs">
                    <div>
                      <strong className="block font-black uppercase">{cert.title}</strong>
                      <span className="text-slate-600">{cert.issuer} ({cert.issueDate})</span>
                    </div>
                    {cert.credentialUrl && <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="underline font-bold text-pink-600">VERIFY</a>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs font-mono font-bold text-slate-600 text-center py-2">Certificates will appear here when added.</p>
            )}
          </div>
        </div>

        {/* GitHub Connection */}
        <div className={brutCard}>
          <h3 className="text-xl font-black uppercase mb-3 flex items-center justify-between font-mono">
            <span>GITHUB CONNECTION</span>
            {githubConnection && githubConnection.username && (
              <span className="text-xs font-bold bg-lime-300 border border-black px-2 py-0.5 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> CONNECTED
              </span>
            )}
          </h3>
          {githubConnection && githubConnection.username ? (
            <p className="text-xs font-mono font-bold">
              HANDLE: <strong className="underline">@{githubConnection.username}</strong>
              {typeof githubConnection.publicRepos === 'number' && githubConnection.publicRepos > 0 ? ` [${githubConnection.publicRepos} PUBLIC REPOS]` : ''}
            </p>
          ) : (
            <p className="text-xs font-mono font-bold text-slate-600">GitHub profile not connected.</p>
          )}
        </div>

        {/* Footer */}
        <footer className="p-8 bg-black text-white border-4 border-black text-center space-y-4 shadow-[8px_8px_0px_0px_rgba(254,240,138,1)]">
          <p className="text-sm font-black uppercase">Collaborate with {user.name}: <a href={`mailto:${user.email}`} className="underline text-yellow-300">{user.email}</a></p>
          <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">
            &copy; {new Date().getFullYear()} {user.name} &bull; NEO-BRUTALIST THEME &bull; PROMPTFOLIO
          </p>
        </footer>

      </div>
    </div>
  );
};

export default NeoBrutalistTheme;
