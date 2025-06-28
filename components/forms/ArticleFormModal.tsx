import React, { useState, useEffect } from 'react';
import { Article, ArticleCategory, Role } from '../../types';
import { dataService } from '../../services/dataService';
import { useAuth } from '../../hooks/useAuth';
import Modal from '../ui/Modal';
import { CardContent, CardFooter } from '../ui/Card';
import Button from '../ui/Button';

interface ArticleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (article: Article) => void;
  articleToEdit?: Article | null;
}

const ArticleFormModal: React.FC<ArticleFormModalProps> = ({ isOpen, onClose, onSave, articleToEdit }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    imageUrl: '',
    category: ArticleCategory.Health,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (articleToEdit && isOpen) {
      setFormData({
        title: articleToEdit.title,
        summary: articleToEdit.summary,
        content: articleToEdit.content,
        imageUrl: articleToEdit.imageUrl,
        category: articleToEdit.category,
      });
    } else if (!articleToEdit && isOpen) {
      // Reset form when opening for 'create'
      setFormData({
        title: '',
        summary: '',
        content: '',
        imageUrl: '',
        category: ArticleCategory.Health,
      });
    }
  }, [articleToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        alert("Anda harus login untuk melakukan aksi ini.");
        return;
    }
    setIsSubmitting(true);
    try {
      let savedArticle;
      if (articleToEdit) {
        savedArticle = await dataService.updateArticle(articleToEdit.id, formData);
      } else {
        const articleDataForCreation = {
            ...formData,
            authorId: user.id
        };
        savedArticle = await dataService.addArticle(articleDataForCreation, user);
      }
      onSave(savedArticle);

    } catch (error) {
      console.error("Failed to save article:", error);
      alert("Gagal menyimpan artikel. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={articleToEdit ? "Edit Artikel" : "Tulis Artikel Baru"}>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 max-h-[70vh] overflow-y-auto p-4 md:p-6">
          <input name="title" value={formData.title} onChange={handleChange} placeholder="Judul Artikel" required className="w-full p-3 border-2 border-slate-200 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-slate-50"/>
          <textarea name="summary" value={formData.summary} onChange={handleChange} placeholder="Ringkasan singkat (1-2 kalimat)" required rows={2} className="w-full p-3 border-2 border-slate-200 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-slate-50"/>
          <textarea name="content" value={formData.content} onChange={handleChange} placeholder="Isi artikel... Anda bisa menggunakan format markdown sederhana." required rows={8} className="w-full p-3 border-2 border-slate-200 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-slate-50"/>
          <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="URL Gambar Cover (https://...)" required type="url" className="w-full p-3 border-2 border-slate-200 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-slate-50"/>
          <select name="category" value={formData.category} onChange={handleChange} required className="w-full p-3 border-2 border-slate-200 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-slate-50">
            {Object.values(ArticleCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>Batal</Button>
          <Button type="submit" isLoading={isSubmitting}>
            {articleToEdit ? "Simpan Perubahan" : "Publikasikan"}
          </Button>
        </CardFooter>
      </form>
    </Modal>
  );
};

export default ArticleFormModal;
