

import React, { useEffect, useState } from 'react';
import { User, Role } from '../types';
import { dataService } from '../services/dataService';
import Card, { CardContent, CardHeader, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import EditUserModal from '../components/forms/EditUserModal';

const AddUserModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onUserAdded: (user: User) => void;
}> = ({ isOpen, onClose, onUserAdded }) => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [role, setRole] = useState<Role>(Role.Warga);
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // In a real app, password would be hashed. Here we just ignore it after submission.
            const newUser = await dataService.addUser({ name, username, role });
            onUserAdded(newUser);
            // Reset form
            setName('');
            setUsername('');
            setRole(Role.Warga);
            setPassword('');
            onClose();
        } catch(error) {
            console.error("Failed to add user", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Tambah Pengguna Baru">
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nama Lengkap" required className="w-full p-3 border-2 border-slate-200 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-slate-50"/>
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required className="w-full p-3 border-2 border-slate-200 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-slate-50"/>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password (default: 123)" required className="w-full p-3 border-2 border-slate-200 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-slate-50"/>
                    <select value={role} onChange={e => setRole(e.target.value as Role)} required className="w-full p-3 border-2 border-slate-200 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-slate-50">
                        {Object.values(Role).map(r => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    <Button type="button" variant="ghost" onClick={onClose}>Batal</Button>
                    <Button type="submit" isLoading={isSubmitting}>Simpan Pengguna</Button>
                </CardFooter>
            </form>
        </Modal>
    );
};


const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const allUsers = await dataService.getAllUsers();
      setUsers(allUsers);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const handleUserAdded = (newUser: User) => {
      setUsers(prev => [newUser, ...prev].sort((a,b) => a.name.localeCompare(b.name)));
      setIsAddUserModalOpen(false);
  }

  const handleOpenEditModal = (user: User) => {
      setEditingUser(user);
      setIsEditUserModalOpen(true);
  }
  
  const handleUserUpdated = (updatedUser: User) => {
      setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
      setIsEditUserModalOpen(false);
      setEditingUser(null);
  }

  const getRoleBadgeColor = (role: string) => {
    switch(role) {
      case 'Admin': return 'bg-red-200 text-red-800';
      case 'Kader': return 'bg-secondary-200 text-yellow-800';
      case 'Warga': return 'bg-green-200 text-green-800';
      default: return 'bg-slate-200 text-slate-800';
    }
  }

  return (
    <>
    <AddUserModal isOpen={isAddUserModalOpen} onClose={() => setIsAddUserModalOpen(false)} onUserAdded={handleUserAdded}/>
    {editingUser && (
        <EditUserModal
            isOpen={isEditUserModalOpen}
            onClose={() => setIsEditUserModalOpen(false)}
            onUserUpdated={handleUserUpdated}
            userToEdit={editingUser}
        />
    )}
    <div className="space-y-6">
       <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800">Manajemen Pengguna</h1>
                <p className="text-base md:text-lg text-slate-500">Kelola semua pengguna dalam sistem.</p>
            </div>
            <Button onClick={() => setIsAddUserModalOpen(true)} className="w-full sm:w-auto">
                + Tambah Pengguna
            </Button>
       </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold text-slate-800">Daftar Semua Pengguna</h2>
        </CardHeader>
        <div className="overflow-x-auto p-2">
            {loading ? <p className="p-6">Memuat data pengguna...</p> : (
                    <table className="min-w-full">
                        <thead>
                        <tr className="border-b-2 border-slate-100">
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Nama</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Username</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((user, index) => (
                            <tr key={user.id} className={`transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-primary-50/50'}`}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">{user.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">{user.username}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                <span className={`font-bold px-3 py-1 rounded-full text-xs ${getRoleBadgeColor(user.role)}`}>{user.role}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Button variant="ghost" size="sm" onClick={() => handleOpenEditModal(user)}>
                                    Edit
                                </Button>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
            )}
        </div>
      </Card>
    </div>
    </>
  );
};

export default UserManagementPage;