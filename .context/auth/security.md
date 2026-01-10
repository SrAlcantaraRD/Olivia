# Security model (local-first)

## Storage rules

The Oliva app implements a defense-in-depth approach to data protection with clear separation of storage mechanisms based on sensitivity.

- **SecureStore**: Sensitive values requiring encryption at rest
  - Currently used for all cache keys via `SecureStoreCacheAdapter`
  - Specifically, `CACHE_KEY_ENUM.CARER_PIN_HASH` should always remain in SecureStore
  - Uses platform-specific secure storage (Keychain on iOS, KeyStore on Android)

- **SQLite**: Structured app data with no encryption
  - carer/patient/modules/records tables
  - No sensitive data stored here (PINs are hashed and stored in SecureStore)
  - Database file is accessible if device is compromised

- **QR codes**: Ephemeral data transfer mechanism
  - Used for invites and record sync between devices
  - Treat as potentially exposed during transmission

## Data classification

### Sensitive data
- PIN hashes (stored in SecureStore)
- Session identifiers (cache keys in SecureStore)
- Personal health information (PHI) in SQLite

### Non-sensitive data
- Module configurations
- Record metadata
- UI preferences

## QR threat considerations

QR codes represent the primary attack vector for data exfiltration in this local-first architecture.

### Current implementation risks

```typescript
// src/adapter/minizlib.qr.adapter.ts
export class QrPortAdapter implements IQRPort {
  async pack(data: unknown): Promise<string> {
    const json = JSON.stringify(data);
    const compressed = pako.deflate(json); // Compression only
    return base64.encode(compressed); // Base64 encoding
  }

  async unpack(qrString: string): Promise<unknown> {
    const compressed = base64.decode(qrString);
    const json = pako.inflate(compressed, { to: 'string' });
    return JSON.parse(json);
  }
}
```

- **No encryption**: QR payloads are compressed and base64-encoded but not encrypted
- **Plaintext exposure**: Anyone with access to the QR code can decode and read the payload
- **Replay attacks**: No protection against QR code reuse

### Current mitigations

- **Expiry timestamps**: Secondary carer invitations include `expiresAt`
- **Validation**: Zod schemas prevent malformed data injection
- **Short-lived**: QR codes are typically consumed immediately

```typescript
// Invitation expiry check
if (Date.now() > invitation.expiresAt) {
  throw new ErrorInvitationExpired();
}
```

### Recommended improvements

- **HMAC signatures**: Add authenticated MAC to prevent tampering
- **Encryption**: Device-to-device shared secrets for sensitive payloads
- **Nonce inclusion**: Prevent replay attacks

## Authentication security

- **User experience**: Faster QR generation/scanning
- **Risk acceptance**: QR codes are ephemeral and user-controlled

Trade-off: Potential data exposure during QR transmission.

### Why destructive data wipe?

- **Privacy guarantee**: Complete data removal
- **Regulatory compliance**: No residual PHI
- **Recovery simplicity**: Fresh start after wipe

Trade-off: No data recovery options; users lose all progress.

### Why optional PIN security?

- **Accessibility**: Not all users can manage PINs
- **Progressive adoption**: Add security as needed
- **Default usability**: Low barrier to entry

Trade-off: No default protection against unauthorized device access.