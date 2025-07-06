
import { supabase } from './supabaseClient';
import { User, Role, Child, GrowthRecord, AnalysisRecord, Immunization, MilestoneRecord, Article, Notification, NotificationType, ArticleCategory } from '../types';
import { Database } from './database.types';

// Helper to handle Supabase errors
const handleSupabaseError = (error: any, context: string) => {
    if (error) {
        console.error(`Supabase error in ${context}:`, error.message, error);
        throw error;
    }
};

// --- Mappers ---
const toUser = (dbUser: Database['public']['Tables']['users']['Row']): User => ({
    id: dbUser.id,
    name: dbUser.name,
    username: dbUser.username,
    role: dbUser.role as Role,
});

const toNotification = (dbNotification: Database['public']['Tables']['notifications']['Row']): Notification => ({
    id: dbNotification.id,
    userId: dbNotification.user_id,
    type: dbNotification.type as NotificationType,
    title: dbNotification.title,
    message: dbNotification.message,
    link: dbNotification.link,
    isRead: dbNotification.is_read,
    createdAt: dbNotification.created_at,
});

const toChildBase = (dbChild: Database['public']['Tables']['children']['Row']): Omit<Child, 'growthHistory' | 'analysisHistory' | 'immunizationHistory' | 'milestoneHistory'> => ({
    id: dbChild.id,
    name: dbChild.name,
    dateOfBirth: dbChild.date_of_birth,
    placeOfBirth: dbChild.place_of_birth || '',
    gender: dbChild.gender as 'Laki-laki' | 'Perempuan',
    nik: dbChild.nik || '',
    kk: dbChild.kk || '',
    address: dbChild.address || '',
    fatherName: dbChild.father_name || '',
    motherName: dbChild.mother_name || '',
    parentId: dbChild.parent_id,
});

const toGrowthRecord = (dbRecord: Database['public']['Tables']['growth_records']['Row']): GrowthRecord => ({
    id: dbRecord.id,
    date: dbRecord.date,
    ageInMonths: dbRecord.age_in_months,
    weight: dbRecord.weight,
    height: dbRecord.height,
    headCircumference: dbRecord.head_circumference,
    notes: dbRecord.notes || undefined,
});

const toAnalysisRecord = (dbRecord: Database['public']['Tables']['analysis_records']['Row']): AnalysisRecord => ({
    id: dbRecord.id,
    childId: dbRecord.child_id,
    kaderId: dbRecord.kader_id,
    kaderName: dbRecord.kader_name,
    date: dbRecord.date,
    analysisText: dbRecord.analysis_text,
});

const toImmunizationRecord = (dbRecord: Database['public']['Tables']['immunization_records']['Row']): Immunization => ({
    id: dbRecord.id,
    childId: dbRecord.child_id,
    name: dbRecord.name,
    date: dbRecord.date,
    notes: dbRecord.notes || undefined,
});

const toMilestoneRecord = (dbRecord: Database['public']['Tables']['milestone_records']['Row']): MilestoneRecord => ({
    milestoneId: dbRecord.milestone_id,
    achievedDate: dbRecord.achieved_date,
    notes: dbRecord.notes || undefined,
});

const toArticle = (dbArticle: Database['public']['Tables']['articles']['Row']): Article => ({
    id: dbArticle.id,
    title: dbArticle.title,
    summary: dbArticle.summary,
    content: dbArticle.content,
    imageUrl: dbArticle.image_url,
    authorId: dbArticle.author_id || '',
    authorName: dbArticle.author_name,
    authorRole: dbArticle.author_role as Role,
    publishedDate: dbArticle.published_date,
    category: dbArticle.category as ArticleCategory,
});

// --- Notification Functions ---
const createNotification = async (data: Omit<Notification, 'id' | 'isRead' | 'createdAt'>): Promise<Notification> => {
    const { data: newNotification, error } = await supabase
        .from('notifications')
        .insert({
            user_id: data.userId,
            type: data.type,
            title: data.title,
            message: data.message,
            link: data.link,
            is_read: false
        })
        .select()
        .single();
    handleSupabaseError(error, 'createNotification');
    if (!newNotification) throw new Error('Could not create notification.');
    return toNotification(newNotification as unknown as Database['public']['Tables']['notifications']['Row']);
};

