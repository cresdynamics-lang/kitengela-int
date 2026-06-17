import { useEffect, useState, FormEvent } from 'react'
import { adminApi } from '@/lib/api'
import { getAdminToken } from '@/lib/adminSession'
import { DEFAULT_GIVE_SETTINGS, normalizeGiveSettings, type GiveSettings } from '@/lib/give'
import styles from '@/components/admin/admin.module.css'

export default function AdminGiveSettings() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<GiveSettings>(DEFAULT_GIVE_SETTINGS)
  const [suffixInput, setSuffixInput] = useState(DEFAULT_GIVE_SETTINGS.accountSuffixes.join(', '))

  useEffect(() => {
    const token = getAdminToken()
    if (!token) {
      setLoading(false)
      return
    }

    adminApi
      .getGiveSettingsAdmin(token)
      .then((res) => {
        if (res.success && res.data) {
          const normalized = normalizeGiveSettings(res.data as Record<string, unknown>)
          setForm(normalized)
          setSuffixInput(normalized.accountSuffixes.join(', '))
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const token = getAdminToken()
    if (!token) return

    setSaving(true)
    try {
      const accountSuffixes = suffixInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)

      const res = await adminApi.updateGiveSettings(token, {
        ...form,
        accountSuffixes,
      })

      if (res.success) {
        alert('Give settings saved successfully.')
        if (res.data) {
          const normalized = normalizeGiveSettings(res.data as Record<string, unknown>)
          setForm(normalized)
          setSuffixInput(normalized.accountSuffixes.join(', '))
        }
      } else {
        alert((res as { error?: string }).error || 'Failed to save settings.')
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to save settings.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p>Loading give settings…</p>
  }

  return (
    <div>
      <h2 style={{ marginBottom: '0.5rem', color: '#0B1F3A' }}>Give Settings</h2>
      <p style={{ marginBottom: '1.5rem', color: '#555', maxWidth: 560 }}>
        Update M-Pesa paybill and bank details shown on the public Give page.
      </p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="paybill">Paybill Number</label>
          <input
            id="paybill"
            type="text"
            value={form.paybillNumber}
            onChange={(e) => setForm({ ...form, paybillNumber: e.target.value })}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="account">Account Number (base)</label>
          <input
            id="account"
            type="text"
            value={form.accountNumber}
            onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="suffixes">Account Suffixes (comma-separated)</label>
          <input
            id="suffixes"
            type="text"
            value={suffixInput}
            onChange={(e) => setSuffixInput(e.target.value)}
            placeholder="#offering/tithe, #missions, #building"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="bankName">Bank Name</label>
          <input
            id="bankName"
            type="text"
            value={form.bankName}
            onChange={(e) => setForm({ ...form, bankName: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="bankAccountName">Account Name</label>
          <input
            id="bankAccountName"
            type="text"
            value={form.bankAccountName}
            onChange={(e) => setForm({ ...form, bankAccountName: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="bankAccountNumber">Account Number</label>
          <input
            id="bankAccountNumber"
            type="text"
            value={form.bankAccountNumber}
            onChange={(e) => setForm({ ...form, bankAccountNumber: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="bankBranch">Branch / SWIFT</label>
          <input
            id="bankBranch"
            type="text"
            value={form.bankBranch}
            onChange={(e) => setForm({ ...form, bankBranch: e.target.value })}
          />
        </div>

        <button type="submit" className={styles.addButton} disabled={saving}>
          {saving ? 'Saving…' : 'Save Give Settings'}
        </button>
      </form>
    </div>
  )
}
