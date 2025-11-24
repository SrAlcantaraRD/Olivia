# Git Hooks Configuration

Este proyecto usa **Husky** para automatizar tareas en el flujo de trabajo de Git.

## 🎯 Hooks Configurados

### Pre-commit

Se ejecuta **antes** de cada commit:

- ✅ Formatea el código con Biome (`biome:format`)
- ✅ Ejecuta el linter con Biome (`biome:lint`)
- ℹ️ Solo se ejecuta en archivos staged (modificados)

### Commit-msg

Valida el **formato del mensaje** de commit:

- ✅ Debe seguir el formato de [Conventional Commits](https://www.conventionalcommits.org/)
- ✅ Formato: `<type>(<scope>): <subject>`

#### Tipos permitidos

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

#### Ejemplos válidos

```bash
git commit -m "feat(layout): añadir botón flotante en tab bar"
git commit -m "fix(tabs): corregir efecto glass en iOS"
git commit -m "docs(auth): add domain business logic"
git commit -m "refactor(tabs): migrar a NativeTabs"
```

### Pre-push

Se ejecuta **antes** de hacer push:

- ✅ Ejecuta los tests unitarios (`pnpm test`)
- ℹ️ Previene push si los tests fallan

## 🚀 Comandos Útiles

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

## 📝 Notas

- Los hooks se instalan automáticamente al ejecutar `pnpm install` (gracias al script `prepare`)
- Si necesitas modificar los hooks, edita los archivos en `.husky/`
- Para modificar las reglas de commitlint, edita `commitlint.config.js`
- Para modificar qué archivos procesa lint-staged, edita `lint-staged.config.js`
