// src/services/api/fileService.ts - Implementasi lengkap dengan streaming PDF

import axios from 'axios';

/**
 * Konfigurasi utama untuk axios requests
 */
const baseAxios = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor untuk menambahkan authorization header jika ada token
baseAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Mencari file berdasarkan berbagai kriteria
 * @param params Parameter pencarian (folder_id, search, file_type_id, tags, dll)
 */
export const searchFiles = (params = {}) => {
  return baseAxios.get('/files', { params });
};

/**
 * Mendapatkan detail file berdasarkan ID
 * @param id ID file
 */
export const getFile = (id: number) => {
  return baseAxios.get(`/files/${id}`);
};

/**
 * Mengupload file ke folder tertentu
 * @param folderId ID folder tujuan
 * @param formData FormData yang berisi file dan metadata
 */
export const uploadFile = (folderId: number, formData: FormData) => {
  return baseAxios.post(`/files/${folderId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });
};

/**
 * Upload file dengan monitoring progress
 * @param folderId ID folder tujuan
 * @param formData FormData yang berisi file dan metadata
 * @param onProgress Callback untuk melaporkan progress upload
 */
export const uploadFileWithProgress = (folderId: number, formData: FormData, onProgress: (progressEvent: any) => void) => {
  return baseAxios.post(`/files/${folderId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: onProgress
  });
};

/**
 * Mendapatkan URL untuk download file
 * @param id ID file
 * @returns URL lengkap untuk download file
 */
export const getDownloadUrl = (id: number) => {
  // Gunakan baseURL dari konfigurasi
  const baseURL = baseAxios.defaults.baseURL || '/api/v1';
  return `${baseURL}/files/${id}/download`;
};

/**
 * Download file langsung (memicu download browser)
 * @param id ID file
 * @param filename Nama file yang akan ditampilkan saat download
 */
export const downloadFile = async (id: number, filename: string) => {
  try {
    // Menggunakan fetch API untuk mendukung blob download
    const response = await fetch(getDownloadUrl(id), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    });

    if (!response.ok) {
      // Parse error message jika respons bukan success
      const errorData = await response.json();
      throw new Error(errorData.message || `Gagal mengunduh file (${response.status})`);
    }

    // Buat blob dari respons
    const blob = await response.blob();

    // Buat URL objek dan link untuk download
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);

    // Simulasikan klik untuk memulai download
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    if (error instanceof Error) {
      throw error; // Re-throw error dengan message
    }
    throw new Error('Gagal mengunduh file');
  }
};

/**
 * Stream konten PDF untuk preview
 * @param id ID file
 * @returns Promise yang resolve ke Blob PDF
 */
export const streamPdfContent = async (id: number): Promise<Blob> => {
  try {
    const response = await fetch(getDownloadUrl(id), {
      method: 'GET',
      headers: {
        'Accept': 'application/pdf',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Gagal mengakses file PDF (${response.status})`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/pdf')) {
      throw new Error('File bukan PDF atau server mengembalikan tipe konten yang salah');
    }

    return await response.blob();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Gagal streaming konten PDF');
  }
};

/**
 * Mendapatkan URL untuk streaming PDF dengan token
 * @param id ID file
 * @returns URL untuk streaming PDF dengan token autentikasi
 */
export const getPdfStreamUrl = (id: number): string => {
  const token = localStorage.getItem('auth_token');
  const baseURL = baseAxios.defaults.baseURL || '/api/v1';

  // Tambahkan token sebagai query parameter
  return `${baseURL}/files/${id}/stream-pdf${token ? `?token=${token}` : ''}`;
};

/**
 * Hapus file berdasarkan ID
 * @param id ID file yang akan dihapus
 */
export const deleteFile = (id: number) => {
  return baseAxios.delete(`/files/${id}`);
};

/**
 * Pindahkan file ke folder lain
 * @param id ID file yang akan dipindahkan
 * @param folderId ID folder tujuan 
 */
export const moveFile = (id: number, folderId: number) => {
  return baseAxios.post(`/files/${id}/move`, { folder_id: folderId });
};

/**
 * Update metadata file
 * @param id ID file
 * @param metadata Objek metadata baru 
 */
export const updateFileMetadata = (id: number, metadata: object) => {
  return baseAxios.put(`/files/${id}/metadata`, {
    metadata: JSON.stringify(metadata)
  });
};

/**
 * Menambahkan tag ke file
 * @param fileId ID file
 * @param tagId ID tag
 */
export const addTagToFile = (fileId: number, tagId: number) => {
  return baseAxios.post(`/tags/file/${fileId}`, { tag_id: tagId });
};

/**
 * Menghapus tag dari file
 * @param fileId ID file
 * @param tagId ID tag
 */
export const removeTagFromFile = (fileId: number, tagId: number) => {
  return baseAxios.delete(`/tags/file/${fileId}/${tagId}`);
};

/**
 * Mengatur tag untuk file (mengganti semua tag yang ada)
 * @param fileId ID file
 * @param tagIds Array ID tag
 */
export const setFileTags = (fileId: number, tagIds: number[]) => {
  return baseAxios.put(`/tags/file/${fileId}`, { tag_ids: tagIds });
};

/**
 * Memeriksa apakah file ada di server sebelum mencoba mengunduh
 * @param id ID file
 * @returns boolean menunjukkan apakah file ada
 */
export const checkFileExists = async (id: number): Promise<boolean> => {
  try {
    // Gunakan HEAD request untuk cek file tanpa mengunduh konten
    const response = await baseAxios.head(`/files/${id}/download`);
    return response.status === 200;
  } catch (error) {
    console.error('Error checking file existence:', error);
    return false;
  }
};

/**
 * Mendapatkan preview thumbnail untuk file gambar atau PDF
 * @param id ID file
 * @param width Lebar thumbnail (opsional)
 * @param height Tinggi thumbnail (opsional)
 * @returns URL thumbnail
 */
export const getThumbnailUrl = (id: number, width?: number, height?: number): string => {
  const baseURL = baseAxios.defaults.baseURL || '/api/v1';
  let url = `${baseURL}/files/${id}/thumbnail`;

  if (width || height) {
    url += '?';
    if (width) url += `width=${width}`;
    if (width && height) url += '&';
    if (height) url += `height=${height}`;
  }

  return url;
};

// Export semua fungsi sebagai objek
export default {
  searchFiles,
  getFile,
  uploadFile,
  uploadFileWithProgress,
  getDownloadUrl,
  downloadFile,
  streamPdfContent,
  getPdfStreamUrl,
  deleteFile,
  moveFile,
  updateFileMetadata,
  addTagToFile,
  removeTagFromFile,
  setFileTags,
  checkFileExists,
  getThumbnailUrl
};