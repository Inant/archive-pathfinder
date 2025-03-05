
import React, { useState, useEffect } from 'react';
import { fileSystem, FileItem, FileData, calculateStatistics } from '@/utils/fileSystem';
import MainNavigation from '@/components/MainNavigation';
import Sidebar from '@/components/Sidebar';
import FileExplorer from '@/components/FileExplorer';
import FilePreview from '@/components/FilePreview';

const Index = () => {
  // State management
  const [selectedPath, setSelectedPath] = useState('/');
  const [breadcrumbs, setBreadcrumbs] = useState([{ name: 'Home', path: '/' }]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [statistics, setStatistics] = useState(calculateStatistics());

  // Filter current directory items based on search term
  const currentItems = fileSystem[selectedPath] 
    ? fileSystem[selectedPath].filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  // Navigate to a folder
  const navigateTo = (path: string) => {
    setSelectedPath(path);
    
    // Update breadcrumbs
    const pathParts = path.split('/').filter(Boolean);
    const newBreadcrumbs = [{ name: 'Home', path: '/' }];
    let currentPath = '/';
    
    pathParts.forEach(part => {
      currentPath += part + '/';
      newBreadcrumbs.push({
        name: part,
        path: currentPath
      });
    });
    
    setBreadcrumbs(newBreadcrumbs);
    setFileData(null);
  };

  // Open a file
  const openFile = (file: FileItem) => {
    setFileData({
      name: file.name,
      path: file.path,
      dateCreated: file.dateCreated,
      size: file.size,
      content: `This is a preview of the file "${file.name}". In a real application, this would display the actual file content or a preview appropriate to the file type.`
    });
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <MainNavigation />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar 
          selectedPath={selectedPath}
          navigateTo={navigateTo}
          statistics={statistics}
        />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex">
            <div className={`flex-1 flex flex-col overflow-hidden ${fileData ? 'lg:w-1/2' : 'w-full'}`}>
              <FileExplorer
                selectedPath={selectedPath}
                breadcrumbs={breadcrumbs}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                viewMode={viewMode}
                setViewMode={setViewMode}
                currentItems={currentItems}
                navigateTo={navigateTo}
                openFile={openFile}
              />
            </div>
            
            {fileData && (
              <div className="hidden lg:flex border-l border-gray-100 w-1/2 p-6 overflow-y-auto">
                <FilePreview 
                  fileData={fileData} 
                  onClose={() => setFileData(null)} 
                />
              </div>
            )}
          </div>
          
          {/* Mobile File Preview (shows only when a file is selected) */}
          {fileData && (
            <div className="lg:hidden border-t border-gray-100 p-6">
              <FilePreview 
                fileData={fileData} 
                onClose={() => setFileData(null)} 
              />
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-3 px-6 text-center text-sm text-gray-500">
        <p>Java Volcano Tour Operator - Archive Pathfinder © 2025</p>
      </footer>
    </div>
  );
};

export default Index;
