import React from 'react';
import { X, Download, Printer, Share2, Tag, FileText, FileSpreadsheet, File as FileIcon, Image } from 'lucide-react';
import { FileData } from '@/pages/Index';
import { fileService } from '@/services/api';
import { toast } from 'sonner';

interface FilePreviewProps {
  fileData: FileData | null;
  onClose: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ fileData, onClose }) => {
  if (!fileData) return null;

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

  const handleDownload = () => {
    try {
      // Create an anchor element and trigger download
      const downloadUrl = fileService.getDownloadUrl(fileData.id);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', fileData.original_name);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Downloading ${fileData.original_name}`);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file');
    }
  };

  const handlePrint = () => {
    toast.success('Print functionality would be implemented here');
  };

  const handleShare = () => {
    toast.success('Share functionality would be implemented here');
  };

  const handleManageTags = () => {
    toast.success('Tag management functionality would be implemented here');
  };

  return (
      <div className="animate-scale-in bg-white rounded-xl shadow-lg border border-gray-100 w-full">
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

        <div className="p-6">
          <div className="p-6 bg-gray-50 rounded-lg border border-gray-100 min-h-[200px] mb-6">
            <div className="mb-2 text-sm text-gray-500">File content preview:</div>
            <p className="text-gray-800">{fileData.content || 'Preview not available for this file type.'}</p>
          </div>

          {fileData.tags && fileData.tags.length > 0 && (
              <div className="mb-6">
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

          <div className="flex items-center space-x-3">
            <button
                className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
                onClick={handleDownload}
            >
              <Download className="w-4 h-4 mr-2" />
              <span>Download</span>
            </button>
            <button
                className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                onClick={handlePrint}
            >
              <Printer className="w-4 h-4 mr-2" />
              <span>Print</span>
            </button>
            <button
                className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                onClick={handleShare}
            >
              <Share2 className="w-4 h-4 mr-2" />
              <span>Share</span>
            </button>
            <button
                className="flex items-center px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors"
                onClick={handleManageTags}
            >
              <Tag className="w-4 h-4 mr-2" />
              <span>Manage Tags</span>
            </button>
          </div>
        </div>

        <div className="px-6 pb-6">
          <div className="text-xs text-gray-500">
            Path: <span className="text-gray-700 font-mono">{fileData.path}</span>
          </div>
        </div>
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

export default FilePreview;