import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SportEvent } from '@/types/betting';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchSportEvents } from '@/store/features/sportsSlice';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { EventStatusBadge } from '@/components/ui/event-status-badge';
import { TrendingUp, AlertCircle, Timer } from 'lucide-react';
import { fetchUserBets } from '@/store/features/betsSlice';

interface DashboardProps {
    onEventSelect: (event: SportEvent) => void;
    onViewChange: (view: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onEventSelect, onViewChange }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { events, isLoading, error } = useSelector((state: RootState) => state.sports);
    const { toast } = useToast();

    useEffect(() => {
        dispatch(fetchSportEvents());
        dispatch(fetchUserBets());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast({
                title: "Error",
                description: error,
                variant: "destructive",
            });
        }
    }, [error, toast]);

    const handleEventClick = (event: SportEvent) => {
        if (!event.isActive) {
            toast({
                title: "Evento no disponible",
                description: "Este evento no está disponible para apuestas",
                variant: "destructive",
            });
            return;
        }
        onEventSelect(event);
        onViewChange('betting');
    };

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto p-6">
                <div className="text-center">
                    <p className="text-muted-foreground">Cargando eventos deportivos...</p>
                </div>
            </div>
        );
    }

    const getLiveStatusText = (status: SportEvent['liveStatus'], currentMinute: number | null) => {
        switch (status) {
            case 'FIRST_HALF':
                return `1er Tiempo ${currentMinute}'`;
            case 'HALF_TIME':
                return 'Descanso';
            case 'SECOND_HALF':
                return `2do Tiempo ${currentMinute}'`;
            case 'NOT_STARTED':
                return 'No iniciado';
            default:
                return '';
        }
    };

    const getLiveStatusColor = (status: SportEvent['liveStatus']) => {
        switch (status) {
            case 'FIRST_HALF':
            case 'SECOND_HALF':
                return 'destructive';
            case 'HALF_TIME':
                return 'secondary';
            default:
                return 'outline';
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    Eventos Deportivos
                </h1>
                <p className="text-muted-foreground">
                    Selecciona un evento para realizar tu apuesta
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                    <Card 
                        key={event.id} 
                        className={`hover:shadow-lg transition-shadow ${event.isActive ? 'cursor-pointer' : 'opacity-75'}`}
                        onClick={() => handleEventClick(event)}
                    >
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-lg">{event.name}</CardTitle>
                                    <CardDescription className="flex items-center space-x-2 mt-1">
                                        <EventStatusBadge event={event} />
                                        <Badge variant={getLiveStatusColor(event.liveStatus)} className="flex items-center gap-1">
                                            <Timer className="h-3 w-3" />
                                            {getLiveStatusText(event.liveStatus, event.currentMinute)}
                                        </Badge>
                                    </CardDescription>
                                </div>
                                <TrendingUp className="h-5 w-5 text-primary" />
                            </div>
                        </CardHeader>
                        
                        <CardContent>
                            <div className="space-y-4">
                                {event.isLive && (
                                    <div className="text-center font-bold text-xl mb-4">
                                        {event.homeTeamScore} - {event.awayTeamScore}
                                    </div>
                                )}
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="text-center p-2 bg-muted/30 rounded-lg">
                                        <div className="font-medium truncate">{event.homeTeam}</div>
                                        <div className="text-lg font-bold text-accent mt-1">
                                            {event.homeTeamOdds}
                                        </div>
                                    </div>
                                    <div className="text-center p-2 bg-muted/30 rounded-lg">
                                        <div className="font-medium">Empate</div>
                                        <div className="text-lg font-bold text-accent mt-1">
                                            {event.drawOdds}
                                        </div>
                                    </div>
                                    <div className="text-center p-2 bg-muted/30 rounded-lg">
                                        <div className="font-medium truncate">{event.awayTeam}</div>
                                        <div className="text-lg font-bold text-accent mt-1">
                                            {event.awayTeamOdds}
                                        </div>
                                    </div>
                                </div>

                                <Button 
                                    className="w-full" 
                                    disabled={!event.isActive}
                                >
                                    Apostar
                                </Button>

                                {!event.isActive && (
                                    <div className="flex items-center justify-center space-x-2 text-destructive text-sm">
                                        <AlertCircle className="h-4 w-4" />
                                        <span>Evento no disponible</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {events.length === 0 && !isLoading && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No hay eventos disponibles en este momento.</p>
                </div>
            )}
        </div>
    );
};

export default Dashboard;