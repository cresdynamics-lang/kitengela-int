import { useState, useEffect } from 'react'
import PhotoManager from './PhotoManager'
import styles from './PhotoCarouselManager.module.css'
import { supabase } from '@/lib/supabase'

interface CarouselPhoto {
  id: string
  url: string
  title: string
  description: string
}

export default function PhotoCarouselManager() {
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([])
  const [carousels, setCarousels] = useState<Record<string, CarouselPhoto[]>>({
    home: [],
    about: [],
    services: [],
    leadership: [],
    outreach: []
  })

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) return

    const fetchPhotos = () => {
      fetch('/api/admin/photos', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            const photos = data.data.map((photo: any) => ({
              id: photo.id,
              url: photo.url,
              title: photo.originalName || photo.original_name,
              description: photo.uploadDate ? `Uploaded: ${new Date(photo.uploadDate).toLocaleDateString()}` : photo.upload_date ? `Uploaded: ${new Date(photo.upload_date).toLocaleDateString()}` : 'Date unknown'
            }))
            
            setCarousels({
              home: photos,
              about: photos,
              services: photos,
              leadership: photos,
              outreach: photos
            })
          }
        })
        .catch(error => console.error('Error fetching photos:', error))
    }

    fetchPhotos()

    const channel = supabase
      .channel('carousel:photos')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'photos' }, () => {
        fetchPhotos()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const handleRemoveFromCarousel = (photoId: string) => {
    setSelectedPhotos(prev => prev.filter(id => id !== photoId))
  }

  const getSelectedPhotos = (carouselType: string) => {
    // For now we just return selected photos for any carousel for simplicity
    // If you need specific photos per carousel, you'd need more state
    return selectedPhotos.map(photoId => {
      const photos = Object.values(carousels).flat()
      return photos.find(p => p.id === photoId)
    }).filter((p): p is CarouselPhoto => !!p)
  }

  const updateCarousel = (carouselType: string, photos: CarouselPhoto[]) => {
    setCarousels(prev => ({
      ...prev,
      [carouselType]: photos
    }))
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Carousel Photo Manager</h2>
        <p>Manage photos for different sections of your website</p>
      </div>

      <div className={styles.content}>
        <div className={styles.leftPanel}>
          <PhotoManager />
          
          <div className={styles.carouselSection}>
            <h3 className={styles.sectionTitle}>Selected Photos ({selectedPhotos.length})</h3>
            <div className={styles.selectedPhotos}>
              {selectedPhotos.map(photoId => {
                const photolist = Object.values(carousels).flat()
                const photo = photolist.find(p => p.id === photoId)
                return photo ? (
                  <div key={photoId} className={styles.selectedPhoto}>
                    <img src={photo.url} alt={photo.title} className={styles.selectedPhotoImage} />
                    <div className={styles.selectedPhotoInfo}>
                      <p className={styles.selectedPhotoTitle}>{photo.title}</p>
                      <p className={styles.selectedPhotoDesc}>{photo.description}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveFromCarousel(photoId)}
                      className={styles.removeButton}
                      title="Remove from selection"
                    >
                      ×
                    </button>
                  </div>
                ) : null
              })}
            </div>
          </div>

          <div className={styles.carouselBuilder}>
            <h3 className={styles.sectionTitle}>Carousel Builder</h3>
            
            {['home', 'about', 'services', 'leadership', 'outreach'].map(section => (
              <div key={section} className={styles.carouselSection}>
                <h4 className={styles.carouselName}>{section.charAt(0).toUpperCase() + section.slice(1)} Carousel</h4>
                <div className={styles.carouselPhotos}>
                  {getSelectedPhotos(section).map(photo => (
                    <div key={photo.id} className={styles.carouselPhoto}>
                      <img src={photo.url} alt={photo.title} className={styles.carouselPhotoImage} />
                      <div className={styles.carouselPhotoInfo}>
                        <p className={styles.carouselPhotoTitle}>{photo.title}</p>
                        <p className={styles.carouselPhotoDesc}>{photo.description}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveFromCarousel(photo.id)}
                        className={styles.carouselRemoveButton}
                        title="Remove from carousel"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => updateCarousel(section, getSelectedPhotos(section))}
                  className={styles.updateButton}
                  disabled={getSelectedPhotos(section).length === 0}
                >
                  Update {section.charAt(0).toUpperCase() + section.slice(1)} Carousel
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
