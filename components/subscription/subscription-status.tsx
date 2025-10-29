'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SubscriptionStatusProps {
  status: string;
  className?: string;
}

export function SubscriptionStatus({ status, className }: SubscriptionStatusProps) {
  const statusConfig = {
    active: {
      label: 'Active',
      variant: 'default' as const,
      className: 'bg-green-100 text-green-800 border-green-300',
    },
    trialing: {
      label: 'Trial',
      variant: 'secondary' as const,
      className: 'bg-blue-100 text-blue-800 border-blue-300',
    },
    past_due: {
      label: 'Past Due',
      variant: 'destructive' as const,
      className: 'bg-red-100 text-red-800 border-red-300',
    },
    canceled: {
      label: 'Canceled',
      variant: 'secondary' as const,
      className: 'bg-gray-100 text-gray-800 border-gray-300',
    },
    incomplete: {
      label: 'Incomplete',
      variant: 'secondary' as const,
      className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    },
    free: {
      label: 'Free',
      variant: 'outline' as const,
      className: 'bg-gray-50 text-gray-700 border-gray-200',
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.free;

  return (
    <Badge variant={config.variant} className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}
