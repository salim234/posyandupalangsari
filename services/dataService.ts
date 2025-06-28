

import { User, Role, Child, GrowthRecord, AnalysisRecord, Immunization, MilestoneRecord, Article, ArticleCategory, Notification, NotificationType } from '../types';
import { ALL_MILESTONES } from './milestoneData';

const DB_KEY = 'kiaDigitalDb';

interface Database {
  users: User[];
  children: Child[];
  articles: Article[];
  notifications: Notification[];
}

const getInitialData = (): Database => ({
    users: [
        { id: 'admin1', name: 'Admin Utama', username: 'admin', role: Role.Admin, password: '123' },
        { id: 'kader1', name: 'Bidan Susi', username: 'kader1', role: Role.Kader, password: '123' },
        { id: 'kader2', name: 'Ibu Wati', username: 'kader2', role: Role.Kader, password: '123' },
        { id: 'warga1', name: 'Ibu Rina', username: 'warga1', role: Role.Warga, password: '123' },
        { id: 'warga2', name: 'Ibu Dewi', username: 'warga2', role: Role.Warga, password: '123' },
    ],
    children: [
        {
          id: 'child1',
          name: 'Budi Hartono',
          dateOfBirth: '2023-01-15',
          placeOfBirth: 'Jakarta',
          gender: 'Laki-laki',
          parentId: 'warga1',
          nik: '3171234567890001',
          kk: '3171234567890000',
          address: 'Jl. Merdeka No. 10, Jakarta Pusat',
          fatherName: 'Bapak Hartono',
          motherName: 'Ibu Rina',
          growthHistory: [
            { id: 'g1', date: '2023-02-15', ageInMonths: 1, weight: 4.5, height: 55, headCircumference: 36 },
            { id: 'g2', date: '2023-03-16', ageInMonths: 2, weight: 5.6, height: 58, headCircumference: 38 },
            { id: 'g3', date: '2023-06-20', ageInMonths: 5, weight: 7.5, height: 66, headCircumference: 42 },
          ],
          analysisHistory: [
            { id: 'a1', childId: 'child1', kaderId: 'kader1', kaderName: 'Bidan Susi', date: '2023-06-20', analysisText: 'Pertumbuhan Budi sangat baik, berat badan sesuai kurva WHO. Lanjutkan ASI eksklusif.' },
          ],
          immunizationHistory: [
             { id: 'i1', childId: 'child1', name: 'Hepatitis B (HB-0)', date: '2023-01-15' },
             { id: 'i2', childId: 'child1', name: 'Polio 0', date: '2023-01-15' },
             { id: 'i3', childId: 'child1', name: 'BCG', date: '2023-02-15' },
          ],
          milestoneHistory: [
            { milestoneId: 'gm1', achievedDate: '2023-03-01' },
            { milestoneId: 'se1', achievedDate: '2023-03-10' },
          ]
        },
        {
          id: 'child2',
          name: 'Cinta Lestari',
          dateOfBirth: '2023-08-05',
          placeOfBirth: 'Surabaya',
          gender: 'Perempuan',
          parentId: 'warga2',
          nik: '3171234567890002',
          kk: '3171234567890003',
          address: 'Jl. Pahlawan No. 5, Surabaya',
          fatherName: 'Bapak Dewo',
          motherName: 'Ibu Dewi',
          growthHistory: [
            { id: 'g4', date: '2023-09-05', ageInMonths: 1, weight: 4.2, height: 53, headCircumference: 35 },
            { id: 'g5', date: '2023-10-06', ageInMonths: 2, weight: 5.1, height: 57, headCircumference: 37 },
          ],
          analysisHistory: [],
          immunizationHistory: [
            { id: 'i4', childId: 'child2', name: 'Hepatitis B (HB-0)', date: '2023-08-05' },
            { id: 'i5', childId: 'child2', name: 'Polio 0', date: '2023-08-05' },
          ],
          milestoneHistory: []
        },
    ],
    articles: [
        {
            id: 'article1',
            title: 'Pentingnya Gizi 1000 Hari Pertama Kehidupan',
            summary: 'Mengapa 1000 hari pertama sangat krusial bagi masa depan anak? Temukan jawabannya di sini.',
            content: 'Periode 1000 Hari Pertama Kehidupan (HPK) adalah periode emas yang dimulai sejak janin dalam kandungan hingga anak berusia dua tahun. Gizi yang optimal pada periode ini sangat penting untuk perkembangan otak, pertumbuhan fisik, dan sistem kekebalan tubuh anak. Kekurangan gizi pada masa ini dapat menyebabkan dampak permanen seperti stunting (tubuh pendek) dan penurunan kecerdasan.\n\nPastikan ibu hamil dan anak mendapatkan asupan gizi seimbang yang kaya akan protein, zat besi, yodium, dan vitamin A.',
            imageUrl: 'https://images.unsplash.com/photo-1542037104-665643689z?q=80&w=1974&auto=format&fit=crop',
            authorId: 'kader1',
            authorName: 'Bidan Susi',
            authorRole: Role.Kader,
            publishedDate: '2024-05-10',
            category: ArticleCategory.Nutrition,
        },
        {
            id: 'article2',
            title: 'Jadwal Posyandu Bulan Juli 2024',
            summary: 'Jangan lewatkan jadwal Posyandu bulan ini untuk penimbangan, imunisasi, dan konsultasi kesehatan.',
            content: 'Diberitahukan kepada seluruh warga, Posyandu Desa Palangsari Puspo akan dilaksanakan pada:\n\nTanggal: Sabtu, 20 Juli 2024\nWaktu: 08.00 - 11.00 WIB\nTempat: Balai Warga RW 05\n\nKegiatan meliputi:\n- Penimbangan berat badan dan pengukuran tinggi badan\n- Imunisasi dasar lengkap\n- Pemberian Vitamin A\n- Konsultasi kesehatan dengan Bidan Susi\n\nMohon untuk membawa buku KIA dan hadir tepat waktu. Terima kasih!',
            imageUrl: 'https://images.unsplash.com/photo-1584931423298-c576fda548c?q=80&w=2070&auto=format&fit=crop',
            authorId: 'admin1',
            authorName: 'Admin Utama',
            authorRole: Role.Admin,
            publishedDate: '2024-07-01',
            category: ArticleCategory.Announcement,
        }
    ],
    notifications: [],
});

