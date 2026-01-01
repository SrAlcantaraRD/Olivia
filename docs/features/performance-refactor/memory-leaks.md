# Refactorización Performance & Memory Leaks - Oliva App

**Fecha:** 28 de diciembre, 2025
**Autor:** Don Architect
**Objetivo General:** Eliminar memory leaks, optimizar re-renders y aplicar best practices React/React Native

---

## 📋 Resumen Ejecutivo

El análisis identificó **4 critical issues** y **8 moderate issues** que afectan rendimiento y memory leaks:
- Dependency arrays inválidas en hooks (infinite re-renders)
- Memory leaks por setState en componentes unmounted
- N+1 queries en database
- Props inline causando re-renders

**Impact:** Alto en devices bajos; crítico en sessions largas.

---

## 🎯 Objetivos

1. Eliminar memory leaks (async/cleanup)
2. Corregir dependency arrays en useEffect
3. Optimizar re-renders con useCallback/useMemo
4. Refactor N+1 queries en summary
5. Agregar Error Boundaries
6. Documentar patrones correctos

---

## 📊 Scope Inicial

**Incluído:**
- Hooks (domain/core/summary/carer)
- Adapters (database, stores)
- Screens críticas (summary, setup)
- UI components (Form wizards, modals)

**Excluído (para sprints futuros):**
- Rewrite completo de stores (solo cleanup)
- Database schema changes
- UI redesign

---

## 🔴 CRITICAL ISSUES (Semana 1)

### Issue 1: useModuleSummary - Infinite Re-render Loop
**Archivo:** `src/domain/summary/hook/use-module-summary.hook.ts`
**Problema:** useEffect dependency array con `[execute]` que incluye todas las deps

**Solución:**
```typescript
// ANTES ❌
useEffect(() => { void execute(); }, [execute]);

// DESPUÉS ✅
useEffect(() => { void execute(); }, [moduleId, period]);
```

**Archivos a actualizar:**
- `src/domain/summary/hook/use-module-summary.hook.ts` (L76)
- `src/domain/summary/hook/use-modules-summary.hook.ts` (similar)
- `src/domain/summary/hook/use-field-summary.hook.ts` (similar)

**Criterio de aceptación:**
- [ ] useEffect corre solo cuando moduleId o period cambian
- [ ] No hay warnings de exhaustiveDependencies
- [ ] Componentes renders 1 vez al montar, no múltiples

---

### Issue 2: useActiveCarer - Memory Leak en async
**Archivo:** `src/domain/carer/hook/use-active-carer.hook.ts`
**Problema:** setState after unmount

**Solución:**
```typescript
// Agregar isMounted flag
useEffect(() => {
  let isMounted = true;

  const run = async () => {
    setLoading(true);
    try {
      const carerID = await adapters.cacheAdapter.get<number>(CACHE_KEY_ENUM.CARER);
      if (!isMounted) return; // ✅ Guard
      setCarer(carerID ? await adapters.carerAdapter.getByID(carerID) : null);
    } finally {
      if (isMounted) setLoading(false); // ✅ Guard
    }
  };

  run().catch(console.error);

  return () => { isMounted = false; }; // ✅ Cleanup
}, []);
```

**Archivos similar pattern:**
- `src/domain/carer/hook/use-splash-carer-validation.hook.ts`
- `src/domain/module/hook/get-list-active-module.hook.ts`
- Cualquier hook con async + setState

**Criterio de aceptación:**
- [ ] No hay "Can't perform a React state update on an unmounted component" warnings
- [ ] Componente se desmonta sin errores
- [ ] Timeout/abort previene setState orphan

---

### Issue 3: ScrollView - removeClippedSubviews Missing
**Archivo:** `src/ui/components/organisms/synchronization-wizard/components/confirmation-step.component.tsx`
**Problema:** Renderiza componentes fuera de pantalla

**Solución:**
```tsx
// ANTES ❌
<ScrollView className="flex-1 p-4">

// DESPUÉS ✅
<ScrollView
  className="flex-1 p-4"
  removeClippedSubviews={true}
  scrollEventThrottle={16}
>
```

**Audit de todos ScrollView/FlatList:**
```bash
grep -r "ScrollView\|FlatList" src/ui/components --include="*.tsx" \
  | grep -v removeClippedSubviews | grep -v maxToRenderPerBatch
```

**Criterio de aceptación:**
- [ ] Todos los ScrollView con `removeClippedSubviews={true}`
- [ ] Memoria no sube durante scroll largo
- [ ] Performance profiler muestra <50ms renders

---

### Issue 4: useParentSetupForm - Setters sin useCallback
**Archivo:** `src/ui/components/forms/parent-setup/hooks/use-parent-setup-form.hook.ts`
**Problema:** Inline functions en cada render = child re-renders

**Solución:**
```typescript
// Wrap todos los setters con useCallback
const setParentName = useCallback((name: string) => {
  setFormData((prev) => ({ ...prev, parentName: name }));
}, []);

const setRelationship = useCallback((relationship: Relationship | null) => {
  setFormData((prev) => ({ ...prev, relationship }));
}, []);

// ... resto
```

**Archivos:**
- `src/ui/components/forms/parent-setup/hooks/use-parent-setup-form.hook.ts`
- `src/ui/components/forms/secondary-carer-setup/use-secondary-carer-setup-form.hook.ts`

**Criterio de aceptación:**
- [ ] Todos los setters wrapped con useCallback
- [ ] Child components memoed con React.memo
- [ ] Componente no re-rende cuando parent props no cambian

---

## 🟠 MODERATE ISSUES (Semana 2)

