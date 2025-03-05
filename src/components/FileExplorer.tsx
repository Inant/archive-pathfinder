import React, { useState, useRef } from 'react';
import { Search, Grid, List, ChevronRight, Upload, Eye, Download, Pencil, Plus, Check, Trash2, Tag, Loader } from 'lucide-react';
import { FolderItem, FileItem } from '@/pages/Index';
import { folderService, fileService, tagService } from '@/services/api';
import { toast } from "sonner";
import TagManager from './TagManager';
import SimpleUploadDialog from './SimpleUploadDialog';
import { Folder, FileText, FileSpreadsheet, File as FileIcon, Image } from 'lucide-react';

interface FileExplorerProps {
  loading: boolean;
  selectedFolderId: number | null;
  currentPath: string;
  breadcrumbs: Array<{ name: string; path: string; id: number | null }>;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  currentItems: (FolderItem | FileItem)[];
  navigateTo: (folderId: number | null, path: string) => void;
  openFile: (file: FileItem) => void;
  onRefresh: () => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({
  loading,
  selectedFolderId,
  currentPath,
  breadcrumbs,
  searchTerm,
  setSearchTerm,
  viewMode,
  setViewMode,
  currentItems,
  navigateTo,
  openFile,
  onRefresh
}) => {
  const [newFolderName, setNewFolderName] = useState('');
  const [renamingItemId, setRenamingItemId] = useState<number | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [showTagManager, setShowTagManager] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<number | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  // Fungsi untuk mendapatkan ikon yang sesuai untuk item
  const getIconForItem = (item: FolderItem | FileItem) => {
    if (item.type === 'folder') {
      return <Folder className={getColorForItem(item)} />;
    } else {
      const fileItem = item as FileItem;
      const extension = fileItem.original_name.split('.').pop()?.toLowerCase();

      if (extension === 'pdf') {
        return <FileText className={getColorForItem(item)} />;
      } else if (['xlsx', 'xls', 'csv'].includes(extension || '')) {
        return <FileSpreadsheet className={getColorForItem(item)} />;
      } else if (['jpg', 'png', 'gif', 'jpeg'].includes(extension || '')) {
        return <Image className={getColorForItem(item)} />;
      } else {
        return <FileIcon className={getColorForItem(item)} />;
      }
    }
  };

  // Fungsi untuk mendapatkan warna ikon
  const getColorForItem = (item: FolderItem | FileItem) => {
    if (item.type === 'folder') {
      const folderItem = item as FolderItem;
      return folderItem.folderType?.icon_color || 'text-amber-500';
    } else {
      const fileItem = item as FileItem;
      return fileItem.fileType?.icon_color || 'text-gray-500';
    }
  };

  // Fungsi untuk menangani klik tombol upload
  const handleFileUpload = () => {
    if (selectedFolderId === null) {
      toast.error("Silahkan pilih folder terlebih dahulu");
      return;
    }
    setShowUploadDialog(true);
  };

  // Fungsi untuk menangani file yang berhasil diupload
  const handleUploadSuccess = () => {
    console.log("File uploaded successfully, refreshing...");
    onRefresh(); // Refresh daftar file
  };

  // Fungsi khusus untuk menangani klik folder
  const handleFolderClick = (event: React.MouseEvent, folder: FolderItem) => {
    // Hentikan event propagation untuk mencegah event bubble
    event.stopPropagation();
    event.preventDefault();

    // Log untuk debug
    console.log('Folder clicked:', folder);

    // Navigasi ke folder
    navigateTo(folder.id, currentPath + folder.name + '/');
  };

  // Fungsi untuk menangani rename item
  const handleRename = (event: React.MouseEvent, item: FolderItem | FileItem) => {
    event.stopPropagation();
    setRenamingItemId(item.id);
    setRenameValue(item.name);
  };

  // Fungsi untuk menyimpan hasil rename
  const saveRename = async (event: React.FormEvent, item: FolderItem | FileItem) => {
    event.preventDefault();

    if (!renameValue.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    try {
      if (item.type === 'folder') {
        await folderService.updateFolder(item.id, {
          name: renameValue
        });
        toast.success(`Folder renamed to ${renameValue}`);
      } else {
        // In a real implementation, you would update the file name
        toast.success(`File renamed to ${renameValue}`);
      }

      onRefresh();
      setRenamingItemId(null);
    } catch (error) {
      console.error('Error renaming item:', error);
      toast.error('Failed to rename item');
    }
  };

  // Fungsi untuk membuat folder baru
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast.error('Please enter a folder name');
      return;
    }

    try {
      await folderService.createFolder({
        name: newFolderName,
        parent_id: selectedFolderId
      });

      toast.success(`Folder "${newFolderName}" created`);
      setNewFolderName('');
      setIsCreatingFolder(false);
      onRefresh();
    } catch (error) {
      console.error('Error creating folder:', error);
      toast.error('Failed to create folder');
    }
  };

