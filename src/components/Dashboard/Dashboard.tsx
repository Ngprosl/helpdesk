import React from 'react';
import { StatsCard } from './StatsCard';
import { TicketChart } from './TicketChart';
import { RecentTickets } from './RecentTickets';
import { TechnicianWorkload } from './TechnicianWorkload';
import { UnassignedTicketsAlert } from './UnassignedTicketsAlert';
import { useSystem } from '../../contexts/SystemContext';
import { 
  Ticket, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Users
} from 'lucide-react';

export function Dashboard() {
  const { dashboardStats, tickets, getUnassignedTickets } = useSystem();
  const unassignedTickets = getUnassignedTickets();

  const recentTickets = tickets.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Unassigned Tickets Alert */}
      {unassignedTickets.length > 0 && (
        <UnassignedTicketsAlert tickets={unassignedTickets} />
      )}
      
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Última actualización: {new Date().toLocaleString('es-ES')}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Tickets"
          value={dashboardStats.totalTickets}
          change="+12%"
          changeType="positive"
          icon={Ticket}
          color="blue"
        />
        <StatsCard
          title="Tickets Abiertos"
          value={dashboardStats.openTickets}
          change="-3%"
          changeType="negative"
          icon={AlertTriangle}
          color="orange"
        />
        <StatsCard
          title="En Progreso"
          value={dashboardStats.inProgressTickets}
          change="+8%"
          changeType="positive"
          icon={Clock}
          color="yellow"
        />
        <StatsCard
          title="Resueltos Hoy"
          value={dashboardStats.resolvedToday}
          change="+15%"
          changeType="positive"
          icon={CheckCircle}
          color="green"
        />
      </div>

      {/* Charts and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Tickets por Prioridad
          </h3>
          <TicketChart data={dashboardStats.activeTicketsByPriority} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Carga de Trabajo - Técnicos
          </h3>
          <TechnicianWorkload data={dashboardStats.technicianWorkload} />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Tickets Recientes
            </h3>
            <RecentTickets tickets={recentTickets} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Métricas Clave
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tiempo Promedio de Resolución</span>
                <span className="font-semibold">2.5 horas</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Satisfacción del Cliente</span>
                <span className="font-semibold text-green-600">
                  {dashboardStats.customerSatisfaction}/5.0
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tickets Auto-asignados</span>
                <span className="font-semibold">78%</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp size={24} />
              <span className="text-blue-100 text-sm">Este mes</span>
            </div>
            <h4 className="text-2xl font-bold mb-1">+23%</h4>
            <p className="text-blue-100">Mejora en tiempos de respuesta</p>
          </div>
        </div>
      </div>
    </div>
  );
}