/**
 * CIC Registration Form Types
 * Domain types for the CIC (Clean Intermittent Catheterization) registration wizard
 */

/**
 * Volume options for CIC registration
 */
export enum CicVolume {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
}

/**
 * Color options for urine appearance
 */
export enum CicColor {
  TRANSPARENT = 'transparent',
  LIGHT_YELLOW = 'light_yellow',
  DARK_YELLOW = 'dark_yellow',
  ABNORMAL = 'abnormal',
}

/**
 * Turbidity levels for urine clarity
 */
export enum CicTurbidity {
  CLEAR = 'clear',
  SLIGHT = 'slight',
  HIGH = 'high',
}

/**
 * Discomfort levels during procedure
 */
export enum CicDiscomfort {
  NONE = 'none',
  SLIGHT = 'slight',
  PAIN = 'pain',
}

/**
 * Complete form data structure for CIC registration
 */
export interface CicRegisterFormData {
  volume: CicVolume | null;
  color: CicColor | null;
  turbidity: CicTurbidity | null;
  discomfort: CicDiscomfort | null;
  discomfortNote: string;
  additionalNotes: string;
}

/**
 * Initial form state with all fields empty
 */
export const INITIAL_FORM_DATA: CicRegisterFormData = {
  volume: null,
  color: null,
  turbidity: null,
  discomfort: null,
  discomfortNote: '',
  additionalNotes: '',
};

/**
 * Step validation result
 */
export interface StepValidation {
  isValid: boolean;
  errorMessage?: string;
}
