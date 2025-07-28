import React from 'react';

interface TicketChartProps {
  data: Record<string, number>;
}

const priorityColors = {
  low: '#10b981',
  medium: '#f59e0b',
  high: '#ef4444',
  critical: '#7c2d12'
};

export function TicketChart({ data }: TicketChartProps) {
  const total = Object.values(data).reduce((sum, count) => sum + count, 0);

  return (
    <div className="space-y-4">
      {Object.entries(data).map(([priority, count]) => {
        const percentage = total > 0 ? (count / total) * 100 : 0;
        
        return (
          <div key={priority} className="flex items-center space-x-4">
            <div className="w-20 text-sm font-medium text-gray-600 capitalize">
              {priority}
            </div>
            <div className="flex-1">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="h-2.5 rounded-full transition-all duration-300"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: priorityColors[priority as keyof typeof priorityColors] || '#gray-500'
                  }}
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
  );
}