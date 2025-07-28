import React, { useState } from 'react';
import { BarChart3, Download, Calendar, Filter, TrendingUp, Clock, Users, Ticket } from 'lucide-react';
import { useSystem } from '../../contexts/SystemContext';

export function Reports() {
  const { tickets, dashboardStats } = useSystem();
  const [dateRange, setDateRange] = useState('last30days');
  const [reportType, setReportType] = useState('tickets');

  const generateReport = () => {
    // Simular generación de reporte
    const reportData = {
      type: reportType,
      dateRange: dateRange,
      generatedAt: new Date().toISOString(),
      data: tickets.slice(0, 10) // Datos de ejemplo
    };

    // Crear y descargar archivo CSV
    const csvContent = generateCSVContent(reportData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `reporte_${reportType}_${dateRange}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert('Reporte generado y descargado exitosamente');
  };

  const generateCSVContent = (reportData: any) => {
    let csv = 'ID,Título,Estado,Prioridad,Categoría,Creado,Tiempo Gastado\n';
    
    if (reportData.type === 'tickets') {
      reportData.data.forEach((ticket: any) => {
        csv += `${ticket.id},"${ticket.title}",${ticket.status},${ticket.priority},${ticket.category},${new Date(ticket.createdAt).toLocaleDateString()},${ticket.timeSpent}\n`;
      });
    }
    
    return csv;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Informes y Estadísticas</h1>
        <button 
          onClick={generateReport}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Download size={20} />
          <span>Exportar Reporte</span>
        </button>
      </div>

      {/* Report Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Reporte</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="tickets">Tickets</option>
              <option value="technicians">Técnicos</option>
              <option value="categories">Categorías</option>
              <option value="time">Tiempo de Resolución</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Período</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="last7days">Últimos 7 días</option>
              <option value="last30days">Últimos 30 días</option>
              <option value="last3months">Últimos 3 meses</option>
              <option value="lastyear">Último año</option>
              <option value="custom">Personalizado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Desde</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hasta</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tickets</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalTickets}</p>
            </div>
            <Ticket className="text-blue-500" size={32} />
          </div>
          <div className="mt-2 flex items-center text-sm">
            <TrendingUp className="text-green-500 mr-1" size={16} />
            <span className="text-green-600">+12% vs período anterior</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tiempo Promedio</p>
              <p className="text-2xl font-bold text-gray-900">2.5h</p>
            </div>
            <Clock className="text-orange-500" size={32} />
          </div>
          <div className="mt-2 flex items-center text-sm">
            <TrendingUp className="text-green-500 mr-1" size={16} />
            <span className="text-green-600">-8% vs período anterior</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Satisfacción</p>
              <p className="text-2xl font-bold text-gray-900">4.2/5</p>
            </div>
            <Users className="text-green-500" size={32} />
          </div>
          <div className="mt-2 flex items-center text-sm">
            <TrendingUp className="text-green-500 mr-1" size={16} />
            <span className="text-green-600">+5% vs período anterior</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resueltos</p>
              <p className="text-2xl font-bold text-gray-900">89%</p>
            </div>
            <BarChart3 className="text-purple-500" size={32} />
          </div>
          <div className="mt-2 flex items-center text-sm">
            <TrendingUp className="text-green-500 mr-1" size={16} />
            <span className="text-green-600">+3% vs período anterior</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tickets por Estado</h3>
          <div className="space-y-4">
            {Object.entries(dashboardStats.activeTicketsByPriority).map(([priority, count]) => {
              const total = Object.values(dashboardStats.activeTicketsByPriority).reduce((sum, c) => sum + c, 0);
              const percentage = total > 0 ? (count / total) * 100 : 0;
              
              return (
                <div key={priority} className="flex items-center space-x-4">
                  <div className="w-20 text-sm font-medium text-gray-600 capitalize">
                    {priority}
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="h-2.5 rounded-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-12 text-sm font-semibold text-gray-900 text-right">
                    {count}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rendimiento por Técnico</h3>
          <div className="space-y-4">
            {Object.entries(dashboardStats.technicianWorkload).map(([techId, ticketCount]) => {
              const maxTickets = Math.max(...Object.values(dashboardStats.technicianWorkload), 1);
              const percentage = (ticketCount / maxTickets) * 100;
              
              return (
                <div key={techId} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Técnico {techId}</span>
                    <span className="text-sm text-gray-500">{ticketCount} tickets</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Detalle de Tickets</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Título
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tiempo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Técnico
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tickets.slice(0, 10).map((ticket) => (
                <tr key={ticket.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{ticket.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {ticket.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {Math.floor(ticket.timeSpent / 60)}h {ticket.timeSpent % 60}m
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {ticket.assignedTechnicians.length > 0 ? `${ticket.assignedTechnicians.length} técnico(s)` : 'Sin asignar'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}