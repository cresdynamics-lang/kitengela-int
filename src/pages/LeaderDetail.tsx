import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import RichLeaderProfile from '@/components/RichLeaderProfile'
import { publicApi } from '@/lib/api'
import {
  RICH_LEADER_PROFILES,
  resolveRichProfileFromLeader,
  resolveRichProfileSlug,
  type RichProfileSlug,
} from '@/lib/leaderProfiles'
import { findLeaderByRouteId, normalizeLeaders, type PublicLeader } from '@/lib/leaders'
import styles from './LeaderDetail.module.css'

function GenericLeaderProfile({ leader }: { leader: PublicLeader }) {
  const socials = [
    { label: 'Facebook', url: leader.facebookUrl },
    { label: 'Instagram', url: leader.instagramUrl },
    { label: 'X (Twitter)', url: leader.twitterUrl },
  ].filter((s) => s.url)

  return (
    <main>
      <Header />
      <div className={styles.container}>
        <a href="/leadership" className={styles.backLink}>← Back to Leadership</a>
        <div className={styles.hero}>
          <div className={styles.leaderHeader}>
            {leader.imageUrl ? (
              <img src={leader.imageUrl} alt={leader.name} className={styles.leaderImage} />
            ) : (
              <div className={styles.placeholderImage}><span>{leader.name.charAt(0)}</span></div>
            )}
            <div className={styles.leaderInfo}>
              <h1 className={styles.leaderName}>{leader.name}</h1>
              <p className={styles.leaderTitle}>{leader.title}</p>
            </div>
          </div>
        </div>
        {leader.bio && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>About</h2>
            <p className={styles.bio}>{leader.bio}</p>
          </section>
        )}
        {socials.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Connect</h2>
            <div className={styles.socialLinks}>
              {socials.map((s) => (
                <a key={s.label} href={s.url!} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                  {s.label}
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
      <Footer />
    </main>
  )
}

export default function LeaderDetail() {
  const { id } = useParams<{ id: string }>()
  const [leader, setLeader] = useState<PublicLeader | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }
    setLoading(true)
    publicApi
      .getLeaders()
      .then((r) => {
        const list = normalizeLeaders(r.data)
        setLeader(findLeaderByRouteId(list, id) ?? null)
      })
      .catch(() => setLeader(null))
      .finally(() => setLoading(false))
  }, [id])

  if (!id) return null

  const richSlug: RichProfileSlug | null =
    resolveRichProfileSlug(id) ?? (leader ? resolveRichProfileFromLeader(leader) : null)

  if (richSlug) {
    return <RichLeaderProfile profile={RICH_LEADER_PROFILES[richSlug]} />
  }

  if (loading) {
    return (
      <main>
        <Header />
        <div className={styles.loading}>Loading...</div>
        <Footer />
      </main>
    )
  }

  if (leader) {
    return <GenericLeaderProfile leader={leader} />
  }

  return (
    <main>
      <Header />
      <div className={styles.container}>
        <div className={styles.notFound}>
          <h1>Leader Not Found</h1>
          <a href="/leadership" className={styles.backLink}>← Back to Leadership</a>
        </div>
      </div>
      <Footer />
    </main>
  )
}
