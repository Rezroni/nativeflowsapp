import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { FileText } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col gradient-bg">
      <Header />

      <main className="flex-1 pt-20 pb-16">
        <div className="container max-w-4xl">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm">
              <FileText className="h-4 w-4 text-primary" />
              <span className="gradient-text font-semibold">Terms of Service</span>
            </div>
            <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl">
              Terms of <span className="gradient-text">Service</span>
            </h1>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          {/* Content */}
          <div className="glass-card rounded-2xl p-8 md:p-12 prose prose-invert max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">1. Agreement to Terms</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                By accessing or using Nativeflows ("Service," "we," "our," or "us"), you agree to be bound by these
                Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                These Terms apply to all visitors, users, and others who access or use the Service.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Nativeflows provides AI-powered trading chart analysis and educational resources. Our Service includes:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>AI-powered chart analysis using GPT-4 Vision technology</li>
                <li>Smart Money Concepts education and analysis</li>
                <li>Trading insights and pattern recognition</li>
                <li>Educational resources and tutorials</li>
                <li>Analysis history and sharing features</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                The Service is provided for educational and informational purposes only and does not constitute
                financial advice.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">3. User Accounts</h2>
              <h3 className="text-xl font-semibold mb-3">3.1 Account Creation</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                To use certain features of the Service, you must register for an account. You agree to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6 ml-4">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your information to keep it accurate</li>
                <li>Maintain the security of your password</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">3.2 Account Termination</h3>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to suspend or terminate your account at any time for any reason, including
                violation of these Terms, without prior notice.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">4. Acceptable Use</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You agree not to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Use the Service for any illegal purpose or in violation of any laws</li>
                <li>Violate or infringe upon the rights of others</li>
                <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
                <li>Upload viruses, malware, or any malicious code</li>
                <li>Spam, phish, or engage in any automated use of the system</li>
                <li>Scrape, data mine, or use automated systems to collect information from the Service</li>
                <li>Reverse engineer or attempt to extract source code from the Service</li>
                <li>Share your account credentials with others</li>
                <li>Use the Service to provide services to third parties</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">5. Subscription and Payment</h2>
              <h3 className="text-xl font-semibold mb-3">5.1 Subscription Plans</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We offer various subscription plans with different features and pricing. By subscribing, you agree to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6 ml-4">
                <li>Pay all fees associated with your chosen plan</li>
                <li>Provide valid payment information</li>
                <li>Authorize us to charge your payment method on a recurring basis</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">5.2 Billing and Renewals</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Subscriptions automatically renew at the end of each billing period unless cancelled. You will be
                charged at the then-current rate for your plan.
              </p>

              <h3 className="text-xl font-semibold mb-3">5.3 Cancellation and Refunds</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You may cancel your subscription at any time from your account settings. Cancellations take effect
                at the end of the current billing period. We do not provide refunds for partial subscription periods,
                except where required by law.
              </p>

              <h3 className="text-xl font-semibold mb-3">5.4 Price Changes</h3>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to change our pricing. We will notify you of any price changes at least 30 days
                in advance. Continued use of the Service after a price change constitutes acceptance of the new price.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">6. Intellectual Property</h2>
              <h3 className="text-xl font-semibold mb-3">6.1 Our Content</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The Service and its original content, features, and functionality are owned by Nativeflows and are
                protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>

              <h3 className="text-xl font-semibold mb-3">6.2 Your Content</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You retain ownership of charts and images you upload. By uploading content, you grant us a license to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Use, process, and analyze your uploaded content to provide the Service</li>
                <li>Store and display your content in your account</li>
                <li>Create derivative works (analysis results) from your content</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                This license terminates when you delete your content or account, except for content you've shared publicly.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">7. Disclaimers and Limitations</h2>
              <h3 className="text-xl font-semibold mb-3">7.1 No Financial Advice</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>IMPORTANT:</strong> The Service provides educational and informational content only. Our analysis
                and insights are NOT financial advice, investment recommendations, or trading signals. You should not
                make any financial decisions based solely on information from our Service.
              </p>

              <h3 className="text-xl font-semibold mb-3">7.2 Trading Risks</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Trading involves substantial risk of loss. Past performance is not indicative of future results. You
                acknowledge that:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6 ml-4">
                <li>You may lose some or all of your investment</li>
                <li>You should only trade with money you can afford to lose</li>
                <li>You are solely responsible for your trading decisions</li>
                <li>Our AI analysis may contain errors or inaccuracies</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">7.3 Service Availability</h3>
              <p className="text-muted-foreground leading-relaxed">
                The Service is provided "as is" and "as available" without warranties of any kind. We do not guarantee
                that the Service will be uninterrupted, secure, or error-free.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">8. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                To the maximum extent permitted by law, Nativeflows and its affiliates, officers, employees, and agents
                shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including
                but not limited to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Loss of profits, revenue, or data</li>
                <li>Trading losses</li>
                <li>Business interruption</li>
                <li>Loss of goodwill</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Our total liability to you for any claims arising from your use of the Service shall not exceed the
                amount you paid us in the 12 months preceding the claim.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">9. Indemnification</h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree to indemnify and hold harmless Nativeflows and its affiliates from any claims, damages,
                losses, liabilities, and expenses (including legal fees) arising from:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4 ml-4">
                <li>Your use of the Service</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any rights of another party</li>
                <li>Your trading decisions and activities</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">10. Governing Law and Disputes</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction],
                without regard to its conflict of law provisions.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Any disputes arising from these Terms or your use of the Service shall be resolved through binding
                arbitration, except where prohibited by law.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">11. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify you of material changes by
                posting the new Terms on this page and updating the "Last updated" date. Your continued use of the
                Service after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">12. Severability</h2>
              <p className="text-muted-foreground leading-relaxed">
                If any provision of these Terms is found to be unenforceable or invalid, that provision shall be
                limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain
                in full force and effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">13. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have any questions about these Terms, please contact us:
              </p>
              <ul className="list-none text-muted-foreground space-y-2">
                <li>Email: legal@nativeflows.com</li>
                <li>Support: support@nativeflows.com</li>
              </ul>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
