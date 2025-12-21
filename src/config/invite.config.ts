const parseEnvNumber = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || Number.isNaN(parsed)) {
    return fallback;
  }

  return parsed;
};

export const INVITE_HMAC_SECRET =
  process.env.EXPO_PUBLIC_INVITE_SECRET ?? 'default-invite-secret';

export const INVITE_EXPIRATION_MINUTES = parseEnvNumber(
  process.env.EXPO_PUBLIC_INVITE_EXPIRATION_MINUTES,
  30
);

export const INVITE_CHUNK_SIZE = parseEnvNumber(
  process.env.EXPO_PUBLIC_INVITE_CHUNK_SIZE,
  900
);
