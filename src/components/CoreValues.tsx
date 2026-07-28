import styles from './CoreValues.module.css'
import { CORE_VALUES } from '@/lib/brand'

export default function CoreValues() {
  return (
    <section className={styles.coreValuesSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Our Core Values</h2>
        <p className={styles.sectionSubtitle}>
          Beliefs and behaviours that shape life at VOSH Church International Kitengela
        </p>

        <div className={styles.valuesGrid}>
          {CORE_VALUES.map((value) => (
            <div key={value.name} className={styles.valueCard}>
              <h3 className={styles.valueName}>{value.name}</h3>
              <p className={styles.valueDesc}>{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
