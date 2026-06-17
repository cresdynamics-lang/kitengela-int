import { Link } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollReveal from '@/components/ScrollReveal'
import MasonryGallery from '@/components/MasonryGallery'
import { ROUTES } from '@/lib/routes'
import type { RichLeaderProfile } from '@/lib/leaderProfiles'
import styles from './RichLeaderProfile.module.css'

type Props = {
  profile: RichLeaderProfile
}

export default function RichLeaderProfile({ profile }: Props) {
  return (
    <main className={styles.page}>
      <Header />

      {/* Hero */}
      <section className={styles.hero} style={{ backgroundImage: `url(${profile.heroPhoto})` }}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroInner}>
          <Link to={ROUTES.leadership} className={styles.backLink}>
            ← Back to Leadership
          </Link>
          <p className={styles.roleLabel}>{profile.roleLabel}</p>
          <h1 className={styles.tagline}>{profile.tagline}</h1>
          <blockquote className={styles.signatureQuote}>
            &ldquo;{profile.signatureQuote}&rdquo;
          </blockquote>
          <p className={styles.name}>{profile.name}</p>
        </div>
      </section>

      {/* Vision */}
      {profile.visionStatement && (
        <section className={styles.vision}>
          <div className={styles.container}>
            <h2 className={styles.sectionLabel}>Vision</h2>
            <p className={styles.visionText}>{profile.visionStatement}</p>
            {profile.visionScripture && (
              <blockquote className={styles.visionScripture}>
                &ldquo;{profile.visionScripture.text}&rdquo;
                <cite>— {profile.visionScripture.ref}</cite>
              </blockquote>
            )}
          </div>
        </section>
      )}

      {/* Profile split */}
      <section className={styles.profile}>
        <div className={styles.container}>
          <div className={styles.profileSplit}>
            <ScrollReveal direction="left">
              <div className={styles.profilePhotoWrap}>
                <img src={profile.profilePhoto} alt={profile.name} className={styles.profilePhoto} />
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div>
                <h2 className={styles.sectionTitle}>Who is {profile.name.replace(/^Rev\. |^Pastor /, '')}</h2>
                {profile.profileParagraphs.map((para) => (
                  <p key={para.slice(0, 40)} className={styles.bio}>{para}</p>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Qualifications */}
      {(profile.qualificationsNarrative?.length || profile.qualifications.length) > 0 && (
        <section className={styles.qualifications}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Professional Qualifications</h2>
            <div className={styles.qualSplit}>
              <div>
                {profile.qualificationsNarrative?.map((p) => (
                  <p key={p.slice(0, 40)} className={styles.bio}>{p}</p>
                ))}
              </div>
              <ul className={styles.credentialList}>
                {profile.qualifications.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Ministry areas */}
      <section className={styles.ministry}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            {profile.slug === 'evans-kochoo' ? 'Where the Eagle Flies — Areas of Ministry & Calling' : 'Ministry Focus'}
          </h2>
          <div className={styles.ministryGrid}>
            {profile.ministryAreas.map((area) => (
              <ScrollReveal key={area.title}>
                <article className={styles.ministryCard}>
                  <span className={styles.ministryIcon} aria-hidden>{area.icon}</span>
                  <h3>{area.title}</h3>
                  <p>{area.description}</p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className={styles.skills}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Competencies</h2>
          <div className={styles.skillPills}>
            {profile.coreSkills.map((skill) => (
              <span key={skill} className={styles.skillPill}>{skill}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className={styles.gallery}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Ministry in Pictures</h2>
          <MasonryGallery images={profile.galleryImages} altPrefix={profile.name} />
          <blockquote className={styles.galleryQuote}>
            &ldquo;{profile.signatureQuote}&rdquo;
            {profile.quoteTagline && <cite>{profile.quoteTagline}</cite>}
          </blockquote>
        </div>
      </section>

      {/* CTA */}
      {profile.cta && (
        <section className={styles.cta}>
          <div className={styles.container}>
            <h2>{profile.cta.title}</h2>
            <p>{profile.cta.body}</p>
            <a href={profile.cta.link} className={styles.ctaBtn}>
              {profile.cta.label}
            </a>
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}
