import { Link } from 'react-router-dom'
import styles from './Footer.module.css'
import { ROUTES, SERVICE_SLUGS, serviceDetailPath } from '@/lib/routes'
import { CONTACT_INFO, phoneHref, whatsappHref } from '@/lib/contact'
import { DEFAULT_GIVE_SETTINGS, formatMpesaAccount } from '@/lib/give'
import { MOTTO_HASHTAG, SOCIAL_LINKS } from '@/lib/brand'

export default function Footer() {
  const phones = CONTACT_INFO.phoneNumbers.map((p) => p.number)

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topRow}>
          <div className={styles.brandBlock}>
            <img src="/vosh-logo-70th.jpeg" alt="VOSH Church International Kitengela" className={styles.footerLogo} />
            <div>
              <h3 className={styles.brandName}>
                <span className={styles.brandVosh}>VOSH Church</span>
                {' '}
                <span className={styles.brandBranch}>Kitengela Branch</span>
              </h3>
              <p className={styles.hashtags}>{MOTTO_HASHTAG} · One Way, One Job</p>
            </div>
          </div>
        </div>

        <div className={styles.columns}>
          <div className={styles.column}>
            <h4 className={styles.columnHeading}>Quick Links</h4>
            <ul className={styles.linkList}>
              <li><Link to={ROUTES.home}>Home</Link></li>
              <li><Link to={ROUTES.whoWeAre}>Who We Are</Link></li>
              <li><Link to={ROUTES.leadership}>Leadership</Link></li>
              <li><Link to={ROUTES.nextGeneration}>Next Generation</Link></li>
              <li><Link to={ROUTES.outreach}>Outreach</Link></li>
              <li><Link to={ROUTES.discipleship}>Discipleship</Link></li>
              <li><Link to={ROUTES.sermons}>Sermons</Link></li>
              <li><Link to={ROUTES.testimonies}>Testimonies</Link></li>
              <li><Link to={ROUTES.events}>Events</Link></li>
              <li><Link to={ROUTES.prayerWall}>Prayer Wall</Link></li>
              <li><Link to={ROUTES.joinUs}>Join Us</Link></li>
              <li><Link to={ROUTES.give}>Give</Link></li>
            </ul>
          </div>

          <div className={styles.column}>
            <h4 className={styles.columnHeading}>Services</h4>
            <ul className={styles.linkList}>
              <li><Link to={serviceDetailPath(SERVICE_SLUGS.sundayWorship)}>Sunday Worship</Link></li>
              <li><Link to={serviceDetailPath(SERVICE_SLUGS.sundayBibleStudy)}>Bible Study</Link></li>
              <li><Link to={serviceDetailPath(SERVICE_SLUGS.wednesdayPrayers)}>Midweek Prayers</Link></li>
              <li><Link to={serviceDetailPath(SERVICE_SLUGS.youthOnlineConnect)}>Youth Online Connect</Link></li>
              <li><Link to={serviceDetailPath(SERVICE_SLUGS.fridayNight)}>Tefila Night</Link></li>
            </ul>
          </div>

          <div className={styles.column}>
            <h4 className={styles.columnHeading}>Connect</h4>
            <ul className={styles.phoneList}>
              {phones.map((phone) => (
                <li key={phone}>
                  <a href={phoneHref(phone)}>{phone}</a>
                </li>
              ))}
            </ul>
            <p className={styles.locationText} style={{ marginTop: '0.75rem' }}>
              <a href={`mailto:${CONTACT_INFO.email}`}>{CONTACT_INFO.email}</a>
            </p>
            <div className={styles.socialRow}>
              <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">Instagram</a>
              <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok">TikTok</a>
              <a href={SOCIAL_LINKS.whatsappGroup} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Group">WhatsApp Group</a>
            </div>
            <a
              href={whatsappHref(CONTACT_INFO.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.whatsappBtn}
            >
              WhatsApp: Chat Now
            </a>
          </div>

          <div className={styles.column}>
            <h4 className={styles.columnHeading}>Location</h4>
            <p className={styles.locationText}>
              Kitengela, Kenya — Along Baraka Road / Treewa Road
              <br />
              Next to Balozi Junior Academy
            </p>
            <h4 className={`${styles.columnHeading} ${styles.giveHeading}`}>Give &amp; Support</h4>
            <p className={styles.giveText}>
              Tithe / Offering / Development
              <br />
              Paybill: <strong>{DEFAULT_GIVE_SETTINGS.paybillNumber}</strong>
              <br />
              Account: <strong>{formatMpesaAccount(DEFAULT_GIVE_SETTINGS, '#offering')}</strong>
            </p>
            <p className={styles.giveText} style={{ marginTop: '0.5rem' }}>
              Building Fund
              <br />
              Paybill: <strong>{DEFAULT_GIVE_SETTINGS.buildingPaybillNumber}</strong>
              <br />
              Account: <strong>{DEFAULT_GIVE_SETTINGS.buildingAccountNumber}</strong>
            </p>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            &copy; {new Date().getFullYear()} Voice Of Salvation And Healing Church Int&apos;l — Kitengela.
          </p>
          <Link to={ROUTES.admin.login} className={styles.adminIconButton} aria-label="Admin login" title="Admin login">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2 4 6v5c0 5.2 3.3 9.9 8 11 4.7-1.1 8-5.8 8-11V6l-8-4Zm0 5a3 3 0 0 1 3 3v1h.5a1 1 0 0 1 1 1v3.5a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1V12a1 1 0 0 1 1-1H9v-1a3 3 0 0 1 3-3Zm0 1.5A1.5 1.5 0 0 0 10.5 10v1h3v-1A1.5 1.5 0 0 0 12 8.5Z" />
            </svg>
          </Link>
          <p className={styles.poweredBy}>
            Powered by{' '}
            <a href="https://cresdynamics.com" target="_blank" rel="noopener noreferrer">
              Cres Dynamics
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
