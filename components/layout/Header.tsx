import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ICONS, IconComponent } from '../../constants';
import { Notification, NotificationType, Role } from '../../types';
import { dataService } from '../../services/dataService';

const timeSince = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " tahun lalu";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " bulan lalu";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " hari lalu";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " jam lalu";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " menit lalu";
    return Math.floor(seconds) + " detik lalu";
}

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  // Custom hook to close dropdown when clicking outside
  const useOutsideAlerter = (ref: React.RefObject<HTMLDivElement>, close: () => void) => {
      useEffect(() => {
          function handleClickOutside(event: MouseEvent) {
              if (ref.current && !ref.current.contains(event.target as Node)) {
                  close();
              }
          }
          document.addEventListener("mousedown", handleClickOutside);
          return () => document.removeEventListener("mousedown", handleClickOutside);
      }, [ref, close]);
  }

  useOutsideAlerter(notificationRef, () => setIsNotificationOpen(false));
  useOutsideAlerter(userMenuRef, () => setIsUserMenuOpen(false));


  useEffect(() => {
    const fetchNotifications = async () => {
      if (user) {
        const userNotifications = await dataService.getNotificationsForUser(user.id);
        setNotifications(userNotifications);
      }
    };
    fetchNotifications();
    
    const interval = setInterval(fetchNotifications, 30000); // Refresh notifications every 30 seconds
    return () => clearInterval(interval);

  }, [user]);
  
  const handleBellClick = async () => {
    setIsNotificationOpen(prev => !prev);
    if (!isNotificationOpen && user) {
        await dataService.markNotificationsAsRead(user.id);
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    }
  };
  
  const handleLogout = () => {
      logout();
      navigate('/login');
  }

  if (!user) return null;

  const getRoleBadgeColor = (role: Role) => {
    switch(role) {
      case Role.Admin: return 'bg-red-200 text-red-800';
      case Role.Kader: return 'bg-secondary-200 text-yellow-800';
      case Role.Warga: return 'bg-green-200 text-green-800';
      default: return 'bg-slate-200 text-slate-800';
    }
  }
  
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const notificationIcons: Record<NotificationType, IconComponent> = {
    [NotificationType.NewAnalysis]: ICONS.analysis,
    [NotificationType.NewArticle]: ICONS.education,
    [NotificationType.NewGrowthRecord]: ICONS.growthChartUp,
    [NotificationType.NewMilestone]: ICONS.milestoneAward,
  };

  return (
    <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-end px-4 sm:px-8">
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <div className="relative" ref={notificationRef}>
            <button onClick={handleBellClick} className="text-slate-400 hover:text-primary-500 transition-colors p-2 rounded-full hover:bg-slate-100">
                <ICONS.bell className="w-6 h-6"/>
                {unreadCount > 0 && (
                     <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 text-white text-xs items-center justify-center">{unreadCount}</span>
                    </span>
                )}
            </button>
            {isNotificationOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden">
                    <div className="p-3 font-bold text-slate-800 border-b border-slate-100">Notifikasi</div>
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.map(n => {
                                const Icon = notificationIcons[n.type];
                                return (
                                <Link to={n.link} key={n.id} onClick={() => setIsNotificationOpen(false)} className="flex items-start gap-3 p-3 hover:bg-primary-50 transition-colors border-b border-slate-50">
                                    <div className="w-8 h-8 flex-shrink-0 text-primary-500 mt-0.5"><Icon/></div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-700">{n.title}</p>
                                        <p className="text-sm text-slate-500">{n.message}</p>
                                        <p className="text-xs text-slate-400 font-medium mt-1">{timeSince(n.createdAt)}</p>
                                    </div>
                                </Link>
                            )})
                        ) : (
                            <p className="p-6 text-center text-sm text-slate-500">Tidak ada notifikasi baru.</p>
                        )}
                    </div>
                </div>
            )}
        </div>

        {/* User Menu Dropdown */}
        <div className="relative" ref={userMenuRef}>
            <button onClick={() => setIsUserMenuOpen(prev => !prev)} className="flex items-center gap-2 text-left p-1 rounded-lg hover:bg-slate-100 transition-colors">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-primary-200">
                    {user.name.charAt(0).toUpperCase()}
                </div>
                 <div className="hidden sm:block">
                    <p className="text-sm font-bold text-slate-800">{user.name}</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getRoleBadgeColor(user.role)}`}>{user.role}</span>
                </div>
            </button>
            {isUserMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-100 z-50 overflow-hidden p-2">
                    <Link to="/profile" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold text-slate-600 hover:bg-primary-100 hover:text-primary-700 transition-colors">
                        <ICONS.userCog className="w-5 h-5"/> Profil Saya
                    </Link>
                    <button onClick={handleLogout} className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold text-red-500 hover:bg-red-100 transition-colors">
                        <ICONS.logout className="w-5 h-5"/> Logout
                    </button>
                </div>
            )}
        </div>
      </div>
    </header>
  );
};

export default Header;