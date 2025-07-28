import React from 'react';
import { Bell, Search, User, LogOut, X, Ticket, Users, BookOpen, Building } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useSearch } from '../../contexts/SearchContext';
import { useNavigate } from 'react-router-dom';

const typeIcons = {
  ticket: Ticket,
  user: Users,
  article: BookOpen,
  department: Building
};

const typeColors = {
  ticket: 'text-blue-600',
  user: 'text-green-600',
  article: 'text-purple-600',
  department: 'text-orange-600'
};

export function Header() {
  const { user, logout } = useAuth();
  const { searchTerm, setSearchTerm, searchResults, isSearching, performSearch, clearSearch } = useSearch();
  const navigate = useNavigate();
  const [showResults, setShowResults] = React.useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    performSearch(term);
    setShowResults(term.length > 0);
  };

  const handleResultClick = (result: any) => {
    navigate(result.url);
    clearSearch();
    setShowResults(false);
  };

  const handleClearSearch = () => {
    clearSearch();
    setShowResults(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4 flex-1 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => setShowResults(searchTerm.length > 0)}
              placeholder="Buscar tickets, usuarios, artículos..."
              className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
            
            {/* Search Results Dropdown */}
            {showResults && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                {isSearching ? (
                  <div className="p-4 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2">Buscando...</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="py-2">
                    {searchResults.map((result) => {
                      const Icon = typeIcons[result.type];
                      return (
                        <button
                          key={`${result.type}-${result.id}`}
                          onClick={() => handleResultClick(result)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-start space-x-3 border-b border-gray-100 last:border-b-0"
                        >
                          <Icon size={18} className={`mt-0.5 ${typeColors[result.type]}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {result.title}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {result.description}
                            </p>
                            <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full capitalize">
                              {result.type === 'article' ? 'Artículo' : 
                               result.type === 'user' ? 'Usuario' :
                               result.type === 'department' ? 'Departamento' : 'Ticket'}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : searchTerm.length > 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    <Search size={24} className="mx-auto mb-2 text-gray-300" />
                    <p>No se encontraron resultados para "{searchTerm}"</p>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell size={20} />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
            <div className="relative">
              <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
              </button>
            </div>
            <button
              onClick={logout}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Cerrar sesión"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}