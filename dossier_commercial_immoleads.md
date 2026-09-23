# ATLORYX ImmoLeads — Dossier Commercial & Guide de Déploiement

> **Document confidentiel — ATLORYX © 2026**
> Version 1.0 — Septembre 2026

---

## 1. Définition de la Solution

**ATLORYX ImmoLeads** est une plateforme CRM (Customer Relationship Management) spécialement conçue pour les **agences immobilières** et **promoteurs immobiliers au Maroc**.

### 🎯 Mission
> Transformer chaque prospect publicitaire en visite physique organisée, grâce à un système structuré de qualification, suivi et relance.

### Le Problème Résolu
Les agences immobilières marocaines reçoivent des dizaines de leads par jour depuis Meta Ads (Facebook/Instagram), Google Ads, Avito et Mubawab. Actuellement :
- **80% des leads** sont perdus par manque de suivi structuré
- Les agents gèrent tout **via WhatsApp personnel** sans traçabilité
- Aucun moyen de mesurer le **ROI des campagnes publicitaires**
- Les relances sont oubliées, les visites ne sont pas planifiées
- Le directeur d'agence **n'a aucune visibilité** sur le pipeline commercial

### La Solution ImmoLeads
Un système **centralisé, automatisé et mesurable** qui connecte vos campagnes publicitaires directement à un pipeline commercial structuré — du premier clic jusqu'à la visite signée.

---

## 2. Fonctionnalités Détaillées & Rôle de Chacune

### 📊 2.1 Dashboard Temps Réel
| Élément | Description |
|---------|------------|
| **KPIs en direct** | Nouveaux leads, leads qualifiés, visites planifiées, taux de conversion — mis à jour en temps réel |
| **Pipeline visuel** | Vue d'ensemble du flux : Nouveau → Contacté → Qualifié → Visite → Négociation → Gagné |
| **Alertes instantanées** | Notification immédiate à chaque nouveau lead reçu |
| **Rôle** | Donne au directeur d'agence une vue claire et instantanée de l'activité commerciale |

### 👥 2.2 Gestion des Leads (Prospects)
| Fonctionnalité | Description |
|---------------|------------|
| **Ingestion automatique** | Les leads arrivent automatiquement depuis Meta Ads, Google Ads, Avito, Mubawab via webhook |
| **Fiche lead complète** | Nom, téléphone, email, ville, budget, source, bien d'intérêt, notes |
| **Statuts du pipeline** | NEW → CONTACTED → QUALIFIED → VISIT_SCHEDULED → NEGOTIATION → WON / LOST |
| **Assignation automatique** | Distribution Round-Robin intelligente entre les agents de l'équipe |
| **Historique d'activité** | Timeline complète de toutes les interactions (appels, messages, notes, changements de statut) |
| **Notes collaboratives** | Chaque agent peut ajouter des notes avec historique complet |
| **Import en masse** | Import CSV/Excel pour migrer des leads existants |
| **Raison de perte** | Suivi des raisons de perte (budget, localisation, délai, concurrent) pour analyser les tendances |
| **Rôle** | C'est le cœur du CRM — chaque prospect est suivi du premier contact à la conversion |

### 🏗️ 2.3 Pipeline Kanban Visuel
| Fonctionnalité | Description |
|---------------|------------|
| **Vue Kanban drag & drop** | Déplacez les leads entre les colonnes par glisser-déposer |
| **Filtres avancés** | Par agent, source, ville, budget, date |
| **Compteurs par étape** | Nombre de leads à chaque étape du pipeline |
| **Rôle** | Vue commerciale pour les managers — identifiez les goulots d'étranglement en un coup d'œil |

### 🏠 2.4 Gestion des Biens Immobiliers
| Fonctionnalité | Description |
|---------------|------------|
| **Catalogue de biens** | Titre, type (appartement, villa, bureau, terrain), surface, prix, ville, quartier |
| **Photos multiples** | Upload et gestion des images avec stockage cloud |
| **Statuts** | Disponible, Réservé, Vendu/Loué |
| **Page publique** | Chaque bien a une page de vitrine accessible avec formulaire de demande de visite |
| **Matching automatique** | Suggestion de biens correspondant au profil du lead (budget, ville, type) |
| **Lien avec les campagnes** | Associez un bien spécifique à vos campagnes Meta Ads |
| **Rôle** | Centralisez votre inventaire et associez-le directement aux prospects pour un suivi cohérent |

