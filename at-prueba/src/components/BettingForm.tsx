import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { SportEvent, BetType, CreateBetRequest } from '@/types/betting';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { TrendingUp, Calculator, Trophy, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { EventStatusBadge } from '@/components/ui/event-status-badge';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { placeBet } from '@/store/features/betsSlice';

interface BettingFormProps {
    selectedEvent: SportEvent | null;
    onBetPlaced: () => void;
}

const MIN_BET_AMOUNT = 0.1;
const MAX_BET_AMOUNT = 10000;

const BettingForm: React.FC<BettingFormProps> = ({ selectedEvent, onBetPlaced }) => {
    const [selectedBetType, setSelectedBetType] = useState<BetType | null>(null);
    const [betAmount, setBetAmount] = useState<string>('');
    const [isPlacingBet, setIsPlacingBet] = useState(false);
    const { user } = useAuth();
    const { toast } = useToast();
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        setSelectedBetType(null);
        setBetAmount('');
    }, [selectedEvent?.id]);

    if (!selectedEvent) {
        return (
            <div className="max-w-4xl mx-auto p-6 animate-fade-in">
                <Card className="text-center py-12">
                    <CardContent>
                        <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <CardTitle className="mb-2">Selecciona un Evento</CardTitle>
                        <CardDescription>
                            Elige un evento deportivo del dashboard para comenzar a apostar
                        </CardDescription>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const getBetTypeLabel = (type: BetType): string => {
        switch (type) {
            case 'HOME': return selectedEvent.homeTeam;
            case 'AWAY': return selectedEvent.awayTeam;
            case 'DRAW': return 'Empate';
        }
    };

    const getOddsForBetType = (type: BetType): number => {
        switch (type) {
            case 'HOME': return parseFloat(selectedEvent.homeTeamOdds);
            case 'AWAY': return parseFloat(selectedEvent.awayTeamOdds);
            case 'DRAW': return parseFloat(selectedEvent.drawOdds);
        }
    };

    const calculatePotentialWin = (): number => {
        if (!selectedBetType || !betAmount) return 0;
        const amount = parseFloat(betAmount);
        const odds = getOddsForBetType(selectedBetType);
        return amount * odds;
    };

    const calculateProfit = (): number => {
        const potentialWin = calculatePotentialWin();
        const amount = parseFloat(betAmount) || 0;
        return potentialWin - amount;
    };

    const validateAmount = (value: string): string | null => {
        const amount = parseFloat(value);
        if (isNaN(amount)) return "El monto debe ser un número válido";
        if (amount < MIN_BET_AMOUNT) return `El monto mínimo de apuesta es $${MIN_BET_AMOUNT}`;
        if (amount > MAX_BET_AMOUNT) return `El monto máximo de apuesta es $${MAX_BET_AMOUNT}`;
        return null;
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        
        // Solo permitir números y un punto decimal
        if (!/^\d*\.?\d*$/.test(value)) return;
        
        // Limitar a 2 decimales
        if (value.includes('.') && value.split('.')[1].length > 2) return;
        
        setBetAmount(value);
    };

    const handlePlaceBet = async () => {
        if (!selectedBetType || !betAmount || !user) return;

        const amount = parseFloat(betAmount);
        const validationError = validateAmount(betAmount);
        
        if (validationError) {
            toast({
                title: "Monto inválido",
                description: validationError,
                variant: "destructive",
            });
            return;
        }

        setIsPlacingBet(true);

        try {
            const betData: CreateBetRequest = {
                sportEventId: selectedEvent.id,
                betType: selectedBetType,
                amount: amount
            };

            console.log(betData);
            await dispatch(placeBet(betData)).unwrap();

            toast({
                title: "¡Apuesta realizada!",
                description: `Has apostado $${amount.toFixed(2)} a ${getBetTypeLabel(selectedBetType)}`,
            });

            setSelectedBetType(null);
            setBetAmount('');
            onBetPlaced();

        } catch (error: any) {
            // Manejar errores específicos del backend
            const errorMessage = error?.response?.data?.message;
            toast({
                title: "Error",
                description: Array.isArray(errorMessage) 
                    ? errorMessage[0] 
                    : errorMessage || "No se pudo procesar la apuesta. Inténtalo de nuevo.",
                variant: "destructive",
            });
        } finally {
            setIsPlacingBet(false);
        }
    };

    const betOptions: { type: BetType; available: boolean }[] = [
        { type: 'HOME', available: true },
        { type: 'DRAW', available: true },
        { type: 'AWAY', available: true },
    ];

    // TODO: Implementar el estado del evento
    /* <Badge variant={selectedEvent.status === 'live' ? 'destructive' : 'secondary'}>
    {selectedEvent.status === 'live' ? 'EN VIVO' : 'PRÓXIMO'}
    </Badge>
    */

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    Realizar Apuesta
                </h1>
                <p className="text-muted-foreground">
                    Selecciona tu predicción y el monto de tu apuesta
                </p>
            </div>

            {/* Event Info */}
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-xl">
                                {selectedEvent.name}
                            </CardTitle>
                            <CardDescription className="flex items-center space-x-2 mt-1">
                                <EventStatusBadge event={selectedEvent} />
                                <Badge variant={selectedEvent.isActive ? 'default' : 'secondary'}>
                                    {selectedEvent.isActive ? 'ACTIVO' : 'INACTIVO'}
                                </Badge>
                                <span>•</span>
                                <span>
                                    {format(new Date(selectedEvent.eventDate), "d 'de' MMMM, HH:mm", { locale: es })}
                                </span>
                            </CardDescription>
                        </div>
                        <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bet Selection */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Trophy className="h-5 w-5" />
                            <span>Selecciona tu Predicción</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {betOptions.map(({ type, available }) => {
                            if (!available) return null;
                            
                            const isSelected = selectedBetType === type;
                            const odds = getOddsForBetType(type);
                            
                            return (
                                <Button
                                    key={type}
                                    variant={isSelected ? 'default' : 'bet'}
                                    className={`w-full h-auto p-4 flex justify-between items-center ${
                                        isSelected ? 'ring-2 ring-primary' : ''
                                    }`}
                                    onClick={() => setSelectedBetType(type)}
                                >
                                    <span className="font-medium">{getBetTypeLabel(type)}</span>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-accent">
                                            {odds.toFixed(2)}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            cuota
                                        </div>
                                    </div>
                                </Button>
                            );
                        })}
                    </CardContent>
                </Card>

                {/* Bet Amount & Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Calculator className="h-5 w-5" />
                            <span>Monto y Resumen</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="betAmount">Monto a Apostar</Label>
                            <div className="space-y-1">
                                <Input
                                    id="betAmount"
                                    type="text"
                                    placeholder="0.00"
                                    value={betAmount}
                                    onChange={handleAmountChange}
                                    min={MIN_BET_AMOUNT}
                                    step="0.1"
                                    disabled={!selectedBetType}
                                    className="font-mono"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Monto mínimo: ${MIN_BET_AMOUNT.toFixed(2)} • Monto máximo: ${MAX_BET_AMOUNT.toFixed(2)}
                                </p>
                            </div>
                        </div>

                        {selectedBetType && betAmount && parseFloat(betAmount) > 0 && (
                            <div className="space-y-3 p-4 bg-muted/30 rounded-lg border">
                                <h4 className="font-medium text-sm">Resumen de la Apuesta</h4>
                                
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Predicción:</span>
                                        <span className="font-medium">{getBetTypeLabel(selectedBetType)}</span>
                                    </div>
                                    
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Cuota:</span>
                                        <span className="font-medium">{getOddsForBetType(selectedBetType).toFixed(2)}</span>
                                    </div>
                                    
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Monto apostado:</span>
                                        <span className="font-medium">${parseFloat(betAmount).toFixed(2)}</span>
                                    </div>
                                    
                                    <div className="border-t pt-2 flex justify-between font-semibold">
                                        <span>Ganancia potencial:</span>
                                        <span className="text-success">${calculateProfit().toFixed(2)}</span>
                                    </div>
                                    
                                    <div className="flex justify-between font-semibold text-accent">
                                        <span>Total a recibir:</span>
                                        <span>${calculatePotentialWin().toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <Button
                            onClick={handlePlaceBet}
                            disabled={!selectedBetType || !betAmount || parseFloat(betAmount) <= 0 || isPlacingBet || !selectedEvent.isActive}
                            className="w-full"
                            size="lg"
                        >
                            {isPlacingBet ? 'Procesando...' : 'Confirmar Apuesta'}
                        </Button>

                        {!selectedEvent.isActive && (
                            <div className="flex items-center space-x-2 text-destructive text-sm">
                                <AlertCircle className="h-4 w-4" />
                                <span>Este evento no está disponible para apuestas</span>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default BettingForm;