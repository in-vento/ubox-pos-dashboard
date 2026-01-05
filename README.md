# UBOX POS - Web Dashboard

Panel de control web para dueños de negocios UBOX POS. Permite monitorear ventas, reportes y dispositivos en tiempo real desde cualquier lugar.

##  Tecnologías

- **React + TypeScript**
- **Vite** (Build tool)
- **Tailwind CSS** (Estilos)
- **Lucide React** (Iconos)
- **Recharts** (Gráficos)
- **Axios** (API)

##  Instalación

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Configurar variables de entorno:
   Crea un archivo `.env` en la raíz:
   ```env
   VITE_API_URL=http://localhost:3001/api
   ```

3. Iniciar en desarrollo:
   ```bash
   npm run dev
   ```

##  Estructura

- `src/components`: Componentes reutilizables (Layout, Sidebar, etc.)
- `src/pages`: Páginas principales (Login, Dashboard)
- `src/lib`: Utilidades y cliente API
- `src/hooks`: Hooks personalizados

##  Despliegue

Este proyecto está listo para ser desplegado en **Vercel**, **Netlify** o cualquier hosting estático.