### 📅 2.5 Gestion des Visites
| Fonctionnalité | Description |
|---------------|------------|
| **Planification** | Créez des visites avec date, heure, lieu, lead associé et agent responsable |
| **Statuts** | Planifiée → Complétée / Annulée / No-show |
| **Calendrier** | Vue calendrier mensuelle avec toutes les visites de l'agence |
| **Comptes-rendus** | Notes post-visite pour documenter le résultat |
| **Rôle** | Organisez et suivez chaque visite physique — l'indicateur clé de conversion |

### 🔔 2.6 Follow-up & Relances Intelligentes
| Fonctionnalité | Description |
|---------------|------------|
| **Rappels automatiques** | Système de relance basé sur les dates de suivi programmées |
| **Alertes en retard** | Identifiez immédiatement les leads oubliés (overdue) |
| **Replanification rapide** | Reprogrammez un suivi en 1 clic (+1 jour, +3 jours, +1 semaine) |
| **Cron automatique** | Vérification quotidienne des suivis en retard avec notification de l'agent |
| **Rôle** | Aucun lead n'est oublié — le système relance automatiquement les agents |

### 💬 2.7 Intégration WhatsApp Business API
| Fonctionnalité | Description |
|---------------|------------|
| **Envoi de messages** | Envoyez des messages WhatsApp directement depuis la fiche lead |
| **Templates** | Messages pré-configurés pour qualification, confirmation de visite, relance |
| **Historique** | Tous les messages sont enregistrés dans le CRM |
| **Configuration** | Connexion sécurisée via WhatsApp Business API |
| **Rôle** | Communiquez via le canal #1 au Maroc sans quitter le CRM |

### 📈 2.8 Analytics & Mesure ROI
| Fonctionnalité | Description |
|---------------|------------|
| **Funnel de conversion** | Visualisez le taux de passage entre chaque étape du pipeline |
| **Analyse par source** | Mesurez quel canal (Meta, Google, Avito) génère le plus de conversions |
| **Tendances** | Évolution des leads et visites par semaine/mois |
| **Performance agents** | Classement des agents par leads traités, visites réalisées, taux de conversion |
| **Temps de réponse** | Mesurez le délai entre la réception du lead et le premier contact |
| **KPIs Revenue** | Estimez le revenu potentiel basé sur les leads gagnés |
| **Objectifs mensuels** | Fixez et suivez les objectifs de l'équipe (leads, visites, conversions) |
| **Rôle** | Prenez des décisions data-driven — optimisez vos dépenses pub et votre équipe |

### 🔍 2.9 Recherche Globale (Ctrl+K)
| Fonctionnalité | Description |
|---------------|------------|
| **Palette de commandes** | Recherchez leads, biens, visites instantanément avec raccourci clavier |
| **Rôle** | Accédez à n'importe quelle information en moins de 2 secondes |

### ⚙️ 2.10 Paramètres & Gestion d'Équipe
| Fonctionnalité | Description |
|---------------|------------|
| **Profil agence** | Nom, ville, description, configuration de l'agence |
| **Gestion des agents** | Inviter des agents, définir les rôles (admin, agent) |
| **Configuration WhatsApp** | Paramétrage de l'API WhatsApp Business |
| **Objectifs de performance** | Définir les cibles mensuelles par agent |
| **Rôle** | Administrez votre agence et votre équipe depuis un seul endroit |

### 🛡️ 2.11 SuperAdmin (Multi-Agences)
| Fonctionnalité | Description |
|---------------|------------|
| **Vue globale** | Dashboard de toutes les agences sur la plateforme |
| **Gestion des agences** | Créer, activer, désactiver des agences |
| **Gestion des utilisateurs** | Voir et gérer tous les utilisateurs de la plateforme |
| **Demandes de démo** | Recevoir et convertir les demandes de démonstration en agences actives |
| **Rôle** | Espace réservé à ATLORYX pour gérer la plateforme multi-tenant |

