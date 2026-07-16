import React, { useState } from 'react';
import {
  MapPin, ExternalLink, Globe, Download,
  Briefcase, GraduationCap, Award, Code, Terminal as TerminalIcon, ChevronRight
} from 'lucide-react';
import { IThemeProps } from '../types';
import { GithubIcon, LinkedinIcon, TwitterIcon } from '../SocialIcons';

export const TerminalTheme: React.FC<IThemeProps> = ({ data }) => {
  const { user, profile, experiences, educations, skills, projects, certificates, githubConnection, latestResume } = data;
  const [activeCommand, setActiveCommand] = useState<'cat about.txt' | 'ls -l experience/' | 'cat skills.json' | 'ls -l projects/'>('cat about.txt');

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
  const [visitors, setVisitors] = React.useState(1850);
  React.useEffect(() => {
    const timer = setInterval(() => {
      setVisitors((prev) => prev + 1);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const termBorder = "border border-emerald-500/30 bg-slate-950/90 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-emerald-500/5";

  return (
    <div className="min-h-screen bg-[#060b0e] text-emerald-400 font-mono antialiased selection:bg-emerald-500 selection:text-black">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-12 sm:py-20 space-y-8">
        {/* Terminal Header Bar */}
        <div className="rounded-t-2xl bg-slate-900 border border-emerald-500/30 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-xs text-slate-400 ml-2 font-bold flex items-center gap-1.5">
              <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" /> bash &minus; {user.name.toLowerCase().replace(/\s+/g, '_')}@promptfolio:~
            </span>
          </div>
          <span className="text-[11px] text-slate-500">TTY /pts/0</span>
        </div>

        {/* Terminal Main Window */}
        <div className="border-x border-b border-emerald-500/30 rounded-b-2xl bg-slate-950 p-6 sm:p-10 space-y-12 shadow-2xl">
          {/* Hero Banner inside CLI */}
          <div className="space-y-4 border-b border-emerald-500/20 pb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 flex-1 text-left">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-400">$ whoami</span>
                <span className="text-[10px] uppercase font-bold border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">
                  [ STATUS: ACTIVE ]
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                {user.name}
              </h1>
              <p className="text-base sm:text-lg text-emerald-400 font-semibold">
                {profile.title || 'Full Stack Software Engineer'}
              </p>
              {profile.bio && (
                <p className="text-sm text-slate-300 leading-relaxed font-sans sm:font-mono">
                  {profile.bio}
                </p>
              )}
              {profile.location && (
                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500" /> {profile.location}
                </p>
              )}

              {/* Socials / CTAs in CLI */}
              <div className="flex flex-wrap items-center gap-3 pt-3 text-xs font-bold">
                {latestResume?.fileUrl && (
                  <a href={latestResume.fileUrl} target="_blank" rel="noreferrer" className="px-4 py-2 bg-emerald-500 text-black rounded hover:bg-emerald-400 flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5" /> ./download_resume.sh
                  </a>
                )}
                <a href={`mailto:${user.email}`} className="px-4 py-2 border border-emerald-500 text-emerald-400 rounded hover:bg-emerald-500/10 flex items-center">
                  ./send_signal.sh
                </a>
                {profile.socialLinks?.github && <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" className="px-3 py-2 border border-emerald-500/40 rounded text-emerald-400 hover:bg-emerald-500/10">github</a>}
                {profile.socialLinks?.linkedin && <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="px-3 py-2 border border-emerald-500/40 rounded text-emerald-400 hover:bg-emerald-500/10">linkedin</a>}
              </div>

              {/* Statistics CLI output */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-emerald-500/20 text-xs">
                <div>
                  <span className="block text-slate-500">projects.log:</span>
                  <span className="block text-white font-bold">{projects?.length || 0} nodes</span>
                </div>
                <div>
                  <span className="block text-slate-500">experience.dat:</span>
                  <span className="block text-white font-bold">{yearsOfExperience} years</span>
                </div>
                <div>
                  <span className="block text-slate-500">skills.db:</span>
                  <span className="block text-white font-bold">{skills?.length || 0} keys</span>
                </div>
                <div>
                  <span className="block text-slate-500">telemetry_views:</span>
                  <span className="block text-emerald-300 font-mono">{visitors} hits</span>
                </div>
              </div>
            </div>

            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={user.name}
                className="w-36 h-36 sm:w-44 sm:h-44 object-cover rounded-xl border border-emerald-500/40 shadow-lg shrink-0"
              />
            ) : (
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-xl border border-emerald-500/40 bg-slate-900 shadow-lg flex items-center justify-center text-4xl font-black text-white select-none shrink-0">
                {user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          {/* CLI Interactive Tabs */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3 text-xs">
              <span className="text-slate-500 mr-2 font-bold">Quick Commands:</span>
              {(['cat about.txt', 'ls -l experience/', 'cat skills.json', 'ls -l projects/'] as const).map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => setActiveCommand(cmd)}
                  type="button"
                  className={`px-3 py-1.5 rounded transition-all font-semibold ${
                    activeCommand === cmd
                      ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                  }`}
                >
                  $ {cmd}
                </button>
              ))}
            </div>

            {/* Output Box */}
            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-4 text-xs sm:text-sm leading-relaxed">
              <div className="text-slate-400 font-bold">
                <span className="text-emerald-400 font-black">{user.name.toLowerCase().replace(/\s+/g, '_')}@promptfolio:~</span> $ {activeCommand}
              </div>

              {activeCommand === 'cat about.txt' && (
                <div className="text-slate-200 whitespace-pre-wrap leading-relaxed font-sans sm:font-mono">
                  {profile.bio || 'Candidate bio not specified.'}
                </div>
              )}

              {activeCommand === 'ls -l experience/' && (
                <div className="space-y-4">
                  {experiences && experiences.length > 0 ? (
                    experiences.map((exp) => (
                      <div key={exp._id} className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-white font-bold">
                          <span>{exp.role} @ <span className="text-emerald-400">{exp.company}</span></span>
                          <span className="text-xs text-slate-500 font-normal">{exp.startDate} &minus; {exp.current ? 'Present' : exp.endDate || 'Present'}</span>
                        </div>
                        {exp.description && <p className="text-xs text-slate-300">{exp.description}</p>}
                        {Array.isArray(exp.technologies) && exp.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {exp.technologies.map((t, i) => <span key={i} className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 text-[10px]">#{t}</span>)}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-500">Directory experience/ is currently empty.</div>
                  )}
                </div>
              )}

              {activeCommand === 'cat skills.json' && (
                <pre className="text-xs text-emerald-300 overflow-x-auto bg-slate-950 p-4 rounded-lg border border-slate-800">
                  {JSON.stringify(
                    {
                      candidate: user.name,
                      totalVerifiedSkills: (skills || []).length,
                      competencyList: (skills || []).map((s) => ({ skill: s.name, proficiency: s.proficiency || 'Verified' }))
                    },
                    null,
                    2
                  )}
                </pre>
              )}

              {activeCommand === 'ls -l projects/' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {projects && projects.length > 0 ? (
                    projects.map((proj) => (
                      <div key={proj._id} className="p-4 rounded-lg bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <strong className="text-white text-sm">{proj.title}</strong>
                            <div className="flex items-center gap-2">
                              {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline text-xs">[repo]</a>}
                              {proj.liveUrl && <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline text-xs">[demo]</a>}
                            </div>
                          </div>
                          {proj.description && <p className="text-xs text-slate-400 line-clamp-3">{proj.description}</p>}
                        </div>
                        {Array.isArray(proj.technologies) && proj.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1 border-t border-slate-900 pt-2">
                            {proj.technologies.map((t, idx) => <span key={idx} className="text-[10px] text-slate-500">[{t}]</span>)}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-500">Directory projects/ is currently empty.</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* All Sections Overview below interactive box */}
          <div className="space-y-12 pt-8 border-t border-slate-900">
            {/* Education & Certs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {educations && educations.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-emerald-400" /> $ cat /etc/education.conf
                  </h3>
                  {educations.map((edu) => (
                    <div key={edu._id} className="p-4 rounded-lg bg-slate-900/50 border border-slate-800/60 text-xs space-y-1">
                      <strong className="text-white block">{edu.degree}</strong>
                      <span className="text-emerald-400 block">{edu.institution}</span>
                      <span className="text-slate-500 text-[10px]">{edu.startDate} &minus; {edu.current ? 'Present' : edu.endDate || 'Completed'}</span>
                    </div>
                  ))}
                </div>
              )}

              {certificates && certificates.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-400" /> $ ls /usr/local/certs/
                  </h3>
                  {certificates.map((cert) => (
                    <div key={cert._id} className="p-4 rounded-lg bg-slate-900/50 border border-slate-800/60 text-xs flex justify-between items-center">
                      <div>
                        <strong className="text-white block">{cert.title}</strong>
                        <span className="text-slate-400">{cert.issuer} ({cert.issueDate})</span>
                      </div>
                      {cert.credentialUrl && <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">Verify</a>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Prompt */}
            <footer className="pt-8 border-t border-slate-900 text-center space-y-4">
              <div className="text-xs text-slate-400">
                <span>$ mail -s "Direct Inquiry" <a href={`mailto:${user.email}`} className="text-emerald-400 underline">{user.email}</a></span>
              </div>
              <div className="text-[10px] text-slate-600 font-mono">
                &copy; {new Date().getFullYear()} {user.name} &bull; Developer Terminal Theme &bull; Promptfolio Career OS
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminalTheme;
