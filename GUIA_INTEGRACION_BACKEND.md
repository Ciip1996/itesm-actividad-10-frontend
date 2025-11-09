# Guía de Integración del Backend - Sistema de Reservaciones

## Resumen

Esta guía proporciona documentación completa para que los desarrolladores frontend integren con el backend del sistema de reservaciones de restaurante construido en Supabase con funcionalidad de insights de OpenAI.

## Configuración Base

### Detalles del Proyecto Supabase
```javascript
const SUPABASE_CONFIG = {
  url: 'https://ucwoxwmiryxnipaxoole.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjd294d21pcnl4bmlwYXhvb2xlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzMTIyOTEsImV4cCI6MjA3Njg4ODI5MX0.zQpc6rVkHU2y0vUy_B5WxV9-XyGiMkdcaxK4LtlEJKw'
};
```

### Inicializar Cliente Supabase
```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  SUPABASE_CONFIG.url,
  SUPABASE_CONFIG.anonKey
);
```

## Autenticación

### Roles de Usuario
- **cliente**: Clientes regulares
- **personal**: Personal del restaurante (gerente, administrador, mesero)
- **administrador**: Administradores del restaurante

### Métodos de Autenticación
1. **Registro con Email/Contraseña**
2. **OAuth Social** (Google, Facebook)
3. **Reservaciones de Invitados** (sin cuenta requerida)

### Implementación de Auth
```javascript
// Registrar nuevo usuario
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: {
      role: 'cliente'
    }
  }
});

// Iniciar sesión
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});

// Obtener usuario actual
const { data: { user } } = await supabase.auth.getUser();
```

## Endpoints de API

### 1. Verificar Disponibilidad
**Endpoint**: `POST /functions/v1/buscar-disponibilidad`

**Propósito**: Verificar horarios disponibles para reservaciones

