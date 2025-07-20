import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/store/features/authSlice';
import { RootState } from '@/store';
import { Home, TrendingUp, History, LogOut } from 'lucide-react';

interface NavigationProps {
    currentView: string;
    onViewChange: (view: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    const navItems = [
        { id: 'dashboard', label: 'Eventos', icon: Home },
        { id: 'betting', label: 'Apostar', icon: TrendingUp },
        { id: 'history', label: 'Historial', icon: History },
    ];

    return (
        <nav className="bg-gradient-card border-b border-border shadow-card">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center space-x-8">
                        <div className="flex-shrink-0">
                            <h1 className="text-xl font-bold bg-gradient-accent bg-clip-text text-transparent">
                                BetPro
                            </h1>
                        </div>
                        
                        <div className="hidden md:flex space-x-4">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Button
                                        key={item.id}
                                        variant={currentView === item.id ? 'default' : 'ghost'}
                                        size="sm"
                                        onClick={() => onViewChange(item.id)}
                                        className="flex items-center space-x-2"
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span>{item.label}</span>
                                    </Button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        {user && (
                            <div className="text-sm text-muted-foreground">
                                <span>Bienvenido, </span>
                                <span className="font-medium">{user.email}</span>
                            </div>
                        )}
                        
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLogout}
                            className="flex items-center space-x-2"
                        >
                            <LogOut className="h-4 w-4" />
                            <span>Cerrar Sesión</span>
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;