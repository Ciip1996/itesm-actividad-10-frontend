# 📚 Documentación Técnica del Proyecto

## Sistema de Reservaciones - Frontend React + TypeScript

---

## 🎯 Resumen Ejecutivo

Este proyecto es un **sistema completo de reservaciones para restaurante** construido con las tecnologías más modernas y siguiendo las mejores prácticas de desarrollo frontend.

### Tecnologías Principales

- **React 18.3** - Framework de UI
- **TypeScript 5.5** - Tipado estático
- **Vite 5.4** - Build tool ultra-rápido
- **SCSS** - Preprocesador CSS con metodología BEM
- **Supabase** - Backend as a Service
- **React Router 6** - Enrutamiento SPA

---

## 🏗️ Arquitectura y Patrones

### Atomic Design (Adaptado)

El proyecto sigue una aproximación de **Atomic Design** para organizar los componentes:

```
Átomos → Moléculas → Organismos → Templates → Páginas
```

#### 1. Átomos (Atoms)

Componentes más pequeños y reusables:

- **Button**: Botón con variantes (primary, secondary, success, error, warning, ghost)
- **Input**: Campo de entrada con validación
- **Card**: Contenedor con sombras y padding configurable
- **Badge**: Etiqueta de estado
- **Spinner**: Indicador de carga
- **Alert**: Mensajes de notificación

**Características:**

- ✅ Altamente reusables
- ✅ Props tipadas con TypeScript
- ✅ Estilos modulares con SCSS + BEM
- ✅ Variantes configurables

#### 2. Moléculas (Molecules)

Combinaciones de átomos:

- **FormField**: Campo de formulario con label y error
- **TextField**: Input + FormField integrado
- **ReservationCard**: Card + Badge + Buttons para mostrar reservaciones

**Características:**

- ✅ Componentes de negocio específicos
- ✅ Composición de átomos
- ✅ Lógica de presentación encapsulada

#### 3. Organismos (Organisms)

En este proyecto, algunos organismos están dentro de las páginas:

- **ReservationForm**: Formulario completo de reservación
- **ReservationList**: Lista de reservaciones del usuario

#### 4. Páginas (Pages)

Vistas completas de la aplicación:

- **Home**: Landing page con CTA
- **Login**: Autenticación de usuarios
- **Register**: Registro de nuevos usuarios
- **Reservations**: Lista de reservaciones del usuario
- **NewReservation**: Crear nueva reservación (2 pasos)

---

## 🔧 Servicios y Capa de Datos

### Arquitectura de Servicios

```
Components → Hooks → Services → Supabase/API
```

#### AuthService

Maneja toda la autenticación:

```typescript
-signUp(email, password, userData) -
  signIn(email, password) -
  signOut() -
  getCurrentUser() -
  getUserProfile(userId) -
  updateUserProfile(userId, updates) -
  onAuthStateChange(callback);
```

#### ReservationService

Gestión de reservaciones:

```typescript
-checkAvailability(params) -
  createReservation(data) -
  getUserReservations(userId) -
  getReservationById(id) -
  cancelReservation(id, motivo) -
  updateReservationStatus(id, estado);
```

#### AdminService

Funciones administrativas:

```typescript
-getDashboardStats(fecha_inicio, fecha_fin) -
  generateReport(params) -
  getAllReservations(filters) -
  sendNotification(data);
```

---

## 🪝 Custom Hooks

### useAuth

Hook principal de autenticación:

```typescript
const {
  user, // Usuario actual
  loading, // Estado de carga
  signIn, // Función para iniciar sesión
  signUp, // Función para registrarse
  signOut, // Función para cerrar sesión
  isAuthenticated, // Boolean de autenticación
  hasRole, // Verificar rol del usuario
} = useAuth();
```

**Características:**

- ✅ Context API para estado global
- ✅ Escucha cambios de autenticación en tiempo real
- ✅ Carga automática del perfil del usuario

### useReservations

Hook para gestión de reservaciones:

```typescript
const {
  loading, // Estado de carga
  error, // Errores
  checkAvailability, // Verificar horarios disponibles
  createReservation, // Crear reservación
  getUserReservations, // Obtener reservaciones del usuario
  cancelReservation, // Cancelar reservación
} = useReservations();
```

**Características:**

- ✅ Manejo automático de estados (loading/error)
- ✅ Funciones memoizadas con useCallback
- ✅ Mensajes de error amigables

