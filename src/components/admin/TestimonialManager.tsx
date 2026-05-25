import { useState, useEffect } from 'react'
import { adminApi } from '@/lib/api'
import { getAdminToken } from '@/lib/adminSession'
import styles from './TestimonialManager.module.css'
import { Plus, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react'

interface Testimonial {
  id: string
  author_name: string
  title: string | null
  message: string
  image_url: string | null
  is_published: boolean
  order_index: number
}

export default function TestimonialManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    authorName: '',
    title: '',
    message: '',
    imageUrl: '',
    isPublished: true,
    orderIndex: 0,
  })

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const token = getAdminToken()
      if (!token) return

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('API Timeout')), 10000)
      )

      let fetchedTestimonials: Testimonial[] = []

      try {
        const response = await Promise.race([
          adminApi.getTestimonials(token),
          timeoutPromise
        ]) as { success: boolean; data: any }

        if (response && response.success && Array.isArray(response.data)) {
          fetchedTestimonials = response.data
        }
      } catch (err) {
        console.warn('Testimonials load timed out or failed:', err)
      }

      const defaultTestimonials: Testimonial[] = [
        {
          id: 'fallback-1',
          authorName: 'Sarah M.',
          title: 'Life Group Member',
          message: 'The Foundation Classes completely changed my understanding of grace. I finally feel rooted in my faith and confident in my salvation.',
          isPublished: true,
          orderIndex: 0
        },
        {
          id: 'fallback-2',
          authorName: 'David K.',
          title: 'Mentorship Program',
          message: "Joining a mentorship group was the best decision I made this year. Having someone walk alongside me through life's challenges is invaluable.",
          isPublished: true,
          orderIndex: 1
        },
        {
          id: 'fallback-3',
          authorName: 'Joy W.',
          title: 'Ministry Leader',
          message: "Leadership Training didn't just equip me for ministry; it transformed how I lead at my workplace and in my family.",
          isPublished: true,
          orderIndex: 2
        }
      ]

      const existingNames = new Set(fetchedTestimonials.map(t => t.authorName))
      const missingDefaults = defaultTestimonials.filter(t => !existingNames.has(t.authorName))

      setTestimonials([...fetchedTestimonials, ...missingDefaults])
    } catch (error) {
      console.error('Fatal error in fetchTestimonials:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    const checked = (e.target as HTMLInputElement).checked

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) || 0 : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const token = getAdminToken()
      if (!token) return

      if (editingId) {
        const res = await adminApi.updateTestimonial(token, editingId, formData)
        if (res.success) {
          setTestimonials(prev => prev.map(t => t.id === editingId ? res.data : t))
          closeForm()
        }
      } else {
        const res = await adminApi.createTestimonial(token, formData)
        if (res.success) {
          setTestimonials(prev => [...prev, res.data])
          closeForm()
        }
      }
    } catch (error: any) {
      alert(error.message || 'Failed to save testimonial')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (t: Testimonial) => {
    setFormData({
      authorName: t.author_name,
      title: t.title || '',
      message: t.message,
      imageUrl: t.image_url || '',
      isPublished: t.is_published,
      orderIndex: t.order_index,
    })
    setEditingId(t.id)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return

    try {
      const token = getAdminToken()
      if (!token) return
      const res = await adminApi.deleteTestimonial(token, id)
      if (res.success) {
        setTestimonials(prev => prev.filter(t => t.id !== id))
      }
    } catch (error: any) {
      alert(error.message || 'Failed to delete testimonial')
    }
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setEditingId(null)
    setFormData({
      authorName: '',
      title: '',
      message: '',
      imageUrl: '',
      isPublished: true,
      orderIndex: 0,
    })
  }

  if (loading) return <div className={styles.loading}>Loading testimonials...</div>

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Discipleship Testimonials</h2>
          <p className={styles.subtitle}>Manage testimonials displayed on the Discipleship page.</p>
        </div>
        <button className={styles.addButton} onClick={() => setIsFormOpen(true)}>
          <Plus size={20} /> Add Testimonial
        </button>
      </div>

      {isFormOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>{editingId ? 'Edit Testimonial' : 'New Testimonial'}</h3>
              <button className={styles.closeBtn} onClick={closeForm}>✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Author Name *</label>
                <input required type="text" name="authorName" value={formData.authorName} onChange={handleInputChange} />
              </div>
              
              <div className={styles.formGroup}>
                <label>Role / Title (e.g., Life Group Member)</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} />
              </div>

              <div className={styles.formGroup}>
                <label>Message *</label>
                <textarea required rows={4} name="message" value={formData.message} onChange={handleInputChange} />
              </div>

              <div className={styles.formGroup}>
                <label>Author Image URL (optional)</label>
                <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} placeholder="/whatsapp-1.jpeg or https://..." />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Order Index (lower appears first)</label>
                  <input type="number" name="orderIndex" value={formData.orderIndex} onChange={handleInputChange} />
                </div>
                
                <div className={styles.formGroupCheckbox}>
                  <input type="checkbox" id="isPublished" name="isPublished" checked={formData.isPublished} onChange={handleInputChange} />
                  <label htmlFor="isPublished">Published</label>
                </div>
              </div>

              <div className={styles.formActions}>
                <button type="button" className={styles.cancelBtn} onClick={closeForm}>Cancel</button>
                <button type="submit" className={styles.submitBtn} disabled={submitting}>
                  {submitting ? 'Saving...' : 'Save Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={styles.list}>
        {testimonials.length === 0 ? (
          <div className={styles.emptyState}>No testimonials found. Add your first one!</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Author</th>
                <th>Role</th>
                <th>Message Snippet</th>
                <th>Order</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map(t => (
                <tr key={t.id}>
                  <td className={styles.bold}>{t.author_name}</td>
                  <td>{t.title || '-'}</td>
                  <td className={styles.truncate}>{t.message.length > 50 ? t.message.substring(0, 50) + '...' : t.message}</td>
                  <td>{t.order_index}</td>
                  <td>
                    {t.is_published ? (
                      <span className={styles.statusActive}><CheckCircle size={14} /> Published</span>
                    ) : (
                      <span className={styles.statusDraft}><XCircle size={14} /> Draft</span>
                    )}
                  </td>
                  <td className={styles.actions}>
                    <button onClick={() => handleEdit(t)} className={styles.iconBtn} title="Edit"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(t.id)} className={styles.iconBtnDelete} title="Delete"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
