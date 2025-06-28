export enum Role {
  Admin = 'Admin',
  Kader = 'Kader',
  Warga = 'Warga',
}

export interface User {
  id: string;
  name: string;
  username: string;
  role: Role;
  password?: string;
}

export interface Immunization {
    id: string;
    childId: string;
    name: string; // e.g., BCG, Polio 1, DPT-HB-Hib 1
    date: string; // YYYY-MM-DD
    notes?: string;
}

export interface GrowthRecord {
  id: string;
  date: string; // YYYY-MM-DD
  ageInMonths: number;
  weight: number; // in kg
  height: number; // in cm
  headCircumference: number; // in cm
  notes?: string;
}

export interface AnalysisRecord {
  id: string;
  childId: string;
  kaderId: string;
  kaderName: string;
  date: string; // YYYY-MM-DD
  analysisText: string;
}

export interface MilestoneRecord {
    milestoneId: string;
    achievedDate: string; // YYYY-MM-DD
    notes?: string;
}


export interface Child {
  id: string;
  name: string;
  dateOfBirth: string; // YYYY-MM-DD
  placeOfBirth: string;
  gender: 'Laki-laki' | 'Perempuan';
  nik: string;
  kk: string;
  address: string;
  fatherName: string;
  motherName: string;
  parentId: string;
  growthHistory: GrowthRecord[];
  analysisHistory: AnalysisRecord[];
  immunizationHistory: Immunization[];
  milestoneHistory: MilestoneRecord[];
}

// --- New Types for Professional Features ---

export interface ImmunizationScheduleItem {
  name: string;
  dueAgeMonths: number; // age in months when it's due
  description: string;
}

export interface WhoGrowthStandard {
  month: number;
  p3: number;
  p15: number;
  p50: number;
  p85: number;
  p97: number;
}

export enum MilestoneCategory {
    GrossMotor = 'Motorik Kasar',
    FineMotor = 'Motorik Halus',
    SocialEmotional = 'Sosial & Emosional',
    LanguageCommunication = 'Bahasa & Komunikasi',
}

export interface Milestone {
    id: string;
    category: MilestoneCategory;
    description: string;
    ageRangeMonths: [number, number]; // e.g., [2, 4] for 2-4 months
}

// --- New Types for Announcement & Education Feature ---
export enum ArticleCategory {
  Announcement = 'Pengumuman',
  Nutrition = 'Gizi',
  Development = 'Perkembangan',
  Health = 'Kesehatan Umum',
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string; // Markdown or simple text
  imageUrl: string;
  authorId: string;
  authorName: string;
  authorRole: Role;
  publishedDate: string; // YYYY-MM-DD
  category: ArticleCategory;
}

// --- New Types for Advanced Filtering & Status ---
export enum GrowthStatus {
  Unknown = 'Tidak Diketahui',
  SevereUnderweight = 'Gizi Buruk',
  Underweight = 'Gizi Kurang',
  Good = 'Gizi Baik',
  OverweightRisk = 'Risiko Gizi Lebih'
}

export enum ImmunizationStatus {
    Complete = 'Lengkap',
    Incomplete = 'Tidak Lengkap',
}

// --- New Types for Notifications ---
export enum NotificationType {
  NewAnalysis = 'ANALISIS_BARU',
  NewGrowthRecord = 'CATATAN_PERTUMBUHAN_BARU',
  NewMilestone = 'PENCAPAIAN_BARU',
  NewArticle = 'ARTIKEL_BARU',
}

export interface Notification {
  id: string;
  userId: string; // The user who should receive the notification
  type: NotificationType;
  title: string;
  message: string;
  link: string; // e.g., /child/child1 or /article/article2
  isRead: boolean;
  createdAt: string; // ISO date string
}