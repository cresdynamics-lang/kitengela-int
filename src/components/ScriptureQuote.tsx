import styles from './ScriptureQuote.module.css'

type ScriptureVariant = 'light' | 'dark' | 'card' | 'inline' | 'banner'

interface ScriptureQuoteProps {
  text: string
  reference: string
  variant?: ScriptureVariant
  className?: string
}

export default function ScriptureQuote({
  text,
  reference,
  variant = 'light',
  className = '',
}: ScriptureQuoteProps) {
  return (
    <blockquote
      className={`${styles.quote} ${styles[variant]} ${className}`.trim()}
      cite={reference}
    >
      <p className={styles.text}>&ldquo;{text}&rdquo;</p>
      <footer className={styles.reference}>{reference}</footer>
    </blockquote>
  )
}
