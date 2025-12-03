import type { TID } from '@/domain/core/schemas/id.schema';

export type Relationship = 'parent' | 'guardian';

export interface ParentSetupFormData {
  // Step 1: Parent Info
  parentName: string;
  relationship: Relationship | null;

  // Step 2: Child Info
  childName: string;
  birthDate: string;
  diagnosis: string;

  // Step 3: Modules
  selectedModules: Set<TID>; //FIXME: Modify for TUUID
}

export const INITIAL_FORM_DATA: ParentSetupFormData = {
  parentName: '',
  relationship: null,
  childName: '',
  birthDate: '',
  diagnosis: '',
  selectedModules: new Set(),
};

export const MODULE_IDS = {
  CATHETERIZATION: 1,
  BOWEL_MOVEMENTS: 2,
  ENEMAS: 3,
} as const;
