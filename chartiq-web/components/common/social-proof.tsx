'use client'

export function SocialProof() {
  const stats = [
    {
      value: '3K+',
      label: 'Active Traders',
      sublabel: 'worldwide'
    },
    {
      value: '$2M+',
      label: 'Analyses',
      sublabel: 'performed'
    },
    {
      value: '95%',
      label: 'Success Rate',
      sublabel: 'user satisfaction'
    }
  ]

  return (
    <section className="relative py-16 md:py-20 overflow-hidden">
      {/* Dark background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background" />

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center social-proof-stat"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Decorative laurel wreath top */}
              <div className="flex justify-center mb-4">
                <svg
                  width="60"
                  height="20"
                  viewBox="0 0 60 20"
                  fill="none"
                  className="text-primary/30"
                >
                  <path
                    d="M5 15C7 12 10 10 15 8C20 6 25 5 30 5C35 5 40 6 45 8C50 10 53 12 55 15"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <circle cx="8" cy="12" r="2" fill="currentColor" />
                  <circle cx="15" cy="9" r="1.5" fill="currentColor" />
                  <circle cx="22" cy="7" r="1.5" fill="currentColor" />
                  <circle cx="30" cy="6" r="2" fill="currentColor" />
                  <circle cx="38" cy="7" r="1.5" fill="currentColor" />
                  <circle cx="45" cy="9" r="1.5" fill="currentColor" />
                  <circle cx="52" cy="12" r="2" fill="currentColor" />
                </svg>
              </div>

              {/* Stat value */}
              <div className="mb-2">
                <span className="text-4xl md:text-5xl lg:text-6xl font-bold gradient-text block">
                  {stat.value}
                </span>
              </div>

              {/* Stat label */}
              <div className="space-y-1">
                <div className="text-base md:text-lg font-semibold text-foreground">
                  {stat.label}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.sublabel}
                </div>
              </div>

              {/* Decorative laurel wreath bottom */}
              <div className="flex justify-center mt-4">
                <svg
                  width="60"
                  height="20"
                  viewBox="0 0 60 20"
                  fill="none"
                  className="text-primary/30 rotate-180"
                >
                  <path
                    d="M5 15C7 12 10 10 15 8C20 6 25 5 30 5C35 5 40 6 45 8C50 10 53 12 55 15"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <circle cx="8" cy="12" r="2" fill="currentColor" />
                  <circle cx="15" cy="9" r="1.5" fill="currentColor" />
                  <circle cx="22" cy="7" r="1.5" fill="currentColor" />
                  <circle cx="30" cy="6" r="2" fill="currentColor" />
                  <circle cx="38" cy="7" r="1.5" fill="currentColor" />
                  <circle cx="45" cy="9" r="1.5" fill="currentColor" />
                  <circle cx="52" cy="12" r="2" fill="currentColor" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