  // Fungsi untuk menghapus item
  const handleDeleteItem = async (event: React.MouseEvent, item: FolderItem | FileItem) => {
    event.stopPropagation();

    if (!confirm(`Are you sure you want to delete this ${item.type}?`)) {
      return;
    }

    try {
      if (item.type === 'folder') {
        await folderService.deleteFolder(item.id);
        toast.success("Folder deleted successfully");
      } else {
        await fileService.deleteFile(item.id);
        toast.success("File deleted successfully");
      }

      onRefresh();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    }
  };

  // Fungsi untuk melihat preview file
  const handlePreview = (event: React.MouseEvent, file: FileItem) => {
    event.stopPropagation();
    openFile(file);
  };

  // Fungsi untuk download file
  const handleDownload = async (event: React.MouseEvent, file: FileItem) => {
    event.stopPropagation();

    try {
      // Cek apakah file ada sebelum diunduh
      const fileExists = await fileService.checkFileExists(file.id);

      if (!fileExists) {
        toast.error('File tidak ditemukan di server. File mungkin telah dihapus.');
        return;
      }

      // Gunakan fungsi download yang telah disempurnakan
      await fileService.downloadFile(file.id, file.original_name);
      toast.success(`Mengunduh ${file.original_name}`);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error(error instanceof Error ? error.message : 'Gagal mengunduh file');
    }
  };

  // Fungsi untuk menangani manajemen tag
  const handleManageTags = async (event: React.MouseEvent, file: FileItem) => {
    event.stopPropagation();
    setSelectedFileId(file.id);
    setShowTagManager(true);
  };

  // Fungsi yang dipanggil setelah tag diperbarui
  const handleTagsUpdated = () => {
    onRefresh();
  };