const getNotificationsForUser = async (userId: string): Promise<Notification[]> => {
    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
    handleSupabaseError(error, 'getNotificationsForUser');
    const notificationData = data as unknown as Database['public']['Tables']['notifications']['Row'][];
    return notificationData ? notificationData.map(toNotification) : [];
};

const markNotificationsAsRead = async (userId: string): Promise<void> => {
    const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);
    handleSupabaseError(error, 'markNotificationsAsRead');
};


// --- User Functions ---
const findUserByUsername = async (username: string): Promise<User | null> => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username.toLowerCase())
        .single();

    if (error && error.code !== 'PGRST116') { // Ignore "no rows" error
        handleSupabaseError(error, 'findUserByUsername');
    }
    const userData = data as unknown as Database['public']['Tables']['users']['Row'];
    return userData ? toUser(userData) : null;
};

const getAllUsers = async (): Promise<User[]> => {
    const { data, error } = await supabase.from('users').select('*').order('name');
    handleSupabaseError(error, 'getAllUsers');
    const usersData = data as unknown as Database['public']['Tables']['users']['Row'][];
    return usersData ? usersData.map(toUser) : [];
};

const addUser = async (data: { name: string; username: string; role: Role }): Promise<User> => {
    const { data: newUser, error } = await supabase
        .from('users')
        .insert({ ...data, password: '123' })
        .select()
        .single();
    handleSupabaseError(error, 'addUser');
    if (!newUser) throw new Error('Could not add user.');
    return toUser(newUser as unknown as Database['public']['Tables']['users']['Row']);
};

const getUserById = async (userId: string): Promise<User | null> => {
    const { data, error } = await supabase.from('users').select('*').eq('id', userId).single();
    if (error && error.code !== 'PGRST116') {
        handleSupabaseError(error, 'getUserById');
    }
    const userData = data as unknown as Database['public']['Tables']['users']['Row'];
    return userData ? toUser(userData) : null;
};

const updateUser = async (userId: string, data: Partial<User>): Promise<User> => {
    const { data: updatedUser, error } = await supabase
        .from('users')
        .update(data) // Cast to any to bypass strict check, as we know keys match db
        .eq('id', userId)
        .select()
        .single();
    handleSupabaseError(error, 'updateUser');
    if (!updatedUser) throw new Error('Could not update user.');
    return toUser(updatedUser as unknown as Database['public']['Tables']['users']['Row']);
};

const deleteUser = async (userId: string): Promise<void> => {
    const { error } = await supabase.from('users').delete().eq('id', userId);
    handleSupabaseError(error, 'deleteUser');
};


// --- Child Functions ---
const getChildById = async (childId: string): Promise<Child | null> => {
    const { data: child, error: childError } = await supabase.from('children').select('*').eq('id', childId).single();
    if (childError && childError.code !== 'PGRST116') handleSupabaseError(childError, `getChildById (child)`);
    if (!child) return null;

    const [growthRes, analysisRes, immunizationRes, milestoneRes] = await Promise.all([
        supabase.from('growth_records').select('*').eq('child_id', childId).order('date', { ascending: false }),
        supabase.from('analysis_records').select('*').eq('child_id', childId).order('date', { ascending: false }),
        supabase.from('immunization_records').select('*').eq('child_id', childId),
        supabase.from('milestone_records').select('*').eq('child_id', childId)
    ]);

    handleSupabaseError(growthRes.error, 'getChildById (growth)');
    handleSupabaseError(analysisRes.error, 'getChildById (analysis)');
    handleSupabaseError(immunizationRes.error, 'getChildById (immunization)');
    handleSupabaseError(milestoneRes.error, 'getChildById (milestone)');

    const growthData = growthRes.data as unknown as Database['public']['Tables']['growth_records']['Row'][];
    const analysisData = analysisRes.data as unknown as Database['public']['Tables']['analysis_records']['Row'][];
    const immunizationData = immunizationRes.data as unknown as Database['public']['Tables']['immunization_records']['Row'][];
    const milestoneData = milestoneRes.data as unknown as Database['public']['Tables']['milestone_records']['Row'][];

    return {
        ...toChildBase(child as unknown as Database['public']['Tables']['children']['Row']),
        growthHistory: growthData ? growthData.map(toGrowthRecord) : [],
        analysisHistory: analysisData ? analysisData.map(toAnalysisRecord) : [],
        immunizationHistory: immunizationData ? immunizationData.map(toImmunizationRecord) : [],
        milestoneHistory: milestoneData ? milestoneData.map(toMilestoneRecord) : [],
    };
};

