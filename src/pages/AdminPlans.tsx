import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Check, X, Clock, CreditCard, Zap, Shield } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  price: string;
  duration: string;
  features: string[];
  recommended?: boolean;
  deviceLimit: number;
}

const plans: Plan[] = [
  {
    id: 'basic',
    name: 'Básico',
    price: '$29',
    duration: 'mes',
    features: [
      '1 dispositivo',
      'Soporte por email',
      'Reportes básicos',
      'Backup automático',
    ],
    deviceLimit: 1
  },
  {
    id: 'pro',
    name: 'Profesional',
    price: '$49',
    duration: 'mes',
    features: [
      '3 dispositivos',
      'Soporte prioritario',
      'Reportes avanzados',
      'Backup automático',
      'Exportación de datos',
    ],
    recommended: true,
    deviceLimit: 3
  },
  {
    id: 'enterprise',
    name: 'Empresarial',
    price: '$99',
    duration: 'mes',
    features: [
      '10 dispositivos',
      'Soporte 24/7',
      'Reportes personalizados',
      'Backup automático',
      'Exportación de datos',
      'API Access',
      'Entrenamiento personalizado',
    ],
    deviceLimit: 10
  },
  {
    id: 'lifetime',
    name: 'Lifetime',
    price: '$499',
    duration: 'único',
    features: [
      'Dispositivos ilimitados',
      'Soporte vitalicio',
      'Todas las características',
      'Actualizaciones gratis',
      'API Access prioritaria',
      'Personalización',
    ],
    recommended: false,
    deviceLimit: 999
  }
];

export default function Plans() {
  const [selectedPlan, setSelectedPlan] = useState<string>('pro');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const navigate = useNavigate();

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    
    // Aquí iría la lógica de pago
    // Por ahora, simulamos la compra
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  const getFeatureIcon = (feature: string) => {
    if (feature.includes('dispositivo')) return <Check className="w-4 h-4 text-green-500" />;
    if (feature.includes('Soporte')) return <Shield className="w-4 h-4 text-blue-500" />;
    if (feature.includes('Reportes')) return <Clock className="w-4 h-4 text-purple-500" />;
    if (feature.includes('Backup')) return <Zap className="w-4 h-4 text-yellow-500" />;
    if (feature.includes('Exportación') || feature.includes('API')) return <CreditCard className="w-4 h-4 text-cyan-500" />;
    return <Check className="w-4 h-4 text-green-500" />;
  };

  return (
    <div className="min-h-screen bg-[#0f172a] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Elige tu Plan Perfecto
          </h1>
          <p className="text-xl text-slate-400 mb-8">
            Escala tu negocio con el plan que mejor se adapte a tus necesidades
          </p>
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-[#1e293b] border border-slate-700 rounded-lg p-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Mensual
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all relative ${
                billingCycle === 'annual'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Anual
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Ahorra 20%
              </span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`relative bg-[#1e293b] border ${
                plan.recommended 
                  ? 'border-blue-500/50 shadow-lg shadow-blue-500/20' 
                  : 'border-slate-700'
              } hover:border-slate-600 transition-all duration-300`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                    Recomendado
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-bold text-white mb-2">
                  {plan.name}
                </CardTitle>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                  <span className="text-slate-400">/{plan.duration}</span>
                </div>
                {plan.deviceLimit && (
                  <p className="text-sm text-slate-400 mt-2">
                    {plan.deviceLimit === 999 ? 'Dispositivos ilimitados' : `${plan.deviceLimit} dispositivo${plan.deviceLimit > 1 ? 's' : ''}`}
                  </p>
                )}
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      {getFeatureIcon(feature)}
                      <span className="text-sm text-slate-300">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Button
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full py-3 font-medium transition-all ${
                    plan.recommended
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-slate-700 hover:bg-slate-600 text-white'
                  }`}
                  variant={selectedPlan === plan.id ? "default" : "outline"}
                >
                  {selectedPlan === plan.id ? (
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      Seleccionado
                    </div>
                  ) : (
                    `Elegir ${plan.name}`
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="mt-16 bg-[#1e293b] border border-slate-700 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Comparación de Características
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-4 text-slate-400">Característica</th>
                  <th className="text-center py-4 text-white">Básico</th>
                  <th className="text-center py-4 text-white">Profesional</th>
                  <th className="text-center py-4 text-white">Empresarial</th>
                  <th className="text-center py-4 text-white">Lifetime</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-700">
                  <td className="py-4 text-slate-300">Dispositivos</td>
                  <td className="text-center py-4 text-white">1</td>
                  <td className="text-center py-4 text-white">3</td>
                  <td className="text-center py-4 text-white">10</td>
                  <td className="text-center py-4 text-green-500">∞</td>
                </tr>
                <tr className="border-b border-slate-700">
                  <td className="py-4 text-slate-300">Soporte</td>
                  <td className="text-center py-4 text-white">Email</td>
                  <td className="text-center py-4 text-white">Prioritario</td>
                  <td className="text-center py-4 text-white">24/7</td>
                  <td className="text-center py-4 text-green-500">Vitalicio</td>
                </tr>
                <tr className="border-b border-slate-700">
                  <td className="py-4 text-slate-300">API Access</td>
                  <td className="text-center py-4 text-red-500"><X className="w-4 h-4 mx-auto" /></td>
                  <td className="text-center py-4 text-red-500"><X className="w-4 h-4 mx-auto" /></td>
                  <td className="text-center py-4 text-white"><Check className="w-4 h-4 mx-auto" /></td>
                  <td className="text-center py-4 text-green-500"><Check className="w-4 h-4 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4 text-slate-300">Actualizaciones</td>
                  <td className="text-center py-4 text-white">Incluidas</td>
                  <td className="text-center py-4 text-white">Incluidas</td>
                  <td className="text-center py-4 text-white">Incluidas</td>
                  <td className="text-center py-4 text-green-500">Gratis vitalicio</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              ¿Necesitas una solución personalizada?
            </h3>
            <p className="text-slate-200 mb-6 max-w-2xl mx-auto">
              Contáctanos para obtener una solución adaptada a las necesidades específicas de tu negocio.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100">
                Contactar Ventas
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Agendar Demo
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <Link 
            to="/dashboard" 
            className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-2"
          >
            ← Volver al Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}