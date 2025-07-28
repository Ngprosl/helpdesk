import React, { useState } from 'react';
import { Search, Plus, BookOpen, Eye, ThumbsUp, ThumbsDown, Edit, Trash2, Tag } from 'lucide-react';
import { useSystem } from '../../contexts/SystemContext';
import { CreateArticleModal } from './CreateArticleModal';
import { EditArticleModal } from './EditArticleModal';
import type { KnowledgeArticle } from '../../types';

export function KnowledgeBase() {
  const { knowledgeArticles } = useSystem();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);

  const filteredArticles = knowledgeArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || article.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(knowledgeArticles.map(article => article.category))];

  const handleEditArticle = (article: KnowledgeArticle) => {
    setSelectedArticle(article);
    setShowEditModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Base de Conocimientos</h1>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Nuevo Artículo</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar artículos, etiquetas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todas las categorías</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredArticles.map((article) => (
          <div key={article.id} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="text-blue-500" size={20} />
                <span className="text-sm font-medium text-blue-600">{article.category}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleEditArticle(article)}
                  className="text-blue-600 hover:text-blue-900 p-1 rounded"
                >
                  <Edit size={16} />
                </button>
                <button className="text-red-600 hover:text-red-900 p-1 rounded">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">{article.title}</h3>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {article.content.substring(0, 150)}...
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {article.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  <Tag size={12} className="mr-1" />
                  {tag}
                </span>
              ))}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Eye size={14} />
                  <span>{article.views}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ThumbsUp size={14} className="text-green-500" />
                  <span>{article.helpful}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ThumbsDown size={14} className="text-red-500" />
                  <span>{article.notHelpful}</span>
                </div>
              </div>
              
              <div className="text-xs">
                Actualizado: {new Date(article.updatedAt).toLocaleDateString('es-ES')}
              </div>
            </div>

            <div className="mt-4">
              <button className="w-full bg-blue-50 text-blue-700 py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                Ver Artículo Completo
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay artículos</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || categoryFilter !== 'all'
              ? 'No se encontraron artículos con los filtros aplicados.'
              : 'Comienza creando un nuevo artículo de conocimiento.'
            }
          </p>
        </div>
      )}

      {/* Popular Articles Sidebar */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Artículos Más Populares</h3>
        <div className="space-y-3">
          {knowledgeArticles
            .sort((a, b) => b.views - a.views)
            .slice(0, 5)
            .map((article, index) => (
              <div key={article.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{article.title}</p>
                  <p className="text-xs text-gray-500">{article.views} visualizaciones</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      <CreateArticleModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
      
      <EditArticleModal 
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedArticle(null);
        }}
        article={selectedArticle}
      />
    </div>
  );
}