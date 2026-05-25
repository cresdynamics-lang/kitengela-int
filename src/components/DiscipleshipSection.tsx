import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import ScriptureQuote from '@/components/ScriptureQuote'
import styles from './DiscipleshipSection.module.css'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } },
}

/** Homepage teaser — full content lives at /discipleship */
export default function DiscipleshipSection() {
  return (
    <section id="discipleship" className={styles.section} aria-labelledby="discipleship-home-heading">
      <div className={styles.container}>
        <motion.div
          className={styles.intro}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <span className={styles.badge}>Grow in Faith</span>
          <h2 id="discipleship-home-heading" className={styles.title}>
            Discipleship
          </h2>
          <p className={styles.lead}>
            Following Jesus is a journey of encounter, growth, and multiplication. Explore our
            programs, hear testimonies, and take your next step in faith.
          </p>
          <ScriptureQuote
            text="I am the vine; you are the branches. If you remain in me and I in you, you will bear much fruit."
            reference="John 15:5"
            variant="light"
            className={styles.homeVerse}
          />
          <Link to="/discipleship" className={styles.ctaButton}>
            Explore Discipleship
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
