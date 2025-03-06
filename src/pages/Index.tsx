import React, { useState, useEffect } from 'react';
import MainNavigation from '@/components/MainNavigation';
import Sidebar from '@/components/Sidebar';
import FileExplorer from '@/components/FileExplorer';
import FilePreview from '@/components/FilePreview';
import { folderService, fileService } from '@/services/api';
import { toast } from 'sonner';

// Definisi tipe data yang sesuai dengan API
export interface FileItem {
  id: number;
  name: string;
  original_name: string;
  type: 'file';
  folder_id: number;
  file_type_id: number | null;
  path: string;
  size: number;
  mime_type: string | null;
  created_at: string;
  updated_at: string;
  tags?: Tag[];
  fileType?: FileType;
}

export interface FolderItem {
  id: number;
  name: string;
  type: 'folder';
  parent_id: number | null;
  folder_type_id: number | null;
  order_channel_id: number | null;
  path: string;
  is_system_folder: boolean;
  created_at: string;
  updated_at: string;
  folderType?: FolderType;
  children?: FolderItem[]; // Array untuk subfolder
}

export interface FileType {
  id: number;
  extension: string;
  icon_name: string;
  icon_color: string;
}

export interface FolderType {
  id: number;
  name: string;
  icon_name: string;
  icon_color: string;
}

export interface Tag {
  id: number;
  name: string;
  color: string;
  description: string | null;
}

export interface FileData {
  id: number;
  name: string;
  original_name: string;
  path: string;
  size: number;
  mime_type: string | null;
  created_at: string;
  tags?: Tag[];
  content?: string; // Simulasi konten preview
}

export interface Statistics {
  totalBookings: number;
  totalFiles: number;
  channelDistribution: {
    JVTO: number;
    Klook: number;
    TWT: number;
    [key: string]: number;
  };
}


