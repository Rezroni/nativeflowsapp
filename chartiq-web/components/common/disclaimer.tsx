import { AlertTriangle } from 'lucide-react'

interface DisclaimerProps {
  variant?: 'banner' | 'card'
  className?: string
}

export function Disclaimer({ variant = 'banner', className = '' }: DisclaimerProps) {
  if (variant === 'banner') {
    return (
      <div
        className={`border-y border-primary/20 bg-primary/5 px-4 py-3 backdrop-blur-sm ${className}`}
      >
        <div className="container flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 text-primary" />
          <p className="text-sm text-foreground/90">
            <strong className="text-primary font-semibold">Educational Disclaimer:</strong> Nativeflows is an educational
            tool for learning Smart Money Concepts. All analysis and recommendations
            are for educational purposes only and are not financial advice. Trading
            involves substantial risk. Always do your own research and consult with a
            licensed financial advisor.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`rounded-xl border border-primary/30 bg-primary/10 p-4 backdrop-blur-sm ${className}`}
    >
      <div className="flex gap-3">
        <AlertTriangle className="h-5 w-5 flex-shrink-0 text-primary" />
        <div className="space-y-1">
          <p className="text-sm font-semibold text-primary">
            Educational Purpose Only
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            This tool is for educational purposes only. All analysis and
            recommendations are not financial advice. Trading involves substantial
            risk of loss. Always conduct your own research and risk management.
          </p>
        </div>
      </div>
    </div>
  )
}
