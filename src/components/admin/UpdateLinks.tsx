import { useState, useEffect } from 'react'
import styles from './admin.module.css'
import { adminApi } from '@/lib/api'
import { getAdminToken } from '@/lib/adminSession'

interface UpdateLink {
  id: string
  title: string
  url: string
  description: string | null
  category: string
  isActive: boolean
  orderIndex: number
}

export default function UpdateLinks() {
  const [links, setLinks] = useState<UpdateLink[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    category: '',
    is_active: true,
    display_order: 0
  })

  useEffect(() => {
    fetchLinks()
  }, [])

  const fetchLinks = async () => {
    try {
      const token = getAdminToken()
      if (!token) return

      const response = await adminApi.getUpdateLinks(token)
      if (response.success && Array.isArray(response.data)) {
        setLinks(response.data as UpdateLink[])
      }
    } catch (error) {
      console.error('Error fetching links:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = getAdminToken()
    if (!token) return

    try {
      const payload = {
        title: formData.title,
        url: formData.url,
        description: formData.description || undefined,
        category: formData.category || 'General',
        is_active: formData.is_active,
        display_order: formData.display_order
      }
      if (editingId) {
        await adminApi.updateUpdateLink(token, editingId, payload)
        alert('Link updated successfully.')
      } else {
        await adminApi.createUpdateLink(token, payload)
        alert('Link created successfully.')
      }
      fetchLinks()
      resetForm()
    } catch (error: any) {
      alert(error?.message || 'Error saving link')
    }
  }

  const handleEdit = (link: UpdateLink) => {
    setFormData({
      title: link.title,
      url: link.url,
      description: link.description || '',
      category: link.category || '',
      is_active: link.isActive,
      display_order: link.orderIndex
    })
    setEditingId(link.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return
    const token = getAdminToken()
    if (!token) return
    try {
      await adminApi.deleteUpdateLink(token, id)
      fetchLinks()
    } catch {
      alert('Error deleting link')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      url: '',
      description: '',
      category: '',
      is_active: true,
      display_order: 0
    })
    setEditingId(null)
    setShowForm(false)
  }

  if (loading) return <div className={styles.loading}>Loading...</div>

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Update Links</h2>
        <button onClick={() => setShowForm(true)} className={styles.addButton}>
          + Add New Link
        </button>
      </div>

      {showForm && (
        <div className={styles.formModal}>
          <div className={styles.formContent}>
            <h3>{editingId ? 'Edit' : 'Add'} Update Link</h3>
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
              <div className={styles.formGroup}>
                <label>URL *</label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  required
                />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Social Media, Resources"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Display Order</label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  />
                </div>
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
                <label>
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  />
                  Active
                </label>
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
              <th>URL</th>
              <th>Category</th>
              <th>Order</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {links.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.empty}>No links found</td>
              </tr>
            ) : (
              links.map((link) => (
                <tr key={link.id}>
                  <td>{link.title}</td>
                  <td><a href={link.url} target="_blank" rel="noopener noreferrer">{link.url}</a></td>
                  <td>{link.category || '-'}</td>
                  <td>{link.orderIndex}</td>
                  <td>
                    <span className={link.isActive ? styles.active : styles.inactive}>
                      {link.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => handleEdit(link)} className={styles.editButton}>Edit</button>
                    <button onClick={() => handleDelete(link.id)} className={styles.deleteButton}>Delete</button>
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
