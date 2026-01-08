import React from 'react';
import { Eye, AlertCircle } from 'lucide-react';

const ReadOnlyBanner = () => {
    return (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <div className="flex-1">
                    <h3 className="text-blue-400 font-semibold text-sm">Modo Solo Lectura</h3>
                    <p className="text-blue-300/80 text-xs mt-1">
                        Este dashboard es solo para visualización. Para realizar cambios, usa la aplicación de escritorio UBOX POS.
                    </p>
                </div>
                <AlertCircle className="w-4 h-4 text-blue-400/60 flex-shrink-0" />
            </div>
        </div>
    );
};

export default ReadOnlyBanner;
