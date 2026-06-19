# ASPHALT — la marketplace du sport-luxe

> _« Chaque véhicule a une histoire, un désir, une image qu'il renvoie au monde. Nous voulons voir ce fantasme dans les yeux de chaque personne qui regarde nos produits. »_

ASPHALT met en relation les clients et les acteurs de la location de **super & hypercars** —
professionnels comme particuliers. La promesse : trouver près de chez soi le véhicule de ses
rêves, aux dates voulues, **rapidement et en un clic**. Pour les propriétaires : un poste de
pilotage complet de leur flotte. Pour le secteur : un écosystème unifié qui rend enfin
glamour et fiable un marché qui en avait grand besoin.

Ambition : devenir **le premier grand loueur de véhicules de luxe en Europe** — l'Airbnb du
sport-luxe — en s'appuyant sur la force collective du réseau.

---

## 🎯 Ce qui est livré dans cette fondation

Application **React 19 + Vite + framer-motion**, charte « quiet money » sombre & sobre,
accents **rouge sport / bleu nuit**, typographie luxe (Bodoni Moda + Jost).

| Parcours | Écran | Détails |
|---|---|---|
| **Intro signature** | `SplashIntro` | Supercar surgissant du noir, phares allumés, faisceau de lumière projeté — l'identité de marque dès l'ouverture. |
| **Découverte client** | `Home` | Hero de recherche (où / quand) façon Airbnb, filtres par catégorie, flotte storytellée. |
| **Résultats** | `SearchResults` | Filtrage par ville + catégorie via l'URL (deep-linkable). |
| **Fiche véhicule** | `CarDetail` | Galerie immersive multi-angles + lightbox, histoire, performances, options, **calendrier de disponibilités interactif**, réservation avec acompte/caution. |
| **Authentification KYC** | `KycGate` | Déclenchée **uniquement après** que le client a trouvé son véhicule : compte → identité → permis → domicile → carte & solvabilité → acompte. Relie l'API en best-effort. |
| **Écosystème** | `Ecosystem` | Annuaire des partenaires (garages, carrosserie, detailing, assurances, concessionnaires) + **onboarding partenaire** en 4 étapes. |
| **Messagerie** | `Messages` | Fil de discussion client ↔ loueur, liste de conversations, composeur. |
| **Espace pro** | `Dashboard` | Flotte, planning + **calendrier de gestion des indisponibilités**, paiements & facturation, documents, **tracking Premium**. |

### Backend — API ASPHALT (`server/`)

API **Express** mock-capable : elle tourne **sans aucune clé**, et passe en mode réel dès
que `STRIPE_SECRET_KEY` / `KYC_API_KEY` sont fournis — sans changer le code.

| Domaine | Endpoints | Ce qui est modélisé |
|---|---|---|
| Auth & KYC | `/auth/register`, `/auth/kyc/*` | Session de vérification, dépôt des 4 documents, évaluation, statut réutilisable. |
| Réservations | `/bookings/quote`, `/bookings`, `/bookings/:id/charge-extra`, `/close` | Devis, **gating KYC** (réservation refusée si non vérifié), acompte, refacturation, clôture. |
| Paiements (Stripe Connect) | service `payments.js` | **Acompte** (capture), **caution** (pré-autorisation), **refacturation off-session**, **comptes connectés** & reversements loueur (commission déduite). |
| Disponibilités | `/availability/:carId`, `/block` | Plages réservées + blocage de jours (garage/services). |
| Écosystème | `/ecosystem/partners`, `/apply` | Annuaire + candidature partenaire (création de compte connecté). |
| Messages | `/messages/:threadId` | Fils client ↔ loueur. |

> Les visuels véhicules restent des placeholders dégradés signature, à remplacer par la
> photothèque pro. Le reste du parcours (vérification, paiements, disponibilités, écosystème,
> messagerie) est désormais relié à une API réelle, prête à recevoir les clés des prestataires.

## 🚀 Démarrer

```bash
npm install
cp .env.example .env   # optionnel : renseigner les clés pour le mode réel

npm run dev            # front  → http://localhost:5173
npm run server         # API    → http://localhost:4000  (mode mock par défaut)

npm run build          # build de production dans dist/
npm run preview        # prévisualiser le build
```

Le front fonctionne **seul** (mode démo) ; lancez l'API en parallèle pour activer le
parcours complet (KYC, devis, paiements, disponibilités, écosystème, messagerie).

## 🗂️ Structure

