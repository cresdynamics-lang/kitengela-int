import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PageHeader from '@/components/PageHeader'
import ContactSection from '@/components/ContactSection'

export default function Contact() {
  return (
    <main>
      <Header />
      <PageHeader 
        title="Contact Us" 
        subtitle="Plan Your Visit to VOSH Kitengela"
        backgroundImage="/whatsapp-11.jpeg"
      />
      <ContactSection />
      <Footer />
    </main>
  )
}