const fetchAndCombineChildData = async (childrenData: Database['public']['Tables']['children']['Row'][]): Promise<Child[]> => {
    if (!childrenData || childrenData.length === 0) return [];
    
    const childIds = childrenData.map(c => c.id);
    const [growthRes, analysisRes, immunizationRes, milestoneRes] = await Promise.all([
        supabase.from('growth_records').select('*').in('child_id', childIds),
        supabase.from('analysis_records').select('*').in('child_id', childIds),
        supabase.from('immunization_records').select('*').in('child_id', childIds),
        supabase.from('milestone_records').select('*').in('child_id', childIds)
    ]);

    handleSupabaseError(growthRes.error, 'fetchAndCombineChildData (growth)');
    handleSupabaseError(analysisRes.error, 'fetchAndCombineChildData (analysis)');
    handleSupabaseError(immunizationRes.error, 'fetchAndCombineChildData (immunization)');
    handleSupabaseError(milestoneRes.error, 'fetchAndCombineChildData (milestone)');

    const growthData = growthRes.data as unknown as Database['public']['Tables']['growth_records']['Row'][];
    const analysisData = analysisRes.data as unknown as Database['public']['Tables']['analysis_records']['Row'][];
    const immunizationData = immunizationRes.data as unknown as Database['public']['Tables']['immunization_records']['Row'][];
    const milestoneData = milestoneRes.data as unknown as Database['public']['Tables']['milestone_records']['Row'][];


    const growthByChild = (growthData || []).reduce((acc, r) => { (acc[r.child_id] = acc[r.child_id] || []).push(toGrowthRecord(r)); return acc; }, {} as Record<string, GrowthRecord[]>);
    const analysisByChild = (analysisData || []).reduce((acc, r) => { (acc[r.child_id] = acc[r.child_id] || []).push(toAnalysisRecord(r)); return acc; }, {} as Record<string, AnalysisRecord[]>);
    const immunizationByChild = (immunizationData || []).reduce((acc, r) => { (acc[r.child_id] = acc[r.child_id] || []).push(toImmunizationRecord(r)); return acc; }, {} as Record<string, Immunization[]>);
    const milestoneByChild = (milestoneData || []).reduce((acc, r) => { (acc[r.child_id] = acc[r.child_id] || []).push(toMilestoneRecord(r)); return acc; }, {} as Record<string, MilestoneRecord[]>);

    return childrenData.map(dbChild => {
        const id = dbChild.id;
        return {
            ...toChildBase(dbChild),
            growthHistory: (growthByChild[id] || []).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
            analysisHistory: (analysisByChild[id] || []).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
            immunizationHistory: immunizationByChild[id] || [],
            milestoneHistory: milestoneByChild[id] || [],
        };
    });
}

const getAllChildren = async (): Promise<Child[]> => {
    const { data, error } = await supabase.from('children').select('*').order('name');
    handleSupabaseError(error, 'getAllChildren');
    const childrenData = data as unknown as Database['public']['Tables']['children']['Row'][];
    return fetchAndCombineChildData(childrenData || []);
};

const getChildrenByParentId = async (parentId: string): Promise<Child[]> => {
    const { data, error } = await supabase.from('children').select('*').eq('parent_id', parentId).order('name');
    handleSupabaseError(error, 'getChildrenByParentId');
    const childrenData = data as unknown as Database['public']['Tables']['children']['Row'][];
    return fetchAndCombineChildData(childrenData || []);
};


