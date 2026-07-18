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

## Devenir admin (bootstrap local)

Il n'y a pas d'endpoint public pour s'auto-promouvoir admin (par sécurité). Pour le premier compte admin en local, après inscription normale via l'app, attribuer le rôle directement en base :

```bash
psql -U ccnb -d ccnb -h localhost -c "INSERT INTO user_role (user_id, role) VALUES (<id>, 'ADMIN') ON CONFLICT DO NOTHING;"
```

Une fois qu'un admin existe, `PATCH /api/v1/admin/users/{id}/roles` (à venir) permettra de gérer les rôles des autres utilisateurs depuis l'app.
