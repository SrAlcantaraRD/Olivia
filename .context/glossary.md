# Glossary

- **Carer**: A caregiver. Can be *primary* or *secondary*.
- **Primary carer**: The initial carer created during onboarding.
- **Secondary carer**: A second device/user invited via QR; shares the same “origin carer” and module activation set.
- **Patient**: The cared person (local-only record).
- **Module**: A tracked routine category (e.g., CIC, stools, enemas, medication).
- **Module field**: A dynamic field definition for a module. Stored in `module_field`.
- **Record**: A captured instance of a module event.
- **Record field**: A captured value for a record’s module fields.
- **QR bundle**: Compressed payload encoded as base64 string, used for sync/invites.
- **Port**: Interface that abstracts an external capability (DB, navigation, storage, QR, notify).
- **Adapter**: Concrete implementation of a port (SQLite via Drizzle, Expo Router, SecureStore).
- **Use-case**: Business operation orchestrator (validate → execute via ports → return response).
- **Audit columns**: Shared columns `{ id, status, createdAt }` on every table.
