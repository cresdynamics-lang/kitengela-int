import { useState, useEffect } from 'react'
import styles from './admin.module.css'
import { adminApi } from '@/lib/api'
import { getAdminToken } from '@/lib/adminSession'

interface Program {
  id: string
  title: string
  day: string
  startTime: string
  endTime: string
  venue: string
  contacts: string[]
  description: string | null
  posterImageUrl: string | null
  isActive: boolean
  orderIndex: number
}

export default function Programs() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    day: 'Sunday',
    startTime: '',
    endTime: '',
    venue: '',
    contacts: '',
    description: '',
    posterImageUrl: '',
    isActive: true,
    orderIndex: 0,
  })

  useEffect(() => {
    fetchPrograms()
  }, [])

  const fetchPrograms = async () => {
    try {
      const token = getAdminToken()
      if (!token) return

      const response = await adminApi.getPrograms(token)
      if (response.success && Array.isArray(response.data)) {
        setPrograms(response.data as Program[])
      }
    } catch (error) {
      console.error('Error fetching programs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = getAdminToken()
    if (!token) return

    try {
      const programData = {
        ...formData,
        contacts: formData.contacts.split(',').map((c) => c.trim()).filter((c) => c),
        posterImageUrl: formData.posterImageUrl || null,
        description: formData.description || null,
      }

      if (editingId) {
        await adminApi.updateProgram(token, editingId, programData)
        alert('Program updated successfully')
      } else {
        await adminApi.createProgram(token, programData)
        alert('Program created successfully')
      }

      fetchPrograms()
      resetForm()
    } catch (error: any) {
      alert(error.message || 'Error saving program')
    }
  }

  const handleEdit = (program: Program) => {
    const contacts = Array.isArray(program.contacts)
      ? program.contacts.join(', ')
      : ''
    setFormData({
      title: program.title,
      day: program.day,
      startTime: program.startTime,
      endTime: program.endTime,
      venue: program.venue,
      contacts: contacts,
      description: program.description || '',
      posterImageUrl: program.posterImageUrl || '',
      isActive: program.isActive,
      orderIndex: program.orderIndex,
    })
    setEditingId(program.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this program?')) return

    try {
      const token = getAdminToken()
      if (!token) return

      await adminApi.deleteProgram(token, id)
      fetchPrograms()
    } catch (error: any) {
      alert(error.message || 'Error deleting program')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      day: 'Sunday',
      startTime: '',
      endTime: '',
      venue: '',
      contacts: '',
      description: '',
      posterImageUrl: '',
      isActive: true,
      orderIndex: 0,
    })
    setEditingId(null)
    setShowForm(false)
  }

  if (loading) return <div className={styles.loading}>Loading...</div>

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Gatherings & Services</h2>
        <button onClick={() => setShowForm(true)} className={styles.addButton}>
          + Add New Service
        </button>
      </div>

      {showForm && (
        <div className={styles.formModal}>
          <div className={styles.formContent}>
            <h3>{editingId ? 'Edit' : 'Add'} Service</h3>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Service Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Day *</label>
                  <select
                    value={formData.day}
                    onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                    required
                  >
                    <option value="Sunday">Sunday</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Start Time *</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>End Time *</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Venue *</label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Contacts (comma-separated)</label>
                <input
                  type="text"
                  value={formData.contacts}
                  onChange={(e) => setFormData({ ...formData, contacts: e.target.value })}
                  placeholder="+254 722 566 399, +254 720 276 162"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Poster Image URL (Optional)</label>
                <input
                  type="url"
                  value={formData.posterImageUrl}
                  onChange={(e) => setFormData({ ...formData, posterImageUrl: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Brief Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Display Order</label>
                  <input
                    type="number"
                    value={formData.orderIndex}
                    onChange={(e) => setFormData({ ...formData, orderIndex: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    />
                    Publish & Active
                  </label>
                </div>
              </div>
              <div className={styles.formActions}>
                <button type="submit" className={styles.saveButton}>Save Service</button>
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
              <th>Day</th>
              <th>Time</th>
              <th>Venue</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {programs.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.empty}>No programs found</td>
              </tr>
            ) : (
              programs.map((program) => (
                <tr key={program.id}>
                  <td>{program.title}</td>
                  <td>{program.day}</td>
                  <td>{program.startTime} - {program.endTime}</td>
                  <td>{program.venue}</td>
                  <td>
                    <span className={program.isActive ? styles.active : styles.inactive}>
                      {program.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => handleEdit(program)} className={styles.editButton}>Edit</button>
                    <button onClick={() => handleDelete(program.id)} className={styles.deleteButton}>Delete</button>
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
