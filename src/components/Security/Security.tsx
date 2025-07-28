import React, { useState } from 'react';
import { Shield, Users, Lock, AlertTriangle, Eye, Activity, Clock } from 'lucide-react';
import { useSystem } from '../../contexts/SystemContext';

export function Security() {
  const { users, config } = useSystem();
  const [activeTab, setActiveTab] = useState('overview');

  const blockedUsers = users.filter(user => 
    user.blockedUntil && new Date(user.blockedUntil) > new Date()
  );

  const failedAttempts = users.filter(user => user.failedAttempts > 0);

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: Shield },
    { id: 'users', label: 'Usuarios', icon: Users },
    { id: 'access', label: 'Control de Acceso', icon: Lock },
    { id: 'logs', label: 'Logs de Seguridad', icon: Activity }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
          <Shield className="text-red-600" />
          <span>Centro de Seguridad</span>
        </h1>
        
        <div className="flex items-center space-x-2">
          <div className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            Sistema Seguro
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Security Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Usuarios Activos</p>
                  <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.isActive).length}</p>
                </div>
                <Users className="text-green-500" size={32} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Usuarios Bloqueados</p>
                  <p className="text-2xl font-bold text-gray-900">{blockedUsers.length}</p>
                </div>
                <Lock className="text-red-500" size={32} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Intentos Fallidos</p>
                  <p className="text-2xl font-bold text-gray-900">{failedAttempts.reduce((sum, u) => sum + u.failedAttempts, 0)}</p>
                </div>
                <AlertTriangle className="text-orange-500" size={32} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Whitelist</p>
                  <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.whitelistEntry).length}</p>
                </div>
                <Shield className="text-blue-500" size={32} />
              </div>
            </div>
          </div>

          {/* Security Alerts */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertas de Seguridad</h3>
            <div className="space-y-3">
              {blockedUsers.length > 0 && (
                <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                  <AlertTriangle className="text-red-500" size={20} />
                  <div>
                    <p className="text-sm font-medium text-red-900">
                      {blockedUsers.length} usuario(s) bloqueado(s)
                    </p>
                    <p className="text-xs text-red-700">
                      Usuarios con acceso restringido por intentos fallidos
                    </p>
                  </div>
                </div>
              )}
              
              {failedAttempts.length > 0 && (
                <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                  <Eye className="text-orange-500" size={20} />
                  <div>
                    <p className="text-sm font-medium text-orange-900">
                      {failedAttempts.length} usuario(s) con intentos fallidos
                    </p>
                    <p className="text-xs text-orange-700">
                      Monitorear actividad sospechosa
                    </p>
                  </div>
                </div>
              )}

              {blockedUsers.length === 0 && failedAttempts.length === 0 && (
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <Shield className="text-green-500" size={20} />
                  <div>
                    <p className="text-sm font-medium text-green-900">
                      No hay alertas de seguridad
                    </p>
                    <p className="text-xs text-green-700">
                      Todos los usuarios tienen acceso normal
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Estado de Usuarios</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Intentos Fallidos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Último Acceso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Whitelist
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <Users size={16} className="text-white" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        user.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.failedAttempts > 0 ? (
                        <span className="text-red-600 font-medium">{user.failedAttempts}</span>
                      ) : (
                        <span className="text-green-600">0</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleString('es-ES') : 'Nunca'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.whitelistEntry ? (
                        <Shield className="text-blue-500" size={16} />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Access Control Tab */}
      {activeTab === 'access' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración de Seguridad</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Máximo Intentos Fallidos
                </label>
                <div className="text-2xl font-bold text-gray-900">{config.security.maxFailedAttempts}</div>
                <p className="text-sm text-gray-500">Intentos antes del bloqueo</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duración del Bloqueo
                </label>
                <div className="text-2xl font-bold text-gray-900">{config.security.lockoutDuration} min</div>
                <p className="text-sm text-gray-500">Tiempo de bloqueo</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timeout de Sesión
                </label>
                <div className="text-2xl font-bold text-gray-900">{config.security.sessionTimeout} min</div>
                <p className="text-sm text-gray-500">Duración máxima de sesión</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Whitelist Requerida
                </label>
                <div className={`text-2xl font-bold ${config.security.requireWhitelist ? 'text-green-600' : 'text-gray-400'}`}>
                  {config.security.requireWhitelist ? 'SÍ' : 'NO'}
                </div>
                <p className="text-sm text-gray-500">Control de acceso estricto</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logs Tab */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Logs de Seguridad Recientes</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <Clock className="text-green-500" size={16} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-900">Login exitoso</p>
                  <p className="text-xs text-green-700">admin@company.com - {new Date().toLocaleString('es-ES')}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <Activity className="text-blue-500" size={16} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">Configuración actualizada</p>
                  <p className="text-xs text-blue-700">Cambios en configuración de seguridad - {new Date(Date.now() - 3600000).toLocaleString('es-ES')}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                <AlertTriangle className="text-orange-500" size={16} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-orange-900">Intento de login fallido</p>
                  <p className="text-xs text-orange-700">user@company.com - {new Date(Date.now() - 7200000).toLocaleString('es-ES')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}