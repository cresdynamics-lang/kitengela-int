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
    time: 'Every Sunday | 9:30 AM - 1:00 PM',
    location: 'VOSH Kitengela Main Sanctuary',
    who: 'Open to Everyone',
    expect: 'Dynamic Praise & Worship, Prophetic Ministry, and Life-Transforming Word.',
    desc1: 'Our Sunday Worship Service is the pinnacle of our week. It is a time dedicated to corporate worship, where we gather as a united family to lift high the name of Jesus Christ. The atmosphere is consistently charged with an expectation of the Holy Spirit\'s movement.',
    desc2: 'We believe in the power of the declared Word of God to transform lives, heal the broken, and equip the saints for their daily walk. Whether you are a long-time believer or someone simply seeking answers, you will find a welcoming community and a powerful message tailored for your spiritual growth.',
  },
  [SERVICE_SLUGS.wednesdayPrayers]: {
    title: 'Wednesday Online Prayers',
    image: '/midweek-wed.jpeg',
    verseText: 'Devote yourselves to prayer, being watchful and thankful.',
    verseRef: 'Colossians 4:2',
    time: 'Every Wednesday | 8:00 PM - 9:30 PM',
    location: 'Online (Zoom / YouTube Live)',
    who: 'Open to Everyone',
    expect: 'Deep Intercession, Testimonies, and Corporate Prayer.',
    desc1: 'Our Wednesday Online Prayers serve as our midweek spiritual refueling. In a fast-paced world, it is vital to pause and connect with God corporately. Through our online platforms, members from across the city and the globe can join their faith together in targeted intercession.',
    desc2: 'We spend time praying for individual needs, our church, our nation, and global issues. We also share powerful testimonies of what God has done during the week, encouraging one another in the faith.',
  },
  [SERVICE_SLUGS.fridayNight]: {
    title: 'Friday Night Service',
    image: '/midweek-fri.jpeg',
    verseText: 'Come to me, all who labor and are heavy laden, and I will give you rest.',
    verseRef: 'Matthew 11:28',
    time: 'Every Friday | 5:30 PM - 7:30 PM',
    location: 'VOSH Kitengela Main Sanctuary',
    who: 'Youth, Young Adults & Everyone Hungry for God',
    expect: 'Extended Worship, Deliverance, and Encountering God\'s Presence.',
    desc1: 'Friday Night Service is specifically designed for deep encounters with God\'s presence. As we close the busy work week, we set aside extended time for unhurried, intimate worship and targeted prayers.',
    desc2: 'This service often focuses on deliverance, spiritual warfare, and prophetic ministry. It is an ideal environment for those seeking spiritual breakthrough, healing, and a deeper intimacy with the Holy Spirit.',
  },
  [SERVICE_SLUGS.sundayBibleStudy]: {
    title: 'Sunday Bible Study',
    image: '/bible-study.jpeg',
    verseText: 'Your word is a lamp to my feet and a light to my path.',
    verseRef: 'Psalm 119:105',
    time: 'Every Sunday | 8:30 AM - 9:30 AM',
    location: 'VOSH Kitengela Main Sanctuary',
    who: 'New Believers and Growing Disciples',
    expect: 'In-depth Scripture Exploration, Q&A, and Foundation Building.',
    desc1: 'Building a strong foundation in the Word of God is essential for every believer. Our Sunday Bible Study is an interactive, classroom-style environment where we delve deep into Scripture, exploring theology, biblical history, and practical life applications.',
    desc2: 'We encourage questions and active participation. This session is perfectly tailored for those who wish to understand the underlying principles of the Christian faith before the main worship service begins.',
  },
  [SERVICE_SLUGS.thursdayConnect]: {
    title: 'Thursday Online Connect',
    image: '/online-connect.jpeg',
    verseText: 'And let us consider how we may spur one another on toward love and good deeds, not giving up meeting together.',
    verseRef: 'Hebrews 10:24-25',
    time: 'Every Thursday | 8:30 PM - 9:30 PM',
    location: 'Online (Google Meet)',
    who: 'Open to Everyone',
    expect: 'Fellowship, Word, and Community Building.',
    desc1: 'Thursday Online Connect is our midweek fellowship gathering for believers who want to stay connected beyond Sunday. We come together online to share life, study the Word, and encourage one another in faith.',
    desc2: 'Whether you cannot make it to the physical sanctuary or you simply want an extra touchpoint during the week, this session keeps our community united and growing together.',
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
