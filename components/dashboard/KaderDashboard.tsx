
import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Child, User, Role, GrowthStatus, ImmunizationStatus } from '../../types';
import { dataService } from '../../services/dataService';
import Card, { CardContent, CardHeader } from '../ui/Card';
import { ICONS } from '../../constants';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import { calculateAgeInMonths, getGrowthStatus, getImmunizationStatus } from '../../utils/healthUtils';
import KaderFilterModal from './KaderFilterModal';
import { useAuth } from '../../hooks/useAuth';

const AddChildModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onChildAdded: (child: Child) => void;
  wargaList: User[];
}> = ({ isOpen, onClose, onChildAdded, wargaList }) => {
    const [name, setName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [gender, setGender] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
    const [parentId, setParentId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // New demographic fields
    const [nik, setNik] = useState('');
    const [kk, setKk] = useState('');
    const [placeOfBirth, setPlaceOfBirth] = useState('');
    const [fatherName, setFatherName] = useState('');
    const [motherName, setMotherName] = useState('');
    const [address, setAddress] = useState('');


    useEffect(() => {
        if (wargaList.length > 0 && !parentId) {
            setParentId(wargaList[0].id);
        }
    }, [wargaList, parentId]);
    
    const resetForm = () => {
        setName('');
        setDateOfBirth('');
        setGender('Laki-laki');
        if (wargaList.length > 0) setParentId(wargaList[0].id);
        setNik('');
        setKk('');
        setPlaceOfBirth('');
        setFatherName('');
        setMotherName('');
        setAddress('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const newChildData = { name, dateOfBirth, gender, parentId, nik, kk, placeOfBirth, fatherName, motherName, address };
            const newChild = await dataService.addChild(newChildData);
            onChildAdded(newChild);
            resetForm();
        } catch (error) {
            console.error("Failed to add child", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Tambah Data Anak Baru">
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4 max-h-[70vh] overflow-y-auto">
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nama Lengkap Anak" required className="w-full p-3 border-2 border-slate-200 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-slate-50"/>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input type="text" value={placeOfBirth} onChange={e => setPlaceOfBirth(e.target.value)} placeholder="Tempat Lahir" required className="w-full p-3 border-2 border-slate-200 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-slate-50"/>
                        <input type="date" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} placeholder="Tanggal Lahir" required className="w-full p-3 border-2 border-slate-200 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-slate-50"/>
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input type="text" value={nik} onChange={e => setNik(e.target.value)} placeholder="NIK Anak" required className="w-full p-3 border-2 border-slate-200 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-slate-50"/>
                        <input type="text" value={kk} onChange={e => setKk(e.target.value)} placeholder="No. Kartu Keluarga" required className="w-full p-3 border-2 border-slate-200 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-slate-50"/>
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input type="text" value={fatherName} onChange={e => setFatherName(e.target.value)} placeholder="Nama Ayah" required className="w-full p-3 border-2 border-slate-200 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-slate-50"/>
                        <input type="text" value={motherName} onChange={e => setMotherName(e.target.value)} placeholder="Nama Ibu" required className="w-full p-3 border-2 border-slate-200 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-slate-50"/>
                    </div>
                    <select value={gender} onChange={e => setGender(e.target.value as any)} required className="w-full p-3 border-2 border-slate-200 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-slate-50">
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                    </select>
                    <select value={parentId} onChange={e => setParentId(e.target.value)} required className="w-full p-3 border-2 border-slate-200 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-slate-50">
                        <option value="" disabled>Pilih Orang Tua (Warga)</option>
                        {wargaList.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                    </select>
                    <textarea value={address} onChange={e => setAddress(e.target.value)} placeholder="Alamat Lengkap" required rows={3} className="w-full p-3 border-2 border-slate-200 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-slate-50"/>
                </CardContent>
                <CardContent className="flex justify-end gap-2">
                    <Button type="button" variant="ghost" onClick={onClose}>Batal</Button>
                    <Button type="submit" isLoading={isSubmitting}>Simpan Data</Button>
                </CardContent>
            </form>
        </Modal>
    )
}

const GrowthStatusBadge: React.FC<{status: GrowthStatus}> = ({status}) => {
    const statusStyles: Record<GrowthStatus, string> = {
        [GrowthStatus.Unknown]: 'bg-slate-200 text-slate-700',
        [GrowthStatus.SevereUnderweight]: 'bg-red-200 text-red-800 animate-pulse',
        [GrowthStatus.Underweight]: 'bg-yellow-200 text-yellow-800',
        [GrowthStatus.Good]: 'bg-green-200 text-green-800',
        [GrowthStatus.OverweightRisk]: 'bg-orange-200 text-orange-800',
    }
    if (status === GrowthStatus.Unknown) return null;

    return (
        <span className={`px-2 py-1 text-xs font-bold rounded-full ${statusStyles[status]}`}>
            {status}
        </span>
    )
}

const KaderDashboard: React.FC = () => {
  const { user } = useAuth();
  const [children, setChildren] = useState<Child[]>([]);
  const [wargaUsers, setWargaUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddChildModalOpen, setIsAddChildModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<{
      ageRange: [number, number] | null;
      growthStatus: GrowthStatus | null;
      immunizationStatus: ImmunizationStatus | null;
  }>({ ageRange: null, growthStatus: null, immunizationStatus: null });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [allChildren, allUsers] = await Promise.all([
          dataService.getAllChildren(),
          dataService.getAllUsers()
      ]);
      setChildren(allChildren);
      setWargaUsers(allUsers.filter(u => u.role === Role.Warga));
      setLoading(false);
    };
    fetchData();
  }, []);
  
  const handleChildAdded = (newChild: Child) => {
      setChildren(prev => [newChild, ...prev]);
      setIsAddChildModalOpen(false);
  }

  const handleDeleteChild = async (childId: string, childName: string) => {
      if (window.confirm(`Apakah Anda yakin ingin menghapus data anak '${childName}'? Semua riwayat pertumbuhan, imunisasi, dan analisis akan ikut terhapus secara permanen.`)) {
          try {
              await dataService.deleteChild(childId);
              setChildren(prev => prev.filter(c => c.id !== childId));
          } catch (error) {
              console.error("Failed to delete child", error);
              alert("Gagal menghapus data anak.");
          }
      }
  };

  const filteredChildren = useMemo(() => {
    return children
        .filter(child => child.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter(child => {
            if (!activeFilters.ageRange && !activeFilters.growthStatus && !activeFilters.immunizationStatus) {
                return true;
            }
            const age = calculateAgeInMonths(child.dateOfBirth);
            const growthStatus = getGrowthStatus(child);
            const immunizationStatus = getImmunizationStatus(child);

            const ageMatch = !activeFilters.ageRange || (age >= activeFilters.ageRange[0] && age <= activeFilters.ageRange[1]);
            const growthMatch = !activeFilters.growthStatus || growthStatus === activeFilters.growthStatus;
            const immunizationMatch = !activeFilters.immunizationStatus || immunizationStatus === activeFilters.immunizationStatus;

            return ageMatch && growthMatch && immunizationMatch;
        });
  }, [children, searchTerm, activeFilters]);

  if (loading) {
    return <div>Loading data anak...</div>;
  }

  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;
  const dashboardTitle = user?.role === Role.Admin ? 'Database Semua Anak' : 'Data Anak Binaan';
  const dashboardSubtitle = user?.role === Role.Admin ? 'Lihat dan kelola semua data anak dalam sistem.' : 'Kelola dan pantau semua anak dalam sistem.';


  return (
    <>
    <AddChildModal 
        isOpen={isAddChildModalOpen}
        onClose={() => setIsAddChildModalOpen(false)}
        onChildAdded={handleChildAdded}
        wargaList={wargaUsers}
    />
    <KaderFilterModal 
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={setActiveFilters}
        currentFilters={activeFilters}
    />
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
                <h2 className="text-xl font-bold text-slate-800">{dashboardTitle}</h2>
                <p className="text-slate-500 text-sm mt-1">{dashboardSubtitle}</p>
            </div>
            <Button onClick={() => setIsAddChildModalOpen(true)}>+ Tambah Anak</Button>
        </div>
        <div className="mt-6 flex flex-col md:flex-row gap-2">
            <input 
                type="text"
                placeholder="Cari nama anak..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full md:flex-grow p-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
             <Button variant="ghost" onClick={() => setIsFilterModalOpen(true)} className="md:w-auto relative">
                <ICONS.filter className="w-5 h-5 mr-2"/>
                Filter
                {activeFilterCount > 0 && 
                    <span className="absolute -top-1 -right-1 flex h-5 w-5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-5 w-5 bg-primary-500 text-white text-xs items-center justify-center">{activeFilterCount}</span>
                    </span>
                }
            </Button>
        </div>
      </CardHeader>
      <div className="overflow-x-auto p-2">
            <table className="min-w-full">
                <thead>
                    <tr className="border-b-2 border-slate-100">
                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Anak</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Usia</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status Gizi</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                {filteredChildren.map((child, index) => {
                  return (
                    <tr key={child.id} className={`transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-primary-50/50'}`}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">{child.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">{calculateAgeInMonths(child.dateOfBirth)} bulan</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium"><GrowthStatusBadge status={getGrowthStatus(child)} /></td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button as={Link} to={`/child/${child.id}`} size="sm" variant="ghost">
                                Lihat Detail
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="!text-red-500 hover:!bg-red-100"
                                onClick={() => handleDeleteChild(child.id, child.name)}
                                title="Hapus data anak"
                            >
                                <ICONS.trash className="w-4 h-4" />
                            </Button>
                        </td>
                    </tr>
                  )
                })}
                </tbody>
            </table>
            {filteredChildren.length === 0 && <p className="text-center py-8 text-slate-500">Tidak ada data anak yang sesuai dengan filter.</p>}
        </div>
    </Card>
    </>
  );
};

export default KaderDashboard;
