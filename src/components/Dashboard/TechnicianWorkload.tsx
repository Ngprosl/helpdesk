import React from 'react';

interface TechnicianWorkloadProps {
  data: Record<string, number>;
}

// Mock data para nombres de técnicos
const technicianNames: Record<string, string> = {
  '1': 'Juan Pérez',
  '2': 'María García',
  '3': 'Carlos López',
  '4': 'Ana Martín'
};

export function TechnicianWorkload({ data }: TechnicianWorkloadProps) {
  const maxTickets = Math.max(...Object.values(data), 1);
  
  return (
    <div className="space-y-4">
      {Object.entries(data).map(([techId, ticketCount]) => {
        const percentage = (ticketCount / maxTickets) * 100;
        const techName = technicianNames[techId] || `Técnico ${techId}`;
        
        return (
          <div key={techId} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">{techName}</span>
              <span className="text-sm text-gray-500">{ticketCount} tickets</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        );
      })}
      
      {Object.keys(data).length === 0 && (
        <div className="text-center py-4 text-gray-500">
          No hay datos de carga de trabajo
        </div>
      )}
    </div>
  );
}