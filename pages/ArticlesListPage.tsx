import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Article, ArticleCategory, Role } from '../types';
import { dataService } from '../services/dataService';
import Card, { CardContent, CardFooter } from '../components/ui/Card';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import { ICONS } from '../constants';
import ArticleFormModal from '../components/forms/ArticleFormModal';

const ArticleCard: React.FC<{
  article: Article;
  onEdit: (article: Article) => void;
  onDelete: (articleId: string) => void;
}> = ({ article, onEdit, onDelete }) => {
    const { user } = useAuth();
    const canManage = user?.role === Role.Admin || user?.id === article.authorId;
    
    const categoryColors: Record<ArticleCategory, string> = {
        [ArticleCategory.Announcement]: 'bg-red-100 text-red-800',
        [ArticleCategory.Nutrition]: 'bg-green-100 text-green-800',
        [ArticleCategory.Development]: 'bg-blue-100 text-blue-800',
        [ArticleCategory.Health]: 'bg-secondary-100 text-secondary-800',
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation
        e.stopPropagation();
        if(window.confirm(`Apakah Anda yakin ingin menghapus artikel "${article.title}"?`)){
            onDelete(article.id);
        }
    }

    const handleEdit = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation
        e.stopPropagation();
        onEdit(article);
    }

    return (
        <Card as={Link} to={`/article/${article.id}`} className="flex flex-col group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
            <div className="h-48 overflow-hidden">
                <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <CardContent className="flex flex-col flex-grow">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full self-start ${categoryColors[article.category]}`}>{article.category}</span>
                <h3 className="text-lg font-extrabold text-slate-800 mt-2 flex-grow">{article.title}</h3>
                <p className="text-sm text-slate-500 mt-2">{article.summary}</p>
                <p className="text-xs text-slate-400 font-bold mt-4 pt-4 border-t border-slate-100">
                    Oleh {article.authorName} • {new Date(article.publishedDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
            </CardContent>
            {canManage && (
                <CardFooter className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={handleEdit}>
                        <ICONS.edit className="w-4 h-4 mr-2" /> Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="!text-red-500 hover:!bg-red-100" onClick={handleDelete}>
                        <ICONS.trash className="w-4 h-4 mr-2" /> Hapus
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
};


const ArticlesListPage: React.FC = () => {
    const { user } = useAuth();
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<ArticleCategory | 'Semua'>('Semua');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingArticle, setEditingArticle] = useState<Article | null>(null);

    const fetchArticles = async () => {
        setLoading(true);
        const allArticles = await dataService.getAllArticles();
        setArticles(allArticles);
        setLoading(false);
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    const handleOpenModalForCreate = () => {
        setEditingArticle(null);
        setIsModalOpen(true);
    }

    const handleOpenModalForEdit = (article: Article) => {
        setEditingArticle(article);
        setIsModalOpen(true);
    }

    const handleDeleteArticle = async (articleId: string) => {
        try {
            await dataService.deleteArticle(articleId);
            setArticles(prev => prev.filter(a => a.id !== articleId));
        } catch (error) {
            console.error("Failed to delete article", error);
            alert("Gagal menghapus artikel.");
        }
    }

    const handleSaveArticle = (savedArticle: Article) => {
        if(editingArticle) {
            // Update existing article in the list
            setArticles(prev => prev.map(a => a.id === savedArticle.id ? savedArticle : a));
        } else {
            // Add new article to the list
            setArticles(prev => [savedArticle, ...prev]);
        }
        setIsModalOpen(false);
        setEditingArticle(null);
    }

    const filteredArticles = activeCategory === 'Semua' 
        ? articles 
        : articles.filter(a => a.category === activeCategory);

    const categories: ('Semua' | ArticleCategory)[] = ['Semua', ...Object.values(ArticleCategory)];

    return (
        <>
            <ArticleFormModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveArticle}
                articleToEdit={editingArticle}
            />
            <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800">Edukasi & Info Kesehatan</h1>
                        <p className="text-base md:text-lg text-slate-500">Baca artikel terbaru seputar kesehatan ibu dan anak.</p>
                    </div>
                     {(user?.role === Role.Admin || user?.role === Role.Kader) && (
                         <Button onClick={handleOpenModalForCreate} className="w-full sm:w-auto">
                            + Tulis Artikel Baru
                        </Button>
                    )}
                </div>

                <div className="flex gap-2 overflow-x-auto pb-3">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-primary-500 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-primary-100'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <p>Memuat artikel...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredArticles.length > 0 ? (
                            filteredArticles.map(article => 
                                <ArticleCard 
                                    key={article.id} 
                                    article={article} 
                                    onEdit={handleOpenModalForEdit}
                                    onDelete={handleDeleteArticle}
                                />)
                        ) : (
                            <p className="md:col-span-2 lg:col-span-3 text-center text-slate-500 py-10">Tidak ada artikel di kategori ini.</p>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default ArticlesListPage;
