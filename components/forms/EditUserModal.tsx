
import React, { useState, useEffect } from 'react';
import { User, Role } from '../../types';
import { dataService } from '../../services/dataService';
import Modal from '../ui/Modal';
import { CardContent, CardFooter } from '../ui/Card';
import Button from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserUpdated: (user: User) => void;
  userToEdit: User;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, onUserUpdated, userToEdit }) => {
  const { user: currentUser } = useAuth();
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>(Role.Warga);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (userToEdit) {
      setName(userToEdit.name);
      setRole(userToEdit.role);
    }
  }, [userToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const updatedUser = await dataService.updateUser(userToEdit.id, { name, role });
      onUserUpdated(updatedUser);
    } catch (error) {
      console.error("Failed to update user", error);
      alert("Gagal memperbarui pengguna.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const canChangeRole = currentUser?.id !== userToEdit.id;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit Pengguna: ${userToEdit.name}`}>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Nama Lengkap</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required 
              className="w-full p-3 border-2 border-slate-200 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-slate-50"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Username</label>
            <input 
              type="text" 
              value={userToEdit.username} 
              disabled 
              className="w-full p-3 border-2 border-slate-200 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Role</label>
            <select 
              value={role} 
              onChange={e => setRole(e.target.value as Role)} 
              required 
              disabled={!canChangeRole}
              className={`w-full p-3 border-2 border-slate-200 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-slate-50 ${!canChangeRole ? 'cursor-not-allowed' : ''}`}
            >
              {Object.values(Role).map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            {!canChangeRole && <p className="text-xs text-slate-500 mt-1">Anda tidak dapat mengubah role Anda sendiri.</p>}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>Batal</Button>
          <Button type="submit" isLoading={isSubmitting}>Simpan Perubahan</Button>
        </CardFooter>
      </form>
    </Modal>
  );
};

export default EditUserModal;