const addChild = async (data: Omit<Child, 'id' | 'growthHistory' | 'analysisHistory' | 'immunizationHistory' | 'milestoneHistory'>): Promise<Child> => {
    const { data: newChild, error } = await supabase.from('children').insert({
        name: data.name,
        date_of_birth: data.dateOfBirth,
        place_of_birth: data.placeOfBirth,
        gender: data.gender,
        nik: data.nik,
        kk: data.kk,
        address: data.address,
        father_name: data.fatherName,
        mother_name: data.motherName,
        parent_id: data.parentId
    }).select().single();

    handleSupabaseError(error, 'addChild');
    if (!newChild) throw new Error('Could not add child.');
    return { ...toChildBase(newChild as unknown as Database['public']['Tables']['children']['Row']), growthHistory: [], analysisHistory: [], immunizationHistory: [], milestoneHistory: [] };
};

const deleteChild = async (childId: string): Promise<void> => {
    // Assuming DB has CASCADE delete setup for related records
    const { error } = await supabase.from('children').delete().eq('id', childId);
    handleSupabaseError(error, 'deleteChild');
};


// --- Data Record Functions ---
const addGrowthRecord = async (childId: string, record: { weight: number; height: number; headCircumference: number }): Promise<GrowthRecord> => {
    const child = await getChildById(childId);
    if (!child) throw new Error("Child not found for growth record");

    const birthDate = new Date(child.dateOfBirth);
    const today = new Date();
    let ageInMonths = (today.getFullYear() - birthDate.getFullYear()) * 12;
    ageInMonths -= birthDate.getMonth();
    ageInMonths += today.getMonth();

    const { data: newRecord, error } = await supabase.from('growth_records').insert({
      child_id: childId,
      date: new Date().toISOString().split('T')[0],
      age_in_months: ageInMonths <= 0 ? 0 : ageInMonths,
      weight: record.weight,
      height: record.height,
      head_circumference: record.headCircumference
    }).select().single();

    handleSupabaseError(error, 'addGrowthRecord');
    if (!newRecord) throw new Error('Could not add growth record.');

    const savedRecord = toGrowthRecord(newRecord as unknown as Database['public']['Tables']['growth_records']['Row']);

    await createNotification({
        userId: child.parentId,
        type: NotificationType.NewGrowthRecord,
        title: `Data Pertumbuhan Baru untuk ${child.name}`,
        message: `Berat: ${savedRecord.weight}kg, Tinggi: ${savedRecord.height}cm`,
        link: `/child/${childId}`
    });

    return savedRecord;
};

const deleteGrowthRecord = async (childId: string, recordId: string): Promise<void> => {
    const { error } = await supabase.from('growth_records').delete().eq('id', recordId);
    handleSupabaseError(error, 'deleteGrowthRecord');
};

const addAnalysisRecord = async (childId: string, kader: User, analysisText: string): Promise<AnalysisRecord> => {
    const child = await getChildById(childId);
    if (!child) throw new Error("Child not found for analysis record");
    
    const { data: newRecord, error } = await supabase.from('analysis_records').insert({
      child_id: childId,
      kader_id: kader.id,
      kader_name: kader.name,
      date: new Date().toISOString().split('T')[0],
      analysis_text: analysisText,
    }).select().single();
    handleSupabaseError(error, 'addAnalysisRecord');
    if (!newRecord) throw new Error('Could not add analysis record.');
    
    const savedRecord = toAnalysisRecord(newRecord as unknown as Database['public']['Tables']['analysis_records']['Row']);

    await createNotification({
        userId: child.parentId,
        type: NotificationType.NewAnalysis,
        title: `Analisis Baru untuk ${child.name}`,
        message: `Oleh ${kader.name}: "${analysisText.substring(0, 50)}..."`,
        link: `/child/${childId}`
    });

    return savedRecord;
};

const addImmunizationRecord = async (childId: string, record: { name: string; date: string }): Promise<Immunization> => {
    const { data: newRecord, error } = await supabase.from('immunization_records').insert({ ...record, child_id: childId }).select().single();
    handleSupabaseError(error, 'addImmunizationRecord');
    if (!newRecord) throw new Error('Could not add immunization record.');
    return toImmunizationRecord(newRecord as unknown as Database['public']['Tables']['immunization_records']['Row']);
};

