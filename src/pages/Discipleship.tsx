import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { BookOpen, Users, Compass, Sprout } from 'lucide-react';
import { publicApi } from '@/lib/api';
import styles from './Discipleship.module.css';

interface Testimonial {
  id: string;
  author_name: string;
  title: string | null;
  message: string;
}

export default function Discipleship() {
  const [heroImage, setHeroImage] = useState<string>('/bible-study.jpeg');
  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    {
      id: 'fallback-1',
      author_name: 'Sarah M.',
      title: 'Life Group Member',
      message: 'The Foundation Classes completely changed my understanding of grace. I finally feel rooted in my faith and confident in my salvation.',
    },
    {
      id: 'fallback-2',
      author_name: 'David K.',
      title: 'Mentorship Program',
      message: "Joining a mentorship group was the best decision I made this year. Having someone walk alongside me through life's challenges is invaluable.",
    },
    {
      id: 'fallback-3',
      author_name: 'Joy W.',
      title: 'Ministry Leader',
      message: "Leadership Training didn't just equip me for ministry; it transformed how I lead at my workplace and in my family.",
    }
  ]);

  useEffect(() => {
    // Timeout to fail fast if API is slow
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('API Timeout')), 1500)
    );

    // Fetch Photos for Banner
    Promise.race([
      publicApi.getPhotos(),
      timeoutPromise
    ]).then((res: any) => {
      if (res && res.success && Array.isArray(res.data)) {
        const discipleshipPhotos = res.data.filter((p: any) => p.category === 'discipleship');
        if (discipleshipPhotos.length > 0) {
          setHeroImage(discipleshipPhotos[0].url);
        }
      }
    }).catch(err => console.warn('Photo fetch failed:', err));

    // Fetch Testimonials
    Promise.race([
      publicApi.getTestimonials(),
      timeoutPromise
    ]).then((res: any) => {
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        setTestimonials(res.data);
      }
    }).catch(err => console.warn('Testimonial fetch failed:', err));
  }, []);

  return (
    <div className={styles.page}>
      <Header />

      {/* Page Header */}
      <section 
        className={styles.section} 
        style={{ 
          paddingTop: '10rem', 
          paddingBottom: '6rem',
          backgroundImage: `linear-gradient(rgba(10, 20, 30, 0.7), rgba(10, 20, 30, 0.8)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white'
        }}
      >
        <div className={styles.container}>
          <div className={styles.sectionHeader} style={{ color: 'white' }}>
            <span className={styles.badge} style={{ color: 'var(--gold-gradient)' }}>Grow With Us</span>
            <h1 className={styles.sectionTitle} style={{ color: 'white' }}>Discipleship</h1>
            <p className={styles.sectionLead} style={{ color: 'rgba(255,255,255,0.9)' }}>Grow in your faith, connect with others, and learn to multiply your impact.</p>
          </div>
          
          <div className={styles.scriptureBlock} style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderLeft: '4px solid var(--accent)' }}>
            <p className={styles.scriptureText} style={{ color: '#bfdbfe' }}>
              "Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, and teaching them to obey everything I have commanded you."
            </p>
            <p className={styles.scriptureRef}>- Matthew 28:19-20</p>
          </div>
        </div>
      </section>

      {/* Core Philosophy */}
      <section className={styles.section} style={{ paddingBottom: '2rem' }}>
        <div className={styles.container}>
          <div className={styles.sectionHeader} style={{ maxWidth: '800px' }}>
            <span className={styles.badge}>Our Philosophy</span>
            <h2 className={styles.sectionTitle}>Why Discipleship?</h2>
            <p className={styles.introBody} style={{ textAlign: 'center', marginTop: '1rem', fontSize: '1.1rem' }}>
              At VOSH Church International Kitengela, we believe that salvation is just the beginning. 
              Jesus didn't just call us to make converts; He called us to make disciples. True transformation 
              happens when we intentionally walk alongside one another, studying the Word, sharing our struggles, 
              and holding each other accountable. We are committed to raising up a generation of believers 
              who are deeply rooted in Scripture and wildly passionate about God's presence.
            </p>
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.badge}>Clear Pathway</span>
            <h2 className={styles.sectionTitle}>The Journey</h2>
            <p className={styles.introBody} style={{ textAlign: 'center', marginTop: '1rem' }}>Discipleship is not a destination, but a lifelong journey of becoming more like Christ.</p>
          </div>
          
          <div className={styles.journeyTrack}>
            <div className={styles.journeyStep}>
              <div className={styles.stepNumber}>1</div>
              <h3 className={styles.stepTitle}>Encounter</h3>
              <p className={styles.stepText}>Start by experiencing God's love. Complete our Foundation Classes for new believers. <em>"Come near to God and he will come near to you." (James 4:8)</em></p>
            </div>
            <div className={styles.journeyStep}>
              <div className={styles.stepNumber}>2</div>
              <h3 className={styles.stepTitle}>Grow</h3>
              <p className={styles.stepText}>Join a Life Group, study the Word deeply, and build authentic relationships. <em>"Grow in the grace and knowledge of our Lord." (2 Peter 3:18)</em></p>
            </div>
            <div className={styles.journeyStep}>
              <div className={styles.stepNumber}>3</div>
              <h3 className={styles.stepTitle}>Multiply</h3>
              <p className={styles.stepText}>Discover your purpose, serve on a team, and disciple others in their walk. <em>"And the things you have heard me say... entrust to reliable people." (2 Timothy 2:2)</em></p>
            </div>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.badge}>Equipping You</span>
            <h2 className={styles.sectionTitle}>Our Programs</h2>
          </div>
          
          <div className={styles.programsGrid}>
            {[
              { title: 'Foundation Classes', desc: 'For new believers and new members to understand the basics of faith and our church vision.', icon: <Sprout size={32} /> },
              { title: 'Bible Study Groups', desc: 'Deep-dive textual studies held midweek to enrich your understanding of scripture.', icon: <BookOpen size={32} /> },
              { title: 'Mentorship Program', desc: 'One-on-one and small group mentorship focusing on personal and spiritual growth.', icon: <Compass size={32} /> },
              { title: 'Leadership Training', desc: 'Equipping future leaders to serve effectively in ministry and the marketplace.', icon: <Users size={32} /> },
            ].map((prog, i) => (
              <div key={i} className={styles.programCard}>
                <div className={styles.programIcon}>{prog.icon}</div>
                <h4 className={styles.programTitle}>{prog.title}</h4>
                <p className={styles.programText}>{prog.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonies */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.badge}>Transformed Lives</span>
            <h2 className={styles.sectionTitle}>What Others Are Saying</h2>
            <p className={styles.introBody} style={{ textAlign: 'center', marginTop: '1rem' }}>Hear from members who have experienced growth through our discipleship programs.</p>
          </div>
          
          <div className={styles.testimonialsGrid}>
            {testimonials.map((t) => (
              <div key={t.id} className={styles.testimonialCard}>
                <div className={styles.quoteMark}>"</div>
                <p className={styles.testimonialQuote}>{t.message}</p>
                <h4 className={styles.testimonialAuthor}>{t.author_name}</h4>
                <p className={styles.testimonialRole}>{t.title || ''}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sign Up CTA */}
      <section className={styles.formSection}>
        <div className={styles.container}>
          <div className={styles.formWrap}>
            <div className={styles.ctaCopy}>
              <span className={styles.ctaKicker}>Your Growth Path Starts Here</span>
              <h2 className={styles.formTitle}>Ready to take the next step?</h2>
              <p className={styles.formSubtitle}>
                Choose a discipleship pathway and we will help you connect with the right class,
                group, or mentor for your current season.
              </p>
            </div>
            <div className={styles.ctaPanel}>
              <div className={styles.ctaSteps}>
                <span>Foundation Classes</span>
                <span>Life Group</span>
                <span>Mentorship</span>
              </div>
              <Link to="/services" className={styles.submitBtn}>Start My Journey</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
