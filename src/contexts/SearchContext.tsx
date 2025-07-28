import React, { createContext, useContext, useState } from 'react';
import { useSystem } from './SystemContext';
import type { Ticket, User, KnowledgeArticle, Department } from '../types';

interface SearchResult {
  id: string;
  type: 'ticket' | 'user' | 'article' | 'department';
  title: string;
  description: string;
  url: string;
  data: any;
}

interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchResults: SearchResult[];
  isSearching: boolean;
  performSearch: (term: string) => void;
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { tickets, users, knowledgeArticles, departments } = useSystem();

  const performSearch = (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const results: SearchResult[] = [];
    const searchLower = term.toLowerCase();

    // Buscar en tickets
    tickets.forEach(ticket => {
      if (
        ticket.title.toLowerCase().includes(searchLower) ||
        ticket.description.toLowerCase().includes(searchLower) ||
        ticket.id.includes(searchLower) ||
        ticket.tags.some(tag => tag.toLowerCase().includes(searchLower))
      ) {
        results.push({
          id: ticket.id,
          type: 'ticket',
          title: `Ticket #${ticket.id}: ${ticket.title}`,
          description: ticket.description.substring(0, 100) + '...',
          url: '/tickets',
          data: ticket
        });
      }
    });

    // Buscar en usuarios
    users.forEach(user => {
      if (
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        (user.department && user.department.toLowerCase().includes(searchLower))
      ) {
        results.push({
          id: user.id,
          type: 'user',
          title: user.name,
          description: `${user.email} - ${user.role}`,
          url: '/users',
          data: user
        });
      }
    });

    // Buscar en artículos de conocimiento
    knowledgeArticles.forEach(article => {
      if (
        article.title.toLowerCase().includes(searchLower) ||
        article.content.toLowerCase().includes(searchLower) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchLower))
      ) {
        results.push({
          id: article.id,
          type: 'article',
          title: article.title,
          description: article.content.substring(0, 100) + '...',
          url: '/knowledge',
          data: article
        });
      }
    });

    // Buscar en departamentos
    departments.forEach(department => {
      if (
        department.name.toLowerCase().includes(searchLower) ||
        department.description.toLowerCase().includes(searchLower) ||
        department.supportAreas.some(area => 
          area.name.toLowerCase().includes(searchLower) ||
          area.keywords.some(keyword => keyword.toLowerCase().includes(searchLower))
        )
      ) {
        results.push({
          id: department.id,
          type: 'department',
          title: department.name,
          description: department.description,
          url: '/departments',
          data: department
        });
      }
    });

    setSearchResults(results);
    setIsSearching(false);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
  };

  return (
    <SearchContext.Provider value={{
      searchTerm,
      setSearchTerm,
      searchResults,
      isSearching,
      performSearch,
      clearSearch
    }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}