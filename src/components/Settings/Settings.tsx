import React, { useState } from 'react';
import { Save, Settings as SettingsIcon, Mail, Shield, Bot, Bell } from 'lucide-react';
import { useSystem } from '../../contexts/SystemContext';

export function Settings() {
  const { config, updateConfig } = useSystem();
  const [activeTab, setActiveTab] = useState('general');
  const [hasChanges, setHasChanges] = useState(false);

  const handleConfigChange = (section: string, field: string, value: any) => {
    const newConfig = {
      ...config,
      [section]: {
        ...config[section as keyof typeof config],
        [field]: value
      }
    };
    updateConfig(newConfig);
    setHasChanges(true);
  };

  const saveChanges = () => {
    setHasChanges(false);
    // Aquí se guardarían los cambios en la base de datos
    console.log('Configuración guardada');
  };

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'security', label: 'Seguridad', icon: Shield },
    { id: 'tickets', label: 'Tickets', icon: SettingsIcon },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'email', label: 'Correo', icon: Mail },
    { id: 'ai', label: 'Inteligencia Artificial', icon: Bot }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Configuración del Sistema</h1>
        {hasChanges && (
          <button 
            onClick={saveChanges}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Save size={20} />
            <span>Guardar Cambios</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="flex border-b border-gray-200">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Configuración General</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la Empresa
                  </label>
                  <input
                    type="text"
                    value={config.general.companyName}
                    onChange={(e) => handleConfigChange('general', 'companyName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email de Soporte
                  </label>
                  <input
                    type="email"
                    value={config.general.supportEmail}
                    onChange={(e) => handleConfigChange('general', 'supportEmail', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zona Horaria
                  </label>
                  <select
                    value={config.general.timezone}
                    onChange={(e) => handleConfigChange('general', 'timezone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Europe/Madrid">Europa/Madrid</option>
                    <option value="America/New_York">América/Nueva York</option>
                    <option value="America/Los_Angeles">América/Los Ángeles</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Idioma
                  </label>
                  <select
                    value={config.general.language}
                    onChange={(e) => handleConfigChange('general', 'language', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="es">Español</option>
                    <option value="en">English</option>
                    <option value="fr">Français</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Configuración de Seguridad</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Máximo Intentos Fallidos
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={config.security.maxFailedAttempts}
                    onChange={(e) => handleConfigChange('security', 'maxFailedAttempts', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duración del Bloqueo (minutos)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="1440"
                    value={config.security.lockoutDuration}
                    onChange={(e) => handleConfigChange('security', 'lockoutDuration', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timeout de Sesión (minutos)
                  </label>
                  <input
                    type="number"
                    min="30"
                    max="1440"
                    value={config.security.sessionTimeout}
                    onChange={(e) => handleConfigChange('security', 'sessionTimeout', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.security.requireWhitelist}
                    onChange={(e) => handleConfigChange('security', 'requireWhitelist', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    Requerir Whitelist para Acceso
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.security.strongPasswordPolicy}
                    onChange={(e) => handleConfigChange('security', 'strongPasswordPolicy', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    Política de Contraseñas Fuertes
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Tickets Tab */}
          {activeTab === 'tickets' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Configuración de Tickets</h3>
              
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.tickets.autoAssignEnabled}
                    onChange={(e) => handleConfigChange('tickets', 'autoAssignEnabled', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    Asignación Automática Habilitada
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.tickets.allowSelfAssign}
                    onChange={(e) => handleConfigChange('tickets', 'allowSelfAssign', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    Permitir Auto-asignación
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.tickets.requireApproval}
                    onChange={(e) => handleConfigChange('tickets', 'requireApproval', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    Requerir Aprobación para Cierre
                  </span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prioridad por Defecto
                  </label>
                  <select
                    value={config.tickets.defaultPriority}
                    onChange={(e) => handleConfigChange('tickets', 'defaultPriority', e.target.value)}
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
                    Auto-cerrar después de (días)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={config.tickets.autoCloseAfterDays}
                    onChange={(e) => handleConfigChange('tickets', 'autoCloseAfterDays', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* AI Tab */}
          {activeTab === 'ai' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Configuración de IA</h3>
              
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.ai.enabled}
                    onChange={(e) => handleConfigChange('ai', 'enabled', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    Habilitar Funciones de IA
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.ai.autoSuggestSolutions}
                    onChange={(e) => handleConfigChange('ai', 'autoSuggestSolutions', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    Sugerir Soluciones Automáticamente
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.ai.autoCategorizTickets}
                    onChange={(e) => handleConfigChange('ai', 'autoCategorizTickets', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    Categorizar Tickets Automáticamente
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.ai.chatbotEnabled}
                    onChange={(e) => handleConfigChange('ai', 'chatbotEnabled', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    Habilitar Chatbot
                  </span>
                </label>
              </div>

              <div className="space-y-4">
                <h4 className="text-md font-semibold text-gray-900">Proveedores de IA</h4>
                {config.ai.providers.map(provider => (
                  <div key={provider.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium text-gray-900">{provider.name}</h5>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={provider.enabled}
                          onChange={(e) => {
                            const updatedProviders = config.ai.providers.map(p =>
                              p.id === provider.id ? { ...p, enabled: e.target.checked } : p
                            );
                            handleConfigChange('ai', 'providers', updatedProviders);
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Habilitado</span>
                      </label>
                    </div>
                    
                    {provider.enabled && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            API Key
                          </label>
                          <input
                            type="password"
                            placeholder="Ingresa tu API Key"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Modelo
                          </label>
                          <input
                            type="text"
                            placeholder="ej: gpt-4, claude-3-sonnet"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}