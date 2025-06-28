import React, { useState } from 'react';
import { GrowthStatus, ImmunizationStatus } from '../../types';
import Modal from '../ui/Modal';
import { CardContent, CardFooter } from '../ui/Card';
import Button from '../ui/Button';

interface KaderFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: {
    ageRange: [number, number] | null;
    growthStatus: GrowthStatus | null;
    immunizationStatus: ImmunizationStatus | null;
  }) => void;
  currentFilters: {
    ageRange: [number, number] | null;
    growthStatus: GrowthStatus | null;
    immunizationStatus: ImmunizationStatus | null;
  };
}

const KaderFilterModal: React.FC<KaderFilterModalProps> = ({ isOpen, onClose, onApplyFilters, currentFilters }) => {
  const [ageRange, setAgeRange] = useState<string>(currentFilters.ageRange ? currentFilters.ageRange.join('-') : '');
  const [growthStatus, setGrowthStatus] = useState<GrowthStatus | ''>(currentFilters.growthStatus || '');
  const [immunizationStatus, setImmunizationStatus] = useState<ImmunizationStatus | ''>(currentFilters.immunizationStatus || '');

  const handleApply = () => {
    const ageRangeValue = ageRange ? ageRange.split('-').map(Number) as [number, number] : null;
    onApplyFilters({
      ageRange: ageRangeValue,
      growthStatus: growthStatus || null,
      immunizationStatus: immunizationStatus || null
    });
    onClose();
  };
  
  const handleReset = () => {
    setAgeRange('');
    setGrowthStatus('');
    setImmunizationStatus('');
    onApplyFilters({
      ageRange: null,
      growthStatus: null,
      immunizationStatus: null
    });
    onClose();
  }

  const ageRanges = {
      '0-6': 'Bayi (0-6 bulan)',
      '7-12': 'Bayi (7-12 bulan)',
      '13-24': 'Batita (1-2 tahun)',
      '25-60': 'Balita (2-5 tahun)',
  };

  const FilterSection: React.FC<{title: string; children: React.ReactNode}> = ({ title, children }) => (
      <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">{title}</label>
          {children}
      </div>
  )

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Filter Data Anak">
      <CardContent className="space-y-6">
        <FilterSection title="Kelompok Usia">
          <select value={ageRange} onChange={e => setAgeRange(e.target.value)} className="w-full p-3 border-2 border-slate-200 rounded-lg bg-slate-50">
            <option value="">Semua Umur</option>
            {Object.entries(ageRanges).map(([key, value]) => <option key={key} value={key}>{value}</option>)}
          </select>
        </FilterSection>
        <FilterSection title="Status Gizi">
            <select value={growthStatus} onChange={e => setGrowthStatus(e.target.value as GrowthStatus)} className="w-full p-3 border-2 border-slate-200 rounded-lg bg-slate-50">
                <option value="">Semua Status</option>
                {Object.values(GrowthStatus).filter(s => s !== GrowthStatus.Unknown).map(status => <option key={status} value={status}>{status}</option>)}
            </select>
        </FilterSection>
        <FilterSection title="Status Imunisasi">
            <select value={immunizationStatus} onChange={e => setImmunizationStatus(e.target.value as ImmunizationStatus)} className="w-full p-3 border-2 border-slate-200 rounded-lg bg-slate-50">
                <option value="">Semua Status</option>
                <option value={ImmunizationStatus.Complete}>Lengkap</option>
                <option value={ImmunizationStatus.Incomplete}>Tidak Lengkap</option>
            </select>
        </FilterSection>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" className="!text-red-500" onClick={handleReset}>Reset Filter</Button>
        <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>Batal</Button>
            <Button onClick={handleApply}>Terapkan Filter</Button>
        </div>
      </CardFooter>
    </Modal>
  );
};

export default KaderFilterModal;
