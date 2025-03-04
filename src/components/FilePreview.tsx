
import React from 'react';
import { X, Download, Printer, Share2, FileText, FileSpreadsheet, File as FileIcon } from 'lucide-react';
import { FileData } from '@/utils/fileSystem';

interface FilePreviewProps {
  fileData: FileData | null;
  onClose: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ fileData, onClose }) => {
  if (!fileData) return null;

  const getFileIcon = () => {
    if (fileData.name.endsWith('.pdf')) {
      return <FileText className="w-10 h-10 text-red-500" />;
    } else if (fileData.name.endsWith('.xlsx')) {
      return <FileSpreadsheet className="w-10 h-10 text-green-600" />;
    } else {
      return <FileIcon className="w-10 h-10 text-gray-500" />;
    }
  };

  return (
    <div className="animate-scale-in bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="flex justify-between items-center p-6 border-b border-gray-100">
        <div className="flex items-center">
          {getFileIcon()}
          <div className="ml-4">
            <h2 className="text-xl font-medium text-gray-800">{fileData.name}</h2>
            <p className="text-sm text-gray-500">
              {fileData.dateCreated} · {fileData.size}
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
          <p className="text-gray-800">{fileData.content}</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm">
            <Download className="w-4 h-4 mr-2" />
            <span>Download</span>
          </button>
          <button className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
            <Printer className="w-4 h-4 mr-2" />
            <span>Print</span>
          </button>
          <button className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
            <Share2 className="w-4 h-4 mr-2" />
            <span>Share</span>
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

export default FilePreview;
