import React, { useEffect, useState } from 'react';
import { Package, Loader2, Search, Filter, Plus } from 'lucide-react';
import api from '../lib/api';

type Product = {
    id: string;
    name: string;
    price: number;
    stock: number;
    category: string;
    updatedAt: string;
};

const Inventory = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const businessId = localStorage.getItem('businessId');
            if (!businessId) return;

            const response = await api.get('/products', {
                headers: { 'x-business-id': businessId }
            });

            if (response.data.success) {
                setProducts(response.data.data);
            }
        } catch (err: any) {
            setError('Error al cargar inventario');
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
                    <h1 className="text-2xl font-bold text-white">Inventario</h1>
                    <p className="text-slate-400">Gestiona tus productos y existencias.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">
                    <Plus className="w-5 h-5" />
                    Nuevo Producto
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-4 bg-[#1e293b] p-4 rounded-xl border border-slate-800">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input 
                        type="text" 
                        placeholder="Buscar producto..." 
                        className="w-full bg-[#0f172a] border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#0f172a] border border-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors">
                    <Filter className="w-5 h-5" />
                    Categoría
                </button>
            </div>

            {/* Products List */}
            <div className="bg-[#1e293b] rounded-xl border border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-800 bg-slate-900/50">
                                <th className="p-4 text-sm font-medium text-slate-400">Producto</th>
                                <th className="p-4 text-sm font-medium text-slate-400">Categoría</th>
                                <th className="p-4 text-sm font-medium text-slate-400">Precio</th>
                                <th className="p-4 text-sm font-medium text-slate-400">Stock</th>
                                <th className="p-4 text-sm font-medium text-slate-400">Última Actualización</th>
                                <th className="p-4 text-sm font-medium text-slate-400">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <Package className="w-8 h-8 opacity-50" />
                                            <p>No hay productos registrados aún.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                                        <td className="p-4 font-medium text-white">{product.name}</td>
                                        <td className="p-4 text-sm text-slate-300">
                                            <span className="px-2 py-1 bg-slate-700 rounded text-xs">
                                                {product.category || 'Sin categoría'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm font-bold text-white">
                                            ${Number(product.price).toFixed(2)}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                product.stock > 10 
                                                ? 'bg-green-500/10 text-green-500' 
                                                : product.stock > 0
                                                ? 'bg-yellow-500/10 text-yellow-500'
                                                : 'bg-red-500/10 text-red-500'
                                            }`}>
                                                {product.stock} un.
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-slate-400">
                                            {new Date(product.updatedAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            <button className="text-blue-500 hover:text-blue-400 text-sm font-medium">
                                                Editar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Inventory;