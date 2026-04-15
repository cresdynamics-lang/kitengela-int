import { motion } from 'framer-motion'
import styles from './PageHeader.module.css'

interface PageHeaderProps {
  title: string
  subtitle?: string
  backgroundImage: string
  hideDivider?: boolean
}

export default function PageHeader({ title, subtitle, backgroundImage, hideDivider = false }: PageHeaderProps) {
  return (
    <section className={`${styles.section} ${hideDivider ? styles.noDivider : ''}`}>
      <div className={styles.backgroundContainer}>
        <div 
          className={styles.backgroundImage} 
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
        <div className={styles.overlay} />
      </div>

      <div className={styles.container}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={styles.content}
        >
          {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
          <h1 className={styles.title}>{title}</h1>
        </motion.div>
      </div>
    </section>
  )
}
