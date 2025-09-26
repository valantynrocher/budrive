# 🌱 Structure des pages de l'application Budrive

## 🧱 Structure Globale

Répertoire : `app/`

- `layout.tsx` — Layout général avec gestion thème / navigation ✅
- `page.tsx` — Page d'accueil du site publique 🚧
- `not-found.tsx` — Page 404 globale 🔜
- `error.tsx` — Page d’erreur application 🚧

---

## ✅ Pages Authentification

Répertoire : `app/auth/`

- `sign-in/page.tsx` — Connexion 🚧
- `sign-up/page.tsx` — Inscription 🚧
- `reset-password/page.tsx` — Réinitialisation du mot de passe 🔜
- `error.tsx` — Page d’erreur d'authentification 🔜

## 🚗 Pages Dashboard Véhicule

Répertoire : `app/dashboard/`

- `app/dashboard/page.tsx` - Page d'accueil du dashboard (cette page ne tient pas compte du véhicule sélectionné) 🚧

Structure paramétrée par `:vehicle_id` :

- `[vehicle_id]/infos/page.tsx` — Vue d'ensemble du véhicule 🚧
- `[vehicle_id]/assurances/page.tsx` — Gestion des assurances du véhicule 🔜
- `[vehicle_id]/reparations/page.tsx` — Historique des réparations du véhicule 🔜
- `[vehicle_id]/documents/page.tsx` — Documents liés au véhicule 🔜
- `[vehicle_id]/[...not-found]/page.tsx` — Page 404 personnalisée véhicule 🔜

## 👤 Pages Compte Utilisateur

Répertoire : `app/account/`

- `infos/page.tsx` — Infos du compte (email, mot de passe, etc.) 🔜
- `preferences/page.tsx` — Préférences utilisateur (ex : thème) 🔜
- `vehicules/page.tsx` — Liste des véhicules liés 🔜
- `notifications/page.tsx` — Paramètres de notifications (optionnel) 🔜

---

## 📁 Fichiers partagés utiles

Répertoire : `components/`

- `contexts/` — Contextes réutilisables
- `layouts/` — Layouts principaux
- `pages/` — Composants réutilisables entre différentes pages
- `ui/` — Composants génériques
