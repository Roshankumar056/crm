import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusConfig = {
    NEW: { label: 'New', className: 'bg-info text-info-foreground' },
    CONTACTED: { label: 'Contacted', className: 'bg-primary text-primary-foreground' },
    QUALIFIED: { label: 'Qualified', className: 'bg-accent text-accent-foreground' },
    PROPOSAL: { label: 'Proposal', className: 'bg-warning text-warning-foreground' },
    WON: { label: 'Won', className: 'bg-success text-success-foreground' },
    LOST: { label: 'Lost', className: 'bg-destructive text-destructive-foreground' },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.NEW;

  return (
    <Badge className={cn('font-medium', config.className)}>
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
