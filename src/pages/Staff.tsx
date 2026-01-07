import React, { useEffect, useState } from 'react';
import { Users, Loader2, UserPlus, Shield } from 'lucide-react';
import api from '../lib/api';

type User = {
    id: string;
    name: string;
    email: string;
    role: string;
};

const Staff = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const businessId = localStorage.getItem('businessId');
            if (!businessId) return;

            const response = await api.get(`/business/${businessId}/users`);

            if (response.data.success) {
                // Transform the response to match the User type if necessary
                // The API returns UserBusiness objects which contain the user and role
                const staffList = response.data.data.map((item: any) => ({
                    id: item.user.id,
                    name: item.user.name,
                    email: item.user.email,
                    role: item.role
                }));
                setUsers(staffList);
            }
        } catch (err: any) {
            setError('Error al cargar personal');
            console.error(err);
        } finally {
            setIsLoading(false);
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
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Personal</h1>
                    <p className="text-slate-400">Gestiona el equipo de trabajo y sus permisos.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">
                    <UserPlus className="w-5 h-5" />
                    Invitar Usuario
                </button>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((user) => (
                    <div key={user.id} className="bg-[#1e293b] border border-slate-800 rounded-xl p-6 flex flex-col gap-4">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold text-lg">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">{user.name}</h3>
                                    <p className="text-sm text-slate-400">{user.email}</p>
                                </div>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                                user.role === 'OWNER' ? 'bg-purple-500/10 text-purple-500' :
                                user.role === 'ADMIN' ? 'bg-blue-500/10 text-blue-500' :
                                'bg-slate-700 text-slate-300'
                            }`}>
                                {user.role}
                            </span>
                        </div>
                        
                        <div className="pt-4 border-t border-slate-700/50 flex justify-between items-center">
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <Shield className="w-3 h-3" />
                                {user.role === 'OWNER' ? 'Acceso Total' : 'Acceso Limitado'}
                            </div>
                            <button className="text-sm text-slate-400 hover:text-white transition-colors">
                                Gestionar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Staff;