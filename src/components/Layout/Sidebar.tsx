import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Ticket, 
  Users, 
  Building,
  BookOpen, 
  BarChart3, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  Bot,
  Shield,
  Mail
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarItem {
  icon: React.ComponentType<any>;
  label: string;
  path: string;
  roles?: string[];
}

const sidebarItems: SidebarItem[] = [
  { icon: Home, label: 'Dashboard', path: '/' },
  { icon: Ticket, label: 'Tickets', path: '/tickets' },
  { icon: BookOpen, label: 'Base de Conocimientos', path: '/knowledge' },
  { icon: BarChart3, label: 'Informes', path: '/reports' },
  { icon: Users, label: 'Usuarios', path: '/users', roles: ['admin', 'technician'] },
  { icon: Building, label: 'Departamentos', path: '/departments', roles: ['admin'] },
  { icon: Bot, label: 'AI Assistant', path: '/ai' },
  { icon: Mail, label: 'Correo Electrónico', path: '/email', roles: ['admin'] },
  { icon: Shield, label: 'Seguridad', path: '/security', roles: ['admin'] },
  { icon: Settings, label: 'Configuración', path: '/settings', roles: ['admin'] }
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const filteredItems = sidebarItems.filter(item => 
    !item.roles || item.roles.includes(user?.role || '')
  );

  return (
    <div className={`bg-blue-900 text-white transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex items-center justify-between p-4 border-b border-blue-800">
        {!isCollapsed && (
          <h2 className="text-xl font-bold">TechSupport Pro</h2>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-md hover:bg-blue-800 transition-colors"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      
      <nav className="mt-8">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`w-full flex items-center px-4 py-3 text-left hover:bg-blue-800 transition-colors ${
                isActive ? 'bg-blue-800 border-r-4 border-blue-400' : ''
              }`}
            >
              <Icon size={20} className="flex-shrink-0" />
              {!isCollapsed && (
                <span className="ml-3 truncate">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}