const addMilestoneRecord = async (childId: string, record: MilestoneRecord): Promise<MilestoneRecord> => {
    const child = await getChildById(childId);
    if (!child) throw new Error("Child not found for milestone record");

    const { data: newRecord, error } = await supabase.from('milestone_records').insert({ 
      child_id: childId,
      milestone_id: record.milestoneId,
      achieved_date: record.achievedDate,
      notes: record.notes,
    }).select().single();
    handleSupabaseError(error, 'addMilestoneRecord');
    if (!newRecord) throw new Error('Could not add milestone record.');
    
    const savedRecord = toMilestoneRecord(newRecord as unknown as Database['public']['Tables']['milestone_records']['Row']);

    await createNotification({
        userId: child.parentId,
        type: NotificationType.NewMilestone,
        title: `Selamat! Pencapaian Baru!`,
        message: `${child.name} telah mencapai milestone baru.`,
        link: `/child/${childId}`
    });

    return savedRecord;
};

// --- Article Functions ---
const getAllArticles = async (): Promise<Article[]> => {
    const { data, error } = await supabase.from('articles').select('*').order('published_date', { ascending: false });
    handleSupabaseError(error, 'getAllArticles');
    const articlesData = data as unknown as Database['public']['Tables']['articles']['Row'][];
    return articlesData ? articlesData.map(toArticle) : [];
};

const getArticleById = async (articleId: string): Promise<Article | null> => {
    const { data, error } = await supabase.from('articles').select('*').eq('id', articleId).single();
    if (error && error.code !== 'PGRST116') {
        handleSupabaseError(error, 'getArticleById');
    }
    const articleData = data as unknown as Database['public']['Tables']['articles']['Row'];
    return articleData ? toArticle(articleData) : null;
};

const addArticle = async (data: Omit<Article, 'id' | 'publishedDate' | 'authorName' | 'authorRole'>, author: User): Promise<Article> => {
    const articleData = {
        title: data.title,
        summary: data.summary,
        content: data.content,
        image_url: data.imageUrl,
        author_id: data.authorId,
        author_name: author.name,
        author_role: author.role,
        published_date: new Date().toISOString().split('T')[0],
        category: data.category,
    };
    const { data: newArticle, error } = await supabase.from('articles').insert(articleData).select().single();
    handleSupabaseError(error, 'addArticle');
    if (!newArticle) throw new Error('Could not add article.');
    
    const savedArticle = toArticle(newArticle as unknown as Database['public']['Tables']['articles']['Row']);

    // In a real app, this notification logic might be better as a database trigger or edge function.
    const { data: usersToNotify } = await supabase.from('users').select('id').or('role.eq.Kader,role.eq.Warga');
    if(usersToNotify) {
        const notifications = (usersToNotify as unknown as {id: string}[]).map(u => ({
            user_id: u.id,
            type: NotificationType.NewArticle as const,
            title: `Artikel Baru: ${savedArticle.title}`,
            message: `Oleh ${author.name}`,
            link: `/article/${savedArticle.id}`,
            is_read: false
        }));
        await supabase.from('notifications').insert(notifications);
    }

    return savedArticle;
};

const updateArticle = async (articleId: string, data: Partial<Omit<Article, 'id'>>): Promise<Article> => {
    const updateData: { [key: string]: any } = {};
    if (data.title) updateData.title = data.title;
    if (data.summary) updateData.summary = data.summary;
    if (data.content) updateData.content = data.content;
    if (data.imageUrl) updateData.image_url = data.imageUrl;
    if (data.category) updateData.category = data.category;

    const { data: updatedArticle, error } = await supabase.from('articles').update(updateData).eq('id', articleId).select().single();
    handleSupabaseError(error, 'updateArticle');
    if (!updatedArticle) throw new Error('Could not update article.');
    return toArticle(updatedArticle as unknown as Database['public']['Tables']['articles']['Row']);
};

const deleteArticle = async (articleId: string): Promise<void> => {
    const { error } = await supabase.from('articles').delete().eq('id', articleId);
    handleSupabaseError(error, 'deleteArticle');
};

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
