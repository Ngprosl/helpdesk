import React from 'react';
import { AlertTriangle, Clock, User } from 'lucide-react';
import { useSystem } from '../../contexts/SystemContext';
import type { Ticket } from '../../types';

interface UnassignedTicketsAlertProps {
  tickets: Ticket[];
}

export function UnassignedTicketsAlert({ tickets }: UnassignedTicketsAlertProps) {
  const { assignTicketToAvailableTechnician } = useSystem();

  const handleAutoAssign = (ticketId: string) => {
    const success = assignTicketToAvailableTechnician(ticketId);
    if (!success) {
      alert('No hay técnicos disponibles en este momento');
    }
  };

  return (
    <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-lg">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-orange-400" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-orange-800">
            Tickets sin asignar ({tickets.length})
          </h3>
          <div className="mt-2 text-sm text-orange-700">
            <p className="mb-3">
              Hay {tickets.length} ticket{tickets.length > 1 ? 's' : ''} esperando asignación automática.
            </p>
            
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {tickets.slice(0, 3).map(ticket => (
                <div key={ticket.id} className="flex items-center justify-between bg-white p-2 rounded border">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-xs">#{ticket.id}</p>
                    <p className="text-gray-600 text-xs truncate max-w-xs">{ticket.title}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock size={12} className="text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {new Date(ticket.createdAt).toLocaleString('es-ES')}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAutoAssign(ticket.id)}
                    className="ml-2 bg-orange-600 text-white px-2 py-1 rounded text-xs hover:bg-orange-700 transition-colors flex items-center space-x-1"
                  >
                    <User size={12} />
                    <span>Asignar</span>
                  </button>
                </div>
              ))}
              
              {tickets.length > 3 && (
                <p className="text-xs text-orange-600 font-medium">
                  +{tickets.length - 3} tickets más sin asignar
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}