import { useState, useEffect } from 'react'
import styles from './admin.module.css'
import { adminApi, peekAdminCache } from '@/lib/api'
import { getAdminToken } from '@/lib/adminSession'

interface LiveStream {
  id: string
  youtubeLiveUrl: string | null
  facebookLiveUrl: string | null
  googleMeetUrl: string | null
}

function detectPlatformFromUrl(url: string): 'youtube' | 'facebook' | 'googlemeet' | '' {
  const u = url.trim().toLowerCase()
  if (!u) return ''
  if (u.includes('youtube.com') || u.includes('youtu.be')) return 'youtube'
  if (u.includes('facebook.com') || u.includes('fb.watch') || u.includes('fb.com')) return 'facebook'
  if (u.includes('meet.google.com')) return 'googlemeet'
  return ''
}

function linksFromLiveData(data: LiveStream | null | undefined) {
  return {
    youtube: data?.youtubeLiveUrl || '',
    facebook: data?.facebookLiveUrl || '',
    googlemeet: data?.googleMeetUrl || '',
  }
}

export default function LiveStreamAdmin() {
  const [refreshing, setRefreshing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [links, setLinks] = useState(() => {
    const token = getAdminToken()
    if (!token) return linksFromLiveData(null)
    const cached = peekAdminCache<LiveStream>(token, '/api/admin/live')
    return linksFromLiveData(cached?.data)
  })

  useEffect(() => {
    void fetchLiveStream()
  }, [])

  const fetchLiveStream = async () => {
    const token = getAdminToken()
    if (!token) return

    setRefreshing(true)
    try {
      const response = await adminApi.getLive(token)
      if (response.success && response.data) {
        setLinks(linksFromLiveData(response.data as LiveStream))
      }
    } catch (error) {
      console.error('Error fetching live stream:', error)
    } finally {
      setRefreshing(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = getAdminToken()
    if (!token) return

    setSaving(true)
    try {
      const submitData = {
        isLive: !!(links.youtube || links.facebook || links.googlemeet),
        youtubeLiveUrl: links.youtube || null,
        facebookLiveUrl: links.facebook || null,
        googleMeetUrl: links.googlemeet || null,
        title: null,
        scheduleTime: null,
      }

      await adminApi.updateLive(token, submitData)
      alert('Live stream links successfully updated.')
      fetchLiveStream()
    } catch (error: any) {
      alert(error.message || 'Error saving live stream link')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Live Stream Control</h2>
        <p className={styles.subtitle}>
          Updating this link will automatically update all &quot;Join Us Live&quot; buttons on the website.
          {refreshing ? ' Syncing…' : ''}
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>YouTube Live URL</label>
          <input
            type="url"
            value={links.youtube}
            onChange={(e) => setLinks({ ...links, youtube: e.target.value })}
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>
        <div className={styles.formGroup}>
          <label>Facebook Live URL</label>
          <input
            type="url"
            value={links.facebook}
            onChange={(e) => setLinks({ ...links, facebook: e.target.value })}
            placeholder="https://www.facebook.com/..."
          />
        </div>
        <div className={styles.formGroup}>
          <label>Google Meet / Prayer Link</label>
          <input
            type="url"
            value={links.googlemeet}
            onChange={(e) => setLinks({ ...links, googlemeet: e.target.value })}
            placeholder="https://meet.google.com/..."
          />
        </div>
        <div className={styles.formActions}>
          <button type="submit" className={styles.saveButton} disabled={saving}>
            {saving ? 'Saving...' : 'Update Live Stream'}
          </button>
        </div>
      </form>
    </div>
  )
}
