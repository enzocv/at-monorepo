import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, TrendingUp } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '@/store/features/authSlice';
import type { AppDispatch, RootState } from '@/store';

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    const dispatch = useDispatch<AppDispatch>();
    const { isLoading, error } = useSelector((state: RootState) => state.auth);
    const { toast } = useToast();

    useEffect(() => {
        if (error) {
            toast({
                title: "Error de autenticación",
                description: error,
                variant: "destructive",
            });
            dispatch(clearError());
        }
    }, [error, toast, dispatch]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            await dispatch(loginUser({ email, password })).unwrap();
            toast({
                title: "¡Bienvenido!",
                description: "Has iniciado sesión correctamente",
            });
        } catch (error) {
            // El error ya se maneja en el efecto anterior
        }
    };

    const handleDemoLogin = () => {
        setEmail('test@example.com');
        setPassword('123456');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <Card>
                    <CardHeader className="space-y-1">
                        <div className="flex items-center justify-center mb-4">
                            <TrendingUp className="h-10 w-10 text-primary" />
                        </div>
                        <CardTitle className="text-2xl text-center font-bold">BetPro</CardTitle>
                        <CardDescription className="text-center">
                            Inicia sesión para comenzar a apostar
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="correo@ejemplo.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Contraseña</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                            </Button>

                            <div className="mt-6 space-y-3">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-border" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-card px-2 text-muted-foreground">
                                            Cuenta de prueba
                                        </span>
                                    </div>
                                </div>

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={handleDemoLogin}
                                >
                                    Usar cuenta demo
                                </Button>

                                <div className="text-xs text-muted-foreground text-center space-y-1">
                                    <p><strong>Email:</strong> test@example.com</p>
                                    <p><strong>Contraseña:</strong> 123456</p>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default LoginForm;