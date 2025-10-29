import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { AlertTriangle } from 'lucide-react'

// Force dynamic rendering to avoid Sentry instrumentation issues
export const dynamic = 'force-dynamic'

export default function DisclaimerPage() {
  return (
    <div className="flex min-h-screen flex-col gradient-bg">
      <Header />

      <main className="flex-1 pt-20 pb-16">
        <div className="container max-w-4xl">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm">
              <AlertTriangle className="h-4 w-4 text-primary" />
              <span className="gradient-text font-semibold">Disclaimer</span>
            </div>
            <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl">
              Important <span className="gradient-text">Disclaimer</span>
            </h1>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          {/* Warning Banner */}
          <div className="mb-12 rounded-2xl border-2 border-yellow-500/50 bg-yellow-500/10 p-8">
            <div className="flex gap-4">
              <AlertTriangle className="h-6 w-6 text-yellow-500 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-bold mb-2 text-yellow-500">IMPORTANT NOTICE</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Please read this disclaimer carefully before using Nativeflows. By using our service, you acknowledge
                  and agree to all terms outlined below.
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="glass-card rounded-2xl p-8 md:p-12 prose prose-invert max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">1. Not Financial Advice</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>NATIVEFLOWS IS AN EDUCATIONAL PLATFORM ONLY.</strong> All content, analysis, insights, and
                information provided through our Service are for educational and informational purposes only and
                should NOT be construed as:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Financial advice</li>
                <li>Investment advice</li>
                <li>Trading recommendations</li>
                <li>Buy or sell signals</li>
                <li>Professional financial consultation</li>
                <li>Tax, legal, or accounting advice</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                We are not registered financial advisors, investment advisors, or broker-dealers. You should consult
                with qualified financial professionals before making any investment decisions.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">2. Trading Risks</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>TRADING INVOLVES SUBSTANTIAL RISK OF LOSS.</strong> You should be aware that:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>You can lose some or all of your invested capital</li>
                <li>Past performance does not guarantee future results</li>
                <li>No trading strategy or analysis can guarantee profits</li>
                <li>Market conditions can change rapidly and unpredictably</li>
                <li>Leverage can magnify both gains and losses</li>
                <li>You should only trade with money you can afford to lose</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                By using our Service, you acknowledge these risks and accept full responsibility for your trading
                decisions and any resulting financial outcomes.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">3. AI Analysis Limitations</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our AI-powered analysis has inherent limitations:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong>No Guarantees:</strong> AI analysis may contain errors, inaccuracies, or incomplete information</li>
                <li><strong>Historical Data:</strong> AI analyzes historical price action and cannot predict future market movements</li>
                <li><strong>Context Limitations:</strong> AI may not account for fundamental factors, news events, or market conditions</li>
                <li><strong>Technical Constraints:</strong> Analysis quality depends on chart image quality and clarity</li>
                <li><strong>Interpretation Required:</strong> AI insights require human judgment and should not be followed blindly</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Always perform your own research and analysis before making trading decisions.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">4. No Performance Guarantees</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We make no representations or guarantees regarding:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>The accuracy, reliability, or completeness of any analysis or information</li>
                <li>Trading performance or profitability</li>
                <li>Specific trading outcomes or results</li>
                <li>The suitability of any analysis for your individual circumstances</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Any examples, case studies, or hypothetical scenarios presented are for illustrative purposes only
                and do not represent actual trading results.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">5. Personal Responsibility</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You acknowledge and agree that:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>You are solely responsible for your own trading decisions</li>
                <li>You will perform your own due diligence before making any trades</li>
                <li>You understand the risks involved in trading</li>
                <li>You have the financial capacity to bear potential losses</li>
                <li>You will not hold Nativeflows liable for any trading losses or adverse outcomes</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">6. No Professional Relationship</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your use of Nativeflows does not create a professional relationship between you and us. We do not:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4 ml-4">
                <li>Act as your financial advisor, broker, or agent</li>
                <li>Have a fiduciary duty to you</li>
                <li>Know your individual financial situation, risk tolerance, or investment objectives</li>
                <li>Provide personalized financial advice tailored to your circumstances</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">7. Market Data and Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                All market data, charts, and information are provided "as is" for educational purposes. We:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Do not guarantee the accuracy or timeliness of market data</li>
                <li>Are not responsible for data delays, errors, or omissions</li>
                <li>May rely on third-party data sources over which we have no control</li>
                <li>Cannot guarantee the availability or continuity of market data</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">8. Regulatory Compliance</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You are responsible for:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Ensuring your trading activities comply with applicable laws and regulations</li>
                <li>Understanding the tax implications of your trading activities</li>
                <li>Verifying that you are legally permitted to trade in your jurisdiction</li>
                <li>Complying with any restrictions or requirements imposed by your broker or exchange</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">9. Third-Party Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may provide information about or links to third-party services, brokers, or platforms. We do not:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4 ml-4">
                <li>Endorse or recommend any specific broker, platform, or service</li>
                <li>Take responsibility for third-party services or their actions</li>
                <li>Guarantee the quality, reliability, or security of third-party services</li>
                <li>Have control over third-party terms, conditions, or practices</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">10. Service Limitations</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our Service may be:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Interrupted, delayed, or unavailable at times</li>
                <li>Subject to technical errors or malfunctions</li>
                <li>Modified, suspended, or discontinued without notice</li>
                <li>Incompatible with certain devices, browsers, or configurations</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                We are not liable for any losses or damages resulting from Service interruptions or limitations.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">11. Forward-Looking Statements</h2>
              <p className="text-muted-foreground leading-relaxed">
                Any statements about potential market movements, trends, or opportunities are forward-looking and
                speculative in nature. These statements are based on current analysis and assumptions that may prove
                incorrect. Actual results may differ materially from any projections or expectations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">12. Acknowledgment</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                By using Nativeflows, you acknowledge that you have read, understood, and agreed to this disclaimer.
                You confirm that:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>You understand the educational nature of our Service</li>
                <li>You are aware of the risks involved in trading</li>
                <li>You will not rely solely on our analysis for trading decisions</li>
                <li>You accept full responsibility for your trading activities and outcomes</li>
                <li>You will consult with qualified professionals before making financial decisions</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-6">
                If you do not agree with this disclaimer, do not use our Service.
              </p>
            </section>

            <section className="mt-12 pt-8 border-t border-border">
              <h3 className="text-xl font-bold mb-4">Contact Information</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                For questions about this disclaimer:
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
