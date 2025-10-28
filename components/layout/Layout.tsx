import React, { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { MovementType } from '../../types';
import MovementForm from '../forms/MovementForm';

const Layout = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<MovementType | null>(null);

    const handleOpenModal = useCallback((type: MovementType) => {
        setModalType(type);
        setIsModalOpen(true);
    }, []);
    
    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setModalType(null);
    }, []);

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] bg-background dark:bg-dark-background">
            <Sidebar />
            <div className="flex flex-col">
                <Header 
                    onReceiveClick={() => handleOpenModal(MovementType.RECEIVE)}
                    onTransferClick={() => handleOpenModal(MovementType.TRANSFER)}
                    onShipClick={() => handleOpenModal(MovementType.SHIP)}
                />
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                    <Outlet />
                </main>
            </div>
            {isModalOpen && modalType && (
                <MovementForm
                    type={modalType}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default Layout;