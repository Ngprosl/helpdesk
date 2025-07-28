import React, { useState, useEffect } from 'react';
import { X, Building, Plus, Trash2, MapPin, Save } from 'lucide-react';
import { useSystem } from '../../contexts/SystemContext';
import type { Department } from '../../types';

interface EditDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  department: Department | null;
}

export function EditDepartmentModal({ isOpen, onClose, department }: EditDepartmentModalProps) {
  const { updateDepartment } = useSystem();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3b82f6',
    isActive: true
  });
  const [supportAreas, setSupportAreas] = useState([
    { id: '', name: '', description: '', keywords: '', priority: 1 }
  ]);

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name,
        description: department.description,
        color: department.color,
        isActive: department.isActive
      });
      setSupportAreas(department.supportAreas.map(area => ({
        id: area.id,
        name: area.name,
        description: area.description,
        keywords: area.keywords.join(', '),
        priority: area.priority
      })));
    }
  }, [department]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !department) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    const validAreas = supportAreas.filter(area => area.name.trim());
    if (validAreas.length === 0) {
      alert('Debe tener al menos un área de soporte');
      return;
    }

    const updates = {
      name: formData.name,
      description: formData.description,
      color: formData.color,
      isActive: formData.isActive,
      supportAreas: validAreas.map((area) => ({
        id: area.id || `area_${Date.now()}_${Math.random()}`,
        name: area.name,
        description: area.description,
        keywords: area.keywords.split(',').map(k => k.trim()).filter(k => k),
        priority: area.priority
      }))
    };

    updateDepartment(department.id, updates);
    onClose();
  };

  const addSupportArea = () => {
    setSupportAreas([...supportAreas, { 
      id: '', 
      name: '', 
      description: '', 
      keywords: '', 
      priority: 1 
    }]);
  };

  const removeSupportArea = (index: number) => {
    if (supportAreas.length > 1) {
      setSupportAreas(supportAreas.filter((_, i) => i !== index));
    }
  };

  const updateSupportArea = (index: number, field: string, value: any) => {
    const updated = supportAreas.map((area, i) => 
      i === index ? { ...area, [field]: value } : area
    );
    setSupportAreas(updated);
  };

  if (!isOpen || !department) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
            <Building className="text-blue-600" />
            <span>Editar Departamento</span>
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
                Nombre del Departamento *
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
                Color del Departamento
              </label>
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Áreas de Soporte</h3>
              <button
                type="button"
                onClick={addSupportArea}
                className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1 text-sm"
              >
                <Plus size={16} />
                <span>Agregar Área</span>
              </button>
            </div>

            <div className="space-y-4">
              {supportAreas.map((area, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900 flex items-center">
                      <MapPin size={16} className="mr-2" />
                      Área de Soporte #{index + 1}
                    </h4>
                    {supportAreas.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSupportArea(index)}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del Área *
                      </label>
                      <input
                        type="text"
                        value={area.name}
                        onChange={(e) => updateSupportArea(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prioridad
                      </label>
                      <select
                        value={area.priority}
                        onChange={(e) => updateSupportArea(index, 'priority', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value={1}>Alta (1)</option>
                        <option value={2}>Media (2)</option>
                        <option value={3}>Baja (3)</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción
                    </label>
                    <textarea
                      value={area.description}
                      onChange={(e) => updateSupportArea(index, 'description', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Palabras Clave (separadas por comas)
                    </label>
                    <input
                      type="text"
                      value={area.keywords}
                      onChange={(e) => updateSupportArea(index, 'keywords', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="ej: impresora, pc, monitor, instalación"
                    />
                  </div>
                </div>
              ))}
            </div>
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
              Departamento activo
            </label>
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
              <Save size={16} />
              <span>Guardar Cambios</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}