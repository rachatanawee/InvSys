import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, PackageIcon, ArrowRightLeftIcon } from '../ui/Icons';
import { cnLite } from '../../lib/utils';
import { useTranslation } from '../../hooks/useTranslation';

const Sidebar = () => {
    const { t } = useTranslation();
    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
        cnLite(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-dark-muted-foreground transition-all hover:text-dark-primary",
            isActive && "bg-dark-muted text-dark-primary"
        );

    return (
        <div className="hidden border-r border-dark-border bg-dark-muted/40 md:block">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-14 items-center border-b border-dark-border px-4 lg:h-[60px] lg:px-6">
                    <a href="/" className="flex items-center gap-2 font-semibold">
                        <PackageIcon className="h-6 w-6" />
                        <span className="">InvSys</span>
                    </a>
                </div>
                <div className="flex-1">
                    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                        <NavLink to="/dashboard" className={navLinkClasses}>
                            <HomeIcon className="h-4 w-4" />
                            {t('sidebar.dashboard')}
                        </NavLink>
                        <NavLink to="/products" className={navLinkClasses}>
                            <PackageIcon className="h-4 w-4" />
                            {t('sidebar.products')}
                        </NavLink>
                        <NavLink to="/movements" className={navLinkClasses}>
                            <ArrowRightLeftIcon className="h-4 w-4" />
                            {t('sidebar.movements')}
                        </NavLink>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;