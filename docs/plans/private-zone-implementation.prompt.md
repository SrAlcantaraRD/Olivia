# Plan: Implement Private Zone (Design & Navigation Only)

Create the private zone's tab-based navigation structure and all screen wireframes without backend logic. The private zone consists of 3 main tabs (Reporte/Report, Registro/Register, Configuración/Settings) with Register as the default landing tab. CIC registration uses the `Wizard` molecule pattern as a full-screen modal with internal steps.

## Steps

### 1. Create i18n keys documentation

**File:** `docs/i18n/private-zone-keys.md`

Document all required i18n keys following pattern `page.<screen>.*` for screens and `component.<component>.*` for reusable components (similar to existing `parent-setup.*` structure).

**Include keys for:**
- Report tab screens (main, history, calendar)
- Register tab (default landing page)
- Settings tab screens (main, child-profile, carers, app-settings)
- CIC registration flow (5 steps: volume, color, turbidity, discomfort, summary)
- Register selector modal
- Shared components (child card, status badge, stats summary)

**Pattern examples:**
```
page.report.title
page.report.child-card.name
page.report.next-action
page.register.action-button
page.cic-register.volume.title
component.child-card.age-label
component.status-indicator.green
```

### 2. Update tab navigation structure

**File:** `src/app/(tabs)/_layout.tsx`

Replace all placeholder tabs with production tabs in order: `register` (default/first), `report`, `settings`.

**Changes:**
- Remove tabs: `home`, `add`, `explore`, `design-system`
- Add tabs in order:
  1. `register` - SF Symbol `plus.circle.fill`, label from i18n
  2. `report` - SF Symbol `chart.bar.doc.horizontal`, label from i18n
  3. `settings` - SF Symbol `gearshape.fill`, label from i18n
- Remove hidden `add` tab logic and `FloatingAddButton` references
- Set `register` as the first/default tab

### 3. Build Register tab screen (Default Landing Page)

**File:** `src/app/(tabs)/register/index.tsx`

Implement default landing tab wireframe (lines 76-105 of `step-4.private-zone.screen-wireframe.md`):

**Components (all atoms initially):**
- Header with logo and user name
- Next action card (e.g., "Cateterismo en 1h 45min")
- Status indicator with colored dot (● Verde - "Todo dentro de lo esperado")
- Large primary button "REGISTRAR AHORA" that opens `/(modals)/register-selector`
- Last register preview card ("CIC hace 3h 20min" with tap to detail)

**Layout:**
- Use `KeyboardAwareScrollView` wrapper
- Vertical stack with proper spacing
- Center-aligned primary button (prominent CTA)
- All content placeholder/static for now

### 4. Build Report tab with stack navigation

**Files:**
- `src/app/(tabs)/report/_layout.tsx` - Stack navigator
- `src/app/(tabs)/report/index.tsx` - Main report screen
- `src/app/(tabs)/report/history.tsx` - Timeline view
- `src/app/(tabs)/report/calendar.tsx` - Calendar view

**Report index screen** (wireframe lines 13-41):
- Child info card (name, age, general status, last CIC, last bowel movement)
- Next action reminder card
- Day summary stats (CIC: 2, Dep: 1, Enemas: 0)
- Navigation buttons to `history` and `calendar` screens

**History screen** (wireframe section 8):
- Timeline view with grouped entries by date
- Filter buttons (Hoy, 7 días, 30 días, Personalizado)
- List of records with icons and time
- "Ver en calendario" button to switch to calendar view

**Calendar screen** (wireframe section 9):
- Month calendar with dots indicating days with records
- Day selection
- Summary of selected day below calendar
- "Ver detalle del día" button

**Note:** Use atoms/molecules initially. Extract organisms after identifying patterns.

### 5. Build Settings tab with stack navigation

**Files:**
- `src/app/(tabs)/settings/_layout.tsx` - Stack navigator
- `src/app/(tabs)/settings/index.tsx` - Main settings screen
- `src/app/(tabs)/settings/child-profile.tsx` - Child profile detail
- `src/app/(tabs)/settings/carers.tsx` - Carers management
- `src/app/(tabs)/settings/app-settings.tsx` - App settings

**Settings index screen** (wireframe lines 45-73):
- Sections using `AccordionAtom` or stacked cards:
  1. **Perfil del niño** - Navigate to `child-profile` screen
  2. **Módulos activos** - Checklist (✔ CIC, ✔ Deposiciones, ○ Enemas, ○ Meds)
  3. **Cuidadores** - List with "Añadir cuidador" and "Mostrar mi QR" buttons, navigate to `carers`
  4. **Ajustes de la app** - Navigate to `app-settings` (theme, PIN, export data)

**Child profile screen** (wireframe section 12):
- Name and age header
- Clinical data section (diagnosis, birth date)
- Active modules section
- Reminders section
- Edit buttons (placeholder)

