import React, { useEffect, useState } from 'react';
import { Users, Loader2, Search, ShoppingBag } from 'lucide-react';
import api from '../lib/api';
import ReadOnlyBanner from '../components/ReadOnlyBanner';

const Waiters = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [businessId] = useState(localStorage.getItem('businessId'));

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!businessId) return;
                const response = await api.get('/orders', {
                    headers: { 'x-business-id': businessId }
                });
                if (response.data.success) {
                    setOrders(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching waiters data:', error);
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

    // Group orders by waiter
    const ordersByWaiter = orders.reduce((acc: any, order) => {
        const waiter = order.waiterName || 'Sin Asignar';
        if (!acc[waiter]) acc[waiter] = [];
        acc[waiter].push(order);
        return acc;
    }, {});

    return (
        <div className="space-y-8">
            <ReadOnlyBanner />

            <div>
                <h1 className="text-2xl font-bold text-white">Mozos</h1>
                <p className="text-slate-400">Seguimiento de actividad y pedidos por mozo.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(ordersByWaiter).map(([waiter, waiterOrders]: [string, any]) => (
                    <div key={waiter} className="bg-[#1e293b] rounded-2xl border border-slate-800 overflow-hidden">
                        <div className="p-6 border-b border-slate-800 bg-slate-900/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center">
                                    <Users className="w-5 h-5 text-blue-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">{waiter}</h3>
                                    <p className="text-xs text-slate-500">{waiterOrders.length} Pedidos</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 space-y-3">
                            {waiterOrders.slice(0, 5).map((order: any) => (
                                <div key={order.id} className="flex justify-between items-center p-2 hover:bg-slate-800/50 rounded-lg transition-colors">
                                    <div className="text-xs">
                                        <div className="font-bold text-white">{order.customer || 'Cliente'}</div>
                                        <div className="text-slate-500 font-mono">#{order.customId || order.id.slice(-6)}</div>
                                    </div>
                                    <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${order.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                                        }`}>
                                        {order.status}
                                    </div>
                                </div>
                            ))}
                            {waiterOrders.length > 5 && (
                                <button className="w-full text-center py-2 text-xs text-slate-500 hover:text-white transition-colors">
                                    Ver {waiterOrders.length - 5} más...
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Waiters;
