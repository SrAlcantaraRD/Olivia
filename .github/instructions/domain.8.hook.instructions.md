---
applyTo: "**/*.hook.ts,**/*.hook.spec.ts,**/ui/**/*.hook.ts"
description: "Instructions for implementing reusable React hooks (copied from existing instruction artifact)."
---
````instructions
# Domain Hooks — Consolidated

This artifact has been consolidated into the canonical architecture guide.

See: `docs/architecture/condensed-copilot-guide.md` — section "Hooks: useAdapters and Hook Patterns" for canonical hook patterns and DI via `useAdapters()`.

Original content archived at: `.github/artifacts/archive/1.domain__8.hook.instructions.md`

If you need the original full text, open the archive file above or check Git history.
---
applyTo: "**/*.hook.ts,**/ui/**/*.hook.ts"
description: "Instructions for implementing reusable React hooks wrapping hook port adapters (list/detail/mutations)."
---

# Frontend Hook Instructions

## Purpose
Encapsulate data fetch lifecycle, caching, and user feedback while exposing a simple execute interface to components.

## Artifacts
- `<feature>.hook.ts`
- `<feature>.hook.spec.ts`
- Mutation hooks as needed (create/update/delete)
- Main hooks defined at `./src/domain/core/src/hooks`:
  - useCreateEntity
  - useFindEntityByUUID
  - useGetEntityList

## Naming
- `useGet<Entity>List`
- `useFind<Entity>ByUUID`

## Pattern
```ts
export const use<Feature> = (
  notify: INotifyPort,
  // add required adapter to execute the hook
  adapter: I<Entity>Port,
): IUseHook<<RequestEntity>DTO, <ResponseEntity>DTO> => {
  const [isExecuting, setExecuting] = useState<boolean>(false);

const execute = useCallback(
    async (dto: <RequestEntity>DTO): Promise<IHookResponse<<ResponseEntity>DTO>> => {
      setExecuting(true);

      try {
        // call adapter method
        const response = await adapter.<action>(dto);

        if (!response.success || !response.details) {
          notifyAdapter.error({
            title: `error.creating-a-${entityName}`,
            message: response.message,
          });

          return { success: false };
        }

        return { success: true, data: response.details.item };
      } catch (error) {
        console.error(error);
        return { success: false };
      } finally {
        setExecuting(false);
      }
    },
    []
  );

  return { execute, isExecuting };
}
```

## Caching
- Rely on central store keyed by entity name; do not re-fetch if items already present.

## Error Handling
- Use notify adapter -> `notify.error({ title, message })`
- Return `{ success:false }` without throwing

## Tests
- First call hits adapter; second uses cache
- Error path triggers `notify.error`

## Quality Gates
- No direct HTTP inside hook
- No `any`
- Hook returns stable function references

````