### Issue 5: ModulesSection N+1 Queries
**Archivo:** `src/ui/components/organisms/modules-section.organism.tsx`
**Problema:** Fetcha summary para cada moduleId por separado

**Solución arquitectónica:**
1. Crea nuevo use-case: `GetAllModulesSummaryUseCase`
2. Adapter hace JOIN único en DB
3. Hook devuelve todo de una

**Archivos a crear:**
```
src/domain/summary/use-case/get-all-modules-summary.use-case.ts
src/domain/summary/hook/use-all-modules-summary.hook.ts (nuevo)
```

**Cambio en organism:**
```typescript
// ANTES
const modulesSummary = useModulesSummary({ moduleIds, period });

// DESPUÉS
const modulesSummary = useAllModulesSummary({ period });
```

**Criterio de aceptación:**
- [ ] 1 query en lugar de N queries
- [ ] Database profiler muestra <100ms en lugar de >500ms
- [ ] Uso de memoria baja (no N resultados duplicados)

---

### Issue 6: Theme Color Memoization
**Archivo:** `src/app/(tabs)/_layout.tsx`
**Problema:** `useThemeColor` lookups en cada render

**Solución:**
```typescript
// ANTES ❌
const accentColor = useThemeColor('accent');
const mutedColor = useThemeColor('muted');
const backgroundColor = useThemeColor('surface');

// DESPUÉS ✅
const colors = useMemo(() => ({
  accentColor: useThemeColor('accent'),
  mutedColor: useThemeColor('muted'),
  backgroundColor: useThemeColor('surface'),
}), [theme]); // ← dep en theme que realmente cambia

// En JSX:
<CustomTabBar {...colors} />
```

**Archivos:**
- `src/app/(tabs)/_layout.tsx`
- Scan de otros `useThemeColor` calls

**Criterio de aceptación:**
- [ ] Colors solo se recalculan cuando theme cambia
- [ ] No hay color flashing
- [ ] useMemo dep array correcto

---

### Issue 7: Zustand Selectors
**Archivo:** `src/domain/core/stores/*.store.ts`
**Problema:** Componentes se re-renderan cuando CUALQUIER parte del store cambia

**Solución:**
```typescript
// En componente ANTES ❌
const { items, actions } = useListStore((state) => state); // ← Todo el store

// DESPUÉS ✅
const items = useListStore((state) => state.items[entityName]);
const startLoading = useListStore((state) => state.actions.startLoading);
```

**Auditoría en:**
- `src/domain/core/stores/by-id.store.ts`
- `src/domain/core/stores/list.store.ts`
- `src/domain/core/stores/theme.store.ts`

**Criterio de aceptacion:**
- [ ] Cada componente subscrito solo a slice que necesita
- [ ] No hay re-renders innecesarios
- [ ] Selector functions son pure

---

### Issue 8: Error Boundaries Faltantes
**Archivo:** Crear `src/ui/components/organisms/error-boundary.organism.tsx`
**Problema:** Si un componente crashea, toda la app explota

**Solución:**
```typescript
export class ErrorBoundary extends React.Component {
  // ... implementación
}

// En screens críticas:
<ErrorBoundary>
  <ModulesSection />
</ErrorBoundary>
```

**Ubicaciones donde agregar:**
- `src/app/(tabs)/summary/index.tsx` → `<ModulesSection />`
- `src/app/(tabs)/register/index.tsx` → wizards
- `src/ui/components/organisms/module-wizard/module-wizard.organism.tsx`

**Criterio de aceptacion:**
- [ ] Error boundary captura errors
- [ ] UI muestra fallback graceful
- [ ] No afecta resto de la app
- [ ] Test cubre error scenario

---

## 📅 Roadmap Detallado

### **Semana 1: Critical Path**
```
Lunes:
  - Issue 1: useModuleSummary (3 hooks) → 2h
  - Issue 2: useActiveCarer + similares → 3h

Miércoles:
  - Issue 3: ScrollView audit + fixes → 2h
  - Issue 4: useParentSetupForm → useCallback → 3h

Viernes:
  - Testing de todo lo anterior → 3h
  - Code review & merge
```

### **Semana 2: Moderate + Nice-to-Have**
```
Lunes:
  - Issue 5: N+1 queries refactor → 4h

Miércoles:
  - Issue 6: Theme memoization → 2h
  - Issue 7: Zustand selectors → 3h

Viernes:
  - Issue 8: Error Boundaries → 2h
  - Testing suite completa
```

---

## 🧪 Testing Strategy

**Para cada issue:**
1. Unit test del hook/component (Jest)
2. Integration test si hay DB/adapter
3. E2E test si es critical path
4. Performance test (Detox profiler)

**No haremos:**
- Rewrite completo de stores (solo cleanup)
- UI refactor
- Database schema changes

---

## ✅ Definición de "Done"

Para cada issue:
- [ ] Código implementado
- [ ] Tests verdes
- [ ] Code review aprobado
- [ ] No warnings en console
- [ ] Memory profiler limpio
- [ ] Documentado en commit message

---

## 📝 Notas y Decisiones

1. **Dependency arrays:** Usamos "minimal" deps, no "all used values"
2. **Async cleanup:** Siempre `isMounted` flag, no AbortController (yet)
3. **Memoization:** Solo para cosas costosas o que pasan como props
4. **Error handling:** Boundaries + fallback UI (no silent fails)

---

## 🚀 Siguientes Pasos

1. ✅ User review del plan
2. ✅ Crear tickets en Jira/backlog
3. ✅ Empezar Semana 1 lunes
4. ✅ PR per-issue para fácil review
