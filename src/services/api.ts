import axios from 'axios';

// Konfigurasi base URL berdasarkan environment
const getBaseUrl = () => {
    // Untuk production build (NODE_ENV adalah 'production')
    if (process.env.NODE_ENV === 'production') {
        return 'https://new-backoffice.javavolcano-touroperator.com/api/v1';
    }

    // Untuk development (localhost)
    return 'http://127.0.0.1:8000/api/v1';
};

// Konfigurasi axios
const apiClient = axios.create({
    baseURL: getBaseUrl(),
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Interceptor untuk menangani token otentikasi jika diperlukan
apiClient.interceptors.request.use(function (config) {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Service untuk Folder
export const folderService = {
    // Mendapatkan daftar folder
    getFolders: (parentId = null) => {
        const params = parentId ? { parent_id: parentId } : {};
        return apiClient.get('/folders', { params });
    },

    // Mendapatkan struktur folder hierarkis
    getFolderTree: () => {
        return apiClient.get('/folders/tree');
    },

    // Mendapatkan isi folder (subfolder dan file)
    getFolderContents: (id) => {
        return apiClient.get(`/folders/${id}/contents`);
    },

    // Membuat folder baru
    createFolder: (data) => {
        return apiClient.post('/folders', data);
    },

    // Memperbarui folder
    updateFolder: (id, data) => {
        return apiClient.put(`/folders/${id}`, data);
    },

    // Memindahkan folder
    moveFolder: (id, parentId) => {
        return apiClient.put(`/folders/${id}/move`, { parent_id: parentId });
    },

    // Menghapus folder
    deleteFolder: (id) => {
        return apiClient.delete(`/folders/${id}`);
    }
};

// Service untuk File
export const fileService = {
    // Mencari file
    searchFiles: (params) => {
        return apiClient.get('/files/search', { params });
    },

    // Mendapatkan detail file
    getFile: (id) => {
        return apiClient.get(`/files/${id}`);
    },

    // Mendapatkan URL untuk mengunduh file
    getDownloadUrl: (id) => {
        return `${apiClient.defaults.baseURL}/files/${id}/download`;
    },

    // Mengunggah file
    uploadFile: (folderId, formData) => {
        return apiClient.post(`/folders/${folderId}/files`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },

    // Memindahkan file
    moveFile: (id, folderId) => {
        return apiClient.put(`/files/${id}/move`, { folder_id: folderId });
    },

    // Memperbarui metadata file
    updateMetadata: (id, metadata) => {
        return apiClient.put(`/files/${id}/metadata`, { metadata: JSON.stringify(metadata) });
    },

    // Menghapus file
    deleteFile: (id) => {
        return apiClient.delete(`/files/${id}`);
    }
};

// Service untuk Tag
export const tagService = {
    // Mendapatkan semua tag
    getTags: () => {
        return apiClient.get('/tags');
    },

    // Membuat tag baru
    createTag: (data) => {
        return apiClient.post('/tags', data);
    },

    // Memperbarui tag
    updateTag: (id, data) => {
        return apiClient.put(`/tags/${id}`, data);
    },

    // Menghapus tag
    deleteTag: (id) => {
        return apiClient.delete(`/tags/${id}`);
    },

    // Mendapatkan tag untuk file tertentu
    getFileTags: (fileId) => {
        return apiClient.get(`/files/${fileId}/tags`);
    },

    // Menambahkan tag ke file
    addTagToFile: (fileId, tagId) => {
        return apiClient.post(`/files/${fileId}/tags`, { tag_id: tagId });
    },

    // Mengatur tag untuk file
    setFileTags: (fileId, tagIds) => {
        return apiClient.put(`/files/${fileId}/tags`, { tag_ids: tagIds });
    },

    // Menghapus tag dari file
    removeTagFromFile: (fileId, tagId) => {
        return apiClient.delete(`/files/${fileId}/tags/${tagId}`);
    }
};

// Service untuk Folder Type
export const folderTypeService = {
    // Mendapatkan semua tipe folder
    getFolderTypes: () => {
        return apiClient.get('/folder-types');
    },

    // Membuat tipe folder baru
    createFolderType: (data) => {
        return apiClient.post('/folder-types', data);
    },

    // Memperbarui tipe folder
    updateFolderType: (id, data) => {
        return apiClient.put(`/folder-types/${id}`, data);
    },

    // Menghapus tipe folder
    deleteFolderType: (id) => {
        return apiClient.delete(`/folder-types/${id}`);
    }
};

// Service untuk File Type
export const fileTypeService = {
    // Mendapatkan semua tipe file
    getFileTypes: () => {
        return apiClient.get('/file-types');
    },

    // Membuat tipe file baru
    createFileType: (data) => {
        return apiClient.post('/file-types', data);
    },

    // Memperbarui tipe file
    updateFileType: (id, data) => {
        return apiClient.put(`/file-types/${id}`, data);
    },

    // Menghapus tipe file
    deleteFileType: (id) => {
        return apiClient.delete(`/file-types/${id}`);
    }
};

// Service untuk Order Channel
export const orderChannelService = {
    // Mendapatkan semua saluran order
    getOrderChannels: () => {
        return apiClient.get('/order-channels');
    },

    // Membuat saluran order baru
    createOrderChannel: (data) => {
        return apiClient.post('/order-channels', data);
    },

    // Memperbarui saluran order
    updateOrderChannel: (id, data) => {
        return apiClient.put(`/order-channels/${id}`, data);
    },

    // Menghapus saluran order
    deleteOrderChannel: (id) => {
        return apiClient.delete(`/order-channels/${id}`);
    }
};

export default {
    folderService,
    fileService,
    tagService,
    folderTypeService,
    fileTypeService,
    orderChannelService
};