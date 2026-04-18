import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { publicApi } from '@/lib/api'
import styles from './LeaderDetail.module.css'

const EVANS_IMAGES = [
  '/Rev.Evans1.jpeg',
  '/Rev.Evans2.jpeg',
  '/Rev.Evans3.jpeg',
  '/evans-activity-1.jpg',
  '/evans-activity-2.jpg',
  '/evans-activity-3.jpg'
]

const NANCY_IMAGES = [
  '/PastorNancySai.jpeg',
  '/praise-worship.jpg',
  '/preaching.jpg',
  '/sermon-notes.jpg'
]

const FALLBACK: Record<string, { name: string; title: string; bio: string; imageUrl: string }> = {
  'evans-kochoo': { name: 'Rev. Evans O. Kochoo', title: 'Senior Pastor', bio: '', imageUrl: '/Rev.Evans1.jpeg' },
  'pastor-nancy-sai': {
    name: 'Pastor Nancy Sai',
    title: 'Assistant Pastor',
    bio: 'Pastor Nancy Sai serves as the Assistant Pastor at Kitengela VOSH International Church. She is passionate about advancing God\'s Kingdom through sound teaching, servant leadership, and community impact. With a heart for people and excellence in ministry, Pastor Sai is committed to nurturing spiritual growth and empowering believers to fulfill their God-given purpose.',
    imageUrl: '/PastorNancySai.jpeg'
  }
}

