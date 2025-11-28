# FormWizard Molecule

## Descripción

`FormWizard` es un componente molecule reutilizable que encapsula la lógica de un formulario multi-paso (wizard). Proporciona una interfaz consistente para navegar entre diferentes pasos del formulario, mostrando el progreso, validación y navegación.

## Características

- **Navegación entre pasos**: Botones de avance y retroceso con validación
- **Indicador de progreso**: Muestra el progreso visual con `AtomPaginationDots`
- **Botón circular de progreso**: `AtomCircularProgressButton` que refleja el estado de completitud
- **Validación por paso**: Cada paso puede definir su propia lógica de validación
- **Header consistente**: Logo y botón de retroceso opcionales
- **Scrollable content**: Integra `KeyboardAwareScrollView` para formularios con inputs

## Props

```typescript
interface FormWizardStep {
  id: string;                    // Identificador único del paso
  titleKey: Ti18nKeys;           // Clave i18n para el título
  descriptionKey?: Ti18nKeys;    // Clave i18n para la descripción (opcional)
  content: ReactNode;            // Contenido del paso (campos, cards, etc.)
  isValid: boolean;              // Estado de validación del paso
}

interface FormWizardProps {
  steps: FormWizardStep[];       // Array de pasos del wizard
  currentStepIndex: number;      // Índice del paso actual (0-based)
  onNext: () => void;            // Callback al avanzar
  onBack: () => void;            // Callback al retroceder
  showBackButton?: boolean;      // Mostrar botón de retroceso (default: true)
  showLogo?: boolean;            // Mostrar logo en header (default: true)
  showProgress?: boolean;        // Mostrar indicador de progreso (default: true)
}
```

## Uso

### Ejemplo básico: Formulario de configuración de usuario

```tsx
import { useState } from 'react';
import { TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { FormWizard, type FormWizardStep } from '@/ui/components/molecules';
import { TypographyParagraph } from '@/ui/components/atoms/typography.atom';

export default function UserSetupScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [preferences, setPreferences] = useState<string[]>([]);

  // Definir los pasos del wizard
  const steps: FormWizardStep[] = [
    {
      id: 'personal-info',
      titleKey: 'setup.personal-info.title',
      descriptionKey: 'setup.personal-info.description',
      isValid: name.trim().length > 0 && email.includes('@'),
      content: (
        <>
          <View className="mb-4">
            <TypographyParagraph i18nKey="setup.name-label" />
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Tu nombre"
            />
          </View>
          <View className="mb-4">
            <TypographyParagraph i18nKey="setup.email-label" />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="tu@email.com"
              keyboardType="email-address"
            />
          </View>
        </>
      ),
    },
    {
      id: 'preferences',
      titleKey: 'setup.preferences.title',
      descriptionKey: 'setup.preferences.description',
      isValid: preferences.length > 0,
      content: (
        <View>
          {/* Componentes de selección de preferencias */}
        </View>
      ),
    },
  ];

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      // Lógica para avanzar al siguiente paso
      // Guardar datos, actualizar estado, etc.
    } else {
      // Último paso: guardar y navegar
      router.replace('/dashboard');
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <FormWizard
      steps={steps}
      currentStepIndex={0}
      onNext={handleNext}
      onBack={handleBack}
    />
  );
}
```

## Implementación en parent-setup

El flujo `parent-setup` utiliza FormWizard en tres pantallas:

1. **parent-info.tsx**: Información del tutor (nombre, relación)
2. **child-info.tsx**: Información del menor (nombre, fecha nacimiento, diagnóstico)
3. **modules.tsx**: Selección de módulos a activar

Cada pantalla define un solo step y gestiona su propia navegación con `router.push()`.

## Estructura del Componente

```
FormWizard
├── Header
│   ├── Botón Back (opcional)
│   ├── Logo (opcional)
│   └── Spacer
├── Progress Indicator (opcional)
│   └── AtomPaginationDots
├── Content (Scrollable)
│   ├── Título (i18n)
│   ├── Descripción (i18n, opcional)
│   └── Step Content (children)
└── Footer (Fixed)
    ├── ButtonAtom (Back)
    └── AtomCircularProgressButton (Next)
```

## Validación

El componente respeta la validación de cada paso:

- El botón de avance (`AtomCircularProgressButton`) cambia de color según `isValid`
- El callback `onNext` solo se ejecuta si `currentStep.isValid === true`
- Es responsabilidad del componente padre gestionar la validación de cada paso

## Personalización

### Sin logo ni indicador de progreso

```tsx
<FormWizard
  steps={steps}
  currentStepIndex={0}
  onNext={handleNext}
  onBack={handleBack}
  showLogo={false}
  showProgress={false}
/>
```

### Sin botón de retroceso (primer paso)

```tsx
<FormWizard
  steps={steps}
  currentStepIndex={0}
  onNext={handleNext}
  onBack={handleBack}
  showBackButton={false}
/>
```

## Beneficios

1. **Reutilizable**: Se puede usar en cualquier flujo multi-paso
2. **Consistente**: Todas las pantallas tienen la misma estructura y UX
3. **Mantenible**: Cambios en el layout se reflejan en todos los wizards
4. **Flexible**: Cada paso puede tener contenido completamente diferente
5. **Validación clara**: Estado de validación visible en la UI

## Mejoras Futuras

- [ ] Soporte para pasos opcionales (skip)
- [ ] Animaciones entre pasos
- [ ] Persistencia automática de datos
- [ ] Navegación directa a un paso específico
- [ ] Modo compacto (sin scroll)
