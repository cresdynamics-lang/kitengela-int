import { Link } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PageHeader from '@/components/PageHeader'
import ScrollReveal from '@/components/ScrollReveal'
import Carousel from '@/components/Carousel'
import styles from './Outreach.module.css'

const outreachCarouselImages = [
  { id: 1, title: "Community Outreach", image: "/latestoutreach.jpeg", description: "Reaching out to our community with the love of Christ and practical help" },
  { id: 2, title: "Mission Work", image: "/latestoutrach.jpeg", description: "Taking the Gospel beyond our walls to transform lives" },
  { id: 3, title: "Mission & Vision", image: "/mission and vission.jpeg", description: "Fulfilling our mandate to manifest Christ in Kitengela and beyond" },
  { id: 4, title: "Unity in Service", image: "/handstogether unity.jpg", description: "Working together in unity to serve our community" },
  { id: 5, title: "Heart for Mission", image: "/fromheartprayesr.jpg", description: "A heart committed to prayer and outreach" },
  { id: 6, title: "Community Impact", image: "/WhatsApp Image 2026-04-08 at 13.57.54 (1).jpeg", description: "Making a positive impact in our community" },
  { id: 7, title: "Prayer & Service", image: "/WhatsApp Image 2026-04-08 at 13.57.56 (2).jpeg", description: "Combining prayer with practical service" },
  { id: 8, title: "Transforming Lives", image: "/WhatsApp Image 2026-04-08 at 13.57.57.jpeg", description: "Transforming lives through the Gospel and service" }
]

const outreachActivities = [
  {
    id: 1,
    title: "Community Food Drives",
    description: "Regular food distribution programs to support needy families in Kitengela",
    image: "/WhatsApp Image 2026-04-08 at 13.57.45.jpeg"
  },
  {
    id: 2,
    title: "Medical Camps",
    description: "Free medical check-ups and health services for the community",
    image: "/WhatsApp Image 2026-04-08 at 13.57.46.jpeg"
  },
  {
    id: 3,
    title: "Youth Mentorship",
    description: "Mentoring young people to discover their purpose and potential",
    image: "/WhatsApp Image 2026-04-08 at 13.57.53.jpeg"
  },
  {
    id: 4,
    title: "Prayer Walks",
    description: "Community prayer walks covering every street in Kitengela",
    image: "/WhatsApp Image 2026-04-08 at 13.57.54.jpeg"
  },
  {
    id: 5,
    title: "School Support",
    description: "Supporting local schools with educational materials and mentorship",
    image: "/WhatsApp Image 2026-04-08 at 13.57.55.jpeg"
  },
  {
    id: 6,
    title: "Family Counseling",
    description: "Providing biblical counseling and support for families",
    image: "/WhatsApp Image 2026-04-08 at 13.57.56.jpeg"
  }
]

export default function Outreach() {
  return (
    <main>
      <Header />
      <PageHeader 
        title="Outreach & Mission" 
        subtitle="Love Beyond Our Walls"
        backgroundImage="/latestoutreach.jpeg"
      />
      <div className={styles.container}>
        <ScrollReveal direction="right">
          <section className={styles.carouselSection}>
            <h2 className={styles.sectionTitle}>Our Mission in Action</h2>
            <Carousel images={outreachCarouselImages} />
          </section>
        </ScrollReveal>

        <ScrollReveal direction="left">
          <section className={styles.missionSection}>
            <h2 className={styles.sectionTitle}>Our Mission</h2>
            <p className={styles.text}>
              At VOSH Church International Kitengela, we are committed to being a house of solutions not just within our walls, 
              but in our community. Through various outreach programs, we demonstrate the love of Christ in practical ways, 
              meeting both spiritual and physical needs.
            </p>
          </section>
        </ScrollReveal>

        <ScrollReveal direction="right">
          <section className={styles.activitiesSection}>
            <h2 className={styles.sectionTitle}>Outreach Activities</h2>
            <div className={styles.activitiesGrid}>
              {outreachActivities.map((activity) => (
                <div key={activity.id} className={styles.activityCard}>
                  <div className={styles.activityImageContainer}>
                    <img src={activity.image} alt={activity.title} className={styles.activityImage} />
                  </div>
                  <div className={styles.activityContent}>
                    <h3 className={styles.activityTitle}>{activity.title}</h3>
                    <p className={activity.description}>{activity.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal direction="left">
          <section className={styles.getInvolvedSection}>
            <h2 className={styles.sectionTitle}>Get Involved</h2>
            <p className={styles.text}>
              Join us in making a difference! Whether through volunteering, donations, or prayer, 
              you can be part of our outreach mission.
            </p>
            <div className={styles.ctaButtons}>
              <Link to="/contact" className={styles.primaryButton}>Contact Us to Volunteer</Link>
              <Link to="/give" className={styles.secondaryButton}>Support Our Mission</Link>
            </div>
          </section>
        </ScrollReveal>
      </div>
      <Footer />
    </main>
  )
}
