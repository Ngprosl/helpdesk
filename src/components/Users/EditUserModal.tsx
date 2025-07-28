import React, { useState, useEffect } from 'react';
import { X, User, Mail, Shield, Building, MapPin } from 'lucide-react';
import { useSystem } from '../../contexts/SystemContext';
import type { User as UserType } from '../../types';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType | null;
}

export function EditUserModal({ isOpen, onClose, user }: EditUserModalProps) {
  const { updateUser, departments } = useSystem();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user' as 'admin' | 'technician' | 'user',
    department: '',
    supportAreas: [] as string[],
    isActive: true,
    whitelistEntry: false
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department || '',
        supportAreas: user.supportAreas || [],
        isActive: user.isActive,
        whitelistEntry: user.whitelistEntry || false
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !user) {
      return;
    }

    const updates = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      department: formData.department,
      supportAreas: formData.supportAreas,
      isActive: formData.isActive,
      whitelistEntry: formData.whitelistEntry
    };

    updateUser(user.id, updates);
    onClose();
  };

  const handleSupportAreaToggle = (areaId: string) => {
    setFormData(prev => ({
      ...prev,
      supportAreas: prev.supportAreas.includes(areaId)
        ? prev.supportAreas.filter(id => id !== areaId)
        : [...prev.supportAreas, areaId]
    }));
  };

  const availableSupportAreas = departments
    .find(dept => dept.name === formData.department)
    ?.supportAreas || [];

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
            <User className="text-blue-600" />
            <span>Editar Usuario</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User size={16} className="inline mr-1" />
                Nombre Completo *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail size={16} className="inline mr-1" />
                Correo Electrónico *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Shield size={16} className="inline mr-1" />
                Rol del Usuario
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'technician' | 'user' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="user">Usuario</option>
                <option value="technician">Técnico</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building size={16} className="inline mr-1" />
                Departamento
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value, supportAreas: [] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccionar departamento</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.name}>{dept.name}</option>
                ))}
              </select>
            </div>
          </div>

          {formData.role === 'technician' && formData.department && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin size={16} className="inline mr-1" />
                Áreas de Soporte
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3">
                {availableSupportAreas.map(area => (
                  <label key={area.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.supportAreas.includes(area.id)}
                      onChange={() => handleSupportAreaToggle(area.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{area.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                Usuario activo (puede iniciar sesión)
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="whitelistEntry"
                checked={formData.whitelistEntry}
                onChange={(e) => setFormData({ ...formData, whitelistEntry: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="whitelistEntry" className="ml-2 text-sm text-gray-700">
                Agregar a la whitelist (acceso garantizado)
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <User size={16} />
              <span>Guardar Cambios</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}