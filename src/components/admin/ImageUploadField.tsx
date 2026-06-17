import { useEffect, useRef, useState } from 'react'
import { Upload } from 'lucide-react'
import { adminApi } from '@/lib/api'
import { getAdminToken } from '@/lib/adminSession'
import { compressImageForUpload } from '@/lib/imageCompression'
import styles from './ImageUploadField.module.css'

type ImageUploadFieldProps = {
  label: string
  value: string
  onChange: (url: string) => void
  helpText?: string
  optional?: boolean
}

export default function ImageUploadField({
  label,
  value,
  onChange,
  helpText,
  optional = true,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(value)

  useEffect(() => {
    setPreview(value)
  }, [value])

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPG, PNG, or WebP).')
      return
    }

    const token = getAdminToken()
    if (!token) {
      alert('Please log in again to upload images.')
      return
    }

    setUploading(true)
    try {
      const compressed = await compressImageForUpload(file)
      const response = await adminApi.uploadPhoto(token, compressed)
      if (response.success && response.data) {
        const url = String((response.data as { url?: string }).url || '')
        if (!url) throw new Error('Upload succeeded but no image URL was returned.')
        onChange(url)
        setPreview(url)
      } else {
        throw new Error((response as { error?: string }).error || 'Upload failed')
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Upload failed')
      setPreview(value)
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className={styles.group}>
      <label>
        {label}
        {optional ? ' (optional)' : ' *'}
      </label>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className={styles.hiddenInput}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) void handleFile(file)
        }}
      />
      <button
        type="button"
        className={styles.uploadZone}
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
      >
        <Upload size={18} aria-hidden />
        <span>
          {uploading
            ? 'Uploading…'
            : preview
              ? 'Click to replace image'
              : 'Click to upload from device'}
        </span>
      </button>
      {helpText ? <p className={styles.helpText}>{helpText}</p> : null}
      {preview ? (
        <img src={preview} alt="Preview" className={styles.preview} />
      ) : null}
    </div>
  )
}
