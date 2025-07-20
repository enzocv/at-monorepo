import { useMemo } from 'react';
import { SportEvent } from '@/types/betting';

export type EventStatus = 'upcoming' | 'live' | 'finished';

interface EventStatusInfo {
    status: EventStatus;
    label: string;
    variant: 'default' | 'destructive' | 'secondary';
}

export const useEventStatus = (event: SportEvent): EventStatusInfo => {
    return useMemo(() => {
        const eventDate = new Date(event.eventDate);
        const now = new Date();
        
        // Calculamos la diferencia en minutos
        const diffInMinutes = (eventDate.getTime() - now.getTime()) / (1000 * 60);
        
        // Definimos los umbrales (en minutos)
        const MATCH_DURATION = 120; // 2 horas promedio para un evento
        const BUFFER_BEFORE = 15; // 15 minutos antes del evento se considera "live"
        
        if (diffInMinutes > BUFFER_BEFORE) {
            return {
                status: 'upcoming',
                label: 'PRÓXIMO',
                variant: 'secondary'
            };
        } else if (diffInMinutes > -MATCH_DURATION) {
            return {
                status: 'live',
                label: 'EN VIVO',
                variant: 'destructive'
            };
        } else {
            return {
                status: 'finished',
                label: 'FINALIZADO',
                variant: 'default'
            };
        }
    }, [event.eventDate]);
}; 