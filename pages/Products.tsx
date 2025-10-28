import React, { useMemo, useState, useCallback } from 'react';
import { useInventory } from '../hooks/useInventory';
import { Product } from '../types';
import { DataTable } from '../components/DataTable';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useTranslation } from '../hooks/useTranslation';
import { createColumnHelper, ColumnDef } from '@tanstack/react-table';

const Products = () => {
    const { products, locations, isLoadingProducts, isLoadingLocations, updateProduct, createProduct } = useInventory();
    const { t } = useTranslation();
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const [formData, setFormData] = useState({ name: '', sku: '', quantity: 0, locationId: '' });

    const locationMap = useMemo(() => {
        const map = new Map<string, string>();
        locations?.forEach(loc => map.set(loc.id, loc.name));
        return map;
    }, [locations]);

    const handleEdit = useCallback((product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            sku: product.sku,
            quantity: product.quantity,
            locationId: product.locationId
        });
    }, []);

    const handleAdd = () => {
        setIsAddingProduct(true);
        setFormData({ name: '', sku: '', quantity: 0, locationId: locations?.[0]?.id || '' });
    };

    const handleSave = async () => {
        if (editingProduct) {
            updateProduct({ id: editingProduct.id, updates: formData });
            setEditingProduct(null);
        } else if (isAddingProduct) {
            createProduct(formData);
            setIsAddingProduct(false);
        }
        setFormData({ name: '', sku: '', quantity: 0, locationId: '' });
    };

    const handleCancel = () => {
        setEditingProduct(null);
        setIsAddingProduct(false);
        setFormData({ name: '', sku: '', quantity: 0, locationId: '' });
    };

    const generateSKU = (name: string) => {
        return name
            .toUpperCase()
            .replace(/[^A-Z0-9\s]/g, '')
            .split(' ')
            .filter(word => word.length > 0)
            .map(word => word.substring(0, 3))
            .join('-') + '-' + String(Date.now()).slice(-3);
    };

    const handleGenerateSKU = () => {
        const newSKU = generateSKU(formData.name);
        setFormData({...formData, sku: newSKU});
    };

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
            {
                id: 'actions',
                header: 'Actions',
                cell: ({ row }) => (
                    <Button
                        onClick={() => handleEdit(row.original)}
                        className="px-3 py-1 text-sm"
                    >
                        Edit
                    </Button>
                ),
            },
        ];
    }, [locationMap, t, handleEdit]);

    if (isLoadingProducts || isLoadingLocations) {
        return <div>{t('products.loading')}</div>;
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>{t('products.title')}</CardTitle>
                            <CardDescription>{t('products.description')}</CardDescription>
                        </div>
                        <Button onClick={handleAdd} className="bg-green-500 hover:bg-green-600">
                            Add Product
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <DataTable columns={columns} data={products || []} />
                </CardContent>
            </Card>

            {(editingProduct || isAddingProduct) && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96 max-w-md text-black">
                        <h3 className="text-lg font-semibold mb-4 text-black">
                            {editingProduct ? 'Edit Product' : 'Add New Product'}
                        </h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-black">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-md text-black bg-white"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-1 text-black">SKU</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={formData.sku}
                                        onChange={(e) => setFormData({...formData, sku: e.target.value})}
                                        className="flex-1 px-3 py-2 border rounded-md text-black bg-white"
                                    />
                                    <Button
                                        onClick={handleGenerateSKU}
                                        className="px-3 py-2 text-sm bg-blue-500 hover:bg-blue-600"
                                        disabled={!formData.name}
                                    >
                                        Generate
                                    </Button>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-1 text-black">Quantity</label>
                                <input
                                    type="number"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                                    className="w-full px-3 py-2 border rounded-md text-black bg-white"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-1 text-black">Location</label>
                                <select
                                    value={formData.locationId}
                                    onChange={(e) => setFormData({...formData, locationId: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-md text-black bg-white"
                                >
                                    {locations?.map(loc => (
                                        <option key={loc.id} value={loc.id}>{loc.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        
                        <div className="flex gap-2 mt-6">
                            <Button onClick={handleSave} className="flex-1">Save</Button>
                            <Button onClick={handleCancel} className="flex-1 bg-gray-500">Cancel</Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Products;