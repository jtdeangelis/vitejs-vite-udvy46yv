import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../utils/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import JSZip from 'jszip';
import { Upload, X, Image as ImageIcon, Film, Package, AlertTriangle, Check, Loader } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

interface PhotoGalleryProps {
  projectId?: string;
}

interface MediaFile {
  id: string;
  url: string;
  type: 'image' | 'video';
  thumbnail?: string;
  name: string;
  size: number;
  uploadProgress?: number;
  error?: string;
  order?: number;
  is_cover?: boolean;
}

const MAX_FILES = 400;
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm'];
const CHUNK_SIZE = 50;

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ projectId }) => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [displayedFiles, setDisplayedFiles] = useState<MediaFile[]>([]);
  const [page, setPage] = useState(1);
  const { ref: loadMoreRef, inView } = useInView();

  useEffect(() => {
    if (inView) {
      loadMoreFiles();
    }
  }, [inView]);

  useEffect(() => {
    if (projectId) {
      loadInitialFiles();
    } else {
      // Clear files if no project ID
      setFiles([]);
      setDisplayedFiles([]);
      setPage(1);
    }
  }, [projectId]);

  const loadInitialFiles = async () => {
    if (!projectId) return;

    try {
      const { data, error } = await supabase
        .from('property_media')
        .select('*')
        .eq('project_id', projectId)
        .order('order', { ascending: true })
        .range(0, CHUNK_SIZE - 1);

      if (error) throw error;

      setFiles(data.map(file => ({
        id: file.id,
        url: file.url,
        type: file.type,
        thumbnail: file.thumbnail,
        name: file.name,
        size: file.size,
        order: file.order,
        is_cover: file.is_cover
      })));
      
      setDisplayedFiles(data.slice(0, CHUNK_SIZE));
    } catch (err) {
      console.error('Error loading files:', err);
      setError('Failed to load media files');
    }
  };

  const loadMoreFiles = () => {
    const nextChunk = files.slice(
      page * CHUNK_SIZE,
      (page + 1) * CHUNK_SIZE
    );
    
    if (nextChunk.length > 0) {
      setDisplayedFiles(prev => [...prev, ...nextChunk]);
      setPage(prev => prev + 1);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!projectId) {
      setError('Please save the project before uploading files');
      return;
    }

    setError(null);
    setUploading(true);
    let newFiles: MediaFile[] = [];

    try {
      for (const file of acceptedFiles) {
        if (file.name.toLowerCase().endsWith('.zip')) {
          const zipFiles = await handleZipFile(file);
          newFiles = [...newFiles, ...zipFiles];
        } else {
          const fileType = file.type.startsWith('image/') ? 'image' : 'video';
          newFiles.push({
            id: uuidv4(),
            url: URL.createObjectURL(file),
            type: fileType,
            name: file.name,
            size: file.size,
            order: files.length + newFiles.length
          });
        }
      }

      // Validate total number of files
      if (files.length + newFiles.length > MAX_FILES) {
        throw new Error(`Maximum ${MAX_FILES} files allowed`);
      }

      // Upload files to Supabase Storage
      await uploadFiles(newFiles);

      setFiles(prev => [...newFiles, ...prev]);
      setDisplayedFiles(prev => [...newFiles, ...prev].slice(0, CHUNK_SIZE));
      setPage(1);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [files, projectId]);

  const handleZipFile = async (file: File): Promise<MediaFile[]> => {
    const zip = new JSZip();
    const zipFiles: MediaFile[] = [];
    
    const zipContent = await zip.loadAsync(file);
    
    for (const [filename, zipEntry] of Object.entries(zipContent.files)) {
      if (!zipEntry.dir) {
        const content = await zipEntry.async('blob');
        const fileType = content.type.startsWith('image/') ? 'image' : 'video';
        
        if (
          (fileType === 'image' && ALLOWED_IMAGE_TYPES.includes(content.type)) ||
          (fileType === 'video' && ALLOWED_VIDEO_TYPES.includes(content.type))
        ) {
          zipFiles.push({
            id: uuidv4(),
            url: URL.createObjectURL(content),
            type: fileType,
            name: filename,
            size: content.size,
            order: files.length + zipFiles.length
          });
        }
      }
    }
    
    return zipFiles;
  };

  const uploadFiles = async (filesToUpload: MediaFile[]) => {
    if (!projectId) return;

    const total = filesToUpload.length;
    let completed = 0;

    for (const file of filesToUpload) {
      try {
        const response = await fetch(file.url);
        const blob = await response.blob();
        
        const filePath = `${projectId}/${file.id}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('property-media')
          .upload(filePath, blob);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('property-media')
          .getPublicUrl(filePath);

        // Create thumbnail for videos
        let thumbnail;
        if (file.type === 'video') {
          thumbnail = await generateVideoThumbnail(file.url);
        }

        // Save file metadata to database
        const { error: dbError } = await supabase
          .from('property_media')
          .insert([{
            id: file.id,
            project_id: projectId,
            url: publicUrl,
            type: file.type,
            thumbnail,
            name: file.name,
            size: file.size,
            order: file.order,
            is_cover: files.length === 0 && completed === 0 // First image is cover by default
          }]);

        if (dbError) throw dbError;

        completed++;
        setUploadProgress((completed / total) * 100);
      } catch (err) {
        console.error(`Error uploading ${file.name}:`, err);
        file.error = 'Upload failed';
      }
    }
  };

  const generateVideoThumbnail = (videoUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.src = videoUrl;
      video.currentTime = 1; // Seek to 1 second
      video.addEventListener('loadeddata', () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0);
        resolve(canvas.toDataURL('image/jpeg'));
      });
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ALLOWED_IMAGE_TYPES,
      'video/*': ALLOWED_VIDEO_TYPES,
      'application/zip': ['.zip']
    },
    maxSize: MAX_FILE_SIZE,
    disabled: uploading || !projectId
  });

  const deleteFile = async (fileId: string) => {
    if (!projectId) return;

    try {
      const file = files.find(f => f.id === fileId);
      if (!file) return;

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('property-media')
        .remove([`${projectId}/${file.id}-${file.name}`]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('property_media')
        .delete()
        .eq('id', fileId);

      if (dbError) throw dbError;

      // Update local state
      setFiles(prev => prev.filter(f => f.id !== fileId));
      setDisplayedFiles(prev => prev.filter(f => f.id !== fileId));

      // If deleted file was cover, set new cover
      if (file.is_cover && files.length > 1) {
        const newCoverFile = files.find(f => f.id !== fileId);
        if (newCoverFile) {
          await supabase
            .from('property_media')
            .update({ is_cover: true })
            .eq('id', newCoverFile.id);
          
          setFiles(prev => prev.map(f => 
            f.id === newCoverFile.id ? { ...f, is_cover: true } : f
          ));
        }
      }
    } catch (err) {
      console.error('Error deleting file:', err);
      setError('Failed to delete file');
    }
  };

  const setCoverImage = async (fileId: string) => {
    if (!projectId) return;

    try {
      // Update database
      const { error: updateError } = await supabase
        .from('property_media')
        .update({ is_cover: true })
        .eq('id', fileId);

      if (updateError) throw updateError;

      // Reset other cover images
      const { error: resetError } = await supabase
        .from('property_media')
        .update({ is_cover: false })
        .neq('id', fileId)
        .eq('project_id', projectId);

      if (resetError) throw resetError;

      // Update local state
      setFiles(prev => prev.map(f => ({
        ...f,
        is_cover: f.id === fileId
      })));
      
      setDisplayedFiles(prev => prev.map(f => ({
        ...f,
        is_cover: f.id === fileId
      })));
    } catch (err) {
      console.error('Error setting cover image:', err);
      setError('Failed to set cover image');
    }
  };

  const reorderFiles = async (draggedId: string, targetId: string) => {
    if (!projectId) return;

    try {
      const draggedIndex = files.findIndex(f => f.id === draggedId);
      const targetIndex = files.findIndex(f => f.id === targetId);
      
      if (draggedIndex === -1 || targetIndex === -1) return;

      const newFiles = [...files];
      const [draggedFile] = newFiles.splice(draggedIndex, 1);
      newFiles.splice(targetIndex, 0, draggedFile);

      // Update order in database
      const updates = newFiles.map((file, index) => ({
        id: file.id,
        order: index
      }));

      const { error } = await supabase
        .from('property_media')
        .upsert(updates);

      if (error) throw error;

      // Update local state
      setFiles(newFiles);
      setDisplayedFiles(newFiles.slice(0, page * CHUNK_SIZE));
    } catch (err) {
      console.error('Error reordering files:', err);
      setError('Failed to reorder files');
    }
  };

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        } ${!projectId ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="space-y-2">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="text-gray-600">
            {!projectId ? (
              <p>Please save the project before uploading files</p>
            ) : isDragActive ? (
              <p>Drop your files here...</p>
            ) : (
              <>
                <p className="text-lg font-medium">Drag & drop files here, or click to select</p>
                <p className="text-sm">
                  Supports images, videos, and ZIP files (up to {MAX_FILES} files total)
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-md flex items-start">
          <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 mr-2" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {uploading && (
        <div className="bg-blue-50 p-4 rounded-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-700">Uploading files...</span>
            <span className="text-sm text-blue-600">{Math.round(uploadProgress)}%</span>
          </div>
          <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <AnimatePresence>
          {displayedFiles.map((file) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden"
              draggable
              onDragStart={(e) => e.dataTransfer.setData('fileId', file.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const draggedId = e.dataTransfer.getData('fileId');
                reorderFiles(draggedId, file.id);
              }}
            >
              {file.type === 'image' ? (
                <img
                  src={file.url}
                  alt={file.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <video
                    src={file.url}
                    className="w-full h-full object-cover"
                    poster={file.thumbnail}
                  />
                  <Film className="absolute h-12 w-12 text-white opacity-75" />
                </div>
              )}

              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-2">
                  {file.type === 'image' && !file.is_cover && (
                    <button
                      onClick={() => setCoverImage(file.id)}
                      className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-opacity"
                      title="Set as cover image"
                    >
                      <ImageIcon className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteFile(file.id)}
                    className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-opacity"
                    title="Delete"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {file.is_cover && (
                <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                  Cover
                </div>
              )}

              {file.error && (
                <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-white text-xs p-1">
                  {file.error}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {files.length > displayedFiles.length && (
        <div ref={loadMoreRef} className="flex justify-center py-4">
          <Loader className="h-6 w-6 text-blue-500 animate-spin" />
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;