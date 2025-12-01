/**
 * CIC Registration Form - Barrel Export
 * Exports all public interfaces for the CIC registration wizard
 */

export { CicRegisterForm } from './cic-register-form.component';
export { useCicRegisterForm } from './hooks/use-cic-register-form.hook';
export {
  CicColor,
  CicDiscomfort,
  CicTurbidity,
  CicVolume,
  INITIAL_FORM_DATA,
} from './types';
export type {
  CicColor,
  CicDiscomfort,
  CicRegisterFormData,
  CicTurbidity,
  CicVolume,
  StepValidation,
} from './types';
