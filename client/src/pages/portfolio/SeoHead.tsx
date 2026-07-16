import React, { useEffect } from 'react';
import { IPublicPortfolioData } from './types';

interface SeoHeadProps {
  data: IPublicPortfolioData;
  slug: string;
}

export const SeoHead: React.FC<SeoHeadProps> = ({ data, slug }) => {
  useEffect(() => {
    const { user, profile } = data;
    const fullName = user.name || 'Software Engineer';
    const title = profile.title || 'Full Stack & AI Engineer';
    const bio = profile.bio || `Explore the candidate portfolio of ${fullName}, featuring engineering case studies, skills, and work history.`;
    const avatar = profile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
    const pageUrl = window.location.href;

    // 1. Set Document Title
    document.title = `${fullName} — ${title} | Promptfolio`;

    // 2. Helper to set or update meta tag
    const setMetaTag = (attrName: 'name' | 'property', attrValue: string, content: string) => {
      let tag = document.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement | null;
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attrName, attrValue);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    // Standard SEO
    setMetaTag('name', 'description', bio);
    setMetaTag('name', 'keywords', `${fullName}, ${title}, Software Engineer, Portfolio, Promptfolio, React, TypeScript, Node.js, AI`);
    setMetaTag('name', 'author', fullName);
    setMetaTag('name', 'robots', 'index, follow');

    // OpenGraph
    setMetaTag('property', 'og:title', `${fullName} — ${title}`);
    setMetaTag('property', 'og:description', bio);
    setMetaTag('property', 'og:image', avatar);
    setMetaTag('property', 'og:url', pageUrl);
    setMetaTag('property', 'og:type', 'profile');
    setMetaTag('property', 'og:site_name', 'Promptfolio Career OS');

    // Twitter Card
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', `${fullName} — ${title}`);
    setMetaTag('name', 'twitter:description', bio);
    setMetaTag('name', 'twitter:image', avatar);

    // 3. Inject structured JSON-LD Person Schema
    const schemaId = 'promptfolio-person-schema-jsonld';
    let scriptTag = document.getElementById(schemaId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = schemaId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const sameAsList: string[] = [];
    if (profile.socialLinks?.linkedin) sameAsList.push(profile.socialLinks.linkedin);
    if (profile.socialLinks?.github) sameAsList.push(profile.socialLinks.github);
    if (profile.socialLinks?.twitter) sameAsList.push(profile.socialLinks.twitter);
    if (profile.socialLinks?.portfolio) sameAsList.push(profile.socialLinks.portfolio);

    const jsonLdData = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: fullName,
      jobTitle: title,
      description: bio,
      image: avatar,
      url: pageUrl,
      sameAs: sameAsList.filter(Boolean),
      knowsAbout: (data.skills || []).map((s) => s.name),
      alumniOf: (data.educations || []).map((e) => ({
        '@type': 'EducationalOrganization',
        name: e.institution,
      })),
      worksFor: (data.experiences || []).filter((e) => e.current).map((e) => ({
        '@type': 'Organization',
        name: e.company,
      })),
    };

    scriptTag.text = JSON.stringify(jsonLdData, null, 2);

    return () => {
      // Clean up on unmount or navigation
      const schemaEl = document.getElementById(schemaId);
      if (schemaEl) schemaEl.remove();
    };
  }, [data, slug]);

  return null;
};

export default SeoHead;
