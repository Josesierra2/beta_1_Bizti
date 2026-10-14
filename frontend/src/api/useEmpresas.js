import { useState, useEffect } from 'react';
import { empresasApi } from './empresasApi';
import { DEMO_EMPRESAS } from './empresasDemo';

export function useEmpresas() {
    const [empresas, setEmpresas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadEmpresas = async () => {
        setLoading(true);
        try {
            const data = await empresasApi.getAll();
            setEmpresas(data);
            setError(null);
        } catch (err) {
            setError(err.message);
            setEmpresas(DEMO_EMPRESAS);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEmpresas();
    }, []);

    const createEmpresa = async (nuevaEmpresa) => {
        const creada = await empresasApi.create(nuevaEmpresa);
        setEmpresas(prev => [...prev, creada]);
        return creada;
    };

    const updateEmpresa = async (id, datosActualizados) => {
        const actualizada = await empresasApi.update(id, datosActualizados);
        setEmpresas(prev => prev.map(e => e.id === id ? { ...e, ...actualizada } : e));
        return actualizada;
    };

    const deleteEmpresa = async (id) => {
        await empresasApi.delete(id);
        setEmpresas(prev => prev.filter(e => e.id !== id));
    };

    return {
        empresas,
        loading,
        error,
        reload: loadEmpresas,
        createEmpresa,
        updateEmpresa,
        deleteEmpresa
    };
}