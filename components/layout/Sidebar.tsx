import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Role } from '../../types';
import { ICONS } from '../../constants';
import Button from '../ui/Button';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/', text: 'Dashboard', icon: ICONS.dashboard, roles: [Role.Admin, Role.Kader, Role.Warga] },
    { to: '/articles', text: 'Edukasi & Info', icon: ICONS.education, roles: [Role.Admin, Role.Kader, Role.Warga] },
    { to: '/users', text: 'Manajemen User', icon: ICONS.users, roles: [Role.Admin] },
  ];

  const activeLinkClass = 'bg-primary-500 text-white shadow-lg shadow-primary-200/80';
  const inactiveLinkClass = 'text-slate-500 hover:bg-primary-100 hover:text-primary-600';
  
  const sidebarClasses = `
    hidden lg:flex w-64 bg-white border-r border-slate-100 flex-col h-full z-10
  `;

  return (
    <aside className={sidebarClasses}>
      <div className="h-20 flex items-center justify-center px-4 border-b border-slate-100">
        <div className="flex items-center gap-3 text-primary-700">
            <div className="w-10 h-10 text-primary-500"><ICONS.logo /></div>
            <h1 className="text-xl font-extrabold tracking-tight">KIA Digital</h1>
        </div>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-2">
        {navLinks.filter(link => user && link.roles.includes(user.role)).map(link => {
          const Icon = link.icon;
          return (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${isActive ? activeLinkClass : inactiveLinkClass}`
            }
          >
            <Icon className="w-6 h-6" />
            <span>{link.text}</span>
          </NavLink>
        )})}
      </nav>
      <div className="px-4 py-4 border-t border-slate-100">
        <Button variant="ghost" className="w-full justify-start gap-3 !font-bold" onClick={handleLogout}>
          <ICONS.logout className="w-6 h-6" />
          <span>Logout</span>
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;