
# PRD y PSD – App de seguimiento de cateterismos

## ¿Qué significan PRD y PSD?

### PRD – Product Requirements Document
Documento que define qué problema resuelve el producto y qué debe hacer, desde el punto de vista del negocio y del usuario.

Define el QUÉ y el POR QUÉ.

### PSD – Product / System Specification Document
Documento técnico que define cómo se va a construir el sistema.

Define el CÓMO, sin magia negra ni fe ciega.

---

## PRD – Product Requirements Document

### Visión del producto
Aplicación móvil local-first para el seguimiento del cateterismo intermitente (CIC) en personas con espina bífida, orientada a cuidadores y pacientes pediátricos.

### Problema
- Falta de trazabilidad
- Coordinación deficiente entre cuidadores
- Registro manual poco fiable
- Apps genéricas no adaptadas al contexto clínico real

### Objetivos
- Registro rápido y guiado
- Coordinación entre cuidadores
- Valor clínico real
- Privacidad y control total del dato

### Usuarios
- Cuidador principal
- Cuidador secundario
- Paciente pediátrico
- Profesional sanitario

### Casos de uso
- Configurar paciente
- Registrar CIC
- Registrar deposiciones
- Recibir recordatorios
- Vincular cuidadores por QR
- Sincronizar datos
- Exportar informes

### Requisitos funcionales
- CRUD de registros
- Formularios progresivos
- Recordatorios locales
- Roles y permisos
- Sincronización P2P cifrada
- Exportación PDF/CSV

### Requisitos no funcionales
- RGPD
- Offline-first
- Datos cifrados
- Accesibilidad WCAG 2.1
- Rendimiento en gama media/baja

### Métricas de éxito
- Registro < 10s
- Reducción de olvidos
- Valoración clínica positiva

### Fuera de alcance
- Cloud obligatoria
- Integraciones hospitalarias
- IA avanzada

---

## PSD – Product / System Specification Document

### Arquitectura
- Frontend: React Native + Expo
- Backend: ElysiaJS
- Datos: Drizzle ORM + SQLite
- Sincronización: QR cifrado

### Principios
- Clean Architecture
- DDD
- Offline-first
- Privacy by design

### Capas
- Presentación
- Aplicación
- Dominio
- Infraestructura

### Modelo de datos
- Patient
- Caregiver
- Record (tipo, timestamp, metadata)

### Seguridad
- Cifrado E2E
- Sin servidores obligatorios
- Permisos por rol

### APIs internas
- POST /records
- GET /records
- POST /sync/import
- POST /sync/export

### Riesgos
- Conflictos de sincronización
- Escalabilidad futura

---

PRD define la promesa.
PSD evita que esa promesa sea humo.
