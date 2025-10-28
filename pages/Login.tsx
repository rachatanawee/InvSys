import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Navigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { PackageIcon } from '../components/ui/Icons';
import { useTranslation } from '../hooks/useTranslation';

const Login = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('demo@user.com');
    const [password, setPassword] = useState('password123');
    const [rememberMe, setRememberMe] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const { signIn, user } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            await signIn(email, password, rememberMe);
            navigate('/dashboard');
        } catch (err: any) {
             const errorMessage = err.message || 'An unexpected error occurred.';
             if (errorMessage.includes('Invalid credentials')) {
                setError(t('login.errorInvalidCredentials'));
             } else if (errorMessage.includes('Account locked')) {
                setError(t('login.errorAccountLocked'));
             } else {
                setError(t('login.errorUnexpected'));
             }
        } finally {
            setIsLoading(false);
        }
    };
    
    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-dark-background">
            <div className="w-full max-w-md p-8 space-y-6 bg-dark-card rounded-lg shadow-lg border border-dark-border">
                <div className="text-center">
                    <div className="inline-block p-3 bg-dark-muted rounded-full">
                       <PackageIcon className="w-8 h-8 mx-auto text-dark-primary" />
                    </div>
                    <h1 className="mt-4 text-3xl font-bold text-dark-foreground">
                        {t('login.welcome')}
                    </h1>
                    <p className="mt-2 text-sm text-dark-muted-foreground">
                        {t('login.signInPrompt')}
                    </p>
                </div>
                <form className="space-y-4" onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-dark-muted-foreground">
                            {t('login.emailLabel')}
                        </label>
                        <div className="mt-1">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 text-dark-foreground bg-dark-background border border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-dark-primary"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-dark-muted-foreground">
                            {t('login.passwordLabel')}
                        </label>
                        <div className="mt-1">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 text-dark-foreground bg-dark-background border border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-dark-primary"
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="h-4 w-4 text-dark-primary bg-dark-background border-dark-border rounded focus:ring-dark-primary"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-dark-muted-foreground">
                                {t('login.rememberMe')}
                            </label>
                        </div>
                    </div>

                    {error && (
                        <div className="text-center text-sm text-red-500">
                            {error}
                        </div>
                    )}

                    <div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? t('login.signingIn') : t('login.signInButton')}
                        </Button>
                    </div>
                </form>
                 <div className="text-center text-xs text-dark-muted-foreground">
                    <p>ใช้ <span className="font-mono">demo@user.com</span> / <span className="font-mono">password123</span></p>
                </div>
            </div>
        </div>
    );
};

export default Login;