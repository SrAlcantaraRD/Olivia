# Security Policy

## Supported versions

Olivia is developed on `main`. Security fixes are applied to the latest released
version and to `main`.

| Version | Supported |
| ------- | --------- |
| 1.0.x   | ✅        |
| < 1.0   | ❌        |

## Reporting a vulnerability

**Please do not report security vulnerabilities through public issues,
discussions or pull requests.**

Preferred channel — GitHub private vulnerability reporting:

<https://github.com/SrAlcantaraRD/Olivia/security/advisories/new>

Fallback: email **gabrielalcantara.93@gmail.com** with the subject
`[SECURITY] Olivia`.

Please include:

- A description of the issue and its impact
- Steps to reproduce, or a proof of concept
- Affected platform(s), app version and commit/ref
- Any suggested remediation
- Whether you intend to disclose publicly, and your preferred timeline

Do **not** include real patient data, personal health information, credentials
or screenshots containing them. Use synthetic data.

## What is in scope

The app is deliberately local-only: no accounts, no cloud backend, no telemetry.
Areas of interest include:

- Local data protection: SQLite database, MMKV cache and SecureStore usage
- PIN handling, hashing and lockout/bypass logic
- Data leakage through logs, backups, screenshots or exported files
- QR-based device-to-device synchronization (payload parsing, validation,
  injection, replay, version confusion)
- SQL injection or unsafe input handling through Drizzle or raw SQL
- Wipe-local-data behaviour (incomplete deletion, recoverable residues)
- Vulnerabilities in the build/release configuration (secrets in bundles,
  exposed EAS/Expo configuration)

## Out of scope

- Attacks requiring physical access to an unlocked, rooted or jailbroken device
- Operating-system or third-party dependency vulnerabilities without a
  demonstrated impact on Olivia (please report those upstream)
- Social engineering, spam or denial of service against a single local device
- Missing security headers or TLS configuration on infrastructure we do not run
- Findings that require modifying the app binary or the device clock

## Our process

- **Acknowledgement**: within 3 business days
- **Initial assessment**: within 7 business days
- **Fix and coordinated disclosure**: we aim for 90 days. We will keep you
  informed of progress and credit you in the advisory unless you prefer
  otherwise.

This is a volunteer-run open-source project; there is no bug bounty. We will not
pursue legal action against researchers who act in good faith, avoid privacy
violations and data destruction, and give us reasonable time to fix the issue
before public disclosure.
