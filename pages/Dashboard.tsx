import React from 'react';
import { useInventory } from '../hooks/useInventory';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { PackageIcon, ArrowRightLeftIcon } from '../components/ui/Icons';
import { useTranslation } from '../hooks/useTranslation';
// Fix: Import Recharts components from the library instead of window object.
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const { products, movements, locations, isLoadingProducts, isLoadingMovements, isLoadingLocations } = useInventory();
    const { t } = useTranslation();

    if (isLoadingProducts || isLoadingMovements || isLoadingLocations) {
        return <div>{t('dashboard.loading')}</div>;
    }

    const totalUnits = products?.reduce((sum, p) => sum + p.quantity, 0) || 0;
    const totalProducts = products?.length || 0;
    const totalLocations = locations?.length || 0;
    const totalMovements = movements?.length || 0;

    const chartData = products?.map(p => ({
        name: p.name.length > 15 ? `${p.name.substring(0, 12)}...` : p.name,
        quantity: p.quantity,
    })).sort((a, b) => b.quantity - a.quantity).slice(0, 10);

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-yellow-400">{t('dashboard.totalUnits')}</CardTitle>
                        <PackageIcon className="h-4 w-4 text-dark-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalUnits.toLocaleString()}</div>
                        <p className="text-xs text-dark-muted-foreground">{t('dashboard.totalUnitsDesc', { count: totalProducts })}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-blue-400">{t('dashboard.productSKUs')}</CardTitle>
                         <PackageIcon className="h-4 w-4 text-dark-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalProducts}</div>
                        <p className="text-xs text-dark-muted-foreground">{t('dashboard.productSKUsDesc')}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('dashboard.locations')}</CardTitle>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-dark-muted-foreground"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalLocations}</div>
                        <p className="text-xs text-dark-muted-foreground">{t('dashboard.locationsDesc')}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('dashboard.totalMovements')}</CardTitle>
                        <ArrowRightLeftIcon className="h-4 w-4 text-dark-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalMovements}</div>
                        <p className="text-xs text-dark-muted-foreground">{t('dashboard.totalMovementsDesc')}</p>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>{t('dashboard.chartTitle')}</CardTitle>
                    <CardDescription>{t('dashboard.chartDesc')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                             <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ 
                                        backgroundColor: 'hsl(var(--background))', 
                                        border: '1px solid hsl(var(--border))'
                                    }}
                                />
                                <Legend />
                                <Bar dataKey="quantity" fill="#f97316" radius={[4, 4, 0, 0]} name={t('dashboard.chartLegend')} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Dashboard;