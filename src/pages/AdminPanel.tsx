import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ArrowRight, Beer, LayoutGrid, Users, Monitor, Briefcase, Loader2, X } from 'lucide-react';
import api from '../lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  pin?: string;
}

export default function AdminPanel() {
  const [isPinDialogOpen, setIsPinDialogOpen] = useState(false);
  const [isCashierPinDialogOpen, setIsCashierPinDialogOpen] = useState(false);
  const [isBarmanPinDialogOpen, setIsBarmanPinDialogOpen] = useState(false);
  const [isMgmtPinDialogOpen, setIsMgmtPinDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);

  // Management Login State
  const [mgmtUserId, setMgmtUserId] = useState<string | null>(null);
  const [mgmtPin, setMgmtPin] = useState('');
  const [mgmtError, setMgmtError] = useState<string | null>(null);
  const [isLoggingInMgmt, setIsLoggingInMgmt] = useState(false);

  const navigate = useNavigate();

  // Fetch users from backend API
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const businessId = localStorage.getItem('businessId');
        if (!businessId) {
          setIsLoadingUsers(false);
          return;
        }

        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/staff-users`, {
          headers: { 'x-business-id': businessId }
        });
        
        if (res.ok) {
          const data = await res.json();
          setUsers(data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setIsLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  const activeWaiters = users.filter(u => u.role?.toLowerCase() === 'mozo' && u.status === 'Active');
  const activeCashiers = users.filter(u => u.role?.toLowerCase() === 'cajero' && u.status === 'Active');
  const activeBarmen = users.filter(u => u.role?.toLowerCase() === 'barman' && u.status === 'Active');
  const managementUsers = users.filter(u =>
    ['administrador', 'admin', 'boss', 'jefe', 'super administrador'].includes(u.role?.toLowerCase() || '') &&
    u.status === 'Active'
  );

  // Auto-select ADMIN user if exists
  useEffect(() => {
    if (managementUsers.length > 0 && !mgmtUserId) {
      const adminUser = managementUsers.find(u => u.name.toUpperCase() === 'ADMIN');
      if (adminUser) {
        setMgmtUserId(adminUser.id);
      }
    }
  }, [managementUsers, mgmtUserId]);

  const handleProfileClick = (e: React.MouseEvent, profile: { href: string; action?: (e: React.MouseEvent) => void }) => {
    e.preventDefault();
    if (profile.action) {
      profile.action(e);
    } else {
      navigate(profile.href);
    }
  };

  // Auto-submit when PIN is 4 digits
  useEffect(() => {
    if (pin.length === 4) {
      if (isPinDialogOpen) handlePinSubmit('mozo', activeWaiters, setIsPinDialogOpen);
      if (isCashierPinDialogOpen) handlePinSubmit('cajero', activeCashiers, setIsCashierPinDialogOpen);
      if (isBarmanPinDialogOpen) handlePinSubmit('barman', activeBarmen, setIsBarmanPinDialogOpen);
    }
  }, [pin]);

  // Management PIN auto-submit
  useEffect(() => {
    if (mgmtPin.length === 4) {
      handleMgmtLogin();
    }
  }, [mgmtPin]);

  const handlePinSubmit = async (role: string, activeUsers: User[], setIsDialogOpen: (open: boolean) => void) => {
    if (!selectedUserId) {
      setPinError("Por favor, selecciona tu nombre.");
      return;
    }
    const user = activeUsers.find(u => u.id === selectedUserId);

    if (!user) return;

    if (user.pin === pin) {
      // Success
      setPinError(null);
      setIsDialogOpen(false);

      const targetPath = role === 'mozo' ? '/waiter' : role === 'cajero' ? '/cashier' : '/bar';
      navigate(`${targetPath}?role=${role}&name=${encodeURIComponent(user.name)}&id=${user.id}`);
    } else {
      // Failure
      setPinError("PIN incorrecto. Inténtalo de nuevo.");
      setPin('');
    }
  };

  const handleMgmtLogin = async () => {
    if (!mgmtUserId) {
      setMgmtError("Selecciona un usuario");
      return;
    }
    const user = managementUsers.find(u => u.id === mgmtUserId);
    if (!user) return;

    if (user.pin === mgmtPin) {
      setIsLoggingInMgmt(true);
      setMgmtError(null);

      const role = user.role.toLowerCase().includes('admin') ? 'admin' : 'boss';
      navigate(`/admin-dashboard?role=${role}&displayRole=${encodeURIComponent(user.role)}&name=${encodeURIComponent(user.name)}&id=${user.id}`);
    } else {
      setMgmtError("PIN incorrecto");
      setMgmtPin('');
    }
  };

  const handleCashierLoginClick = (e: React.MouseEvent) => {
    setPinError(null);
    setPin('');
    setSelectedUserId(null);
    setIsCashierPinDialogOpen(true);
  };

  const handleBarmanLoginClick = (e: React.MouseEvent) => {
    setPinError(null);
    setPin('');
    setSelectedUserId(null);
    setIsBarmanPinDialogOpen(true);
  };

  const profiles = [
    {
      href: '/cashier?role=cajero',
      icon: Monitor,
      label: 'Cajero',
      description: 'Acceso a la caja y transacciones.',
      action: handleCashierLoginClick,
    },
    {
      href: '/bar?role=barman',
      icon: Beer,
      label: 'Barman',
      description: 'Gestionar pedidos de bebidas.',
      action: handleBarmanLoginClick,
    },
  ];

  if (isLoadingUsers) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0f172a]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <>
      <div className="w-full h-screen overflow-hidden lg:grid lg:grid-cols-2 bg-[#0f172a]">
        <div className="flex items-center justify-center py-4 overflow-y-auto lg:overflow-hidden">
          <div className="mx-auto grid w-full max-w-[380px] gap-4 px-4">
            <div className="grid gap-1 text-center">
              <h1 className="text-2xl font-bold text-white">Panel de Administración Ubox</h1>
              <p className="text-sm text-slate-400">
                Selecciona un perfil o ingresa como administrador.
              </p>
            </div>

            <div className="grid gap-2">
              {profiles.map((profile) => (
                <div
                  key={profile.href}
                  className="hover:bg-slate-700 transition-colors cursor-pointer border border-primary/10 bg-[#1e293b] rounded-xl p-3 flex items-center gap-3"
                  onClick={(e) => handleProfileClick(e, profile)}
                >
                  <div className="bg-blue-600 text-white p-2 rounded-full">
                    <profile.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-white">{profile.label}</h3>
                    <p className="text-xs text-slate-400">{profile.description}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </div>
              ))}
            </div>

            <div className="border border-primary/20 bg-blue-600/5 bg-[#1e293b] rounded-xl p-3 space-y-2">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-blue-500" />
                <h3 className="text-base font-semibold text-white">Acceso de Gestión</h3>
              </div>
              <div className="grid gap-2">
                <Select onValueChange={setMgmtUserId} value={mgmtUserId || undefined}>
                  <SelectTrigger className="h-9 text-sm flex-1 bg-[#0f172a] border-slate-700">
                    <SelectValue placeholder={isLoadingUsers ? "Cargando..." : managementUsers.length === 0 ? "No se encontraron admins" : "Seleccionar Usuario"} />
                  </SelectTrigger>
                  <SelectContent>
                    {managementUsers.map(u => (
                      <SelectItem key={u.id} value={u.id}>{u.name} ({u.role})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="grid gap-2">
                  <Input
                    type="password"
                    placeholder="Toca para ingresar PIN"
                    readOnly
                    value={mgmtPin ? "****" : ""}
                    onClick={() => setIsMgmtPinDialogOpen(true)}
                    className="text-center text-lg tracking-[0.2rem] h-10 cursor-pointer bg-[#0f172a] border-slate-700 text-white"
                  />
                </div>

                {mgmtError && <p className="text-[10px] text-red-500 text-center">{mgmtError}</p>}
                <button
                  onClick={handleMgmtLogin}
                  disabled={!mgmtUserId || mgmtPin.length < 4 || isLoggingInMgmt}
                  className="w-full h-10 text-base bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoggingInMgmt ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ingresar"}
                </button>
              </div>
            </div>
                <div className="grid gap-2">
                  <Select onValueChange={setMgmtUserId} value={mgmtUserId || undefined}>
                    <SelectTrigger className="h-9 text-sm flex-1 bg-[#0f172a] border-slate-700">
                      <SelectValue placeholder={isLoadingUsers ? "Cargando..." : managementUsers.length === 0 ? "No se encontraron admins" : "Seleccionar Usuario"} />
                    </SelectTrigger>
                    <SelectContent>
                      {managementUsers.map(u => (
                        <SelectItem key={u.id} value={u.id}>{u.name} ({u.role})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="grid gap-2">
                    <Input
                      type="password"
                      placeholder="Toca para ingresar PIN"
                      readOnly
                      value={mgmtPin ? "****" : ""}
                      onClick={() => setIsMgmtPinDialogOpen(true)}
                      className="text-center text-lg tracking-[0.2rem] h-10 cursor-pointer bg-[#0f172a] border-slate-700 text-white"
                    />
                  </div>

                  {mgmtError && <p className="text-[10px] text-red-500 text-center">{mgmtError}</p>}
                  <button
                    onClick={handleMgmtLogin}
                    disabled={!mgmtUserId || mgmtPin.length < 4 || isLoggingInMgmt}
                    className="w-full h-10 text-base bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isLoggingInMgmt ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ingresar"}
                  </button>
                </div>

            <div className="grid grid-cols-3 gap-2">
              <button className="flex flex-col h-auto py-1.5 gap-0.5 border border-primary/20 rounded-lg bg-[#1e293b] text-white hover:bg-slate-700 transition-colors">
                <Monitor className="h-3.5 w-3.5" />
                <span className="text-[9px] font-bold">MONITOR 2</span>
              </button>
              <button className="flex flex-col h-auto py-1.5 gap-0.5 border border-primary/20 rounded-lg bg-[#1e293b] text-white hover:bg-slate-700 transition-colors">
                <Monitor className="h-3.5 w-3.5" />
                <span className="text-[9px] font-bold">MONITOR 3</span>
              </button>
              <button className="flex flex-col h-auto py-1.5 gap-0.5 border border-primary/20 rounded-lg bg-[#1e293b] text-white hover:bg-slate-700 transition-colors">
                <Monitor className="h-3.5 w-3.5" />
                <span className="text-[9px] font-bold">MONITOR 4</span>
              </button>
            </div>
          </div>
        </div>
        <div className="hidden bg-muted lg:block bg-[#1e293b]">
          <div className="h-full w-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <LayoutGrid className="w-10 h-10 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Ubox POS</h2>
              <p className="text-slate-400">Sistema de Gestión Inteligente</p>
            </div>
          </div>
        </div>
      </div>

      {/* Management PIN Dialog */}
      {isMgmtPinDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1e293b] border border-slate-700 rounded-2xl w-full max-w-[350px] relative">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <h2 className="text-xl font-semibold text-white">PIN de Gestión</h2>
              <button
                onClick={() => setIsMgmtPinDialogOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                 <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="space-y-4">
                <p className="text-slate-400 text-sm">
                  Ingresa tu PIN de seguridad para continuar.
                </p>
                
                <div className="space-y-2">
                  <Input
                    type="password"
                    maxLength={4}
                    value={mgmtPin}
                    readOnly
                    className="text-center text-3xl tracking-[1rem] h-14 bg-[#0f172a] border-slate-700 text-white"
                    placeholder="****"
                  />
                </div>

                {/* Numeric Keypad for Management PIN */}
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <button
                      key={num}
                      className="h-14 text-xl font-semibold bg-[#0f172a] border border-slate-700 text-white hover:bg-slate-700 rounded-lg transition-colors"
                      onClick={() => mgmtPin.length < 4 && setMgmtPin(prev => prev + num)}
                    >
                      {num}
                    </button>
                  ))}
                  <button className="h-14 text-xl font-semibold bg-[#0f172a] border border-slate-700 text-white hover:bg-slate-700 rounded-lg transition-colors" onClick={() => setMgmtPin('')}>C</button>
                  <button className="h-14 text-xl font-semibold bg-[#0f172a] border border-slate-700 text-white hover:bg-slate-700 rounded-lg transition-colors" onClick={() => mgmtPin.length < 4 && setMgmtPin(prev => prev + '0')}>0</button>
                  <button className="h-14 text-xl font-semibold bg-[#0f172a] border border-slate-700 text-white hover:bg-slate-700 rounded-lg transition-colors" onClick={() => setMgmtPin(prev => prev.slice(0, -1))}>⌫</button>
                </div>
                
                <button
                  onClick={() => setIsMgmtPinDialogOpen(false)}
                  className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={mgmtPin.length < 4}
                >
                  Confirmar PIN
                </button>
              </div>
                </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
        <div className="space-y-4">
          <p className="text-slate-400 text-sm">
            Ingresa tu PIN de seguridad para continuar.
          </p>
          
          <div className="space-y-2">
            <Input
              type="password"
              maxLength={4}
              value={mgmtPin}
              readOnly
              className="text-center text-3xl tracking-[1rem] h-14 bg-[#0f172a] border-slate-700 text-white"
              placeholder="****"
            />
          </div>

          {/* Numeric Keypad for Management PIN */}
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button
                  key={num}
                  className="h-14 text-xl font-semibold bg-[#0f172a] border border-slate-700 text-white hover:bg-slate-700 rounded-lg transition-colors"
                  onClick={() => mgmtPin.length < 4 && setMgmtPin(prev => prev + num)}
                >
                  {num}
                </button>
              ))}
              <button className="h-14 text-xl font-semibold bg-[#0f172a] border border-slate-700 text-white hover:bg-slate-700 rounded-lg transition-colors" onClick={() => setMgmtPin('')}>C</button>
              <button className="h-14 text-xl font-semibold bg-[#0f172a] border border-slate-700 text-white hover:bg-slate-700 rounded-lg transition-colors" onClick={() => mgmtPin.length < 4 && setMgmtPin(prev => prev + '0')}>0</button>
              <button className="h-14 text-xl font-semibold bg-[#0f172a] border border-slate-700 text-white hover:bg-slate-700 rounded-lg transition-colors" onClick={() => setMgmtPin(prev => prev.slice(0, -1))}>⌫</button>
            </div>
          
                <button
                    onClick={() => setIsMgmtPinDialogOpen(false)}
                    className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={mgmtPin.length < 4}
                  >
                    Confirmar PIN
                  </button>
        </div>
    </>
  );
}