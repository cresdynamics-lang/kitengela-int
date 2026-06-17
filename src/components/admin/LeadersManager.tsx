import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { adminApi, invalidatePublicEndpoints } from '@/lib/api'
import { getAdminToken } from '@/lib/adminSession'
import { compressImageForUpload } from '@/lib/imageCompression'
import { Plus, Edit2, Trash2, Upload, X, ExternalLink } from 'lucide-react'
import styles from './LeadersManager.module.css'

interface Leader {
  id: string
  name: string
  title: string
  bio: string | null
  photo_url: string | null
  facebook_url: string | null
  instagram_url: string | null
  twitter_url: string | null
  order_index: number
}

const blankForm = () => ({
  name: '',
  title: '',
  bio: '',
  photoUrl: '',
  facebookUrl: '',
  instagramUrl: '',
  twitterUrl: '',
  orderIndex: 0,
})

export default function LeadersManager() {
  const [leaders, setLeaders] = useState<Leader[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState(blankForm())
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchLeaders()
  }, [])

  const fetchLeaders = async () => {
    setError('')
    try {
      const token = getAdminToken()
      if (!token) return
      const res = await adminApi.getLeadersAdmin(token)
      if (res.success && Array.isArray(res.data)) {
        setLeaders(res.data as Leader[])
      } else {
        setError((res as { error?: string }).error || 'Could not load leaders.')
      }
    } catch (err: any) {
      const msg = err?.message || 'Failed to load leaders'
      setError(msg)
      console.error('Failed to load leaders:', err)
    } finally {
      setLoading(false)
    }
  }

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const incoming = e.target.files?.[0] ?? null
    const file = incoming ? await compressImageForUpload(incoming) : null
    setPhotoFile(file)
    if (file) {
      const url = URL.createObjectURL(file)
      setPhotoPreview(url)
    } else {
      setPhotoPreview(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = getAdminToken()
    if (!token) return

    setSubmitting(true)
    try {
      const fd = new FormData()
      Object.entries(formData).forEach(([k, v]) => fd.append(k, String(v)))
      if (photoFile) fd.append('photo', photoFile)

      let res: any
      if (editingId) {
        res = await adminApi.updateLeader(token, editingId, fd)
      } else {
        res = await adminApi.createLeader(token, fd)
      }

      if (res?.success) {
        invalidatePublicEndpoints(['/api/public/leaders'])
        await fetchLeaders()
        closeForm()
        setStatusMessage(editingId ? 'Leader updated. Changes are live on the Leadership page.' : 'Leader added. View it on the Leadership page.')
        globalThis.setTimeout(() => setStatusMessage(''), 5000)
      } else {
        alert(res?.error || 'Failed to save leader')
      }
    } catch (err: any) {
      alert(err.message || 'An error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (leader: Leader) => {
    setFormData({
      name: leader.name,
      title: leader.title,
      bio: leader.bio || '',
      photoUrl: leader.photo_url || '',
      facebookUrl: leader.facebook_url || '',
      instagramUrl: leader.instagram_url || '',
      twitterUrl: leader.twitter_url || '',
      orderIndex: leader.order_index,
    })
    setPhotoFile(null)
    setPhotoPreview(leader.photo_url || null)
    setEditingId(leader.id)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this leader? This cannot be undone.')) return
    const token = getAdminToken()
    if (!token) return
    try {
      const res = await adminApi.deleteLeader(token, id)
      if (res?.success) {
        invalidatePublicEndpoints(['/api/public/leaders'])
        setLeaders((prev) => prev.filter((l) => l.id !== id))
        setStatusMessage('Leader removed from the public Leadership page.')
        globalThis.setTimeout(() => setStatusMessage(''), 5000)
      } else alert('Failed to delete leader')
    } catch (err: any) {
      alert(err.message || 'Delete failed')
    }
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setEditingId(null)
    setFormData(blankForm())
    setPhotoFile(null)
    setPhotoPreview(null)
  }

  if (loading) return <div className={styles.loading}>Loading leaders…</div>

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Leaders</h2>
          <p className={styles.subtitle}>
            Add, edit, or delete leaders here. They appear on the public{' '}
            <Link to="/leadership" target="_blank" rel="noopener noreferrer" className={styles.inlineLink}>
              Leadership page
            </Link>
            .
          </p>
        </div>
        <button className={styles.addButton} onClick={() => setIsFormOpen(true)}>
          <Plus size={16} /> Add Leader
        </button>
      </div>

      {error && (
        <div className={styles.errorBanner} role="alert">
          {error}
          {error.includes('table') && (
            <span> Run <code>supabase-leaders.sql</code> in Supabase SQL Editor, then refresh.</span>
          )}
        </div>
      )}

      {statusMessage && <div className={styles.statusBanner}>{statusMessage}</div>}

      {/* Leader cards */}
      {leaders.length === 0 ? (
        <div className={styles.empty}>
          <p>No leaders yet. Click "Add Leader" to create the first one.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {leaders.map((leader) => (
            <div key={leader.id} className={styles.card}>
              <div className={styles.cardPhoto}>
                {leader.photo_url ? (
                  <img src={leader.photo_url} alt={leader.name} />
                ) : (
                  <div className={styles.cardPhotoPlaceholder}>
                    {leader.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.cardName}>{leader.name}</h3>
                <p className={styles.cardTitle}>{leader.title}</p>
                {leader.bio && (
                  <p className={styles.cardBio}>
                    {leader.bio.length > 120 ? `${leader.bio.slice(0, 120)}…` : leader.bio}
                  </p>
                )}
                <div className={styles.cardOrder}>Order: {leader.order_index}</div>
              </div>
              <div className={styles.cardActions}>
                <Link
                  to={`/leadership/${leader.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.viewBtn}
                >
                  <ExternalLink size={15} /> View on site
                </Link>
                <button className={styles.editBtn} onClick={() => handleEdit(leader)}>
                  <Edit2 size={15} /> Edit
                </button>
                <button className={styles.deleteBtn} onClick={() => handleDelete(leader.id)}>
                  <Trash2 size={15} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form modal */}
      {isFormOpen && (
        <div className={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && closeForm()}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>{editingId ? 'Edit Leader' : 'Add Leader'}</h3>
              <button className={styles.closeBtn} onClick={closeForm}><X size={18} /></button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              {/* Photo upload */}
              <div className={styles.photoUploadRow}>
                <div className={styles.photoPreview}>
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" />
                  ) : (
                    <div className={styles.photoPreviewPlaceholder}>
                      <Upload size={28} />
                      <span>No photo</span>
                    </div>
                  )}
                </div>
                <div className={styles.photoUploadActions}>
                  <button
                    type="button"
                    className={styles.uploadBtn}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={15} /> Click to upload from device
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className={styles.hiddenInput}
                    onChange={handlePhotoChange}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Full Name *</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rev. John Doe"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Title / Role *</label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Senior Pastor"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Bio / Description</label>
                <textarea
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="A brief description of this leader's ministry and background…"
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Facebook URL</label>
                  <input
                    type="url"
                    value={formData.facebookUrl}
                    onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                    placeholder="https://facebook.com/…"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Instagram URL</label>
                  <input
                    type="url"
                    value={formData.instagramUrl}
                    onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                    placeholder="https://instagram.com/…"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Twitter / X URL</label>
                  <input
                    type="url"
                    value={formData.twitterUrl}
                    onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
                    placeholder="https://x.com/…"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Display Order</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.orderIndex}
                    onChange={(e) =>
                      setFormData({ ...formData, orderIndex: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>

              <div className={styles.formActions}>
                <button type="button" className={styles.cancelBtn} onClick={closeForm}>
                  Cancel
                </button>
                <button type="submit" className={styles.saveBtn} disabled={submitting}>
                  {submitting ? 'Saving…' : editingId ? 'Save Changes' : 'Add Leader'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
