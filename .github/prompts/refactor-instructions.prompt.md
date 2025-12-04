---
description: 'Guía clara y accionable para generar nuevos ficheros `instructions.md` basados en archivos de .github/backups, creando versiones normalizadas en .github/instructions con nomenclatura específica.'
---

# Copilot Instructions: instructions

## Purpose
- **Propósito**: Definir normas precisas y verificables para generar nuevos ficheros `instructions.md` basados en los archivos de .github/backups, normalizando y creando versiones limpias en .github/instructions con nomenclatura específica por capa y tipo.

## Applies to
- **Patrón**: Archivos en `.github/backups/` (como artifacts, instructions, etc.)
- **Ámbito**: Generar nuevos ficheros `instructions.md` en `.github/instructions/` que describan reglas para un tipo concreto de fichero en el repo, basados en el contenido de backups.

## Nomenclatura de archivos generados
- Los archivos generados deben seguir el patrón: `{layer}.{number}.{description}.instructions.md`
- Ejemplos de nomenclatura:
  - adapters.instructions.md
  - database.1.database-schema.instructions.md
  - database.2.adapter.instructions.md
  - domain.1.entity.instructions.md
  - domain.2.dto.instructions.md
  - domain.3.mapper.instructions.md
  - heroui.0.core-native.instructions.md
  - heroui.0.core.instructions.md
  - heroui.1.hook-port-adapter.instructions.md
  - ui.i18n.instructions.md
  - ui.atomic-design.instructions.md
  - etc...

## Responsibilities & boundaries
- **Qué hacer**: Generar nuevos `instructions.md` basados en el contenido de archivos de .github/backups, manteniendo intención funcional y arquitectura del repo.
- **Qué evitar**: No inventar tecnologías, rutas ni instrucciones externas no presentes en el fichero original de backups.
- **Alcance**: Sólo reglas aplicables al `<TYPE>` indicado; reglas globales mínimas permitidas.

## Conventions
- **Front matter**: El fichero final siempre debe empezar con YAML `---` que contenga `description` y `applyTo`.
- **Estructura**: Los archivos generados deben seguir esta estructura estándar:
  - Front matter YAML.
  - # {Tipo} Instructions (e.g., Domain Entity Instructions).
  - ## Purpose
  - ## Rules
    - ### Subsecciones específicas (e.g., Basic Structure, Advanced Constraints).
  - ### Example (con código TypeScript si aplica).
- **Formato**: Markdown limpio, encabezados claros y listas cortas (máx. 1–2 frases por bullet).
- **Lenguaje**: Imperativo y verificable: usar "debe", "nunca", "siempre", "evita".
- **Longitud**: Máximo 100 líneas por fichero final.
- **File naming**: `<layer>.<number>.<description>.instructions.md`

## Process (pasos obligatorios)
- **Identificar**: Basado en el archivo correspondiente de .github/backups; inferir el `appyTo` por contenido. Si la inferencia no es segura, usar `**/*.ts`.
- **Front matter**: Normalizar o crear `applyTo` y `description`.
- **Filtrar reglas**: Mantener sólo reglas aplicables al `<TYPE>`. Mover reglas globales a "Global (mínimo necesario)".
- **Unificar duplicidades**: Fusionar reglas equivalentes; priorizar seguridad > calidad > consistencia > estilo.
- **Verificabilidad**: Reescribir vaguedades en reglas comprobables.
- **Recorte**: Si excede 100 líneas, priorizar reglas de seguridad y arquitectura; recortar estilo.

## Global (mínimo necesario)
- **Seguridad**: Nunca incluir instrucciones que comprometan seguridad o privacidad.
- **No inventar**: No añadir nombres de herramientas, rutas o comandos no presentes en el original.
- **Consistencia**: Mantener terminología del repo (p. ej. "adapter", "port", "domain") si aparecen en el fichero original.

## Do / Don't
- **Do**: Mantén el foco en el `<TYPE>` y produce un fichero listo para pegar.
- **Do**: Usa YAML front matter con `applyTo` coherente.
- **Don't**: No amplíes el alcance ni añadas nuevas dependencias.
- **Don't**: Evites párrafos largos o reglas ambiguas.

## Testing / Acceptance
- **Criterios**:
  - Front matter presente y correcta.
  - Estructura estándar seguida: Front matter, # Título, ## Purpose, ## Rules con subsecciones, ### Example.
  - Reglas aplicables al `<TYPE>` únicamente.
  - Lenguaje imperativo y verificable.
  - Máx. 100 líneas.
- **Salida esperada**: Conjuto completo de ficheros Markdown guardardados en la carpeta `.github/instructions`.