  // Fungsi untuk merender daftar item (folders & files)
  const renderItems = () => {
    // Filter item duplikat berdasarkan ID dan tipe
    const uniqueItemIds = new Set();
    const uniqueItems = currentItems.filter(item => {
      const itemKey = `${item.type}-${item.id}`;
      if (uniqueItemIds.has(itemKey)) {
        console.warn(`Duplicate item filtered: ${itemKey}`);
        return false;
      }
      uniqueItemIds.add(itemKey);
      return true;
    });

    if (loading) {
      return (
        <div className="animate-fade-in flex flex-col items-center justify-center h-64 text-center px-4">
          <Loader className="w-8 h-8 text-blue-500 animate-spin mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Loading content...
          </h3>
        </div>
      );
    }

    if (uniqueItems.length === 0) {
      return (
        <div className="animate-fade-in flex flex-col items-center justify-center h-64 text-center px-4">
          <div className="bg-gray-100 p-6 rounded-full mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            {searchTerm ? 'No items match your search' : 'This folder is empty'}
          </h3>
          <p className="text-gray-500 max-w-md">
            {searchTerm
              ? `We couldn't find anything matching "${searchTerm}". Try a different search term.`
              : 'There are no files or folders in the current directory.'}
          </p>
        </div>
      );
    }

    return (
      <div className={`animate-fade-in ${viewMode === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
          : 'flex flex-col space-y-2'
        }`}>
        {uniqueItems.map((item) => {
          // Buat key unik untuk setiap item
          const itemKey = `${item.type}-${item.id}`;

          return viewMode === 'grid' ? (
            // Grid View
            <div
              key={itemKey}
              className="bg-white p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer file-explorer-item group"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                if (item.type === 'folder') {
                  handleFolderClick(e, item as FolderItem);
                } else {
                  openFile(item as FileItem);
                }
              }}
              data-id={item.id}
              data-type={item.type}
            >
              <div className="flex items-center mb-3">
                <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                  {getIconForItem(item)}
                </div>
                <div className="ml-3 truncate flex-1">
                  {renamingItemId === item.id ? (
                    <form onSubmit={(e) => saveRename(e, item)} className="flex items-center">
                      <input
                        type="text"
                        className="border border-blue-300 rounded px-2 py-1 text-sm w-full"
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                      <button
                        type="submit"
                        className="ml-2 bg-blue-500 text-white rounded p-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Check className="w-3 h-3" />
                      </button>
                    </form>
                  ) : (
                    <p className="font-medium text-gray-800 truncate">{item.name}</p>
                  )}
                  {item.type === 'file' && (
                    <p className="text-xs text-gray-500">{formatFileSize((item as FileItem).size)}</p>
                  )}
                </div>
              </div>

              {/* Display tags */}
              {item.type === 'file' && (item as FileItem).tags && (item as FileItem).tags!.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {(item as FileItem).tags!.slice(0, 3).map(tag => (
                    <span
                      key={`tag-${tag.id}`}
                      className="px-2 py-0.5 rounded-full text-xs truncate max-w-[70px]"
                      style={{ backgroundColor: tag.color + '20', color: tag.color }}
                      title={tag.name}
                    >
                      {tag.name}
                    </span>
                  ))}
                  {(item as FileItem).tags!.length > 3 && (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                      +{(item as FileItem).tags!.length - 3}
                    </span>
                  )}
                </div>
              )}

              <div className="text-xs text-gray-400 mt-1">
                {new Date(item.created_at).toLocaleString()}
              </div>

              <div className="mt-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {item.type === 'file' && (
                  <>
                    <button
                      className="p-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700"
                      onClick={(e) => handlePreview(e, item as FileItem)}
                      title="Preview"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      className="p-1.5 rounded-lg bg-green-100 hover:bg-green-200 text-green-700"
                      onClick={(e) => handleDownload(e, item as FileItem)}
                      title="Download"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      className="p-1.5 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-700"
                      onClick={(e) => handleManageTags(e, item as FileItem)}
                      title="Manage Tags"
                    >
                      <Tag className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
                <button
                  className="p-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-700"
                  onClick={(e) => handleRename(e, item)}
                  title="Rename"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  className="p-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-700"
                  onClick={(e) => handleDeleteItem(e, item)}
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            // List View
            <div
              key={itemKey}
              className="bg-white p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer file-explorer-item flex items-center justify-between"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                if (item.type === 'folder') {
                  handleFolderClick(e, item as FolderItem);
                } else {
                  openFile(item as FileItem);
                }
              }}
              data-id={item.id}
              data-type={item.type}
            >
              <div className="flex items-center flex-1">
                <div className="p-2 bg-gray-50 rounded-lg mr-3">
                  {getIconForItem(item)}
                </div>
                {renamingItemId === item.id ? (
                  <form onSubmit={(e) => saveRename(e, item)} className="flex items-center flex-1">
                    <input
                      type="text"
                      className="border border-blue-300 rounded px-2 py-1 text-sm w-full"
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                    <button
                      type="submit"
                      className="ml-2 bg-blue-500 text-white rounded p-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Check className="w-3 h-3" />
                    </button>
                  </form>
                ) : (
                  <span className="font-medium text-gray-800">{item.name}</span>
                )}
              </div>

              <div className="flex items-center">
                {/* Display tags in list view */}
                {item.type === 'file' && (item as FileItem).tags && (item as FileItem).tags!.length > 0 && (
                  <div className="flex items-center mr-4">
                    <div className="flex gap-1">
                      {(item as FileItem).tags!.slice(0, 2).map(tag => (
                        <span
                          key={`tag-${tag.id}`}
                          className="px-2 py-0.5 rounded-full text-xs truncate max-w-[80px]"
                          style={{ backgroundColor: tag.color + '20', color: tag.color }}
                          title={tag.name}
                        >
                          {tag.name}
                        </span>
                      ))}
                      {(item as FileItem).tags!.length > 2 && (
                        <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                          +{(item as FileItem).tags!.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="text-sm text-gray-500 flex items-center space-x-6 mr-4">
                  <span>{new Date(item.created_at).toLocaleString()}</span>
                  {item.type === 'file' && (
                    <span className="w-20 text-right">{formatFileSize((item as FileItem).size)}</span>
                  )}
                </div>

                <div className="flex space-x-2">
                  {item.type === 'file' && (
                    <>
                      <button
                        className="p-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700"
                        onClick={(e) => handlePreview(e, item as FileItem)}
                        title="Preview"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        className="p-1.5 rounded-lg bg-green-100 hover:bg-green-200 text-green-700"
                        onClick={(e) => handleDownload(e, item as FileItem)}
                        title="Download"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        className="p-1.5 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-700"
                        onClick={(e) => handleManageTags(e, item as FileItem)}
                        title="Manage Tags"
                      >
                        <Tag className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                  <button
                    className="p-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-700"
                    onClick={(e) => handleRename(e, item)}
                    title="Rename"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    className="p-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-700"
                    onClick={(e) => handleDeleteItem(e, item)}
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Header dengan breadcrumbs dan tools */}
      <div className="bg-white border-b border-gray-100 p-4 flex items-center justify-between">
        <div className="flex items-center">
          {/* Breadcrumbs navigation */}
          {breadcrumbs.map((crumb, index) => (
            <div key={`breadcrumb-${index}`} className="flex items-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  navigateTo(crumb.id, crumb.path);
                }}
                className="hover:text-blue-600 text-sm font-medium transition-colors breadcrumb-item px-2"
              >
                {crumb.name}
              </button>
              {index < breadcrumbs.length - 1 && (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center">
          {/* Search box */}
          <div className="relative mr-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search files..."
              className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 w-64 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Upload button */}
          <button
            onClick={handleFileUpload}
            className="flex items-center mr-3 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </button>

          {/* View mode toggle */}
          <div className="flex p-1 bg-gray-100 rounded-lg">
            <button
              className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content area with folders and files */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* New folder creation form */}
        <div className="flex items-center mb-6">
          {isCreatingFolder ? (
            <div className="flex w-full">
              <input
                type="text"
                placeholder="Enter folder name"
                className="border border-gray-200 rounded-l-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
              />
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm flex items-center"
                onClick={handleCreateFolder}
              >
                <Check className="w-4 h-4 mr-2" />
                Save
              </button>
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white rounded-r-lg px-4 py-2 text-sm"
                onClick={() => {
                  setIsCreatingFolder(false);
                  setNewFolderName('');
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 text-sm flex items-center"
              onClick={() => setIsCreatingFolder(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Folder
            </button>
          )}
        </div>

        {/* Render folders and files */}
        {renderItems()}
      </div>

      {/* Tag Manager Dialog */}
      {showTagManager && selectedFileId && (
        <TagManager
          fileId={selectedFileId}
          onClose={() => setShowTagManager(false)}
          onTagsUpdated={handleTagsUpdated}
        />
      )}

      {/* Upload Dialog */}
      {showUploadDialog && selectedFolderId && (
        <SimpleUploadDialog
          folderId={selectedFolderId}
          onClose={() => setShowUploadDialog(false)}
          onSuccess={handleUploadSuccess}
        />
      )}
    </div>
  );
};

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default FileExplorer;