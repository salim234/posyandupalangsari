import React, { useState } from 'react';
import { GrowthRecord } from '../../types';
import { dataService } from '../../services/dataService';
import Modal from '../ui/Modal';
import { CardContent, CardFooter } from '../ui/Card';
import Button from '../ui/Button';

interface AddGrowthRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: GrowthRecord) => void;
  childId: string;
}

const AddGrowthRecordModal: React.FC<AddGrowthRecordModalProps> = ({ isOpen, onClose, onSave, childId }) => {
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [headCircumference, setHeadCircumference] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight || !height || !headCircumference) {
        alert("Semua field harus diisi.");
        return;
    }
    
    setIsSubmitting(true);
    try {
      const newRecord = {
        weight: parseFloat(weight),
        height: parseFloat(height),
        headCircumference: parseFloat(headCircumference),
      };
      const savedRecord = await dataService.addGrowthRecord(childId, newRecord);
      onSave(savedRecord);
      // Reset form
      setWeight('');
      setHeight('');
      setHeadCircumference('');
    } catch (error) {
      console.error("Failed to add growth record:", error);
      alert("Gagal menyimpan data pertumbuhan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const InputField: React.FC<{label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder: string, unit: string}> = ({label, value, onChange, placeholder, unit}) => (
      <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">{label}</label>
          <div className="relative">
              <input
                type="number"
                step="0.1"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required
                className="w-full p-3 pr-12 border-2 border-slate-200 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-slate-50"
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500 font-bold">{unit}</span>
          </div>
      </div>
  )

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tambah Catatan Pertumbuhan">
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <InputField label="Berat Badan" value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 8.5" unit="kg" />
          <InputField label="Tinggi / Panjang Badan" value={height} onChange={e => setHeight(e.target.value)} placeholder="e.g. 70.2" unit="cm" />
          <InputField label="Lingkar Kepala" value={headCircumference} onChange={e => setHeadCircumference(e.target.value)} placeholder="e.g. 45" unit="cm" />
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>Batal</Button>
          <Button type="submit" isLoading={isSubmitting}>Simpan Data</Button>
        </CardFooter>
      </form>
    </Modal>
  );
};

export default AddGrowthRecordModal;
