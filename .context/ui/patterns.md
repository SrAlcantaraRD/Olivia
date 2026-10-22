# Component implementation, state management

The Oliva app follows specific patterns for component implementation, state management, and user interaction handling.

## Component implementation patterns

### Controlled components with validation

```typescript
// src/ui/components/molecules/FormField.molecule.tsx
import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import { Eye, EyeOff } from 'lucide-react-native';

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  type?: 'text' | 'password' | 'email' | 'number';
  required?: boolean;
  placeholder?: string;
}

const StyledTextInput = styled(TextInput);
const StyledTouchable = styled(TouchableOpacity);

export function FormField({
  label,
  value,
  onChange,
  onBlur,
  error,
  type = 'text',
  required = false,
  placeholder,
}: FormFieldProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType = type === 'password' && !isPasswordVisible ? 'password' : 'text';

  const getKeyboardType = () => {
    switch (type) {
      case 'email': return 'email-address';
      case 'number': return 'numeric';
      default: return 'default';
    }
  };

  return (
    <View className="mb-4">
      <Text className="text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <Text className="text-red-500 ml-1">*</Text>}
      </Text>

      <View className="relative">
        <StyledTextInput
          className={`
            border rounded-lg px-3 py-2 pr-10
            ${error ? 'border-red-500' : isFocused ? 'border-blue-500' : 'border-gray-300'}
            ${error ? 'bg-red-50' : 'bg-white'}
          `}
          value={value}
          onChangeText={onChange}
          onBlur={() => {
            setIsFocused(false);
            onBlur?.();
          }}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          keyboardType={getKeyboardType()}
          secureTextEntry={type === 'password' && !isPasswordVisible}
          accessibilityLabel={label}
          accessibilityHint={placeholder}
        />

        {type === 'password' && (
          <StyledTouchable
            className="absolute right-3 top-1/2 -translate-y-1/2"
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
          >
            {isPasswordVisible ? (
              <EyeOff size={20} className="text-gray-500" />
            ) : (
              <Eye size={20} className="text-gray-500" />
            )}
          </StyledTouchable>
        )}
      </View>

      {error && (
        <Text className="text-red-500 text-sm mt-1" accessibilityRole="alert">
          {error}
        </Text>
      )}
    </View>
  );
}
```

### Data display components

```typescript
// src/ui/components/molecules/DataCard.molecule.tsx
import { View, Text, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import { format } from 'date-fns';

interface DataCardProps {
  title: string;
  value: string | number;
  unit?: string;
  timestamp: Date;
  status?: 'normal' | 'warning' | 'error';
  onPress?: () => void;
}

const StyledTouchable = styled(TouchableOpacity);
const StyledView = styled(View);

export function DataCard({
  title,
  value,
  unit,
  timestamp,
  status = 'normal',
  onPress,
}: DataCardProps) {
  const statusColors = {
    normal: 'bg-green-100 border-green-200 text-green-800',
    warning: 'bg-yellow-100 border-yellow-200 text-yellow-800',
    error: 'bg-red-100 border-red-200 text-red-800',
  };

  const CardComponent = onPress ? StyledTouchable : StyledView;

  return (
    <CardComponent
      className={`
        p-4 rounded-lg border
        ${statusColors[status]}
        ${onPress ? 'active:opacity-80' : ''}
      `}
      onPress={onPress}
      accessibilityRole={onPress ? 'button' : undefined}
    >
      <Text className="text-sm font-medium mb-1">{title}</Text>
      <Text className="text-2xl font-bold mb-2">
        {value}
        {unit && <Text className="text-lg font-normal"> {unit}</Text>}
      </Text>
      <Text className="text-xs opacity-75">
        {format(timestamp, 'MMM d, yyyy HH:mm')}
      </Text>
    </CardComponent>
  );
}
```

## State management patterns

### Local component state

```typescript
// src/ui/components/organisms/RecordForm.organism.tsx
import { useState, useCallback } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { useCreateRecord } from '@/hooks/use-create-record.hook';
import { FormField } from '../molecules/FormField.molecule';
import { Button } from '../atoms/Button.atom';

interface RecordFormProps {
  moduleId: number;
  onSuccess: () => void;
}
Trade-off: Less ecosystem support than Redux.

### State management

React Query is **not** used. Data loading goes through domain hooks and
use-cases; Zustand stores hold shared state. Cacheable results use `ICachePort`.
Any older text describing React Query is outdated.

### Why multi-step forms?

- **Cognitive load**: Break complex forms into digestible steps
- **Progress indication**: Users know how much is left
- **Error prevention**: Validate each step before proceeding

Trade-off: More complex navigation and state management.

### Why comprehensive testing?

- **Reliability**: Catch regressions early
- **Refactoring safety**: Confidence when changing code
- **Documentation**: Tests serve as usage examples

Trade-off: Development time and maintenance overhead.