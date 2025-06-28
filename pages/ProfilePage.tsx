import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { dataService } from '../services/dataService';
import Card, { CardHeader, CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ICONS } from '../constants';
import { User } from '../types';

const ProfilePage: React.FC = () => {
    const { user: authUser, login } = useAuth();
    const [user, setUser] = useState<User | null>(null);
    
    // States for profile form
    const [name, setName] = useState('');
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });

    // States for password form
    const [password, setPassword] = useState({ newPassword: '', confirmPassword: '' });
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });


    useEffect(() => {
        if (authUser) {
            setUser(authUser);
            setName(authUser.name);
        }
    }, [authUser]);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !name.trim()) return;

        setProfileLoading(true);
        setProfileMessage({type: '', text: ''});

        try {
            await dataService.updateUser(user.id, { name });
            // Refresh user context in AuthProvider after update
            await login(user.username);
            setProfileMessage({type: 'success', text: 'Profil berhasil diperbarui!'});
        } catch (error) {
            console.error(error);
            setProfileMessage({type: 'error', text: 'Gagal memperbarui profil.'});
        } finally {
            setProfileLoading(false);
        }
    };
    
    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !password.newPassword) return;

        if(password.newPassword !== password.confirmPassword) {
            setPasswordMessage({type: 'error', text: 'Konfirmasi password tidak cocok.'});
            return;
        }

        setPasswordLoading(true);
        setPasswordMessage({type: '', text: ''});
        
        try {
            await dataService.updateUser(user.id, { password: password.newPassword });
            setPasswordMessage({type: 'success', text: 'Password berhasil diubah!'});
            setPassword({newPassword: '', confirmPassword: ''});
        } catch (error) {
            console.error(error);
            setPasswordMessage({type: 'error', text: 'Gagal mengubah password.'});
        } finally {
            setPasswordLoading(false);
        }
    };
    
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPassword(prev => ({ ...prev, [name]: value }));
    }

    if (!user) {
        return <div className="text-center">Memuat data pengguna...</div>;
    }

    return (
        <div className="space-y-8">
             <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800">Profil Saya</h1>
                <p className="text-base md:text-lg text-slate-500">Kelola informasi akun Anda di sini.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Profile Details Form */}
                <Card>
                    <form onSubmit={handleProfileUpdate}>
                        <CardHeader>
                            <h2 className="text-xl font-bold text-slate-800">Informasi Pribadi</h2>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             {profileMessage.text && (
                                <div className={`p-3 rounded-lg text-sm font-semibold text-center ${profileMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {profileMessage.text}
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Nama Lengkap</label>
                                <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full p-3 border-2 border-slate-200 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-slate-50"/>
                            </div>
                             <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Username</label>
                                <input type="text" value={user.username} disabled className="w-full p-3 border-2 border-slate-200 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed"/>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Role</label>
                                <input type="text" value={user.role} disabled className="w-full p-3 border-2 border-slate-200 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed"/>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <Button type="submit" isLoading={profileLoading}>Simpan Perubahan</Button>
                        </CardFooter>
                    </form>
                </Card>

                {/* Change Password Form */}
                <Card>
                    <form onSubmit={handlePasswordUpdate}>
                        <CardHeader>
                            <h2 className="text-xl font-bold text-slate-800">Ubah Password</h2>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             {passwordMessage.text && (
                                <div className={`p-3 rounded-lg text-sm font-semibold text-center ${passwordMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {passwordMessage.text}
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Password Baru</label>
                                <input name="newPassword" type="password" value={password.newPassword} onChange={handlePasswordChange} required className="w-full p-3 border-2 border-slate-200 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-slate-50"/>
                            </div>
                             <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Konfirmasi Password Baru</label>
                                <input name="confirmPassword" type="password" value={password.confirmPassword} onChange={handlePasswordChange} required className="w-full p-3 border-2 border-slate-200 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-slate-50"/>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <Button type="submit" isLoading={passwordLoading}>Ubah Password</Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default ProfilePage;
