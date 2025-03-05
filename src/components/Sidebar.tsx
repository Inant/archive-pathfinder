import React from 'react';
import StatisticsPanel from './StatisticsPanel';
import TreeView from './TreeView';
import { FolderItem, FileItem, Statistics } from '@/pages/Index';
import { FolderOpen, Tag, Clock, Archive } from 'lucide-react';

interface SidebarProps {
    folderStructure: Record<string, FolderItem[]>;
    selectedFolderId: number | null;
    navigateTo: (folderId: number | null, path: string) => void;
    openFile: (file: FileItem) => void;
    statistics: Statistics;
}

const Sidebar: React.FC<SidebarProps> = ({
                                             folderStructure,
                                             selectedFolderId,
                                             navigateTo,
                                             openFile,
                                             statistics
                                         }) => {
    return (
        <div className="w-72 bg-white border-r border-gray-100 h-full flex flex-col">
            <div className="p-6">
                <h2 className="font-medium text-lg mb-6 text-gray-800">Archive Explorer</h2>

                {/* Quick Access Section */}
                <div className="mb-6">
                    <h3 className="text-xs uppercase font-medium text-gray-400 mb-2 px-1">Quick Access</h3>
                    <div className="space-y-1">
                        <button className="w-full flex items-center py-1.5 px-3 rounded-md hover:bg-gray-50 text-sm">
                            <FolderOpen className="w-5 h-5 text-blue-500 mr-2" />
                            <span>Recent Files</span>
                        </button>
                        <button className="w-full flex items-center py-1.5 px-3 rounded-md hover:bg-gray-50 text-sm">
                            <Tag className="w-5 h-5 text-green-500 mr-2" />
                            <span>Tagged Files</span>
                        </button>
                        <button className="w-full flex items-center py-1.5 px-3 rounded-md hover:bg-gray-50 text-sm">
                            <Clock className="w-5 h-5 text-amber-500 mr-2" />
                            <span>Recent Uploads</span>
                        </button>
                        <button className="w-full flex items-center py-1.5 px-3 rounded-md hover:bg-gray-50 text-sm">
                            <Archive className="w-5 h-5 text-purple-500 mr-2" />
                            <span>Archives</span>
                        </button>
                    </div>
                </div>

                {/* Folder Structure Section */}
                <div className="mb-6">
                    <h3 className="text-xs uppercase font-medium text-gray-400 mb-2 px-1">Folder Structure</h3>
                    <div className="overflow-y-auto max-h-96 pr-1">
                        <TreeView
                            folderStructure={folderStructure}
                            selectedFolderId={selectedFolderId}
                            navigateTo={navigateTo}
                            openFile={openFile}
                        />
                    </div>
                </div>
            </div>

            <div className="mt-auto px-6 pb-6">
                <StatisticsPanel statistics={statistics} />
            </div>
        </div>
    );
};

export default Sidebar;