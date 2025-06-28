import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Child, ImmunizationScheduleItem } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { dataService } from '../../services/dataService';
import { IMMUNIZATION_SCHEDULE } from '../../services/immunizationSchedule';
import { ICONS, IconComponent } from '../../constants';
import Button from '../ui/Button';

const calculateAgeInMonths = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let months = (today.getFullYear() - birthDate.getFullYear()) * 12;
    months -= birthDate.getMonth();
    months += today.getMonth();
    return months <= 0 ? 0 : months;
};

const getNextImmunization = (child: Child): ImmunizationScheduleItem | null => {
    const ageInMonths = calculateAgeInMonths(child.dateOfBirth);
    const completedImmunizations = new Set(child.immunizationHistory.map(i => i.name));
    
    const upcoming = IMMUNIZATION_SCHEDULE
        .filter(item => !completedImmunizations.has(item.name))
        .find(item => item.dueAgeMonths >= ageInMonths);

    return upcoming || null;
}

const StatDisplay: React.FC<{ icon: IconComponent; value: string; label: string; color: string }> = ({ icon: Icon, value, label, color }) => (
    <div className="flex items-center gap-4 p-4 bg-white/60 rounded-2xl">
        <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${color}`}>
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <p className="font-extrabold text-slate-800 text-lg">{value}</p>
            <p className="text-sm text-slate-500 font-medium">{label}</p>
        </div>
    </div>
);


const WargaDashboard: React.FC = () => {
  const { user } = useAuth();
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchChildren = async () => {
        setLoading(true);
        const userChildren = await dataService.getChildrenByParentId(user.id);
        setChildren(userChildren);
        setLoading(false);
      };
      fetchChildren();
    }
  }, [user]);

  if (loading) {
    return <div>Memuat data si kecil...</div>;
  }

  if (children.length === 0) {
    return (
        <div className="w-full max-w-lg mx-auto text-center p-12 bg-white rounded-4xl shadow-lg">
            <div className="w-32 h-32 mx-auto text-primary-400"><ICONS.stork /></div>
            <h3 className="text-2xl font-extrabold text-slate-800 mt-4">Data si kecil belum ada!</h3>
            <p className="text-slate-500 mt-2">Jangan khawatir, hubungi Kader Posyandu untuk mendaftarkan buah hati Anda. Kami siap membantu!</p>
        </div>
    )
  }

  return (
    <div className="space-y-8">
        {children.map(child => {
            const nextImmunization = getNextImmunization(child);
            const lastCheckup = child.growthHistory.length > 0 ? child.growthHistory[child.growthHistory.length - 1] : null;
            
            const gradient = child.gender === 'Laki-laki' 
                ? 'from-blue-100 to-blue-50' 
                : 'from-pink-100 to-red-50';
            const accentText = child.gender === 'Laki-laki' ? 'text-blue-500' : 'text-pink-500';
            const buttonClass = child.gender === 'Laki-laki' ? 'primary' : 'secondary';
            const statColors = {
                weight: child.gender === 'Laki-laki' ? 'bg-blue-200 text-blue-600' : 'bg-pink-200 text-pink-600',
                height: child.gender === 'Laki-laki' ? 'bg-blue-200 text-blue-600' : 'bg-pink-200 text-pink-600',
                head: child.gender === 'Laki-laki' ? 'bg-blue-200 text-blue-600' : 'bg-pink-200 text-pink-600',
            }

            return (
                <div key={child.id} className={`bg-white rounded-4xl shadow-xl shadow-primary-100/80 overflow-hidden`}>
                    {/* --- Child Header --- */}
                    <div className={`p-6 bg-gradient-to-br ${gradient}`}>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <div className="flex-grow">
                                <h2 className="text-3xl font-extrabold text-slate-800">{child.name}</h2>
                                <p className={`${accentText} font-bold text-lg`}>{calculateAgeInMonths(child.dateOfBirth)} bulan</p>
                            </div>
                            <Button as={Link} to={`/child/${child.id}`} className="mt-2 sm:mt-0 !w-full sm:!w-auto">
                                Buku Kesehatan Lengkap
                            </Button>
                        </div>
                    </div>
                    

                    {/* --- Content Area --- */}
                    <div className="p-6">
                        {/* --- Growth Stats --- */}
                        {lastCheckup ? (
                             <>
                             <p className="text-sm font-bold text-slate-500 mb-3">Pemeriksaan Terakhir ({new Date(lastCheckup.date).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}):</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <StatDisplay icon={ICONS.weightScale} value={`${lastCheckup.weight} kg`} label="Berat Badan" color={statColors.weight} />
                                <StatDisplay icon={ICONS.ruler} value={`${lastCheckup.height} cm`} label="Tinggi Badan" color={statColors.height}/>
                                <StatDisplay icon={ICONS.tapeMeasure} value={`${lastCheckup.headCircumference} cm`} label="Lingkar Kepala" color={statColors.head}/>
                            </div>
                            </>
                        ) : (
                            <div className="text-center py-6 px-3 bg-slate-50 rounded-2xl">
                                <p className="text-slate-500 font-medium">Belum ada data pertumbuhan yang dicatat.</p>
                            </div>
                        )}
                        
                        {/* --- Immunization Reminder --- */}
                        {nextImmunization && (
                            <div className="mt-6 bg-secondary-100/70 border-2 border-dashed border-secondary-300/80 p-5 rounded-2xl transform -rotate-1">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 text-secondary-500 animate-bounce"><ICONS.bell /></div>
                                    <div>
                                        <p className="text-sm font-bold text-yellow-800">Pengingat Imunisasi!</p>
                                        <p className="font-bold text-yellow-900">{nextImmunization.name}</p>
                                        <p className="text-sm text-yellow-700 font-medium">(Jadwalnya di usia {nextImmunization.dueAgeMonths} bulan)</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )
        })}
    </div>
  );
};

export default WargaDashboard;