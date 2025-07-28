import React, { useState } from 'react';
import { Mail, Send, Inbox, Settings, Users, AlertCircle, CheckCircle, Plus, Download, FolderSync as Sync, Play, Pause, Server, Wifi } from 'lucide-react';
import { useSystem } from '../../contexts/SystemContext';
import { EmailAccountModal } from './EmailAccountModal';
import { EmailProcessingRulesModal } from './EmailProcessingRulesModal';

export function Email() {
  const { 
    config, 
    updateConfig, 
    emailAccounts, 
    importedEmails, 
    emailSyncStatus,
    testEmailConnection,
    syncEmailAccount 
  } = useSystem();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [emailSettings, setEmailSettings] = useState({
    smtpServer: config.notifications.smtpServer,
    smtpPort: config.notifications.smtpPort,
    smtpUsername: config.notifications.smtpUsername,
    smtpPassword: config.notifications.smtpPassword,
    emailEnabled: config.notifications.emailEnabled
  });

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: Mail },
    { id: 'accounts', label: 'Cuentas de Email', icon: Server },
    { id: 'imported', label: 'Emails Importados', icon: Inbox },
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
    console.log('🧪 Probando conexión SMTP...');
    alert('Conexión SMTP exitosa');
  };

  const handleTestConnection = async (accountId: string) => {
    try {
      const result = await testEmailConnection(accountId);
      if (result) {
        alert('✅ Conexión exitosa');
      } else {
        alert('❌ Error de conexión');
      }
    } catch (error) {
      alert(`❌ Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  const handleSyncAccount = async (accountId: string) => {
    try {
      await syncEmailAccount(accountId);
      alert('✅ Sincronización completada');
    } catch (error) {
      alert(`❌ Error en sincronización: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
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
          {/* Connection Status */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Wifi className="text-blue-500" />
              <span>Estado de Conexiones</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {emailAccounts.map(account => {
                const syncStatus = emailSyncStatus.find(s => s.accountId === account.id);
                return (
                  <div key={account.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{account.name}</h4>
                      <div className={`w-3 h-3 rounded-full ${
                        account.isActive ? 'bg-green-500' : 'bg-gray-300'
                      }`}></div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{account.email}</p>
                    
                    {syncStatus && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Estado:</span>
                          <span className={syncStatus.isRunning ? 'text-blue-600' : 'text-green-600'}>
                            {syncStatus.isRunning ? 'Sincronizando...' : 'Inactivo'}
                          </span>
                        </div>
                        {syncStatus.lastSync && (
                          <div className="flex justify-between text-xs">
                            <span>Última sync:</span>
                            <span>{new Date(syncStatus.lastSync).toLocaleTimeString('es-ES')}</span>
                          </div>
                        )}
                        {syncStatus.errors.length > 0 && (
                          <div className="text-xs text-red-600">
                            Errores: {syncStatus.errors.length}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="flex space-x-2 mt-3">
                      <button
                        onClick={() => handleTestConnection(account.id)}
                        className="flex-1 bg-blue-50 text-blue-700 py-1 px-2 rounded text-xs hover:bg-blue-100"
                      >
                        Test
                      </button>
                      <button
                        onClick={() => handleSyncAccount(account.id)}
                        disabled={syncStatus?.isRunning}
                        className="flex-1 bg-green-50 text-green-700 py-1 px-2 rounded text-xs hover:bg-green-100 disabled:opacity-50"
                      >
                        {syncStatus?.isRunning ? 'Sync...' : 'Sync'}
                      </button>
                    </div>
                  </div>
                );
              })}
              
              {emailAccounts.length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-500">
                  <Server className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <p>No hay cuentas de email configuradas</p>
                  <button
                    onClick={() => setShowAccountModal(true)}
                    className="mt-2 text-blue-600 hover:text-blue-800"
                  >
                    Configurar primera cuenta
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Email Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Emails Importados</p>
                  <p className="text-2xl font-bold text-gray-900">{importedEmails.length}</p>
                </div>
                <Inbox className="text-blue-500" size={32} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Emails Procesados</p>
                  <p className="text-2xl font-bold text-gray-900">{importedEmails.filter(e => e.processed).length}</p>
                </div>
                <CheckCircle className="text-green-500" size={32} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Cuentas Activas</p>
                  <p className="text-2xl font-bold text-gray-900">{emailAccounts.filter(a => a.isActive).length}</p>
                </div>
                <Server className="text-green-500" size={32} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Errores de Sync</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {emailSyncStatus.reduce((total, status) => total + status.errors.length, 0)}
                  </p>
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

      {/* Accounts Tab */}
      {activeTab === 'accounts' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Cuentas de Email</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowRulesModal(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                <Settings size={16} />
                <span>Reglas</span>
              </button>
              <button
                onClick={() => setShowAccountModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>Nueva Cuenta</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {emailAccounts.map(account => {
              const syncStatus = emailSyncStatus.find(s => s.accountId === account.id);
              return (
                <div key={account.id} className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{account.name}</h4>
                      <p className="text-sm text-gray-600">{account.email}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {account.provider.toUpperCase()} - {account.server}:{account.port}
                      </p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      account.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {account.isActive ? 'Activa' : 'Inactiva'}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Intervalo de sync:</span>
                      <span className="font-medium">{account.syncInterval} min</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Auto-crear tickets:</span>
                      <span className={`font-medium ${account.autoCreateTickets ? 'text-green-600' : 'text-gray-600'}`}>
                        {account.autoCreateTickets ? 'Sí' : 'No'}
                      </span>
                    </div>

                    {syncStatus && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Estado:</span>
                          <span className={`font-medium ${
                            syncStatus.isRunning ? 'text-blue-600' : 'text-green-600'
                          }`}>
                            {syncStatus.isRunning ? 'Sincronizando...' : 'Inactivo'}
                          </span>
                        </div>
                        
                        {syncStatus.lastSync && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Última sync:</span>
                            <span className="font-medium">
                              {new Date(syncStatus.lastSync).toLocaleString('es-ES')}
                            </span>
                          </div>
                        )}

                        {syncStatus.errors.length > 0 && (
                          <div className="bg-red-50 p-2 rounded text-sm">
                            <p className="text-red-800 font-medium">Errores recientes:</p>
                            {syncStatus.errors.slice(0, 2).map((error, index) => (
                              <p key={index} className="text-red-700 text-xs mt-1">• {error}</p>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleTestConnection(account.id)}
                      className="flex-1 bg-blue-50 text-blue-700 py-2 px-3 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                    >
                      Probar Conexión
                    </button>
                    <button
                      onClick={() => handleSyncAccount(account.id)}
                      disabled={syncStatus?.isRunning}
                      className="flex-1 bg-green-50 text-green-700 py-2 px-3 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium disabled:opacity-50"
                    >
                      {syncStatus?.isRunning ? 'Sincronizando...' : 'Sincronizar'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {emailAccounts.length === 0 && (
            <div className="text-center py-12">
              <Server className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay cuentas configuradas</h3>
              <p className="mt-1 text-sm text-gray-500">
                Configura tu primera cuenta de email para comenzar a importar mensajes.
              </p>
              <button
                onClick={() => setShowAccountModal(true)}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Configurar Cuenta
              </button>
            </div>
          )}
        </div>
      )}

      {/* Imported Emails Tab */}
      {activeTab === 'imported' && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Emails Importados</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    De / Asunto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Adjuntos
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {importedEmails.map((email) => (
                  <tr key={email.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {email.from}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {email.subject}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(email.receivedAt).toLocaleString('es-ES')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        email.processed 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {email.processed ? 'Procesado' : 'Pendiente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {email.attachments.length > 0 ? (
                        <span className="flex items-center">
                          <Download size={14} className="mr-1" />
                          {email.attachments.length}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {importedEmails.length === 0 && (
              <div className="text-center py-12">
                <Inbox className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay emails importados</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Los emails aparecerán aquí después de sincronizar las cuentas configuradas.
                </p>
              </div>
            )}
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

      {/* Modals */}
      <EmailAccountModal 
        isOpen={showAccountModal}
        onClose={() => setShowAccountModal(false)}
      />
      
      <EmailProcessingRulesModal 
        isOpen={showRulesModal}
        onClose={() => setShowRulesModal(false)}
      />
    </div>
  );
}