import styles from './CoreValues.module.css'

const CORE_VALUES = [
  {
    name: 'Prayer',
    description: 'A house of prayer for all nations.',
    icon: '🙏',
  },
  {
    name: 'Stewardship',
    description: 'Faithful in what God has entrusted to us.',
    icon: '🤲',
  },
  {
    name: 'Holiness',
    description: "Set apart for God's purposes and presence.",
    icon: '✨',
  },
  {
    name: 'Advocacy',
    description: 'Standing for the voiceless and vulnerable.',
    icon: '⚖️',
  },
  {
    name: 'Unity',
    description: 'One body, many members, one mission.',
    icon: '🤝',
  },
]

export default function CoreValues() {
  return (
    <section className={styles.coreValuesSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Life at VOSH Kitengela — Our Core Values</h2>

        <div className={styles.valuesGrid}>
          {CORE_VALUES.map((value) => (
            <div key={value.name} className={styles.valueCard}>
              <span className={styles.valueIcon} aria-hidden>{value.icon}</span>
              <h3 className={styles.valueName}>{value.name}</h3>
              <p className={styles.valueDesc}>{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
