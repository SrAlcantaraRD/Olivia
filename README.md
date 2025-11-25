# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Arquitectura del Sistema

El objetivo es mantener el código desacoplado de la tecnología, estructurado y fácilmente extensible, siguiendo los principios de Clean Architecture y la Arquitectura Hexagonal.
Así pues, los diferentes artefactos con el cual se construye la aplicación son los siguientes:

- **Pattern**: Patrones de diseño utilizados para estructurar procesos complejos o estandarizar operaciones internas.
- **Enum**: Definen valores constantes del dominio para evitar errores y valores mágicos.
- **Entity**: Representan el estado del dominio. Se apoyan en Enums para evitar valores mágicos y son convertidas hacía/desde DTOs mediante Mappers.
- **DTO**: Modelos de entrada y salida que permiten desacoplar el dominio de la interfaz o de la infraestructura.
- **Mapper**: Transforman datos entre entidades y DTOs, y viceversa.
- **Interface**: Modelan elementos que no persisten en la BBDD.
- **Port**: abstracciones que definen cómo acceder a los datos, sin asociarse a ninguna tecnología concreta.
- **Use-case-schema**: Para validar los datos de entrada y salida.
- **Use-case**: Implementan las reglas de negocio, orquestando la lógica de cada operación (ej. registrar una rutina, sincronización QR, etc.).
- **Error**: Errores específicos del dominio, con códigos identificativos y sin depender de detalles técnicos.

### Back-end

No vamos a desarrollar una aplicación exclusiva de acceso a los datos, sino que vamos a trabajar directamente con la BBDD utilizando un ORM que facilite la iteración y evolución de la BBDD.

### Front-end

A este nivel, necesitaremos implementar los siguientes artefactos:

- **Hook**: Encapsula la lógica de presentación e invoca un use-case inyectándole los adapter que necesite.
- **Adapter**: Es la implementación de un port, donde se utiliza una tecnología concreta para interactuar con la BBDD, en nuestro caso DrizzleORM.

## Estructura de carpetas del proyecto

Con una estructura de carpeta organizada de la siguiente forma:

```sh
├── src/
│   ├── app/                # Configuración global, layouts, tabs, Context Providers y Route Guards.
│   ├── ddbb/               # Contiene la definición de la BBDD, los ficheros de migración y los adaptadores.
│   ├── domain/             # Contiene la lógica de negocio.
│   ├── ui/                 # Contiene la implementación exacta de los componentes de diseño.
│   │   ├── components/     # Implementación de metodología Atomic Design para componentes reutilizables.
│   │   ├── features/       #
│   │   └── i18n/           #
│   ├── hooks/              # Custom React hooks
│   ├── constants/          # Constantes y configuración
│   └── assets/             # Recursos estáticos
└── tests/                  # Estrategias de prueba unitaria, de integración y de comportamiento.
    ├── unit-test/          #
    ├── mocks/              #
    ├── integration/        #
    └── e2e/                #
```

## Git Hooks Configuration

Este proyecto usa **Husky** para automatizar tareas en el flujo de trabajo de Git.

### 🎯 Hooks Configurados

#### Pre-commit

Se ejecuta **antes** de cada commit:

- ✅ Formatea el código con Biome (`biome:format`)
- ✅ Ejecuta el linter con Biome (`biome:lint`)
- ℹ️ Solo se ejecuta en archivos staged (modificados)

#### Commit-msg

Valida el **formato del mensaje** de commit:

