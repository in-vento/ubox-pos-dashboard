import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  Settings
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import api from '../lib/api';

const StatCard = ({ icon: Icon, label, value, trend, trendValue }: any) => (
  <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800">
    <div className="flex justify-between items-start">
      <div className="p-3 bg-blue-500/10 rounded-xl">
        <Icon className="w-6 h-6 text-blue-500" />
      </div>
      <div className={`flex items-center gap-1 text-sm font-medium ${
        trend === 'up' ? 'text-green-500' : 'text-red-500'
      }`}>
        {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
        {trendValue}
      </div>
    </div>
    <div className="mt-4">
      <h3 className="text-slate-400 text-sm font-medium">{label}</h3>
      <p className="text-2xl font-bold text-white mt-1">{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalOrders: 0,
    todayOrders: 0,
    totalRevenue: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const businessId = localStorage.getItem('businessId');
        if (!businessId) return;

        const response = await api.get('/orders/stats', {
            headers: { 'x-business-id': businessId }
        });
        
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
        <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard General</h1>
          <p className="text-slate-400">Resumen de actividad de tu negocio en tiempo real.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/admin-panel')}
            className="border border-blue-500/50 text-blue-500 hover:bg-blue-500/10 px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
          >
            <Settings className="w-4 h-4 mr-2" />
            Panel Administrador
          </button>
          <button
            onClick={() => window.open('/dashboard/devices', '_blank')}
            className="border border-green-500/50 text-green-500 hover:bg-green-500/10 px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
          >
            <Users className="w-4 h-4 mr-2" />
            Gestionar Dispositivos
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={DollarSign}
          label="Ventas Totales"
          value={`$${stats.totalRevenue.toFixed(2)}`}
          trend="up"
          trendValue="+12.5%"
        />
        <StatCard 
          icon={ShoppingBag}
          label="Pedidos Hoy"
          value={stats.todayOrders.toString()}
          trend="up"
          trendValue="+8.2%"
        />
        <StatCard 
          icon={Users}
          label="Clientes Nuevos"
          value="12"
          trend="up"
          trendValue="+2.4%"
        />
        <StatCard 
          icon={TrendingUp}
          label="Ticket Promedio"
          value={`$${stats.todayOrders > 0 ? (stats.totalRevenue / stats.totalOrders).toFixed(2) : '0.00'}`}
          trend="down"
          trendValue="-1.1%"
        />
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#1e293b] p-6 rounded-2xl border border-slate-800">
          <h3 className="text-lg font-bold text-white mb-6">Resumen de Ventas</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { name: 'Lun', value: 4000 },
                { name: 'Mar', value: 3000 },
                { name: 'Mie', value: 2000 },
                { name: 'Jue', value: 2780 },
                { name: 'Vie', value: 1890 },
                { name: 'Sab', value: 2390 },
                { name: 'Dom', value: 3490 },
              ]}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" axisLine={false} tickLine={false} />
                <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800">
            <h3 className="text-lg font-bold text-white mb-6">Actividad Reciente</h3>
            <div className="space-y-4">
                <div className="text-slate-400 text-sm text-center py-8">
                    Las transacciones recientes aparecerán aquí.
                </div>
            </div>
            <button className="w-full mt-6 py-3 rounded-xl bg-slate-800 text-white text-sm font-medium hover:bg-slate-700 transition-colors">
                Ver todas las ventas
            </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;