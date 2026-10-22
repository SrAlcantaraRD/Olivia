> **Estado: borrador de diseño — no implementado.**
>
> Este documento describe una posible v2 en la nube (Expo + Supabase). **Nada de
> lo que aparece aquí está construido en este repositorio**: la app actual es
> local-first, sin backend, sin cuentas y sin sincronización remota. Las
> referencias a RGPD, RBAC, consentimiento o auditoría son objetivos de diseño,
> no certificaciones ni funcionalidad verificada. No es un compromiso de
> producto ni una base para afirmar cumplimiento normativo.
>
> Estado real del producto: [README](../README.md#status-and-roadmap).

# PRD v2 — Oliva: plataforma de cuidado pediátrico crónico multi-condición con control parental del dato

> **Qué es este documento**: los requisitos del producto v2 de Oliva, reconstruido desde cero sobre Expo + Supabase, con DDD + Atomic Design. La v2 convierte una app local-first de un solo cuidador (cateterismo intermitente) en una plataforma multi-actor (padres, profesionales sanitarios, colegios) donde **el padre/tutor es el único dueño del dato y otorga accesos revocables**, y donde un motor de módulos versátil cubre CIC, alergias, diabetes, medicación y más. Incluye el roadmap por versiones `major.minor.patch` desde el MVP.
>
> **Quién lo lee**: el equipo de producto y desarrollo. Lee primero «Decisiones clave» y el «Roadmap»; el detalle de dominio y seguridad está para consultar, no para leer de corrido.

---

## Quick path

1. Lee [Decisiones clave](#decisiones-clave) (1 minuto).
2. Lee [Roadmap por versiones](#8-roadmap-por-versions-majorminorpatch) para ver el plan completo (5 min).
3. Consulta [Requisitos](#6-requisitos-funcionales-por-rol) y [Seguridad y RGPD](#7-seguridad-privacidad-rgpd-y-rbac) durante el desarrollo.

---

## Decisiones clave

| Tema | Decisión |
|------|----------|
| Dueño del dato | El padre/tutor legal. Nadie más crea, comparte o borra el perfil del niño. |
| Modelo de acceso | **RBAC + grants explícitos**: cada profesional/colegio ve lo que el padre le concede, con expiración y revocación. |
| Objetivo de cumplimiento (no certificado) | RGPD desde el diseño (privacy by design): consentimiento del titular de la patria potestad, minimización, auditoría, portabilidad. Es un objetivo de diseño, no un estado verificado. |
| Stack | Expo (React Native) + Supabase (Auth, Postgres con RLS, Storage, Realtime, Edge Functions) + **StyleSheet** con design tokens + Atomic Design. |
| Arquitectura | Hexagonal + DDD (contextos delimitados), como pachanga-app-mobile. Dominio puro sin dependencias de Expo/Supabase. |
| MVP | Núcleo familiar: padre crea el perfil del niño, registra eventos (CIC y packs base de módulos), comparte acceso con un profesional sanitario que añade notas. |
| Módulos | Motor dinámico heredado de la v1: packs base (CIC, deposiciones, medicación, alergias, diabetes) + módulos personalizados por la familia. |
| Voz | Nota por audio: el profesional graba, la app **transcribe a texto**, revisa y confirma antes de guardar. |
| Notificaciones | Push (Expo Notifications): avisos transaccionales de seguridad y actividad desde el MVP; recordatorios clínicos en 2.4.0. |
| Integraciones oficiales | Primero exportación PDF/informe; después FHIR e Histonia/CatSalut en fases. |
| Plataformas | Móvil primero (iOS/Android); panel web institucional en fases avanzadas. |
| Herencia de la v1 | Se reutiliza el modelo de módulos/registros y los flujos de CIC ya validados; no se migra el código, se reimplementa contra Supabase. |

---

## 1. Visión y problema

### 1.1 Visión

Oliva v2 es la plataforma donde las familias de niñas y niños con cuidados crónicos —cateterismo intermitente (CIC), alergias, diabetes, medicación diaria— concentran su información clínica diaria y deciden, con control total y trazable, quién más puede verla y ampliarla: el urólogo, la enfermera, la fisioterapeuta, la enfermería del colegio o el tutor.

### 1.2 Problema

Hoy la información del cuidado (CIC, alergias, diabetes, pastillas) vive dispersa y sin control:

- **Cientos de colegios, miles de familias y profesionales** coordinan por WhatsApp, papel y memoria.
- Sin trazabilidad: no se sabe quién registró qué, ni quién vio el dato.
- Sin control: compartir el historial significa copiarlo y enviarlo; el padre pierde la propiedad efectiva.
- Acceso desregulado: cualquier persona con el archivo puede ver datos de salud de un menor indefinidamente.
- Registro poco fiable y sin valor clínico agregado (sin series temporales, sin informes).

### 1.3 Principios del producto

1. **El dato es de la familia**. La plataforma lo custodia; nunca lo explota.
2. **Acceso por gracia, no por defecto**. Toda visibilidad de un tercero nace de un grant del padre y queda auditada.
3. **Registro en segundos**. Cualquier evento —un CIC, una toma de medicación, una glucosa, una reacción alérgica— se registra en el momento, con una mano, en el colegio o en casa.
4. **Valor clínico real**. Los profesionales añaden interpretación (notas, informes) sobre datos estructurados.
5. **Offline-resiliente**. Un registro no se pierde por falta de red (madura hacia 2.3.0; el MVP es online-first con guardado optimista).

### 1.4 Usuario objetivo principal

El **padre o tutor legal de una niña/niño de 0–14 años con una condición crónica que exige registro continuo** —CIC, diabetes tipo 1, alergias, medicación diaria— (art. 7 LOPDGDD: los menores de 14 años prestan el consentimiento sus titulares de la patria potestad). Secundarios: profesionales de urología, endocrino, alergología, enfermería y fisioterapia, y personal de enfermería escolar.

---

## 2. Personas y roles

| Rol | Quién es | Qué necesita | Qué nunca debe poder |
|-----|----------|--------------|----------------------|
| **ParentOwner** | Padre/madre/tutor legal que crea el perfil del niño. | Crear el perfil, registrar eventos de cualquier módulo, invitar y revocar accesos, ver auditoría, exportar y borrar todo. | — (es la raíz de autoridad) |
| **CoGuardian** | Segundo tutor (otro padre/tutor con patria potestad). | Mismas capacidades de registro; comparte la autoridad de gestión salvo borrado total. | Borrar el perfil del niño sin el otro tutor (política configurable). |
| **Professional** | Sanitario verificado (urología, enfermería, fisioterapia). | Ver historiales de sus pacientes asignados, añadir notas (voz/texto), generar informes. | Ver niños sin grant, ampliar accesos, borrar registros de la familia. |
| **SchoolStaff** | Enfermería escolar o tutor del centro. | Registrar eventos del colegio (CIC, medicación), ver la ficha básica y el protocolo de cuidado del niño. | Ver historial completo ni notas clínicas (por defecto). |
| **PlatformAdmin** | Equipo de Oliva. | Soporte técnico bajo procedimiento «break-glass» con auditoría y consentimiento. | Acceso clínico rutinario; los datos se miran cifrados o con autorización expresa. |

---

## 3. Lenguaje ubicuo y modelo de dominio (DDD)

### 3.1 Contextos delimitados

| Contexto | Responsabilidad | Agregados raíz |
|----------|-----------------|----------------|
| **Identity & Access** | Cuentas, sesiones, roles, grants, consentimiento, auditoría. | `Account`, `AccessGrant`, `ConsentRecord`, `AuditEvent` |
| **Child Profile** | La ficha del niño y su línea basal clínica. | `Child` |
| **Care Recording** | Motor de módulos: packs base (CIC, deposiciones, medicación, alergias, diabetes) y módulos personalizados; sus registros (hereda la v1). | `Module`, `ModuleField`, `Record`, `RecordField` |
| **Clinical Collaboration** | Notas clínicas (voz/texto), adjuntos e informes. | `ClinicalNote`, `Attachment`, `Report` |
| **Institution** | Colegios y pertenencias temporales. | `School`, `SchoolMembership` |
| **Notification** | Push transaccional (actividad, seguridad) y recordatorios clínicos por horario. | `Reminder`, `Notification`, `PushToken` |
| **Integration** | Exportaciones y conectores con sistemas oficiales. | `ExportJob`, `ExternalConnection` |

### 3.2 Reglas de dominio invariants

- Un `Child` tiene exactamente un `ParentOwner` (raíz) y opcionalmente un `CoGuardian`.
- Toda fila de `Record`, `ClinicalNote` y `Report` pertenece a un `Child`; su visibilidad por terceros se resuelve **solo** por `AccessGrant` vigente.
- Un `AccessGrant` es emitido solo por el `ParentOwner`, apunta a un `Account` ajeno, lleva `scopes[]`, `expiresAt` y `revokedAt`. Sin grant vigente, la consulta devuelve vacío (nunca error que filtre existencia).
- Un `Record` no se edita ni se borra por terceros: los profesionales no mutan datos de la familia, solo añaden sus propias capas (`ClinicalNote`, `Report`).
- Un módulo (`Module`) es una definición versionada que el padre activa, desactiva o personaliza; sus campos se validan con Zod y su mutación **nunca altera** los `Record` ya escritos.
- `SchoolMembership` es un grant con contexto de centro y caducidad por curso escolar.
- Toda mutación sensible escribe un `AuditEvent` (append-only).

### 3.3 Herencia de la v1

Se conservan los conceptos ya validados en la v1: `Module`/`ModuleField` dinámicos, `Record`/`RecordField`, el wizard de CIC (volumen, color, turbidez, molestias, nota) y los roles de cuidador, ahora expresados como `Account` + `AccessGrant`. El motor de módulos se amplía con packs multi-condición (alergias, diabetes, medicación) sin cambiar el modelo. El modelo local SQLite de la v1 no se migra: la v2 arranca con datos frescos en Supabase (decisión asumida; ver §12 Decisiones abiertas).

---

## 4. Arquitectura y stack

| Capa | Elección | Nota |
|------|----------|------|
| App móvil | Expo SDK actual + React Native | iOS y Android desde el MVP. |
| UI | Atomic Design (particles/atoms/molecules/organisms/layouts/screens) + **`StyleSheet.create`** con design tokens | Sin frameworks de estilos runtime; tokens centralizados. |
| Estado/hooks | Hooks por feature (`use-*`) que invocan use-cases | Sin estado global de negocio fuera del dominio. |
| Dominio | TypeScript puro: entities, enums, use-cases, ports (`I*Port`), schemas Zod, `IBaseResponse<T>` | Sin imports de Expo/Supabase en `src/domain/**`. |
| Backend | Supabase: Auth (email OTP), Postgres + **RLS en todas las tablas**, Storage (adjuntos), Realtime (notas), Edge Functions (PDF, webhooks) | RLS + policies atómicas desde el primer día (nunca RLS ON con cero policies). |
| Notificaciones | Expo Notifications (push) + Edge Function de envío | Tokens en tabla con RLS, plantillas i18n, agrupación y silencio nocturno. |
| Sync/offline | MVP: online-first con guardado optimista. 2.3.0: SQLite local + cola de sincronización y resolución de conflictos | Estrategia en §8. |
| Calidad | Jest (unit), integración sobre Postgres/SQLite, E2E de flujos críticos, `pnpm biome:check`, `pnpm typecheck` | Cobertura objetivo ≥ 80 % en dominio. |

**Patrón de datos seguro**: el cliente solo usa la clave publicable; todo acceso pasa por políticas RLS que resuelven `auth.uid()` → `Account` → `AccessGrant` vigente → `Child`. Ninguna política confía en parámetros del cliente para autorizar.

---

## 5. Flujos principales (happy paths)

| # | Flujo | Actor | Resumen |
|---|-------|-------|---------|
| F1 | Onboarding y alta | ParentOwner | Registro por email OTP → crea el perfil del niño (nombre, fecha de nacimiento, diagnóstico, módulos activos). |
| F2 | Registro de CIC | ParentOwner / SchoolStaff | Wizard guiado < 10 s: volumen → color → turbidez → molestias (→ nota) → guardar. |
| F3 | Compartir con profesional | ParentOwner | Busca/introduce al profesional → elige scopes y expiración → el profesional acepta → queda auditado. |
| F4 | Nota por audio | Professional | Abre al niño asignado → graba un audio → la app lo **transcribe a texto** → el profesional revisa y edita → confirma → se guarda `ClinicalNote` con autoría, marca de origen y el audio original adjunto. |
| F5 | Informe PDF | Professional | Selecciona rango → genera informe con encabezado profesional → se comparte con el padre en la app (y exportable). |
| F6 | Revocación | ParentOwner | Revoca un grant → el acceso efectivo termina en el momento → evento de auditoría. |
| F7 | Registro escolar | SchoolStaff | Enfermería registra un evento (CIC, medicación) en horario escolar → el padre recibe push y lo ve en su historial. |
| F8 | Derechos RGPD | ParentOwner | Acceso/portabilidad (exportación) y supresión (borrado completo con verificación). |

---

## 6. Requisitos funcionales por rol

### 6.1 ParentOwner (MVP salvo indicación)

| ID | Requisito | Versión |
|----|-----------|---------|
| PF-01 | Registrarse con email + OTP, sin contraseñas. | 2.0.0 |
| PF-02 | Crear el perfil de un niño: nombre, fecha nacimiento, diagnóstico opcional, módulos activos. | 2.0.0 |
| PF-03 | Registrar un CIC guiado (wizard) y ver historial + resumen por rangos. | 2.0.0 |
| PF-04 | Invitar a un profesional por código/enlace, eligiendo scopes y expiración. | 2.0.0 |
| PF-05 | Ver quién tiene acceso, qué ve y cuándo lo vio (auditoría legible). | 2.0.0 |
| PF-06 | Revocar cualquier acceso de forma inmediata. | 2.0.0 |
| PF-07 | Exportar historial (CSV) — portabilidad RGPD. | 2.0.0 |
| PF-08 | Gestionar varios hijos en la familia. | 2.6.0 |
| PF-09 | Borrar la cuenta y todos los datos (supresión) con confirmación inequívoca. | 2.0.0 |
| PF-10 | Activar/desactivar packs de módulos (CIC, deposiciones, medicación, alergias, diabetes) y editar sus campos. | 2.0.0 |
| PF-11 | Crear módulos personalizados (campos propios) para necesidades no cubiertas por el catálogo. | 2.4.0 |

### 6.2 Professional

| ID | Requisito | Versión |
|----|-----------|---------|
| PR-01 | Ver la lista de niños con acceso concedido y su historial de CIC. | 2.0.0 |
| PR-02 | Añadir notas clínicas de texto. | 2.0.0 |
| PR-03 | Verificación de profesional (nº de colegiado u otro mecanismo). | 2.1.0 |
| PR-04 | Notas por audio: grabación → transcripción automática a texto → revisión/edición → confirmación antes de guardar; se conserva el audio original. | 2.1.0 |
| PR-05 | Adjuntar fotos/documentos al expediente del niño (Storage cifrado). | 2.1.0 |
| PR-06 | Generar informes PDF con encabezado profesional y rango configurable. | 2.1.0 |
| PR-07 | Plantillas de informe y notas reutilizables. | 2.4.0 |

### 6.3 SchoolStaff

| ID | Requisito | Versión |
|----|-----------|---------|
| SC-01 | Registro escolar de CIC u otro módulo (p. ej. medicación) vinculado al niño, con marca de origen «colegio». | 2.2.0 |
| SC-02 | Acceso temporal por curso escolar, renovable por el padre. | 2.2.0 |
| SC-03 | Alta de centro y asignación de personal por el centro (onboarding institucional). | 2.2.0 |
| SC-04 | Vista acotada: protocolo de cuidado del niño, sin historial completo ni notas clínicas. | 2.2.0 |

### 6.4 Transversales

| ID | Requisito | Versión |
|----|-----------|---------|
| TR-01 | Recordatorios push de CIC, medicación u otros módulos por horario configurable. | 2.4.0 |
| TR-02 | Avisos push transaccionales de actividad y seguridad («acceso concedido/revocado», «nueva nota», «nuevo registro escolar»). | 2.0.0 |
| TR-03 | Dashboard analítico: adherencia, tendencias de volumen/color, exportación para consulta. | 2.4.0 |
| TR-04 | Exportación FHIR (Observation/DocumentReference). | 2.5.0 |
| TR-05 | Piloto de integración con servicios oficiales (Histonia/CatSalut) — solo tras validación legal. | 2.5.0 |

---

## 7. Seguridad, privacidad, RGPD y RBAC

### 7.1 RBAC — matriz de scopes

| Scope | ParentOwner | CoGuardian | Professional | SchoolStaff |
|-------|:-----------:|:----------:|:------------:|:-----------:|
| `child:read` | ✔ | ✔ | ✔ (grant) | ✔ (grant, acotado) |
| `child:update` | ✔ | ✔ | ✘ | ✘ |
| `child:delete` | ✔ | ✘* | ✘ | ✘ |
| `module:manage` | ✔ | ✔ | ✘ | ✘ |
| `record:create` | ✔ | ✔ | ✘ | ✔ (grant) |
| `record:read` | ✔ | ✔ | ✔ (grant) | ✘ (por defecto) |
| `record:delete-own` | ✔ | ✔ | ✘ | ✔ (ventana corta) |
| `note:create` | ✘ | ✘ | ✔ | ✘ |
| `note:read` | ✔ | ✔ | ✔ (grant) | ✘ |
| `report:create` | ✘ | ✘ | ✔ | ✘ |
| `report:read` | ✔ | ✔ | ✔ | ✘ |
| `share:grant` / `share:revoke` | ✔ | configurable | ✘ | ✘ |
| `audit:read` | ✔ | ✔ | ✘ | ✘ |

\* El borrado total requiere confirmación del segundo tutor si existe `CoGuardian`.

### 7.2 RGPD

- **Base legal**: consentimiento del titular de la patria potestad para el tratamiento y para cada compartición (registros `ConsentRecord` versionados).
- **Minimización**: los formularios piden solo lo necesario; los colegios ven lo mínimo.
- **Auditoría**: `AuditEvent` append-only (quién, qué, cuándo, desde dónde) visible para el padre.
- **Derechos**: acceso y portabilidad (exportación), rectificación, supresión («borrado total»), oposición; plazos documentados en la política de privacidad.
- **Encargo de tratamiento (DPA)** con Supabase y cualquier proveedor STT/PDF, con datos en regiones UE.
- **DPIA** (evaluación de impacto) antes del piloto con colegios: es tratamiento de datos de salud de menores (categoría especial, art. 9 RGPD).
- **Menores de 14 años**: consentimiento siempre del tutor; la cuenta del niño no existe (no hay login infantil en v2).

### 7.3 Controles técnicos

- RLS en **todas** las tablas; denegación por defecto; políticas resuelven grants vigentes.
- Sesiones con expiración; revocación de sesión al cambiar contraseña/eliminar cuenta.
- Storage con URLs firmadas de corta duración; adjuntos cifrados en reposo.
- Secretos solo en Edge Functions (service role nunca en el cliente).
- Registro de eventos de seguridad (intentos fallidos, cambios de grant) con alertas.
- Auditoría de dependencias y `pnpm biome:check` + tests en CI antes de cada release.

---

## 8. Roadmap por versiones (major.minor.patch)

**Política de versionado**: `major` = cambio de plataforma o de modelo de datos; `minor` = capacidad nueva de producto; `patch` = correcciones, mejoras de rendimiento y seguridad sin cambiar comportamiento anunciado. El producto arranca en **2.0.0** porque la 1.x es la app local actual.

### Resumen del plan

| Versión | Nombre | Fecha objetivo | Hito |
|---------|--------|----------------|------|
| 2.0.0 | MVP Núcleo familiar | Semanas 1–8 | Padre crea perfil, registra eventos (CIC + packs base), comparte con 1 profesional; push transaccional. |
| 2.0.x | Estabilización | Semanas 9–11 | Correcciones, seguridad, tiempos de carga. |
| 2.1.0 | Profesionales | Semanas 12–18 | Notas por audio con transcripción, verificación, adjuntos, informes PDF. |
| 2.2.0 | Colegios | Semanas 19–26 | Centros, enfermería escolar, accesos temporales. |
| 2.3.0 | Continuidad offline | Semanas 27–34 | SQLite local + sync robusta. |
| 2.4.0 | Seguimiento inteligente | Semanas 35–42 | Recordatorios push, dashboard analítico, plantillas, módulos personalizados. |
| 2.5.0 | Integraciones oficiales | Semanas 43–54 | FHIR export, piloto Histonia/CatSalut, API beta. |
| 2.6.0 | Plataforma familiar | Semanas 55–64 | Multi-hijo, web admin de centros, multi-idioma. |
| 3.0.0 | Escala institucional | Trimestre siguiente | Multi-tenant, SSO educativo, API pública con SLA. |

### 2.0.0 — MVP «Núcleo familiar»

**Objetivo**: validar la promesa central — el padre controla el dato y comparte con un profesional.

Entregables:
- Auth por email OTP (Supabase Auth).
- Creación de perfil de niño (PF-01, PF-02).
- Motor de módulos con packs base: CIC, deposiciones, medicación, alergias y diabetes (PF-10).
- Wizard de CIC + historial + resumen básico (PF-03).
- Invitación y revocación de profesional con scopes y expiración (PF-04, PF-06).
- Vista de profesional: lista de niños asignados, historial y nota de texto (PR-01, PR-02).
- Auditoría legible para el padre (PF-05) y exportación CSV (PF-07).
- Supresión de cuenta y datos (PF-09).
- Push transaccional: alta de token y avisos de actividad/seguridad (TR-02).
- RLS completa en todas las tablas + tests de denegación.
- Onboarding en ≤ 5 pantallas.

**Criterios de salida (definition of done)**:
- [ ] Un padre nuevo registra el primer CIC en < 24 h de instalar la app; registro < 10 s.
- [ ] Un profesional sin grant obtiene 0 filas en toda consulta (tests automáticos).
- [ ] Revocación efectiva en < 1 min, verificada en cliente y en RLS.
- [ ] Al menos dos packs no-CIC (alergias, medicación) registrables de extremo a extremo sin escribir código.
- [ ] Aviso push de acceso concedido/revocado entregado en iOS y Android.
- [ ] Cobertura de dominio ≥ 80 %; E2E de F1, F2, F3, F6 en verde.
- [ ] Auditoría registra toda mutación sensible (sin eventos huérfanos).

### 2.0.x — Estabilización

Correcciones de errores, latencia de carga del historial, endurecimiento de seguridad, ajustes de UX según las primeras 20 familias piloto. Sin cambios de alcance anunciado.

### 2.1.0 — «Profesionales»

**Objetivo**: que el profesional pueda trabajar dentro de la app (no solo mirar).

Entregables: verificación de colegiado (PR-03), notas por audio con transcripción a texto y revisión previa a guardar (PR-04), adjuntos cifrados en Storage (PR-05), informes PDF con encabezado profesional (PR-06).

**Criterios de salida**:
- [ ] Ninguna nota de audio se guarda sin revisión y confirmación del texto transcrito; toda nota marca autor + origen y conserva el audio.
- [ ] PDF generado en < 5 s y legible en iOS y Android.
- [ ] Un profesional revocado pierde acceso a notas y PDFs al instante.

### 2.2.0 — «Colegios»

**Objetivo**: el cuidado en el colegio (CIC, medicación) deja de vivir en el papel.

Entregables: alta de centro y personal (SC-03), registros escolares con marca de origen (SC-01), accesos temporales por curso (SC-02), vista acotada del centro (SC-04), aviso al padre de cada registro escolar.

**Criterios de salida**:
- [ ] Un acceso escolar caduca automáticamente al fin del curso sin acción del padre.
- [ ] El SchoolStaff no puede ver historial completo ni notas (tests RLS dedicados).
- [ ] DPIA realizada y aprobada antes del primer centro piloto.

### 2.3.0 — «Continuidad offline»

**Objetivo**: registrar un CIC sin red y sincronizar después sin duplicados ni pérdidas.

Entregables: SQLite local (Drizzle), cola de sincronización, resolución de conflictos (last-write-wins con marca temporal + auditoría de conflictos), modo avión en UI.

**Criterios de salida**:
- [ ] 100 % de registros hechos sin red se sincronizan al recuperarla (fuzz test de conectividad).
- [ ] Ningún duplicado tras reconexión forzada; conflictos visibles para el padre.

### 2.4.0 — «Seguimiento inteligente»

Entregables: recordatorios push por horario (TR-01), dashboard analítico con adherencia y tendencias (TR-03), plantillas de nota e informe (PR-07), módulos personalizados (PF-11).

**Criterios de salida**: recordatorios respetan zona horaria y silencio nocturno; dashboard carga < 2 s con 12 meses de datos.

### 2.5.0 — «Integraciones oficiales»

Entregables: exportación FHIR (TR-04), piloto de conexión con Histonia/CatSalut sujeto a validación legal y técnica (TR-05), API beta acotada para partners.

**Criterios de salida**: mapeo FHIR validado con datos sintéticos; sin datos de menores en sistemas oficiales sin consentimiento específico adicional.

### 2.6.0 — «Plataforma familiar»

Entregables: multi-hijo por familia (PF-08), panel web administrativo para centros, multi-idioma (es/en/ca), onboarding institucional autoservicio.

### 3.0.0 — «Escala institucional»

Multi-tenant por centro con administradores delegados, SSO educativo, API pública con SLA y versión de contrato, cumplimiento con requisitos de administraciones (pendiente de alcance concreto al llegar a 2.6.0).

---

## 9. Métricas de éxito

| Métrica | Objetivo MVP | Momento de medición |
|---------|--------------|---------------------|
| Activación: padre que registra 1er CIC en < 24 h | ≥ 60 % | Semana 1–4 tras alta |
| Tiempo de registro de un CIC | < 10 s (mediana) | Continuo |
| Sharing: padres que conceden ≥ 1 acceso | ≥ 40 % | Semana 2–6 |
| Latencia hasta la primera nota de un profesional tras el grant | < 72 h | Continuo |
| Retención a 30 días de familias | ≥ 50 % | Tras MVP |
| Push: permiso de notificaciones concedido en alta | ≥ 70 % | Semana 1–4 tras alta |
| Módulos: familias con ≥ 2 packs activos | ≥ 50 % | Semana 2–6 |
| Disponibilidad del servicio | ≥ 99,5 % | Continuo |
| Incidentes de seguridad/privacidad | 0 | Continuo |

---

## 10. Riesgos y mitigación

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Misconfiguración de RLS (tablas abiertas o, al revés, inaccesibles) | Crítico | RLS + policies en la misma migración, tests automáticos con JWTs reales, auditoría con asesores de Supabase. |
| Consentimiento inválido (menores de 14, tutor sin patria potestad) | Alto | Flujo de consentimiento explícito, registro versionado, DPIA antes de colegios. |
| Verificación de profesional fraccionable | Alto | Empezar con invitación por el padre (MVP) y añadir verificación en 2.1.0; no exponer datos sin grant. |
| Deriva de alcance (voz+colegios+offline+módulos a la vez) | Alto | Roadmap secuenciado; cada minor tiene criterios de salida cerrados. |
| Complejidad de módulos a medida (configuración errónea por el padre) | Medio | Packs precargados validados con Zod; módulos personalizados con plantillas y validación en servidor; preview antes de activar. |
| Dependencia de STT (voz) de terceros | Medio | STT on-device cuando sea posible; revisión humana obligatoria antes de guardar. |
| Adopción escolar lenta | Medio | Empezar por familias y profesionales; el colegio entra como capítulo propio (2.2.0) con piloto de un centro. |
| Coste/latencia de Supabase a escala | Medio | Índices y RLS eficientes desde el diseño; revisar consumo mensual. |

---

## 11. Fuera de alcance (v2)

- Diagnóstico o recomendación clínica automatizada (IA médica). La transcripción audio→texto no emite juicios clínicos: solo convierte voz en texto para revisión humana.
- Telemedicina o sustitución de la historia clínica hospitalaria.
- Cuenta o login para el propio niño.
- Wearables / lectura automática de dispositivos.
- Web para familias/profesionales (solo panel administrativo de centros desde 2.6.0).
- Migración automática de datos de la v1 local (ver decisión abierta).

---

## 12. Decisiones abiertas (a resolver antes de su versión)

| # | Decisión | Bloquea | Cuándo resolverla |
|---|----------|---------|-------------------|
| D1 | Migración de datos locales de la v1 a la nube (¿export/import manual o automático?). | 2.0.0 | Antes de arrancar el MVP. |
| D2 | Modelo de negocio (¿familias gratuitas + instituciones de pago? ¿suscripción familiar?). | Comunicación y onboarding institucional | Antes de 2.2.0. |
| D3 | Mecanismo de verificación de profesional (colegiado, email institucional, validación manual). | 2.1.0 | Al empezar 2.1.0. |
| D4 | Política de convivencia de `CoGuardian` en el borrado (¿requiere ambos?). | 2.0.0 | Antes del MVP (impacta RLS). |
| D5 | Proveedor y modo de STT para voz. | 2.1.0 | Al empezar 2.1.0. |
| D6 | Límites y tipos permitidos de módulos personalizados (¿campos ilimitados? ¿solo tipos del catálogo?). | 2.4.0 | Al empezar 2.4.0. |

---

## Checklist de aceptación de este PRD

- [x] Problema, usuarios y promesa definidos sin ambigüedad.
- [x] Roles y matriz RBAC cerrados (§7.1).
- [x] Reglas de dominio invariantes listadas (§3.2).
- [x] Requisitos funcionales con versión asignada (§6).
- [x] RGPD: base legal, derechos, DPIA y DPA contemplados (§7.2).
- [x] Roadmap con hitos, entregables y criterios de salida por versión (§8).
- [x] Métricas de éxito medibles (§9).
- [x] Riesgos con mitigación (§10) y fuera de alcance (§11).
- [x] Decisiones abiertas con fecha límite (§12).
- [x] Módulos multi-condición, notas por audio→texto y push cubiertos (§3, §6, §8).

---

## Next step

Elegir y resolver **D1** (migración de la v1) y **D4** (convivencia de tutores), y arrancar el esqueleto del proyecto v2 (monorepo Expo + Supabase con RLS base y contexto Identity & Access) para atacar el 2.0.0.
