---
applyTo: 'tests/unit-test/ui/**/*.spec.tsx'
description: 'React Native component test rules (RNTL, accessibility, no native IO)'
---

## Goal
Validate UI behavior with React Native Testing Library (RNTL) in Node (no native runtime).

## Where
- Place files under `tests/unit-test/ui/**` and name `*.spec.tsx`.

## Naming
- `describe('[UI] <Component>', ...)` and `it('renders/does X when Y', ...)`.

## What to test
- User-visible behavior: render states, interactions, conditional UI.
- Accessibility: roles, labels, hints, disabled state.
- Navigation/events: assert the boundary call (mocked navigation adapter).

## What NOT to do
- No real DB, no network, no filesystem, no `expo-sqlite`.
- Avoid snapshots (allowed only for tiny, stable atoms if necessary).

## Rendering rules
- Use the project’s test setup/providers when available.
- Use `act` for state updates and `waitFor` for async UI.

## Selectors
- Prefer `getByRole`, `getByLabelText`, `getByTestId`.
- Do not assert translated strings unless the test fixes locale explicitly.

## Assertions
- Prefer explicit field/prop checks over broad truthy assertions.
- Cover: default, loading/empty, error, and happy paths when applicable.

## Example

```ts
    const { findByTestId } = render(<MyComponent someProp="value" />);

    const button = await findByTestId('my-button');

    expect(button).toBeEnabled();

    fireEvent.press(button);

    expect(mockedNavigation.navigate).toHaveBeenCalledWith('NextScreen');
```
