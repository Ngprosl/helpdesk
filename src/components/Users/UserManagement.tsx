import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Shield, User, Mail, Calendar } from 'lucide-react';
import { useSystem } from '../../contexts/SystemContext';
import { CreateUserModal } from './CreateUserModal';
import { EditUserModal } from './EditUserModal';
import { User as UserType } from '../../types';

const roleColors = {
  admin: 'bg-purple-100 text-purple-800',
  technician: 'bg-blue-100 text-blue-800',
  user: 'bg-green-100 text-green-800'
};

const roleLabels = {
  admin: 'Administrador',
  technician: 'Técnico',
  user: 'Usuario'
};

export function UserManagement() {
  const { users, createUser, updateUser, deleteUser } = useSystem();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const toggleUserStatus = (userId: string, isActive: boolean) => {
    updateUser(userId, { isActive });
  };

  const handleEditUser = (user: UserType) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Nuevo Usuario</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos los roles</option>
            <option value="admin">Administradores</option>
            <option value="technician">Técnicos</option>
            <option value="user">Usuarios</option>
          </select>

          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>Total: {filteredUsers.length}</span>
            <span>Activos: {filteredUsers.filter(u => u.isActive).length}</span>
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div key={user.id} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <User size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
                    {roleLabels[user.role]}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleEditUser(user)}
                  className="text-blue-600 hover:text-blue-900 p-1 rounded"
                >
                  <Edit size={16} />
                </button>
                <button 
                  onClick={() => deleteUser(user.id)}
                  className="text-red-600 hover:text-red-900 p-1 rounded"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail size={14} />
                <span>{user.email}</span>
              </div>
              
              {user.department && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Shield size={14} />
                  <span>{user.department}</span>
                </div>
              )}
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar size={14} />
                <span>Creado: {new Date(user.createdAt).toLocaleDateString('es-ES')}</span>
              </div>

              {user.lastLogin && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar size={14} />
                  <span>Último acceso: {new Date(user.lastLogin).toLocaleDateString('es-ES')}</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Estado:</span>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={user.isActive}
                    onChange={(e) => toggleUserStatus(user.id, e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    user.isActive ? 'bg-green-600' : 'bg-gray-200'
                  }`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      user.isActive ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </div>
                </label>
              </div>
              
              {user.failedAttempts > 0 && (
                <div className="mt-2 text-sm text-red-600">
                  Intentos fallidos: {user.failedAttempts}
                </div>
              )}
              
              {user.blockedUntil && new Date(user.blockedUntil) > new Date() && (
                <div className="mt-2 text-sm text-red-600">
                  Bloqueado hasta: {new Date(user.blockedUntil).toLocaleString('es-ES')}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay usuarios</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || roleFilter !== 'all'
              ? 'No se encontraron usuarios con los filtros aplicados.'
              : 'Comienza creando un nuevo usuario.'
            }
          </p>
        </div>
      )}

      <CreateUserModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
      
      <EditUserModal 
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />
    </div>
  );
}