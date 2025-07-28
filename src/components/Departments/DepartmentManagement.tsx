import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Building, MapPin, Users } from 'lucide-react';
import { useSystem } from '../../contexts/SystemContext';
import { CreateDepartmentModal } from './CreateDepartmentModal';
import { EditDepartmentModal } from './EditDepartmentModal';
import type { Department } from '../../types';

export function DepartmentManagement() {
  const { departments, users, deleteDepartment } = useSystem();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDepartmentTechnicians = (deptName: string) => {
    return users.filter(user => user.role === 'technician' && user.department === deptName);
  };

  const handleEditDepartment = (department: Department) => {
    setSelectedDepartment(department);
    setShowEditModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Departamentos</h1>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Nuevo Departamento</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar departamentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDepartments.map((department) => {
          const technicians = getDepartmentTechnicians(department.name);
          
          return (
            <div key={department.id} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: department.color + '20' }}
                  >
                    <Building size={20} style={{ color: department.color }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{department.name}</h3>
                    <p className="text-sm text-gray-500">{department.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleEditDepartment(department)}
                    className="text-blue-600 hover:text-blue-900 p-1 rounded"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => deleteDepartment(department.id)}
                    className="text-red-600 hover:text-red-900 p-1 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Áreas de Soporte:</span>
                  <span className="font-semibold">{department.supportAreas.length}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Técnicos Asignados:</span>
                  <span className="font-semibold">{technicians.length}</span>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Áreas de Soporte:</h4>
                  <div className="flex flex-wrap gap-1">
                    {department.supportAreas.slice(0, 3).map(area => (
                      <span
                        key={area.id}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        <MapPin size={10} className="mr-1" />
                        {area.name}
                      </span>
                    ))}
                    {department.supportAreas.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{department.supportAreas.length - 3} más
                      </span>
                    )}
                  </div>
                </div>

                {technicians.length > 0 && (
                  <div className="pt-3 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Técnicos:</h4>
                    <div className="space-y-1">
                      {technicians.slice(0, 2).map(tech => (
                        <div key={tech.id} className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <Users size={12} className="text-white" />
                          </div>
                          <span className="text-sm text-gray-700">{tech.name}</span>
                          <div className={`w-2 h-2 rounded-full ${tech.isOnline ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        </div>
                      ))}
                      {technicians.length > 2 && (
                        <span className="text-xs text-gray-500 ml-8">
                          +{technicians.length - 2} más
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredDepartments.length === 0 && (
        <div className="text-center py-12">
          <Building className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay departamentos</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm
              ? 'No se encontraron departamentos con los filtros aplicados.'
              : 'Comienza creando un nuevo departamento.'
            }
          </p>
        </div>
      )}

      <CreateDepartmentModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
      
      <EditDepartmentModal 
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedDepartment(null);
        }}
        department={selectedDepartment}
      />
    </div>
  );
}