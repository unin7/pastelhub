import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../ui/utils';

interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  message: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ 
  icon: Icon, 
  title, 
  message, 
  action,
  className 
}: EmptyStateProps) {
  return (
    <div className={cn('py-20 text-center', className)}>
      {Icon && (
        <Icon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
      )}
      {title && (
        <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
      )}
      <p className="text-gray-400 mb-4">{message}</p>
      {action && <div>{action}</div>}
    </div>
  );
}

