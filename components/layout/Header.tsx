import React from 'react';
import { Button } from '../ui/Button';
import { PlusCircleIcon } from '../ui/Icons';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';

interface HeaderProps {
    onReceiveClick: () => void;
    onTransferClick: () => void;
    onShipClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onReceiveClick, onTransferClick, onShipClick }) => {
    const { user, logout } = useAuth();
    const { t, setLocale, locale } = useTranslation();
    
    return (
        <header className="flex h-14 items-center gap-4 border-b border-dark-border bg-dark-muted/40 px-4 lg:h-[60px] lg:px-6">
            <div className="w-full flex-1">
                {/* Can add a search bar or other elements here later */}
            </div>
            <div className="flex items-center gap-4">
                <Button variant="secondary" size="sm" onClick={onReceiveClick}>
                    <PlusCircleIcon className="h-4 w-4 mr-2" />
                    {t('header.receive')}
                </Button>
                <Button variant="secondary" size="sm" onClick={onTransferClick}>
                    {t('header.transfer')}
                </Button>
                <Button variant="secondary" size="sm" onClick={onShipClick}>
                    {t('header.ship')}
                </Button>
                <div className="flex items-center gap-2">
                    <select
                        value={locale}
                        onChange={(e) => setLocale(e.target.value)}
                        className="h-9 px-2 bg-dark-background border border-dark-border rounded-md text-sm"
                    >
                        <option value="en">EN</option>
                        <option value="th">TH</option>
                        <option value="jp">JP</option>
                    </select>
                </div>
                {user && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-dark-muted-foreground hidden md:inline-block">
                            {user.email}
                        </span>
                        <Button variant="ghost" size="sm" onClick={logout}>
                             {t('header.logout')}
                        </Button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;