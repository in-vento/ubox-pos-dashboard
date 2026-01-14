import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Users, 
  Settings, 
  BarChart3, 
  Package, 
  CreditCard, 
  FileText,
  Plus,
  Edit,
  Trash2,
  Loader2
} from 'lucide-react';
import api from '../lib/api';

interface StaffUser {
  id: string;
  name: string;
  role: string;
  status: string;
  pin?: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { role } = useParams();
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalOrders: 0,
    todayRevenue: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const businessId = localStorage.getItem('businessId');
      if (!businessId) return;

      // Fetch staff users
      const staffRes = await api.get('/staff-users', {
        headers: { 'x-business-id': businessId }
      });
      
      if (staffRes.data.success) {
        setStaffUsers(staffRes.data.data || []);
      }

      // Fetch stats
      const statsRes = await api.get('/orders/stats', {
        headers: { 'x-business-id': businessId }
      });
      
      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const menuItems = [
    {
      title: 'Personal',
      icon: Users,
      description: 'Gestionar usuarios y roles',
      count: staffUsers.length,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Configuración',
      icon: Settings,
      description: 'Ajustes del sistema',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Reportes',
      icon: BarChart3,
      description: 'Estadísticas y análisis',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      title: 'Productos',
      icon: Package,
      description: 'Catálogo e inventario',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    },
    {
      title: 'Pedidos',
      icon: FileText,
      description: 'Gestión de órdenes',
      count: stats.totalOrders,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10'
    },
    {
      title: 'Pagos',
      icon: CreditCard,
      description: 'Transacciones y cobros',
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Panel de Administración</h1>
          <p className="text-slate-400">
            Rol: {role} • {new Date().toLocaleDateString()}
          </p>
        </div>
        <button 
          onClick={() => navigate('/admin-panel')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Cambiar Usuario
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#1e293b] border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Usuarios Activos</p>
              <p className="text-2xl font-bold text-white">{stats.activeUsers}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-[#1e293b] border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Pedidos Totales</p>
              <p className="text-2xl font-bold text-white">{stats.totalOrders}</p>
            </div>
            <FileText className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-[#1e293b] border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Ingresos Hoy</p>
              <p className="text-2xl font-bold text-white">${stats.todayRevenue.toFixed(2)}</p>
            </div>
            <CreditCard className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-[#1e293b] border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Dispositivos</p>
              <p className="text-2xl font-bold text-white">1</p>
            </div>
            <Settings className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.map((item, index) => (
          <div 
            key={index}
            className="bg-[#1e293b] border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer group rounded-xl p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className={`w-12 h-12 ${item.bgColor} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                <p className="text-slate-400 text-sm mb-3">{item.description}</p>
                {item.count !== undefined && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-700 text-slate-300">
                    {item.count} {item.title.toLowerCase()}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Staff Users */}
      <div className="bg-[#1e293b] border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Personal Reciente</h2>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Usuario
          </button>
        </div>
        {staffUsers.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No hay usuarios registrados</p>
          </div>
        ) : (
          <div className="space-y-3">
            {staffUsers.slice(0, 5).map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{user.name}</p>
                    <p className="text-sm text-slate-400">{user.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span 
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === 'Active' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                    }`}
                  >
                    {user.status === 'Active' ? 'Activo' : 'Inactivo'}
                  </span>
                  <button className="text-slate-400 hover:text-white p-1 rounded transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}