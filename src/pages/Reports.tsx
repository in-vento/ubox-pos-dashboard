import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, Download, Loader2 } from 'lucide-react';
import api from '../lib/api';

const Reports = () => {
    const [data, setData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchReportData();
    }, []);

    const fetchReportData = async () => {
        try {
            const businessId = localStorage.getItem('businessId');
            if (!businessId) return;

            // For now, we'll use the orders endpoint and aggregate locally
            // In a real app, you'd want a dedicated /reports endpoint
            const response = await api.get('/orders', {
                headers: { 'x-business-id': businessId }
            });

            if (response.data.success) {
                // Aggregate orders by date
                const orders = response.data.data;
                const salesByDate: Record<string, number> = {};
                
                orders.forEach((order: any) => {
                    const date = new Date(order.createdAt).toLocaleDateString('es-ES', { weekday: 'short' });
                    salesByDate[date] = (salesByDate[date] || 0) + Number(order.total);
                });

                const chartData = Object.keys(salesByDate).map(date => ({
                    name: date,
                    ventas: salesByDate[date]
                }));

                setData(chartData);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Reportes</h1>
                    <p className="text-slate-400">Análisis detallado del rendimiento de tu negocio.</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#1e293b] border border-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors">
                        <Calendar className="w-4 h-4" />
                        Últimos 7 días
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">
                        <Download className="w-4 h-4" />
                        Exportar
                    </button>
                </div>
            </div>

            <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800">
                <h3 className="text-lg font-bold text-white mb-6">Ventas por Día</h3>
                <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis dataKey="name" stroke="#94a3b8" axisLine={false} tickLine={false} />
                            <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
                                cursor={{ fill: '#334155', opacity: 0.2 }}
                            />
                            <Bar dataKey="ventas" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Reports;