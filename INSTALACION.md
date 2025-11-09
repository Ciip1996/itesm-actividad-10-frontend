# 🚀 Guía de Instalación y Ejecución

## Sistema de Reservaciones - Frontend React + TypeScript

Este documento proporciona instrucciones paso a paso para instalar y ejecutar el proyecto.

---

## 📋 Prerequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

Verifica las versiones instaladas:

```bash
node --version
npm --version
```

---

## 🔧 Instalación

### 1. Clonar o navegar al repositorio

Si ya estás en el directorio del proyecto, continúa con el paso 2.

### 2. Instalar dependencias

```bash
npm install
```

Este comando instalará todas las dependencias necesarias definidas en `package.json`:

- React 18.3
- TypeScript 5.5
- Vite 5.4
- Supabase Client 2.45
- React Router 6
- SCSS
- Y más...

### 3. Configurar variables de entorno

El archivo `.env` ya está creado con las credenciales de Supabase:

```env
VITE_SUPABASE_URL=https://ucwoxwmiryxnipaxoole.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Nota:** Estas credenciales son las del backend ya configurado según la `GUIA_INTEGRACION_BACKEND.md`.

---

## 🏃 Ejecución

### Modo Desarrollo

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en: **http://localhost:5173**

El servidor de desarrollo incluye:

- ✅ Hot Module Replacement (HMR)
- ✅ Recarga automática al guardar cambios
- ✅ Mensajes de error detallados

### Construir para Producción

Para crear una build optimizada:

```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `/dist`.

### Vista Previa de Producción

Para previsualizar la build de producción localmente:

```bash
npm run preview
```

---

## 🎯 Casos de Uso Implementados

### 1. **Autenticación de Usuarios**

**Registro:**

- Navega a `/register`
- Completa el formulario con:
  - Nombre y apellido
  - Teléfono (10 dígitos)
  - Correo electrónico
  - Contraseña (mínimo 6 caracteres)
- El sistema crea automáticamente el perfil en Supabase

**Inicio de Sesión:**

- Navega a `/login`
- Ingresa correo y contraseña
- Acceso instantáneo al sistema

### 2. **Crear Nueva Reservación**

**Flujo completo:**

1. Desde la página principal o `/reservations/new`
2. **Paso 1:** Selecciona fecha y número de personas
3. Click en "Ver Disponibilidad"
4. **Paso 2:** Sistema muestra horarios disponibles
5. Completa información del cliente
6. Agrega notas especiales (opcional)
7. Confirma reservación
8. Recibe folio único de confirmación

**Características:**

- ✅ Verificación de disponibilidad en tiempo real
- ✅ Validación de fechas (hasta 90 días adelante)
- ✅ Límite de personas por reservación (1-12)
- ✅ Generación automática de folio

### 3. **Gestión de Reservaciones**

**Ver Mis Reservaciones:**

- Navega a `/reservations`
- Visualiza todas tus reservaciones
- Filtradas automáticamente por usuario autenticado
- Muestra estado (Pendiente, Confirmada, Cancelada)

**Cancelar Reservación:**

- Desde la lista de reservaciones
- Click en "Cancelar"
- Confirmación de seguridad
- Actualización inmediata del estado

---

## 🏗️ Arquitectura del Proyecto

```
src/
├── components/
│   ├── atoms/              # Componentes más pequeños (Button, Input, Card, etc.)
│   ├── molecules/          # Combinaciones de átomos (FormField, ReservationCard)
│   └── organisms/          # Componentes complejos (Forms, Lists, Dashboards)
├── pages/                  # Páginas de la aplicación
│   ├── Home/              # Página principal
│   ├── Login/             # Inicio de sesión
│   ├── Register/          # Registro de usuarios
│   ├── Reservations/      # Lista de reservaciones
│   └── NewReservation/    # Crear nueva reservación
├── services/              # Servicios de API y Supabase
│   ├── supabase.ts       # Cliente de Supabase
│   ├── auth.service.ts   # Servicio de autenticación
│   ├── reservation.service.ts  # Servicio de reservaciones
│   └── admin.service.ts  # Servicio de administración
├── hooks/                 # Custom React Hooks
│   ├── useAuth.tsx       # Hook de autenticación
│   └── useReservations.ts # Hook de reservaciones
├── types/                 # Definiciones TypeScript
├── utils/                 # Funciones utilitarias
│   ├── date.utils.ts     # Utilidades de fechas
│   ├── error.utils.ts    # Manejo de errores
│   ├── validation.utils.ts # Validaciones
│   └── format.utils.ts   # Formateo de datos
├── styles/                # Estilos globales SCSS
│   ├── variables.scss    # Variables de diseño
│   ├── mixins.scss       # Mixins reutilizables
│   └── global.scss       # Estilos globales
└── config/                # Configuración
    └── index.ts          # Configuración de la app
```

