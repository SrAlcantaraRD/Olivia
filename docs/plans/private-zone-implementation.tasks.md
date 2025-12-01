# Private Zone Implementation - Task Tracking

## Status Legend
- `[ ]` - Not started
- `[wip]` - Work in progress
- `[x]` - Completed
- `[skip]` - Skipped (with reason)

---

## Tasks

### Phase 1: Setup and Documentation
- [x] **Task 1.1** - Create i18n keys documentation ✅ *Completed: 2025-12-01*
  - File: `docs/i18n/private-zone-keys.md`
  - Document all required keys following `page.*` and `component.*` patterns
  - Include keys for: report, register, settings, CIC wizard, modals, shared components
  - **Result:** Comprehensive i18n documentation created with 200+ keys organized by screen/component

### Phase 2: Navigation Structure
- [x] **Task 2.1** - Update tab navigation structure ✅ *Completed: 2025-12-01*
  - File: `src/app/(tabs)/_layout.tsx`
  - Remove tabs: home, add, explore, design-system
  - Add tabs: register (default), report, settings
  - Configure SF Symbols icons and i18n labels
  - Remove FloatingAddButton references
  - **Result:** Updated to 3 production tabs with i18n labels and proper icons

- [ ] **Task 2.2** - Clean up obsolete files and directories
  - Remove: `src/app/(tabs)/home/`
  - Remove: `src/app/(tabs)/add/`
  - Remove: `src/app/(tabs)/explore/`
  - Remove: `src/app/(tabs)/design-system/`
  - Remove: `src/ui/components/floating-add-button.tsx`
  - Remove: `tests/unit-test/components/floating-add-button.test.tsx`
  - Check and update any stray imports

- [ ] **Task 2.3** - Update root layout configuration
  - File: `src/app/_layout.tsx`
  - Update `unstable_settings.initialRouteName` to `'(tabs)/register'`
  - Verify modal configuration in root layout

- [ ] **Task 2.4** - Reorganize modal files
  - Move: `modal-add-carer.tsx` → `(modals)/add-carer.tsx`
  - Move: `modal-filter-history.tsx` → `(modals)/filter-history.tsx`
  - Remove: `modal-register-routine.tsx` (replaced by new flow)
  - Remove: `modal.tsx` (unused)
  - Update `(modals)/_layout.tsx` with new modal screens

### Phase 3: Register Tab (Default Landing)
- [ ] **Task 3.1** - Create Register tab screen
  - File: `src/app/(tabs)/register/index.tsx`
  - Implement header with logo and user name (atoms)
  - Add next action card (atom)
  - Add status indicator with colored dot (atom)
  - Add large primary "REGISTRAR AHORA" button → opens modal
  - Add last register preview card (atom)
  - Use KeyboardAwareScrollView wrapper
  - All placeholder/static content

### Phase 4: Report Tab (Stack Navigation)
- [ ] **Task 4.1** - Create Report tab structure
  - File: `src/app/(tabs)/report/_layout.tsx` with Stack navigator
  - Use TabStack component for consistent headers

- [ ] **Task 4.2** - Build Report index screen
  - File: `src/app/(tabs)/report/index.tsx`
  - Child info card (name, age, status, last events)
  - Next action reminder card
  - Day summary stats (CIC: 2, Dep: 1, Enemas: 0)
  - Navigation buttons to history and calendar

- [ ] **Task 4.3** - Build Report history screen
  - File: `src/app/(tabs)/report/history.tsx`
  - Timeline view with grouped entries by date
  - Filter buttons (Hoy, 7 días, 30 días, Personalizado)
  - List of records with icons and timestamps
  - "Ver en calendario" button

- [ ] **Task 4.4** - Build Report calendar screen
  - File: `src/app/(tabs)/report/calendar.tsx`
  - Month calendar with activity dots
  - Day selection interaction
  - Summary of selected day
  - "Ver detalle del día" button

### Phase 5: Settings Tab (Stack Navigation)
- [ ] **Task 5.1** - Create Settings tab structure
  - File: `src/app/(tabs)/settings/_layout.tsx` with Stack navigator
  - Use TabStack component for consistent headers

- [ ] **Task 5.2** - Build Settings index screen
  - File: `src/app/(tabs)/settings/index.tsx`
  - Perfil del niño section (navigate to detail)
  - Módulos activos checklist
  - Cuidadores section (list + buttons)
  - Ajustes de la app section
  - Use AccordionAtom or stacked cards

- [ ] **Task 5.3** - Build Child profile screen
  - File: `src/app/(tabs)/settings/child-profile.tsx`
  - Name and age header
  - Clinical data section (diagnosis, birth date)
  - Active modules section
  - Reminders section
  - Edit buttons (placeholder)

