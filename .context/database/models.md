# Data models, validation rules

Domain models define the structure and validation rules for business entities in the Oliva app.

## Entity definitions with Zod schemas

### Carer model

```typescript
// src/domain/carer/entity/carer.entity.ts
import { z } from 'zod';

export const carerSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(100),
  email: z.string().email().optional(),
  pinHash: z.string().optional(),
  type: z.enum(['parent', 'secondary']),
  isPrimary: z.boolean(),
  status: z.literal(1), // Active only in domain
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type TCarer = z.infer<typeof carerSchema>;

// Create/update schemas
export const createCarerSchema = carerSchema.omit({
  id: true,
  status: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  email: z.string().email().optional(), // Allow empty for secondary carers
  pinHash: z.string().optional(),
});

export type TCreateCarer = z.infer<typeof createCarerSchema>;
```

### Patient model

```typescript
// src/domain/patient/entity/patient.entity.ts
import { z } from 'zod';

export const patientSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(100),
  birthDate: z.date(),
  sex: z.enum(['male', 'female', 'other']),
  autonomyLevel: z.string().min(1).max(50),
  primaryCarerId: z.number().int().positive().optional(),
  status: z.literal(1),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type TPatient = z.infer<typeof patientSchema>;

export const createPatientSchema = patientSchema.omit({
  id: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});

export type TCreatePatient = z.infer<typeof createPatientSchema>;
```

### Module model

```typescript
// src/domain/module/entity/module.entity.ts
import { z } from 'zod';

export const moduleSchema = z.object({
  id: z.number().int().positive(),
  code: z.string().min(1).max(20).regex(/^[A-Z_]+$/),
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  active: z.boolean(),
  status: z.literal(1),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type TModule = z.infer<typeof moduleSchema>;
```

### Module field model

```typescript
// src/domain/module/entity/module-field.entity.ts
import { z } from 'zod';

const fieldTypeSchema = z.enum(['text', 'number', 'date', 'boolean', 'select']);

export const moduleFieldSchema = z.object({
  id: z.number().int().positive(),
  moduleId: z.number().int().positive(),
  code: z.string().min(1).max(30).regex(/^[a-z_]+$/),
  type: fieldTypeSchema,
  values: z.array(z.string()).optional(), // For select fields
  required: z.boolean(),
  orderIndex: z.number().int().min(0),
  status: z.literal(1),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type TModuleField = z.infer<typeof moduleFieldSchema>;

export const createModuleFieldSchema = moduleFieldSchema.omit({
  id: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});

export type TCreateModuleField = z.infer<typeof createModuleFieldSchema>;
```

### Record model

```typescript
// src/domain/record/entity/record.entity.ts
import { z } from 'zod';

export const recordSchema = z.object({
  id: z.number().int().positive(),
  moduleId: z.number().int().positive(),
  carerId: z.number().int().positive(),
  recordedAt: z.date(),
  synced: z.boolean(),
  status: z.literal(1),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type TRecord = z.infer<typeof recordSchema>;

export const createRecordSchema = recordSchema.omit({
  id: true,
  synced: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});

export type TCreateRecord = z.infer<typeof createRecordSchema>;
```

### Record field value model

```typescript
// src/domain/record/entity/record-field-value.entity.ts
import { z } from 'zod';

export const recordFieldValueSchema = z.object({
  id: z.number().int().positive(),
  recordId: z.number().int().positive(),
  fieldId: z.number().int().positive(),
  value: z.string().min(1),
  status: z.literal(1),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type TRecordFieldValue = z.infer<typeof recordFieldValueSchema>;

export const createRecordFieldValueSchema = recordFieldValueSchema.omit({
  id: true,
  status: true,
  createdAt: true,
  updatedAt: z.date(),
});

export type TCreateRecordFieldValue = z.infer<typeof createRecordFieldValueSchema>;
```
- **Audit trail**: Track important business operations
- **Testing**: Easy to verify side effects through events

Trade-off: Additional complexity in event handling.

### Why strict field validation?

- **Data quality**: Prevent invalid data entry
- **User experience**: Immediate feedback on errors
- **Compliance**: Medical data must be accurate

Trade-off: More complex form validation logic.

### Why UUIDs for some identifiers?

- **Privacy**: Don't expose sequential IDs
- **Security**: Harder to guess invitation URLs
- **Distributed**: Work well in offline scenarios

Trade-off: More complex than simple integers.
