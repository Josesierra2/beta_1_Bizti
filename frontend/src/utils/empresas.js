export function calculateKPIs(empresas = []) {
    const totalEmpresas = empresas.length;
    const presupuestoGlobal = empresas.reduce((sum, e) => sum + (Number(e.presupuesto) || 0), 0);
    const promedioPresupuesto = totalEmpresas > 0 ? presupuestoGlobal / totalEmpresas : 0;
    const activas = empresas.filter(e => e.estado === 'ACTIVA').length;

    return {
        totalEmpresas,
        presupuestoGlobal,
        promedioPresupuesto,
        activas
    };
}

export function formatCurrency(value) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
    }).format(value || 0);
}