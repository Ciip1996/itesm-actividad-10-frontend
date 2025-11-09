# 🎥 Guía para Video Demostrativo - Actividad 10

## Sistema de Reservaciones: Integración Backend y Frontend

**Duración máxima:** 7 minutos  
**Objetivo:** Demostrar integración fluida entre backend (Supabase) y frontend (React + TypeScript)

---

## 📋 Estructura del Video (7 minutos)

### **Introducción (30 segundos)**

- Presentación del sistema
- Mención de tecnologías: React 18, TypeScript, Supabase, SCSS
- Vista general de la aplicación

---

## 🎯 Parte 1: Integración Técnica (40% - ~2.5 minutos)

### 1.1 Arquitectura del Proyecto (45 segundos)

**Mostrar:**

```
- Estructura de carpetas (Atomic Design)
  └── src/
      ├── components/ (atoms, molecules, organisms)
      ├── pages/
      ├── services/ ← DESTACAR
      ├── hooks/
      └── types/
```

**Explicar:**

- "Seguimos Atomic Design para componentes reusables"
- "Servicios centralizados para todas las llamadas al backend"
- "TypeScript para type safety completo"

### 1.2 Conexión con Supabase (30 segundos)

**Mostrar código:**

```typescript
// src/services/supabase.ts
export const supabase = createClient(
  SUPABASE_CONFIG.url,
  SUPABASE_CONFIG.anonKey
);
```

**Explicar:**

- "Cliente Supabase singleton inicializado con credenciales seguras"
- "Variables de entorno para configuración"

### 1.3 Servicios de Backend (45 segundos)

**Mostrar archivo:** `src/services/reservation.service.ts`

**Código clave:**

