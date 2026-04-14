import { useState, useEffect, useRef } from 'react'
import { Trash2, Upload, FileImage } from 'lucide-react'
import styles from './PhotoManager.module.css'
import { adminApi } from '@/lib/api'
import { getAdminToken } from '@/lib/adminSession'
import { supabase } from '@/lib/supabase'

interface Photo {
  id: string
  filename: string
  originalName: string
  url: string
  size: number
  category: string
  uploadDate: string
}

const CATEGORIES = [
  { id: 'general', name: 'General / Gallery' },
  { id: 'hero', name: 'Main Header (Hero)' },
  { id: 'foundation', name: 'Our Foundation' },
  { id: 'reach', name: 'Community Reach' },
  { id: 'prayer', name: 'House of Prayer' },
  { id: 'giving', name: 'Generous Living' },
]

export default function PhotoManager() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchPhotos()

    const channel = supabase
      .channel('admin:photos')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'photos' }, () => {
        fetchPhotos()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchPhotos = async () => {
    try {
      const token = getAdminToken()
      if (!token) return

      const response = await adminApi.getPhotos(token)
      if (response.success && Array.isArray(response.data)) {
        setPhotos(response.data as Photo[])
      }
    } catch (error) {
      console.error('Error fetching photos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file)
    }
  }

  const handleDropZoneClick = () => {
    fileInputRef.current?.click()
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploading(true)
    try {
      const token = getAdminToken()
      if (!token) return

      const response = await adminApi.uploadPhoto(token, selectedFile)
      if (response.success && response.data) {
        setPhotos(prev => [response.data as Photo, ...prev])
        setSelectedFile(null)
        const fileInput = document.getElementById('photo-input') as HTMLInputElement
        if (fileInput) fileInput.value = ''
      }
    } catch (error: any) {
      alert(error.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (filename: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) return

    try {
      const token = getAdminToken()
      if (!token) return

      const response = await adminApi.deletePhoto(token, filename)
      if (response.success) {
        setPhotos(prev => prev.filter(photo => photo.filename !== filename))
      }
    } catch (error: any) {
      alert(error.message || 'Delete failed')
    }
  }

  const handleCategoryChange = async (photoId: string, newCategory: string) => {
    try {
      const token = getAdminToken()
      if (!token) return

      const response = await adminApi.updatePhotoCategory(token, photoId, newCategory)
      if (response.success) {
        setPhotos(prev => prev.map(p => p.id === photoId ? { ...p, category: newCategory } : p))
      }
    } catch (error: any) {
      alert(error.message || 'Update failed')
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Media Library</h2>
        <p className={styles.subtitle}>Upload and manage church photos for galleries and stories.</p>
      </div>

      <div className={styles.uploadSection}>
        <div className={styles.uploadArea}>
            id="photo-input"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className={styles.fileInput}
            ref={fileInputRef}
          />
          
          <div
            className={`${styles.dropZone} ${dragActive ? styles.dragActive : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleDropZoneClick}
          >
            <Upload className={styles.uploadIcon} size={48} />
            <p className={styles.dropText}>
              {selectedFile ? selectedFile.name : 'Drag & drop photos here or click to browse'}
            </p>
          </div>

          {selectedFile && (
            <div className={styles.previewSection}>
              <div className={styles.preview}>
                <img 
                  src={URL.createObjectURL(selectedFile)} 
                  alt="Preview" 
                  className={styles.previewImage}
                />
              </div>
              <div className={styles.previewInfo}>
                <p className={styles.fileName}>{selectedFile.name}</p>
                <p className={styles.fileSize}>{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className={styles.uploadButton}
          >
            {uploading ? 'Processing...' : 'Upload to Library'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading media...</div>
      ) : (
        <div className={styles.photoGrid}>
          {photos.length === 0 ? (
            <div className={styles.emptyState}>
              <FileImage className={styles.emptyIcon} size={48} />
              <p>Your library is empty. Upload your first photo above.</p>
            </div>
          ) : (
            photos.map((photo) => (
              <div key={photo.id} className={styles.photoCard}>
                <div className={styles.photoContainer}>
                  <img
                    src={photo.url}
                    alt={photo.originalName}
                    className={styles.photo}
                  />
                  <div className={styles.photoOverlay}>
                    <button
                      onClick={() => handleDelete(photo.filename)}
                      className={styles.deleteButton}
                      title="Delete photo"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className={styles.photoInfo}>
                  <p className={styles.photoName}>{photo.originalName}</p>
                  
                  <div className={styles.categorySelect}>
                    <select 
                      value={photo.category || 'general'} 
                      onChange={(e) => handleCategoryChange(photo.id, e.target.value)}
                      className={styles.select}
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <p className={styles.photoMeta}>
                    <span>{formatFileSize(photo.size)}</span>
                    <span className={styles.dot}>•</span>
                    <span>{formatDate(photo.uploadDate)}</span>
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
