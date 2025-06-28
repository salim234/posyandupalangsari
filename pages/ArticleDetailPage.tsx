import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Article, ArticleCategory, Role } from '../types';
import { dataService } from '../services/dataService';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useAuth } from '../hooks/useAuth';
import { ICONS } from '../constants';
import ArticleFormModal from '../components/forms/ArticleFormModal';

const ArticleDetailPage: React.FC = () => {
    const { articleId } = useParams<{ articleId: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (!articleId) {
            setError('Article ID is missing.');
            setLoading(false);
            return;
        }

        const fetchArticle = async () => {
            setLoading(true);
            try {
                const data = await dataService.getArticleById(articleId);
                if (data) {
                    setArticle(data);
                } else {
                    setError('Artikel tidak ditemukan.');
                }
            } catch (err) {
                setError('Gagal memuat artikel.');
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [articleId]);

    const canManage = user && article && (user.role === Role.Admin || user.id === article.authorId);

    const handleDelete = async () => {
        if (!article) return;
        if(window.confirm(`Apakah Anda yakin ingin menghapus artikel "${article.title}"?`)){
            try {
                await dataService.deleteArticle(article.id);
                navigate('/articles');
            } catch(error) {
                console.error("Failed to delete article", error);
                alert("Gagal menghapus artikel.");
            }
        }
    }

    const handleSaveArticle = (savedArticle: Article) => {
        setArticle(savedArticle); // Update the state of the current page
        setIsModalOpen(false);
    }


    if (loading) return <div className="text-center p-8">Memuat artikel...</div>;
    if (error) return <div className="text-center p-8 text-red-600 bg-red-100 rounded-lg">{error}</div>;
    if (!article) return <div className="text-center p-8">Artikel tidak tersedia.</div>;

     const categoryColors: Record<ArticleCategory, string> = {
        [ArticleCategory.Announcement]: 'bg-red-100 text-red-800',
        [ArticleCategory.Nutrition]: 'bg-green-100 text-green-800',
        [ArticleCategory.Development]: 'bg-blue-100 text-blue-800',
        [ArticleCategory.Health]: 'bg-secondary-100 text-secondary-800',
    };

    return (
        <>
            <ArticleFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveArticle}
                articleToEdit={article}
            />
            <div className="max-w-4xl mx-auto">
                 <Button as={Link} to="/articles" variant="ghost" className="mb-6 text-sm !pl-0">
                    &larr; Kembali ke Semua Artikel
                </Button>
                <Card className="overflow-hidden">
                    <img src={article.imageUrl} alt={article.title} className="w-full h-64 md:h-80 object-cover" />
                    <div className="p-6 md:p-10">
                        <span className={`text-sm font-bold px-3 py-1 rounded-full self-start ${categoryColors[article.category]}`}>{article.category}</span>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mt-4">{article.title}</h1>
                        <p className="text-sm text-slate-500 font-bold mt-4">
                            Oleh {article.authorName} ({article.authorRole}) • {new Date(article.publishedDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                        
                        {canManage && (
                            <div className="mt-4 flex gap-2 border-b border-slate-100 pb-4">
                                <Button onClick={() => setIsModalOpen(true)} variant="ghost" size="sm">
                                    <ICONS.edit className="w-4 h-4 mr-2" />
                                    Edit Artikel
                                </Button>
                                <Button onClick={handleDelete} variant="ghost" size="sm" className="!text-red-500 hover:!bg-red-100">
                                    <ICONS.trash className="w-4 h-4 mr-2" />
                                    Hapus Artikel
                                </Button>
                            </div>
                        )}
                        
                        <div className="prose prose-lg max-w-none mt-6 text-slate-700 whitespace-pre-wrap">
                            {article.content}
                        </div>
                    </div>
                </Card>
            </div>
        </>
    );
};

export default ArticleDetailPage;