### 📱 2.12 Progressive Web App (PWA)
| Fonctionnalité | Description |
|---------------|------------|
| **Installation mobile** | Installez l'app sur votre téléphone comme une app native |
| **Responsive design** | Interface optimisée pour mobile, tablette et desktop |
| **Navigation mobile** | Barre de navigation inférieure pour accès rapide |
| **Rôle** | Vos agents peuvent travailler sur le terrain depuis leur téléphone |

---

## 3. Valeur Ajoutée & Points Forts

### 💎 Valeur Ajoutée Clé

| Avant ImmoLeads | Après ImmoLeads |
|-----------------|-----------------|
| Leads éparpillés dans WhatsApp | **Centralisation complète** dans un pipeline structuré |
| Aucun suivi des relances | **Rappels automatiques** — 0 lead oublié |
| Impossible de mesurer le ROI | **Analytics détaillées** par source, agent, période |
| Distribution manuelle des leads | **Round-Robin automatique** entre les agents |
| Directeur aveugle sur l'activité | **Dashboard temps réel** avec KPIs |
| Pas de traçabilité | **Historique complet** de chaque interaction |
| Communication non tracée | **WhatsApp Business intégré** dans le CRM |

### 🏆 Points Forts Compétitifs

1. **🇲🇦 Conçu pour le Maroc** — Interface en français, devises en DH, intégration WhatsApp (canal #1 au Maroc), sources Avito/Mubawab
2. **⚡ Temps réel** — Dashboard live, notifications instantanées, assignation automatique
3. **🔗 Connexion directe Meta Ads** — Webhook natif pour recevoir les leads Facebook/Instagram en temps réel
4. **📱 Mobile-first** — PWA installable, responsive, barre de navigation mobile
5. **🤖 Automatisation** — Assignation Round-Robin, rappels de suivi, relances automatiques
6. **📊 Data-driven** — Funnel analytics, performance agents, ROI par source, objectifs mensuels
7. **🔒 Multi-tenant sécurisé** — Chaque agence a son espace isolé avec Row Level Security
8. **💬 WhatsApp natif** — Qualification et suivi directement via WhatsApp Business API
9. **🏢 Multi-agences** — Architecture conçue pour gérer des centaines d'agences simultanément
10. **🖥️ Stack moderne** — Next.js 16, React 19, Supabase, Vercel — performance et fiabilité

---

## 4. Grille Tarifaire

### 💰 Option A — Abonnement SaaS Mensuel (Plateforme Partagée)

> L'agence utilise la plateforme ATLORYX ImmoLeads hébergée. Mises à jour automatiques, support inclus.

| Plan | Prix/mois (HT) | Agents inclus | Leads/mois | Fonctionnalités |
|------|----------------|---------------|------------|-----------------|
| **Starter** | **499 DH** | Jusqu'à 3 | 200 | Dashboard, Pipeline, Leads, Biens, Visites, Follow-up, Notifications |
| **Pro** | **999 DH** | Jusqu'à 8 | Illimités | Tout Starter + Analytics avancés, WhatsApp API, Import CSV, Objectifs, Rapports |
| **Enterprise** | **1 999 DH** | Jusqu'à 20 | Illimités | Tout Pro + Multi-branches, API webhook dédiée, Support prioritaire, Formation |
| **Custom** | Sur devis | Illimités | Illimités | Architecture dédiée, personnalisations, SLA garanti |

**Inclus dans tous les plans :**
- ✅ Hébergement cloud sécurisé (Vercel + Supabase)
- ✅ Mises à jour automatiques
- ✅ SSL / HTTPS
- ✅ Support par WhatsApp
- ✅ Application PWA mobile
- ✅ Onboarding et formation initiale

> [!TIP]
> **Tarification compétitive** : Les solutions CRM internationales (HubSpot, Pipedrive) coûtent entre 200-500 DH/**par utilisateur**/mois. ImmoLeads offre un prix fixe par agence, bien plus avantageux pour les équipes de 3+ agents.

---

### 💼 Option B — Achat du Projet Complet (Licence Unique)

> Le client achète le code source complet et le déploie sur sa propre infrastructure. Aucun abonnement mensuel.

| Offre | Prix (HT) | Inclus |
|-------|-----------|--------|
| **Licence Standard** | **35 000 DH** | Code source complet, documentation technique, 1 déploiement, 30 jours de support |
| **Licence + Déploiement** | **50 000 DH** | Tout Standard + Déploiement Vercel/Supabase, configuration DNS, formation équipe (3 sessions) |
| **Licence + Personnalisation** | **75 000 — 120 000 DH** | Tout ci-dessus + Branding personnalisé, fonctionnalités sur mesure, intégrations spécifiques |

**Le client reçoit :**
- ✅ Code source complet (Next.js 16, React 19, TypeScript)
- ✅ Base de données Supabase avec migrations
- ✅ Documentation technique & API
- ✅ Webhook d'ingestion de leads
- ✅ Guide de déploiement Vercel
- ✅ Architecture multi-tenant

**Le client est responsable de :**
- ❗ Hébergement (Vercel ~$20/mois, Supabase ~$25/mois)
- ❗ Maintenance et mises à jour
- ❗ Support de ses utilisateurs

> [!IMPORTANT]
> **Recommandation** : Pour la majorité des agences, l'**abonnement SaaS** est plus avantageux (pas de coût d'infrastructure, mises à jour automatiques, support continu). L'achat complet est recommandé pour les **grands promoteurs** ou **réseaux d'agences** souhaitant un contrôle total.

