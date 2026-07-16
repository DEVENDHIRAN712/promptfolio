import React from 'react';
import { Globe, ShieldCheck } from 'lucide-react';
import { PortfolioPublishingCard } from './PortfolioPublishingCard';

export const PublishingStudioPage: React.FC = () => {
  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#4F46E5]">
            <Globe className="w-3.5 h-3.5" /> DEPLOYMENT ENGINE
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight">
            Portfolio Publishing Console
          </h1>
          <p className="text-sm text-[#64748B] max-w-2xl leading-relaxed">
            Configure your custom public address (`/p/username`), select from 6 clean themes, and deploy your developer portfolio.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white border border-[#E2E8F0] text-xs font-semibold text-[#111827] shrink-0 shadow-sm">
          <ShieldCheck className="w-4 h-4 text-[#10B981]" /> Instant CDN Sync
        </div>
      </div>

      {/* Main Publishing Card Wrapper */}
      <div className="max-w-6xl mx-auto">
        <PortfolioPublishingCard />
      </div>
    </div>
  );
};

export default PublishingStudioPage;