**Solicitud**:
```javascript
const response = await fetch(`${SUPABASE_CONFIG.url}/functions/v1/buscar-disponibilidad`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`
  },
  body: JSON.stringify({
    fecha: '2025-11-15',
    numero_personas: 4
  })
});
```

**Respuesta**:
```javascript
{
  "data": {
    "disponibles": [
      {
        "hora": "19:00:00",
        "disponible": true,
        "capacidad_restante": 8
      },
      {
        "hora": "19:30:00",
        "disponible": true,
        "capacidad_restante": 6
      }
    ]
  }
}
```

### 2. Crear Reservación
**Endpoint**: `POST /functions/v1/crear-reserva`

**Propósito**: Crear una nueva reservación

**Solicitud**:
```javascript
const response = await fetch(`${SUPABASE_CONFIG.url}/functions/v1/crear-reserva`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`
  },
  body: JSON.stringify({
    fecha: '2025-11-15',
    hora: '19:30:00',
    numero_personas: 4,
    nombre_cliente: 'Juan Pérez',
    email_cliente: 'juan@email.com',
    telefono_cliente: '555-1234',
    notas: 'Mesa cerca de ventana'
  })
});
```

**Respuesta**:
```javascript
{
  "data": {
    "folio": "ABC123XYZ",
    "estado": "pendiente",
    "mensaje": "Reservación creada exitosamente"
  }
}
```

### 3. Generar Reportes con Insights de IA
**Endpoint**: `POST /functions/v1/generar-reporte`

**Propósito**: Generar reportes de negocio con insights impulsados por IA

**Solicitud**:
```javascript
const response = await fetch(`${SUPABASE_CONFIG.url}/functions/v1/generar-reporte`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`
  },
  body: JSON.stringify({
    tipo_reporte: 'insights_ia',
    fecha_desde: '2025-11-01',
    fecha_hasta: '2025-11-30'
  })
});
```

**Respuesta**:
```javascript
{
  "data": {
    "metadata": {
      "tipo_reporte": "insights_ia",
      "fecha_generacion": "2025-11-08T01:07:38.784Z",
      "periodo": {
        "desde": "2025-11-01",
        "hasta": "2025-11-30"
      }
    },
    "data": {
      "tipo": "insights_ia",
      "resumen_analisis": {
        "total_reservas": 16,
        "reservas_confirmadas": 8,
        "reservas_canceladas": 4,
        "tasa_confirmacion": 50,
        "tasa_cancelacion": 25,
        "promedio_personas": "4.2"
      },
      "insights_generados": 1,
      "insights": [
        {
          "tipo": "operacional",
          "titulo": "Análisis Básico",
          "contenido": "Período 2025-11-01 a 2025-11-30: 16 reservas analizadas. Tasa confirmación: 50.0%.",
          "metadatos": {
            "categoria": "fill rate",
            "impacto": "alto"
          },
          "confianza_score": 0.8
        }
      ]
    }
  }
}
```

### 4. Operaciones del Panel de Administración
**Endpoint**: `POST /functions/v1/admin-panel`

**Propósito**: Operaciones administrativas para el personal del restaurante

**Solicitud**:
```javascript
const response = await fetch(`${SUPABASE_CONFIG.url}/functions/v1/admin-panel`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`
  },
  body: JSON.stringify({
    action: 'get_dashboard_stats',
    fecha_inicio: '2025-11-01',
    fecha_fin: '2025-11-30'
  })
});
```

**Respuesta**:
```javascript
{
  "data": {
    "reservas_hoy": 12,
    "ocupacion_actual": 85,
    "reservas_pendientes": 3,
    "ingresos_estimados": 2400
  }
}
```

### 5. Enviar Notificaciones
**Endpoint**: `POST /functions/v1/enviar-notificacion`

**Propósito**: Enviar notificaciones por email/SMS a clientes

**Solicitud**:
```javascript
const response = await fetch(`${SUPABASE_CONFIG.url}/functions/v1/enviar-notificacion`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`
  },
  body: JSON.stringify({
    tipo: 'confirmacion',
    reserva_id: 123,
    destinatario: 'cliente@email.com',
    datos_reserva: {
      folio: 'ABC123',
      fecha: '2025-11-15',
      hora: '19:30:00'
    }
  })
});
```

## Esquema de Base de Datos

### Tablas Principales

#### `reservas` (Reservaciones)
```sql
- id_reserva: bigint (clave primaria)
- fecha: date
- hora: time
- personas: smallint
- estado: text ('pendiente', 'confirmada', 'cancelada')
- id_usuario: uuid (nullable, para usuarios registrados)
- nombre_invitado: text (nullable, para reservaciones de invitados)
- email_invitado: text
- telefono_invitado: text
- folio: text (código único de reservación)
- notas: text
- motivo_cancelacion: text
- created_at: timestamptz
```

#### `usuarios` (Usuarios)
```sql
- id_usuario: uuid (clave primaria, enlaza con auth.users)
- nombre: text
- apellido: text
- telefono: text
- rol: text ('cliente', 'gerente', 'administrador', 'mesero')
- activo: boolean
- preferencias: jsonb
```

#### `insights_ia` (Insights de IA)
```sql
- id: bigint (clave primaria)
- tipo_insight: text
- titulo: text
- contenido: text
- periodo_inicio: date
- periodo_fin: date
- metadatos: jsonb
- confianza_score: real
- created_at: timestamptz
```

#### `mesa` (Mesas)
```sql
- id: bigint (clave primaria)
- numero_mesa: text
- capacidad: smallint
- ubicacion: text
- activa: boolean
- estado: text ('disponible', 'ocupada', 'mantenimiento')
```

## Suscripciones en Tiempo Real

### Suscribirse a Cambios en Reservaciones
```javascript
const subscription = supabase
  .channel('reservas_changes')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'reservas'
  }, (payload) => {
    console.log('Cambio recibido!', payload);
    // Actualizar UI en consecuencia
  })
  .subscribe();
```

### Suscribirse a Cambios en Perfil de Usuario
```javascript
const subscription = supabase
  .channel('user_profile')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'usuarios',
    filter: `id_usuario=eq.${user.id}`
  }, (payload) => {
    console.log('Perfil actualizado!', payload);
  })
  .subscribe();
```

## Ejemplos de Integración Frontend

### 1. Flujo de Reservación
```javascript
// Paso 1: Verificar disponibilidad
const checkAvailability = async (fecha, personas) => {
  const response = await fetch(`${SUPABASE_CONFIG.url}/functions/v1/buscar-disponibilidad`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`
    },
    body: JSON.stringify({ fecha, numero_personas: personas })
  });

  const { data } = await response.json();
  return data.disponibles;
};

// Paso 2: Crear reservación
const createReservation = async (reservationData) => {
  const response = await fetch(`${SUPABASE_CONFIG.url}/functions/v1/crear-reserva`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`
    },
    body: JSON.stringify(reservationData)
  });

  const { data } = await response.json();
  return data;
};

