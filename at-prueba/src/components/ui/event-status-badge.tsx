import React from 'react';
import { Badge } from '@/components/ui/badge';
import { SportEvent } from '@/types/betting';
import { useEventStatus } from '@/hooks/use-event-status';
import { cn } from '@/lib/utils';

interface EventStatusBadgeProps {
    event: SportEvent;
    className?: string;
}

export const EventStatusBadge: React.FC<EventStatusBadgeProps> = ({ event, className }) => {
    const { status, label, variant } = useEventStatus(event);

    return (
        <Badge 
            variant={variant}
            className={cn(
                status === 'live' && 'animate-pulse',
                className
            )}
        >
            {label}
        </Badge>
    );
}; 