# Estrategia de Pruebas

Este documento describe la estrategia de testing implementada en el proyecto, que incluye pruebas unitarias y end-to-end (E2E).

## 📁 Estructura de Carpetas

```
tests/
├── mocks/              # Mocks para pruebas unitarias
│   ├── api/            # Mocks de servicios externos
│   ├── domain/         # Mocks de las capas de negocio (entity + ports)
│   └── utils/          # Mocks de utilidades
├── unit-test/          # Pruebas unitarias
│   ├── components/     # Tests de componentes UI
│   ├── hooks/          # Tests de custom hooks
│   ├── domain/         # Tests de la lógica de negocio [use-case, mapper...]
│   ├── app/            # Tests de pantallas/rutas
│   └── constants/      # Tests de utilidades y constantes
├── e2e/                # Pruebas end-to-end de flujos críticos
│   ├── cateterismo/    # Gestión de cateterismos
│   └── auth/           # Flujos funcionales críticos de autenticación
└── setup.ts            # Configuración global de tests
```

## 🧪 Pruebas Unitarias (`/tests/unit-test`)

### Objetivo

Validar componentes, hooks y lógica de negocio de forma **aislada**, sin depender de servicios externos ni del estado global de la aplicación.

### Estructura

Las pruebas unitarias replican la estructura del código fuente para mantener una correspondencia directa entre módulos y sus casos de prueba.

**Ejemplo:**

```
components/floating-add-button.tsx
→ tests/unit-test/components/floating-add-button.test.tsx
```

### Herramientas

- **Jest**: Framework de testing
- **React Testing Library**: Renderizado y simulación de eventos
- **@testing-library/react-native**: Extensión para React Native

### Comandos

```bash
# Ejecutar todos los tests
pnpm test

# Modo watch (desarrollo)
pnpm test:watch

# Generar reporte de cobertura
pnpm test:coverage

# Ejecutar en CI/CD
pnpm test:ci
```

### Umbrales de Cobertura

```javascript
{
  global: {
    branches: 70%,
    functions: 70%,
    lines: 70%,
    statements: 70%
  }
}
```

### Ejemplo de Test

```typescript
import { render, fireEvent } from '@testing-library/react-native';
import { MyComponent } from '@/components/my-component';

describe('MyComponent', () => {
  it('should render correctly', () => {
    const { getByText } = render(<MyComponent />);
    expect(getByText('Hello')).toBeTruthy();
  });

  it('should handle button press', () => {
    const onPress = jest.fn();
    const { getByRole } = render(<MyComponent onPress={onPress} />);

    fireEvent.press(getByRole('button'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
```

## 🌐 Pruebas End-to-End (`/tests/e2e`)

### Objetivo

Validar los **flujos funcionales más críticos** de la aplicación, aquellos cuya interrupción afectaría directamente la experiencia del usuario.

### Flujos Críticos a Probar

1. **Autenticación**
   - Inicio de sesión
   - Recuperación de contraseña
   - Registro de nuevos usuarios

2. **Gestión de Registros**
   - Creación de nuevo registro de cateterización
   - Edición de registro existente
   - Eliminación de registro

3. **Navegación**
   - Flujo completo de navegación entre tabs
   - Navegación a pantallas modales
   - Navegación profunda (deep linking)

4. **Notificaciones**
   - Alta de suscripciones
   - Recepción de notificaciones
   - Gestión de permisos

### Herramientas

- **Detox**: Framework de testing E2E para React Native (Caja Gris)
- **Jest**: Runner de tests
- **Docker Compose**: Para desplegar backend de pruebas

### Entorno de Pruebas

Las pruebas E2E se ejecutan sobre un simulador/emulador controlado por Detox.

## 🔄 Integración Continua (CI/CD)

### Pipeline de GitLab

```yaml
stages:
  - lint
  - test
  - build
  - e2e
  - deploy

lint:
  script:
    - pnpm biome:check
    - tsc --noEmit

unit-tests:
  script:
    - pnpm test:ci
  coverage: '/All files[^|]*\|[^|]*\s+([\d\.]+)/'

build:
  script:
    - pnpm build

e2e-tests:
  script:
    - pnpm e2e:build:ios
    - pnpm e2e:test:ios

deploy-staging:
  script:
    - docker build -t app:staging .
    - docker push app:staging
```

## 📊 Reportes de Cobertura

Los reportes de cobertura se generan automáticamente en:

- **Terminal**: Resumen de cobertura
- **HTML**: `coverage/lcov-report/index.html`
- **LCOV**: `coverage/lcov.info` (para integración con CI/CD)

## 🎯 Mejores Prácticas

### Tests Unitarios

1. **Aislar dependencias**: Usar mocks para servicios externos
2. **Un concepto por test**: Cada test debe validar una sola cosa
3. **Nombres descriptivos**: `it('should navigate to add screen when button is pressed')`
4. **Arrange-Act-Assert**: Estructura clara de tests
5. **Evitar lógica compleja**: Los tests deben ser simples y legibles

### Tests E2E (Detox)

1. **Usar testID**: Identificar elementos de forma única (`testID="my-button"`)
2. **Sincronización automática**: Detox espera automáticamente a que la app esté inactiva
3. **Limpieza**: Restaurar el estado después de cada test (`beforeEach`, `afterAll`)
4. **Matchers**: Usar `by.id()`, `by.text()`, etc.
5. **Acciones**: `tap()`, `typeText()`, `scroll()`, etc.

## 🚀 Comandos Rápidos

```bash
# Tests unitarios
pnpm test                    # Ejecutar todos los tests
pnpm test:watch              # Modo watch
pnpm test:coverage           # Con cobertura

# Linting y type checking
pnpm biome:check             # Lint + format
tsc --noEmit                 # Type check

# E2E (Detox)
pnpm e2e:build:ios           # Construir app para E2E (iOS)
pnpm e2e:test:ios            # Ejecutar tests E2E (iOS)
```

## 📚 Recursos

- [Jest Documentation](https://jestjs.io/)
- [Detox Documentation](https://wix.github.io/Detox/)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Conventional Commits](https://www.conventionalcommits.org/)