const Index = () => {
  // State management
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [currentPath, setCurrentPath] = useState('/');
  const [breadcrumbs, setBreadcrumbs] = useState([{ name: 'Back', path: '/', id: null }]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [statistics, setStatistics] = useState<Statistics>({
    totalBookings: 0,
    totalFiles: 0,
    channelDistribution: {
      JVTO: 0,
      Klook: 0,
      TWT: 0
    }
  });
  const [currentItems, setCurrentItems] = useState<(FolderItem | FileItem)[]>([]);
  const [loading, setLoading] = useState(true);
  const [folderStructure, setFolderStructure] = useState<Record<string, FolderItem[]>>({});

  // Memuat statistik
  const loadStatistics = async () => {
    try {
      // Dalam implementasi nyata, Anda perlu endpoint API khusus untuk statistik
      // Atau menghitungnya dari data yang tersedia
      const response = await fileService.searchFiles({});
      const filesData = response.data.data.data;

      const stats = {
        totalFiles: filesData.length,
        totalBookings: filesData.filter((file: FileItem) =>
            file.name.toLowerCase().includes('booking')).length,
        channelDistribution: {
          JVTO: filesData.filter((file: FileItem) =>
              file.path.includes('/JVTO/')).length,
          Klook: filesData.filter((file: FileItem) =>
              file.path.includes('/Klook/')).length,
          TWT: filesData.filter((file: FileItem) =>
              file.path.includes('/TWT/')).length
        }
      };

      setStatistics(stats);
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  // Memuat struktur folder untuk sidebar
  const loadFolderStructure = async () => {
    try {
      console.log('Loading folder structure...');
      const response = await folderService.getFolderTree();
      const folders = response.data.data;

      // Membuat struktur folder untuk sidebar
      const structure: Record<string, FolderItem[]> = {};

      // Inisialisasi struktur untuk root
      structure['/'] = [];

      // Fungsi rekursif untuk memproses folder dan subfolder
      const processFolder = (folder: FolderItem, parentPath = '/') => {
        // Log untuk debugging
        console.log('Processing folder:', { name: folder.name, path: folder.path, id: folder.id });

        // Pastikan folder memiliki tipe
        folder.type = 'folder';

        // Pastikan path ada
        if (!folder.path) {
          folder.path = parentPath;
        }

        // Pastikan array untuk parent path sudah ada
        if (!structure[parentPath]) {
          structure[parentPath] = [];
        }

        // Cek apakah folder sudah ada di struktur (hindari duplikasi)
        const folderExists = structure[parentPath].some(f => f.id === folder.id);
        if (!folderExists) {
          structure[parentPath].push({ ...folder }); // Salin objek untuk menghindari referensi yang sama
        }

        // Proses children jika ada
        if (folder.children && folder.children.length > 0) {
          // Path untuk child akan jadi folderPath + folder.name + '/'
          const childParentPath = folder.path + folder.name + '/';

          // Inisialisasi struktur untuk child path
          if (!structure[childParentPath]) {
            structure[childParentPath] = [];
          }

          // Proses setiap child folder
          folder.children.forEach(childFolder => {
            // Pastikan child folder memiliki path
            if (!childFolder.path) {
              childFolder.path = childParentPath;
            }
            processFolder({ ...childFolder }, childParentPath); // Salin objek untuk menghindari referensi yang sama
          });
        }
      };

      // Proses folder root dan log
      console.log('Root folders:', folders.length);
      folders.forEach(folder => {
        processFolder({ ...folder }); // Salin objek untuk menghindari referensi yang sama
      });

      console.log('Folder structure processed:', Object.keys(structure).length, 'paths');
      setFolderStructure(structure);
    } catch (error) {
      console.error('Error loading folder structure:', error);
      toast.error('Gagal memuat struktur folder');
    }
  };


  // Memuat konten folder saat ini
  const loadCurrentFolder = async () => {
    setLoading(true);
    try {
      if (selectedFolderId === null) {
        // Jika tidak ada folder yang dipilih, tampilkan folder root
        const response = await folderService.getFolders();
        const rootFolders = response.data.data.map((folder: FolderItem) => ({
          ...folder,
          type: 'folder'
        }));
        setCurrentItems(rootFolders);
      } else {
        // Memuat konten folder yang dipilih
        const response = await folderService.getFolderContents(selectedFolderId);
        const { subfolders, files } = response.data.data;

        // Gabungkan subfolder dan file
        let items = [
          ...subfolders.map((folder: FolderItem) => ({
            ...folder,
            type: 'folder'
          })),
          ...files.map((file: FileItem) => ({
            ...file,
            type: 'file'
          }))
        ];

        // Jika filter tag aktif, terapkan pada file
        if (selectedTagIds.length > 0) {
          // Dapatkan file yang memiliki semua tag yang dipilih
          const filteredFiles = files.filter((file: FileItem) => {
            if (!file.tags) return false;
            // Periksa apakah file memiliki semua tag yang dipilih
            return selectedTagIds.every(tagId =>
              file.tags!.some(tag => tag.id === tagId)
            );
          });

          items = [
            ...items,
            ...filteredFiles.map((file: FileItem) => ({
              ...file,
              type: 'file'
            }))
          ];
        } else {
          // Tanpa filter, tampilkan semua file
          items = [
            ...items,
            ...files.map((file: FileItem) => ({
              ...file,
              type: 'file'
            }))
          ];
        }

        setCurrentItems(items);
      }
    } catch (error) {
      console.error('Error loading folder contents:', error);
      toast.error('Failed to load folder contents');
      setCurrentItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter items berdasarkan kata kunci pencarian
  const filteredItems = searchTerm
      ? currentItems.filter(item =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      : currentItems;

  // Navigasi ke folder
  // Fungsi navigasi yang direvisi untuk breadcrumb yang berfungsi dengan baik
  const navigateTo = async (folderId: number | null, path: string) => {
    setSelectedFolderId(folderId);
    setCurrentPath(path);
    setLoading(true);

    try {
      if (folderId === null) {
        // Root folder, hanya tampilkan Home
        setBreadcrumbs([{ name: 'Back', path: '/', id: null }]);
      } else {
        // Dapatkan detail folder dengan relasi parent
        const response = await folderService.getFolder(folderId);
        const folder = response.data.data;

        // Mulai dengan Home
        const newBreadcrumbs = [{ name: 'Back', path: '/', id: null }];

        // Jika kita punya detail folder
        if (folder) {
          // Bangun breadcrumb dari folder saat ini ke atas
          const folderChain = [];
          let currentFolder = folder;

          // Tambahkan folder saat ini
          folderChain.unshift({
            name: currentFolder.name,
            path: currentFolder.path + currentFolder.name + '/',
            id: currentFolder.id
          });

          // Telusuri parent sampai root
          while (currentFolder.parent_id !== null) {
            try {
              // Dapatkan parent folder
              const parentResponse = await folderService.getFolder(currentFolder.parent_id);
              currentFolder = parentResponse.data.data;

              // Tambahkan parent ke folderChain
              folderChain.unshift({
                name: currentFolder.name,
                path: currentFolder.path + currentFolder.name + '/',
                id: currentFolder.id
              });
            } catch (e) {
              console.error('Error getting parent folder:', e);
              break;
            }
          }

          // Gabungkan breadcrumbs
          newBreadcrumbs.push(...folderChain);
        }

        // Set breadcrumbs
        setBreadcrumbs(newBreadcrumbs);
      }

      // Muat konten folder
      await loadCurrentFolder();
    } catch (error) {
      console.error('Error navigating to folder:', error);
      // toast.error('Failed to navigate to folder');
    } finally {
      setLoading(false);
    }
  };

  // Buka file
  const openFile = async (file: FileItem) => {
    try {
      const response = await fileService.getFile(file.id);
      const fileDetails = response.data.data;

      // Simulasi konten preview
      setFileData({
        ...fileDetails,
        content: `This is a preview of the file "${fileDetails.original_name}". In a real application, this would display the actual file content or a preview appropriate to the file type.`
      });
    } catch (error) {
      console.error('Error opening file:', error);
      toast.error('Failed to open file');
    }
  };

  // Load data saat komponen dimount dengan dependency yang benar
  useEffect(() => {
    // Memuat struktur folder
    loadFolderStructure().then(() => {
      // Setelah struktur folder dimuat, load statistik dan konten folder saat ini
      loadStatistics();
      loadCurrentFolder();
    });
  }, []); // Hanya sekali saat komponen dimount

  // Reload folder saat ID folder berubah dengan useEffect terpisah
  useEffect(() => {
    if (selectedFolderId !== null) {
      loadCurrentFolder();
    }
  }, [selectedFolderId]); // Hanya ketika selectedFolderId berubah

  return (
      <div className="h-screen flex flex-col bg-white">
        {/* Header */}
        <MainNavigation />

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <Sidebar
              folderStructure={folderStructure}
              selectedFolderId={selectedFolderId}
              navigateTo={navigateTo}
              openFile={openFile}
              statistics={statistics}
          />

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 flex">
              <div className={`flex-1 flex flex-col overflow-hidden ${fileData ? 'lg:w-1/2' : 'w-full'}`}>
                <FileExplorer
                    loading={loading}
                    selectedFolderId={selectedFolderId}
                    currentPath={currentPath}
                    breadcrumbs={breadcrumbs}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    currentItems={filteredItems}
                    navigateTo={navigateTo}
                    openFile={openFile}
                    onRefresh={loadCurrentFolder}
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