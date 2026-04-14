import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PageHeader from '@/components/PageHeader'
import ScrollReveal from '@/components/ScrollReveal'
import styles from './Give.module.css'

export default function Give() {
  return (
    <main>
      <Header />
      <PageHeader 
        title="Give & Support" 
        subtitle="Partnering for Transformation"
        backgroundImage="/handstogether unity.jpg"
        hideDivider={true}
      />
      <div className={styles.container}>
        <ScrollReveal direction="left">
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>For Tithes & Offerings</h2>
            <p className={styles.sectionIntro}>Use the details below for your regular tithes and offerings. <strong>Always specify the type of giving</strong> (e.g. Tithe, Offering, Building fund, Sanctuary, Ministry equipment, Evangelism).</p>
            <div className={styles.givingCard}>
              <div className={styles.givingMethod}>
                <div className={styles.methodHeader}><span className={styles.icon}>📱</span><h3>M-Pesa Paybill (Tithes & Offerings)</h3></div>
                <div className={styles.methodDetails}>
                  <div className={styles.detailRow}><span className={styles.label}>Paybill Number</span><span className={styles.value}>400222</span></div>
                  <div className={styles.detailRow}><span className={styles.label}>Account Number</span><span className={styles.value}>33985#</span></div>
                  <p className={styles.specifyNote}>(Specify type of giving in the reference, e.g. Tithe, Offering, Building, Sanctuary, Ministry, Evangelism)</p>
                  <div className={styles.instructions}>
                    <p><strong>How to give via M-Pesa:</strong></p>
                    <ol>
                      <li>Go to M-Pesa → Lipa na M-Pesa → Paybill</li>
                      <li>Enter Paybill: <strong>400222</strong></li>
                      <li>Enter Account: <strong>33985#</strong></li>
                      <li>In the reference, specify type: Tithe, Offering, Building, Sanctuary, Ministry, or Evangelism</li>
                      <li>Enter amount and your M-Pesa PIN, then confirm</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.bankCard}>
              <h3 className={styles.bankTitle}>Bank (Tithes & Offerings)</h3>
              <p className={styles.bankInfo}><strong>Bank:</strong> Co-operative Bank<br /><strong>Account Name:</strong> Athi River VOSH Church</p>
            </div>
          </section>
        </ScrollReveal>
        <ScrollReveal direction="right">
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Partner With Us — Let&apos;s Build God&apos;s House</h2>
            <div className={styles.givingCard}>
              <div className={styles.givingMethod}>
                <div className={styles.methodHeader}><span className={styles.icon}>📱</span><h3>M-Pesa (Building & Ministry)</h3></div>
                <div className={styles.methodDetails}>
                  <div className={styles.detailRow}><span className={styles.label}>Paybill</span><span className={styles.value}>100400</span></div>
                  <div className={styles.detailRow}><span className={styles.label}>Account</span><span className={styles.value}>9783810989</span></div>
                </div>
              </div>
            </div>
            <div className={styles.paypalCard}>
              <p className={styles.bankInfo}>PayPal: <a href="mailto:voshkitengelahouseofsolutions@gmail.com" className={styles.paypalEmail}>voshkitengelahouseofsolutions@gmail.com</a></p>
            </div>
          </section>
        </ScrollReveal>
        <ScrollReveal direction="left">
          <section className={styles.section}>
            <div className={styles.scripture}>
              <p className={styles.scriptureText}>&quot;Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.&quot;</p>
              <p className={styles.scriptureReference}>— 2 Corinthians 9:7</p>
            </div>
          </section>
        </ScrollReveal>
      </div>
      <Footer />
    </main>
  )
}
