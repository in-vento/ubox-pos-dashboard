import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Cloud, Lock, Mail, User, Loader2, Building, Copy, CheckCircle } from 'lucide-react';
import api from '../lib/api';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showLicenseDialog, setShowLicenseDialog] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 1. Register User (backend crea negocio y licencia automáticamente)
      const userRes = await api.post('/auth/register', {
        name,
        email,
        password
      });

      if (userRes.data.success) {
        const { token, user, business, licenseKey } = userRes.data.data;
        
        // Guardar datos
        localStorage.setItem('cloud_token', token);
        localStorage.setItem('user_info', JSON.stringify(user));
        localStorage.setItem('businessId', business.id);
        
        // Mostrar licencia generada
        setLicenseKey(licenseKey);
        setShowLicenseDialog(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Error al registrarse. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyLicense = () => {
    navigator.clipboard.writeText(licenseKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4">
      <div className="max-w-md w-full space-y-8 bg-[#1e293b] p-8 rounded-2xl border border-slate-800 shadow-2xl">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="p-3 bg-blue-600/20 rounded-xl">
              <Cloud className="h-10 w-10 text-blue-500" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-white">Crea tu cuenta</h2>
          <p className="mt-2 text-sm text-slate-400">
            Comienza a gestionar tu negocio con Ubox POS
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Nombre Completo</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <input
                  type="text"
                  required
                  className="block w-full pl-10 pr-3 py-2 bg-[#0f172a] border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Juan Pérez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <input
                  type="email"
                  required
                  className="block w-full pl-10 pr-3 py-2 bg-[#0f172a] border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="admin@tu-negocio.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Nombre de tu Negocio</label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <input
                  type="text"
                  required
                  className="block w-full pl-10 pr-3 py-2 bg-[#0f172a] border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Mi Restaurante"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <input
                  type="password"
                  required
                  className="block w-full pl-10 pr-3 py-2 bg-[#0f172a] border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder=""
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Registrar mi Negocio'}
          </button>

          <p className="text-center text-sm text-slate-400">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="font-medium text-blue-500 hover:text-blue-400 transition-colors">
              Inicia sesión aquí
            </Link>
          </p>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
            Ubox POS SaaS - SISTEMA DE GESTIÓN INTELIGENTE
          </p>
        </div>
      </div>

      {/* License Dialog */}
      {showLicenseDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1e293b] border border-slate-700 rounded-2xl p-6 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="mx-auto w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">¡Registro Exitoso!</h3>
              <p className="text-slate-400 text-sm">
                Tu licencia ha sido generada. Guárdala para instalar la app desktop.
              </p>
            </div>

            <div className="bg-[#0f172a] border border-slate-700 rounded-lg p-4 mb-4">
              <p className="text-sm font-medium text-slate-300 mb-2">Tu Licencia Ubox POS:</p>
              <div className="font-mono text-lg text-center p-3 bg-slate-800 border border-slate-600 rounded text-green-400">
                {licenseKey}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={copyLicense}
                className="flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copiado' : 'Copiar'}
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="py-2 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Ir al Dashboard
              </button>
            </div>

            <div className="text-xs text-slate-500 text-center">
              <p className="mb-1">📋 Próximos pasos:</p>
              <p>1. Descarga la app desktop</p>
              <p>2. Ingresa esta licencia</p>
              <p>3. Autoriza el dispositivo desde aquí</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
