import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { BetStatus } from '@/types/betting';
import { cashOutBet, updateBetStatus } from '@/store/features/betsSlice';
import { useToast } from '@/hooks/use-toast';

export const useBetOperations = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { toast } = useToast();

    const handleCashOut = async (betId: string) => {
        try {
            await dispatch(cashOutBet(betId)).unwrap();
            toast({
                title: "Cash Out exitoso",
                description: "Tu apuesta ha sido liquidada correctamente",
            });
            return true;
        } catch (error) {
            toast({
                title: "Error",
                description: "No se pudo realizar el cash out. Inténtalo de nuevo.",
                variant: "destructive",
            });
            return false;
        }
    };

    const handleUpdateStatus = async (betId: string, status: BetStatus, reason?: string) => {
        try {
            await dispatch(updateBetStatus({ betId, status, refundReason: reason })).unwrap();
            toast({
                title: "Estado actualizado",
                description: "El estado de la apuesta ha sido actualizado correctamente",
            });
            return true;
        } catch (error) {
            toast({
                title: "Error",
                description: "No se pudo actualizar el estado de la apuesta. Inténtalo de nuevo.",
                variant: "destructive",
            });
            return false;
        }
    };

    return {
        handleCashOut,
        handleUpdateStatus,
    };
}; 