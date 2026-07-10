import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex selection:bg-blue-500 selection:text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <Navbar />
        <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
