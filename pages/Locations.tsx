import React, { useMemo, useState, useCallback } from 'react';
import { useInventory } from '../hooks/useInventory';
import { Location } from '../types';
import { DataTable } from '../components/DataTable';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useTranslation } from '../hooks/useTranslation';
import { createColumnHelper, ColumnDef } from '@tanstack/react-table';

const Locations = () => {
    const { locations, isLoadingLocations, updateLocation, createLocation } = useInventory();
    const { t } = useTranslation();
    const [editingLocation, setEditingLocation] = useState<Location | null>(null);
    const [isAddingLocation, setIsAddingLocation] = useState(false);
    const [formData, setFormData] = useState({ name: '' });

    const handleEdit = useCallback((location: Location) => {
        setEditingLocation(location);
        setFormData({ name: location.name });
    }, []);

    const handleAdd = () => {
        setIsAddingLocation(true);
        setFormData({ name: '' });
    };

    const handleSave = async () => {
        if (editingLocation) {
            updateLocation({ id: editingLocation.id, updates: formData });
            setEditingLocation(null);
        } else if (isAddingLocation) {
            createLocation(formData);
            setIsAddingLocation(false);
        }
        setFormData({ name: '' });
    };

    const handleCancel = () => {
        setEditingLocation(null);
        setIsAddingLocation(false);
        setFormData({ name: '' });
    };

    const columns: ColumnDef<Location>[] = useMemo(() => {
        const columnHelper = createColumnHelper<Location>();
        return [
            columnHelper.accessor('name', {
                header: 'Location Name',
                cell: info => info.getValue(),
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
    }, [handleEdit]);

    if (isLoadingLocations) {
        return <div>Loading locations...</div>;
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Locations</CardTitle>
                            <CardDescription>Manage warehouse and store locations</CardDescription>
                        </div>
                        <Button onClick={handleAdd} className="bg-green-500 hover:bg-green-600">
                            Add Location
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <DataTable columns={columns} data={locations || []} />
                </CardContent>
            </Card>

            {(editingLocation || isAddingLocation) && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96 max-w-md text-black">
                        <h3 className="text-lg font-semibold mb-4 text-black">
                            {editingLocation ? 'Edit Location' : 'Add New Location'}
                        </h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-black">Location Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({name: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-md text-black bg-white"
                                    placeholder="Enter location name"
                                />
                            </div>
                        </div>
                        
                        <div className="flex gap-2 mt-6">
                            <Button onClick={handleSave} className="flex-1" disabled={!formData.name}>
                                Save
                            </Button>
                            <Button onClick={handleCancel} className="flex-1 bg-gray-500">
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Locations;