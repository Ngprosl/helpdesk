import React, { useState } from 'react';
import { Bot, Send, Settings, Zap, MessageSquare, Brain } from 'lucide-react';
import { useSystem } from '../../contexts/SystemContext';

export function AIAssistant() {
  const { config, updateConfig } = useSystem();
  const [activeTab, setActiveTab] = useState<'chat' | 'config' | 'suggestions'>('chat');
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{
    type: 'user' | 'ai';
    content: string;
    timestamp: string;
  }>>([]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      type: 'user' as const,
      content: message,
      timestamp: new Date().toISOString()
    };

    setChatHistory(prev => [...prev, userMessage]);
    setMessage('');

    // Simulación mejorada de respuesta de AI
    setTimeout(() => {
      const responses = [
        `He analizado tu consulta: "${message}". Basándome en los tickets históricos y la base de conocimientos, te sugiero revisar los artículos relacionados con ${message.toLowerCase()}. ¿Te gustaría que busque soluciones específicas?`,
        `Para el problema "${message}", he encontrado 3 soluciones similares en nuestra base de datos. La más efectiva ha sido reiniciar el servicio correspondiente. ¿Quieres que te guíe paso a paso?`,
        `Según mi análisis, "${message}" es un problema común. He categorizado automáticamente este tipo de consultas como prioridad media. ¿Necesitas que cree un ticket automáticamente?`,
        `He procesado tu solicitud sobre "${message}". Basándome en patrones similares, recomiendo verificar la configuración de red primero. ¿Te ayudo con los pasos de diagnóstico?`
      ];
      
      const aiResponse = {
        type: 'ai' as const,
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toISOString()
      };
      setChatHistory(prev => [...prev, aiResponse]);
    }, 1500);
  };

  const toggleAIProvider = (providerId: string, enabled: boolean) => {
    const updatedProviders = config.ai.providers.map(provider =>
      provider.id === providerId ? { ...provider, enabled } : provider
    );

    updateConfig({
      ai: {
        ...config.ai,
        providers: updatedProviders,
        enabled: updatedProviders.some(p => p.enabled)
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
          <Bot className="text-blue-600" />
          <span>AI Assistant</span>
        </h1>
        
        <div className="flex items-center space-x-2">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            config.ai.enabled 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {config.ai.enabled ? 'Activo' : 'Inactivo'}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'chat', label: 'Chat Inteligente', icon: MessageSquare },
            { id: 'suggestions', label: 'Sugerencias', icon: Brain },
            { id: 'config', label: 'Configuración', icon: Settings }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
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

      {/* Chat Tab */}
      {activeTab === 'chat' && (
        <div className="bg-white rounded-lg shadow-sm border h-96 flex flex-col">
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {chatHistory.length === 0 ? (
              <div className="text-center text-gray-500 mt-20">
                <Bot size={48} className="mx-auto mb-4 text-gray-300" />
                <p>¡Hola! Soy tu asistente de AI. Puedo ayudarte con:</p>
                <ul className="mt-4 space-y-2 text-sm">
                  <li>• Sugerir soluciones para tickets</li>
                  <li>• Categorizar automáticamente tickets</li>
                  <li>• Buscar en la base de conocimientos</li>
                  <li>• Generar informes inteligentes</li>
                </ul>
              </div>
            ) : (
              chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString('es-ES')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Escribe tu consulta..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!config.ai.enabled}
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim() || !config.ai.enabled}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suggestions Tab */}
      {activeTab === 'suggestions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Zap className="text-yellow-500" />
              <span>Soluciones Automáticas</span>
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-900">Ticket #123</p>
                <p className="text-sm text-blue-700">Problema de impresión → Reiniciar spooler</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-green-900">Ticket #124</p>
                <p className="text-sm text-green-700">Error de conexión → Verificar firewall</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Categorización Inteligente
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Precisión actual</span>
                <span className="font-semibold text-green-600">94%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tickets procesados</span>
                <span className="font-semibold">1,247</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tiempo ahorrado</span>
                <span className="font-semibold text-blue-600">15.3 horas</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Configuration Tab */}
      {activeTab === 'config' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Proveedores de AI
            </h3>
            <div className="space-y-4">
              {config.ai.providers.map(provider => (
                <div key={provider.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{provider.name}</h4>
                    <p className="text-sm text-gray-500">
                      {provider.features.length} funciones disponibles
                    </p>
                  </div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={provider.enabled}
                      onChange={(e) => toggleAIProvider(provider.id, e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      provider.enabled ? 'bg-blue-600' : 'bg-gray-200'
                    }`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        provider.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Configuración de Funciones
            </h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Sugerencias automáticas de soluciones</span>
                <input
                  type="checkbox"
                  checked={config.ai.autoSuggestSolutions}
                  onChange={(e) => updateConfig({
                    ai: { ...config.ai, autoSuggestSolutions: e.target.checked }
                  })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
              
              <label className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Categorización automática de tickets</span>
                <input
                  type="checkbox"
                  checked={config.ai.autoCategorizTickets}
                  onChange={(e) => updateConfig({
                    ai: { ...config.ai, autoCategorizTickets: e.target.checked }
                  })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </label>

              <label className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Chatbot habilitado</span>
                <input
                  type="checkbox"
                  checked={config.ai.chatbotEnabled}
                  onChange={(e) => updateConfig({
                    ai: { ...config.ai, chatbotEnabled: e.target.checked }
                  })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}