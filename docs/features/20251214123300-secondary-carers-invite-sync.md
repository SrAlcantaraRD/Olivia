## Plan: Secondary Carers — Invite & Sync

Fecha: 2025-12-14

Resumen
- Objetivo: Permitir que un carer principal invite a un carer secundario y que ambos sincronizen registros relevantes de forma segura y confiable.
- MVP: invitación por QR (payload mínimo), importación por QR en el dispositivo secundario. Sincronización completa de registros vía WebRTC o LAN en iteración posterior.

Alcance
- Dominio: nuevas entidades/DTOs Zod para `InviteBundle` y `SyncBundle`, casos de uso para generar/firmar/exportar bundle y para importar/validar/apply bundle.
- Infraestructura: adaptadores para codificar/decodificar QR (posible chunking), almacenamiento seguro (drizzle/sqlite + encrypted metadata), transporte P2P opcional (WebRTC) como siguiente fase.
- UI: pantalla para generar invitación (QR + códigos alternativos), pantalla para escanear/importar (scan flow, multi-chunk + progreso), pantallas de onboarding para carer secundario.
- Seguridad: firma HMAC/Ed25519 del bundle, expiración, nonce, validación de esquema Zod antes de persitir.

Entrega y criterios de aceptación (MVP)
- `GenerateInviteBundle` use-case: crea `InviteBundle` firmado y serializable.
- UI: pantalla `Invite/Share` que muestra QR y permite copiar/exportar.
- `ImportInvite` use-case + `QRCodeScanner` UI: importa bundle desde QR y crea el `Carer` secundario localmente.
- Validación: bundle rechazado si firma inválida o expirado.

Tareas (pasos técnicos)
1. Domain — Schemas & Ports
  - Añadir `src/domain/carer/entity/invite-bundle.entity.ts` (Zod schema + TypeScript types).
  - Definir `src/domain/carer/port/invite.port.ts` con métodos: `createInviteBundle`, `verifyInviteBundle`, `encodeBundleToChunks`, `decodeChunksToBundle`.

2. Use Cases
  - `create-invite.use-case.ts`: construye bundle, firma, retorna serializable (string/bytes).
  - `import-invite.use-case.ts`: toma bundle, valida esquema y firma, realiza creación de carer local y devuelve resultado.

3. Database / Adapter
  - Añadir campos necesarios en `carer` (si procede): `originId`, `isSecondary`, `linkedToId`.
  - Implementar `src/database/adapter/qr.codec.adapter.ts` para chunking/encoding (base64/utf-8) y helpers QR-friendly.

4. UI
  - `InviteScreen`: muestra QR, botón `Copiar/Compartir`, expiración, instrucciones.
  - `ScanInviteScreen`: scanner con progreso de multi-chunk, feedback y flow de onboarding.
  - Integrar en rutas protegidas (Expo Router) y onboarding existente.

5. Seguridad & Signing
  - Definir clave de firma: HMAC con secreto derivado de carer (o Ed25519 si se agrega keypair). Para MVP, HMAC + app-secret per-device.
  - Incluir `issuedAt`, `expiresAt`, `version`, `nonce` en bundle.

6. Tests
  - Unit tests Zod schemas, sign/verify, encoder/decoder chunking.
  - Integration tests: generate -> encode -> scan(decode) -> import -> persist.

7. Iteración posterior (v2)
  - Implementar `SyncBundle` y transporte P2P (WebRTC) para transferencias de registros grandes.
  - Añadir chunked resumable transfer, deduplicación, conflict resolution.

Decisiones y trade-offs
- MVP usa QR para invites (simple, cross-platform). Los registros grandes no entran en QR — se usarán WebRTC/LAN o relay cloud para sync completo.
- Firma HMAC es suficiente para MVP; migrar a keypair asimétrico si se requiere verificación fuera de la app.

Estimación (tamaño de esfuerzo)
- Domain & Use-cases: 1-2 días
- QR codec + chunking helpers: 0.5-1 día
- UI screens + router: 1 día
- Tests + polish: 1 día
Total MVP: ~3.5-5 días de desarrollo (1 dev)

Notas de implementación rápidas
- Reusar patrón Port/Adapter existente (`ICarerPort`, sqlite adapter).
- Mantener Zod-first: validar bundles estrictamente en el dominio antes de tocar infra.
- UI: reutilizar `CardAtom`, `IconAtom`, y atoms existentes para consistencia.
- Instalar paquete `react-native-vision-camera` (https://github.com/mrousavy/react-native-vision-camera) para escaneo de QR.

Siguientes pasos inmediatos
1. Crear los archivos de esquema Zod y los ports en `src/domain/carer`.
2. Implementar `create-invite.use-case.ts` y tests unitarios básicos.
3. Scaffold UI `InviteScreen` y `ScanInviteScreen` con navegación mínima.