```typescript
static async checkAvailability(params) {
  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/buscar-disponibilidad`,
    {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${TOKEN}` },
      body: JSON.stringify(params)
    }
  );
  return response.json();
}
```

**Explicar:**

- "Llamadas directas a Supabase Functions"
- "Manejo estructurado de requests/responses"
- "TypeScript garantiza tipos correctos"

### 1.4 Custom Hooks (30 segundos)

**Mostrar:** `src/hooks/useReservations.ts`

**Explicar:**

- "Hooks personalizados encapsulan lógica de negocio"
- "Manejo automático de loading y errores"
- "Separación de concerns: UI vs lógica"

---

## 🎯 Parte 2: Funcionalidad - Caso de Uso 1 (25% - ~1.5 minutos)

### **Registro y Primera Reservación**

#### Paso 1: Registro de Usuario (30 segundos)

**Demostrar:**

1. Navegar a `/register`
2. Llenar formulario:
   - Nombre: Juan
   - Apellido: Pérez
   - Teléfono: 5551234567
   - Email: juan@example.com
   - Contraseña: Test123!

**Explicar mientras haces:**

- "Validaciones en tiempo real"
- "Al enviar, se crea usuario en Supabase Auth"
- "Y automáticamente perfil en tabla usuarios"

**Mostrar brevemente código:**

```typescript
await signUp(email, password, {
  nombre,
  apellido,
  telefono,
  rol: "cliente",
});
// Crea auth user + perfil en DB
```

#### Paso 2: Crear Reservación (60 segundos)

**Demostrar:**

1. Automáticamente redirigido al sistema
2. Click "Nueva Reservación"
3. **Paso 1:** Seleccionar:
   - Fecha: [próxima semana]
   - Personas: 4
   - Click "Ver Disponibilidad"

**Explicar:**

- "Sistema consulta disponibilidad en tiempo real"
- "Backend retorna horarios libres"

4. **Paso 2:**
   - Seleccionar horario (ej: 19:30)
   - Confirmar datos pre-llenados
   - Agregar nota: "Mesa cerca de ventana"
   - Click "Confirmar"

**Mostrar:**

- Mensaje de éxito con folio
- Redirección a lista de reservaciones

**Código relevante:**

```typescript
const slots = await checkAvailability({ fecha, personas });
// → Backend devuelve: [{ hora: "19:30", disponible: true }]

await createReservation(data);
// → Backend crea reserva y retorna folio
```

---

## 🎯 Parte 3: Funcionalidad - Caso de Uso 2 (25% - ~1.5 minutos)

### **Gestión de Reservaciones**

#### Paso 1: Ver Reservaciones (30 segundos)

**Mostrar:**

- Pantalla `/reservations`
- Lista de reservaciones del usuario
- Cada card muestra:
  - Folio
  - Fecha y hora
  - Badge de estado (Confirmada/Pendiente)
  - Número de personas
  - Notas

**Explicar:**

- "Datos filtrados automáticamente por usuario"
- "Row Level Security de Supabase garantiza privacidad"
- "Actualización en tiempo real"

**Código:**

```typescript
const reservations = await getUserReservations(userId);
// RLS automáticamente filtra por usuario
```

#### Paso 2: Cancelar Reservación (30 segundos)

**Demostrar:**

1. Click en "Cancelar" en una reservación
2. Confirmar en diálogo
3. Mostrar actualización inmediata:
   - Badge cambia a "Cancelada"
   - Color rojo
   - Botón de cancelar desaparece

**Explicar:**

- "Estado actualizado en backend"
- "UI reactiva al cambio"
- "Validación y confirmación de seguridad"

#### Paso 3: Manejo de Errores (30 segundos)

**Demostrar:**

1. Intentar crear reservación con fecha pasada
2. Mostrar mensaje de error amigable

**Explicar:**

- "Validaciones en frontend y backend"
- "Mensajes de error claros para el usuario"
- "Manejo robusto de excepciones"

---

## 🎯 Parte 4: Diseño y UX (20% - ~1.5 minutos)

### 4.1 Interfaz y Diseño (45 segundos)

**Mostrar navegando:**

- Home page atractiva
- Formularios limpios y claros
- Cards bien diseñadas
- Colores consistentes (primarios: #2c3e50, #e67e22)

**Explicar:**

- "Diseño coherente con sistema de colores"
- "Metodología BEM para estilos organizados"
- "SCSS con variables reutilizables"

### 4.2 Responsive Design (30 segundos)

**Demostrar:**

1. Abrir DevTools
2. Cambiar a vista móvil
3. Navegar por la app
4. Mostrar que todo funciona perfectamente

**Explicar:**

- "Diseño Mobile First"
- "Breakpoints para tablet, desktop"
- "Mismo código, múltiples dispositivos"

### 4.3 Elementos Interactivos (15 segundos)

**Mostrar:**

- Loading spinners durante peticiones
- Alerts de success/error
- Botones con estados disabled
- Hover effects

**Explicar:**

- "Feedback visual constante"
- "Usuario siempre sabe qué está pasando"

---

## 🎯 Parte 5: Arquitectura y Código (15% - ~1 minuto)

### 5.1 Clean Code (20 segundos)

**Mostrar archivos:**

```
src/components/atoms/Button/
├── Button.tsx        ← Componente
├── Button.scss       ← Estilos
└── index.ts          ← Export limpio
```

**Explicar:**

- "Un componente, un archivo"
- "Props tipadas con TypeScript"
- "Reusables y componibles"

### 5.2 TypeScript (20 segundos)

**Mostrar código:**

```typescript
interface Reservation {
  id_reserva: number;
  fecha: string;
  hora: string;
  estado: ReservationStatus;
  // ...
}

const createReservation = async (
  data: CreateReservationDTO
): Promise<ReservationResponse> => {
  // Tipos garantizados
};
```

**Explicar:**

- "Type safety en toda la aplicación"
- "Autocomplete y validación en desarrollo"
- "Menos bugs en producción"

### 5.3 Separación de Responsabilidades (20 segundos)

**Diagrama mostrar:**

```
Components (UI)
    ↓
Hooks (Lógica de estado)
    ↓
Services (API calls)
    ↓
Supabase (Backend)
```

**Explicar:**

- "Cada capa tiene una responsabilidad clara"
- "Fácil de mantener y testear"
- "Escalable para crecer"

---

## 🎬 Cierre (30 segundos)

### Resumen de Logros

**Mencionar:**

- ✅ "Integración completa backend-frontend funcional"
- ✅ "Dos casos de uso end-to-end demostrados"
- ✅ "Arquitectura sólida con mejores prácticas"
- ✅ "Diseño profesional y responsive"
- ✅ "Manejo robusto de errores"
- ✅ "TypeScript para type safety"

### Cierre

- "Sistema listo para producción"
- "Código limpio, mantenible y escalable"
- "Gracias por ver la demostración"

---

## 📝 Tips para Grabar

### Antes de grabar:

1. ✅ Ejecutar `npm run dev`
2. ✅ Abrir en navegador limpio (sin extensiones)
3. ✅ Preparar datos de prueba
4. ✅ Cerrar pestañas innecesarias
5. ✅ Tener código listo para mostrar

### Durante la grabación:

- 🎤 Hablar claro y pausado
- 👆 Usar cursor para señalar código importante
- ⏱️ Cronometrar cada sección
- 🔄 Ensayar flujo antes
- 📹 Grabar en 1080p mínimo

### Herramientas recomendadas:

- **OBS Studio** o **Loom** para grabar pantalla
- **VS Code** con tema claro para mejor visibilidad
- **Chrome DevTools** para mostrar responsive

---

## 🎯 Puntos Clave a Enfatizar

### Integración Técnica (40%)

1. Cliente Supabase configurado
2. Servicios estructurados para cada endpoint
3. Manejo correcto de autenticación
4. TypeScript para type safety

### Funcionalidad (25%)

1. Flujo completo de registro → reservación
2. Gestión y cancelación funcionando
3. Validaciones en tiempo real
4. Manejo de errores elegante

### Diseño UX (20%)

1. Interfaz limpia y profesional
2. Responsive en todos los dispositivos
3. Feedback visual constante
4. Navegación intuitiva

### Arquitectura (15%)

1. Atomic Design implementado
2. Separación de responsabilidades clara
3. Código limpio y mantenible
4. Extensibilidad demostrada

---

## ✅ Checklist Pre-Video

- [ ] Proyecto funciona sin errores
- [ ] Backend Supabase está activo
- [ ] Datos de prueba preparados
- [ ] Script del video revisado
- [ ] Entorno de grabación listo
- [ ] Cronómetro visible
- [ ] Código importante marcado
- [ ] Flujo ensayado 2-3 veces

---

**¡Éxito en tu presentación! 🚀**

Este sistema demuestra dominio completo de la integración frontend-backend moderna.
