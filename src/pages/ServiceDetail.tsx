import { useParams, Link } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PageHeader from '@/components/PageHeader'
import { ROUTES, SERVICE_SLUGS } from '@/lib/routes'
import styles from './ServiceDetail.module.css'

const servicesData: Record<string, {
  title: string
  image: string
  verseText: string
  verseRef: string
  time: string
  location: string
  who: string
  expect: string
  desc1: string
  desc2: string
}> = {
  [SERVICE_SLUGS.sundayWorship]: {
    title: 'Sunday Worship Service',
    image: '/sunday-services.jpeg',
    verseText: 'Let us come into his presence with thanksgiving; let us make a joyful noise to him with songs of praise!',
    verseRef: 'Psalm 95:2',
    time: 'Every Sunday | 7:00 AM – 1:00 PM',
    location: 'VOSH Kitengela Main Sanctuary, Baraka Road',
    who: 'Open to Everyone',
    expect: 'Dynamic Praise & Worship, Prophetic Ministry, and Life-Transforming Word.',
    desc1: 'Our Sunday Worship Service is the heart of our week — from early morning through early afternoon we gather as one family to lift the name of Jesus Christ. Expect an atmosphere charged with the move of the Holy Spirit.',
    desc2: 'Whether you are a long-time believer or simply seeking answers, you will find welcoming community, sound teaching, and a powerful encounter with God at VOSH Church International Kitengela.',
  },
  [SERVICE_SLUGS.sundayBibleStudy]: {
    title: 'Sunday Bible Study',
    image: '/bible-study.jpeg',
    verseText: 'Your word is a lamp to my feet and a light to my path.',
    verseRef: 'Psalm 119:105',
    time: 'Every Sunday | 7:30 AM – 8:30 AM',
    location: 'VOSH Kitengela Main Sanctuary',
    who: 'New Believers and Growing Disciples',
    expect: 'In-depth Scripture Exploration, Q&A, and Foundation Building.',
    desc1: 'Building a strong foundation in the Word is essential for every believer. Our Sunday Bible Study is an interactive environment where we delve into Scripture before the main worship gathering.',
    desc2: 'Come ready to learn, ask questions, and grow — perfectly suited for anyone who wants to understand the Christian faith more deeply.',
  },
  [SERVICE_SLUGS.wednesdayPrayers]: {
    title: 'Wednesday Midweek Prayers',
    image: '/midweek-prayers-wednesday.jpeg',
    verseText: 'Devote yourselves to prayer, being watchful and thankful.',
    verseRef: 'Colossians 4:2',
    time: 'Every Wednesday | 5:00 PM – 7:30 PM',
    location: 'VOSH Kitengela Main Sanctuary (Physical)',
    who: 'Open to Everyone',
    expect: 'Corporate Intercession, Testimonies, and Physical Gathering.',
    desc1: 'Midweek prayers are held physically at the church — not online. We gather on site to seek God together in targeted intercession for personal needs, our church, our nation, and the nations.',
    desc2: 'Come as you are. Wednesday evenings keep the fire burning — prayer, fasting culture, and testimonies of what God is doing.',
  },
  [SERVICE_SLUGS.fridayNight]: {
    title: 'Tefila Night',
    image: '/tefila-night.jpeg',
    verseText: 'Come to me, all who labor and are heavy laden, and I will give you rest.',
    verseRef: 'Matthew 11:28',
    time: 'Every Friday | 8:00 PM until Dawn',
    location: 'VOSH Kitengela Main Sanctuary',
    who: 'Everyone Hungry for God',
    expect: 'All-Night Prayer, Worship, and Encountering God\'s Presence.',
    desc1: 'Tefila Night is our Friday all-night prayer and worship — from 8:00 PM until dawn. We set aside extended time for unhurried intimacy with God as we close the week.',
    desc2: 'Expect deep intercession, worship, and breakthrough. It is an ideal environment for those seeking spiritual renewal, healing, and a deeper walk with the Holy Spirit.',
  },
  [SERVICE_SLUGS.youthOnlineConnect]: {
    title: 'Youth Online Connect',
    image: '/online-connect.jpeg',
    verseText: 'And let us consider how we may spur one another on toward love and good deeds, not giving up meeting together.',
    verseRef: 'Hebrews 10:24-25',
    time: 'Every Tuesday | 8:30 PM – 9:30 PM',
    location: 'Online',
    who: 'Youth & Young Adults',
    expect: 'Online Fellowship, Word, and Community Building.',
    desc1: 'Youth Online Connect is our Tuesday evening online fellowship for young people who want to stay connected beyond Sunday. We share life, study the Word, and encourage one another in faith.',
    desc2: 'Whether you are in Kitengela or joining from elsewhere, this one-hour session keeps our next generation united and growing together in Christ.',
  },
}

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>()
  const service = slug ? servicesData[slug] : null

  if (!service) {
    return (
      <div className={styles.pageContainer}>
        <Header />
        <div className={styles.notFound}>
          <h1 className={styles.notFoundTitle}>Service Not Found</h1>
          <Link to={ROUTES.services} className={styles.primaryBtn}>Return to Services</Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className={styles.pageContainer}>
      <Header />
      <PageHeader
        title={service.title}
        subtitle="Service Details & Information"
        backgroundImage={service.image}
        hideDivider
      />

      <div className={styles.contentContainer}>
        <div className={styles.card}>
          <h2 className={styles.title}>{service.title}</h2>

          <div className={styles.verseBox}>
            <p className={styles.verseText}>&ldquo;{service.verseText}&rdquo;</p>
            <p className={styles.verseRef}>— {service.verseRef}</p>
          </div>

          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Schedule</div>
              <div className={styles.detailValue}>{service.time}</div>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Location</div>
              <div className={styles.detailValue}>{service.location}</div>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Target Audience</div>
              <div className={styles.detailValue}>{service.who}</div>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>What to Expect</div>
              <div className={styles.detailValue}>{service.expect}</div>
            </div>
          </div>

          <div className={styles.descriptionBox}>
            <h3 className={styles.sectionTitle}>About This Service</h3>
            <p className={styles.paragraph}>{service.desc1}</p>
            <p className={styles.paragraph}>{service.desc2}</p>
          </div>

          <div className={styles.actions}>
            <Link to={ROUTES.joinUs} className={styles.primaryBtn}>
              Join Us This Week
            </Link>
            <Link to={ROUTES.services} className={styles.secondaryBtn}>
              Back to All Services
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
