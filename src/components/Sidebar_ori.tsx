
import React from 'react';
import { fileSystem, Statistics } from '@/utils/fileSystem';
import StatisticsPanel from './StatisticsPanel';
import TreeView from './TreeView';

interface SidebarProps {
  selectedPath: string;
  navigateTo: (path: string) => void;
  statistics: Statistics;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedPath, navigateTo, statistics }) => {
  return (
    <div className="w-72 bg-white border-r border-gray-100 h-full flex flex-col">
      <div className="p-6">
        <h2 className="font-medium text-lg mb-6 text-gray-800">Archive Explorer</h2>
        
        <div className="mb-6">
          <h3 className="text-xs uppercase font-medium text-gray-400 mb-2 px-1">Folder Structure</h3>
          <TreeView 
            fileSystem={fileSystem} 
            selectedPath={selectedPath} 
            navigateTo={navigateTo} 
          />
        </div>
      </div>
      
      <div className="mt-auto px-6 pb-6">
        <StatisticsPanel statistics={statistics} />
      </div>
    </div>
  );
};

export default Sidebar;
