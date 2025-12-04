---
applyTo: 'src/hooks/*.hook.ts'
description: "Instructions for implementing reusable React hooks wrapping hook port adapters"
---

# Domain Hook Instructions

## Purpose
- Encapsulate data fetch lifecycle, caching, and user feedback while exposing simple execute interface to components.

## Artifacts
- `src/domain/**/hooks/<feature>.hook.ts`
- `test/unit-test/domain/**/hooks/use-<feature>.spec.tsx`
- Main hooks defined at `src/domain/core/hooks`:
  - useCreateEntity
  - useFindEntityByUUID
  - useGetEntityList
  - useUpdateEntity

## Naming
- Hook: `use<Feature>`
- File: `<feature>.hook.ts`

## Rules
### Basic Structure
- Wrap hook port adapters for data retrieval & state.
- Maintain separation from HTTP concerns.
- Use shared hooks: useCreateEntity, useFindEntityByUUID, useGetEntityList.
- Naming: useGet<Entity>List, useFind<Entity>ByUUID.

### Implementation
- Inject notify and adapter ports.
- Use useState for isExecuting, useCallback for execute.
- Return { execute, isExecuting }.

### Caching
- Rely on central store; do not re-fetch if present.

### Error Handling
- Use notify adapter for errors, return { success: false }.

### Testing
- First call hits adapter, second uses cache; error triggers notify.

### Quality Gates
- No direct HTTP, no any, stable references.

### Example
  ```typescript
  export const use<Feature> = (notify: INotifyPort, adapter: I<Entity>Port) => {
    const [isExecuting, setExecuting] = useState<boolean>(false);
    const execute = useCallback(async (dto: T<Entity>DTO): Promise<IHookResponse<T<Entity>DTO>> => {
      setExecuting(true);
      try {
        const response = await adapter.<action>(dto);
        if (!response.success) {
          notify.error({ title: 'error.title', message: response.message });
          return { success: false };
        }
        return { success: true, data: response.details.item };
      } catch (error) {
        notify.error({ title: 'error.network' });
        return { success: false };
      } finally {
        setExecuting(false);
      }
    }, []);
    return { execute, isExecuting };
  };
  ```