---

## 🎨 Sistema de Diseño

### Variables SCSS

#### Colores

```scss
// Primarios
$color-primary: #2c3e50
$color-secondary: #e67e22

// Estados
$color-success: #27ae60
$color-warning: #f39c12
$color-error: #e74c3c
$color-info: #3498db

// Neutros
$color-gray-100 hasta $color-gray-900
```

#### Espaciado

```scss
$spacing-xs: 0.25rem    // 4px
$spacing-sm: 0.5rem     // 8px
$spacing-md: 1rem       // 16px
$spacing-lg: 1.5rem     // 24px
$spacing-xl: 2rem       // 32px
$spacing-2xl: 3rem      // 48px
$spacing-3xl: 4rem      // 64px
```

#### Tipografía

```scss
$font-size-xs: 0.75rem     // 12px
$font-size-sm: 0.875rem    // 14px
$font-size-md: 1rem        // 16px
$font-size-lg: 1.125rem    // 18px
$font-size-xl: 1.25rem     // 20px
$font-size-2xl: 1.5rem     // 24px
$font-size-3xl: 1.875rem   // 30px
$font-size-4xl: 2.25rem    // 36px
```

### Metodología BEM

Todos los componentes siguen BEM:

```scss
// Bloque
.button {
}

// Elemento
.button__content {
}
.button__spinner {
}

// Modificador
.button--primary {
}
.button--loading {
}
.button--full-width {
}
```

**Ventajas:**

- ✅ Nombres de clases predecibles
- ✅ Evita conflictos de estilos
- ✅ Facilita mantenimiento
- ✅ Auto-documentado

---

## 🔐 Seguridad

### Row Level Security (RLS)

Implementado en Supabase:

- Los usuarios solo ven sus propias reservaciones
- Las operaciones están protegidas por políticas RLS
- Las rutas protegidas requieren autenticación

### Validaciones

#### Frontend

```typescript
-isValidEmail(email) -
  isValidPhone(phone) -
  isValidPassword(password) -
  isValidName(name) -
  isValidGuestCount(count);
```

#### Backend

- Validaciones en Supabase Functions
- Políticas RLS en tablas
- Autenticación requerida para operaciones sensibles

---

## 📊 Manejo de Estados

### Estados Globales

- **Autenticación**: Context API (AuthProvider)

### Estados Locales

- **Formularios**: useState en componentes
- **Carga/Errores**: Custom hooks

### Estados del Servidor

- **Reservaciones**: Queries directas a Supabase
- **Tiempo Real**: Suscripciones de Supabase

---

## 🌐 Enrutamiento

### Rutas Públicas

```
/ - Home
/login - Iniciar sesión
/register - Registrarse
```

### Rutas Protegidas

```
/reservations - Mis reservaciones
/reservations/new - Nueva reservación
```

### Protected Route Component

```typescript
<ProtectedRoute>
  <ComponenteProtegido />
</ProtectedRoute>
```

**Características:**

- ✅ Verifica autenticación
- ✅ Redirección automática a /login
- ✅ Spinner durante validación

---

## 🔄 Flujos de Usuario

### Flujo de Registro

```
1. Usuario visita /register
2. Completa formulario
3. Sistema crea cuenta en Supabase Auth
4. Sistema crea perfil en tabla usuarios
5. Redirección a /reservations
```

### Flujo de Reservación

```
1. Usuario autenticado va a /reservations/new
2. Selecciona fecha y número de personas
3. Click "Ver Disponibilidad"
4. Sistema consulta horarios disponibles
5. Usuario selecciona horario
6. Completa información
7. Click "Confirmar Reservación"
8. Sistema crea reservación
9. Muestra folio de confirmación
10. Redirección a /reservations
```

### Flujo de Cancelación

```
1. Usuario ve lista de reservaciones
2. Click "Cancelar" en una reservación
3. Confirmación de seguridad
4. Sistema actualiza estado a "cancelada"
5. Actualización inmediata de la lista
```

---

## 🛠️ Utilidades

### Date Utils

```typescript
formatDate(date, format); // Formatear fechas
formatTime(time); // Formatear horas
formatDateTime(date, time); // Fecha + hora
getToday(); // Fecha actual
addDaysToDate(date, days); // Agregar días
isFutureDate(date); // Verificar si es futura
```

