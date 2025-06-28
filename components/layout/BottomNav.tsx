import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ICONS } from '../../constants';
import { Role } from '../../types';

const BottomNav: React.FC = () => {
    const { user } = useAuth();
    
    const navLinks = [
        { to: '/', text: 'Dashboard', icon: ICONS.dashboard, roles: [Role.Admin, Role.Kader, Role.Warga] },
        { to: '/articles', text: 'Edukasi', icon: ICONS.education, roles: [Role.Admin, Role.Kader, Role.Warga] },
        { to: '/profile', text: 'Profil', icon: ICONS.userCog, roles: [Role.Admin, Role.Kader, Role.Warga] },
    ];
    
    const activeLinkClass = 'text-primary-600';
    const inactiveLinkClass = 'text-slate-400';

    if (!user) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-slate-200/80 shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.05)] lg:hidden z-40">
            <div className="flex justify-around items-center h-full">
                {navLinks.filter(link => link.roles.includes(user.role)).map(link => {
                    const Icon = link.icon;
                    return (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.to === '/'}
                            className={({ isActive }) => 
                                `flex flex-col items-center justify-center gap-1 w-full h-full transition-colors duration-200 ${isActive ? activeLinkClass : inactiveLinkClass} hover:text-primary-500`
                            }
                        >
                            <Icon className="w-6 h-6" />
                            <span className="text-xs font-bold">{link.text}</span>
                        </NavLink>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNav;
