import React, { useState, useEffect } from 'react';

export function EmpresaForm({ isOpen, onClose, onSubmit, empresaToEdit }) {
    const [formData, setFormData] = useState({
        nit: '',
        nombre: '',
        sector: '',
        presupuesto: '',
        estado: 'ACTIVA',
        contacto: ''
    });

    useEffect(() => {
        if (empresaToEdit) {
            setFormData(empresaToEdit);
        } else {
            setFormData({
                nit: '',
                nombre: '',
                sector: '',
                presupuesto: '',
                estado: 'ACTIVA',
                contacto: ''
            });
        }
    }, [empresaToEdit, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'nombre' && value.length > 50) return;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    return (
        <div className="bz-modal-backdrop" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
            <div className="bz-modal" style={{ background: '#1f2937', padding: '2rem', borderRadius: '0.5rem', width: '400px', color: '#fff' }}>
                <h3 style={{ marginTop: 0 }}>{empresaToEdit ? 'Editar empresa' : 'Nueva empresa'}</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.25rem' }}>NIT *</label>
                        <input
                            type="text"
                            name="nit"
                            placeholder="Ej. 900123456-1"
                            value={formData.nit}
                            onChange={handleChange}
                            disabled={!!empresaToEdit}
                            required
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', background: '#111827', border: '1px solid #374151', color: '#fff' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.25rem' }}>Nombre de la empresa *</label>
                        <input
                            type="text"
                            name="nombre"
                            placeholder="Nombre corporativo"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', background: '#111827', border: '1px solid #374151', color: '#fff' }}
                        />
                        <span style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'block', textAlign: 'right', marginTop: '0.2rem' }}>
                            {formData.nombre.length}/50
                        </span>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.25rem' }}>Sector *</label>
                        <input
                            type="text"
                            name="sector"
                            placeholder="Ej. Tecnología, Agroindustria..."
                            value={formData.sector}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', background: '#111827', border: '1px solid #374151', color: '#fff' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.25rem' }}>Presupuesto (COP) *</label>
                        <input
                            type="number"
                            name="presupuesto"
                            placeholder="Ej. 45000000"
                            value={formData.presupuesto}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', background: '#111827', border: '1px solid #374151', color: '#fff' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.25rem' }}>Estado *</label>
                        <select
                            name="estado"
                            value={formData.estado}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', background: '#111827', border: '1px solid #374151', color: '#fff' }}
                        >
                            <option value="ACTIVA">ACTIVA</option>
                            <option value="INACTIVA">INACTIVA</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.25rem' }}>Teléfono de contacto</label>
                        <input
                            type="tel"
                            name="contacto"
                            placeholder="Ej. +57 300 123 4567"
                            value={formData.contacto}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', background: '#111827', border: '1px solid #374151', color: '#fff' }}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                        <button type="button" onClick={onClose} style={{ padding: '0.5rem 1rem', borderRadius: '0.25rem', background: '#374151', color: '#fff', border: 'none', cursor: 'pointer' }}>
                            Cancelar
                        </button>
                        <button type="submit" style={{ padding: '0.5rem 1rem', borderRadius: '0.25rem', background: '#3b82f6', color: '#fff', border: 'none', cursor: 'pointer' }}>
                            {empresaToEdit ? 'Guardar cambios' : 'Crear empresa'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}