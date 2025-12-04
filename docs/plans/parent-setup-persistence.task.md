# Tareas: Persistencia ParentSetupForm

Checklist para seguimiento y gestión de nuevas subtareas.

- [x] Crear archivo de plan en `docs/plans/parent-setup-persistence.prompt.md`
- [x] Crear archivo de tareas (este archivo)

## Implementación (prioridad alta)
- [x] Crear esquemas Drizzle
  - [x] `src/database/schema/carer.database-schema.ts`
  - [x] `src/database/schema/patient.database-schema.ts`
  - [x] `src/database/schema/module.database-schema.ts`
  - [x] Exportar los nuevos esquemas en `src/database/schema/index.ts`

- [ ] Crear migración seed de módulos
  - `src/database/migrations/<timestamp>_seed_modules.sql` (insertar módulos y `module_field` desde JSON base)

- [x] Crear entidades de dominio (Zod)
  - [x] `src/domain/carer/entity/carer.entity.ts`
  - [x] `src/domain/patient/entity/patient.entity.ts`
  - [x] `src/domain/module/entity/module.entity.ts`
  - [x] `src/domain/module/entity/module-field.entity.ts`
  - [x] DTOs generados con helpers (`GenerateCreateDTOSchema`, etc.)
  - [x] Enums: `MODULE_KEY`, `MODULE_FIELD_TYPE`, `SEX`, `AUTONOMY_LEVEL`, `CARER_TYPE`

- [x] Definir ports
  - [x] `src/domain/carer/port/carer.port.ts` (`ICarerPort`)
  - [x] `src/domain/patient/port/patient.port.ts` (`IPatientPort`)
  - [x] `src/domain/module/port/module.port.ts` (`IModulePort`)
  - [x] `src/domain/module/port/module-field.port.ts` (`IModuleFieldPort`)

- [x] Implementar adapters SQLite
  - [x] `src/database/adapter/sqlite.carer.adapter.ts` (create, getById, getAll)
  - [x] `src/database/adapter/sqlite.patient.adapter.ts` (create con patient_module, getById, getAll)
  - [x] Añadir `toDomainEntity` estático y mapeos

- [x] Registrar adapters en `src/database/adapter/index.ts`

- [x] Crear use-case centralizado
  - [x] `src/domain/carer/use-case/setup-parent.usecase.ts` (`SetupParentUseCase`)
  - [x] Schema de request/response en `setup-parent.use-case-schema.ts`
  - [x] Orquestación: crea carer → crea patient → activa módulos

- [ ] Actualizar `use-parent-setup-form.hook`
  - [ ] Conectar con `SetupParentUseCase` para persistir datos
  - [ ] Manejar errores y estados de loading

- [ ] Actualizar UI (`parent-setup-form.component.tsx`)
  - [ ] Llamar a `save()` en el último paso
  - [ ] Mostrar estado `loading` y errores

- [x] Generar migraciones Drizzle
  - [x] Ejecutar `pnpm db:generate` y revisar archivos en `src/database/migrations`

## Tests y QA
- [x] Añadir tests unitarios para use-case
  - [x] `tests/unit-test/domain/carer/use-case/setup-parent.use-case.spec.ts`
  - [x] Casos: happy path, validación, errores carer/patient/módulos
- [x] Añadir tests unitarios para mappers
  - [x] `tests/unit-test/domain/*/mapper/*.spec.ts` (carer, patient, module, module-field)
- [ ] Añadir tests unitarios para adapters (con DB real o mocks)
- [ ] Pruebas manuales: completar flujo y verificar DB

## Consideraciones futuras (bajo demanda)
- [ ] Normalizar más entidades (ej. `carer` ↔ `auth` si se requiere login)
- [ ] Implementar `modulo_campos` dinámicos en UI y CRUD para módulos
- [ ] Implementar deduplicación/upsert de `paciente` en use-cases

---

Notas:
- IDs internos: `id` numeric PK + `uuid` text para UI
- Timestamps: epoch ms (INTEGER)
- Política actual: crear siempre nuevo `paciente` al finalizar

Asignaciones y estimaciones pueden añadirse como subtareas aquí si quieres. Puedes crear nuevas tareas editando este archivo o pidiéndome que lo haga.
