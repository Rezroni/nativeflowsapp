'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Mail, MessageCircle, MapPin, Phone, Send } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setSubmitted(true)

    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' })
      setSubmitted(false)
    }, 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="flex min-h-screen flex-col gradient-bg">
      <Header />

      <main className="flex-1 pt-20 pb-16">
        <div className="container">
          {/* Header */}
          <div className="mx-auto max-w-4xl text-center mb-16">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm">
              <MessageCircle className="h-4 w-4 text-primary" />
              <span className="gradient-text font-semibold">Contact Us</span>
            </div>
            <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Get in <span className="gradient-text">Touch</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Have a question or need help? We're here to assist you
            </p>
          </div>

          <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-3">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              <ContactInfo
                icon={<Mail className="h-5 w-5" />}
                title="Email Us"
                info="support@nativeflows.com"
                description="We'll respond within 24 hours"
              />
              <ContactInfo
                icon={<MessageCircle className="h-5 w-5" />}
                title="Live Chat"
                info="Available 9 AM - 5 PM EST"
                description="Get instant support"
              />
              <ContactInfo
                icon={<Phone className="h-5 w-5" />}
                title="Phone"
                info="+1 (555) 123-4567"
                description="Monday - Friday, 9 AM - 5 PM EST"
              />
              <ContactInfo
                icon={<MapPin className="h-5 w-5" />}
                title="Office"
                info="Remote First"
                description="Serving traders worldwide"
              />
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="glass-card rounded-2xl p-8 md:p-12">
                <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>

                {submitted ? (
                  <div className="rounded-xl bg-primary/20 border border-primary/50 p-8 text-center">
                    <div className="mb-4 inline-flex rounded-full bg-primary/20 p-4">
                      <Send className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground">
                      Thank you for contacting us. We'll get back to you soon.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2">
                          Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full rounded-xl bg-background/50 border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          placeholder="Your name"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full rounded-xl bg-background/50 border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-2">
                        Subject *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full rounded-xl bg-background/50 border border-border px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="">Select a subject</option>
                        <option value="general">General Inquiry</option>
                        <option value="support">Technical Support</option>
                        <option value="billing">Billing & Subscriptions</option>
                        <option value="feature">Feature Request</option>
                        <option value="bug">Report a Bug</option>
                        <option value="partnership">Partnership Opportunity</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        rows={6}
                        className="w-full rounded-xl bg-background/50 border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                        placeholder="Tell us how we can help you..."
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full group"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        'Sending...'
                      ) : (
                        <>
                          Send Message
                          <Send className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </Button>

                    <p className="text-sm text-muted-foreground text-center">
                      By submitting this form, you agree to our Privacy Policy and Terms of Service.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <section className="mt-20 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Common Questions</h2>
            <div className="glass-card rounded-2xl p-8 md:p-12 space-y-6">
              <QuickFAQ
                question="How quickly will I receive a response?"
                answer="We typically respond to all inquiries within 24 hours during business days. For urgent technical issues, please specify 'URGENT' in your subject line."
              />
              <QuickFAQ
                question="What should I include in a support request?"
                answer="Please include as much detail as possible: your account email, a description of the issue, steps to reproduce the problem, and any error messages you received."
              />
              <QuickFAQ
                question="Do you offer phone support?"
                answer="Phone support is available for Pro and Enterprise customers during business hours (9 AM - 5 PM EST, Monday-Friday). Free trial users can reach us via email or live chat."
              />
              <QuickFAQ
                question="Can I schedule a demo?"
                answer="Yes! Enterprise customers and potential partners can schedule a personalized demo. Select 'Partnership Opportunity' or 'General Inquiry' in the subject line and mention your interest in a demo."
              />
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}

function ContactInfo({
  icon,
  title,
  info,
  description
}: {
  icon: React.ReactNode
  title: string
  info: string
  description: string
}) {
  return (
    <div className="glass-card rounded-2xl p-6 hover-glow transition-all hover:-translate-y-2">
      <div className="mb-4 inline-flex rounded-xl bg-primary/20 p-3 text-primary">
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-foreground font-medium mb-1">{info}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

function QuickFAQ({ question, answer }: { question: string; answer: string }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">{question}</h3>
      <p className="text-muted-foreground leading-relaxed">{answer}</p>
    </div>
  )
}