### Error Utils

```typescript
getErrorMessage(error); // Mensaje amigable
handleError(error); // Log + mensaje
isAPIError(error); // Verificar tipo
```

### Validation Utils

```typescript
isValidEmail(email);
isValidPhone(phone);
isValidPassword(password);
isValidName(name);
formatPhone(phone);
```

### Format Utils

```typescript
cn(...classes); // Combinar clases
bem(block, element, modifiers); // Generar clases BEM
truncate(text, maxLength); // Truncar texto
capitalize(text); // Capitalizar
toTitleCase(text); // Title case
```

---

## 📱 Responsive Design

### Breakpoints

```scss
sm: 576px   // Tablets pequeñas
md: 768px   // Tablets
lg: 992px   // Laptops
xl: 1200px  // Desktops
2xl: 1400px // Pantallas grandes
```

### Mixins Responsive

```scss
@include responsive("md") {
  // Estilos para tablet y arriba
}
```

### Mobile First

Todos los estilos base son para móvil, luego se agregan media queries para pantallas más grandes.

---

## 🎯 Características Destacadas

### 1. TypeScript Estricto

- ✅ Tipado completo de props
- ✅ Interfaces para todos los datos
- ✅ Enums para valores constantes
- ✅ Type-safety en toda la app

### 2. Clean Code

- ✅ Funciones pequeñas y específicas
- ✅ Nombres descriptivos
- ✅ Separación de responsabilidades
- ✅ Comentarios JSDoc

### 3. Componentes Reusables

- ✅ Atomic Design
- ✅ Props configurables
- ✅ Variantes múltiples
- ✅ Composición sobre herencia

### 4. Performance

- ✅ Vite para builds ultra-rápidos
- ✅ Code splitting automático
- ✅ Lazy loading de rutas
- ✅ Memoización de funciones (useCallback)

### 5. UX Excellence

- ✅ Loading states
- ✅ Error handling
- ✅ Success feedback
- ✅ Validaciones en tiempo real
- ✅ Responsive design

---

## 🔮 Extensibilidad

El proyecto está diseñado para ser fácilmente extensible:

### Agregar nueva página

1. Crear carpeta en `/pages/NuevaPagina`
2. Crear componente y estilos
3. Agregar ruta en `App.tsx`
4. Exportar en `/pages/index.ts`

### Agregar nuevo componente

1. Decidir nivel (atom, molecule, organism)
2. Crear carpeta con Componente.tsx + .scss + index.ts
3. Exportar en índice del nivel

### Agregar nuevo servicio

1. Crear archivo en `/services/nuevo.service.ts`
2. Implementar métodos
3. Exportar en `/services/index.ts`

### Agregar nuevo hook

1. Crear archivo en `/hooks/useNuevo.ts`
2. Implementar lógica
3. Exportar en `/hooks/index.ts`

---

## 📈 Métricas de Calidad

### Estructura

- ✅ Arquitectura modular
- ✅ Separación de concerns
- ✅ Código DRY (Don't Repeat Yourself)

### Mantenibilidad

- ✅ Código auto-documentado
- ✅ Tipado fuerte con TypeScript
- ✅ Patrones consistentes

### Escalabilidad

- ✅ Componentes reusables
- ✅ Servicios independientes
- ✅ Estado centralizado

---

## 🎓 Mejores Prácticas Aplicadas

1. **Atomic Design** - Organización de componentes
2. **BEM** - Nomenclatura CSS
3. **TypeScript** - Type safety
4. **SOLID** - Principios de diseño
5. **DRY** - Don't Repeat Yourself
6. **KISS** - Keep It Simple, Stupid
7. **Separation of Concerns** - Separación de responsabilidades
8. **Composition over Inheritance** - Composición sobre herencia

---

## 📝 Conclusión

Este proyecto demuestra:

✅ **Integración técnica sólida** con Supabase
✅ **Arquitectura frontend moderna** y escalable
✅ **Clean Code** y mejores prácticas
✅ **UX/UI profesional** y responsiva
✅ **TypeScript** para type safety
✅ **Modularización** y reusabilidad
✅ **Manejo robusto** de estados y errores

El sistema está **listo para producción** y preparado para demostrar todos los requisitos de la Actividad 10.

---

**Fecha de creación:** Noviembre 2025  
**Versión:** 1.0.0  
**Estado:** Producción Ready ✅
