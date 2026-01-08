import React, { useEffect, useState } from 'react';
import { ShoppingBag, Loader2, Search, Filter } from 'lucide-react';
import api from '../lib/api';
import ReadOnlyBanner from '../components/ReadOnlyBanner';

type Order = {
    id: string;
    total: number;
    status: string;
    createdAt: string;
    items: any[];
    payments: any[];
};

const Orders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const businessId = localStorage.getItem('businessId');
            if (!businessId) return;

            const response = await api.get('/orders', {
                headers: { 'x-business-id': businessId }
            });

            if (response.data.success) {
                setOrders(response.data.data);
            }
        } catch (err: any) {
            setError('Error al cargar pedidos');
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
            <ReadOnlyBanner />

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Pedidos</h1>
                    <p className="text-slate-400">Gestiona y visualiza todas las transacciones.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4 bg-[#1e293b] p-4 rounded-xl border border-slate-800">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Buscar por ID o cliente..."
                        className="w-full bg-[#0f172a] border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#0f172a] border border-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors">
                    <Filter className="w-5 h-5" />
                    Filtros
                </button>
            </div>

            {/* Orders List */}
            <div className="bg-[#1e293b] rounded-xl border border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-800 bg-slate-900/50">
                                <th className="p-4 text-sm font-medium text-slate-400">ID Pedido</th>
                                <th className="p-4 text-sm font-medium text-slate-400">Fecha</th>
                                <th className="p-4 text-sm font-medium text-slate-400">Cliente</th>
                                <th className="p-4 text-sm font-medium text-slate-400">Estado</th>
                                <th className="p-4 text-sm font-medium text-slate-400">Total</th>
                                <th className="p-4 text-sm font-medium text-slate-400">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-500">
                                        No hay pedidos registrados aún.
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                                        <td className="p-4 font-mono text-sm text-white">#{order.id.slice(0, 8)}</td>
                                        <td className="p-4 text-sm text-slate-300">
                                            {new Date(order.createdAt).toLocaleString()}
                                        </td>
                                        <td className="p-4 text-sm text-white">Cliente General</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === 'COMPLETED'
                                                    ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                                                    : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                                                }`}>
                                                {order.status === 'COMPLETED' ? 'Completado' : order.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm font-bold text-white">
                                            ${Number(order.total).toFixed(2)}
                                        </td>
                                        <td className="p-4">
                                            <button className="text-blue-500 hover:text-blue-400 text-sm font-medium">
                                                Ver Detalles
                                            </button>
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

export default Orders;