
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileText, BarChart2, FolderPlus } from 'lucide-react';

const MainNavigation: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white border-b border-gray-100 py-4 px-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-medium text-gray-800 mr-10">Java Volcano Tour Operator</h1>
          <div className="flex items-center space-x-1">
            <Link
              to="/"
              className={`flex items-center px-4 py-2 rounded-lg ${
                isActive('/') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FileText className="w-4 h-4 mr-2" />
              <span>File Management</span>
            </Link>
            <Link
              to="/reports"
              className={`flex items-center px-4 py-2 rounded-lg ${
                isActive('/reports') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BarChart2 className="w-4 h-4 mr-2" />
              <span>Reports</span>
            </Link>
            <Link
              to="/shared-resources"
              className={`flex items-center px-4 py-2 rounded-lg ${
                isActive('/shared-resources') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FolderPlus className="w-4 h-4 mr-2" />
              <span>Shared Resources</span>
            </Link>
          </div>
        </div>
        <div className="text-sm text-gray-500">Archive Pathfinder</div>
      </div>
    </nav>
  );
};

export default MainNavigation;
