# 🚗 Budrive

Budrive est une applicat\*ion SaaS de **gestion de véhicules** pour les **particuliers**.  
Elle permet de savoir **combien coûte réellement son véhicule** (entretien, réparations, assurance).

## 🗂 Structure du projet

Ce dépôt utilise un **monorepo** géré avec [Turborepo](https://turbo.build/repo) et [pnpm](https://pnpm.io/).

```
apps/
├── client/   # Frontend - Next.js (App Router, MUI, Supabase)
└── server/   # Backend - NestJS (API REST)
```

Chaque application possède son propre `README.md` avec des instructions spécifiques.

---

## 🚀 Stack technique

| Domaine                 | Techno principale                           |
| ----------------------- | ------------------------------------------- |
| Frontend                | [Next.js](https://nextjs.org/) + TypeScript |
| Design system           | [Material UI](https://mui.com/)             |
| Backend                 | [NestJS](https://nestjs.com/) + TypeScript  |
| Auth & DB               | [Supabase](https://supabase.com/)           |
| ORM                     | [Prisma](https://supabase.com/)             |
| Monorepo                | [Turborepo](https://turbo.build/repo)       |
| Gestionnaire de paquets | [pnpm](https://pnpm.io/)                    |

---

## ⚙️ Installation

1. **Cloner le dépôt :**

```bash
git clone https://github.com/ton-utilisateur/budrive.git
cd budrive
```

2. **Installer les dépendances :**

```bash
pnpm install
```

---

## 🏃 Démarrage en développement

Pour lancer **toutes les apps en parallèle** :

```bash
pnpm dev
```

- Frontend : [http://localhost:3000](http://localhost:3000)
- Backend : [http://localhost:3001](http://localhost:4000) (ou celui défini dans `.env`)

---

## 📜 Scripts utiles

| Commande     | Description                                    |
| ------------ | ---------------------------------------------- |
| `pnpm dev`   | Démarre **frontend** + **backend** en mode dev |
| `pnpm build` | Build toutes les apps                          |
| `pnpm lint`  | Lint du projet complet                         |
| `pnpm test`  | Lance les tests (toutes apps)                  |

---

## 🗄 Gestion des branches Git

- `main` → stable / production
- `develop` → branche de développement
- `feature/*` → pour chaque nouvelle fonctionnalité
- `fix/*` → pour les corrections de bugs

---

## 📂 Documentation

- [Frontend (`apps/client`)](./apps/client/README.md)
- [Backend (`apps/server`)](./apps/server/README.md)

---

## 🛡 Licence

MIT © 2025 - Valentin