- [ ] **Task 5.4** - Build Carers screen
  - File: `src/app/(tabs)/settings/carers.tsx`
  - List of linked carers with roles
  - Add carer button (opens modal)
  - Show QR button (opens modal)

- [ ] **Task 5.5** - Build App settings screen
  - File: `src/app/(tabs)/settings/app-settings.tsx`
  - Appearance section (theme, text size)
  - Security section (PIN, auto-lock, secure delete)
  - Data section (export, backups)

### Phase 6: CIC Registration Wizard
- [ ] **Task 6.1** - Create CIC form types and constants
  - File: `src/ui/components/forms/cic-register/types.ts`
  - Define Volume, Color, Turbidity, Discomfort types
  - Define CicRegisterFormData interface
  - Export INITIAL_FORM_DATA constant

- [ ] **Task 6.2** - Create CIC form hook
  - File: `src/ui/components/forms/cic-register/hooks/use-cic-register-form.hook.ts`
  - State management for all form fields
  - Setters for each field
  - Per-step validation functions (isStep1Valid, isStep2Valid, etc.)
  - Navigation functions (goToNextStep, goToPreviousStep)
  - Form reset function

- [ ] **Task 6.3** - Create CIC step components
  - File: `src/ui/components/forms/cic-register/steps/volume-step.component.tsx`
  - File: `src/ui/components/forms/cic-register/steps/color-step.component.tsx`
  - File: `src/ui/components/forms/cic-register/steps/turbidity-step.component.tsx`
  - File: `src/ui/components/forms/cic-register/steps/discomfort-step.component.tsx`
  - File: `src/ui/components/forms/cic-register/steps/summary-step.component.tsx`
  - All using radio button selections
  - DiscomfortStep includes conditional text input for "Dolor"
  - SummaryStep includes optional notes textarea + review

- [ ] **Task 6.4** - Create CIC form orchestrator
  - File: `src/ui/components/forms/cic-register/cic-register-form.component.tsx`
  - Uses Wizard molecule
  - Integrates FormPage molecule for step presentation
  - Maps 5 steps to wizard
  - On completion: navigate back to register tab (DB save future)

- [ ] **Task 6.5** - Create CIC form index exports
  - File: `src/ui/components/forms/cic-register/index.ts`
  - Export hook, types, and main form component

### Phase 7: Registration Modals
- [ ] **Task 7.1** - Create register selector modal
  - File: `src/app/(modals)/register-selector.tsx`
  - 4 CardWithDetails for routine types (CIC, Deposición, Enema, Medicación)
  - Navigate to appropriate registration flow
  - Cancel button

- [ ] **Task 7.2** - Create CIC registration modal
  - File: `src/app/(modals)/register-cic.tsx`
  - Full-screen modal rendering `<CicRegisterForm />`
  - Configure presentation: 'modal' in layout

- [ ] **Task 7.3** - Update modals layout configuration
  - File: `src/app/(modals)/_layout.tsx`
  - Add register-selector and register-cic screens
  - Configure presentation: 'modal' for both

### Phase 8: Final Updates
- [ ] **Task 8.1** - Update ParentSetupForm navigation
  - File: `src/ui/components/forms/parent-setup/parent-setup-form.component.tsx`
  - Change final navigation from `/(tabs)/home` to `/(tabs)/register`

- [ ] **Task 8.2** - Add Spanish i18n translations
  - File: `src/ui/i18n/locales/es-ES.ts`
  - Add all new i18n keys from documentation
  - Ensure Spanish-first quality

- [ ] **Task 8.3** - Add English i18n translations
  - File: `src/ui/i18n/locales/en-EN.ts`
  - Add all new i18n keys from documentation

### Phase 9: Testing and Validation
- [ ] **Task 9.1** - Manual testing checklist
  - Tab navigation works with register as default
  - All three tabs render without errors
  - Stack navigation works in report and settings
  - Modals open and close properly
  - CIC wizard progresses through all 5 steps
  - Validation prevents invalid progression
  - Back navigation works correctly

- [ ] **Task 9.2** - Accessibility testing
  - VoiceOver/TalkBack navigation test
  - Verify all touch targets meet minimum size
  - Check accessibility labels and roles
  - Verify focus management in modals

- [ ] **Task 9.3** - Code quality checks
  - Run `pnpm biome:check`
  - Fix any linting errors
  - Ensure no broken imports
  - Verify test suite still passes

---

## Progress Summary
- **Total Tasks:** 1 completed / 41 total (2.4%)
- **Current Phase:** Phase 1 - Setup and Documentation (Complete) → Phase 2 - Navigation Structure
- **Last Updated:** 2025-12-01
- **Estimated Completion:** TBD

---

## Notes
- Update this file after completing each task
- Mark blockers or issues in task description
- Add timestamps when marking tasks complete
