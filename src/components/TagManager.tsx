import React, { useState, useEffect } from 'react';
import { X, Check, Plus, Tag, Loader, Search, Trash2 } from 'lucide-react';
import { tagService, fileService } from '@/services/api';
import { Tag as TagType, FileItem } from '@/pages/Index';
import { toast } from 'sonner';

interface TagManagerProps {
    fileId: number;
    onClose: () => void;
    onTagsUpdated: () => void;
}

const TagManager: React.FC<TagManagerProps> = ({ fileId, onClose, onTagsUpdated }) => {
    const [allTags, setAllTags] = useState<TagType[]>([]);
    const [fileTags, setFileTags] = useState<TagType[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // State untuk membuat tag baru
    const [newTagName, setNewTagName] = useState('');
    const [newTagColor, setNewTagColor] = useState('#3B82F6');
    const [newTagDescription, setNewTagDescription] = useState('');
    const [isCreatingTag, setIsCreatingTag] = useState(false);
    const [isSubmittingTag, setIsSubmittingTag] = useState(false);

    // Fetch all tags and file tags
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [allTagsResponse, fileTagsResponse] = await Promise.all([
                    tagService.getTags(),
                    tagService.getFileTags(fileId)
                ]);

                setAllTags(allTagsResponse.data.data);
                setFileTags(fileTagsResponse.data.data);
            } catch (error) {
                console.error('Error loading tags:', error);
                toast.error('Failed to load tags');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [fileId]);

    // Check if a tag is currently applied to the file
    const isTagApplied = (tagId: number) => {
        return fileTags.some(tag => tag.id === tagId);
    };

    // Toggle a tag on the file
    const toggleTag = async (tag: TagType) => {
        try {
            if (isTagApplied(tag.id)) {
                await tagService.removeTagFromFile(fileId, tag.id);
                setFileTags(fileTags.filter(t => t.id !== tag.id));
                toast.success(`Removed tag "${tag.name}"`);
            } else {
                await tagService.addTagToFile(fileId, tag.id);
                setFileTags([...fileTags, tag]);
                toast.success(`Added tag "${tag.name}"`);
            }
            onTagsUpdated();
        } catch (error) {
            console.error('Error toggling tag:', error);
            toast.error('Failed to update tag');
        }
    };

    // Create a new tag
    const createTag = async () => {
        if (!newTagName.trim()) {
            toast.error('Tag name cannot be empty');
            return;
        }

        setIsSubmittingTag(true);
        try {
            const response = await tagService.createTag({
                name: newTagName,
                color: newTagColor,
                description: newTagDescription
            });

            const newTag = response.data.data;
            setAllTags([...allTags, newTag]);

            // Automatically apply the new tag to the file
            await tagService.addTagToFile(fileId, newTag.id);
            setFileTags([...fileTags, newTag]);

            // Reset form
            setNewTagName('');
            setNewTagColor('#3B82F6');
            setNewTagDescription('');
            setIsCreatingTag(false);

            toast.success('Tag created and applied to file');
            onTagsUpdated();
        } catch (error) {
            console.error('Error creating tag:', error);
            toast.error('Failed to create tag');
        } finally {
            setIsSubmittingTag(false);
        }
    };

    // Delete a tag entirely
    const deleteTag = async (tagId: number) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this tag? This will remove it from all files.');
        if (!confirmDelete) return;

        try {
            await tagService.deleteTag(tagId);
            setAllTags(allTags.filter(tag => tag.id !== tagId));
            setFileTags(fileTags.filter(tag => tag.id !== tagId));
            toast.success('Tag deleted successfully');
            onTagsUpdated();
        } catch (error) {
            console.error('Error deleting tag:', error);
            toast.error('Failed to delete tag');
        }
    };

    // Filter tags based on search term
    const filteredTags = searchTerm
        ? allTags.filter(tag =>
            tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (tag.description && tag.description.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        : allTags;

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
                    <div className="flex items-center justify-center py-8">
                        <Loader className="w-8 h-8 text-blue-500 animate-spin" />
                        <span className="ml-3 text-gray-600">Loading tags...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-medium text-gray-800 flex items-center">
                        <Tag className="w-5 h-5 mr-2 text-blue-500" />
                        Manage Tags
                    </h2>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 hover:bg-gray-100"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Applied Tags:</h3>
                    <div className="flex flex-wrap gap-2 min-h-10">
                        {fileTags.length === 0 ? (
                            <p className="text-sm text-gray-500">No tags applied to this file</p>
                        ) : (
                            fileTags.map(tag => (
                                <span
                                    key={tag.id}
                                    className="px-3 py-1 rounded-full text-xs font-medium flex items-center"
                                    style={{ backgroundColor: tag.color + '20', color: tag.color }}
                                >
                                    {tag.name}
                                    <button
                                        className="ml-1 p-0.5 rounded-full hover:bg-white hover:bg-opacity-50"
                                        onClick={() => toggleTag(tag)}
                                        title="Remove tag"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-medium text-gray-700">Available Tags:</h3>
                        <button
                            className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                            onClick={() => setIsCreatingTag(true)}
                        >
                            <Plus className="w-3.5 h-3.5 mr-1" />
                            New Tag
                        </button>
                    </div>

                    {/* Search box for tags */}
                    <div className="relative mb-3">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search tags..."
                            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-300"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {isCreatingTag && (
                        <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <h4 className="text-sm font-medium text-gray-700 mb-3">Create New Tag</h4>

                            <div className="mb-3">
                                <label className="text-xs font-medium text-gray-600 block mb-1">Name:</label>
                                <input
                                    type="text"
                                    value={newTagName}
                                    onChange={(e) => setNewTagName(e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-300"
                                    placeholder="Enter tag name"
                                />
                            </div>

                            <div className="mb-3">
                                <label className="text-xs font-medium text-gray-600 block mb-1">Color:</label>
                                <div className="flex items-center">
                                    <input
                                        type="color"
                                        value={newTagColor}
                                        onChange={(e) => setNewTagColor(e.target.value)}
                                        className="w-10 h-10 border-0 p-0 mr-2"
                                    />
                                    <input
                                        type="text"
                                        value={newTagColor}
                                        onChange={(e) => setNewTagColor(e.target.value)}
                                        className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-300"
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="text-xs font-medium text-gray-600 block mb-1">Description (optional):</label>
                                <textarea
                                    value={newTagDescription}
                                    onChange={(e) => setNewTagDescription(e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-300 resize-none"
                                    placeholder="Enter tag description"
                                    rows={2}
                                />
                            </div>

                            <div className="flex gap-2">
                                <button
                                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm flex items-center disabled:bg-blue-300"
                                    onClick={createTag}
                                    disabled={isSubmittingTag || !newTagName.trim()}
                                >
                                    {isSubmittingTag ? (
                                        <>
                                            <Loader className="w-3.5 h-3.5 mr-1 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-3.5 h-3.5 mr-1" />
                                            Create
                                        </>
                                    )}
                                </button>
                                <button
                                    className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm"
                                    onClick={() => {
                                        setIsCreatingTag(false);
                                        setNewTagName('');
                                        setNewTagColor('#3B82F6');
                                        setNewTagDescription('');
                                    }}
                                    disabled={isSubmittingTag}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="overflow-y-auto max-h-60 pr-1">
                        {filteredTags.length === 0 ? (
                            <p className="text-sm text-gray-500 p-2">
                                {searchTerm ? "No tags match your search" : "No tags available"}
                            </p>
                        ) : (
                            <div className="grid grid-cols-1 gap-2">
                                {filteredTags.map(tag => (
                                    <div
                                        key={tag.id}
                                        className={`px-3 py-2 rounded-lg text-sm flex items-center justify-between transition-colors ${isTagApplied(tag.id)
                                                ? 'bg-blue-50 border border-blue-100'
                                                : 'bg-gray-50 border border-gray-100 hover:border-blue-100'
                                            }`}
                                    >
                                        <div
                                            className="flex items-center flex-1 cursor-pointer"
                                            onClick={() => toggleTag(tag)}
                                        >
                                            <span
                                                className="w-4 h-4 rounded-full mr-2 flex-shrink-0"
                                                style={{ backgroundColor: tag.color }}
                                            ></span>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{tag.name}</span>
                                                {tag.description && (
                                                    <span className="text-xs text-gray-500 truncate max-w-xs">
                                                        {tag.description}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            {isTagApplied(tag.id) ? (
                                                <button
                                                    className="p-1 rounded-full hover:bg-blue-100"
                                                    onClick={() => toggleTag(tag)}
                                                    title="Remove from file"
                                                >
                                                    <Check className="w-4 h-4 text-blue-500" />
                                                </button>
                                            ) : (
                                                <button
                                                    className="p-1 rounded-full hover:bg-red-100"
                                                    onClick={() => deleteTag(tag.id)}
                                                    title="Delete tag"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
                    <button
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TagManager;