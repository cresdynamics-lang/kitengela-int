import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './AdminLogin.module.css'
import { adminApi } from '@/lib/api'
import { setAdminSession } from '@/lib/adminSession'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const response = await adminApi.login(formData.username, formData.password)
      if (response.success && response.data) {
        const token = response.data.token
        setAdminSession(token, response.data.admin)

        // Warm commonly opened admin tabs while navigating.
        void Promise.allSettled([
          adminApi.getSermons(token),
          adminApi.getPrograms(token),
          adminApi.getUpdateLinks(token),
          adminApi.getLive(token),
        ])

        navigate('/admin/dashboard')
      } else {
        setError((response as { error?: string }).error || 'Login failed')
      }
    } catch (err: any) {
      setError(err?.message || 'Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <div className={styles.logoSection}>
          <h1>VOSH CHURCH</h1>
          <p>Admin Dashboard</p>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.inputGroup}>
            <label htmlFor="username">Username or Email</label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              disabled={loading}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              disabled={loading}
            />
          </div>
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
