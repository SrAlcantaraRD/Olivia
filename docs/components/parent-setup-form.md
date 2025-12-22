# Parent Setup Form Architecture

## Overview
The parent-setup form has been refactored from separate screen components into a centralized forms architecture following best practices for code organization and reusability.

## Structure

```
src/ui/components/forms/parent-setup/
├── index.ts                                    # Public exports
├── types.ts                                    # TypeScript definitions
├── parent-setup-form.component.tsx             # Main form orchestrator
├── hooks/
│   └── use-parent-setup-form.hook.ts          # Centralized state management
├── components/
│   ├── relationship-card.component.tsx         # Reusable relationship selector
│   └── module-card.component.tsx              # Reusable module selector
└── steps/
    ├── parent-info-step.component.tsx         # Step 1: Parent information
    ├── child-info-step.component.tsx          # Step 2: Child information
    ├── modules-step.component.tsx             # Step 3: Module selection
    └── summary-step.component.tsx             # Step 4: Summary/Review
```

## Key Components

### Main Form Component
**File:** `parent-setup-form.component.tsx`

The main orchestrator that:
- Uses the `useParentSetupForm` hook for state management
- Renders steps using the `FormWizard` molecule
- Handles navigation between steps
- Manages the overall form flow (4 steps: parent, child, modules, summary)
- On completion, navigates to home screen

**Usage in screens:**
```tsx
import { ParentSetupForm } from '@/ui/components/forms/parent-setup';

export default function ParentInfoScreen() {
  return <ParentSetupForm />;
}
```

### Custom Hook
**File:** `hooks/use-parent-setup-form.hook.ts`

Centralizes all form state management:
- **State:** All form data (parent name, relationship, child info, modules)
- **Setters:** Individual setters for each field
- **Validation:** Per-step validation functions (`isStep1Valid`, `isStep2Valid`, `isStep3Valid`)
- **Navigation:** Step navigation logic (`goToNextStep`, `goToPreviousStep`)
- **Reset:** Form reset functionality

**API:**
```tsx
const {
  formData,              // Current form data
  currentStep,           // Current step index (0-2)
  setParentName,         // Update parent name
  setRelationship,       // Update relationship
  setChildName,          // Update child name
  setBirthDate,          // Update birth date
  setDiagnosis,          // Update diagnosis
  toggleModule,          // Toggle module selection
  isStep1Valid,          // Validate step 1
  isStep2Valid,          // Validate step 2
  isStep3Valid,          // Validate step 3
  isStep4Valid,          // Validate step 4 (summary - all previous steps valid)
  goToNextStep,          // Navigate to next step
  goToPreviousStep,      // Navigate to previous step
  resetForm,             // Reset all form data
} = useParentSetupForm();
```

### Step Components
Each step is a pure component that receives data and callbacks:

**ParentInfoStep** - Collects parent name and relationship
- Props: `name`, `relationship`, `onNameChange`, `onRelationshipChange`
- Features: Text input for name, relationship card selection

**ChildInfoStep** - Collects child information
- Props: `name`, `birthDate`, `diagnosis`, `onNameChange`, `onBirthDateChange`, `onDiagnosisChange`
- Features: Three text inputs (name required, birthDate required, diagnosis optional)

**ModulesStep** - Selects care modules
- Props: `selectedModules`, `onToggleModule`
- Features: Multiple module cards with checkbox-style selection

**SummaryStep** - Reviews all entered information
- Props: `formData`
- Features: Displays all form data in organized sections (parent info, child info, modules)
- Read-only review before final submission

### Reusable Components

**RelationshipCard** - Circular selection card
- Props: `icon`, `label`, `isSelected`, `onSelect`, theme colors
- Used in: ParentInfoStep

**ModuleCard** - Square selection card with title/description
- Props: `icon`, `titleKey`, `descriptionKey`, `isSelected`, `onToggle`, theme colors
- Used in: ModulesStep

### Types
**File:** `types.ts`

```tsx
type Relationship = 'parent' | 'guardian';

interface ParentSetupFormData {
  parentName: string;
  relationship: Relationship | null;
  childName: string;
  birthDate: string;
  diagnosis: string;
  selectedModules: Set<string>;
}

const MODULE_IDS = {
  CATHETERIZATION: 'catheterization',
  BOWEL_MOVEMENTS: 'bowel-movements',
  ENEMAS: 'enemas',
} as const;
```

## Navigation Flow

1. **parent-info.tsx** → Renders `ParentSetupForm` (Step 0)
2. **child-info.tsx** → Renders `ParentSetupForm` (Step 1)
3. **modules.tsx** → Renders `ParentSetupForm` (Step 2)
4. **summary.tsx** → Renders `ParentSetupForm` (Step 3)

The form maintains state internally via the hook. Each screen renders the same `ParentSetupForm` component, which automatically determines which step to display based on internal state. When the user completes the summary step, the form navigates to the home screen.

## Benefits of This Architecture

1. **Centralized State**: All form data in one hook instead of scattered across screens
2. **Reusable Components**: RelationshipCard and ModuleCard can be used elsewhere
3. **Clear Separation**: Steps, components, hooks, and types are properly organized
4. **Maintainable**: Easy to add new steps or modify existing ones
5. **Testable**: Pure step components are easy to unit test
6. **Type-Safe**: Complete TypeScript definitions for all form data

## Future Improvements

1. **Persist State**: Add localStorage/AsyncStorage persistence
2. **Form Context**: Expose form data via React Context for summary screen
3. **Validation Schema**: Use Zod or Yup for schema validation
4. **Step Guards**: Prevent navigation to invalid steps
5. **Progress Restoration**: Remember which step user was on
6. **Error Handling**: Add error states and messages per field

## Example: Adding a New Step

1. Create step component in `steps/`:
```tsx
export function NewStep({ data, onChange }: NewStepProps) {
  return <View>...</View>;
}
```

2. Add state to hook in `use-parent-setup-form.hook.ts`:
```tsx
const [newData, setNewData] = useState('');
const isStep4Valid = () => newData.length > 0;
```

3. Add step to main form in `parent-setup-form.component.tsx`:
```tsx
steps.push({
  id: 'new-step',
  titleKey: 'parent-setup.new-step.title',
  descriptionKey: 'parent-setup.new-step.description',
  isValid: isStep4Valid(),
  content: <NewStep data={newData} onChange={setNewData} />,
});
```

4. Update types in `types.ts`:
```tsx
interface ParentSetupFormData {
  // ...existing fields
  newData: string;
}
```

## Migration Notes

All four screens (`parent-info.tsx`, `child-info.tsx`, `modules.tsx`, and `summary.tsx`) have been simplified to just render `<ParentSetupForm />`. The previous implementation with inline components and local state has been completely replaced with the new forms architecture.

All reusable UI components (RelationshipCard, ModuleCard) have been extracted and can now be imported independently if needed elsewhere in the app.

The summary step displays all collected data in a read-only format, allowing users to review their information before final submission. Upon confirmation, the app navigates to the home screen where the parent can start using the app.