```
src/
├── api/                    # client API (fetch + dégradation gracieuse)
├── components/
│   ├── SplashIntro.*        # intro signature
│   ├── AvailabilityCalendar # calendrier partagé (client + pro)
│   ├── Navbar / Footer
│   ├── CarVisual / CarSilhouette
│   ├── client/             # Home, SearchResults, CarCard, CarDetail, PhotoGallery
│   ├── auth/               # KycGate (vérification), Connexion
│   ├── ecosystem/          # Ecosystem + PartnerOnboarding
│   ├── messages/           # Messagerie client ↔ loueur
│   └── pro/                # Dashboard propriétaire
├── data/                   # données de démo (cars, fleet, ecosystem, messages)
└── styles/                 # tokens.css (design system) + global.css

server/
├── index.js                # app Express
├── store.js                # store en mémoire (→ PostgreSQL en prod)
├── services/               # kyc.js, payments.js (Stripe Connect)
└── routes/                 # auth, bookings, availability, ecosystem, messages
```

Le **design system** vit dans `src/styles/tokens.css` : toutes les couleurs, espacements,
typographies et courbes de motion sont des tokens sémantiques — aucune valeur en dur dans
les composants.

---

## 💸 Modèle économique — générer des revenus récurrents

L'application reste **gratuite et ouverte à tous** (le client ne se connecte qu'une fois son
véhicule trouvé). La monétisation repose sur plusieurs flux récurrents :

1. **Commission marketplace** — pourcentage sur chaque location (côté loueur, et/ou frais de
   service côté client). Cœur du modèle, à l'image d'Airbnb.
2. **Abonnements pros (SaaS)** — paliers mensuels/annuels :
   - _Starter_ (gratuit) : mise en ligne, planning de base, commission standard.
   - _Pro_ : commission réduite, facturation automatisée, documents illimités, analytics.
   - _Pro+_ : **tracking véhicules temps réel**, géo-restrictions & alertes, conciergerie,
     mise en avant prioritaire.
3. **Vérification KYC réutilisable** — dossier locataire vérifié une fois, valorisable
   (clients « premium vérifiés », réservation instantanée).
4. **Place de marché de l'écosystème** — commissions d'apport sur garages, carrossiers,
   nettoyage, assurances, concessionnaires (voir ci-dessous).
5. **Assurance & caution** — marge sur les produits d'assurance à la location et la gestion
   de caution.
6. **Mise en avant (ads)** — emplacements sponsorisés pour les loueurs souhaitant booster
   leur visibilité.
7. **Services premium client** — livraison voiturier, conciergerie, expériences (circuit,
   road-trips organisés).

## 🤝 L'écosystème — répertorier tous les acteurs

Au-delà de la mise en relation, ASPHALT veut **cartographier et fédérer** toute la filière
pour aider ceux qui veulent se lancer :

- **Garages** — suivi & entretien, vidanges, services, anticipation des immobilisations.
- **Carrosseries** — covering, réparation des dommages.
- **Nettoyage / detailing** — préparation entre deux locations.
- **Assurances** — produits adaptés à la location haut de gamme.
- **Concessionnaires** — sourcing de véhicules pour les loueurs débutants.

Chaque partenaire devient un nœud du réseau : effet de plateforme, barrière à l'entrée, et
nouveaux revenus d'apport.

---

## 🏗️ Architecture cible (au-delà du front)

Cette fondation est l'interface. Le produit complet s'appuiera sur :

- **API / Backend** — Node ou équivalent, base PostgreSQL (utilisateurs, flotte,
  réservations, disponibilités, paiements, documents).
- **KYC / Identité** — intégration d'un prestataire de vérification (CNI, permis,
  justificatif de domicile) + contrôle de solvabilité et empreinte bancaire.
- **Paiements** — PSP type Stripe Connect : acomptes, cautions (pré-autorisation), soldes,
  refacturation des frais ultérieurs (carburant, péages, dommages), reversements aux loueurs.
- **Tracking (Pro+)** — intégration télématique / boîtiers GPS, exposée en option premium.
- **Documents** — génération de contrats, états des lieux, factures (PDF), stockage chiffré.
- **Notifications** — email / SMS / push pour départs, retours, validations de dossier.

## 🛣️ Prochaines étapes

- [x] Galerie immersive multi-angles + lightbox sur la fiche
- [x] Calendrier de disponibilités interactif (client + pro)
- [x] Messagerie client ↔ loueur
- [x] Annuaire de l'écosystème + onboarding partenaire
- [x] API : auth/KYC, réservations (gating + acompte + caution + refacturation), disponibilités
- [x] Couche Stripe Connect modélisée (comptes connectés, reversements), prête pour les vraies clés
- [ ] Brancher le prestataire KYC réel (Stripe Identity / Onfido) — point d'extension `services/kyc.js`
- [ ] Persistance PostgreSQL (remplacer le store en mémoire)
- [ ] Photothèque véhicules (remplacer les placeholders dégradés)
- [ ] Génération de documents (contrats, états des lieux, factures PDF)
- [ ] Webhooks Stripe + notifications (email / SMS / push)
- [ ] App mobile (React Native — la charte et les tokens sont déjà transposables)
```

> Stack : React 19 · Vite · framer-motion · react-router-dom · lucide-react · Express · Stripe.
> Design system généré via la skill UI/UX Pro Max, adapté à la charte « quiet money » rouge & bleu.
