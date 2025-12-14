---
Fecha: 2025-12-14
Título: Settings – Cabecera de perfil + Secciones (push)
Descripción: Añadir cabecera de perfil y bloque de secciones en Settings, con navegación push
---

## Feature: Settings – Cabecera de perfil + Secciones (push)

Añadir una cabecera estilo perfil en la pestaña de Settings (avatar con iniciales + nombre del carer) y un bloque superior de secciones tipo iOS (Ayuda, Cuenta, Seguridad, Privacidad, Notificaciones, Apariencia, Accesibilidad). Cada fila navega mediante *push* a una pantalla placeholder separada.

### Objetivo
- Mostrar identidad del carer logueado: avatar con iniciales y nombre completo.
- Ofrecer accesos rápidos a secciones clave: Ayuda, Cuenta, Seguridad, Privacidad, Notificaciones, Apariencia, Accesibilidad.
- Implementar destinos como pantallas placeholder (vacías por ahora) usando navegación *push* y el hook semántico `useNavigation`.

### No-objetivos
- No implementar la lógica funcional de Ayuda/Cuenta/Seguridad ahora.
- No integrar el sistema de temas; `Apariencia` será una placeholder.

### UX Spec
- Cabecera (parte superior de Settings):
  - Avatar circular con iniciales (átomo).
  - Nombre completo del carer (tipografía destacada).
  - Mantener `ScreenLayout` title/subtitle existentes.
- Bloque de secciones (card superior):
  - Filas con icono + título + caption; tocar navega via *push*.
  - Elementos: Ayuda, Cuenta, Seguridad, Privacidad, Configuración de notificaciones, Apariencia, Accesibilidad.
- Las cards existentes abajo (Child Profile, Manage Carers, App Settings, About, Logout) se mantienen.

### Enfoque técnico (Clean + Expo Router)
1. Fuente de datos del carer
   - Crear/usar un hook que resuelva el carer actual (cache/DB) y devuelva `fullName` y `initials`.
   - Fallback i18n-safe (ej. "Usuario desconocido") si no hay datos.

2. Composición UI (Atomic Design)
   - Átomo `InitialsAvatar` (círculo con iniciales).
   - Molécula `CarerProfileHeader` que combina avatar + `Typography`.
   - Renderizar `CarerProfileHeader` al inicio de `src/app/(tabs)/settings/index.tsx` dentro del `ScrollView`.

3. Navegación (push, semántica)
   - Extender `useNavigation` con métodos: `goToHelp`, `goToAccount`, `goToSecurity`, `goToPrivacy`, `goToNotifications`, `goToAppearance`, `goToAccessibility`.
   - Cada método realiza un *push* a la ruta correspondiente bajo `src/app/(tabs)/settings/`.

4. Pantallas placeholder (destinos)
   - Añadir pantallas vacías siguiendo el patrón existente (usar `ScreenLayout`):
     - `src/app/(tabs)/settings/help.tsx`
     - `src/app/(tabs)/settings/account.tsx`
     - `src/app/(tabs)/settings/security.tsx`
     - `src/app/(tabs)/settings/privacy.tsx`
     - `src/app/(tabs)/settings/appearance.tsx`
     - `src/app/(tabs)/settings/accessibility.tsx`
   - Registrar/usar el layout de settings (`_layout.tsx`) si el patrón del repo lo requiere.

### i18n y accesibilidad
- No strings hardcodeadas: añadir keys `page.settings.*` para títulos y descripciones de filas, y `page.<feature>.title/subtitle` para pantallas placeholder.
- Añadir claves a11y: `a11y.button.*` y `a11y.hint.opens-*` para filas/pressables.
- Asegurar `accessibilityRole`, `accessibilityLabel`, `accessibilityHint` y `testID` en componentes interactivos.

### Testabilidad
- `testID` a usar:
  - Cabecera: `screen.settings.header`
  - Filas: `screen.settings.help`, `screen.settings.account`, `screen.settings.security`, `screen.settings.privacy`, `screen.settings.notifications`, `screen.settings.appearance`, `screen.settings.accessibility`
  - Placeholder screens: `screen.settings.<feature>.page`.

### Criterios de aceptación
- La pantalla de Settings muestra una cabecera con avatar de iniciales y nombre del carer.
- El bloque superior renderiza 7 filas y cada una navega *push* a su pantalla placeholder.
- Todas las nuevas pantallas usan `ScreenLayout`, i18n keys y `testID`s; no hay strings hardcodeadas.
