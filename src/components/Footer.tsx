import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const phoneNumbers = [
    '+254 722 566 399',
    '+254 720 276 162',
    '+254 720 977 189',
    '+254 775 036 515',
    '+254 703 182 203',
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerGrid}>
          {/* Branding */}
          <div className={`${styles.footerSection} ${styles.brandSection}`}>
            <h3 className={styles.footerTitle}>Voice Of Salvation And Healing Church Int&apos;l</h3>
            <p className={styles.footerDescription}>KITENGELA</p>
            <p className={styles.slogan}><strong>House of Solutions</strong> - <strong>Manifesting Christ</strong></p>
          </div>
          {/* Quick Links */}
          <div className={`${styles.footerSection} ${styles.linksSection}`}>
            <h4 className={styles.footerHeading}>Quick Links</h4>
            <ul className={styles.footerLinks}>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/leadership">Leadership</Link></li>
              <li><Link to="/give">Give</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          {/* Contact */}
          <div className={`${styles.footerSection} ${styles.contactSection}`}>
            <h4 className={styles.footerHeading}>Contact</h4>
            <div className={styles.phoneNumbers}>
              {phoneNumbers.map((phone, idx) => (
                <a key={idx} href={`tel:${phone.replace(/\s/g, '')}`} className={styles.phoneLink}>{phone}</a>
              ))}
            </div>
            <p className={styles.footerText}>
              <strong>WhatsApp:</strong>{' '}
              <a href="https://wa.me/254722566399" target="_blank" rel="noopener noreferrer" className={styles.whatsappLink}>
                +254 722 566 399
              </a>
            </p>
          </div>
          {/* Location */}
          <div className={`${styles.footerSection} ${styles.locationSection}`}>
            <h4 className={styles.footerHeading}>Location</h4>
            <p className={styles.footerText}>
              Kitengela, Kenya<br />
              Along Baraka Road / Treewa Road<br />
              Next to Balozi Junior Academy
            </p>
          </div>
          {/* Give & Support */}
          <div className={`${styles.footerSection} ${styles.supportSection}`}>
            <h4 className={styles.footerHeading}>Give & Support</h4>
            <p className={styles.footerText}>
              <strong>M-Pesa Paybill:</strong> 400222<br />
              <strong>Account:</strong> 1756443#offering/tithe
            </p>
            <Link to="/give" className={styles.giveLink}>Learn More -&gt;</Link>
          </div>
          {/* Socials */}
          <div className={`${styles.footerSection} ${styles.socialSection}`}>
            <div className={styles.socialLinks}>
              <div className={styles.socialIcons}>
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Facebook">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="YouTube">
                  <i className="fab fa-youtube"></i>
                </a>
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Instagram">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            &copy; {currentYear} Voice Of Salvation And Healing Church Int&apos;l - Kitengela. All rights reserved.
          </p>
          <p className={styles.hashtags}>#House_of_Solutions - #MANIFESTING_CHRIST</p>
          <Link to="/admin/login" className={styles.adminIconButton} aria-label="Admin login" title="Admin login">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2 4 6v5c0 5.2 3.3 9.9 8 11 4.7-1.1 8-5.8 8-11V6l-8-4Zm0 5a3 3 0 0 1 3 3v1h.5a1 1 0 0 1 1 1v3.5a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1V12a1 1 0 0 1 1-1H9v-1a3 3 0 0 1 3-3Zm0 1.5A1.5 1.5 0 0 0 10.5 10v1h3v-1A1.5 1.5 0 0 0 12 8.5Z" />
            </svg>
          </Link>
          <p className={styles.poweredBy}>
            Powered by{' '}
            <a href="https://cresdynamics.com" target="_blank" rel="noopener noreferrer" className={styles.poweredByLink}>
              Cres Dynamics
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
