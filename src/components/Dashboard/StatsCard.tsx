import React from 'react';
import { DivideIcon as LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  change: string;
  changeType: 'positive' | 'negative';
  icon: LucideIcon;
  color: 'blue' | 'green' | 'yellow' | 'orange' | 'red';
}

const colorClasses = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  orange: 'bg-orange-500',
  red: 'bg-red-500'
};

export function StatsCard({ title, value, change, changeType, icon: Icon, color }: StatsCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
          <div className="flex items-center mt-2">
            {changeType === 'positive' ? (
              <TrendingUp className="text-green-500 mr-1" size={16} />
            ) : (
              <TrendingDown className="text-red-500 mr-1" size={16} />
            )}
            <span className={`text-sm font-medium ${
              changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              {change}
            </span>
            <span className="text-sm text-gray-500 ml-1">vs mes anterior</span>
          </div>
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon className="text-white" size={24} />
        </div>
      </div>
    </div>
  );
}