---

## 5. Intégration Meta Ads (Facebook & Instagram)

### 🔗 5.1 Architecture d'Intégration

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   Meta Ads       │     │   Zapier /        │     │   ImmoLeads      │
│   (FB/Instagram) │────▶│   Make.com /      │────▶│   Webhook API    │
│   Lead Forms     │     │   Webhook direct  │     │   /api/webhooks/ │
└──────────────────┘     └──────────────────┘     └──────────────────┘
                                                         │
                                                         ▼
                                                  ┌──────────────────┐
                                                  │  ✅ Lead créé     │
                                                  │  ✅ Agent assigné  │
                                                  │  ✅ Notification   │
                                                  └──────────────────┘
```

### 📋 5.2 Étape par Étape — Connexion Meta Ads → ImmoLeads

#### Étape 1 : Créer une campagne Lead Generation sur Meta Ads Manager

1. Aller sur [business.facebook.com](https://business.facebook.com)
2. Créer une nouvelle campagne → Objectif : **Génération de prospects**
3. Configurer l'audience (voir section 6 ci-dessous)
4. Créer un **Instant Form** (formulaire instantané) avec les champs :
   - Nom complet (pré-rempli)
   - Numéro de téléphone (pré-rempli)
   - Email (optionnel)
   - Ville (question personnalisée)
   - Budget (question personnalisée : < 1M DH, 1-2M DH, 2-3M DH, 3-5M DH, > 5M DH)
   - Message (champ libre)

#### Étape 2 : Connecter les leads à ImmoLeads

**Option A — Via Zapier/Make.com (Recommandé pour débutants)**

1. Créer un compte sur [zapier.com](https://zapier.com) ou [make.com](https://make.com)
2. Trigger : **Facebook Lead Ads** → Nouvel lead soumis
3. Action : **Webhooks by Zapier** → POST vers votre URL ImmoLeads

```
URL: https://votre-domaine.com/api/webhooks/leads
Méthode: POST
Headers:
  Content-Type: application/json
  x-webhook-secret: VOTRE_SECRET_TOKEN

Body (JSON):
{
  "name": "{{full_name}}",
  "phone": "{{phone_number}}",
  "email": "{{email}}",
  "city": "{{city}}",
  "budget": {{budget}},
  "source": "FACEBOOK_ADS",
  "notes": "{{message}} — Campagne: {{campaign_name}}"
}
```

**Option B — Webhook Direct via Meta (Avancé)**

1. Dans Meta Business Suite → Paramètres → Intégrations
2. Configurer un webhook personnalisé vers :
   ```
   POST https://votre-domaine.com/api/webhooks/leads
   ```
3. Ajouter le header d'authentification :
   ```
   x-webhook-secret: VOTRE_SECRET_TOKEN
   ```

#### Étape 3 : Tester l'intégration

```bash
# Test avec cURL
curl -X POST https://votre-domaine.com/api/webhooks/leads \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: VOTRE_SECRET_TOKEN" \
  -d '{
    "name": "Test Karim",
    "phone": "+212661234567",
    "email": "test@example.com",
    "city": "Casablanca",
    "budget": 1800000,
    "source": "FACEBOOK_ADS",
    "notes": "Test intégration Meta Ads"
  }'
