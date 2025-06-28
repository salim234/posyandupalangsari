import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ChildDetailsPage from './pages/ChildDetailsPage';
import UserManagementPage from './pages/UserManagementPage';
import MainLayout from './components/layout/MainLayout';
import { Role } from './types';
import ArticlesListPage from './pages/ArticlesListPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import ProfilePage from './pages/ProfilePage';
import LandingPage from './pages/LandingPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="bg-primary-50 min-h-screen font-sans">
        <Router />
      </div>
    </AuthProvider>
  );
};

const Router: React.FC = () => {
  const { user } = useAuth();

  return (
    <HashRouter>
      <Routes>
        {!user ? (
          <>
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            {/* Redirect any other unauthenticated access to the landing page */}
            <Route path="*" element={<Navigate to="/landing" />} />
          </>
        ) : (
          <Route path="/" element={<MainLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="child/:childId" element={<ChildDetailsPage />} />
            <Route path="users" element={user?.role === Role.Admin ? <UserManagementPage /> : <Navigate to="/" />} />
            <Route path="articles" element={<ArticlesListPage />} />
            <Route path="article/:articleId" element={<ArticleDetailPage />} />
            <Route path="profile" element={<ProfilePage />} />
            {/* Redirect any other authenticated access to the dashboard */}
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        )}
      </Routes>
    </HashRouter>
  );
};

export default App;