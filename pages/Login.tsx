import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Navigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { PackageIcon } from '../components/ui/Icons';
import { useTranslation } from '../hooks/useTranslation';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig, loginRequest } from '../lib/azureConfig';

const Login = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('demo@user.com');
    const [password, setPassword] = useState('password123');
    const [rememberMe, setRememberMe] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const { signIn, user } = useAuth();
    const navigate = useNavigate();
    const [msalInstance] = useState(() => {
        const instance = new PublicClientApplication(msalConfig);
        instance.initialize();
        return instance;
    });

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

    const handleAzureLogin = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await msalInstance.initialize();
            const response = await msalInstance.loginPopup(loginRequest);
            
            if (response.account) {
                // Create user session with Azure AD account
                const azureEmail = response.account.username;
                console.log('Azure AD login successful:', azureEmail);
                
                // For demo: bypass password check for Azure AD users
                localStorage.setItem('azure_user', JSON.stringify({
                    email: azureEmail,
                    name: response.account.name,
                    provider: 'azure'
                }));
                
                navigate('/dashboard');
            }
        } catch (err: any) {
            console.error('Azure AD login error:', err);
            if (err.errorCode === 'user_cancelled') {
                setError('Login cancelled');
            } else if (err.errorCode === 'popup_window_error') {
                setError('Please allow popups for this site');
            } else {
                setError(`Azure AD login failed: ${err.message || 'Please check your configuration'}`);
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
                
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-dark-border"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-dark-card text-dark-muted-foreground">Or continue with</span>
                    </div>
                </div>

                <Button
                    type="button"
                    onClick={handleAzureLogin}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={isLoading}
                >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 23 23" fill="none">
                        <path d="M0 0h10.931v10.931H0z" fill="#f25022"/>
                        <path d="M12.069 0H23v10.931H12.069z" fill="#7fba00"/>
                        <path d="M0 12.069h10.931V23H0z" fill="#00a4ef"/>
                        <path d="M12.069 12.069H23V23H12.069z" fill="#ffb900"/>
                    </svg>
                    Sign in with Microsoft
                </Button>
                 <div className="text-center text-xs text-dark-muted-foreground">
                    <p>ใช้ <span className="font-mono">demo@user.com</span> / <span className="font-mono">password123</span></p>
                </div>
            </div>
        </div>
    );
};

export default Login;