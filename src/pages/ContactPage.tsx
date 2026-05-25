import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/public/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setTimeout(() => setSubmitStatus('idle'), 5000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div
        className="hero-section"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&h=900&fit=crop)',
        }}
      >
        <div className="hero-overlay" />
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="section-title">Get in Touch</h1>
            <p className="section-subtitle">
              We'd love to hear from you. Reach out to us today.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contact Info & Form */}
      <section className="section-container bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-poppins font-bold text-gray-900 mb-8">
              Contact Information
            </h2>

            {/* Contact Details */}
            <div className="space-y-6">
              <div className="flex gap-4">
                <MapPin className="text-accent-500 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Location</h3>
                  <p className="text-gray-600">
                    Along Baraka Road / Treewa Road<br />
                    Next to Balozi Junior Academy<br />
                    Kitengela, Kenya
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Phone className="text-accent-500 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Phone</h3>
                  <p className="text-gray-600">
                    +254 722 566 399<br />
                    +254 720 276 162<br />
                    +254 720 977 189
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Mail className="text-accent-500 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Email</h3>
                  <p className="text-gray-600">
                    <a href="mailto:info@kitengela.church" className="hover:text-accent-500">
                      info@kitengela.church
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Clock className="text-accent-500 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Service Hours</h3>
                  <p className="text-gray-600">
                    Sunday: 8:00 AM - 1:00 PM<br />
                    Wednesday: 8:00 PM - 9:30 PM<br />
                    Friday: 8:00 PM - 9:30 PM
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-poppins font-bold text-gray-900 mb-8">
              Send us a Message
            </h2>

            {/* Status Messages */}
            {submitStatus === 'success' && (
              <motion.div
                className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Thank you! We'll get back to you soon.
              </motion.div>
            )}
            {submitStatus === 'error' && (
              <motion.div
                className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Error submitting form. Please try again.
              </motion.div>
            )}

            {/* Form Fields */}
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
            />

            <input
              type="tel"
              name="phone"
              placeholder="Your Phone (Optional)"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
            />

            <select
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
            >
              <option value="">Select Subject</option>
              <option value="prayer-request">Prayer Request</option>
              <option value="visit-inquiry">First Time Visit</option>
              <option value="feedback">Feedback</option>
              <option value="general">General Inquiry</option>
              <option value="other">Other</option>
            </select>

            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleInputChange}
              required
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
            />

            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary text-center justify-center disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </motion.button>
          </motion.form>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-96 bg-gray-100">
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127641.18956977797!2d36.87707421113543!3d-1.5037920197415175!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f7c00e6559cb5%3A0x2904fc4ce0f96898!2sKitengela!5e0!3m2!1sen!2ske!4v1716654210000!5m2!1sen!2ske"
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </div>
  );
}
