import { ImmunizationScheduleItem } from '../types';

export const IMMUNIZATION_SCHEDULE: ImmunizationScheduleItem[] = [
    { name: 'Hepatitis B (HB-0)', dueAgeMonths: 0, description: 'Diberikan dalam 24 jam pertama setelah lahir.' },
    { name: 'Polio 0', dueAgeMonths: 0, description: 'Diberikan saat bayi baru lahir sebelum pulang.' },
    { name: 'BCG', dueAgeMonths: 1, description: 'Pencegahan tuberkulosis berat.' },
    { name: 'DPT-HB-Hib 1', dueAgeMonths: 2, description: 'Difteri, Pertusis, Tetanus, Hep B, Haemophilus influenzae tipe b.' },
    { name: 'Polio 1', dueAgeMonths: 2, description: 'Diberikan bersamaan DPT-HB-Hib 1.' },
    { name: 'DPT-HB-Hib 2', dueAgeMonths: 3, description: 'Dosis kedua.' },
    { name: 'Polio 2', dueAgeMonths: 3, description: 'Diberikan bersamaan DPT-HB-Hib 2.' },
    { name: 'DPT-HB-Hib 3', dueAgeMonths: 4, description: 'Dosis ketiga.' },
    { name: 'Polio 3', dueAgeMonths: 4, description: 'Diberikan bersamaan DPT-HB-Hib 3.' },
    { name: 'Campak', dueAgeMonths: 9, description: 'Pencegahan penyakit campak.' },
    { name: 'DPT-HB-Hib Lanjutan', dueAgeMonths: 18, description: 'Dosis penguat (booster).' },
    { name: 'Campak Lanjutan', dueAgeMonths: 24, description: 'Dosis penguat (booster).' },
];
