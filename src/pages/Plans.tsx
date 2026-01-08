import React, { useEffect, useState } from 'react';
import { CreditCard, Loader2, Check, Star, Zap, Shield } from 'lucide-react';
import api from '../lib/api';
import ReadOnlyBanner from '../components/ReadOnlyBanner';

const Plans = () => {
    const [business, setBusiness] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [businessId] = useState(localStorage.getItem('businessId'));

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!businessId) return;
                const response = await api.get(`/business/${businessId}`);
                if (response.data.success) {
                    setBusiness(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching plans data:', error);
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

    const plans = [
        { name: 'FREE', icon: Zap, price: 'S/ 0', features: ['1 Dispositivo', 'Soporte Básico', 'Reportes Simples'], color: 'slate' },
        { name: 'BASIC', icon: Star, price: 'S/ 99', features: ['3 Dispositivos', 'Soporte 24/7', 'Reportes Avanzados', 'Sincronización Cloud'], color: 'blue' },
        { name: 'PREMIUM', icon: Shield, price: 'S/ 199', features: ['Dispositivos Ilimitados', 'Soporte Prioritario', 'IA Sales Insights', 'Personalización Total'], color: 'purple' },
    ];

    return (
        <div className="space-y-8">
            <ReadOnlyBanner />

            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-white">Planes y Suscripción</h1>
                    <p className="text-slate-400">Gestiona el plan de tu negocio y consulta beneficios.</p>
                </div>
                <div className="bg-blue-600/10 border border-blue-500/20 px-4 py-2 rounded-xl">
                    <span className="text-xs text-slate-400 block">Plan Actual</span>
                    <span className="text-blue-500 font-bold uppercase tracking-widest">{business?.plan || 'FREE'}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map(plan => {
                    const isCurrent = business?.plan === plan.name;
                    return (
                        <div key={plan.name} className={`bg-[#1e293b] rounded-3xl border-2 p-8 relative overflow-hidden transition-all ${isCurrent ? 'border-blue-500 shadow-2xl shadow-blue-500/10' : 'border-slate-800'
                            }`}>
                            {isCurrent && (
                                <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold px-4 py-1 rounded-bl-xl uppercase tracking-widest">
                                    Actual
                                </div>
                            )}
                            <div className={`w-12 h-12 rounded-2xl bg-${plan.color}-500/10 flex items-center justify-center mb-6`}>
                                <plan.icon className={`w-6 h-6 text-${plan.color}-500`} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                            <div className="flex items-baseline gap-1 mb-8">
                                <span className="text-3xl font-bold text-white">{plan.price}</span>
                                <span className="text-slate-500 text-sm">/mes</span>
                            </div>
                            <ul className="space-y-4 mb-8">
                                {plan.features.map(feature => (
                                    <li key={feature} className="flex items-center gap-3 text-sm text-slate-400">
                                        <Check className="w-4 h-4 text-green-500" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <button disabled className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${isCurrent ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500'
                                }`}>
                                {isCurrent ? 'Plan Actual' : 'No Disponible en Web'}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Plans;
