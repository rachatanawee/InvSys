import React, { useMemo } from 'react';
import { useInventory } from '../hooks/useInventory';
import { InventoryMovement } from '../types';
import { DataTable } from '../components/DataTable';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { useTranslation } from '../hooks/useTranslation';
// Fix: Import React Table utilities from the library instead of window object.
// Fix: Import ColumnDef to correctly type the columns array for DataTable.
import { createColumnHelper, ColumnDef } from '@tanstack/react-table';

const Movements = () => {
    const { movements, products, locations, isLoadingMovements, isLoadingProducts, isLoadingLocations } = useInventory();
    const { t } = useTranslation();

    const productMap = useMemo(() => {
        const map = new Map<string, string>();
        products?.forEach(p => map.set(p.id, p.name));
        return map;
    }, [products]);

    const locationMap = useMemo(() => {
        const map = new Map<string, string>();
        locations?.forEach(loc => map.set(loc.id, loc.name));
        return map;
    }, [locations]);

    // Fix: Explicitly type columns as ColumnDef<InventoryMovement>[] to allow for mixed data types in cells.
    const columns: ColumnDef<InventoryMovement>[] = useMemo(() => {
        const columnHelper = createColumnHelper<InventoryMovement>();
        return [
            columnHelper.accessor('timestamp', {
                header: t('movements.columns.date'),
                cell: info => new Date(info.getValue()).toLocaleString(),
            }),
            columnHelper.accessor('productId', {
                header: t('movements.columns.product'),
                cell: info => productMap.get(info.getValue()) || t('movements.unknownProduct'),
            }),
            columnHelper.accessor('type', {
                header: t('movements.columns.type'),
                cell: info => {
                    const type = info.getValue();
                    const colors: {[key: string]: string} = {
                        'RECEIVE': 'bg-green-500/20 text-green-400',
                        'TRANSFER': 'bg-blue-500/20 text-blue-400',
                        'SHIP': 'bg-yellow-500/20 text-yellow-400',
                    }
                    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[type]}`}>{t(`movements.types.${type}`)}</span>;
                },
            }),
            columnHelper.accessor('quantity', {
                header: t('movements.columns.quantity'),
                cell: info => <div className="text-right">{info.getValue().toLocaleString()}</div>,
            }),
            columnHelper.accessor('fromLocationId', {
                header: t('movements.columns.from'),
                cell: info => info.getValue() ? (locationMap.get(info.getValue() as string) || t('movements.na')) : t('movements.na'),
            }),
            columnHelper.accessor('toLocationId', {
                header: t('movements.columns.to'),
                cell: info => info.getValue() ? (locationMap.get(info.getValue() as string) || t('movements.na')) : t('movements.na'),
            }),
        ];
    }, [productMap, locationMap, t]);
    
    if (isLoadingMovements || isLoadingProducts || isLoadingLocations) {
        return <div>{t('movements.loading')}</div>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('movements.title')}</CardTitle>
                <CardDescription>{t('movements.description')}</CardDescription>
            </CardHeader>
            <CardContent>
                <DataTable columns={columns} data={movements || []} />
            </CardContent>
        </Card>
    );
};

export default Movements;