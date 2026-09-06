import React, { useEffect } from 'react';
import { IPublicPortfolioData } from './types';

interface SeoHeadProps {
  data: IPublicPortfolioData;
  slug: string;
}

export const SeoHead: React.FC<SeoHeadProps> = ({ data, slug }) => {
  useEffect(() => {
    const { user, profile } = data;
    const fullName = user.name || 'Candidate';
    const title = profile.title || '';
    const bio = profile.bio || `Explore the verified engineering portfolio of ${fullName}, featuring projects, skills, and experience.`;
    const avatar = profile.avatar || '';
    const pageUrl = window.location.href;

    // 1. Set Document Title
    document.title = title ? `${fullName} — ${title} | Promptfolio` : `${fullName} | Promptfolio`;

    // 2. Helper to set or update meta tag
    const setMetaTag = (attrName: 'name' | 'property', attrValue: string, content: string) => {
      if (!content) return;
      let tag = document.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement | null;
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attrName, attrValue);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    const skillNames = (data.skills || []).map((s) => s.name);
    const keywords = [fullName, title, ...skillNames].filter(Boolean).join(', ');

    // Standard SEO
    setMetaTag('name', 'description', bio);
    setMetaTag('name', 'keywords', keywords);
    setMetaTag('name', 'author', fullName);
    setMetaTag('name', 'robots', 'index, follow');

    // OpenGraph
    setMetaTag('property', 'og:title', title ? `${fullName} — ${title}` : fullName);
    setMetaTag('property', 'og:description', bio);
    if (avatar) {
      setMetaTag('property', 'og:image', avatar);
    }
    setMetaTag('property', 'og:url', pageUrl);
    setMetaTag('property', 'og:type', 'profile');
    setMetaTag('property', 'og:site_name', 'Promptfolio Career OS');

    // Twitter Card
    setMetaTag('name', 'twitter:card', avatar ? 'summary_large_image' : 'summary');
    setMetaTag('name', 'twitter:title', title ? `${fullName} — ${title}` : fullName);
    setMetaTag('name', 'twitter:description', bio);
    if (avatar) {
      setMetaTag('name', 'twitter:image', avatar);
    }

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

    const jsonLdData: Record<string, any> = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: fullName,
      url: pageUrl,
      sameAs: sameAsList.filter(Boolean),
      knowsAbout: skillNames,
      alumniOf: (data.educations || []).map((e) => ({
        '@type': 'EducationalOrganization',
        name: e.institution,
      })),
      worksFor: (data.experiences || []).filter((e) => e.current).map((e) => ({
        '@type': 'Organization',
        name: e.company,
      })),
    };

    if (title) jsonLdData.jobTitle = title;
    if (bio) jsonLdData.description = bio;
    if (avatar) jsonLdData.image = avatar;

    scriptTag.text = JSON.stringify(jsonLdData, null, 2);

    return () => {
      const schemaEl = document.getElementById(schemaId);
      if (schemaEl) schemaEl.remove();
    };
  }, [data, slug]);

  return null;
};

export default SeoHead;
