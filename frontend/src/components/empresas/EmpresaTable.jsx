import React, { useState } from 'react';

export function EmpresaTable({ empresas, onEdit, onDelete }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('TODOS');

    const filteredEmpresas = empresas.filter(empresa => {
        const matchesSearch = empresa.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              empresa.nit.includes(searchTerm);
        const matchesStatus = statusFilter === 'TODOS' || empresa.estado === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="bz-table-container">
            <div className="bz-table-filters" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <input
                    type="text"
                    placeholder="Buscar por nombre o NIT..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bz-input"
                    style={{ padding: '0.5rem', borderRadius: '0.375rem', background: '#1f2937', color: '#fff', border: '1px solid #374151' }}
                />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bz-select"
                    style={{ padding: '0.5rem', borderRadius: '0.375rem', background: '#1f2937', color: '#fff', border: '1px solid #374151' }}
                >
                    <option value="TODOS">Todos los estados</option>
                    <option value="ACTIVA">ACTIVA</option>
                    <option value="INACTIVA">INACTIVA</option>
                </select>
            </div>

            <table className="bz-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid #374151', color: '#9ca3af' }}>
                        <th style={{ padding: '0.75rem' }}>NIT</th>
                        <th style={{ padding: '0.75rem' }}>NOMBRE</th>
                        <th style={{ padding: '0.75rem' }}>SECTOR</th>
                        <th style={{ padding: '0.75rem' }}>PRESUPUESTO</th>
                        <th style={{ padding: '0.75rem' }}>ESTADO</th>
                        <th style={{ padding: '0.75rem' }}>CONTACTO</th>
                        <th style={{ padding: '0.75rem' }}>ACCIONES</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredEmpresas.map((empresa) => (
                        <tr key={empresa.id} style={{ borderBottom: '1px solid #1f2937' }}>
                            <td style={{ padding: '0.75rem' }}>{empresa.nit}</td>
                            <td style={{ padding: '0.75rem' }}>{empresa.nombre}</td>
                            <td style={{ padding: '0.75rem' }}>{empresa.sector}</td>
                            <td style={{ padding: '0.75rem' }}>${empresa.presupuesto.toLocaleString('es-CO')}</td>
                            <td style={{ padding: '0.75rem' }}>
                                <span className={`bz-badge ${empresa.estado === 'ACTIVA' ? 'bz-badge-success' : 'bz-badge-secondary'}`}>
                                    {empresa.estado}
                                </span>
                            </td>
                            <td style={{ padding: '0.75rem' }}>{empresa.contacto}</td>
                            <td style={{ padding: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                                <button
                                    onClick={() => onEdit(empresa)}
                                    style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', cursor: 'pointer' }}
                                >
                                    ✏️
                                </button>
                                <button
                                    onClick={() => onDelete(empresa.id)}
                                    style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', cursor: 'pointer' }}
                                >
                                    🗑️
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}