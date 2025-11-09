-- ============================================
-- SOLUCIÓN RÁPIDA: Desactivar RLS (SOLO DESARROLLO)
-- ============================================
-- Copia y pega esto en el SQL Editor de Supabase
-- Dashboard: https://supabase.com/dashboard/project/ucwoxwmiryxnipaxoole/sql

-- Desactivar RLS en usuarios y reservas
ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE reservas DISABLE ROW LEVEL SECURITY;

-- ¡Listo! Ahora recarga tu aplicación y el login debería funcionar perfectamente.

-- ⚠️ ADVERTENCIA: Esta solución es SOLO para desarrollo.
-- Para producción, usa el archivo: supabase-rls-policies.sql
