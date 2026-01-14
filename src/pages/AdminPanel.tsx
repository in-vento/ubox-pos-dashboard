import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import Dialog from '../components/Dialog';
import { ArrowRight, Beer, LayoutGrid, Users, Monitor, Briefcase, Loader2 } from 'lucide-react';
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
                <Card
                  key={profile.href}
                  className="hover:bg-muted/50 transition-colors cursor-pointer border-primary/10 bg-[#1e293b]"
                  onClick={(e) => handleProfileClick(e, profile)}
                >
                  <CardHeader className="flex flex-row items-center gap-3 space-y-0 p-3">
                    <div className="bg-primary text-primary-foreground p-2 rounded-full">
                      <profile.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base text-white">{profile.label}</CardTitle>
                      <CardDescription className="text-xs text-slate-400">{profile.description}</CardDescription>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                </Card>
              ))}
            </div>

            <Card className="border-primary/20 bg-primary/5 bg-[#1e293b]">
              <CardHeader className="p-3 pb-1">
                <CardTitle className="text-base flex items-center gap-2 text-white">
                  <Briefcase className="h-4 w-4 text-primary" />
                  Acceso de Gestión
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2 p-3 pt-1">
                <div className="grid gap-1">
                  <div className="flex items-center gap-2">
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
                  </div>
                </div>
                <div className="grid gap-1">
                  <Input
                    type="password"
                    placeholder="Toca para ingresar PIN"
                    readOnly
                    value={mgmtPin ? "****" : ""}
                    onClick={() => setIsMgmtPinDialogOpen(true)}
                    className="text-center text-lg tracking-[0.2rem] h-10 cursor-pointer bg-background"
                  />
                </div>

                {mgmtError && <p className="text-[10px] text-destructive text-center">{mgmtError}</p>}
                <Button
                  onClick={handleMgmtLogin}
                  disabled={!mgmtUserId || mgmtPin.length < 4 || isLoggingInMgmt}
                  className="w-full h-10 text-base"
                >
                  {isLoggingInMgmt ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ingresar"}
                </Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" size="sm" className="flex flex-col h-auto py-1.5 gap-0.5 border-primary/20 bg-[#1e293b] text-white">
                <Monitor className="h-3.5 w-3.5" />
                <span className="text-[9px] font-bold">MONITOR 2</span>
              </Button>
              <Button variant="outline" size="sm" className="flex flex-col h-auto py-1.5 gap-0.5 border-primary/20 bg-[#1e293b] text-white">
                <Monitor className="h-3.5 w-3.5" />
                <span className="text-[9px] font-bold">MONITOR 3</span>
              </Button>
              <Button variant="outline" size="sm" className="flex flex-col h-auto py-1.5 gap-0.5 border-primary/20 bg-[#1e293b] text-white">
                <Monitor className="h-3.5 w-3.5" />
                <span className="text-[9px] font-bold">MONITOR 4</span>
              </Button>
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
      <Dialog 
        isOpen={isMgmtPinDialogOpen} 
        onClose={() => setIsMgmtPinDialogOpen(false)}
        title="PIN de Gestión"
        size="sm"
      >
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
              <Button
                key={num}
                variant="outline"
                className="h-14 text-xl font-semibold bg-[#0f172a] border-slate-700 text-white hover:bg-slate-700"
                onClick={() => mgmtPin.length < 4 && setMgmtPin(prev => prev + num)}
              >
                {num}
              </Button>
            ))}
            <Button variant="outline" className="h-14 text-xl font-semibold bg-[#0f172a] border-slate-700 text-white hover:bg-slate-700" onClick={() => setMgmtPin('')}>C</Button>
            <Button variant="outline" className="h-14 text-xl font-semibold bg-[#0f172a] border-slate-700 text-white hover:bg-slate-700" onClick={() => mgmtPin.length < 4 && setMgmtPin(prev => prev + '0')}>0</Button>
            <Button variant="outline" className="h-14 text-xl font-semibold bg-[#0f172a] border-slate-700 text-white hover:bg-slate-700" onClick={() => setMgmtPin(prev => prev.slice(0, -1))}>⌫</Button>
          </div>
          
          <Button
            className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700"
            disabled={mgmtPin.length < 4}
            onClick={() => setIsMgmtPinDialogOpen(false)}
          >
            Confirmar PIN
          </Button>
        </div>
      </Dialog>
    </>
  );
}