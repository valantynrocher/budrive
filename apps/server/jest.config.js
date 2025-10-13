export default {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: ".",
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts", // type files
    "!src/**/index.ts",
    "!src/**/*.module.ts",
    "!src/**/main.ts",
    "!src/app.service.ts",
    "!src/**/*.controller.ts",
    // --- Exclusions des couches d'infrastructure non testées en unitaire ---
    // Les tests E2E/Intégration devront couvrir ceux-ci plus tard
    "!src/**/infrastructure/persistence/*", // Repositories Prisma (à tester en Intégration)
    "!src/**/infrastructure/guards/*", // Guards (simples vérifications)
    "!src/**/infrastructure/strategies/*", // Strategies (simples mappings)
    "!src/**/infrastructure/utils/*", // Utilitaires simples (cookies)
    "!src/**/infrastructure/common/zod/*", // Pipes de validation
    // --- Exclusions des services d'infrastructure mockés et/ou non essentiels ---
    "!src/shared/infrastructure/prisma/prisma.service.ts", // On mocke le client, on peut l'exclure ici
    "!src/infrastructure/services/mail/mail.service.ts", // On peut l'exclure si on teste juste qu'il est appelé
  ],
  coverageDirectory: "../coverage",
  transformIgnorePatterns: ["/node_modules/"],
};
