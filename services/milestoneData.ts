import { Milestone, MilestoneCategory } from '../types';

export const ALL_MILESTONES: Milestone[] = [
    // Gross Motor
    { id: 'gm1', category: MilestoneCategory.GrossMotor, description: 'Mengangkat kepala saat tengkurap', ageRangeMonths: [0, 2] },
    { id: 'gm2', category: MilestoneCategory.GrossMotor, description: 'Duduk tanpa bantuan', ageRangeMonths: [5, 7] },
    { id: 'gm3', category: MilestoneCategory.GrossMotor, description: 'Merangkak', ageRangeMonths: [7, 10] },
    { id: 'gm4', category: MilestoneCategory.GrossMotor, description: 'Berdiri dengan berpegangan', ageRangeMonths: [8, 10] },
    { id: 'gm5', category: MilestoneCategory.GrossMotor, description: 'Berjalan beberapa langkah tanpa bantuan', ageRangeMonths: [11, 13] },
    { id: 'gm6', category: MilestoneCategory.GrossMotor, description: 'Berlari', ageRangeMonths: [18, 24] },
    
    // Fine Motor
    { id: 'fm1', category: MilestoneCategory.FineMotor, description: 'Menggenggam jari', ageRangeMonths: [0, 2] },
    { id: 'fm2', category: MilestoneCategory.FineMotor, description: 'Memindahkan benda dari satu tangan ke tangan lain', ageRangeMonths: [5, 7] },
    { id: 'fm3', category: MilestoneCategory.FineMotor, description: 'Menjumput benda kecil (cubit)', ageRangeMonths: [8, 10] },
    { id: 'fm4', category: MilestoneCategory.FineMotor, description: 'Mencoret-coret dengan krayon', ageRangeMonths: [12, 15] },
    { id: 'fm5', category: MilestoneCategory.FineMotor, description: 'Membangun menara dari 2-3 balok', ageRangeMonths: [15, 18] },

    // Social & Emotional
    { id: 'se1', category: MilestoneCategory.SocialEmotional, description: 'Tersenyum sosial (membalas senyuman)', ageRangeMonths: [1, 3] },
    { id: 'se2', category: MilestoneCategory.SocialEmotional, description: 'Tertawa', ageRangeMonths: [3, 5] },
    { id: 'se3', category: MilestoneCategory.SocialEmotional, description: 'Menunjukkan kecemasan pada orang asing', ageRangeMonths: [7, 9] },
    { id: 'se4', category: MilestoneCategory.SocialEmotional, description: 'Melambaikan tangan "bye-bye"', ageRangeMonths: [9, 12] },
    { id: 'se5', category: MilestoneCategory.SocialEmotional, description: 'Meniru perilaku orang dewasa', ageRangeMonths: [18, 24] },

    // Language & Communication
    { id: 'lc1', category: MilestoneCategory.LanguageCommunication, description: 'Mengeluarkan suara "ooh" dan "aah"', ageRangeMonths: [1, 3] },
    { id: 'lc2', category: MilestoneCategory.LanguageCommunication, description: 'Mengoceh (babbling)', ageRangeMonths: [4, 7] },
    { id: 'lc3', category: MilestoneCategory.LanguageCommunication, description: 'Mengucapkan "mama" atau "dada" tanpa arti spesifik', ageRangeMonths: [7, 10] },
    { id: 'lc4', category: MilestoneCategory.LanguageCommunication, description: 'Menunjuk benda yang diinginkan', ageRangeMonths: [10, 12] },
    { id: 'lc5', category: MilestoneCategory.LanguageCommunication, description: 'Mengucapkan 1-3 kata selain mama/dada', ageRangeMonths: [12, 15] },
    { id: 'lc6', category: MilestoneCategory.LanguageCommunication, description: 'Menyebut beberapa bagian tubuh', ageRangeMonths: [18, 24] },
];
