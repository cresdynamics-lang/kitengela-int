'use client'

import { useState, useEffect } from 'react'
import styles from './admin.module.css'
import { adminApi } from '@/lib/api'

interface WeeklyMass {
  id: string
  week_start_date: string
  week_end_date: string
  title: string
  description: string
  service_type: string
  date: string
  time: string
  location: string
  link_url?: string | null
  speaker: string
  notes: string
}

export default function WeeklyMasses() {
  const [masses, setMasses] = useState<WeeklyMass[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    week_start_date: '',
    week_end_date: '',
    title: '',
    description: '',
    service_type: '',
    date: '',
    time: '',
    location: '',
    link_url: '',
    speaker: '',
    notes: ''
  })

  useEffect(() => {
    fetchMasses()
  }, [])

  const fetchMasses = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      if (!token) return

      const response = await adminApi.getPrograms(token)
      if (response.success && Array.isArray(response.data)) {
        const programs = response.data as { id: string; title?: string; description?: string; day?: string; startTime?: string; start_time?: string; venue?: string; link_url?: string | null }[]
        setMasses(programs.map((p) => ({
          id: p.id,
          week_start_date: new Date().toISOString().split('T')[0],
          week_end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          title: p.title ?? '',
          description: p.description ?? '',
          service_type: p.day ?? '',
          date: new Date().toISOString().split('T')[0],
          time: p.startTime ?? p.start_time ?? '',
          location: p.venue ?? '',
          link_url: p.link_url ?? '',
          speaker: '',
          notes: '',
        })))
      }
    } catch (error) {
      console.error('Error fetching masses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('adminToken')
    if (!token) return
    
    try {
      const programData = {
        title: formData.title,
        day: formData.service_type || 'Sunday',
        startTime: formData.time,
        endTime: formData.time, // You may want to add endTime field
        venue: formData.location,
        contacts: [],
        description: formData.description,
        linkUrl: formData.link_url || null,
        isActive: true,
        orderIndex: 0,
      }

      if (editingId) {
        await adminApi.updateProgram(token, editingId, programData)
      } else {
        await adminApi.createProgram(token, programData)
      }

      fetchMasses()
      resetForm()
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error saving weekly mass')
    }
  }

  const handleEdit = (mass: WeeklyMass) => {
    setFormData({
      week_start_date: mass.week_start_date,
      week_end_date: mass.week_end_date,
      title: mass.title,
      description: mass.description || '',
      service_type: mass.service_type || '',
      date: mass.date,
      time: mass.time,
      location: mass.location || '',
      link_url: mass.link_url || '',
      speaker: mass.speaker || '',
      notes: mass.notes || ''
    })
    setEditingId(mass.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this weekly mass?')) return
    
    try {
      const token = localStorage.getItem('adminToken')
      if (!token) return

      await adminApi.deleteProgram(token, id)
      fetchMasses()
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error deleting weekly mass')
    }
  }

  const resetForm = () => {
    setFormData({
      week_start_date: '',
      week_end_date: '',
      title: '',
      description: '',
      service_type: '',
      date: '',
      time: '',
      location: '',
      link_url: '',
      speaker: '',
      notes: ''
    })
    setEditingId(null)
    setShowForm(false)
  }

  if (loading) return <div className={styles.loading}>Loading...</div>

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Weekly Masses</h2>
        <button onClick={() => setShowForm(true)} className={styles.addButton}>
          + Add New Weekly Mass
        </button>
      </div>

      {showForm && (
        <div className={styles.formModal}>
          <div className={styles.formContent}>
            <h3>{editingId ? 'Edit' : 'Add'} Weekly Mass</h3>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Week Start Date *</label>
                  <input
                    type="date"
                    value={formData.week_start_date}
                    onChange={(e) => setFormData({ ...formData, week_start_date: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Week End Date *</label>
                  <input
                    type="date"
                    value={formData.week_end_date}
                    onChange={(e) => setFormData({ ...formData, week_end_date: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Service Type</label>
                  <input
                    type="text"
                    value={formData.service_type}
                    onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                    placeholder="e.g., Sunday Service, Bible Study"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Time *</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Service Link URL (Optional)</label>
                <input
                  type="url"
                  value={formData.link_url}
                  onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                  placeholder="https://meet.google.com/... or https://youtube.com/..."
                />
              </div>
              <div className={styles.formGroup}>
                <label>Speaker</label>
                <input
                  type="text"
                  value={formData.speaker}
                  onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>
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
              <th>Service Type</th>
              <th>Date</th>
              <th>Time</th>
              <th>Speaker</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {masses.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.empty}>No weekly masses found</td>
              </tr>
            ) : (
              masses.map((mass) => (
                <tr key={mass.id}>
                  <td>{mass.title}</td>
                  <td>{mass.service_type || '-'}</td>
                  <td>{new Date(mass.date).toLocaleDateString()}</td>
                  <td>{mass.time}</td>
                  <td>{mass.speaker || '-'}</td>
                  <td>
                    <button onClick={() => handleEdit(mass)} className={styles.editButton}>Edit</button>
                    <button onClick={() => handleDelete(mass.id)} className={styles.deleteButton}>Delete</button>
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