- ✅ Debe seguir el formato de [Conventional Commits](https://www.conventionalcommits.org/)
- ✅ Formato: `<type>(<scope>): <subject>`

##### Tipos permitidos

- `feat`: Nueva funcionalidad
- `fix`: Corrección de bugs
- `docs`: Cambios en documentación
- `style`: Cambios de formato (no afectan el código)
- `refactor`: Refactorización de código
- `perf`: Mejoras de rendimiento
- `test`: Añadir o modificar tests
- `build`: Cambios en el sistema de build
- `ci`: Cambios en CI/CD
- `chore`: Tareas de mantenimiento
- `revert`: Revertir commits anteriores

##### Ejemplos válidos

```bash
git commit -m "feat(layout): añadir botón flotante en tab bar"
git commit -m "fix(tabs): corregir efecto glass en iOS"
git commit -m "docs(auth): add domain business logic"
git commit -m "refactor(tabs): migrar a NativeTabs"
```

#### Pre-push

Se ejecuta **antes** de hacer push:

- ✅ Ejecuta los tests unitarios (`pnpm test`)
- ℹ️ Previene push si los tests fallan

### 🚀 Comandos Útiles

```bash
# Formatear todo el código manualmente
pnpm biome:format

# Ejecutar linter manualmente
pnpm biome:lint

# Ejecutar formato + lint
pnpm biome:check

# Ejecutar tests
pnpm test

# Saltarse los hooks (NO RECOMENDADO)
git commit --no-verify -m "mensaje"
git push --no-verify
```

### 📝 Notas

- Los hooks se instalan automáticamente al ejecutar `pnpm install` (gracias al script `prepare`)
- Si necesitas modificar los hooks, edita los archivos en `.husky/`
- Para modificar las reglas de commitlint, edita `commitlint.config.js`
- Para modificar qué archivos procesa lint-staged, edita `lint-staged.config.js`

## Estrategia de Pruebas

Este documento describe la estrategia de testing implementada en el proyecto, que incluye pruebas unitarias y end-to-end (E2E).

### 📁 Estructura de Carpetas

```sh
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

### 🧪 Pruebas Unitarias (`/tests/unit-test`)

#### Objetivo

Validar componentes, hooks y lógica de negocio de forma **aislada**, sin depender de servicios externos ni del estado global de la aplicación.

#### Estructura

Las pruebas unitarias replican la estructura del código fuente para mantener una correspondencia directa entre módulos y sus casos de prueba.

**Ejemplo:**

```
components/floating-add-button.tsx
→ tests/unit-test/components/floating-add-button.test.tsx
```

#### Herramientas

- **Jest**: Framework de testing
- **React Testing Library**: Renderizado y simulación de eventos
- **@testing-library/react-native**: Extensión para React Native

#### Comandos

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

#### Umbrales de Cobertura

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

#### Ejemplo de Test

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

### 🌐 Pruebas End-to-End (`/tests/e2e`)

#### Objetivo

Validar los **flujos funcionales más críticos** de la aplicación, aquellos cuya interrupción afectaría directamente la experiencia del usuario.

#### Flujos Críticos a Probar

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

#### Herramientas

- **Detox**: Framework de testing E2E para React Native (Caja Gris)
- **Jest**: Runner de tests
- **Docker Compose**: Para desplegar backend de pruebas

#### Entorno de Pruebas

Las pruebas E2E se ejecutan sobre un simulador/emulador controlado por Detox.

### 🔄 Integración Continua (CI/CD)

#### Pipeline de GitLab

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

### 📊 Reportes de Cobertura

Los reportes de cobertura se generan automáticamente en:

- **Terminal**: Resumen de cobertura
- **HTML**: `coverage/lcov-report/index.html`
- **LCOV**: `coverage/lcov.info` (para integración con CI/CD)

### 🎯 Mejores Prácticas

#### Tests Unitarios

1. **Aislar dependencias**: Usar mocks para servicios externos
2. **Un concepto por test**: Cada test debe validar una sola cosa
3. **Nombres descriptivos**: `it('should navigate to add screen when button is pressed')`
4. **Arrange-Act-Assert**: Estructura clara de tests
5. **Evitar lógica compleja**: Los tests deben ser simples y legibles

#### Tests E2E (Detox)

1. **Usar testID**: Identificar elementos de forma única (`testID="my-button"`)
2. **Sincronización automática**: Detox espera automáticamente a que la app esté inactiva
3. **Limpieza**: Restaurar el estado después de cada test (`beforeEach`, `afterAll`)
4. **Matchers**: Usar `by.id()`, `by.text()`, etc.
5. **Acciones**: `tap()`, `typeText()`, `scroll()`, etc.

### 🚀 Comandos Rápidos

```bash
# Tests unitarios
pnpm test                    # Ejecutar todos los tests
pnpm test:watch              # Modo watch
pnpm test:coverage           # Con cobertura

# Linting y type checking
pnpm biome:check             # Lint + format
pnpm biome:check             # Lint + format
tsc --noEmit                 # Type check

# E2E (Detox)
pnpm e2e:build:ios           # Construir app para E2E (iOS)
pnpm e2e:test:ios            # Ejecutar tests E2E (iOS)
```

### 📚 Recursos

- [Jest Documentation](https://jestjs.io/)
- [Detox Documentation](https://wix.github.io/Detox/)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Conventional Commits](https://www.conventionalcommits.org/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
