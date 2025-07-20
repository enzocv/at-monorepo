import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { SportEvent } from '@/types/betting';
import LoginForm from '@/components/LoginForm';
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';
import BettingForm from '@/components/BettingForm';
import BettingHistory from '@/components/BettingHistory';

const Index = () => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const [currentView, setCurrentView] = useState('dashboard');
    const [selectedEvent, setSelectedEvent] = useState<SportEvent | null>(null);

    const handleEventSelect = (event: SportEvent) => {
        setSelectedEvent(event);
        setCurrentView('betting');
    };

    const handleBetPlaced = () => {
        setCurrentView('history');
    };

    if (!isAuthenticated) {
        return <LoginForm />;
    }

    return (
        <div className="min-h-screen bg-background">
            <Navigation currentView={currentView} onViewChange={setCurrentView} />
            
            <main className="flex-1">
                {currentView === 'dashboard' && (
                    <Dashboard 
                        onEventSelect={handleEventSelect}
                        onViewChange={setCurrentView}
                    />
                )}
                
                {currentView === 'betting' && (
                    <BettingForm 
                        selectedEvent={selectedEvent}
                        onBetPlaced={handleBetPlaced}
                    />
                )}
                
                {currentView === 'history' && <BettingHistory />}
            </main>
        </div>
    );
};

export default Index;
