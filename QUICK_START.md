# 🚀 Quick Start Guide

## Sistema de Reservaciones - Frontend React

---

## ⚡ Instalación Rápida

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev
```

**La aplicación estará en:** http://localhost:5173

---

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── atoms/           # Botones, Inputs, Cards, etc.
│   ├── molecules/       # FormField, ReservationCard
│   └── organisms/       # Componentes complejos
├── pages/               # Home, Login, Register, Reservations
├── services/            # auth.service, reservation.service
├── hooks/               # useAuth, useReservations
├── types/               # TypeScript interfaces
├── utils/               # Utilidades (date, error, validation)
├── styles/              # Variables SCSS, mixins, global
└── config/              # Configuración de la app
```

---

## 🎯 Funcionalidades Principales

### 1. Autenticación

- ✅ Registro de usuarios
- ✅ Inicio de sesión
- ✅ Rutas protegidas
- ✅ Context API para estado global

### 2. Reservaciones

- ✅ Verificar disponibilidad
- ✅ Crear reservación (2 pasos)
- ✅ Ver mis reservaciones
- ✅ Cancelar reservaciones

### 3. UX/UI

- ✅ Diseño responsive
- ✅ Loading states
- ✅ Manejo de errores
- ✅ Validaciones en tiempo real

---

## 🔧 Scripts Disponibles

```bash
npm run dev        # Desarrollo (http://localhost:5173)
npm run build      # Build de producción
npm run preview    # Preview de build
npm run lint       # Linter
npm run type-check # Verificar TypeScript
```

---

## 🌐 Rutas de la Aplicación

### Públicas

- `/` - Home
- `/login` - Iniciar sesión
- `/register` - Registrarse

### Protegidas (requieren autenticación)

- `/reservations` - Mis reservaciones
- `/reservations/new` - Nueva reservación

---

## 🔑 Variables de Entorno

El archivo `.env` ya está configurado con:

```env
VITE_SUPABASE_URL=https://ucwoxwmiryxnipaxoole.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

---

## 🎨 Stack Tecnológico

- **React 18.3** - Framework UI
- **TypeScript 5.5** - Tipado estático
- **Vite 5.4** - Build tool
- **SCSS** - Estilos con BEM
- **Supabase** - Backend (Auth + Database)
- **React Router 6** - Enrutamiento

---

## 📚 Documentación Completa

1. **INSTALACION.md** - Guía detallada de instalación
2. **DOCUMENTACION_TECNICA.md** - Arquitectura y patrones
3. **GUIA_VIDEO.md** - Script para video demostrativo
4. **GUIA_INTEGRACION_BACKEND.md** - Documentación del backend

---

## ✨ Características Destacadas

### Atomic Design

Componentes organizados en:

- **Átomos**: Button, Input, Card, Badge, Spinner, Alert
- **Moléculas**: FormField, ReservationCard
- **Organismos**: Forms, Lists
- **Páginas**: Vistas completas

### TypeScript Estricto

- Tipos para todo
- Interfaces exportadas
- Enums para constantes
- Type safety garantizado

### SCSS + BEM

```scss
.button {
} // Bloque
.button__content {
} // Elemento
.button--primary {
} // Modificador
```

### Clean Code

- Funciones pequeñas
- Nombres descriptivos
- Separación de responsabilidades
- Comentarios JSDoc

---

## 🧪 Prueba Rápida

1. **Registrar usuario**

   ```
   Navega a /register
   Completa formulario
   → Crea cuenta automáticamente
   ```

2. **Crear reservación**

   ```
   Click "Nueva Reservación"
   Selecciona fecha y personas
   Click "Ver Disponibilidad"
   Elige horario y confirma
   → Recibe folio de confirmación
   ```

3. **Ver reservaciones**
   ```
   Navega a /reservations
   → Lista de todas tus reservaciones
   ```

---

## 🐛 Troubleshooting

### Port 5173 en uso

```bash
npm run dev -- --port 3000
```

### Reinstalar dependencias

```bash
rm -rf node_modules package-lock.json
npm install
```

### Error de Supabase

- Verifica que `.env` existe
- Confirma credenciales correctas

---

## 📝 Checklist de Desarrollo

- [x] Estructura base del proyecto
- [x] Configuración TypeScript + Vite
- [x] Servicios de Supabase
- [x] Componentes atómicos
- [x] Páginas principales
- [x] Hooks personalizados
- [x] Estilos SCSS + BEM
- [x] Rutas y navegación
- [x] Autenticación completa
- [x] CRUD de reservaciones

---

## 🎓 Mejores Prácticas Aplicadas

✅ **Atomic Design** - Componentes reusables  
✅ **TypeScript** - Type safety  
✅ **BEM** - Nomenclatura CSS  
✅ **Clean Code** - Código limpio  
✅ **SOLID** - Principios de diseño  
✅ **DRY** - Don't Repeat Yourself  
✅ **Separation of Concerns** - Responsabilidades claras

---

## 📞 Soporte

Para problemas o preguntas:

1. Revisa la documentación en archivos .md
2. Verifica console del navegador
3. Revisa Network tab para API calls
4. Consulta logs de Supabase

---

## ✅ Proyecto Listo

El sistema está **100% funcional** y listo para:

- ✅ Desarrollo local
- ✅ Testing
- ✅ Demostración en video
- ✅ Despliegue a producción

---

**Happy Coding! 🚀**

```bash
npm install && npm run dev
```
