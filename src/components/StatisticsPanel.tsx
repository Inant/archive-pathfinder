
import React from 'react';
import { BarChart2, Users, FileText } from 'lucide-react';
import { Statistics } from '@/utils/fileSystem';

interface StatisticsPanelProps {
  statistics: Statistics;
}

const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ statistics }) => {
  return (
    <div className="mt-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100 animate-fade-in">
      <h3 className="font-medium text-lg mb-4 flex items-center">
        <BarChart2 className="w-4 h-4 mr-2 text-primary/70" />
        Analytics Overview
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
          <div className="flex items-center mb-2">
            <FileText className="w-4 h-4 text-blue-500 mr-2" />
            <span className="text-sm font-medium text-blue-700">Total Files</span>
          </div>
          <p className="text-2xl font-semibold text-blue-800">{statistics.totalFiles}</p>
        </div>
        
        <div className="p-4 rounded-lg bg-green-50 border border-green-100">
          <div className="flex items-center mb-2">
            <Users className="w-4 h-4 text-green-500 mr-2" />
            <span className="text-sm font-medium text-green-700">Bookings</span>
          </div>
          <p className="text-2xl font-semibold text-green-800">{statistics.totalBookings}</p>
        </div>
        
        <div className="p-4 rounded-lg bg-purple-50 border border-purple-100">
          <div className="flex items-center mb-2">
            <BarChart2 className="w-4 h-4 text-purple-500 mr-2" />
            <span className="text-sm font-medium text-purple-700">Channels</span>
          </div>
          <p className="text-2xl font-semibold text-purple-800">3</p>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Channel Distribution</h4>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs font-medium text-gray-600">JVTO</span>
              <span className="text-xs font-medium text-gray-600">{statistics.channelDistribution.JVTO} files</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-blue-500 h-1.5 rounded-full" 
                style={{ width: `${(statistics.channelDistribution.JVTO / statistics.totalFiles) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs font-medium text-gray-600">Klook</span>
              <span className="text-xs font-medium text-gray-600">{statistics.channelDistribution.Klook} files</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-green-500 h-1.5 rounded-full" 
                style={{ width: `${(statistics.channelDistribution.Klook / statistics.totalFiles) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs font-medium text-gray-600">TWT</span>
              <span className="text-xs font-medium text-gray-600">{statistics.channelDistribution.TWT} files</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-purple-500 h-1.5 rounded-full" 
                style={{ width: `${(statistics.channelDistribution.TWT / statistics.totalFiles) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPanel;
