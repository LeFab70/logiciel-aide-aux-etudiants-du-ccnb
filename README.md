# App CCNB — Aide aux étudiants

Application multi-plateforme pour aider les étudiants du CCNB (Collège communautaire du Nouveau-Brunswick), en particulier les étudiants de première année, toutes filières confondues.

## Structure

- `api/` — Backend Spring Boot (Java), PostgreSQL, Flyway
- `web/` — Frontend Angular (étudiant + admin)
- `mobile/` — Application Flutter (phase ultérieure)
- `docs/` — Contrat OpenAPI partagé

Voir le plan détaillé dans `.claude/plans/` pour le périmètre v1 et l'ordre de construction.

## Démarrage — backend

```bash
cd api
./mvnw spring-boot:run
```

## Démarrage — web

```bash
cd web
npm install
ng serve
```