export default function LeaderDetail() {
  const { id } = useParams<{ id: string }>()
  const [leader, setLeader] = useState<{ name: string; title: string; bio: string; imageUrl: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fallback = id ? FALLBACK[id] : null
    if (fallback) {
      setLeader(fallback)
      setLoading(false)
      return
    }
    publicApi.getLeaders().then((r) => {
      if (r.success && Array.isArray(r.data)) {
        const found = (r.data as any[]).find((l) => l.id === id)
        if (found) setLeader({ name: found.name, title: found.title, bio: found.bio || '', imageUrl: found.imageUrl || '' })
        else if (id && FALLBACK[id]) setLeader(FALLBACK[id])
      } else if (id && FALLBACK[id]) setLeader(FALLBACK[id])
    }).catch(() => { if (id && FALLBACK[id]) setLeader(FALLBACK[id]) }).finally(() => setLoading(false))
  }, [id])

  if (loading) return <main><Header /><div className={styles.loading}>Loading...</div><Footer /></main>
  if (!leader) return <main><Header /><div className={styles.container}><div className={styles.notFound}><h1>Leader Not Found</h1><Link to="/leadership" className={styles.backLink}>← Back to Leadership</Link></div></div><Footer /></main>

  if (id === 'evans-kochoo' || id === '1') {
    return (
      <main>
        <Header />
        <div className={styles.container}>
          <Link to="/leadership" className={styles.backLink}>← Back to Leadership</Link>

          <div className={styles.hero}>
            <div className={styles.evansHero}>
              <div className={styles.evansImageWrap}>
                <img src="/Rev.Evans1.jpeg" alt="Rev. Evans O. Kochoo" className={styles.evansHeroImage} />
              </div>
              <div className={styles.evansHeader}>
                <h1 className={styles.evansName}>Evans O. Kochoo</h1>
                <p className={styles.evansTagline}>Defying Gravity, Impacting Generations</p>
                <p className={styles.evansTitle}>Rev. Evans O. Kochoo</p>
              </div>
              <div className={styles.evansQuote}>
                <p className={styles.quoteText}>“If you walk in the spirit, you’ll never be stuck”</p>
                <p className={styles.quoteTagline}>Defying Gravity, Impacting Generations</p>
              </div>
            </div>
          </div>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Evans O. Kochoo — Vision Statement</h2>
            <p className={styles.visionText}>
              To raise, equip, and release Kingdom-minded leaders who will impact generations by living out the uncompromised truth of the Gospel.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Evans O. Kochoo — Profile</h2>
            <p className={styles.bio}>
              I am Evans O. Kochoo, fondly known as <strong>The Eagle</strong>, a passionate servant of God driven by a dynamic apostolic mandate to disseminate the pure and unadulterated Gospel of Jesus Christ.
            </p>
            <p className={styles.bio}>
              Through in-depth and thought-provoking teachings, I aim to ignite zeal, inspire purpose, and ultimately transform lives.
            </p>
            <p className={styles.bio}>
              My ministry spans diverse platforms, shaping individuals, leaders, and communities with the uncompromising truth of God’s Word.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Professional Qualifications</h2>
            <p className={styles.bio}>
              Evans Kochoo is a dedicated church leader and transformational speaker with a solid foundation in biblical studies, theology, and ministry leadership.
            </p>
            <p className={styles.bio}>
              He holds <strong>Diplomas in Bible & Church Ministry</strong> and <strong>Bible & Theology</strong>, equipping him with deep scriptural insight and pastoral competence.
            </p>
            <p className={styles.bio}>
              He has further advanced his leadership skills through a <strong>Certificate in Biblical Transforming Leadership & Governance</strong>, sharpening his capacity to guide, inspire, and train communities with integrity and vision.
            </p>
            <p className={styles.bio}>
              With a keen embrace of modern tools, Evans also holds a <strong>Certificate in Computer Literacy</strong>, enabling him to merge faith and technology for effective ministry, leadership, and community impact.
            </p>
            <ul className={styles.qualificationsList}>
              <li>Diploma in Bible & Church Ministry</li>
              <li>Diploma in Bible & Theology</li>
              <li>Certificate in Biblical Transforming Leadership & Governance</li>
              <li>Certificate in Computer Literacy</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Evans O. Kochoo — Areas of Ministry & Calling</h2>
            <div className={styles.ministryGrid}>
              <div className={styles.ministryCard}>
                <h3 className={styles.ministryTitle}>School, College & University Ministry</h3>
                <p className={styles.ministryDescription}>Raising a generation rooted in Christ.</p>
              </div>
              <div className={styles.ministryCard}>
                <h3 className={styles.ministryTitle}>Training & Equipping Ministers/Leaders</h3>
                <p className={styles.ministryDescription}>Building capacity for effective Kingdom service.</p>
              </div>
              <div className={styles.ministryCard}>
                <h3 className={styles.ministryTitle}>Relationship Coaching</h3>
                <p className={styles.ministryDescription}>Guiding individuals and couples toward Christ-centered relationships.</p>
              </div>
              <div className={styles.ministryCard}>
                <h3 className={styles.ministryTitle}>Keynote Speaking & Media Commentary</h3>
                <p className={styles.ministryDescription}>Delivering life-changing insights at conferences, workshops, and media platforms.</p>
              </div>
              <div className={styles.ministryCard}>
                <h3 className={styles.ministryTitle}>Mentorship</h3>
                <p className={styles.ministryDescription}>Shaping lives through discipleship and guidance.</p>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Evans O. Kochoo — Core Skills & Competencies</h2>
            <div className={styles.skillsGrid}>
              <div className={styles.skillItem}>Apostolic teaching and preaching</div>
              <div className={styles.skillItem}>Leadership training and development</div>
              <div className={styles.skillItem}>Inspirational keynote speaking</div>
              <div className={styles.skillItem}>Counseling and relationship coaching</div>
              <div className={styles.skillItem}>Mentorship and discipleship</div>
              <div className={styles.skillItem}>Media communication and commentary</div>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Evans O. Kochoo — Ministry in Pictures</h2>
            <div className={styles.galleryGrid}>
              {EVANS_IMAGES.map((src, i) => (
                <div key={src} className={styles.galleryItem}>
                  <img src={src} alt={`Rev. Evans O. Kochoo ${i + 1}`} className={styles.galleryImage} />
                </div>
              ))}
            </div>
          </section>

          <div className={styles.evansQuote} style={{ marginTop: '2rem', marginBottom: '2rem' }}>
            <p className={styles.quoteText}>“If you walk in the spirit, you’ll never be stuck”</p>
            <p className={styles.quoteTagline}>Defying Gravity, Impacting Generations</p>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  if (id === 'pastor-nancy-sai') {
    return (
      <main>
        <Header />
        <div className={styles.container}>
          <Link to="/leadership" className={styles.backLink}>← Back to Leadership</Link>

          <div className={styles.hero}>
            <div className={styles.evansHero}>
              <div className={styles.evansImageWrap}>
                <img src="/PastorNancySai.jpeg" alt="Pastor Nancy Sai" className={styles.evansHeroImage} />
              </div>
              <div className={styles.evansHeader}>
                <h1 className={styles.evansName}>Pastor Nancy Sai</h1>
                <p className={styles.evansTagline}>Sound Teaching · Servant Leadership · Community Impact</p>
                <p className={styles.evansTitle}>Assistant Pastor — Kitengela VOSH International Church</p>
              </div>
              <div className={styles.evansQuote}>
                <p className={styles.quoteText}>Advancing God’s Kingdom with a heart for people and excellence in ministry.</p>
              </div>
            </div>
          </div>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Pastor Nancy Sai — About</h2>
            <p className={styles.bio}>
              Pastor Nancy Sai serves as the <strong>Assistant Pastor</strong> at Kitengela VOSH International Church. She is passionate about advancing God’s Kingdom through <strong>sound teaching</strong>, <strong>servant leadership</strong>, and <strong>community impact</strong>.
            </p>
            <p className={styles.bio}>
              With a heart for people and excellence in ministry, Pastor Sai is committed to <strong>nurturing spiritual growth</strong> and <strong>empowering believers</strong> to fulfill their God-given purpose.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Pastor Nancy Sai — Ministry Focus</h2>
            <div className={styles.ministryGrid}>
              <div className={styles.ministryCard}>
                <h3 className={styles.ministryTitle}>Sound Teaching</h3>
                <p className={styles.ministryDescription}>Grounding believers in the Word of God.</p>
              </div>
              <div className={styles.ministryCard}>
                <h3 className={styles.ministryTitle}>Servant Leadership</h3>
                <p className={styles.ministryDescription}>Leading by example with humility and love.</p>
              </div>
              <div className={styles.ministryCard}>
                <h3 className={styles.ministryTitle}>Community Impact</h3>
                <p className={styles.ministryDescription}>Transforming lives and neighborhoods for Christ.</p>
              </div>
              <div className={styles.ministryCard}>
                <h3 className={styles.ministryTitle}>Nurturing & Empowerment</h3>
                <p className={styles.ministryDescription}>Helping believers discover and walk in their God-given purpose.</p>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Pastor Nancy Sai — Ministry in Pictures</h2>
            <div className={styles.galleryGrid}>
              {NANCY_IMAGES.map((src, i) => (
                <div key={src} className={styles.galleryItem}>
                  <img src={src} alt={`Pastor Nancy Sai — ministry ${i + 1}`} className={styles.galleryImage} />
                </div>
              ))}
            </div>
          </section>

          <div className={styles.evansQuote} style={{ marginTop: '2rem', marginBottom: '2rem' }}>
            <p className={styles.quoteText}>Advancing God’s Kingdom with a heart for people and excellence in ministry.</p>
            <p className={styles.quoteTagline}>Sound Teaching · Servant Leadership · Community Impact</p>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main>
      <Header />
      <div className={styles.container}>
        <Link to="/leadership" className={styles.backLink}>← Back to Leadership</Link>
        <div className={styles.hero}>
          <div className={styles.leaderHeader}>
            <img src={leader.imageUrl} alt={leader.name} className={styles.leaderImage} />
            <div className={styles.leaderInfo}>
              <h1 className={styles.leaderName}>{leader.name}</h1>
              <p className={styles.leaderTitle}>{leader.title}</p>
            </div>
          </div>
        </div>
        {leader.bio && <section className={styles.section}><h2 className={styles.sectionTitle}>About</h2><p className={styles.bio}>{leader.bio}</p></section>}
      </div>
      <Footer />
    </main>
  )
}
