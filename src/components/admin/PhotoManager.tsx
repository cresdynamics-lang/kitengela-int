import { useState, useEffect } from 'react'
import { Trash2, Upload, Image as ImageIcon, FileImage, X } from 'lucide-react'
import styles from './PhotoManager.module.css'

interface Photo {
  id: string
  filename: string
  originalName: string
  url: string
  size: number
  uploadDate: string
}

export default function PhotoManager() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)

  useEffect(() => {
    fetchPhotos()
  }, [])

  const fetchPhotos = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      if (!token) return

      const response = await fetch('/api/admin/photos', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setPhotos(data.success ? data.data : [])
      } else {
        console.error('Failed to fetch photos')
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

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('photo', selectedFile)

      const token = localStorage.getItem('adminToken')
      if (!token) return

      const response = await fetch('/api/admin/photos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setPhotos(prev => [data.data, ...prev])
          setSelectedFile(null)
          // Reset file input
          const fileInput = document.getElementById('photo-input') as HTMLInputElement
          if (fileInput) fileInput.value = ''
        }
      } else {
        console.error('Upload failed')
      }
    } catch (error) {
      console.error('Error uploading photo:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (filename: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) return

    try {
      const token = localStorage.getItem('adminToken')
      if (!token) return

      const response = await fetch(`/api/admin/photos/${filename}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setPhotos(prev => prev.filter(photo => photo.filename !== filename))
      } else {
        console.error('Delete failed')
      }
    } catch (error) {
      console.error('Error deleting photo:', error)
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
        <h2 className={styles.title}>Photo Manager</h2>
        <p className={styles.subtitle}>Upload and manage photos for carousels</p>
      </div>

      <div className={styles.uploadSection}>
        <div className={styles.uploadArea}>
          <input
            id="photo-input"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className={styles.fileInput}
          />
          
          <div
            className={`${styles.dropZone} ${dragActive ? styles.dragActive : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
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
            {uploading ? 'Uploading...' : 'Upload Photo'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading photos...</div>
      ) : (
        <div className={styles.photoGrid}>
          {photos.length === 0 ? (
            <div className={styles.emptyState}>
              <FileImage className={styles.emptyIcon} size={48} />
              <p>No photos uploaded yet</p>
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
                  <p className={styles.photoSize}>{formatFileSize(photo.size)}</p>
                  <p className={styles.photoDate}>{formatDate(photo.uploadDate)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
