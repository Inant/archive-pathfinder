import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, File, Paperclip, Eye,Tag as TagIcon, Plus, Check, Loader } from 'lucide-react';
import { fileService, tagService } from '@/services/api';
import { Tag } from '@/pages/Index';
import { toast } from 'sonner';

interface FileUploadDialogProps {
  folderId: number | null;
  onClose: () => void;
  onSuccess: () => void;
  onViewFile?: (fileId: number) => void; // Tambahkan prop ini
}

interface FileToUpload {
  file: File;
  customName: string;
  selectedTags: number[];
  uploading: boolean;
  progress: number;
  uploaded: boolean;
  error: string | null;
}

const FileUploadDialog: React.FC<FileUploadDialogProps> = ({ folderId, onClose, onSuccess, onViewFile }) => {
  const [step, setStep] = useState<'select' | 'configure' | 'uploading'>('select');
  const [filesToUpload, setFilesToUpload] = useState<FileToUpload[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch available tags
  useEffect(() => {
    const fetchTags = async () => {
      setIsLoadingTags(true);
      try {
        const response = await tagService.getTags();
        setAllTags(response.data.data);
      } catch (error) {
        console.error('Error loading tags:', error);
        toast.error('Failed to load tags');
      } finally {
        setIsLoadingTags(false);
      }
    };

    fetchTags();
  }, []);

  const handleSelectFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    const newFiles: FileToUpload[] = Array.from(selectedFiles).map(file => ({
      file,
      customName: file.name,
      selectedTags: [],
      uploading: false,
      progress: 0,
      uploaded: false,
      error: null
    }));

    setFilesToUpload([...filesToUpload, ...newFiles]);
    setStep('configure');

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddMoreFiles = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = [...filesToUpload];
    newFiles.splice(index, 1);
    setFilesToUpload(newFiles);

    if (newFiles.length === 0) {
      setStep('select');
    }
  };

  const handleCustomNameChange = (index: number, name: string) => {
    const newFiles = [...filesToUpload];
    newFiles[index].customName = name;
    setFilesToUpload(newFiles);
  };

  const toggleTag = (fileIndex: number, tagId: number) => {
    const newFiles = [...filesToUpload];
    const currentTags = newFiles[fileIndex].selectedTags;

    if (currentTags.includes(tagId)) {
      newFiles[fileIndex].selectedTags = currentTags.filter(id => id !== tagId);
    } else {
      newFiles[fileIndex].selectedTags = [...currentTags, tagId];
    }

    setFilesToUpload(newFiles);
  };

  // Update di uploadFiles, simpan ID file yang baru diupload
  const uploadFiles = async () => {
    if (!folderId) {
      toast.error('Please select a folder first');
      return;
    }

    setIsUploading(true);
    setStep('uploading');
    let successCount = 0;
    let errorCount = 0;
    let uploadedFileIds: number[] = []; // Tambahkan ini untuk melacak ID file

    // Process each file sequentially
    for (let i = 0; i < filesToUpload.length; i++) {
      if (filesToUpload[i].uploaded) continue;

      // Mark file as uploading
      setFilesToUpload(files => {
        const newFiles = [...files];
        newFiles[i].uploading = true;
        return newFiles;
      });

      try {
        const formData = new FormData();
        formData.append('file', filesToUpload[i].file);

        // Add custom filename as metadata
        const metadata = {
          custom_filename: filesToUpload[i].customName
        };
        formData.append('metadata', JSON.stringify(metadata));

        // Add selected tags
        if (filesToUpload[i].selectedTags.length > 0) {
          formData.append('tags', JSON.stringify(filesToUpload[i].selectedTags));
        }

        // Upload the file
        const response = await fileService.uploadFile(folderId, formData);
        const fileId = response.data.data.id; // Get the ID from response
        uploadedFileIds.push(fileId); // Store the ID

        // Update file status
        setFilesToUpload(files => {
          const newFiles = [...files];
          newFiles[i].uploading = false;
          newFiles[i].uploaded = true;
          newFiles[i].progress = 100;
          return newFiles;
        });

        successCount++;
      } catch (error) {
        console.error('Error uploading file:', error);

        // Update file status with error
        setFilesToUpload(files => {
          const newFiles = [...files];
          newFiles[i].uploading = false;
          newFiles[i].error = 'Failed to upload';
          return newFiles;
        });

        errorCount++;
      }
    }

    setIsUploading(false);

    if (successCount > 0) {
      toast.success(`Successfully uploaded ${successCount} file${successCount !== 1 ? 's' : ''}`);
      onSuccess();

      // Automatically view the last uploaded file if only one file was uploaded
      if (successCount === 1 && uploadedFileIds.length === 1 && onViewFile) {
        onViewFile(uploadedFileIds[0]);
      }
    }

    if (errorCount > 0) {
      toast.error(`Failed to upload ${errorCount} file${errorCount !== 1 ? 's' : ''}`);
    }
  };

  const allFilesUploaded = filesToUpload.length > 0 && filesToUpload.every(f => f.uploaded);

  const renderSelectStep = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
        <Upload className="w-8 h-8 text-blue-500" />
      </div>
      <h3 className="text-lg font-medium text-gray-800 mb-2">Upload Files</h3>
      <p className="text-gray-500 text-center mb-6 max-w-md">
        Select files to upload to the current folder. You'll be able to customize file names and add tags before uploading.
      </p>
      <button
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center"
        onClick={() => fileInputRef.current?.click()}
      >
        <Paperclip className="w-4 h-4 mr-2" />
        Select Files
      </button>
      <input
        type="file"
        multiple
        ref={fileInputRef}
        className="hidden"
        onChange={handleSelectFiles}
      />
    </div>
  );

  const renderConfigureStep = () => (
    <div>
      <h3 className="text-lg font-medium text-gray-800 mb-4">Configure Files</h3>
      <p className="text-gray-500 mb-6">
        Customize file names and add tags before uploading.
      </p>

      <div className="max-h-[50vh] overflow-y-auto mb-6 pr-2">
        {filesToUpload.map((fileItem, index) => (
          <div
            key={index}
            className="bg-gray-50 rounded-lg p-4 mb-3 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <File className="w-5 h-5 text-blue-500 mr-2" />
                <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                  {fileItem.file.name}
                </span>
                <span className="ml-2 text-xs text-gray-500">
                  ({formatFileSize(fileItem.file.size)})
                </span>
              </div>
              <button
                className="text-gray-400 hover:text-red-500"
                onClick={() => handleRemoveFile(index)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mb-3">
              <label className="text-xs font-medium text-gray-600 block mb-1">
                File Name:
              </label>
              <input
                type="text"
                value={fileItem.customName}
                onChange={(e) => handleCustomNameChange(index, e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">
                Tags:
              </label>
              {isLoadingTags ? (
                <div className="flex items-center text-xs text-gray-500">
                  <Loader className="w-3 h-3 animate-spin mr-2" />
                  Loading tags...
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <button
                      key={tag.id}
                      className={`px-2 py-1 rounded-full text-xs flex items-center ${fileItem.selectedTags.includes(tag.id)
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      onClick={() => toggleTag(index, tag.id)}
                    >
                      <span
                        className="w-2 h-2 rounded-full mr-1"
                        style={{ backgroundColor: tag.color }}
                      ></span>
                      {tag.name}
                      {fileItem.selectedTags.includes(tag.id) && (
                        <Check className="w-3 h-3 ml-1" />
                      )}
                    </button>
                  ))}
                  {allTags.length === 0 && (
                    <span className="text-xs text-gray-500">No tags available</span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <button
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center"
          onClick={handleAddMoreFiles}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add More Files
        </button>

        <div className="flex items-center space-x-3">
          <button
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center"
            onClick={uploadFiles}
            disabled={isUploading}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload {filesToUpload.length} File{filesToUpload.length !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </div>
  );

  const renderUploadingStep = () => (
    <div>
      <h3 className="text-lg font-medium text-gray-800 mb-4">Uploading Files</h3>
      <p className="text-gray-500 mb-6">
        Please wait while your files are being uploaded.
      </p>

      <div className="max-h-[50vh] overflow-y-auto mb-6 pr-2">
        {filesToUpload.map((fileItem, index) => (
          <div
            key={index}
            className="bg-gray-50 rounded-lg p-4 mb-3 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <File className="w-5 h-5 text-blue-500 mr-2" />
                <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                  {fileItem.customName}
                </span>
              </div>
              <div className="text-xs">
                {fileItem.uploaded && (
                  <span className="text-green-600 font-medium flex items-center">
                    <Check className="w-3 h-3 mr-1" /> Uploaded
                  </span>
                )}
                {fileItem.uploading && (
                  <span className="text-blue-600 font-medium flex items-center">
                    <Loader className="w-3 h-3 mr-1 animate-spin" /> Uploading
                  </span>
                )}
                {fileItem.error && (
                  <span className="text-red-600 font-medium">
                    {fileItem.error}
                  </span>
                )}
                {!fileItem.uploaded && !fileItem.uploading && !fileItem.error && (
                  <span className="text-gray-500">
                    Waiting...
                  </span>
                )}
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${fileItem.uploaded
                    ? 'bg-green-500'
                    : fileItem.error
                      ? 'bg-red-500'
                      : 'bg-blue-500'
                  }`}
                style={{ width: `${fileItem.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        {isUploading ? (
          <button
            className="px-4 py-2 bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed"
            disabled
          >
            <Loader className="w-4 h-4 mr-2 inline animate-spin" />
            Uploading...
          </button>
        ) : (
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            onClick={onClose}
          >
            {allFilesUploaded ? 'Done' : 'Close'}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium text-gray-800 flex items-center">
            <Upload className="w-5 h-5 mr-2 text-blue-500" />
            Upload Files
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100"
            disabled={isUploading}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {step === 'select' && renderSelectStep()}
        {step === 'configure' && renderConfigureStep()}
        {step === 'uploading' && renderUploadingStep()}
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

export default FileUploadDialog;