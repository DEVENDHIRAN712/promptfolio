import React from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, ExternalLink, Download,
  Briefcase, GraduationCap, Award, Code, Sparkles, ChevronRight, CheckCircle2
} from 'lucide-react';
import { IThemeProps } from '../types';
import { GithubIcon, LinkedinIcon } from '../SocialIcons';

export const AppleTheme: React.FC<IThemeProps> = ({ data }) => {
  const { user, profile, experiences, educations, skills, projects, certificates, githubConnection, latestResume } = data;

  // 1. Calculate Years of Experience
  const yearsOfExperience = React.useMemo(() => {
    if (!experiences || experiences.length === 0) return 0;
    let totalMonths = 0;
    experiences.forEach((exp) => {
      const start = new Date(exp.startDate);
      const end = exp.current ? new Date() : (exp.endDate ? new Date(exp.endDate) : new Date());
      const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
      totalMonths += isNaN(months) || months < 0 ? 0 : months;
    });
    return Math.round((totalMonths / 12) * 10) / 10;
  }, [experiences]);

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#f5f5f7] font-sans antialiased selection:bg-blue-500/30 selection:text-white">
      {/* Subtle Apple Glow Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-blue-600/15 to-purple-600/10 blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-cyan-600/10 to-indigo-600/15 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-10 py-16 sm:py-24 space-y-24">
        {/* 1. Hero Section */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-10 text-center sm:text-left flex flex-col md:flex-row md:items-center justify-between gap-12"
        >
          <div className="space-y-6 max-w-2xl flex-1 text-left">
            <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1d1d1f] border border-[#333336] text-xs font-semibold text-slate-300 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Verified Developer Profile</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Available for Roles
              </span>
            </motion.div>

            <div className="space-y-2">
              <motion.h1 variants={itemVariants} className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
                {user.name}
              </motion.h1>
              {profile.title && (
                <motion.p variants={itemVariants} className="text-xl sm:text-2xl font-medium text-[#a1a1a6] tracking-tight">
                  {profile.title}
                </motion.p>
              )}
            </div>

            {profile.bio && (
              <motion.p variants={itemVariants} className="text-base sm:text-lg text-slate-300 leading-relaxed">
                {profile.bio}
              </motion.p>
            )}

            {(profile.location || (experiences && experiences.length > 0 && yearsOfExperience > 0)) && (
              <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm font-medium text-[#86868b]">
                {profile.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-blue-500" /> {profile.location}
                  </span>
                )}
                {profile.location && experiences && experiences.length > 0 && yearsOfExperience > 0 && <span>&bull;</span>}
                {experiences && experiences.length > 0 && yearsOfExperience > 0 && (
                  <span>{yearsOfExperience} {yearsOfExperience === 1 ? 'Year' : 'Years'} Experience</span>
                )}
              </motion.div>
            )}

            {/* Social Links & CTA */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center sm:justify-start gap-3.5 pt-2">
              {latestResume?.fileUrl && (
                <a
                  href={latestResume.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-500/25 transition-all transform hover:scale-105 active:scale-95"
                >
                  <Download className="w-4 h-4" /> Resume PDF
                </a>
              )}

              <a
                href={`mailto:${user.email}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1d1d1f] hover:bg-[#2d2d30] border border-[#333336] text-white text-sm font-semibold transition-all transform hover:scale-105 active:scale-95"
              >
                Contact Candidate
              </a>

              {profile.socialLinks?.github && (
                <a
                  href={profile.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full bg-[#1d1d1f] hover:bg-[#2d2d30] border border-[#333336] text-slate-300 hover:text-white transition-all"
                  title="GitHub"
                >
                  <GithubIcon className="w-5 h-5" />
                </a>
              )}

              {profile.socialLinks?.linkedin && (
                <a
                  href={profile.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full bg-[#1d1d1f] hover:bg-[#2d2d30] border border-[#333336] text-slate-300 hover:text-white transition-all"
                  title="LinkedIn"
                >
                  <LinkedinIcon className="w-5 h-5" />
                </a>
              )}
            </motion.div>

            {/* Statistics Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-[#1d1d1f]">
              <div className="space-y-1">
                <span className="block text-2xl font-bold text-white tracking-tight">{projects?.length || 0}</span>
                <span className="block text-xs uppercase tracking-widest text-[#86868b] font-semibold">Projects</span>
              </div>
              <div className="space-y-1">
                <span className="block text-2xl font-bold text-white tracking-tight">{experiences?.length || 0}</span>
                <span className="block text-xs uppercase tracking-widest text-[#86868b] font-semibold">Experience Roles</span>
              </div>
              <div className="space-y-1">
                <span className="block text-2xl font-bold text-white tracking-tight">{skills?.length || 0}</span>
                <span className="block text-xs uppercase tracking-widest text-[#86868b] font-semibold">Skills</span>
              </div>
              <div className="space-y-1">
                <span className="block text-2xl font-bold text-white tracking-tight">{certificates?.length || 0}</span>
                <span className="block text-xs uppercase tracking-widest text-[#86868b] font-semibold">Certificates</span>
              </div>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="shrink-0 mx-auto md:mx-0">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-blue-500 to-indigo-500 opacity-20 blur-xl group-hover:opacity-40 transition-opacity" />
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={user.name}
                  className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-3xl object-cover border border-[#333336] shadow-2xl animate-pulse-subtle"
                />
              ) : (
                <div className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-3xl border border-[#333336] shadow-2xl flex items-center justify-center bg-gradient-to-br from-[#1d1d1f] to-[#111112] text-white text-4xl sm:text-5xl font-bold tracking-tight select-none">
                  {user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
          </motion.div>
        </motion.section>

        {/* 2. About Narrative Section */}
        {profile.bio && (
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="p-8 sm:p-12 rounded-3xl bg-[#161618] border border-[#2d2d30] space-y-4 shadow-xl"
          >
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#86868b]">About the Engineer</h2>
            <p className="text-lg sm:text-2xl font-normal leading-relaxed text-[#f5f5f7]">
              {profile.bio}
            </p>
          </motion.section>
        )}

        {/* 3. Experience Timeline */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="space-y-8"
        >
          <div className="flex items-center justify-between border-b border-[#2d2d30] pb-4">
            <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
              <Briefcase className="w-6 h-6 text-blue-500" /> Work Experience
            </h2>
            <span className="text-xs font-mono text-[#86868b]">{experiences?.length || 0} Roles</span>
          </div>

          {experiences && experiences.length > 0 ? (
            <div className="space-y-6">
              {experiences.map((exp) => (
                <motion.div
                  key={exp._id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.01 }}
                  className="p-8 rounded-3xl bg-[#161618] border border-[#2d2d30] hover:border-[#424245] transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-xl font-bold text-white tracking-tight">{exp.role}</h3>
                      <p className="text-base font-semibold text-blue-400 mt-0.5">{exp.company}</p>
                    </div>
                    <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#242426] text-[#a1a1a6] border border-[#333336] w-fit">
                      {exp.startDate} &minus; {exp.current ? 'Present' : exp.endDate || 'Present'}
                    </span>
                  </div>

                  {exp.description && (
                    <p className="text-sm sm:text-base text-[#a1a1a6] leading-relaxed whitespace-pre-wrap">
                      {exp.description}
                    </p>
                  )}

                  {Array.isArray(exp.technologies) && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {exp.technologies.map((t, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-lg bg-[#242426] text-slate-300 text-xs font-mono border border-[#333336]">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-[#161618] border border-[#2d2d30] text-center text-[#86868b] text-sm font-medium">
              Experience will appear here when added.
            </div>
          )}
        </motion.section>

        {/* 4. Skills Cluster Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="space-y-8"
        >
          <div className="flex items-center justify-between border-b border-[#2d2d30] pb-4">
            <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
              <Code className="w-6 h-6 text-blue-500" /> Core Competencies &amp; Skills
            </h2>
            <span className="text-xs font-mono text-[#86868b]">{skills?.length || 0} Skills</span>
          </div>

          {skills && skills.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
              {skills.map((skill) => (
                <motion.div
                  key={skill._id}
                  variants={itemVariants}
                  whileHover={{ y: -3 }}
                  className="p-4 rounded-2xl bg-[#161618] border border-[#2d2d30] flex items-center justify-between gap-3 shadow-md"
                >
                  <span className="text-sm font-bold text-white truncate">{skill.name}</span>
                  {skill.proficiency && (
                    <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                      {skill.proficiency}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-[#161618] border border-[#2d2d30] text-center text-[#86868b] text-sm font-medium">
              Skills will appear here when added.
            </div>
          )}
        </motion.section>

        {/* 5. Featured Projects Grid */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="space-y-8"
        >
          <div className="flex items-center justify-between border-b border-[#2d2d30] pb-4">
            <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-blue-500" /> Featured Engineering Projects
            </h2>
            <span className="text-xs font-mono text-[#86868b]">{projects?.length || 0} Projects</span>
          </div>

          {projects && projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj) => (
                <motion.div
                  key={proj._id}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="p-8 rounded-3xl bg-[#161618] border border-[#2d2d30] flex flex-col justify-between space-y-6 shadow-xl"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-2xl font-bold text-white tracking-tight">{proj.title}</h3>
                      <div className="flex items-center gap-2 shrink-0">
                        {proj.githubUrl && (
                          <a
                            href={proj.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-[#242426] hover:bg-[#333336] text-slate-300 hover:text-white transition-colors"
                            title="GitHub Repository"
                          >
                            <GithubIcon className="w-4 h-4" />
                          </a>
                        )}
                        {proj.liveUrl && (
                          <a
                            href={proj.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                            title="Live Demo"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>

                    {proj.description && (
                      <p className="text-sm text-[#a1a1a6] leading-relaxed line-clamp-4">
                        {proj.description}
                      </p>
                    )}
                  </div>

                  {Array.isArray(proj.technologies) && proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-[#242426]">
                      {proj.technologies.map((t, idx) => (
                        <span key={idx} className="text-xs font-mono text-[#86868b]">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-[#161618] border border-[#2d2d30] text-center text-[#86868b] text-sm font-medium">
              Projects will appear here when added.
            </div>
          )}
        </motion.section>

        {/* 6. Education Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="space-y-8"
        >
          <div className="flex items-center justify-between border-b border-[#2d2d30] pb-4">
            <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
              <GraduationCap className="w-6 h-6 text-blue-500" /> Academic Background
            </h2>
          </div>

          {educations && educations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {educations.map((edu) => (
                <motion.div
                  key={edu._id}
                  variants={itemVariants}
                  className="p-8 rounded-3xl bg-[#161618] border border-[#2d2d30] space-y-2"
                >
                  <h3 className="text-lg font-bold text-white tracking-tight">{edu.degree}</h3>
                  <p className="text-base font-semibold text-blue-400">{edu.institution}</p>
                  <p className="text-xs font-mono text-[#86868b] pt-2">
                    {edu.startDate} &minus; {edu.current ? 'Present' : edu.endDate || 'Completed'}
                    {edu.grade ? ` • GPA: ${edu.grade}` : ''}
                  </p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-[#161618] border border-[#2d2d30] text-center text-[#86868b] text-sm font-medium">
              Education will appear here when added.
            </div>
          )}
        </motion.section>

        {/* 7. Certificates & GitHub Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="space-y-6 p-8 rounded-3xl bg-[#161618] border border-[#2d2d30]"
          >
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-500" /> Professional Certifications
            </h3>
            {certificates && certificates.length > 0 ? (
              <div className="space-y-4">
                {certificates.map((cert) => (
                  <div key={cert._id} className="flex items-center justify-between border-b border-[#242426] pb-3 last:border-0 last:pb-0">
                    <div>
                      <h4 className="text-sm font-bold text-white">{cert.title}</h4>
                      <p className="text-xs text-[#86868b]">{cert.issuer} &bull; {cert.issueDate}</p>
                    </div>
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-400 hover:underline flex items-center gap-1 shrink-0 font-semibold"
                      >
                        Verify <ChevronRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#86868b] text-center py-4">Certificates will appear here when added.</p>
            )}
          </motion.section>

          {githubConnection && githubConnection.username ? (
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="space-y-6 p-8 rounded-3xl bg-[#161618] border border-[#2d2d30] flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <GithubIcon className="w-5 h-5 text-white" /> Verified GitHub Connection
                  </h3>
                  <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                  </span>
                </div>
                <p className="text-xs text-[#a1a1a6]">
                  Connected GitHub profile: <strong className="text-white">@{githubConnection.username}</strong>
                  {typeof githubConnection.publicRepos === 'number' && githubConnection.publicRepos > 0 ? ` (${githubConnection.publicRepos} public repositories)` : ''}
                </p>
              </div>

              <div className="pt-4 border-t border-[#242426] flex items-center justify-between">
                <a
                  href={`https://github.com/${githubConnection.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#242426] hover:bg-[#333336] text-white text-xs font-semibold transition-colors"
                >
                  Explore GitHub Profile <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.section>
          ) : (
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="space-y-4 p-8 rounded-3xl bg-[#161618] border border-[#2d2d30] flex flex-col items-center justify-center text-center"
            >
              <GithubIcon className="w-8 h-8 text-[#86868b]" />
              <p className="text-xs text-[#86868b] font-medium">GitHub profile not connected.</p>
            </motion.section>
          )}
        </div>

        {/* 8. Contact & Footer */}
        <footer className="border-t border-[#2d2d30] pt-12 pb-20 text-center space-y-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white">Interested in collaborating with {user.name}?</h3>
            <p className="text-sm text-[#86868b]">Feel free to reach out via email or connect on LinkedIn.</p>
          </div>
          <div className="flex items-center justify-center gap-4">
            <a
              href={`mailto:${user.email}`}
              className="px-6 py-3 rounded-full bg-white text-black font-semibold text-sm hover:bg-slate-200 transition-colors shadow-lg"
            >
              Send Direct Email
            </a>
            {profile.socialLinks?.linkedin && (
              <a
                href={profile.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full bg-[#1d1d1f] text-white border border-[#333336] font-semibold text-sm hover:bg-[#2d2d30] transition-colors"
              >
                Connect on LinkedIn
              </a>
            )}
          </div>

          <div className="pt-8 text-xs font-mono text-[#6e6e73]">
            &copy; {new Date().getFullYear()} {user.name}. All rights reserved. &bull; Powered by <strong className="text-blue-400">Promptfolio Career OS</strong>.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AppleTheme;
