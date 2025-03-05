import React, { useState, useEffect } from 'react';
import { X, Check, Plus, Tag, Loader } from 'lucide-react';
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
    const [newTagName, setNewTagName] = useState('');
    const [newTagColor, setNewTagColor] = useState('#3B82F6');
    const [isCreatingTag, setIsCreatingTag] = useState(false);

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

        try {
            const response = await tagService.createTag({
                name: newTagName,
                color: newTagColor,
                description: ''
            });

            const newTag = response.data.data;
            setAllTags([...allTags, newTag]);
            setNewTagName('');
            setNewTagColor('#3B82F6');
            setIsCreatingTag(false);
            toast.success('Tag created successfully');
        } catch (error) {
            console.error('Error creating tag:', error);
            toast.error('Failed to create tag');
        }
    };

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
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
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
                                    >
                    <X className="w-3 h-3" />
                  </button>
                </span>
                            ))
                        )}
                    </div>
                </div>

                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium text-gray-700">Available Tags:</h3>
                        <button
                            className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                            onClick={() => setIsCreatingTag(true)}
                        >
                            <Plus className="w-3.5 h-3.5 mr-1" />
                            New Tag
                        </button>
                    </div>

                    {isCreatingTag && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="mb-2">
                                <label className="text-xs font-medium text-gray-600 block mb-1">Name:</label>
                                <input
                                    type="text"
                                    value={newTagName}
                                    onChange={(e) => setNewTagName(e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
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
                                        className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm flex items-center"
                                    onClick={createTag}
                                >
                                    <Check className="w-3.5 h-3.5 mr-1" />
                                    Create
                                </button>
                                <button
                                    className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm"
                                    onClick={() => {
                                        setIsCreatingTag(false);
                                        setNewTagName('');
                                        setNewTagColor('#3B82F6');
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
                        {allTags.map(tag => (
                            <button
                                key={tag.id}
                                className={`px-3 py-2 rounded-lg text-sm flex items-center justify-between transition-colors ${
                                    isTagApplied(tag.id)
                                        ? 'bg-blue-50 border border-blue-100'
                                        : 'bg-gray-50 border border-gray-100 hover:border-blue-100'
                                }`}
                                onClick={() => toggleTag(tag)}
                            >
                <span
                    className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                    style={{ backgroundColor: tag.color }}
                ></span>
                                <span className="truncate flex-1 text-left">{tag.name}</span>
                                {isTagApplied(tag.id) && (
                                    <Check className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
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