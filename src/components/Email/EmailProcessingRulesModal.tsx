import React, { useState } from 'react';
import { X, Plus, Trash2, Settings, Filter } from 'lucide-react';
import { useSystem } from '../../contexts/SystemContext';
import type { EmailCondition, EmailAction } from '../../types';

interface EmailProcessingRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EmailProcessingRulesModal({ isOpen, onClose }: EmailProcessingRulesModalProps) {
  const { createEmailProcessingRule, users } = useSystem();
  const [formData, setFormData] = useState({
    name: '',
    isActive: true,
    priority: 1
  });
  const [conditions, setConditions] = useState<EmailCondition[]>([
    { field: 'subject', operator: 'contains', value: '', caseSensitive: false }
  ]);
  const [actions, setActions] = useState<EmailAction[]>([
    { type: 'create_ticket', value: 'true' }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || conditions.length === 0 || actions.length === 0) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    createEmailProcessingRule({
      ...formData,
      conditions,
      actions
    });
    
    setFormData({ name: '', isActive: true, priority: 1 });
    setConditions([{ field: 'subject', operator: 'contains', value: '', caseSensitive: false }]);
    setActions([{ type: 'create_ticket', value: 'true' }]);
    onClose();
  };

  const addCondition = () => {
    setConditions([...conditions, { field: 'subject', operator: 'contains', value: '', caseSensitive: false }]);
  };

  const removeCondition = (index: number) => {
    if (conditions.length > 1) {
      setConditions(conditions.filter((_, i) => i !== index));
    }
  };

  const updateCondition = (index: number, field: keyof EmailCondition, value: any) => {
    const updated = conditions.map((condition, i) => 
      i === index ? { ...condition, [field]: value } : condition
    );
    setConditions(updated);
  };

  const addAction = () => {
    setActions([...actions, { type: 'create_ticket', value: 'true' }]);
  };

  const removeAction = (index: number) => {
    if (actions.length > 1) {
      setActions(actions.filter((_, i) => i !== index));
    }
  };

  const updateAction = (index: number, field: keyof EmailAction, value: any) => {
    const updated = actions.map((action, i) => 
      i === index ? { ...action, [field]: value } : action
    );
    setActions(updated);
  };

  const technicians = users.filter(user => user.role === 'technician');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
            <Filter className="text-blue-600" />
            <span>Crear Regla de Procesamiento</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la Regla *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tickets de impresora"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prioridad
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Menor número = mayor prioridad</p>
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
                Regla activa
              </label>
            </div>
          </div>

          {/* Conditions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Condiciones</h3>
              <button
                type="button"
                onClick={addCondition}
                className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1 text-sm"
              >
                <Plus size={16} />
                <span>Agregar Condición</span>
              </button>
            </div>

            <div className="space-y-4">
              {conditions.map((condition, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Condición #{index + 1}</h4>
                    {conditions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCondition(index)}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Campo
                      </label>
                      <select
                        value={condition.field}
                        onChange={(e) => updateCondition(index, 'field', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="from">De (remitente)</option>
                        <option value="to">Para (destinatario)</option>
                        <option value="subject">Asunto</option>
                        <option value="body">Cuerpo del mensaje</option>
                        <option value="attachment">Adjuntos</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Operador
                      </label>
                      <select
                        value={condition.operator}
                        onChange={(e) => updateCondition(index, 'operator', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="contains">Contiene</option>
                        <option value="equals">Es igual a</option>
                        <option value="starts_with">Comienza con</option>
                        <option value="ends_with">Termina con</option>
                        <option value="regex">Expresión regular</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Valor
                      </label>
                      <input
                        type="text"
                        value={condition.value}
                        onChange={(e) => updateCondition(index, 'value', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="impresora"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`caseSensitive_${index}`}
                        checked={condition.caseSensitive}
                        onChange={(e) => updateCondition(index, 'caseSensitive', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor={`caseSensitive_${index}`} className="ml-2 text-sm text-gray-700">
                        Sensible a mayúsculas
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Acciones</h3>
              <button
                type="button"
                onClick={addAction}
                className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1 text-sm"
              >
                <Plus size={16} />
                <span>Agregar Acción</span>
              </button>
            </div>

            <div className="space-y-4">
              {actions.map((action, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Acción #{index + 1}</h4>
                    {actions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAction(index)}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de Acción
                      </label>
                      <select
                        value={action.type}
                        onChange={(e) => updateAction(index, 'type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="create_ticket">Crear ticket</option>
                        <option value="assign_category">Asignar categoría</option>
                        <option value="set_priority">Establecer prioridad</option>
                        <option value="assign_technician">Asignar técnico</option>
                        <option value="add_tag">Agregar etiqueta</option>
                        <option value="ignore">Ignorar email</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Valor
                      </label>
                      {action.type === 'create_ticket' && (
                        <select
                          value={action.value}
                          onChange={(e) => updateAction(index, 'value', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="true">Sí</option>
                          <option value="false">No</option>
                        </select>
                      )}
                      {action.type === 'set_priority' && (
                        <select
                          value={action.value}
                          onChange={(e) => updateAction(index, 'value', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="low">Baja</option>
                          <option value="medium">Media</option>
                          <option value="high">Alta</option>
                          <option value="critical">Crítica</option>
                        </select>
                      )}
                      {action.type === 'assign_technician' && (
                        <select
                          value={action.value}
                          onChange={(e) => updateAction(index, 'value', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Seleccionar técnico</option>
                          {technicians.map(tech => (
                            <option key={tech.id} value={tech.id}>{tech.name}</option>
                          ))}
                        </select>
                      )}
                      {(action.type === 'assign_category' || action.type === 'add_tag') && (
                        <input
                          type="text"
                          value={action.value}
                          onChange={(e) => updateAction(index, 'value', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={action.type === 'assign_category' ? 'hardware' : 'urgente'}
                        />
                      )}
                      {action.type === 'ignore' && (
                        <input
                          type="text"
                          value="true"
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
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
              <span>Crear Regla</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}