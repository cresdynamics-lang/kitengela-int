import { useState, useEffect } from 'react'
import styles from './admin.module.css'
import { adminApi } from '@/lib/api'
import ImageUploadField from './ImageUploadField'

interface MassSermon {
  id: string
  title: string
  description: string | null
  speaker: string | null
  date: string
  videoUrl: string | null
  audioUrl: string | null
  thumbnailUrl: string | null
  duration: number | null
  views: number
}

export default function MassSermons() {
  const [sermons, setSermons] = useState<MassSermon[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    speaker: '',
    date: '',
    thumbnail_url: '',
  })

  useEffect(() => {
    fetchSermons()
  }, [])

  const fetchSermons = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      if (!token) return

      const response = await adminApi.getSermons(token)
      if (response.success && Array.isArray(response.data)) {
        setSermons(response.data as MassSermon[])
      }
    } catch (error) {
      console.error('Error fetching sermons:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('adminToken')
    if (!token) return

    try {
      const sermonData = {
        title: formData.title,
        description: formData.description || null,
        speaker: formData.speaker || null,
        date: new Date(formData.date).toISOString(),
        videoUrl: null,
        audioUrl: null,
        thumbnailUrl: formData.thumbnail_url || null,
        duration: null,
      }

      if (editingId) {
        await adminApi.updateSermon(token, editingId, sermonData)
      } else {
        await adminApi.createSermon(token, sermonData)
      }

      fetchSermons()
      resetForm()
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error saving sermon')
    }
  }

  const handleEdit = (sermon: MassSermon) => {
    const sermonDate = new Date(sermon.date)
    const formattedDate = Number.isNaN(sermonDate.getTime())
      ? ''
      : sermonDate.toISOString().split('T')[0]
    const thumbnailUrl = sermon.thumbnailUrl || ''
    
    setFormData({
      title: sermon.title,
      description: sermon.description || '',
      speaker: sermon.speaker || '',
      date: formattedDate,
      thumbnail_url: thumbnailUrl,
    })
    setEditingId(sermon.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sermon?')) return

    try {
      const token = localStorage.getItem('adminToken')
      if (!token) return

      await adminApi.deleteSermon(token, id)
      fetchSermons()
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error deleting sermon')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      speaker: '',
      date: '',
      thumbnail_url: '',
    })
    setEditingId(null)
    setShowForm(false)
  }

  if (loading) return <div className={styles.loading}>Loading...</div>

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Sermons</h2>
        <button onClick={() => setShowForm(true)} className={styles.addButton}>
          + Add New Sermon
        </button>
      </div>
      <div className={styles.infoBox} style={{ marginBottom: '1.5rem' }}>
        <h3>Where sermons appear</h3>
        <ul>
          <li><strong>Sunday Sermon section</strong> (home page, below the hero carousel): The <strong>most recent</strong> sermon by date is shown — heading, paragraph, speaker(s), and poster image. Mass/service times are shown in the Services section.</li>
          <li><strong>Sermons page</strong>: All sermons are listed with heading, paragraph, speaker(s), and poster. The <strong>Join Us Live</strong> / live stream button is the active way to watch — set the link in <strong>Live Stream</strong> in the admin.</li>
          <li>Use the form below for <strong>heading</strong>, <strong>paragraph</strong>, <strong>speaker(s)</strong>, and <strong>poster image</strong> URL only.</li>
        </ul>
      </div>

      {showForm && (
        <div className={styles.formModal}>
          <div className={styles.formContent}>
            <h3>{editingId ? 'Edit' : 'Add'} Sermon</h3>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Heading (Title) *</label>
                <input
                  type="text"
                  value={formData.title ?? ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. This Sunday's Sermon"
                  required
                />
                <p className={styles.helpText}>Shown as the main H1 in yellow on the Sunday Sermon section and on the Sermons page.</p>
              </div>
              <div className={styles.formGroup}>
                <label>Short paragraph (Description)</label>
                <textarea
                  value={formData.description ?? ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief summary or intro"
                  rows={4}
                />
                <p className={styles.helpText}>Shown below the heading on the home page and on the Sermons page.</p>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Speaker or Speakers</label>
                  <input
                    type="text"
                    value={formData.speaker ?? ''}
                    onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
                    placeholder="e.g. Rev. Evans Kochoo or Name1, Name2"
                  />
                  <p className={styles.helpText}>One name or several separated by commas.</p>
                </div>
                <div className={styles.formGroup}>
                  <label>Date *</label>
                  <input
                    type="date"
                    value={formData.date ?? ''}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                  <p className={styles.helpText}>Latest by date appears in the Sunday Sermon section on the home page.</p>
                </div>
              </div>
              <ImageUploadField
                label="Poster / Image"
                value={formData.thumbnail_url ?? ''}
                onChange={(url) => setFormData({ ...formData, thumbnail_url: url })}
                helpText="Shown in the Sunday Sermon section on the home page and on the Sermons page."
              />
              <div className={styles.formActions}>
                <button type="submit" className={styles.saveButton}>Save</button>
                <button type="button" onClick={resetForm} className={styles.cancelButton}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={styles.table}>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Speaker</th>
              <th>Date</th>
              <th>Views</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sermons.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.empty}>No sermons found. Create your first sermon above.</td>
              </tr>
            ) : (
              sermons.map((sermon) => (
                <tr key={sermon.id}>
                  <td>{sermon.title}</td>
                  <td>{sermon.speaker || '-'}</td>
                  <td>
                    {(() => {
                      const d = new Date(sermon.date)
                      return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString()
                    })()}
                  </td>
                  <td>{sermon.views || 0}</td>
                  <td>
                    <button onClick={() => handleEdit(sermon)} className={styles.editButton}>Edit</button>
                    <button onClick={() => handleDelete(sermon.id)} className={styles.deleteButton}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
