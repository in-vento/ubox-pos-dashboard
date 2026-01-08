import React, { useEffect, useState } from 'react';
import { BookOpen, Loader2, Search, Tag, Package } from 'lucide-react';
import api from '../lib/api';
import ReadOnlyBanner from '../components/ReadOnlyBanner';

const Catalog = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [businessId] = useState(localStorage.getItem('businessId'));

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!businessId) return;
                const response = await api.get('/products', {
                    headers: { 'x-business-id': businessId }
                });
                if (response.data.success) {
                    setProducts(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching catalog data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [businessId]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <ReadOnlyBanner />

            <div>
                <h1 className="text-2xl font-bold text-white">Catálogo de Productos</h1>
                <p className="text-slate-400">Consulta la lista completa de productos y precios.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map(product => (
                    <div key={product.id} className="bg-[#1e293b] rounded-2xl border border-slate-800 overflow-hidden hover:border-blue-500/50 transition-all group">
                        <div className="aspect-square bg-slate-900 flex items-center justify-center border-b border-slate-800">
                            <Package className="w-12 h-12 text-slate-700 group-hover:text-blue-500/50 transition-colors" />
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-white text-sm truncate flex-1">{product.name}</h3>
                                <span className="text-blue-500 font-bold text-sm">S/ {product.price.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Tag className="w-3 h-3 text-slate-500" />
                                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{product.category || 'Sin Categoría'}</span>
                            </div>
                            <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center">
                                <span className="text-[10px] text-slate-500">Stock disponible</span>
                                <span className={`text-xs font-bold ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {product.stock} und
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Catalog;
