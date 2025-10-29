'use client';

import { Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface TrialCountdownProps {
  analysesUsed: number;
  analysesLimit: number;
}

export function TrialCountdown({
  analysesUsed,
  analysesLimit,
}: TrialCountdownProps) {
  const remaining = analysesLimit - analysesUsed;
  const percent = (analysesUsed / analysesLimit) * 100;

  return (
    <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
          <Clock className="h-5 w-5 text-blue-600" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium mb-1">
            Free Trial: {remaining} of {analysesLimit} analyses remaining
          </p>
          <div className="h-2 bg-white rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        <Link href="/pricing">
          <Button size="sm" variant="outline">
            Upgrade
          </Button>
        </Link>
      </div>
    </Card>
  );
}
