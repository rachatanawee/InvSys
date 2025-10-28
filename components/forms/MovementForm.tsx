import React, { useState, useEffect, useRef } from 'react';
import { MovementType, Product, Location } from '../../types';
import { useInventory } from '../../hooks/useInventory';
import { Button } from '../ui/Button';
import { useTranslation } from '../../hooks/useTranslation';

interface MovementFormProps {
    type: MovementType;
    onClose: () => void;
}

const MovementForm: React.FC<MovementFormProps> = ({ type, onClose }) => {
    const { products, locations, addMovement, isAddingMovement, addMovementError } = useInventory();
    const { t } = useTranslation();
    const [productId, setProductId] = useState<string>('');
    const [productSearch, setProductSearch] = useState<string>('');
    const [showProductDropdown, setShowProductDropdown] = useState<boolean>(false);
    const [quantity, setQuantity] = useState<number>(1);
    const [fromLocationId, setFromLocationId] = useState<string>('');
    const [toLocationId, setToLocationId] = useState<string>('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowProductDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const titleMap: { [key in MovementType]: string } = {
        [MovementType.RECEIVE]: t('movementForm.titleReceive'),
        [MovementType.TRANSFER]: t('movementForm.titleTransfer'),
        [MovementType.SHIP]: t('movementForm.titleShip'),
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const movementData = {
            type,
            productId,
            quantity: Number(quantity),
            fromLocationId: type !== MovementType.RECEIVE ? fromLocationId : undefined,
            toLocationId: type !== MovementType.SHIP ? toLocationId : undefined,
        };
        
        if (!movementData.productId || movementData.quantity <= 0) {
            alert(t('movementForm.validationError'));
            return;
        }

        setShowProductDropdown(false);

        addMovement(movementData, {
            onSuccess: () => {
                onClose();
            },
        });
    };

    const filteredProducts = products?.filter(p => 
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.sku.toLowerCase().includes(productSearch.toLowerCase())
    ) || [];

    const selectedProduct = products?.find(p => p.id === productId);

    const handleProductSelect = (product: Product) => {
        setProductId(product.id);
        setProductSearch(`${product.name} (${product.sku})`);
        setShowProductDropdown(false);
    };

    const renderProductSelector = () => (
        <div className="relative" ref={dropdownRef}>
            <label htmlFor="product" className="block text-sm font-medium text-dark-muted-foreground mb-1">{t('movementForm.productLabel')}</label>
            <input
                id="product"
                type="text"
                value={productSearch}
                onChange={(e) => {
                    setProductSearch(e.target.value);
                    setProductId('');
                    setShowProductDropdown(true);
                }}
                onFocus={() => setShowProductDropdown(true)}
                placeholder={t('movementForm.productPlaceholder')}
                className="w-full h-10 px-3 py-2 bg-dark-background border border-dark-border rounded-md"
                required
            />
            {showProductDropdown && filteredProducts.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-dark-background border border-dark-border rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            onClick={() => handleProductSelect(product)}
                            className="px-3 py-2 hover:bg-dark-muted cursor-pointer text-sm"
                        >
                            {product.name} ({product.sku}) - Qty: {product.quantity}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
    
    const renderLocationSelector = (id: string, value: string, onChange: (val: string) => void, label: string) => (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-dark-muted-foreground mb-1">{label}</label>
            <select
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full h-10 px-3 py-2 bg-dark-background border border-dark-border rounded-md"
                required
            >
                <option value="">{t('movementForm.locationPlaceholder')}</option>
                {locations?.map((l: Location) => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
            <div className="bg-dark-card border border-dark-border rounded-lg shadow-xl w-full max-w-md m-4">
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <h2 className="text-xl font-semibold">{titleMap[type]}</h2>
                        <p className="text-sm text-dark-muted-foreground mt-1">{t('movementForm.description')}</p>
                    </div>
                    <div className="p-6 pt-0 space-y-4">
                        {renderProductSelector()}
                        <div>
                            <label htmlFor="quantity" className="block text-sm font-medium text-dark-muted-foreground mb-1">{t('movementForm.quantityLabel')}</label>
                            <input
                                id="quantity"
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10)))}
                                min="1"
                                className="w-full h-10 px-3 py-2 bg-dark-background border border-dark-border rounded-md"
                                required
                            />
                        </div>
                        {type !== MovementType.RECEIVE && renderLocationSelector('fromLocation', fromLocationId, setFromLocationId, t('movementForm.fromLocationLabel'))}
                        {type !== MovementType.SHIP && renderLocationSelector('toLocation', toLocationId, setToLocationId, t('movementForm.toLocationLabel'))}
                        {addMovementError && <p className="text-sm text-red-500">{addMovementError.message}</p>}
                    </div>
                    <div className="px-6 py-4 bg-dark-muted/50 flex justify-end gap-2 rounded-b-lg">
                        <Button type="button" variant="secondary" onClick={onClose} disabled={isAddingMovement}>{t('movementForm.cancelButton')}</Button>
                        <Button type="submit" disabled={isAddingMovement}>{isAddingMovement ? t('movementForm.submittingButton') : t('movementForm.submitButton')}</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MovementForm;