import React, { useState, useEffect } from 'react';
import { Monitor, ShieldCheck, ShieldAlert, Loader2, XCircle } from 'lucide-react';
import api from '../lib/api';
import ReadOnlyBanner from '../components/ReadOnlyBanner';

type Device = {
  id: string;
  name: string;
  fingerprint: string;
  isAuthorized: boolean;
  lastSeen: string;
};

const Devices = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [authorizingId, setAuthorizingId] = useState<string | null>(null);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const businessId = localStorage.getItem('businessId');
      if (!businessId) throw new Error('No se encontró el ID del negocio');

      const response = await api.get(`/device/${businessId}`);
      if (response.data.success) {
        setDevices(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || err.message || 'Error al cargar dispositivos');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthorization = async (deviceId: string, currentStatus: boolean) => {
    setAuthorizingId(deviceId);
    try {
      const response = await api.patch(`/device/${deviceId}/authorize`, {
        isAuthorized: !currentStatus
      });

      if (response.data.success) {
        setDevices(devices.map(d =>
          d.id === deviceId ? { ...d, isAuthorized: !currentStatus } : d
        ));
      }
    } catch (err) {
      console.error('Error updating authorization:', err);
    } finally {
      setAuthorizingId(null);
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
          <h1 className="text-2xl font-bold text-white">Dispositivos POS</h1>
          <p className="text-slate-400">Visualiza las computadoras registradas en el sistema.</p>
        </div>
        <button
          onClick={fetchDevices}
          className="p-2 hover:bg-slate-800 rounded-full transition-colors"
        >
          <Loader2 className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid gap-4">
        {devices.length === 0 ? (
          <div className="text-center py-12 bg-[#1e293b] rounded-xl border border-slate-800">
            <Monitor className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No hay dispositivos registrados</h3>
            <p className="text-slate-400">Abre la aplicación de escritorio e inicia sesión para registrar este equipo.</p>
          </div>
        ) : (
          devices.map((device) => (
            <div
              key={device.id}
              className={`bg-[#1e293b] border rounded-xl p-6 flex items-center justify-between transition-all ${device.isAuthorized ? 'border-green-500/30' : 'border-slate-800'
                }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${device.isAuthorized ? 'bg-green-500/20' : 'bg-slate-700/50'
                  }`}>
                  <Monitor className={`w-6 h-6 ${device.isAuthorized ? 'text-green-500' : 'text-slate-400'
                    }`} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">{device.name}</h3>
                  <p className="text-sm text-slate-400 font-mono mt-1">ID: {device.fingerprint}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Última conexión: {new Date(device.lastSeen).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${device.isAuthorized
                  ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                  : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                  }`}>
                  {device.isAuthorized ? 'Autorizado' : 'Pendiente'}
                </div>

                <div className="relative group">
                  <button
                    disabled
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all opacity-50 cursor-not-allowed ${device.isAuthorized
                      ? 'bg-red-500/10 text-red-500'
                      : 'bg-green-600/50 text-white'
                      }`}
                  >
                    {device.isAuthorized ? (
                      <>
                        <XCircle className="w-4 h-4" />
                        Revocar
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        Autorizar Dispositivo
                      </>
                    )}
                  </button>
                  <div className="absolute bottom-full mb-2 right-0 w-64 bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    Usa la aplicación de escritorio para gestionar autorizaciones
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Devices;