import React, { useState } from 'react';
import { Mail, Send, Inbox, Settings, Users, AlertCircle, CheckCircle } from 'lucide-react';
import { useSystem } from '../../contexts/SystemContext';

export function Email() {
  const { config, updateConfig } = useSystem();
  const [activeTab, setActiveTab] = useState('overview');
  const [emailSettings, setEmailSettings] = useState({
    smtpServer: config.notifications.smtpServer,
    smtpPort: config.notifications.smtpPort,
    smtpUsername: config.notifications.smtpUsername,
    smtpPassword: config.notifications.smtpPassword,
    emailEnabled: config.notifications.emailEnabled
  });

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: Mail },
    { id: 'settings', label: 'Configuración SMTP', icon: Settings },
    { id: 'templates', label: 'Plantillas', icon: Inbox },
    { id: 'logs', label: 'Historial', icon: Users }
  ];

  const handleSaveSettings = () => {
    updateConfig({
      notifications: {
        ...config.notifications,
        ...emailSettings
      }
    });
    alert('Configuración de correo guardada correctamente');
  };

  const testConnection = () => {
    // Simulación de test de conexión
    setTimeout(() => {
      alert('Conexión SMTP exitosa');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
          <Mail className="text-blue-600" />
          <span>Gestión de Correo Electrónico</span>
        </h1>
        
        <div className="flex items-center space-x-2">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            config.notifications.emailEnabled 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {config.notifications.emailEnabled ? 'Activo' : 'Inactivo'}
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
                    ? 'border-blue-500 text-blue-600'
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
          {/* Email Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Emails Enviados Hoy</p>
                  <p className="text-2xl font-bold text-gray-900">24</p>
                </div>
                <Send className="text-blue-500" size={32} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Emails Pendientes</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
                <Inbox className="text-orange-500" size={32} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tasa de Entrega</p>
                  <p className="text-2xl font-bold text-gray-900">98%</p>
                </div>
                <CheckCircle className="text-green-500" size={32} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Errores</p>
                  <p className="text-2xl font-bold text-gray-900">1</p>
                </div>
                <AlertCircle className="text-red-500" size={32} />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración de Notificaciones</h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Notificar nuevos tickets</span>
                <input
                  type="checkbox"
                  checked={config.notifications.newTicketNotification}
                  onChange={(e) => updateConfig({
                    notifications: { 
                      ...config.notifications, 
                      newTicketNotification: e.target.checked 
                    }
                  })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
              
              <label className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Notificar actualizaciones de tickets</span>
                <input
                  type="checkbox"
                  checked={config.notifications.ticketUpdatedNotification}
                  onChange={(e) => updateConfig({
                    notifications: { 
                      ...config.notifications, 
                      ticketUpdatedNotification: e.target.checked 
                    }
                  })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </label>

              <label className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Notificar asignaciones</span>
                <input
                  type="checkbox"
                  checked={config.notifications.assignmentNotification}
                  onChange={(e) => updateConfig({
                    notifications: { 
                      ...config.notifications, 
                      assignmentNotification: e.target.checked 
                    }
                  })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* SMTP Settings Tab */}
      {activeTab === 'settings' && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Configuración del Servidor SMTP</h3>
          
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={emailSettings.emailEnabled}
                  onChange={(e) => setEmailSettings({
                    ...emailSettings,
                    emailEnabled: e.target.checked
                  })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">
                  Habilitar envío de correos electrónicos
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Servidor SMTP
                </label>
                <input
                  type="text"
                  value={emailSettings.smtpServer}
                  onChange={(e) => setEmailSettings({
                    ...emailSettings,
                    smtpServer: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="smtp.gmail.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Puerto SMTP
                </label>
                <input
                  type="number"
                  value={emailSettings.smtpPort}
                  onChange={(e) => setEmailSettings({
                    ...emailSettings,
                    smtpPort: parseInt(e.target.value)
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="587"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Usuario SMTP
                </label>
                <input
                  type="text"
                  value={emailSettings.smtpUsername}
                  onChange={(e) => setEmailSettings({
                    ...emailSettings,
                    smtpUsername: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="usuario@empresa.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña SMTP
                </label>
                <input
                  type="password"
                  value={emailSettings.smtpPassword}
                  onChange={(e) => setEmailSettings({
                    ...emailSettings,
                    smtpPassword: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4 pt-6 border-t border-gray-200">
              <button
                onClick={testConnection}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Probar Conexión
              </button>
              <button
                onClick={handleSaveSettings}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Guardar Configuración
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Plantillas de Correo</h3>
          
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Nuevo Ticket Creado</h4>
              <p className="text-sm text-gray-600 mb-3">
                Plantilla enviada cuando se crea un nuevo ticket
              </p>
              <div className="bg-gray-50 p-3 rounded text-sm">
                <strong>Asunto:</strong> Nuevo ticket creado - #{'{ticket_id}'}<br/>
                <strong>Contenido:</strong> Se ha creado un nuevo ticket con ID #{'{ticket_id}'}. 
                Título: {'{ticket_title}'}. Puede hacer seguimiento en el sistema.
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Ticket Asignado</h4>
              <p className="text-sm text-gray-600 mb-3">
                Plantilla enviada cuando se asigna un ticket a un técnico
              </p>
              <div className="bg-gray-50 p-3 rounded text-sm">
                <strong>Asunto:</strong> Ticket asignado - #{'{ticket_id}'}<br/>
                <strong>Contenido:</strong> Se le ha asignado el ticket #{'{ticket_id}'}. 
                Título: {'{ticket_title}'}. Prioridad: {'{ticket_priority}'}.
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Ticket Resuelto</h4>
              <p className="text-sm text-gray-600 mb-3">
                Plantilla enviada cuando se resuelve un ticket
              </p>
              <div className="bg-gray-50 p-3 rounded text-sm">
                <strong>Asunto:</strong> Ticket resuelto - #{'{ticket_id}'}<br/>
                <strong>Contenido:</strong> Su ticket #{'{ticket_id}'} ha sido resuelto. 
                Solución: {'{resolution_notes}'}. Tiempo de resolución: {'{resolution_time}'}.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logs Tab */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Historial de Correos</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="text-green-500" size={16} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-900">Email enviado exitosamente</p>
                  <p className="text-xs text-green-700">
                    Para: user@company.com - Asunto: Nuevo ticket creado - {new Date().toLocaleString('es-ES')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <Send className="text-blue-500" size={16} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">Email enviado exitosamente</p>
                  <p className="text-xs text-blue-700">
                    Para: tech1@company.com - Asunto: Ticket asignado - {new Date(Date.now() - 3600000).toLocaleString('es-ES')}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                <AlertCircle className="text-red-500" size={16} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-900">Error al enviar email</p>
                  <p className="text-xs text-red-700">
                    Para: invalid@email.com - Error: Dirección no válida - {new Date(Date.now() - 7200000).toLocaleString('es-ES')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}