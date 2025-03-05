import React, { useState, useEffect } from 'react';
import { FileText, Download, ZoomIn, ZoomOut, RotateCw, Loader } from 'lucide-react';
import { fileService } from '@/services/api';

interface PdfViewerProps {
  fileId: number;
  fileName: string;
  onDownload: () => void;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ fileId, fileName, onDownload }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    const checkAndLoadPdf = async () => {
      try {
        setLoading(true);
        setError(null);

        // Verifikasi file ada
        const fileExists = await fileService.checkFileExists(fileId);
        if (!fileExists) {
          setError('File PDF tidak ditemukan di server.');
          setLoading(false);
          return;
        }

        // Gunakan URL langsung untuk object tag
        const url = fileService.getDownloadUrl(fileId);
        setPdfUrl(url);

        // Simulasikan loading PDF
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error loading PDF:', err);
        setError('Gagal memuat PDF. Silakan coba lagi nanti.');
        setLoading(false);
      }
    };

    checkAndLoadPdf();
  }, [fileId]);

  // Handler untuk error saat memuat PDF
  const handlePdfError = () => {
    setError('Browser Anda tidak dapat menampilkan file PDF ini.');
  };

  if (loading) {
    return (
      <div className="pdf-container">
        <div className="pdf-toolbar">
          <span>{fileName}</span>
        </div>
        <div className="pdf-loading">
          <div className="flex flex-col items-center">
            <Loader className="w-10 h-10 text-blue-500 animate-spin mb-3" />
            <span className="text-gray-600">Memuat PDF...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !pdfUrl) {
    return (
      <div className="pdf-container">
        <div className="pdf-toolbar">
          <span>{fileName}</span>
        </div>
        <div className="pdf-fallback">
          <FileText className="w-16 h-16 text-red-500 mb-4" />
          <p className="text-gray-600 mb-6">{error || 'Tidak dapat menampilkan PDF'}</p>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center"
            onClick={onDownload}
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pdf-container">
      <div className="pdf-toolbar">
        <button
          onClick={onDownload}
          className="hover:bg-gray-200 px-3 py-1 rounded-md flex items-center"
          title="Download PDF"
        >
          <Download className="w-4 h-4 mr-1" />
          <span className="hidden sm:inline">Download</span>
        </button>

        {/* Placeholder buttons untuk fitur yang akan datang */}
        <button className="hover:bg-gray-200 px-3 py-1 rounded-md flex items-center" disabled>
          <ZoomIn className="w-4 h-4 mr-1" />
          <span className="hidden sm:inline">Zoom In</span>
        </button>
        <button className="hover:bg-gray-200 px-3 py-1 rounded-md flex items-center" disabled>
          <ZoomOut className="w-4 h-4 mr-1" />
          <span className="hidden sm:inline">Zoom Out</span>
        </button>
        <button className="hover:bg-gray-200 px-3 py-1 rounded-md flex items-center" disabled>
          <RotateCw className="w-4 h-4 mr-1" />
          <span className="hidden sm:inline">Rotate</span>
        </button>
      </div>

      <object
        data={pdfUrl}
        type="application/pdf"
        className="pdf-viewer"
        onError={handlePdfError}
      >
        <div className="pdf-fallback">
          <p className="pdf-fallback-message">
            Browser Anda tidak mendukung tampilan PDF secara langsung.
          </p>
          <button
            className="pdf-fallback-button"
            onClick={onDownload}
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </button>
        </div>
      </object>
    </div>
  );
};

export default PdfViewer;