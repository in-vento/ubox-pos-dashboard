import React, { useState, useEffect } from 'react';
import { Monitor, CheckCircle, XCircle, ShieldCheck, RefreshCw } from 'lucide-react';
import api from '../lib/api';

interface Device {
  id: string;
  name: string;
  fingerprint: string;
  isAuthorized: boolean;
  role: string;
  lastSeen: string;
  createdAt: string;
}

const Devices = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const businessId = localStorage.getItem('businessId');
      if (!businessId) throw new Error('No se encontró el ID del negocio');

      const response = await api.get('/device/list', {
        headers: { 'x-business-id': businessId }
      });

      if (response.data.success) {
        setDevices(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Error al cargar dispositivos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const toggleAuthorization = async (deviceId: string, currentStatus: boolean) => {
    try {
      setActionLoading(deviceId);
      const businessId = localStorage.getItem('businessId');
      
      const response = await api.post('/device/authorize', {
        deviceId,
        authorize: !currentStatus
      }, {
        headers: { 'x-business-id': businessId }
      });

      if (response.data.success) {
        setDevices(devices.map(d => 
          d.id === deviceId ? { ...d, isAuthorized: !currentStatus } : d
        ));
      }
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Error al cambiar autorización');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Dispositivos POS</h1>
          <p className="text-gray-400">Gestiona y autoriza las computadoras que pueden usar el sistema.</p>
        </div>
        <button 
          onClick={fetchDevices}
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices.length === 0 ? (
          <div className="col-span-full bg-gray-800/50 border border-gray-700 rounded-xl p-12 text-center">
            <Monitor className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white">No hay dispositivos registrados</h3>
            <p className="text-gray-400 mt-2">Abre la aplicación de escritorio e inicia sesión para registrar este equipo.</p>
          </div>
        ) : (
          devices.map((device) => (
            <div 
              key={device.id}
              className={`bg-gray-800 border rounded-xl p-6 transition-all ${
                device.isAuthorized ? 'border-green-500/30' : 'border-yellow-500/30'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-gray-700 rounded-lg">
                  <Monitor className="w-6 h-6 text-blue-400" />
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  device.isAuthorized 
                    ? 'bg-green-500/10 text-green-500' 
                    : 'bg-yellow-500/10 text-yellow-500'
                }`}>
                  {device.isAuthorized ? 'Autorizado' : 'Pendiente'}
                </div>
              </div>

              <h3 className="text-lg font-semibold text-white mb-1">{device.name}</h3>
              <p className="text-xs text-gray-500 font-mono mb-4 truncate">
                ID: {device.fingerprint}
              </p>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Rol:</span>
                  <span className="text-white">{device.role}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Última conexión:</span>
                  <span className="text-white">
                    {new Date(device.lastSeen).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => toggleAuthorization(device.id, device.isAuthorized)}
                disabled={actionLoading === device.id}
                className={`w-full py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                  device.isAuthorized
                    ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                    : 'bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-500/20'
                }`}
              >
                {actionLoading === device.id ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : device.isAuthorized ? (
                  <>
                    <XCircle className="w-4 h-4" />
                    Revocar Acceso
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Autorizar Dispositivo
                  </>
                )}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Devices;