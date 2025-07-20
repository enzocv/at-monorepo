import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bet } from '@/types/betting';
import { Trophy } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { parseNumber } from '@/lib/utils';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useBetStatus } from '@/hooks/use-bet-status';
import { useBetOperations } from '@/hooks/use-bet-operations';

interface BetCardProps {
    bet: Bet;
    loading: boolean;
}

export const BetCard: React.FC<BetCardProps> = ({ bet, loading }) => {
    const [refundReason, setRefundReason] = useState('');
    const { getStatusColor, getStatusIcon, getStatusText, getBetTypeText } = useBetStatus();
    const { handleCashOut, handleUpdateStatus } = useBetOperations();

    const StatusIcon = getStatusIcon(bet.status);

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                    <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                            <Trophy className="h-5 w-5 text-primary" />
                            <h3 className="font-semibold text-lg">{bet.sportEvent.name}</h3>
                            <Badge variant={getStatusColor(bet.status)} className="flex items-center space-x-1">
                                <StatusIcon className="h-4 w-4" />
                                <span>{getStatusText(bet.status)}</span>
                            </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                                <span className="text-muted-foreground">Predicción:</span>
                                <div className="font-medium">{getBetTypeText(bet.betType)}</div>
                            </div>

                            <div>
                                <span className="text-muted-foreground">Cuota:</span>
                                <div className="font-medium">{parseNumber(bet.odds).toFixed(2)}</div>
                            </div>

                            <div>
                                <span className="text-muted-foreground">Apostado:</span>
                                <div className="font-medium">${parseNumber(bet.amount).toFixed(2)}</div>
                            </div>

                            <div>
                                <span className="text-muted-foreground">Fecha:</span>
                                <div className="font-medium">
                                    {format(new Date(bet.createdAt), "d 'de' MMMM, HH:mm", { locale: es })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-right space-y-2">
                        <div>
                            <div className="text-lg font-bold text-accent">
                                ${parseNumber(bet.potentialWin).toFixed(2)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Ganancia potencial
                            </div>
                        </div>

                        {bet.status === 'CASH_OUT' && (
                            <div>
                                <div className="text-sm font-medium text-warning">
                                    Cash Out: ${parseNumber(bet.cashOutAmount).toFixed(2)}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {format(new Date(bet.cashOutDate!), "d 'de' MMMM, HH:mm", { locale: es })}
                                </div>
                            </div>
                        )}

                        {bet.status === 'PENDING' && (
                            <div className="flex flex-col space-y-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleCashOut(bet.id)}
                                    className="w-full md:w-auto"
                                    disabled={loading}
                                >
                                    <StatusIcon className="h-4 w-4 mr-2" />
                                    Cash Out
                                </Button>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleUpdateStatus(bet.id, 'WON')}
                                    className="w-full md:w-auto"
                                    disabled={loading}
                                >
                                    <StatusIcon className="h-4 w-4 mr-2" />
                                    Marcar Ganada
                                </Button>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleUpdateStatus(bet.id, 'LOST')}
                                    className="w-full md:w-auto"
                                    disabled={loading}
                                >
                                    <StatusIcon className="h-4 w-4 mr-2" />
                                    Marcar Perdida
                                </Button>

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full md:w-auto"
                                            disabled={loading}
                                        >
                                            <StatusIcon className="h-4 w-4 mr-2" />
                                            Reembolsar
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Reembolsar Apuesta</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Por favor, ingresa el motivo del reembolso.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <div className="py-4">
                                            <Input
                                                value={refundReason}
                                                onChange={(e) => setRefundReason(e.target.value)}
                                                placeholder="Motivo del reembolso"
                                            />
                                        </div>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel onClick={() => setRefundReason('')}>
                                                Cancelar
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => {
                                                    handleUpdateStatus(bet.id, 'REFUNDED', refundReason);
                                                    setRefundReason('');
                                                }}
                                                disabled={!refundReason.trim()}
                                            >
                                                Confirmar
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}; 