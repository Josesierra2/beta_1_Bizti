import { DEMO_EMPRESAS } from './empresasDemo';

const API_BASE_URL = 'http://localhost:8080/api/empresas';

export const empresasApi = {
    async getAll() {
        try {
            const response = await fetch(API_BASE_URL);
            if (!response.ok) throw new Error('Error al conectar con la API');
            return await response.json();
        } catch (error) {
            console.warn('Backend no disponible, usando datos de prueba DEMO:', error);
            return DEMO_EMPRESAS;
        }
    },

    async create(empresaData) {
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(empresaData)
            });
            if (!response.ok) throw new Error('Error al crear la empresa');
            return await response.json();
        } catch (error) {
            console.warn('Modo DEMO: simulando creación de empresa');
            return { id: Date.now(), ...empresaData };
        }
    },

    async update(id, empresaData) {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(empresaData)
            });
            if (!response.ok) throw new Error('Error al actualizar la empresa');
            return await response.json();
        } catch (error) {
            console.warn('Modo DEMO: simulando actualización de empresa');
            return { id, ...empresaData };
        }
    },

    async delete(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Error al eliminar la empresa');
            return true;
        } catch (error) {
            console.warn('Modo DEMO: simulando eliminación de empresa');
            return true;
        }
    }
};