**Carers screen** (wireframe section 13):
- List of linked carers with roles
- Add carer button (opens modal)
- Show QR button (opens modal)

**App settings screen** (wireframe section 16):
- Appearance section (theme selector, text size)
- Security section (PIN, auto-lock, secure delete)
- Data section (export, local backups)

### 6. Create CIC registration wizard modal

Following parent-setup form pattern with `Wizard` molecule.

**Directory structure:**
```
src/ui/components/forms/cic-register/
├── index.ts
├── types.ts
├── cic-register-form.component.tsx
├── hooks/
│   └── use-cic-register-form.hook.ts
└── steps/
    ├── volume-step.component.tsx
    ├── color-step.component.tsx
    ├── turbidity-step.component.tsx
    ├── discomfort-step.component.tsx
    └── summary-step.component.tsx
```

**types.ts:**
```typescript
export type Volume = 'low' | 'normal' | 'high';
export type Color = 'transparent' | 'light-yellow' | 'dark-yellow' | 'abnormal';
export type Turbidity = 'clear' | 'slight' | 'high';
export type Discomfort = 'none' | 'slight' | 'pain';

export interface CicRegisterFormData {
  volume: Volume | null;
  color: Color | null;
  turbidity: Turbidity | null;
  discomfort: Discomfort | null;
  discomfortNote: string; // Only if discomfort === 'pain'
  notes: string; // Optional additional notes
}
```

**Hook:** `use-cic-register-form.hook.ts`
- State management for all form fields
- Per-step validation functions
- Navigation between steps (goToNextStep, goToPreviousStep)
- Form reset

**Step components:**
- **VolumeStep** - Radio buttons: Bajo, Normal, Alto
- **ColorStep** - Radio buttons: Transparente, Amarillo claro, Amarillo oscuro, Anómalo
- **TurbidityStep** - Radio buttons: Clara, Leve, Alta
- **DiscomfortStep** - Radio buttons: No, Leve, Dolor (+ conditional text input for "Dolor")
- **SummaryStep** - Optional notes textarea + summary review of all selections

**Main orchestrator:** `cic-register-form.component.tsx`
- Uses `Wizard` molecule
- Integrates `FormPage` molecule for step presentation
- Maps 5 steps to wizard
- On completion: save to DB (future) and navigate back to register tab

**Modal files:**
- `src/app/(modals)/register-selector.tsx` - Modal with 4 `CardWithDetails` for routine types (CIC, Deposición, Enema, Medicación). Navigate to appropriate registration flow.
- `src/app/(modals)/register-cic.tsx` - Full-screen modal rendering `<CicRegisterForm />`

**Modal configuration:**
Set `presentation: 'modal'` in `src/app/(modals)/_layout.tsx` for full-screen modal experience.

## Further Considerations

### 1. Update ParentSetupForm navigation

**File:** `src/ui/components/forms/parent-setup/parent-setup-form.component.tsx` (line 96)

Change final navigation from:
```typescript
router.replace('/(tabs)/home');
```

To:
```typescript
router.replace('/(tabs)/register');
```

This ensures parent setup completion lands on the new default register tab.

### 2. Organism extraction timing

After initial implementation with atoms/molecules, identify repeated patterns across tabs:
- Child info card (appears in report + settings)
- Status indicator (appears in report + register)
- Stats summary card (appears in report)
- Next action card (appears in report + register)

Extract these to organisms in `src/ui/components/organisms/` following Atomic Design principles.

**Suggested follow-up task:** Create a refactoring ticket to extract organisms once patterns stabilize.

### 3. Modal presentation configuration

Configure modal presentation in `src/app/(modals)/_layout.tsx`:
```typescript
<Stack screenOptions={{ presentation: 'modal' }}>
  <Stack.Screen name="register-selector" />
  <Stack.Screen name="register-cic" />
</Stack>
```

This provides better UX for multi-step CIC wizard (5 steps) with full-screen modal experience.

### 4. Clean up obsolete files and components

**Files to remove:**
- `src/app/(tabs)/home/` - entire directory (replaced by `register`)
- `src/app/(tabs)/add/` - entire directory (replaced by modal flow)
- `src/app/(tabs)/explore/` - entire directory (replaced by `report`)
- `src/app/(tabs)/design-system/` - entire directory (development utility, not production)
- `src/ui/components/floating-add-button.tsx` - replaced by in-tab button
- `tests/unit-test/components/floating-add-button.test.tsx` - obsolete test

**Files to update/check:**
- Update imports in `src/app/_layout.tsx` if it references any removed directories
- Check for any stray imports of `FloatingAddButton` in other components
- Update test coverage expectations since we're removing test files

### 5. Tab layout and Stack structure

Each tab needs its own `_layout.tsx` for stack navigation:

**Register tab:** No stack needed (single screen)
- Just `src/app/(tabs)/register/index.tsx`

