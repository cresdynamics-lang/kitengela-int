import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollReveal from '@/components/ScrollReveal'
import { publicApi } from '@/lib/api'
import { ROUTES } from '@/lib/routes'
import {
  defaultLeaders,
  normalizeLeaders,
  resolvePublicLeaders,
  getSeniorLeader,
  getMinistryTeam,
  getDepartmentalLeaders,
  isBishopLeader,
  splitBioParagraphs,
  parseGuidingScripture,
  DEFAULT_SENIOR_SCRIPTURE,
  type PublicLeader,
} from '@/lib/leaders'
import { leaderProfilePath } from '@/lib/leaderProfiles'
import styles from './Leadership.module.css'

export default function Leadership() {
  const [leaders, setLeaders] = useState<PublicLeader[]>(defaultLeaders)
  const [heroImage, setHeroImage] = useState('/Rev.Evans1.jpeg')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    publicApi
      .getLeaders()
      .then((response) => {
        if (!active) return
        if (!response.success) {
          setLeaders(defaultLeaders)
          return
        }
        setLeaders(resolvePublicLeaders(normalizeLeaders(response.data)))
      })
      .catch(() => {
        if (active) setLeaders(defaultLeaders)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    publicApi
      .getLeadershipHeroPhoto()
      .then((res) => {
        if (active && res.success && res.data?.url) {
          setHeroImage(res.data.url)
        }
      })
      .catch(() => {})

    return () => {
      active = false
    }
  }, [])

  const senior = getSeniorLeader(leaders)
  const ministryTeam = getMinistryTeam(leaders, senior)
  const departments = getDepartmentalLeaders(leaders, senior)
  const bishop = leaders.find((l) => l.id !== senior?.id && isBishopLeader(l))
  const assistantPastor = leaders.find(
    (l) =>
      l.id !== senior?.id &&
      l.id !== bishop?.id &&
      (/assistant pastor/i.test(l.title) || /nancy/i.test(l.name)),
  )

  const seniorParagraphs = senior
    ? splitBioParagraphs(senior.bio).filter((p) => !/^scripture:/i.test(p))
    : []
  const seniorScripture = senior
    ? parseGuidingScripture(senior.bio) ?? DEFAULT_SENIOR_SCRIPTURE
    : DEFAULT_SENIOR_SCRIPTURE

  return (
    <main className={styles.page}>
      <Header />

      {/* SECTION 1 — Hero */}
      <section className={styles.hero} style={{ backgroundImage: `url(${heroImage})` }}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>Leadership</h1>
          <p className={styles.heroTagline}>
            Shepherds called to lead, serve, and equip the House of Solutions.
          </p>
        </div>
      </section>

      {loading && leaders.length === 0 ? (
        <p className={styles.loading}>Loading leadership…</p>
      ) : (
        <>
          {/* Bishop — featured leadership */}
          {bishop && (
            <section className={styles.senior}>
              <div className={styles.container}>
                <ScrollReveal>
                  <div className={styles.seniorCard}>
                    <div className={styles.seniorPhotoWrap}>
                      {bishop.imageUrl ? (
                        <img
                          src={bishop.imageUrl}
                          alt={bishop.name}
                          className={styles.seniorPhoto}
                          loading="eager"
                          fetchPriority="high"
                          decoding="async"
                        />
                      ) : (
                        <div className={styles.seniorPlaceholder}>{bishop.name.charAt(0)}</div>
                      )}
                    </div>
                    <div className={styles.seniorCopy}>
                      <h2 className={styles.seniorName}>{bishop.name}</h2>
                      <p className={styles.seniorRole}>{bishop.title}</p>
                      <div className={styles.seniorBio}>
                        {splitBioParagraphs(bishop.bio)
                          .filter((p) => !/^scripture:/i.test(p))
                          .slice(0, 2)
                          .map((para) => (
                            <p key={para.slice(0, 40)}>{para}</p>
                          ))}
                      </div>
                      {parseGuidingScripture(bishop.bio) && (
                        <blockquote className={styles.seniorScripture}>
                          &ldquo;{parseGuidingScripture(bishop.bio)!.text}&rdquo;
                          <cite>— {parseGuidingScripture(bishop.bio)!.ref}</cite>
                        </blockquote>
                      )}
                      <Link to={leaderProfilePath(bishop)} className={styles.profileLink}>
                        Full Profile →
                      </Link>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </section>
          )}

          {/* Senior Pastor */}
          {senior && (
            <section className={styles.senior}>
              <div className={styles.container}>
                <ScrollReveal>
                  <div className={styles.seniorCard}>
                    <div className={styles.seniorPhotoWrap}>
                      {senior.imageUrl ? (
                        <img
                          src={senior.imageUrl}
                          alt={senior.name}
                          className={styles.seniorPhoto}
                          loading="eager"
                          fetchPriority="high"
                          decoding="async"
                        />
                      ) : (
                        <div className={styles.seniorPlaceholder}>{senior.name.charAt(0)}</div>
                      )}
                    </div>
                    <div className={styles.seniorCopy}>
                      <h2 className={styles.seniorName}>{senior.name}</h2>
                      <p className={styles.seniorRole}>{senior.title}</p>
                      <div className={styles.seniorBio}>
                        {seniorParagraphs.map((para) => (
                          <p key={para.slice(0, 40)}>{para}</p>
                        ))}
                      </div>
                      <blockquote className={styles.seniorScripture}>
                        &ldquo;{seniorScripture.text}&rdquo;
                        <cite>— {seniorScripture.ref}</cite>
                      </blockquote>
                      <Link to={leaderProfilePath(senior)} className={styles.profileLink}>
                        Full Profile →
                      </Link>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </section>
          )}

          {assistantPastor && (
            <section className={styles.senior}>
              <div className={styles.container}>
                <ScrollReveal>
                  <div className={styles.seniorCard}>
                    <div className={styles.seniorPhotoWrap}>
                      {assistantPastor.imageUrl ? (
                        <img
                          src={assistantPastor.imageUrl}
                          alt={assistantPastor.name}
                          className={styles.seniorPhoto}
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className={styles.seniorPlaceholder}>{assistantPastor.name.charAt(0)}</div>
                      )}
                    </div>
                    <div className={styles.seniorCopy}>
                      <h2 className={styles.seniorName}>{assistantPastor.name}</h2>
                      <p className={styles.seniorRole}>{assistantPastor.title}</p>
                      <div className={styles.seniorBio}>
                        {splitBioParagraphs(assistantPastor.bio).slice(0, 2).map((para) => (
                          <p key={para.slice(0, 40)}>{para}</p>
                        ))}
                      </div>
                      <Link to={leaderProfilePath(assistantPastor)} className={styles.profileLink}>
                        Full Profile →
                      </Link>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </section>
          )}

          {/* SECTION 3 — Ministry Leadership Team */}
          <section className={styles.team}>
            <div className={styles.container}>
              <h2 className={styles.sectionTitle}>Ministry Leadership Team</h2>
              {ministryTeam.length > 0 ? (
                <div className={styles.teamGrid}>
                  {ministryTeam.map((leader) => (
                    <ScrollReveal key={leader.id}>
                      <Link to={leaderProfilePath(leader)} className={styles.teamCard}>
                        <div className={styles.teamPhotoWrap}>
                          {leader.imageUrl ? (
                            <img
                              src={leader.imageUrl}
                              alt={leader.name}
                              className={styles.teamPhoto}
                              loading="lazy"
                              decoding="async"
                            />
                          ) : (
                            <div className={styles.teamPlaceholder}>{leader.name.charAt(0)}</div>
                          )}
                        </div>
                        <h3 className={styles.teamName}>{leader.name}</h3>
                        <p className={styles.teamRole}>{leader.title}</p>
                        {leader.bio && (
                          <p className={styles.teamBio}>
                            {leader.bio.length > 100 ? `${leader.bio.slice(0, 100)}…` : leader.bio}
                          </p>
                        )}
                      </Link>
                    </ScrollReveal>
                  ))}
                </div>
              ) : (
                <p className={styles.emptyNote}>More ministry leaders will be listed here soon.</p>
              )}
            </div>
          </section>

          {/* SECTION 4 — Departmental Heads */}
          <section className={styles.departments}>
            <div className={styles.container}>
              <h2 className={styles.sectionTitle}>Departmental Heads</h2>
              <div className={styles.deptGrid}>
                {departments.map((dept) => (
                  <div key={dept.id} className={styles.deptCard}>
                    <h3 className={styles.deptLabel}>{dept.label}</h3>
                    <p className={styles.deptName}>{dept.lead?.name ?? 'To be announced'}</p>
                    {dept.lead?.title && dept.lead.name && (
                      <p className={styles.deptRole}>{dept.lead.title}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* SECTION 5 — CTA */}
      <section className={styles.cta}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>
            Called to serve? We&apos;re always looking for hearts ready to grow in ministry.
          </h2>
          <Link to={ROUTES.discipleship} className={styles.ctaBtn}>
            Explore Discipleship →
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
