import React from 'react';
import type { Ticket } from '../../types';
import { Clock, User, AlertCircle } from 'lucide-react';

interface RecentTicketsProps {
  tickets: Ticket[];
}

const statusColors = {
  open: 'bg-red-100 text-red-800',
  'in-progress': 'bg-yellow-100 text-yellow-800',
  waiting: 'bg-blue-100 text-blue-800',
  resolved: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800'
};

const priorityColors = {
  low: 'text-green-600',
  medium: 'text-yellow-600',
  high: 'text-orange-600',
  critical: 'text-red-600'
};

export function RecentTickets({ tickets }: RecentTicketsProps) {
  return (
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <div key={ticket.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="flex-shrink-0">
            <div className={`w-2 h-2 rounded-full ${priorityColors[ticket.priority]}`}></div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 truncate">
              {ticket.title}
            </h4>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[ticket.status]}`}>
                {ticket.status}
              </span>
              <span className="text-xs text-gray-500">#{ticket.id}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Clock size={14} />
              <span>{new Date(ticket.createdAt).toLocaleDateString('es-ES')}</span>
            </div>
            
            {ticket.assignedTechnicians.length > 0 && (
              <div className="flex items-center space-x-1">
                <User size={14} />
                <span>{ticket.assignedTechnicians.length}</span>
              </div>
            )}
            
            <div className={`flex items-center space-x-1 ${priorityColors[ticket.priority]}`}>
              <AlertCircle size={14} />
              <span className="capitalize">{ticket.priority}</span>
            </div>
          </div>
        </div>
      ))}
      
      {tickets.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No hay tickets recientes
        </div>
      )}
    </div>
  );
}