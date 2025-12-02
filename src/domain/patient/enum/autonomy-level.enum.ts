import { z } from 'zod';

export enum AUTONOMY_LEVEL {
  NONE = 'NONE',
  VERY_LOW = 'VERY_LOW',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  FULL = 'FULL',
}

export const AutonomyLevelSchema = z.enum(AUTONOMY_LEVEL);
