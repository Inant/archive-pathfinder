import React, { useState, useRef } from 'react';
import { X, Upload, Loader } from 'lucide-react';
import { fileService } from '@/services/api';
import { toast } from 'sonner';

interface SimpleUploadDialogProps {
  folderId: number | null;
  onClose: () => void;
  onSuccess: () => void;
}

const SimpleUploadDialog: React.FC<SimpleUploadDialogProps> = ({
  folderId,
  onClose,
  onSuccess
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setSelectedFiles(Array.from(files));
  };

  const handleUpload = async () => {
    if (!folderId) {
      toast.error('Silahkan pilih folder terlebih dahulu');
      return;
    }

    if (selectedFiles.length === 0) {
      toast.error('Silahkan pilih file terlebih dahulu');
      return;
    }

    setIsUploading(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      // Proses upload file satu per satu
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append('file', file);

        try {
          await fileService.uploadFile(folderId, formData);
          successCount++;
        } catch (error) {
          console.error('Error uploading file:', error);
          errorCount++;
        }
      }

      // Tampilkan pesan sukses atau error
      if (successCount > 0) {
        toast.success(`Berhasil mengupload ${successCount} file`);
        onSuccess(); // Refresh file list
      }

      if (errorCount > 0) {
        toast.error(`Gagal mengupload ${errorCount} file`);
      }

      // Tutup dialog jika semua file berhasil diupload
      if (errorCount === 0) {
        onClose();
      }

    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Terjadi kesalahan saat mengupload file');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium text-gray-800 flex items-center">
            <Upload className="w-5 h-5 mr-2 text-blue-500" />
            Upload File
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100"
            disabled={isUploading}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="mb-6">
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
              ref={fileInputRef}
            />

            <Upload className="w-10 h-10 text-gray-400 mx-auto mb-4" />

            {selectedFiles.length === 0 ? (
              <div>
                <p className="text-gray-700 font-medium mb-1">Klik untuk memilih file</p>
                <p className="text-sm text-gray-500">atau drag & drop file disini</p>
              </div>
            ) : (
              <div>
                <p className="text-gray-700 font-medium mb-1">{selectedFiles.length} file dipilih</p>
                <ul className="text-left mt-4 max-h-40 overflow-y-auto">
                  {selectedFiles.map((file, index) => (
                    <li key={index} className="text-sm text-gray-600 py-1 border-b border-gray-100 flex items-center">
                      <span className="truncate flex-1">{file.name}</span>
                      <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                        {formatFileSize(file.size)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            onClick={onClose}
            disabled={isUploading}
          >
            Batal
          </button>

          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center disabled:bg-blue-400"
            onClick={handleUpload}
            disabled={isUploading || selectedFiles.length === 0}
          >
            {isUploading ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Mengupload...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </>
            )}
          </button>
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

export default SimpleUploadDialog;