import { useState, useEffect } from 'react'
import { PhotoManager } from './PhotoManager'
import styles from './PhotoCarouselManager.module.css'

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
            title: photo.originalName,
            description: `Uploaded: ${new Date(photo.uploadDate).toLocaleDateString()}`
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
  }, [])

  const handleAddToCarousel = (photoId: string, carouselType: string) => {
    setSelectedPhotos(prev => {
      if (prev.includes(photoId)) {
        return prev.filter(id => id !== photoId)
      }
      return [...prev, photoId]
    })
  }

  const handleRemoveFromCarousel = (photoId: string, carouselType: string) => {
    setSelectedPhotos(prev => prev.filter(id => id !== photoId))
  }

  const getSelectedPhotos = (carouselType: string) => {
    return selectedPhotos.map(photoId => {
      const photo = [...carousels.home, ...carousels.about, ...carousels.services, ...carousels.leadership, ...carousels.outreach]
        .find(p => p.id === photoId)
      return photo
    }).filter(Boolean)
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
                const photo = [...carousels.home, ...carousels.about, ...carousels.services, ...carousels.leadership, ...carousels.outreach]
                  .find(p => p.id === photoId)
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
    </div>
  )
}
