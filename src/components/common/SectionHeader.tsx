import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../ui/utils';

interface SectionHeaderProps {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export function SectionHeader({ 
  icon: Icon, 
  title, 
  subtitle, 
  action,
  className 
}: SectionHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)}>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-purple-500" />}
        <div>
          <h4 className="text-gray-800 font-medium">{title}</h4>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