```

Réponse attendue :
```json
{
  "success": true,
  "message": "Lead ingéré avec succès",
  "lead": {
    "id": "uuid-du-lead",
    "name": "Test Karim",
    "phone": "+212661234567",
    "source": "FACEBOOK_ADS"
  }
}
```

### 📌 5.3 Sources Supportées

| Source | Code API | Description |
|--------|----------|------------|
| Facebook/Instagram Ads | `FACEBOOK_ADS` | Leads depuis Meta Lead Forms |
| Google Ads | `GOOGLE_ADS` | Leads depuis Google Lead Forms |
| Avito.ma | `AVITO` | Prospects depuis les annonces Avito |
| Mubawab.ma | `MUBAWAB` | Prospects depuis les annonces Mubawab |
| Site web | `WEBSITE` | Formulaires du site vitrine ImmoLeads |
| Bouche-à-oreille | `REFERRAL` | Recommandations et réseautage |
| Autre | `OTHER` | Toute autre source |

---

## 6. Stratégie de Ciblage Meta Ads au Maroc

### 🎯 6.1 Audience Principale

#### Acheteurs Immobiliers (Acquisition)

| Paramètre | Configuration |
|-----------|---------------|
| **Localisation** | Maroc — Villes ciblées : Casablanca, Marrakech, Rabat, Tanger, Agadir, Fès, Kénitra, Mohammedia |
| **Âge** | 28 – 55 ans |
| **Genre** | Tous |
| **Langues** | Français, Arabe |
| **Intérêts** | Immobilier, Propriété, Appartements, Investissement immobilier, Décoration intérieure, Architecture |
| **Comportements** | Voyageurs fréquents, Utilisateurs de smartphones haut de gamme, Acheteurs en ligne récents |
| **Niveau d'études** | Université et plus |
| **Statut professionnel** | Cadres, Entrepreneurs, Professions libérales |

#### Locataires (Recherche de Location)

| Paramètre | Configuration |
|-----------|---------------|
| **Localisation** | Zones urbaines principales |
| **Âge** | 24 – 45 ans |
| **Intérêts** | Location d'appartements, Déménagement, Vie urbaine |
| **Événements de vie** | Récemment déménagé, Nouveau travail, Mariage récent |

### 🔄 6.2 Audiences Avancées

| Type | Configuration |
|------|---------------|
| **Lookalike 1%** | Basée sur les leads "WON" (qui ont abouti à une visite/vente) |
| **Retargeting Site** | Visiteurs du site qui n'ont pas soumis de formulaire |
| **Retargeting Engagement** | Personnes ayant interagi avec vos publications FB/Instagram |
| **Custom Audience** | Upload de votre base client existante pour exclusion ou Lookalike |

### 💡 6.3 Bonnes Pratiques Créatives

| Élément | Recommandation |
|---------|---------------|
| **Format** | Carousel (3-5 images du bien) ou Vidéo courte (15-30s visite virtuelle) |
| **Texte principal** | Court, bénéfice clair : "Appartement 3 pièces Guéliz — 1.8M DH — Visite ce weekend" |
| **CTA** | "Demander plus d'infos" ou "Planifier une visite" |
| **Image** | Photos professionnelles du bien, pas de stock photos |
| **Formulaire** | Maximum 4-5 champs (nom, tel, ville, budget) — plus c'est court, plus le taux de conversion est élevé |

### 💰 6.4 Budget Publicitaire Recommandé

| Taille d'agence | Budget/mois | Leads estimés/mois | Coût/lead estimé |
|-----------------|-------------|---------------------|-----------------|
| Petite (1-3 agents) | 2 000 — 5 000 DH | 50 — 150 | 15 — 40 DH |
| Moyenne (4-8 agents) | 5 000 — 15 000 DH | 150 — 500 | 10 — 30 DH |
| Grande (9+ agents) | 15 000 — 50 000 DH | 500 — 2000 | 8 — 25 DH |

> [!NOTE]
> Le coût par lead au Maroc est significativement inférieur aux marchés européens (3-10€/lead en France vs 1.5-4€/lead au Maroc). L'immobilier marocain offre un excellent rapport coût/acquisition.

---

## 7. Parcours Client Type

```
 ┌─────────────────────────────────────────────────────────────┐
 │                    PARCOURS DU LEAD                         │
 ├─────────────────────────────────────────────────────────────┤
 │                                                             │
 │  1️⃣  Prospect voit votre pub Facebook/Instagram             │
 │     ↓                                                       │
 │  2️⃣  Remplit le formulaire Lead Ads (30 secondes)            │
 │     ↓                                                       │
 │  3️⃣  Lead arrive automatiquement dans ImmoLeads             │
 │     ↓                                                       │
 │  4️⃣  Agent assigné automatiquement (Round-Robin)            │
 │     ↓                                                       │
 │  5️⃣  Agent reçoit une notification instantanée              │
 │     ↓                                                       │
 │  6️⃣  Premier contact WhatsApp (qualification)               │
 │     ↓                                                       │
 │  7️⃣  Matching automatique avec les biens disponibles        │
 │     ↓                                                       │
 │  8️⃣  Planification de la visite physique                    │
 │     ↓                                                       │
 │  9️⃣  Visite réalisée → Compte-rendu dans le CRM            │
 │     ↓                                                       │
 │  🔟  Négociation → Signature → Lead GAGNÉ 🎉                │
 │                                                             │
 └─────────────────────────────────────────────────────────────┘
