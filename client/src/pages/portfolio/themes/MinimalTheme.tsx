import React from 'react';
import {
  MapPin, ExternalLink, Globe, Download,
  Briefcase, GraduationCap, Award, Code, ChevronRight
} from 'lucide-react';
import { IThemeProps } from '../types';
import { GithubIcon, LinkedinIcon, TwitterIcon } from '../SocialIcons';

export const MinimalTheme: React.FC<IThemeProps> = ({ data }) => {
  const { user, profile, experiences, educations, skills, projects, certificates, latestResume } = data;

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
  const [visitors, setVisitors] = React.useState(980);
  React.useEffect(() => {
    const timer = setInterval(() => {
      setVisitors((prev) => prev + 1);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-mono antialiased selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <div className="max-w-4xl mx-auto px-6 py-16 sm:py-24 space-y-20 border-x border-zinc-200 dark:border-zinc-800 min-h-screen">
        {/* 1. Hero Header */}
        <header className="border-b-2 border-zinc-900 dark:border-zinc-100 pb-12 space-y-6 flex flex-col sm:flex-row justify-between items-start gap-8">
          <div className="space-y-4 flex-1">
            <div className="flex flex-wrap gap-2">
              <span className="text-xs uppercase tracking-widest font-bold bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 px-2.5 py-1">
                [ MINIMAL / SWISS DESIGN ]
              </span>
              <span className="text-xs uppercase tracking-widest font-bold border border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100 px-2.5 py-1">
                [ STATUS: AVAILABLE ]
              </span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none uppercase">
              {user.name}
            </h1>
            <p className="text-lg font-bold text-zinc-600 dark:text-zinc-400">
              {profile.title || 'Full Stack Software Engineer'}
            </p>
            {profile.bio && (
              <p className="text-sm font-sans leading-relaxed text-zinc-600 dark:text-zinc-400">
                {profile.bio}
              </p>
            )}
            {profile.location && (
              <p className="text-xs flex items-center gap-1.5 font-bold uppercase text-zinc-500">
                <MapPin className="w-4 h-4" /> {profile.location}
              </p>
            )}

            <div className="flex flex-wrap gap-4 pt-2 text-xs font-bold uppercase">
              {latestResume?.fileUrl && (
                <a href={latestResume.fileUrl} target="_blank" rel="noreferrer" className="underline hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black px-2 py-1 border border-zinc-900 dark:border-zinc-100 flex items-center gap-1">
                  <Download className="w-3.5 h-3.5" /> Resume [PDF]
                </a>
              )}
              <a href={`mailto:${user.email}`} className="underline hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black px-2 py-1 border border-zinc-900 dark:border-zinc-100">
                Contact [Email]
              </a>
              {profile.socialLinks?.github && <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" className="underline hover:opacity-75">GitHub</a>}
              {profile.socialLinks?.linkedin && <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="underline hover:opacity-75">LinkedIn</a>}
            </div>

            {/* Minimalist Stark Statistics Block */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-zinc-200 dark:border-zinc-800 text-xs">
              <div>
                <span className="block font-bold">PROJECTS: {projects?.length || 0}</span>
              </div>
              <div>
                <span className="block font-bold">EXPERIENCE: {yearsOfExperience} YRS</span>
              </div>
              <div>
                <span className="block font-bold">SKILLS: {skills?.length || 0} TOTAL</span>
              </div>
              <div>
                <span className="block font-bold text-slate-500 dark:text-slate-400">VIEWS: {visitors}</span>
              </div>
            </div>
          </div>

          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt={user.name}
              className="w-40 h-40 object-cover border-2 border-zinc-900 dark:border-zinc-100 grayscale hover:grayscale-0 transition-all shrink-0"
            />
          ) : (
            <div className="w-40 h-40 border-2 border-zinc-900 dark:border-zinc-100 flex items-center justify-center text-3xl font-black bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 uppercase select-none shrink-0">
              {user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
          )}
        </header>

        {/* 2. About Narrative */}
        {profile.bio && (
          <section className="space-y-3">
            <h2 className="text-xs uppercase tracking-widest font-black border-b border-zinc-300 dark:border-zinc-800 pb-1">
              // 01. BIO
            </h2>
            <p className="text-base sm:text-lg leading-relaxed font-sans">{profile.bio}</p>
          </section>
        )}

        {/* 3. Experience */}
        {experiences && experiences.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-xs uppercase tracking-widest font-black border-b border-zinc-300 dark:border-zinc-800 pb-1 flex items-center justify-between">
              <span>// 02. EXPERIENCE HISTORY</span>
              <span>[{experiences.length}]</span>
            </h2>
            <div className="space-y-8">
              {experiences.map((exp) => (
                <div key={exp._id} className="space-y-2 border-l-2 border-zinc-900 dark:border-zinc-100 pl-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm">
                    <h3 className="font-bold text-base uppercase">{exp.role} &bull; <span className="underline">{exp.company}</span></h3>
                    <span className="text-xs text-zinc-500">{exp.startDate} &minus; {exp.current ? 'Present' : exp.endDate || 'Present'}</span>
                  </div>
                  {exp.description && <p className="text-xs sm:text-sm font-sans leading-relaxed whitespace-pre-wrap">{exp.description}</p>}
                  {Array.isArray(exp.technologies) && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {exp.technologies.map((t, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 text-[10px] uppercase font-bold border border-zinc-400 dark:border-zinc-700">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. Skills */}
        {skills && skills.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xs uppercase tracking-widest font-black border-b border-zinc-300 dark:border-zinc-800 pb-1">
              // 03. SKILLS MATRIX
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span key={skill._id} className="px-3 py-1 border border-zinc-900 dark:border-zinc-100 text-xs font-bold uppercase flex items-center gap-1.5">
                  {skill.name} {skill.proficiency && <span className="text-[10px] text-zinc-500">[{skill.proficiency}]</span>}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* 5. Projects */}
        {projects && projects.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-xs uppercase tracking-widest font-black border-b border-zinc-300 dark:border-zinc-800 pb-1">
              // 04. CASE STUDIES & PROJECTS
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {projects.map((proj) => (
                <div key={proj._id} className="p-6 border-2 border-zinc-900 dark:border-zinc-100 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-black text-lg uppercase tracking-tight">{proj.title}</h3>
                      <div className="flex items-center gap-2">
                        {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="hover:opacity-60"><GithubIcon className="w-4 h-4" /></a>}
                        {proj.liveUrl && <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="hover:opacity-60"><ExternalLink className="w-4 h-4" /></a>}
                      </div>
                    </div>
                    {proj.description && <p className="text-xs font-sans leading-relaxed">{proj.description}</p>}
                  </div>
                  {Array.isArray(proj.technologies) && proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 border-t border-zinc-200 dark:border-zinc-800 pt-2">
                      {proj.technologies.map((t, idx) => <span key={idx} className="text-[10px] uppercase font-bold">[{t}]</span>)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. Education & Certs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {educations && educations.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-xs uppercase tracking-widest font-black border-b border-zinc-300 dark:border-zinc-800 pb-1">
                // 05. EDUCATION
              </h3>
              {educations.map((edu) => (
                <div key={edu._id} className="space-y-1">
                  <h4 className="font-bold text-sm uppercase">{edu.degree}</h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">{edu.institution}</p>
                  <p className="text-[10px] text-zinc-500">{edu.startDate} &minus; {edu.current ? 'Present' : edu.endDate || 'Completed'}</p>
                </div>
              ))}
            </section>
          )}

          {certificates && certificates.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-xs uppercase tracking-widest font-black border-b border-zinc-300 dark:border-zinc-800 pb-1">
                // 06. CERTIFICATES
              </h3>
              {certificates.map((cert) => (
                <div key={cert._id} className="flex justify-between items-center text-xs">
                  <div>
                    <strong className="block uppercase">{cert.title}</strong>
                    <span className="text-zinc-500">{cert.issuer} ({cert.issueDate})</span>
                  </div>
                  {cert.credentialUrl && <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="underline">Verify</a>}
                </div>
              ))}
            </section>
          )}
        </div>

        {/* 7. Footer */}
        <footer className="border-t-2 border-zinc-900 dark:border-zinc-100 pt-8 pb-16 text-center space-y-4">
          <p className="font-bold text-sm uppercase">Direct Contact: <a href={`mailto:${user.email}`} className="underline">{user.email}</a></p>
          <div className="text-[10px] uppercase tracking-widest text-zinc-500">
            &copy; {new Date().getFullYear()} {user.name} &bull; Minimalist Swiss Theme &bull; Promptfolio
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MinimalTheme;
