
import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder } from 'lucide-react';
import { FileItem, getFileIcon, getIconColor } from '@/utils/fileSystem';

interface TreeViewItemProps {
  path: string;
  name: string;
  fileSystem: Record<string, FileItem[]>;
  level: number;
  selectedPath: string;
  navigateTo: (path: string) => void;
}

const TreeViewItem: React.FC<TreeViewItemProps> = ({ 
  path, 
  name, 
  fileSystem, 
  level, 
  selectedPath, 
  navigateTo 
}) => {
  const [isOpen, setIsOpen] = useState(path === '/' || selectedPath.startsWith(path));
  const hasChildren = fileSystem[path] && fileSystem[path].some(item => item.type === 'folder');
  const isSelected = selectedPath === path;

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleClick = () => {
    navigateTo(path);
  };

  const renderChildren = () => {
    if (!isOpen || !fileSystem[path]) return null;

    const folders = fileSystem[path].filter(item => item.type === 'folder');
    
    return (
      <div className="pl-4 mt-1">
        {folders.map(item => (
          <TreeViewItem
            key={item.path}
            path={item.path}
            name={item.name}
            fileSystem={fileSystem}
            level={level + 1}
            selectedPath={selectedPath}
            navigateTo={navigateTo}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="mb-1">
      <div 
        className={`flex items-center py-1.5 px-2 rounded-md cursor-pointer transition-colors ${
          isSelected ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
        }`}
        onClick={handleClick}
      >
        <div className="w-4 mr-1" onClick={toggle}>
          {hasChildren && (
            isOpen ? 
              <ChevronDown className="w-4 h-4 text-gray-500" /> : 
              <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
        </div>
        {level === 0 ? 
          <Folder className="w-4 h-4 text-amber-500 mr-2" /> : 
          <div className="w-4 h-4 mr-2 flex items-center justify-center">
            {React.createElement(getFileIcon({ name, type: 'folder', path } as FileItem), { 
              className: `w-4 h-4 ${getIconColor({ name, type: 'folder', path } as FileItem)}` 
            })}
          </div>
        }
        <span className="text-sm truncate">{name}</span>
      </div>
      {renderChildren()}
    </div>
  );
};

interface TreeViewProps {
  fileSystem: Record<string, FileItem[]>;
  selectedPath: string;
  navigateTo: (path: string) => void;
}

const TreeView: React.FC<TreeViewProps> = ({ fileSystem, selectedPath, navigateTo }) => {
  return (
    <div className="py-2">
      <TreeViewItem
        path="/"
        name="Roots"
        fileSystem={fileSystem}
        level={0}
        selectedPath={selectedPath}
        navigateTo={navigateTo}
      />
    </div>
  );
};

export default TreeView;