```

---

## 8. Arguments de Vente Clés

### Pour le Directeur d'Agence
> "**Combien de leads avez-vous perdu le mois dernier parce que personne ne les a rappelés ?** Avec ImmoLeads, chaque lead est automatiquement assigné, suivi et relancé. Vous avez une visibilité complète sur votre pipeline commercial."

### Pour les Agents
> "**Finissez-en avec les captures d'écran WhatsApp.** ImmoLeads vous montre exactement qui contacter aujourd'hui, quel bien proposer, et quand relancer. Travaillez plus efficacement, pas plus dur."

### Pour les Promoteurs
> "**Mesurez le ROI de chaque dirham investi en publicité.** ImmoLeads vous dit exactement quelle campagne génère des visites et des ventes, pas juste des clics."

### Objection : "On utilise déjà Excel / WhatsApp"
> "Excel ne vous envoie pas de notification quand un lead arrive. WhatsApp ne mesure pas votre taux de conversion. ImmoLeads fait les deux, automatiquement, 24h/24."

### Objection : "C'est trop cher"
> "Un seul lead perdu par semaine = des dizaines de milliers de DH de manque à gagner. ImmoLeads coûte moins qu'un café par jour et par agent."

---

## 9. Stack Technique

| Composant | Technologie |
|-----------|------------|
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS v4, Radix UI |
| Backend | Next.js Server Actions, API Routes |
| Base de données | Supabase (PostgreSQL) avec Row Level Security |
| Authentification | Supabase Auth (email/mot de passe) |
| Hébergement | Vercel (Edge Network mondial) |
| Stockage | Supabase Storage (images des biens) |
| Notifications | Système in-app temps réel |
| PWA | Manifest + Service Worker |

---

## 10. Contact & Prochaines Étapes

| Action | Détail |
|--------|--------|
| **Demande de démo** | Remplir le formulaire sur [immoleads.ma](https://immoleads.ma) |
| **WhatsApp** | +212 6 88 06 28 83 |
| **Email** | contact@atloryx.com |
| **Délai d'activation** | 24-48h après validation |
| **Formation** | Session de 1h incluse dans tous les plans |

---

> **ATLORYX ImmoLeads** — Du clic à la visite.
> Conçu avec ❤️ pour le marché immobilier marocain.
