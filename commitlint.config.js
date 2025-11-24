export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // Nueva funcionalidad
        'fix', // Corrección de bugs
        'docs', // Cambios en documentación
        'style', // Cambios de formato (no afectan el código)
        'refactor', // Refactorización de código
        'perf', // Mejoras de rendimiento
        'test', // Añadir o modificar tests
        'build', // Cambios en el sistema de build
        'ci', // Cambios en CI/CD
        'chore', // Tareas de mantenimiento
        'revert', // Revertir commits anteriores
      ],
    ],
    'subject-case': [0], // Permitir cualquier case en el subject
  },
};
