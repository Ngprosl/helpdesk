import React, { useState } from 'react';
import { X, Mail, Server, Key, Clock, Settings } from 'lucide-react';
import { useSystem } from '../../contexts/SystemContext';

interface EmailAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EmailAccountModal({ isOpen, onClose }: EmailAccountModalProps) {
  const { createEmailAccount, categories } = useSystem();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    provider: 'imap' as 'imap' | 'pop3' | 'exchange',
    server: '',
    port: 993,
    username: '',
    password: '',
    useSSL: true,
    isActive: true,
    syncInterval: 15,
    autoCreateTickets: true,
    defaultPriority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    defaultCategory: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.server || !formData.username || !formData.password) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    createEmailAccount(formData);
    
    setFormData({
      name: '',
      email: '',
      provider: 'imap',
      server: '',
      port: 993,
      username: '',
      password: '',
      useSSL: true,
      isActive: true,
      syncInterval: 15,
      autoCreateTickets: true,
      defaultPriority: 'medium',
      defaultCategory: ''
    });
    onClose();
  };

  const handleProviderChange = (provider: 'imap' | 'pop3' | 'exchange') => {
    let defaultPort = 993;
    switch (provider) {
      case 'imap':
        defaultPort = 993;
        break;
      case 'pop3':
        defaultPort = 995;
        break;
      case 'exchange':
        defaultPort = 993;
        break;
    }
    
    setFormData({ ...formData, provider, port: defaultPort });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
            <Mail className="text-blue-600" />
            <span>Configurar Cuenta de Email</span>
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
                Nombre de la Cuenta *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Soporte Principal"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección de Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="soporte@empresa.com"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Server size={16} className="inline mr-1" />
                Protocolo
              </label>
              <select
                value={formData.provider}
                onChange={(e) => handleProviderChange(e.target.value as 'imap' | 'pop3' | 'exchange')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="imap">IMAP</option>
                <option value="pop3">POP3</option>
                <option value="exchange">Exchange</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Servidor *
              </label>
              <input
                type="text"
                value={formData.server}
                onChange={(e) => setFormData({ ...formData, server: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="imap.gmail.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Puerto
              </label>
              <input
                type="number"
                value={formData.port}
                onChange={(e) => setFormData({ ...formData, port: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Key size={16} className="inline mr-1" />
                Usuario *
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="usuario@empresa.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña *
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración de Procesamiento</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock size={16} className="inline mr-1" />
                  Intervalo de Sincronización (min)
                </label>
                <input
                  type="number"
                  min="5"
                  max="1440"
                  value={formData.syncInterval}
                  onChange={(e) => setFormData({ ...formData, syncInterval: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prioridad por Defecto
                </label>
                <select
                  value={formData.defaultPriority}
                  onChange={(e) => setFormData({ ...formData, defaultPriority: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                  <option value="critical">Crítica</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría por Defecto
                </label>
                <input
                  type="text"
                  value={formData.defaultCategory}
                  onChange={(e) => setFormData({ ...formData, defaultCategory: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="email"
                />
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="useSSL"
                  checked={formData.useSSL}
                  onChange={(e) => setFormData({ ...formData, useSSL: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="useSSL" className="ml-2 text-sm text-gray-700">
                  Usar SSL/TLS (recomendado)
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="autoCreateTickets"
                  checked={formData.autoCreateTickets}
                  onChange={(e) => setFormData({ ...formData, autoCreateTickets: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="autoCreateTickets" className="ml-2 text-sm text-gray-700">
                  Crear tickets automáticamente desde emails
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                  Cuenta activa (sincronizar automáticamente)
                </label>
              </div>
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
              <Settings size={16} />
              <span>Configurar Cuenta</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}