// Uso
const handleBooking = async () => {
  const availableSlots = await checkAvailability('2025-11-15', 4);
  const selectedSlot = availableSlots[0]; // Usuario seleccionó slot

  const reservation = await createReservation({
    fecha: '2025-11-15',
    hora: selectedSlot.hora,
    numero_personas: 4,
    nombre_cliente: 'Juan Pérez',
    email_cliente: 'juan@email.com'
  });

  console.log('Reservación creada:', reservation.folio);
};
```

### 2. Panel de Administración con Insights de IA
```javascript
const loadDashboardData = async () => {
  // Cargar estadísticas básicas
  const statsResponse = await fetch(`${SUPABASE_CONFIG.url}/functions/v1/admin-panel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`
    },
    body: JSON.stringify({
      action: 'get_dashboard_stats'
    })
  });

  // Cargar insights de IA
  const insightsResponse = await fetch(`${SUPABASE_CONFIG.url}/functions/v1/generar-reporte`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`
    },
    body: JSON.stringify({
      tipo_reporte: 'insights_ia',
      fecha_desde: '2025-11-01',
      fecha_hasta: '2025-11-30'
    })
  });

  const stats = await statsResponse.json();
  const insights = await insightsResponse.json();

  return { stats: stats.data, insights: insights.data.data };
};
```

### 3. Gestión de Perfil de Usuario
```javascript
const updateUserProfile = async (userId, profileData) => {
  const { data, error } = await supabase
    .from('usuarios')
    .update(profileData)
    .eq('id_usuario', userId)
    .select();

  if (error) throw error;
  return data;
};

const getUserReservations = async (userId) => {
  const { data, error } = await supabase
    .from('reservas')
    .select('*')
    .eq('id_usuario', userId)
    .order('fecha', { ascending: false });

  if (error) throw error;
  return data;
};
```

## Seguridad y Row Level Security (RLS)

### Políticas de Acceso para Clientes
- Los usuarios solo pueden ver sus propias reservaciones
- Los usuarios solo pueden modificar sus propias reservaciones (si es futuro)
- Los usuarios admin pueden ver y modificar todas las reservaciones

### Ejemplo de Implementación
```javascript
// Esto se maneja automáticamente por las políticas RLS de Supabase
// Solo asegurar autenticación apropiada

const { data: userReservations } = await supabase
  .from('reservas')
  .select('*')
  // RLS filtra automáticamente a las reservaciones del usuario
  .order('fecha', { ascending: false });
```

## Manejo de Errores

### Patrones de Error Comunes
```javascript
const handleApiError = (error) => {
  if (error.message.includes('Invalid login credentials')) {
    return 'Credenciales de acceso inválidas';
  }

  if (error.message.includes('Reservation not found')) {
    return 'Reservación no encontrada';
  }

  if (error.message.includes('Time slot not available')) {
    return 'Horario no disponible';
  }

  return 'Error inesperado. Intente nuevamente.';
};

// Uso en componentes
try {
  const result = await createReservation(data);
  // Manejo de éxito
} catch (error) {
  const errorMessage = handleApiError(error);
  setError(errorMessage);
}
```

## Pruebas

### Configuración de Datos de Prueba
```javascript
// Crear reservación de prueba
const createTestReservation = async () => {
  const { data, error } = await supabase
    .from('reservas')
    .insert({
      fecha: '2025-12-25',
      hora: '19:00:00',
      personas: 4,
      estado: 'confirmada',
      nombre_invitado: 'Usuario de Prueba',
      email_invitado: 'test@example.com'
    })
    .select()
    .single();

  return data;
};
```

### Pruebas de API
```javascript
// Probar todos los endpoints
const testAllEndpoints = async () => {
  const tests = [
    {
      name: 'Verificar Disponibilidad',
      endpoint: '/functions/v1/buscar-disponibilidad',
      body: { fecha: '2025-12-25', numero_personas: 2 }
    },
    {
      name: 'Generar Insights de IA',
      endpoint: '/functions/v1/generar-reporte',
      body: {
        tipo_reporte: 'insights_ia',
        fecha_desde: '2025-11-01',
        fecha_hasta: '2025-11-30'
      }
    }
  ];

  for (const test of tests) {
    try {
      const response = await fetch(`${SUPABASE_CONFIG.url}${test.endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`
        },
        body: JSON.stringify(test.body)
      });

      const result = await response.json();
      console.log(`${test.name}:`, result);
    } catch (error) {
      console.error(`${test.name} falló:`, error);
    }
  }
};
```

## Lista de Verificación de Despliegue

### Variables de Entorno
Asegurar que estén configuradas en el frontend:
```javascript
const ENV = {
  SUPABASE_URL: 'https://ucwoxwmiryxnipaxoole.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
};
```

### Dependencias
```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.45.4",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}
```

## Soporte

Para problemas técnicos o preguntas:
1. Revisar los logs del dashboard de Supabase
2. Verificar estado de autenticación
3. Probar endpoints individualmente
4. Revisar políticas RLS si ocurren problemas de acceso

---

**Última Actualización**: 8 de noviembre de 2025
**Versión**: 1.0
**Estado del Backend**: Totalmente Operacional