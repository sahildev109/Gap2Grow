import React from 'react';
import Sidebar from './Sidebar';
import './MainLayout.css';

const MainLayout = ({ children }) => {
    return (
        <div className="main-layout">
            <Sidebar />
            <div className="layout-content">
                <main className="layout-main">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
