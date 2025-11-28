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
  selectedModules: Set<string>;
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
  CATHETERIZATION: 'catheterization',
  BOWEL_MOVEMENTS: 'bowel-movements',
  ENEMAS: 'enemas',
} as const;
