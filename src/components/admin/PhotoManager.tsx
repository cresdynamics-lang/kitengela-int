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
  { id: 'leadership', name: 'Leadership' },
  { id: 'about', name: 'Who We Are (About)' },
  { id: 'services', name: 'Join Us (Services)' },
  { id: 'give', name: 'Give' },
  { id: 'discipleship', name: 'Discipleship Banner' },
  { id: 'ministries', name: 'Ministries Banner' },
  { id: 'contact', name: 'Contact Banner' },
]

export default function PhotoManager() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchPhotos()

    // Disable realtime subscription for now to improve loading performance
    // const channel = supabase
    //   .channel('admin:photos')
    //   .on('postgres_changes', { event: '*', schema: 'public', table: 'photos' }, () => {
    //     fetchPhotos()
    //   })
    //   .subscribe()

    return () => {
      // supabase.removeChannel(channel)
    }
  }, [])

  const fetchPhotos = async () => {
    try {
      const token = getAdminToken()
      if (!token) return

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('API Timeout')), 10000)
      )

      let fetchedPhotos: Photo[] = []
      
      try {
        const response = await Promise.race([
          adminApi.getPhotos(token),
          timeoutPromise
        ]) as { success: boolean; data: any }

        if (response && response.success && Array.isArray(response.data)) {
          fetchedPhotos = response.data as Photo[]
        }
      } catch (err) {
        console.warn('Photos load timed out or failed:', err)
      }

      // Hardcoded fallback photos so Admin can see and manage them even if DB is empty or down
      const defaultPhotos: Photo[] = [
        { id: 'sys-hero-1', url: '/Carousel1.jpg', originalName: 'Carousel1.jpg', filename: 'Carousel1.jpg', category: 'hero', size: 0, uploadDate: new Date().toISOString() },
        { id: 'sys-hero-2', url: '/Carousel2.jpg', originalName: 'Carousel2.jpg', filename: 'Carousel2.jpg', category: 'hero', size: 0, uploadDate: new Date().toISOString() },
        { id: 'sys-hero-3', url: '/carousel3.jpeg', originalName: 'carousel3.jpeg', filename: 'carousel3.jpeg', category: 'hero', size: 0, uploadDate: new Date().toISOString() },
        { id: 'sys-found-1', url: '/whatsapp-14.jpeg', originalName: 'whatsapp-14.jpeg', filename: 'whatsapp-14.jpeg', category: 'foundation', size: 0, uploadDate: new Date().toISOString() },
        { id: 'sys-found-2', url: '/whatsapp-15.jpeg', originalName: 'whatsapp-15.jpeg', filename: 'whatsapp-15.jpeg', category: 'foundation', size: 0, uploadDate: new Date().toISOString() },
        { id: 'sys-found-3', url: '/whatsapp-16.jpeg', originalName: 'whatsapp-16.jpeg', filename: 'whatsapp-16.jpeg', category: 'foundation', size: 0, uploadDate: new Date().toISOString() },
        { id: 'sys-reach-1', url: '/outreach-1.jpeg', originalName: 'outreach-1.jpeg', filename: 'outreach-1.jpeg', category: 'reach', size: 0, uploadDate: new Date().toISOString() },
        { id: 'sys-reach-2', url: '/outreach-2.jpeg', originalName: 'outreach-2.jpeg', filename: 'outreach-2.jpeg', category: 'reach', size: 0, uploadDate: new Date().toISOString() },
        { id: 'sys-reach-3', url: '/whatsapp-19.jpeg', originalName: 'whatsapp-19.jpeg', filename: 'whatsapp-19.jpeg', category: 'reach', size: 0, uploadDate: new Date().toISOString() },
        { id: 'sys-pray-1', url: '/whatsapp-1.jpeg', originalName: 'whatsapp-1.jpeg', filename: 'whatsapp-1.jpeg', category: 'prayer', size: 0, uploadDate: new Date().toISOString() },
        { id: 'sys-pray-2', url: '/whatsapp-2.jpeg', originalName: 'whatsapp-2.jpeg', filename: 'whatsapp-2.jpeg', category: 'prayer', size: 0, uploadDate: new Date().toISOString() },
        { id: 'sys-pray-3', url: '/whatsapp-4.jpeg', originalName: 'whatsapp-4.jpeg', filename: 'whatsapp-4.jpeg', category: 'prayer', size: 0, uploadDate: new Date().toISOString() },
        { id: 'sys-give-1', url: '/whatsapp-7.jpeg', originalName: 'whatsapp-7.jpeg', filename: 'whatsapp-7.jpeg', category: 'giving', size: 0, uploadDate: new Date().toISOString() },
        { id: 'sys-give-2', url: '/whatsapp-11.jpeg', originalName: 'whatsapp-11.jpeg', filename: 'whatsapp-11.jpeg', category: 'giving', size: 0, uploadDate: new Date().toISOString() },
        { id: 'sys-give-3', url: '/whatsapp-12.jpeg', originalName: 'whatsapp-12.jpeg', filename: 'whatsapp-12.jpeg', category: 'giving', size: 0, uploadDate: new Date().toISOString() },
        { id: 'sys-about-1', url: '/bible-study.jpeg', originalName: 'bible-study.jpeg', filename: 'bible-study.jpeg', category: 'about', size: 0, uploadDate: new Date().toISOString() },
        { id: 'sys-about-2', url: '/mission-vision.jpeg', originalName: 'mission-vision.jpeg', filename: 'mission-vision.jpeg', category: 'about', size: 0, uploadDate: new Date().toISOString() },
        { id: 'sys-about-3', url: '/core-values.jpeg', originalName: 'core-values.jpeg', filename: 'core-values.jpeg', category: 'about', size: 0, uploadDate: new Date().toISOString() },
        { id: 'sys-lead-1', url: '/Rev.Evans1.jpeg', originalName: 'Rev.Evans1.jpeg', filename: 'Rev.Evans1.jpeg', category: 'leadership', size: 0, uploadDate: new Date().toISOString() },
        { id: 'sys-lead-2', url: '/Rev.Evans2.jpeg', originalName: 'Rev.Evans2.jpeg', filename: 'Rev.Evans2.jpeg', category: 'leadership', size: 0, uploadDate: new Date().toISOString() },
        { id: 'sys-lead-3', url: '/Rev.Evans3.jpeg', originalName: 'Rev.Evans3.jpeg', filename: 'Rev.Evans3.jpeg', category: 'leadership', size: 0, uploadDate: new Date().toISOString() },
        { id: 'sys-disc-1', url: '/bible-study.jpeg', originalName: 'bible-study.jpeg', filename: 'bible-study.jpeg', category: 'discipleship', size: 0, uploadDate: new Date().toISOString() },
      ]

      const existingUrls = new Set(fetchedPhotos.map(p => p.url))
      const missingDefaults = defaultPhotos.filter(p => !existingUrls.has(p.url))

      setPhotos([...fetchedPhotos, ...missingDefaults])
    } catch (error) {
      console.error('Fatal error in fetchPhotos:', error)
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
        // Refresh photos after upload to get the latest data
        fetchPhotos()
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

  const handleImageError = (photoId: string) => {
    setImageErrors(prev => new Set([...prev, photoId]))
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
          <input
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
                  {imageErrors.has(photo.id) ? (
                    <div className={styles.photoError}>
                      <FileImage size={32} />
                      <span>Failed to load</span>
                    </div>
                  ) : (
                    <img
                      src={photo.url}
                      alt={photo.originalName}
                      className={styles.photo}
                      onError={() => handleImageError(photo.id)}
                    />
                  )}
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