let db: Database;

const loadDb = () => {
    try {
        const storedDb = localStorage.getItem(DB_KEY);
        if (storedDb) {
            db = JSON.parse(storedDb);
        } else {
            db = getInitialData();
            localStorage.setItem(DB_KEY, JSON.stringify(db));
        }
    } catch (error) {
        console.error("Failed to load DB from localStorage, using initial data.", error);
        db = getInitialData();
    }
};

const saveDb = () => {
    try {
        localStorage.setItem(DB_KEY, JSON.stringify(db));
    } catch (error) {
        console.error("Failed to save DB to localStorage.", error);
    }
};

// --- Service Implementation ---

// Initialize DB on module load
loadDb();

// --- Notification Functions ---
const createNotification = async (data: Omit<Notification, 'id' | 'isRead' | 'createdAt'>): Promise<Notification> => {
    const newNotification: Notification = {
        id: `notif_${Date.now()}`,
        isRead: false,
        createdAt: new Date().toISOString(),
        ...data,
    };
    db.notifications.unshift(newNotification);
    saveDb();
    return newNotification;
};

const getNotificationsForUser = async (userId: string): Promise<Notification[]> => {
    return db.notifications
        .filter(n => n.userId === userId)
        .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

const markNotificationsAsRead = async (userId: string): Promise<void> => {
    db.notifications.forEach(n => {
        if (n.userId === userId && !n.isRead) {
            n.isRead = true;
        }
    });
    saveDb();
};

// User Functions
const findUserByUsername = async (username: string): Promise<User | null> => {
    return db.users.find(u => u.username.toLowerCase() === username.toLowerCase()) || null;
}
const getAllUsers = async (): Promise<User[]> => {
    return [...db.users];
}
const addUser = async (data: {name: string, username: string, role: Role}): Promise<User> => {
    const newUser: User = {
        id: `user_${Date.now()}`,
        password: '123', // Default password for new users
        ...data
    };
    db.users.push(newUser);
    saveDb();
    return newUser;
}

const getUserById = async (userId: string): Promise<User | null> => {
    return db.users.find(u => u.id === userId) || null;
}

const updateUser = async (userId: string, data: Partial<User>): Promise<User> => {
    const userIndex = db.users.findIndex(u => u.id === userId);
    if (userIndex === -1) throw new Error("User not found");

    const updatedUser = { ...db.users[userIndex], ...data };
    db.users[userIndex] = updatedUser;
    
    saveDb();
    return updatedUser;
}

const deleteUser = async (userId: string): Promise<void> => {
    // Note: We are not deleting associated children to prevent data loss.
    // In a real-world scenario, this might require archiving or reassigning children.
    db.users = db.users.filter(u => u.id !== userId);
    saveDb();
};

// Child Functions
const getAllChildren = async (): Promise<Child[]> => {
    return [...db.children];
}
const getChildrenByParentId = async (parentId: string): Promise<Child[]> => {
    return db.children.filter(c => c.parentId === parentId);
}
const getChildById = async (childId: string): Promise<Child | null> => {
    const child = db.children.find(c => c.id === childId);
    if (!child) return null;
    // Ensure histories are sorted most recent first
    child.growthHistory.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    child.analysisHistory.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return child;
}
const addChild = async (data: Omit<Child, 'id' | 'growthHistory' | 'analysisHistory' | 'immunizationHistory' | 'milestoneHistory'>): Promise<Child> => {
    const newChild: Child = {
        id: `child_${Date.now()}`,
        ...data,
        growthHistory: [],
        analysisHistory: [],
        immunizationHistory: [],
        milestoneHistory: [],
    };
    db.children.unshift(newChild);
    saveDb();
    return newChild;
}

const deleteChild = async (childId: string): Promise<void> => {
    db.children = db.children.filter(c => c.id !== childId);
    saveDb();
};

// Data Record Functions
const addGrowthRecord = async (childId: string, record: {weight: number, height: number, headCircumference: number}): Promise<GrowthRecord> => {
    const childIndex = db.children.findIndex(c => c.id === childId);
    if (childIndex === -1) throw new Error("Child not found");

    const child = db.children[childIndex];
    const birthDate = new Date(child.dateOfBirth);
    const today = new Date();
    let ageInMonths = (today.getFullYear() - birthDate.getFullYear()) * 12;
    ageInMonths -= birthDate.getMonth();
    ageInMonths += today.getMonth();

    const newRecord: GrowthRecord = {
        id: `growth_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        ageInMonths: ageInMonths <= 0 ? 0 : ageInMonths,
        ...record,
    };
    child.growthHistory.push(newRecord);
    
    // Create notification for parent
    await createNotification({
        userId: child.parentId,
        type: NotificationType.NewGrowthRecord,
        title: `Data Pertumbuhan Baru untuk ${child.name}`,
        message: `Berat: ${newRecord.weight}kg, Tinggi: ${newRecord.height}cm`,
        link: `/child/${childId}`
    });
    
    saveDb();
    return newRecord;
}

const deleteGrowthRecord = async (childId: string, recordId: string): Promise<void> => {
    const childIndex = db.children.findIndex(c => c.id === childId);
    if (childIndex === -1) throw new Error("Child not found");
    db.children[childIndex].growthHistory = db.children[childIndex].growthHistory.filter(r => r.id !== recordId);
    saveDb();
};

const addAnalysisRecord = async (childId: string, kader: User, analysisText: string): Promise<AnalysisRecord> => {
    const childIndex = db.children.findIndex(c => c.id === childId);
    if (childIndex === -1) throw new Error("Child not found");
    
    const child = db.children[childIndex];
    const newRecord: AnalysisRecord = {
        id: `analysis_${Date.now()}`,
        childId,
        kaderId: kader.id,
        kaderName: kader.name,
        date: new Date().toISOString().split('T')[0],
        analysisText,
    };
    child.analysisHistory.unshift(newRecord);

    // Create notification for parent
    await createNotification({
        userId: child.parentId,
        type: NotificationType.NewAnalysis,
        title: `Analisis Baru untuk ${child.name}`,
        message: `Oleh ${kader.name}: "${analysisText.substring(0, 50)}..."`,
        link: `/child/${childId}`
    });

    saveDb();
    return newRecord;
}

const addImmunizationRecord = async (childId: string, record: {name: string, date: string}): Promise<Immunization> => {
    const childIndex = db.children.findIndex(c => c.id === childId);
    if (childIndex === -1) throw new Error("Child not found");

    const newRecord: Immunization = {
        id: `imm_${Date.now()}`,
        childId,
        ...record,
    };
    db.children[childIndex].immunizationHistory.push(newRecord);
    saveDb();
    return newRecord;
}

const addMilestoneRecord = async (childId: string, record: MilestoneRecord): Promise<MilestoneRecord> => {
    const childIndex = db.children.findIndex(c => c.id === childId);
    if (childIndex === -1) throw new Error("Child not found");
    
    const child = db.children[childIndex];
    child.milestoneHistory.push(record);

    // Create notification for parent
    const milestoneInfo = ALL_MILESTONES.find(m => m.id === record.milestoneId);
    await createNotification({
        userId: child.parentId,
        type: NotificationType.NewMilestone,
        title: `Selamat! Pencapaian Baru!`,
        message: `${child.name} telah mencapai: ${milestoneInfo?.description || 'milestone baru'}.`,
        link: `/child/${childId}`
    });

    saveDb();
    return record;
}

// Article Functions
const getAllArticles = async(): Promise<Article[]> => {
    return [...db.articles].sort((a,b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
}
const getArticleById = async (articleId: string): Promise<Article | null> => {
    return db.articles.find(a => a.id === articleId) || null;
}

const addArticle = async (data: Omit<Article, 'id' | 'publishedDate' | 'authorName' | 'authorRole'>, author: User): Promise<Article> => {
    const newArticle: Article = {
        id: `article_${Date.now()}`,
        publishedDate: new Date().toISOString().split('T')[0],
        authorName: author.name,
        authorRole: author.role,
        ...data,
    };
    db.articles.unshift(newArticle);
    
    // Notify all Warga and Kader
    const usersToNotify = db.users.filter(u => u.role !== Role.Admin && u.id !== author.id);
    for (const user of usersToNotify) {
        await createNotification({
            userId: user.id,
            type: NotificationType.NewArticle,
            title: `Artikel Baru: ${newArticle.title}`,
            message: `Oleh ${author.name}`,
            link: `/article/${newArticle.id}`
        });
    }

    saveDb();
    return newArticle;
}

const updateArticle = async (articleId: string, data: Partial<Omit<Article, 'id'>>): Promise<Article> => {
    const articleIndex = db.articles.findIndex(a => a.id === articleId);
    if (articleIndex === -1) throw new Error("Article not found");
    db.articles[articleIndex] = { ...db.articles[articleIndex], ...data };
    saveDb();
    return db.articles[articleIndex];
}

const deleteArticle = async (articleId: string): Promise<void> => {
    db.articles = db.articles.filter(a => a.id !== articleId);
    saveDb();
}


// Export all functions as a single object
export const dataService = {
    findUserByUsername,
    getAllUsers,
    addUser,
    getUserById,
    updateUser,
    deleteUser,
    getAllChildren,
    getChildrenByParentId,
    getChildById,
    addChild,
    deleteChild,
    addGrowthRecord,
    deleteGrowthRecord,
    addAnalysisRecord,
    addImmunizationRecord,
    addMilestoneRecord,
    getAllArticles,
    getArticleById,
    addArticle,
    updateArticle,
    deleteArticle,
    getNotificationsForUser,
    markNotificationsAsRead,
};
