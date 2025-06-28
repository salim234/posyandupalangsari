import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import { ICONS } from '../constants';
import Card, { CardHeader, CardContent, CardFooter } from '../components/ui/Card';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const user = await login(username);
    if (user) {
      navigate('/');
    } else {
      setError('Username atau password salah. Coba: admin, kader1, warga1 (pass: 123)');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-50 p-4">
       <div className="w-full max-w-6xl mx-auto">
        <Card className="grid md:grid-cols-2 overflow-hidden shadow-2xl shadow-primary-100/80">
            <div className="p-8 md:p-12 order-2 md:order-1">
                <div className="flex items-center gap-3 mb-8 text-primary-600">
                    <div className="w-12 h-12 text-primary-500"><ICONS.logo /></div>
                    <h1 className="text-3xl font-extrabold tracking-tight">KIA Digital</h1>
                </div>
                
                <h2 className="text-4xl font-extrabold text-slate-800">Selamat Datang!</h2>
                <p className="text-slate-500 mt-2">Pantau tumbuh kembang si kecil dengan ceria.</p>

                <form onSubmit={handleSubmit} className="mt-8">
                    <div className="space-y-5">
                        {error && <p className="text-red-600 text-sm text-center bg-red-100 p-3 rounded-lg font-semibold">{error}</p>}
                        <div>
                            <label htmlFor="username" className="block text-sm font-bold text-slate-700 mb-1">Username</label>
                            <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-1 block w-full px-4 py-3 bg-primary-100/50 border-2 border-transparent rounded-lg placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:bg-white"
                            placeholder="e.g. kader1"
                            required
                            />
                        </div>
                        <div>
                            <label htmlFor="password"className="block text-sm font-bold text-slate-700 mb-1">Password</label>
                            <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-4 py-3 bg-primary-100/50 border-2 border-transparent rounded-lg placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:bg-white"
                            placeholder="Default: 123"
                            required
                            />
                        </div>
                    </div>
                     <div className="mt-8">
                        <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
                            Masuk Sekarang
                        </Button>
                    </div>
                </form>
            </div>
            <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-primary-200 to-secondary-200 p-12 order-1 md:order-2">
                 <div className="w-full h-full max-w-md">
                    <ICONS.loginIllustration />
                 </div>
            </div>
        </Card>
         <p className="text-center text-sm text-slate-500 mt-8">
                © 2024 Posyandu Desa Palangsari Puspo. All rights reserved.
            </p>
       </div>
    </div>
  );
};

export default LoginPage;