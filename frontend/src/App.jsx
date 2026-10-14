import React, { useState } from 'react';
import RetosDashboard from './pages/RetosDashboard.jsx';
import { EmpresasDashboard } from './pages/EmpresasDashboard.jsx';

export default function App() {
    const [currentView, setCurrentView] = useState('empresas');

    return (
        <div className="bz-app-container">
            <header className="bz-navbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', background: '#111827', borderBottom: '1px solid #374151', marginBottom: '1.5rem' }}>
                <div className="bz-brand">
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>BizTi - Plataforma de Gestión</h1>
                </div>
                <nav style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={() => setCurrentView('empresas')}
                        className={`bz-btn ${currentView === 'empresas' ? 'bz-btn-primary' : 'bz-btn-secondary'}`}
                        style={{ padding: '0.5rem 1rem', borderRadius: '0.375rem', cursor: 'pointer', fontWeight: '500' }}
                    >
                        Módulo Empresas
                    </button>
                    <button
                        onClick={() => setCurrentView('retos')}
                        className={`bz-btn ${currentView === 'retos' ? 'bz-btn-primary' : 'bz-btn-secondary'}`}
                        style={{ padding: '0.5rem 1rem', borderRadius: '0.375rem', cursor: 'pointer', fontWeight: '500' }}
                    >
                        Módulo Retos
                    </button>
                </nav>
            </header>

            <main className="bz-main-content" style={{ padding: '0 2rem 2rem 2rem' }}>
                {currentView === 'empresas' ? <EmpresasDashboard /> : <RetosDashboard />}
            </main>
        </div>
    );
}