**Report tab:** Stack navigation for history/calendar views
- `src/app/(tabs)/report/_layout.tsx` with Stack
- `src/app/(tabs)/report/index.tsx`
- `src/app/(tabs)/report/history.tsx`
- `src/app/(tabs)/report/calendar.tsx`

**Settings tab:** Stack navigation for detail screens
- `src/app/(tabs)/settings/_layout.tsx` with Stack
- `src/app/(tabs)/settings/index.tsx`
- `src/app/(tabs)/settings/child-profile.tsx`
- `src/app/(tabs)/settings/carers.tsx`
- `src/app/(tabs)/settings/app-settings.tsx`

Use existing `TabStack` layout component from `src/ui/components/layouts/tab-stack.layout.tsx` for consistent headers with logo and theme toggle.

### 6. Root layout configuration

**File:** `src/app/_layout.tsx`

Update `unstable_settings` to point to new default tab:
```typescript
export const unstable_settings = {
  initialRouteName: '(tabs)/register', // Changed from '(tabs)'
};
```

This ensures deep linking and initial navigation lands on register tab.

### 7. Modal management at root level

Current modal files at root (`modal.tsx`, `modal-add-carer.tsx`, `modal-filter-history.tsx`, `modal-register-routine.tsx`) should be:
- **Moved** into `(modals)/` directory for better organization
- **Updated** with proper modal presentation
- **Deprecated** placeholder `modal-register-routine.tsx` in favor of new `register-cic.tsx`

**Actions:**
- Move `modal-add-carer.tsx` → `(modals)/add-carer.tsx`
- Move `modal-filter-history.tsx` → `(modals)/filter-history.tsx`
- Remove `modal-register-routine.tsx` (replaced by `register-selector.tsx` + `register-cic.tsx`)
- Remove generic `modal.tsx` (unused in private zone)

### 8. Header consistency across tabs

All tab screens should have consistent headers:
- Logo centered
- Theme toggle on right
- Blur effect background
- No back button on main tab screens
- Back button only on stack-nested screens

Use existing `TabStack` component or ensure consistent `screenOptions` in each `_layout.tsx`.

### 9. Accessibility and screen reader support

Each screen must include:
- Proper `accessibilityLabel` on all interactive elements
- `accessibilityRole` appropriate to element type
- `accessibilityHint` for complex interactions
- Semantic heading structure with proper typography hierarchy
- Focus management when modals open/close
- Minimum touch target size 44x44pt (iOS) / 48x48dp (Android)

**Testing:** Enable VoiceOver/TalkBack and navigate through all screens to verify logical reading order.

### 10. Spanish-first i18n approach

Since this is a Spanish healthcare app, consider:
- Creating `es-ES.ts` first with native Spanish content
- Then create `en-EN.ts` as translations
- Or maintain both in parallel but prioritize Spanish quality

Current file has mixed Spanish/English. Clarify language priority before implementation.

## Implementation Order

1. Create i18n documentation (step 1)
2. Update tab navigation (step 2)
3. Build register tab - default landing (step 3)
4. Build report tab with stack (step 4)
5. Build settings tab with stack (step 5)
6. Create CIC wizard modal (step 6)
7. Apply further considerations (ParentSetupForm navigation update)

## Testing Checkpoints

- [ ] Tab navigation works correctly with register as default
- [ ] All three tabs render without errors
- [ ] Navigation between stack screens works in report and settings
- [ ] Register selector modal opens and closes properly
- [ ] CIC registration wizard progresses through all 5 steps
- [ ] Wizard validation prevents advancing with invalid data
- [ ] CIC wizard summary displays all selected values
- [ ] Back navigation works correctly in wizard
- [ ] ParentSetupForm completion navigates to register tab
- [ ] All i18n keys resolve correctly (no missing translation warnings)
- [ ] FloatingAddButton and obsolete directories removed
- [ ] No broken imports after file cleanup
- [ ] All test files still pass after cleanup
- [ ] VoiceOver/TalkBack navigation works logically
- [ ] All touch targets meet minimum size requirements
- [ ] Modal presentation is full-screen and dismissible
- [ ] Theme toggle works consistently across all tabs
- [ ] Headers display correctly with logo and blur effect

## Dependencies

- Existing `Wizard` molecule
- Existing `FormPage` molecule
- Existing `CardWithDetails` molecule
- Existing `AccordionAtom`
- Existing atoms (buttons, typography, inputs)
- i18n infrastructure
- Expo Router navigation

## Notes

- All screens use placeholder/static content (no backend integration)
- Focus on layout, navigation, and visual structure
- Defer data fetching and persistence to future tasks
- Follow existing patterns from parent-setup implementation
- Maintain SOLID principles and Clean Architecture boundaries
- Ensure accessibility props on all interactive elements
- Add haptic feedback to buttons and selections
