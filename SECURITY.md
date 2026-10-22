# Security Policy

## Supported versions

Olivia is pre-release. There is no supported release branch yet; fixes are made
on `main` on a best-effort basis.

| Version | Supported |
| --- | --- |
| `main` (unreleased) | Best effort |
| Any tagged or published build | Not yet supported |

## Reporting a vulnerability

**Please do not report security vulnerabilities through public issues,
discussions or pull requests.**

Preferred channel — GitHub private vulnerability reporting:

<https://github.com/SrAlcantaraRD/Olivia/security/advisories/new>

Fallback: email **gabrielalcantara.93@gmail.com** with the subject
`[SECURITY] Olivia`.

Please include:

- a description of the issue and its impact;
- steps to reproduce, or a proof of concept;
- affected platform(s), app version and commit/ref;
- any suggested remediation;
- whether you intend to disclose publicly, and your preferred timeline.

Do **not** include real patient data, personal health information, credentials or
screenshots containing them. Use synthetic data.

## What is in scope

Olivia is deliberately local-only: no accounts, no cloud backend, no telemetry.
Relevant areas include:

- local data protection: the SQLite database, the SecureStore-backed cache and
  the (currently unused) MMKV adapter;
- data leakage through logs, device backups, screenshots, QR codes or exported
  files;
- QR-based device-to-device synchronization: payload parsing, validation,
  injection, replay and version confusion;
- SQL injection or unsafe input handling through Drizzle or raw SQL;
- destructive behaviour: wipe-local-data and the automatic database drop when
  migrations fail;
- build and release configuration (secrets in bundles, exposed EAS/Expo
  configuration).

## Known limitations (not vulnerabilities)

These are current design limitations. They are documented so reports can focus
on behavior that is not already known:

- **No authentication.** The app has no login, PIN or biometric lock. Caregiver
  records contain a `pin_hash` column and a cache key, but no PIN is set or
  verified, and new caregivers are stored with an empty hash. Access control is
  the operating system's app sandbox and device lock.
- **No encryption at rest.** SQLite is opened with `expo-sqlite` without
  SQLCipher. Device or cloud backups may include the database.
- **QR payloads are compressed, not protected.** Deflate + base64 is neither
  encrypted nor signed; anyone who can read a QR code can read its contents.
- **Shared copies cannot be revoked.** A secondary caregiver receives a local
  copy of the data. There is no permission model, expiry enforcement beyond the
  invitation timestamp, revocation or view audit trail.
- **Logging can include profile data.** The parent-setup flow logs the full
  request at debug level, including the child's name, birth date and diagnosis.
  The default `LOG_LEVEL=4` suppresses it; lowering the level can write it to the
  console or `logs.txt`. See the privacy section of the [README](README.md).
- **Destructive recovery.** Logout wipes local data without recovery, and a
  migration failure drops the local database.

There has been no independent security review, penetration test or compliance
certification. Nothing in this repository should be read as evidence of HIPAA,
GDPR, MDR or other regulatory compliance.

## Out of scope

- attacks requiring physical access to an unlocked, rooted or jailbroken device;
- operating-system or third-party dependency vulnerabilities without a
  demonstrated impact on Olivia (report those upstream);
- social engineering, spam or denial of service against a single local device;
- missing security headers or TLS configuration on infrastructure we do not run;
- findings that require modifying the app binary or the device clock.

## Our process

- **Acknowledgement**: within 3 business days.
- **Initial assessment**: within 7 business days.
- **Fix and coordinated disclosure**: we aim for 90 days. We will keep you
  informed of progress and credit you in the advisory unless you prefer
  otherwise.

This is a volunteer-run project; there is no bug bounty. We will not pursue legal
action against researchers who act in good faith, avoid privacy violations and
data destruction, and give us reasonable time to fix the issue before public
disclosure.
