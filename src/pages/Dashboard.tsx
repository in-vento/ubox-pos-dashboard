import React, { useEffect, useState } from 'react';
import api from '../lib/api';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Clock
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    orderCount: 0,
    activeDevices: 0,
    averageTicket: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for charts
  const salesData = [
    { name: 'Lun', total: 4000 },
    { name: 'Mar', total: 3000 },
    { name: 'Mie', total: 2000 },
    { name: 'Jue', total: 2780 },
    { name: 'Vie', total: 1890 },
    { name: 'Sab', total: 2390 },
    { name: 'Dom', total: 3490 },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real scenario, we would have a /dashboard endpoint
        // For now, we'll just simulate loading
        setTimeout(() => {
          setStats({
            totalSales: 12450.50,
            orderCount: 156,
            activeDevices: 3,
            averageTicket: 79.80
          });
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching dashboard data', error);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({ icon: Icon, label, value, trend, trendValue }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-slate-50 text-slate-900 rounded-xl">
          <Icon size={24} />
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
          {trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          {trendValue}
        </div>
      </div>
      <p className="text-slate-500 text-sm font-medium">{label}</p>
      <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Resumen General</h1>
        <p className="text-slate-500">Bienvenido de nuevo al panel de control de UBOX.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={DollarSign} 
          label="Ventas Totales" 
          value={`S/ ${stats.totalSales.toLocaleString()}`} 
          trend="up" 
          trendValue="+12.5%" 
        />
        <StatCard 
          icon={ShoppingBag} 
          label="Pedidos" 
          value={stats.orderCount} 
          trend="up" 
          trendValue="+8.2%" 
        />
        <StatCard 
          icon={Users} 
          label="Ticket Promedio" 
          value={`S/ ${stats.averageTicket.toFixed(2)}`} 
          trend="down" 
          trendValue="-2.4%" 
        />
        <StatCard 
          icon={TrendingUp} 
          label="Dispositivos Activos" 
          value={stats.activeDevices} 
          trend="up" 
          trendValue="Estable" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Chart */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-900 text-lg">Ventas de la Semana</h3>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Clock size={16} />
              Últimos 7 días
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f172a" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  itemStyle={{color: '#0f172a', fontWeight: 'bold'}}
                />
                <Area type="monotone" dataKey="total" stroke="#0f172a" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 text-lg mb-8">Actividad Reciente</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-900">
                  <ShoppingBag size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900">Nuevo Pedido #JU-00012{i}</p>
                  <p className="text-xs text-slate-500">Hace {i * 5} minutos  Mesa 0{i}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">S/ {(Math.random() * 100 + 20).toFixed(2)}</p>
                  <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full font-bold uppercase">Pagado</span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
            Ver todas las ventas
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
