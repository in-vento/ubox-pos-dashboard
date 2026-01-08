import React, { useEffect, useState } from 'react';
import { WalletCards, Loader2, Search, DollarSign, Users, Clock } from 'lucide-react';
import api from '../lib/api';
import ReadOnlyBanner from '../components/ReadOnlyBanner';

const Cashier = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [staff, setStaff] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [businessId] = useState(localStorage.getItem('businessId'));

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!businessId) return;
                const [ordersRes, recoveryRes] = await Promise.all([
                    api.get('/orders', { headers: { 'x-business-id': businessId } }),
                    api.get('/recovery', { headers: { 'x-business-id': businessId } })
                ]);

                if (ordersRes.data.success) {
                    setOrders(ordersRes.data.data);
                }
                if (recoveryRes.data.success) {
                    setStaff(recoveryRes.data.data.staffUsers || []);
                }
            } catch (error) {
                console.error('Error fetching cashier data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 30000); // Refresh every 30s
        return () => clearInterval(interval);
    }, [businessId]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    const pendingOrders = orders.filter(o => o.status === 'PENDING' || o.status === 'Pending');
    const recentPayments = orders.flatMap(o => (o.payments || []).map((p: any) => ({ ...p, orderId: o.id, customer: o.customer }))).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);

    return (
        <div className="space-y-8">
            <ReadOnlyBanner />

            <div>
                <h1 className="text-2xl font-bold text-white">Caja</h1>
                <p className="text-slate-400">Visualización en tiempo real de cuentas y pagos.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Open Accounts */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[#1e293b] rounded-2xl border border-slate-800 overflow-hidden">
                        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Clock className="w-5 h-5 text-blue-500" />
                                Cuentas Abiertas
                            </h3>
                            <span className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full text-xs font-bold">
                                {pendingOrders.length} Pendientes
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-900/50 border-b border-slate-800">
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">Mesa / Cliente</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">Mozo</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Saldo</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingOrders.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="p-8 text-center text-slate-500 text-sm">No hay cuentas abiertas</td>
                                        </tr>
                                    ) : (
                                        pendingOrders.map(order => (
                                            <tr key={order.id} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                                                <td className="p-4">
                                                    <div className="text-sm font-bold text-white">{order.customer || 'Cliente General'}</div>
                                                    <div className="text-[10px] text-slate-500 font-mono">#{order.customId || order.id.slice(-6)}</div>
                                                </td>
                                                <td className="p-4 text-sm text-slate-400">{order.waiterName || 'N/A'}</td>
                                                <td className="p-4 text-sm font-bold text-white text-right">
                                                    S/ {(order.totalAmount - (order.paidAmount || 0)).toFixed(2)}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button className="text-blue-500 hover:text-blue-400 text-xs font-bold">Detalles</button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Recent Activity & Staff */}
                <div className="space-y-6">
                    {/* Active Staff */}
                    <div className="bg-[#1e293b] rounded-2xl border border-slate-800 overflow-hidden">
                        <div className="p-6 border-b border-slate-800">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Users className="w-5 h-5 text-blue-500" />
                                Personal Activo
                            </h3>
                        </div>
                        <div className="p-4 space-y-3">
                            {staff.length === 0 ? (
                                <div className="text-center py-4 text-slate-500 text-xs">No hay personal registrado</div>
                            ) : (
                                staff.filter(s => s.status === 'ACTIVE' || s.status === 'Active').map(s => (
                                    <div key={s.id} className="flex items-center gap-3 p-2 bg-slate-900/30 rounded-lg border border-slate-800/30">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <div className="flex-1">
                                            <div className="text-xs font-bold text-white">{s.name}</div>
                                            <div className="text-[10px] text-slate-500 uppercase">{s.role}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Recent Payments */}
                    <div className="bg-[#1e293b] rounded-2xl border border-slate-800 overflow-hidden">
                        <div className="p-6 border-b border-slate-800">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-green-500" />
                                Pagos Recientes
                            </h3>
                        </div>
                        <div className="p-4 space-y-4">
                            {recentPayments.length === 0 ? (
                                <div className="text-center py-8 text-slate-500 text-sm">No hay pagos registrados</div>
                            ) : (
                                recentPayments.map((payment: any) => (
                                    <div key={payment.id} className="flex justify-between items-center p-3 bg-slate-900/50 rounded-xl border border-slate-800/50">
                                        <div>
                                            <div className="text-xs font-bold text-white">{payment.customer || 'Cliente'}</div>
                                            <div className="text-[10px] text-slate-500">{payment.method}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-bold text-green-500">S/ {payment.amount.toFixed(2)}</div>
                                            <div className="text-[10px] text-slate-500">{new Date(payment.timestamp).toLocaleTimeString()}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cashier;
