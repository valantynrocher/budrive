# 🌱 Roadmap — Structure des pages de l'application Budrive

## 🧱 Pages Globales

Répertoire : `app/(front)`

- `layout.tsx` — Layout général avec gestion thème / navigation ✅
- `page.tsx` — Inexistante, redirection vers `app/dashboard`
- `not-found.tsx` — Page 404 globale 🔜
- `error.tsx` — Page d’erreur application 🚧

## 📁 Fichiers partagés utiles

Répertoire : `components/`

- `layouts/` — Layouts principaux
- `pages/` — Composants de composition des pages
- `forms/` — Form controls réutilisables
- `ui/` — Composants génériques

---

## ✅ Pages Authentification

Répertoire : `app/(front)/auth/`

- `error.tsx` — Page d’erreur d'authentification 🚧
- `sign-in/page.tsx` — Connexion 🚧
- `sign-up/page.tsx` — Inscription 🚧
- `reset-password/page.tsx` — Réinitialisation du mot de passe 🔜

## 🚗 Pages Dashboard Véhicule

Répertoire : `app/(front)/app/dashboard/`

- `app/(front)/app/dashboard/page.tsx` - Page d'accueil du dashboard (pas besoin de véhicule sélectionné) 🚧

Structure paramétrée par `:vehicle_id` :

- `[vehicle_id]/infos/page.tsx` — Vue d'ensemble du véhicule 🚧
- `[vehicle_id]/assurances/page.tsx` — Gestion des assurances du véhicule 🔜
- `[vehicle_id]/reparations/page.tsx` — Historique des réparations du véhicule 🔜
- `[vehicle_id]/documents/page.tsx` — Documents liés au véhicule 🔜
- `[vehicle_id]/[...not-found]/page.tsx` — Page 404 personnalisée véhicule 🔜

## 👤 Pages Compte Utilisateur

Répertoire : `app/(front)/app/account/`

- `infos/page.tsx` — Infos du compte (email, mot de passe, etc.) 🔜
- `preferences/page.tsx` — Préférences utilisateur (ex : thème) 🔜
- `vehicules/page.tsx` — Liste des véhicules liés 🔜
- `notifications/page.tsx` — Paramètres de notifications (optionnel) 🔜
