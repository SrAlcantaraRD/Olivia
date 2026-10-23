# Feature: PRD v2 (Oliva v2 — plataforma de cateterismo pediátrico multi-actor)

## Resumen
Construir desde cero el PRD completo de la v2 de la herramienta de cateterismo
intermitente, con roadmap desde el MVP por versiones `major.minor.patch`.

## Decisiones de producto cerradas (usuario, 2026-10-21)
- Acceso compartido regido por **protección de datos (RGPD) + RBAC** (el usuario
  escribió "RGBA" y lo aclaró como "protección de datos y RBAC").
- **Móvil primero**: Expo iOS/Android en el MVP; web escolar más adelante.
- **MVP = núcleo familiar**: el padre crea el perfil del niño en la nube, registra
  cateterismos y comparte acceso con un profesional sanitario.
- **Integraciones**: informe PDF primero (MVP+1); APIs de salud oficiales
  (FHIR/Histonia) después.
- **Ampliación de alcance (usuario, misma sesión)**: el producto no es solo
  cateterismos — motor de módulos multi-condición (alergias, diabetes,
  medicación); notas de profesional por **audio→texto** (transcripción con
  revisión humana); **push notifications** (transaccionales en MVP,
  recordatorios en 2.4.0).

## Supuestos declarados
- Producto real con ambición de despliegue (cientos de colegios, miles de
  usuarios), no solo TFG.
- Stack v2: Expo + Supabase + StyleSheet (no Uniwind), DDD + Atomic Design como
  en pachanga-app-mobile.
- La v1 local-first (SQLite + sync QR) sigue existiendo como app; la v2 es una
  plataforma nueva con backend Supabase.
- El PRD de la v2 no migra datos de la v1 (queda como decisión abierta D1).

## Tareas
- [x] T1: Estructurar PRD v2 — visión, problema, objetivos, usuarios, no-goals
- [x] T2: Modelar dominio DDD v2 (contextos, agregados, roles/RBAC)
- [x] T3: Especificar requisitos funcionales y no funcionales (RGPD, seguridad, offline)
- [x] T4: Diseñar roadmap por versiones major.minor.patch desde el MVP
- [x] T5: Revisión de coherencia, claridad y cierre (cognitive-doc-design)
- [x] T6: Ampliar PRD: módulos multi-condición, voz→texto, push notifications

## Evidencia
- Entregable: `docs/PRD_v2.md` (392 líneas, 12 secciones + checklist + next step).
- Anclas internas verificadas (`#decisiones-clave`, `#8-...`, `#6-...`, `#7-...`).
- IDs de requisitos (PF/PR/SC/TR) coherentes entre §6 y §8; errata
  «break-greak» → «break-glass» corregida.
- Ampliación T6: 34 ediciones aplicadas; sin términos obsoletos («dictado»,
  «transcribed»); IDs PF-10/PF-11/TR-02 y D6 añadidos con doble referencia.
- Commit: pendiente de autorización del usuario (no se commitea sin pedido).
