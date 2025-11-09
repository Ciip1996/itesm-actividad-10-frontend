# Sistema de Reservaciones de Restaurante

Sistema moderno de reservaciones para restaurantes construido con React, TypeScript, SCSS y Supabase.

## 🚀 Tecnologías

- **React 18.3** - Biblioteca de UI
- **TypeScript 5.5** - Tipado estático
- **Vite 5.4** - Build tool y dev server
- **SCSS** - Preprocesador CSS con metodología BEM
- **Supabase** - Backend as a Service (Auth, Database, Real-time)
- **React Router 6** - Enrutamiento
- **Date-fns** - Manipulación de fechas

## 🏗️ Arquitectura

El proyecto sigue el patrón **Atomic Design** con una estructura modular y escalable:

```
src/
├── components/
│   ├── atoms/          # Componentes más pequeños (Button, Input, etc.)
│   ├── molecules/      # Combinación de átomos (FormField, Card, etc.)
│   ├── organisms/      # Componentes complejos (Forms, Lists, etc.)
│   └── templates/      # Layouts de página
├── pages/              # Páginas de la aplicación
├── services/           # Servicios de API y Supabase
├── hooks/              # Custom React Hooks
├── types/              # Definiciones de TypeScript
├── utils/              # Funciones utilitarias
├── styles/             # Estilos globales y variables SCSS
└── config/             # Configuración de la app
```

## 📋 Prerequisitos

- Node.js >= 18.0.0
- npm >= 9.0.0

## 🔧 Instalación

1. Clonar el repositorio
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Copiar `.env.example` a `.env` y configurar las variables de entorno
4. Ejecutar en modo desarrollo:
   ```bash
   npm run dev
   ```

## 🛠️ Scripts Disponibles

- `npm run dev` - Iniciar servidor de desarrollo
- `npm run build` - Construir para producción
- `npm run preview` - Preview de build de producción
- `npm run lint` - Ejecutar ESLint
- `npm run type-check` - Verificar tipos TypeScript

## 🎨 Convenciones de Código

- **TypeScript**: Uso estricto de tipos
- **SCSS + BEM**: Metodología de nomenclatura CSS
- **Clean Code**: Funciones pequeñas, nombres descriptivos
- **Componentes**: Máxima reutilización y composición

## 📦 Características Principales

- ✅ Sistema de autenticación completo
- ✅ Reservaciones en tiempo real
- ✅ Panel de administración con insights de IA
- ✅ Gestión de perfil de usuario
- ✅ Notificaciones automáticas
- ✅ Dashboard con métricas y estadísticas
- ✅ Responsive design

## 👥 Roles de Usuario

- **Cliente**: Crear y gestionar reservaciones
- **Personal**: Ver y administrar reservaciones
- **Administrador**: Acceso completo al sistema

## 📄 Licencia

Este proyecto es parte de la Actividad 10 del curso.