---

## 🎨 Convenciones de Código

### TypeScript

- ✅ Tipado estricto activado
- ✅ Interfaces para todos los tipos de datos
- ✅ Props tipadas para componentes
- ✅ Enums para valores constantes

### SCSS con BEM

```scss
// Bloque
.button {
}

// Elemento
.button__content {
}

// Modificador
.button--primary {
}
.button--loading {
}
```

### Componentes React

- ✅ Componentes funcionales con TypeScript
- ✅ Props interfaces exportadas
- ✅ Archivo index.ts para exports limpios
- ✅ Separación de lógica y presentación

---

## 🔌 Integración con Backend

El frontend está completamente integrado con el backend de Supabase:

### Endpoints Utilizados

1. **Autenticación**

   - Sign Up: `supabase.auth.signUp()`
   - Sign In: `supabase.auth.signInWithPassword()`
   - Sign Out: `supabase.auth.signOut()`

2. **Reservaciones**

   - Verificar disponibilidad: `POST /functions/v1/buscar-disponibilidad`
   - Crear reservación: `POST /functions/v1/crear-reserva`
   - Listar reservaciones: Query directa a tabla `reservas`
   - Cancelar: Update a tabla `reservas`

3. **Tiempo Real**
   - Suscripciones a cambios en tabla `reservas`
   - Actualizaciones automáticas de perfil

---

## 🧪 Testing y Validación

### Scripts de Desarrollo

```bash
# Verificar errores de TypeScript
npm run type-check

# Ejecutar linter
npm run lint

# Build de producción
npm run build
```

### Flujo de Prueba Manual

1. **Test de Registro:**

   - Registrar nuevo usuario
   - Verificar creación de perfil en Supabase
   - Confirmar redirección a `/reservations`

2. **Test de Reservación:**

   - Seleccionar fecha futura
   - Verificar disponibilidad
   - Crear reservación
   - Confirmar generación de folio

3. **Test de Gestión:**
   - Ver lista de reservaciones
   - Cancelar una reservación
   - Verificar actualización de estado

---

## 📱 Responsive Design

La aplicación es completamente responsive:

- **Mobile First:** Diseñada primero para móviles
- **Breakpoints:**
  - sm: 576px
  - md: 768px
  - lg: 992px
  - xl: 1200px
  - 2xl: 1400px

---

## 🎥 Preparación para el Video Demostrativo

### Puntos Clave a Mostrar

1. **Integración Técnica (40%)**

   - Conexión con Supabase
   - Llamadas a API en tiempo real
   - Manejo de estados y errores
   - Autenticación funcionando

2. **Funcionalidad (25%)**

   - Caso de uso 1: Registro y creación de reservación
   - Caso de uso 2: Gestión y cancelación de reservación
   - Validaciones y manejo de errores

3. **Diseño y UX (20%)**

   - Interfaz limpia y profesional
   - Navegación intuitiva
   - Responsive design
   - Feedback visual (loading, alerts)

4. **Arquitectura (15%)**
   - Estructura de carpetas (Atomic Design)
   - Separación de responsabilidades
   - Código limpio y mantenible
   - TypeScript y tipado

---

## 🚨 Troubleshooting

### Error: Cannot find module

```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Error: Port 5173 already in use

```bash
# Especificar otro puerto
npm run dev -- --port 3000
```

### Error: Supabase connection

- Verificar que `.env` existe y tiene las variables correctas
- Confirmar que el backend de Supabase está activo

---

## 📞 Contacto y Soporte

Para preguntas o issues:

- Revisar logs en la consola del navegador
- Verificar Network tab para llamadas API
- Consultar documentación de Supabase

---

**✅ ¡El proyecto está listo para ejecutarse y demostrarse!**

Recuerda ejecutar `npm install` primero y luego `npm run dev` para comenzar.
