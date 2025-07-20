import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BetStatus } from '@/types/betting';
import { History, Filter } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchUserBets } from '@/store/features/betsSlice';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBetCalculations } from '@/hooks/use-bet-calculations';
import { BetCard } from './BetCard';

const BettingHistory: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: bets, loading } = useSelector((state: RootState) => state.betting);
  const [statusFilter, setStatusFilter] = useState<BetStatus | 'ALL'>('ALL');
  const { calculateTotalWagered, calculateTotalWon, filterBetsByStatus } = useBetCalculations();

  useEffect(() => {
    dispatch(fetchUserBets());
  }, [dispatch]);

  const filteredBets = filterBetsByStatus(bets, statusFilter);
  const totalLost = calculateTotalWagered(filteredBets);
  const totalWon = calculateTotalWon(filteredBets);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center">
          <p className="text-muted-foreground">Cargando historial de apuestas...</p>
        </div>
      </div>
    );
  }

  if (bets.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-6 animate-fade-in">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Historial de Apuestas
          </h1>
          <p className="text-muted-foreground">
            Revisa todas tus apuestas realizadas
          </p>
        </div>

        <Card className="text-center py-12">
          <CardContent>
            <History className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <CardTitle className="mb-2">No tienes apuestas aún</CardTitle>
            <CardDescription>
              Cuando realices tu primera apuesta, aparecerá aquí tu historial
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Historial de Apuestas
        </h1>
        <p className="text-muted-foreground">
          Revisa todas tus apuestas realizadas
        </p>
      </div>

      {/* Filter */}
      <div className="flex justify-end">
        <div className="w-[200px]">
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as BetStatus | 'ALL')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todas las apuestas</SelectItem>
              <SelectItem value="PENDING">Pendientes</SelectItem>
              <SelectItem value="WON">Ganadas</SelectItem>
              <SelectItem value="LOST">Perdidas</SelectItem>
              <SelectItem value="CASH_OUT">Cash Out</SelectItem>
              <SelectItem value="REFUNDED">Reembolsadas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-destructive">${totalLost.toFixed(2)}</div>
            <div className="text-sm text-muted-foreground">Monto Perdido</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-success">${totalWon.toFixed(2)}</div>
            <div className="text-sm text-muted-foreground">Total Ganado</div>
          </CardContent>
        </Card>
      </div>

      {/* Bets List */}
      {filteredBets.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Filter className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <CardTitle className="mb-2">No hay apuestas con el filtro seleccionado</CardTitle>
            <CardDescription>
              Prueba seleccionando otro estado o mostrando todas las apuestas
            </CardDescription>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredBets.map((bet) => (
            <BetCard key={bet.id} bet={bet} loading={loading} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BettingHistory;