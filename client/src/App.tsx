import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '@/components/ui/toast';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardOverview } from '@/pages/dashboard/DashboardOverview';
import { ProfileMainPage } from '@/pages/dashboard/profile/ProfileMainPage';
import { ResumeStudioPage } from '@/pages/dashboard/ResumeStudioPage';
import { GitHubIntegrationPage } from '@/pages/dashboard/GitHubIntegrationPage';
import { AiStudioPage } from '@/pages/dashboard/ai/AiStudioPage';
import { AnalyticsPage } from '@/pages/dashboard/AnalyticsPage';
import { SettingsPage } from '@/pages/dashboard/SettingsPage';
import { PublishingStudioPage } from '@/pages/dashboard/PublishingStudioPage';
import { PublicPortfolioPage } from '@/pages/portfolio/PublicPortfolioPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/p/:username" element={<PublicPortfolioPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Protected Workspace Dashboard Routes */}
            <Route path="/dashboard" element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route index element={<DashboardOverview />} />
                <Route path="profile" element={<ProfileMainPage />} />
                <Route path="resume" element={<ResumeStudioPage />} />
                <Route path="github" element={<GitHubIntegrationPage />} />
                <Route path="ai" element={<AiStudioPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="publishing" element={<PublishingStudioPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </QueryClientProvider>
  );
};

export default App;
