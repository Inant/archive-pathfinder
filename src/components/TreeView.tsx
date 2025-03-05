import React, { useState, useEffect } from 'react';
import {
    ChevronRight,
    ChevronDown,
    Folder,
    FileText,
    Calendar,
    DollarSign,
    Truck,
    BarChart2,
    Users,
    Building,
    Map,
    Activity,
    Image,
    File as FileIcon
} from 'lucide-react';
import { FolderItem, FileItem } from '@/pages/Index';
import { folderService } from '@/services/api';

interface TreeViewItemProps {
    item: FolderItem | FileItem;
    folderStructure: Record<string, (FolderItem | FileItem)[]>;
    level: number;
    selectedFolderId: number | null;
    selectedFileId: number | null;
    navigateTo: (folderId: number | null, path: string) => void;
    openFile: (file: FileItem) => void;
}

const TreeViewItem: React.FC<TreeViewItemProps> = ({
                                                       item,
                                                       folderStructure,
                                                       level,
                                                       selectedFolderId,
                                                       selectedFileId,
                                                       navigateTo,
                                                       openFile
                                                   }) => {
    const isFolder = item.type === 'folder';
    const folder = isFolder ? (item as FolderItem) : null;
    const file = !isFolder ? (item as FileItem) : null;

    // Key path for folders
    const folderPath = isFolder ? (folder?.path || '/') + folder?.name + '/' : null;

    const [isOpen, setIsOpen] = useState(
        (isFolder && folder?.id === selectedFolderId) ||
        (isFolder && selectedFolderId !== null && folderStructure[folderPath!]?.some(
            f => (f.type === 'folder' && f.id === selectedFolderId) ||
                (folderStructure[(f as FolderItem).path + (f as FolderItem).name + '/']?.some(
                    subItem => subItem.type === 'folder' && subItem.id === selectedFolderId
                ))
        ))
    );

    const [childItems, setChildItems] = useState<(FolderItem | FileItem)[]>([]);
    const [loading, setLoading] = useState(false);

    const hasChildren = isFolder && folderStructure[folderPath!]?.length > 0;
    const isSelected = (isFolder && folder?.id === selectedFolderId) ||
        (!isFolder && file?.id === selectedFileId);

    // Load children (folders and files) when a folder is expanded
    useEffect(() => {
        const loadChildren = async () => {
            if (isFolder && isOpen && folder) {
                setLoading(true);
                try {
                    const response = await folderService.getFolderContents(folder.id);
                    const { subfolders, files } = response.data.data;

                    // Combine subfolders and files
                    const items = [
                        ...subfolders.map((subfolder: FolderItem) => ({
                            ...subfolder,
                            type: 'folder'
                        })),
                        ...files.map((file: FileItem) => ({
                            ...file,
                            type: 'file'
                        }))
                    ];

                    setChildItems(items);

                    // Update folder structure with subfolders for deeper navigation
                    if (folderPath && subfolders.length > 0) {
                        folderStructure[folderPath] = subfolders.map(subfolder => ({
                            ...subfolder,
                            type: 'folder'
                        }));
                    }
                } catch (error) {
                    console.error('Error loading folder contents:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        loadChildren();
    }, [isFolder, isOpen, folder?.id, folderPath]);

    const toggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    const handleClick = () => {
        if (isFolder) {
            navigateTo(folder!.id, folderPath!);
        } else {
            openFile(file!);
        }
    };

    const getFolderIconName = () => {
        return folder?.folderType?.icon_name || 'Folder';
    };

    const getFolderIconColor = () => {
        return folder?.folderType?.icon_color || 'text-amber-500';
    };

    const getFileIconName = () => {
        const extension = file?.original_name.split('.').pop()?.toLowerCase();

        if (extension === 'pdf') {
            return 'FileText';
        } else if (['xlsx', 'xls', 'csv'].includes(extension || '')) {
            return 'FileSpreadsheet';
        } else if (['jpg', 'png', 'gif', 'jpeg'].includes(extension || '')) {
            return 'Image';
        } else {
            return 'FileIcon';
        }
    };

    const getFileIconColor = () => {
        return file?.fileType?.icon_color || 'text-gray-500';
    };

    const renderChildren = () => {
        if (!isFolder || !isOpen) return null;

        if (loading) {
            return (
                <div className="pl-6 mt-1 text-xs text-gray-500">
                    Loading...
                </div>
            );
        }

        if (childItems.length === 0) {
            return (
                <div className="pl-6 mt-1 text-xs text-gray-500">
                    Empty folder
                </div>
            );
        }

        return (
            <div className="pl-6 mt-1">
                {childItems.map(childItem => (
                    <TreeViewItem
                        key={`${childItem.type}-${childItem.id}`}
                        item={childItem}
                        folderStructure={folderStructure}
                        level={level + 1}
                        selectedFolderId={selectedFolderId}
                        selectedFileId={selectedFileId}
                        navigateTo={navigateTo}
                        openFile={openFile}
                    />
                ))}
            </div>
        );
    };

    // Menggunakan komponen ikon yang tepat berdasarkan tipe dan nama ikon
    const IconComponent = () => {
        const iconName = isFolder ? getFolderIconName() : getFileIconName();
        const colorClass = isFolder ? getFolderIconColor() : getFileIconColor();

        switch (iconName) {
            case 'Folder':
                return <Folder className={`w-5 h-5 ${colorClass}`} />;
            case 'FileText':
                return <FileText className={`w-5 h-5 ${colorClass}`} />;
            case 'FileSpreadsheet':
                return <FileText className={`w-5 h-5 ${colorClass}`} />;
            case 'Calendar':
                return <Calendar className={`w-5 h-5 ${colorClass}`} />;
            case 'DollarSign':
                return <DollarSign className={`w-5 h-5 ${colorClass}`} />;
            case 'Truck':
                return <Truck className={`w-5 h-5 ${colorClass}`} />;
            case 'BarChart2':
                return <BarChart2 className={`w-5 h-5 ${colorClass}`} />;
            case 'Users':
                return <Users className={`w-5 h-5 ${colorClass}`} />;
            case 'Building':
                return <Building className={`w-5 h-5 ${colorClass}`} />;
            case 'Map':
                return <Map className={`w-5 h-5 ${colorClass}`} />;
            case 'Activity':
                return <Activity className={`w-5 h-5 ${colorClass}`} />;
            case 'Image':
                return <Image className={`w-5 h-5 ${colorClass}`} />;
            case 'FileIcon':
                return <FileIcon className={`w-5 h-5 ${colorClass}`} />;
            default:
                return isFolder
                    ? <Folder className={`w-5 h-5 ${colorClass}`} />
                    : <FileIcon className={`w-5 h-5 ${colorClass}`} />;
        }
    };

    const indentLevel = level * 0.5;

    return (
        <div className="mb-1">
            <div
                className={`flex items-center py-1.5 px-2 rounded-md cursor-pointer transition-colors ${
                    isSelected ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
                }`}
                onClick={handleClick}
            >
                <div className="w-5 mr-1" onClick={toggle}>
                    {isFolder && (
                        isOpen ?
                            <ChevronDown className="w-5 h-5 text-gray-500" /> :
                            <ChevronRight className="w-5 h-5 text-gray-500" />
                    )}
                </div>

                <div className="mr-2 flex items-center justify-center">
                    <IconComponent />
                </div>

                <span className="text-sm truncate">{isFolder ? folder?.name : file?.original_name}</span>
            </div>
            {renderChildren()}
        </div>
    );
};

interface TreeViewProps {
    folderStructure: Record<string, FolderItem[]>;
    selectedFolderId: number | null;
    navigateTo: (folderId: number | null, path: string) => void;
    openFile: (file: FileItem) => void;
}

const TreeView: React.FC<TreeViewProps> = ({
                                               folderStructure,
                                               selectedFolderId,
                                               navigateTo,
                                               openFile
                                           }) => {
    const [selectedFileId, setSelectedFileId] = useState<number | null>(null);

    // Wrapper for openFile to also set selectedFileId
    const handleOpenFile = (file: FileItem) => {
        setSelectedFileId(file.id);
        openFile(file);
    };

    if (!folderStructure['/'] || folderStructure['/'].length === 0) {
        return (
            <div className="py-2 text-sm text-gray-500">
                Loading folder structure...
            </div>
        );
    }

    return (
        <div className="py-2">
            {folderStructure['/'].map(folder => (
                <TreeViewItem
                    key={`folder-${folder.id}`}
                    item={{...folder, type: 'folder'}}
                    folderStructure={folderStructure as Record<string, (FolderItem | FileItem)[]>}
                    level={0}
                    selectedFolderId={selectedFolderId}
                    selectedFileId={selectedFileId}
                    navigateTo={navigateTo}
                    openFile={handleOpenFile}
                />
            ))}
        </div>
    );
};

export default TreeView;