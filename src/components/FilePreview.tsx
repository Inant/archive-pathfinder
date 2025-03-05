import React from 'react';
import { X, Download, FileText, FileSpreadsheet, File as FileIcon, Image } from 'lucide-react';
import { FileData } from '@/pages/Index';
import { fileService } from '@/services/api';
import { toast } from 'sonner';

interface FilePreviewProps {
  fileData: FileData | null;
  onClose: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ fileData, onClose }) => {
  if (!fileData) return null;

  // Fungsi untuk mendownload file
  const handleDownload = () => {
    try {
      // Buat URL download
      const downloadUrl = fileService.getDownloadUrl(fileData.id);
      
      // Buat elemen anchor dan trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', fileData.original_name);
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      
      // Bersihkan elemen
      document.body.removeChild(link);
      
      toast.success(`Mengunduh ${fileData.original_name}`);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Gagal mengunduh file');
    }
  };

  // Mendapatkan ikon berdasarkan tipe file
  const getFileIcon = () => {
    const extension = fileData.original_name.split('.').pop()?.toLowerCase();

    if (extension === 'pdf') {
      return <FileText className="w-10 h-10 text-red-500" />;
    } else if (['xlsx', 'xls', 'csv'].includes(extension || '')) {
      return <FileSpreadsheet className="w-10 h-10 text-green-600" />;
    } else if (['jpg', 'png', 'gif', 'jpeg'].includes(extension || '')) {
      return <Image className="w-10 h-10 text-purple-500" />;
    } else {
      return <FileIcon className="w-10 h-10 text-gray-500" />;
    }
  };

  // Render preview berdasarkan tipe file
  const renderFileContent = () => {
    const extension = fileData.original_name.split('.').pop()?.toLowerCase();
    
    // Preview untuk gambar
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) {
      return (
        <div className="flex justify-center items-center p-4 bg-gray-50 rounded-lg border border-gray-100 min-h-[200px]">
          <img 
            src={fileService.getDownloadUrl(fileData.id)} 
            alt={fileData.original_name}
            className="max-w-full max-h-[400px] object-contain"
          />
        </div>
      );
    }
    
    // Preview untuk tipe file lainnya
    return (
      <div className="p-6 bg-gray-50 rounded-lg border border-gray-100 min-h-[200px] flex flex-col items-center justify-center">
        {getFileIcon()}
        <iframe src={`https://docs.google.com/gview?url=${fileService.getDownloadUrl(fileData.id) }&embedded=true`} width="600px" height="500px" frameBorder="0"></iframe>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 w-full">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-100">
        <div className="flex items-center">
          {getFileIcon()}
          <div className="ml-4">
            <h2 className="text-xl font-medium text-gray-800">{fileData.original_name}</h2>
            <p className="text-sm text-gray-500">
              {new Date(fileData.created_at).toLocaleString()} · {formatFileSize(fileData.size)}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-full p-2 hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {renderFileContent()}
        
        {/* Tags (if available) */}
        {fileData.tags && fileData.tags.length > 0 && (
          <div className="mt-4 mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {fileData.tags.map(tag => (
                <span
                  key={tag.id}
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ backgroundColor: tag.color + '20', color: tag.color }}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex justify-center">
          <button
            className="flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
            onClick={handleDownload}
          >
            <Download className="w-5 h-5 mr-2" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 pb-6">
        <div className="text-xs text-gray-500">
          Path: <span className="text-gray-700 font-mono">{fileData.path}</span>
        </div>
      </div>
    </div>
  );
};

// Helper function untuk format ukuran file
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default FilePreview;