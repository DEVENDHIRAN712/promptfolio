import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] flex selection:bg-[#4F46E5]/20 selection:text-[#4F46E5] relative">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden relative z-10">
        <Navbar />
        <main className="flex-1 p-6 sm:p-8 md:p-10 max-w-7xl mx-auto w-full transition-all duration-150">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
