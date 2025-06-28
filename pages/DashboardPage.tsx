import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Role } from '../types';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import KaderDashboard from '../components/dashboard/KaderDashboard';
import WargaDashboard from '../components/dashboard/WargaDashboard';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const renderAdminView = () => (
    <div className="space-y-8">
      <AdminDashboard />
      <KaderDashboard />
    </div>
  );

  return (
    <div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-1">Dashboard</h1>
        <p className="text-base md:text-lg text-slate-500 mb-8">Halo, {user?.name}! Senang melihatmu kembali. &#x1F44B;</p>
        {user?.role === Role.Admin && renderAdminView()}
        {user?.role === Role.Kader && <KaderDashboard />}
        {user?.role === Role.Warga && <WargaDashboard />}
    </div>
    );
};

export default DashboardPage;