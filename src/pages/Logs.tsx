import React, { useEffect, useState } from 'react';
import { History, Loader2, Search, Filter, AlertCircle, Info, CheckCircle } from 'lucide-react';
import api from '../lib/api';
import ReadOnlyBanner from '../components/ReadOnlyBanner';

const Logs = () => {
    const [logs, setLogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [businessId] = useState(localStorage.getItem('businessId'));

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!businessId) return;
                const response = await api.get('/license/logs', {
                    headers: { 'x-business-id': businessId }
                });
                if (response.data.success) {
                    setLogs(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching logs data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [businessId]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    const getActionIcon = (action: string) => {
        switch (action) {
            case 'UPDATE_LICENSE': return <Info className="w-4 h-4 text-blue-500" />;
            case 'ACTIVATE': return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'SUSPEND': return <AlertCircle className="w-4 h-4 text-red-500" />;
            default: return <History className="w-4 h-4 text-slate-500" />;
        }
    };

    return (
        <div className="space-y-8">
            <ReadOnlyBanner />

            <div>
                <h1 className="text-2xl font-bold text-white">Registros de Auditoría</h1>
                <p className="text-slate-400">Historial de acciones y cambios en el sistema.</p>
            </div>

            <div className="bg-[#1e293b] rounded-2xl border border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-900/50 border-b border-slate-800">
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Fecha / Hora</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Acción</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Detalles</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="p-8 text-center text-slate-500 text-sm">No hay registros de auditoría</td>
                                </tr>
                            ) : (
                                logs.map(log => (
                                    <tr key={log.id} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                                        <td className="p-4 text-sm text-slate-400">
                                            {new Date(log.timestamp).toLocaleString()}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                {getActionIcon(log.action)}
                                                <span className="text-xs font-bold text-white uppercase tracking-wider">{log.action}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-slate-300">
                                            {log.details ? (
                                                <pre className="text-[10px] font-mono bg-slate-900/50 p-2 rounded border border-slate-800 overflow-x-auto max-w-md">
                                                    {JSON.stringify(JSON.parse(log.details), null, 2)}
                                                </pre>
                                            ) : (
                                                'Sin detalles adicionales'
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Logs;
