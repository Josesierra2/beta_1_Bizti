import React, { useState } from 'react';
import { useEmpresas } from '../api/useEmpresas';
import { calculateKPIs, formatCurrency } from '../utils/empresas';
import { EmpresaTable } from '../components/empresas/EmpresaTable';
import { EmpresaForm } from '../components/empresas/EmpresaForm';

export function EmpresasDashboard() {
    const { empresas, loading, error, createEmpresa, updateEmpresa, deleteEmpresa } = useEmpresas();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [empresaToEdit, setEmpresaToEdit] = useState(null);

    const kpis = calculateKPIs(empresas);

    const handleOpenCreate = () => {
        setEmpresaToEdit(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (empresa) => {
        setEmpresaToEdit(empresa);
        setIsModalOpen(true);
    };

    const handleSubmit = async (data) => {
        if (empresaToEdit) {
            await updateEmpresa(empresaToEdit.id, data);
        } else {
            await createEmpresa(data);
        }
        setIsModalOpen(false);
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center', color: '#fff' }}>Cargando módulo de Empresas...</div>;

    return (
        <div className="bz-dashboard">
            <div className="bz-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Gestión de Empresas e Iniciativas</h2>
                    <p style={{ color: '#9ca3af', margin: '0.25rem 0 0 0' }}>Módulo de control presupuestal y seguimiento sectorial.</p>
                </div>
                <button
                    onClick={handleOpenCreate}
                    style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontWeight: '500', cursor: 'pointer' }}
                >
                    + Nueva Empresa
                </button>
            </div>

            <div className="bz-kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ background: '#111827', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #1f2937' }}>
                    <h4 style={{ color: '#9ca3af', margin: 0, fontSize: '0.875rem' }}>Total Empresas</h4>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.5rem 0 0 0' }}>{kpis.totalEmpresas}</p>
                </div>
                <div style={{ background: '#111827', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #1f2937' }}>
                    <h4 style={{ color: '#9ca3af', margin: 0, fontSize: '0.875rem' }}>Presupuesto Global</h4>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.5rem 0 0 0' }}>{formatCurrency(kpis.presupuestoGlobal)}</p>
                </div>
                <div style={{ background: '#111827', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #1f2937' }}>
                    <h4 style={{ color: '#9ca3af', margin: 0, fontSize: '0.875rem' }}>Promedio por Empresa</h4>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.5rem 0 0 0' }}>{formatCurrency(kpis.promedioPresupuesto)}</p>
                </div>
                <div style={{ background: '#111827', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #1f2937' }}>
                    <h4 style={{ color: '#9ca3af', margin: 0, fontSize: '0.875rem' }}>Empresas Activas</h4>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.5rem 0 0 0' }}>{kpis.activas}</p>
                </div>
            </div>

            <EmpresaTable
                empresas={empresas}
                onEdit={handleOpenEdit}
                onDelete={deleteEmpresa}
            />

            <EmpresaForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                empresaToEdit={empresaToEdit}
            />
        </div>
    );
}