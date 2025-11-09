-- ============================================
-- POLÍTICAS RLS PARA LA APLICACIÓN DE RESERVAS
-- ============================================
-- Ejecuta este script en el SQL Editor de Supabase
-- Dashboard: https://supabase.com/dashboard/project/ucwoxwmiryxnipaxoole/editor

-- ============================================
-- OPCIÓN 1: SOLUCIÓN RÁPIDA (DESARROLLO ONLY)
-- ============================================
-- Descomenta estas líneas para desactivar RLS temporalmente:
-- ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE reservas DISABLE ROW LEVEL SECURITY;
-- ADVERTENCIA: Solo para desarrollo, NO usar en producción

-- ============================================
-- OPCIÓN 2: SOLUCIÓN SEGURA (RECOMENDADA)
-- ============================================

-- Primero, eliminar políticas existentes si las hay
DROP POLICY IF EXISTS "Los usuarios pueden ver su propio perfil" ON usuarios;
DROP POLICY IF EXISTS "Los usuarios pueden actualizar su propio perfil" ON usuarios;
DROP POLICY IF EXISTS "Permitir insertar perfil al registrarse" ON usuarios;
DROP POLICY IF EXISTS "Los administradores pueden ver todos los perfiles" ON usuarios;
DROP POLICY IF EXISTS "Los usuarios pueden ver sus propias reservas" ON reservas;
DROP POLICY IF EXISTS "Los usuarios pueden crear reservas" ON reservas;
DROP POLICY IF EXISTS "Los usuarios pueden actualizar sus reservas" ON reservas;
DROP POLICY IF EXISTS "Los usuarios pueden cancelar sus reservas" ON reservas;
DROP POLICY IF EXISTS "Permitir ver reservas por email de invitado" ON reservas;

-- ====================
-- TABLA: usuarios
-- ====================

-- Habilitar RLS en la tabla usuarios
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- POLÍTICA SIMPLE: Usuarios autenticados pueden hacer todo con su perfil
CREATE POLICY "Usuarios autenticados pueden ver su perfil"
ON usuarios
FOR SELECT
TO authenticated
USING (auth.uid() = id_usuario);

CREATE POLICY "Usuarios autenticados pueden actualizar su perfil"
ON usuarios
FOR UPDATE
TO authenticated
USING (auth.uid() = id_usuario)
WITH CHECK (auth.uid() = id_usuario);

CREATE POLICY "Usuarios autenticados pueden insertar su perfil"
ON usuarios
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id_usuario);

-- ====================
-- TABLA: reservas
-- ====================

-- Habilitar RLS en la tabla reservas
ALTER TABLE reservas ENABLE ROW LEVEL SECURITY;

-- POLÍTICA SIMPLE: Usuarios autenticados pueden hacer todo con sus reservas
CREATE POLICY "Usuarios autenticados pueden ver sus reservas"
ON reservas
FOR SELECT
TO authenticated
USING (auth.uid() = id_usuario OR id_usuario IS NULL);

CREATE POLICY "Usuarios autenticados pueden crear reservas"
ON reservas
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id_usuario OR id_usuario IS NULL);

CREATE POLICY "Usuarios autenticados pueden actualizar sus reservas"
ON reservas
FOR UPDATE
TO authenticated
USING (auth.uid() = id_usuario)
WITH CHECK (auth.uid() = id_usuario);

-- ====================
-- NOTA IMPORTANTE
-- ====================
-- Después de ejecutar este script:
-- 1. Ve a Authentication > Policies en el dashboard de Supabase
-- 2. Verifica que las políticas se crearon correctamente
-- 3. Prueba el login nuevamente

-- ============================================
-- VERIFICACIÓN
-- ============================================
-- Para verificar que las políticas se crearon correctamente, ejecuta:
-- SELECT schemaname, tablename, policyname FROM pg_policies WHERE tablename IN ('usuarios', 'reservas');

-- ============================================
-- ROLLBACK (en caso de problemas)
-- ============================================
-- Si necesitas volver atrás, ejecuta:
-- DROP POLICY IF EXISTS "Usuarios autenticados pueden ver su perfil" ON usuarios;
-- DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar su perfil" ON usuarios;
-- DROP POLICY IF EXISTS "Usuarios autenticados pueden insertar su perfil" ON usuarios;
-- DROP POLICY IF EXISTS "Usuarios autenticados pueden ver sus reservas" ON reservas;
-- DROP POLICY IF EXISTS "Usuarios autenticados pueden crear reservas" ON reservas;
-- DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar sus reservas" ON reservas;
-- ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE reservas DISABLE ROW LEVEL SECURITY;
