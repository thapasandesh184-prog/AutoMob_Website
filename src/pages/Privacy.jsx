import { motion } from 'framer-motion';

const sections = [
  {
    title: 'Information We Collect',
    content: `We collect information that you provide directly to us, including your name, email address, phone number, and any other details you submit through our contact forms or finance applications. We may also collect information about your interactions with our website, such as your IP address, browser type, and pages visited.`,
  },
  {
    title: 'How We Use Information',
    content: `The information we collect is used to respond to your inquiries, process your finance applications, improve our website and services, and communicate with you about vehicles, promotions, and events that may interest you. We do not sell your personal information to third parties.`,
  },
  {
    title: 'Data Security',
    content: `We take reasonable measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.`,
  },
  {
    title: 'Third-Party Services',
    content: `We may use trusted third-party services to help operate our business and website, such as analytics providers and marketing platforms. These third parties have access to your personal information only to perform specific tasks on our behalf and are obligated not to disclose or use it for any other purpose.`,
  },
  {
    title: 'Your Rights',
    content: `You have the right to access, update, or delete your personal information at any time. If you would like to exercise these rights or have any questions about our privacy practices, please contact us using the information provided below.`,
  },
  {
    title: 'Changes to This Policy',
    content: `We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We encourage you to review this page periodically for the latest information on our privacy practices.`,
  },
  {
    title: 'Contact Us',
    content: `If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:\n\nSKay Auto group\nParking lot, 21320 Westminster Hwy #2128\nRichmond, BC V5W 3A3\nEmail: info@skayautogroup.ca\nPhone: +1 7789907468`,
  },
];

export default function Privacy() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-[35vh] flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-50" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[#C0A66A] text-sm md:text-base tracking-[0.3em] uppercase mb-4"
          >
            Legal
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-light text-white mb-6"
          >
            Privacy <span className="text-gradient-gold font-medium">Policy</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white/60 text-lg max-w-2xl mx-auto font-light"
          >
            Last updated: April 2025
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-12">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <h2 className="text-2xl font-light text-white mb-4">{section.title}</h2>
                <div className="text-white/60 leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
