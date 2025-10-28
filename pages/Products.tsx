import React, { useMemo } from 'react';
import { useInventory } from '../hooks/useInventory';
import { Product } from '../types';
import { DataTable } from '../components/DataTable';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { useTranslation } from '../hooks/useTranslation';
// Fix: Import React Table utilities from the library instead of window object.
// Fix: Import ColumnDef to correctly type the columns array for DataTable.
import { createColumnHelper, ColumnDef } from '@tanstack/react-table';

const Products = () => {
    const { products, locations, isLoadingProducts, isLoadingLocations } = useInventory();
    const { t } = useTranslation();

    const locationMap = useMemo(() => {
        const map = new Map<string, string>();
        locations?.forEach(loc => map.set(loc.id, loc.name));
        return map;
    }, [locations]);

    // Fix: Explicitly type columns as ColumnDef<Product>[] to allow for mixed data types in cells.
    const columns: ColumnDef<Product>[] = useMemo(() => {
        const columnHelper = createColumnHelper<Product>();
        return [
            columnHelper.accessor('name', {
                header: t('products.columns.name'),
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('sku', {
                header: t('products.columns.sku'),
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('quantity', {
                header: t('products.columns.quantity'),
                cell: info => <div className="text-right">{info.getValue().toLocaleString()}</div>,
            }),
            columnHelper.accessor('locationId', {
                header: t('products.columns.location'),
                cell: info => locationMap.get(info.getValue()) || t('products.unknownLocation'),
            }),
        ];
    }, [locationMap, t]);

    if (isLoadingProducts || isLoadingLocations) {
        return <div>{t('products.loading')}</div>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('products.title')}</CardTitle>
                <CardDescription>{t('products.description')}</CardDescription>
            </CardHeader>
            <CardContent>
                <DataTable columns={columns} data={products || []} />
            </CardContent>
        </Card>
    );
};

export default Products;