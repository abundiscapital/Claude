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
| **Fiche véhicule** | `CarDetail` | Histoire, performances, options & conditions, panneau de réservation avec acompte/caution. |
| **Authentification KYC** | `KycGate` | Déclenchée **uniquement après** que le client a trouvé son véhicule : compte → identité → permis → domicile → carte & solvabilité → acompte. |
| **Espace pro** | `Dashboard` | Flotte, planning (départs/retours/immobilisations), paiements & facturation, documents, **tracking Premium**. |

> Les visuels véhicules sont des placeholders dégradés signature, à remplacer par la
> photothèque pro. Les vérifications KYC et les paiements sont modélisés côté front et
> destinés à être branchés sur les API décrites plus bas.

## 🚀 Démarrer

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # build de production dans dist/
npm run preview  # prévisualiser le build
```

## 🗂️ Structure

```
src/
├── components/
│   ├── SplashIntro.*        # intro signature
│   ├── Navbar / Footer
│   ├── CarVisual / CarSilhouette
│   ├── client/             # Home, SearchResults, CarCard, CarDetail
│   ├── auth/               # KycGate (vérification), Connexion
│   └── pro/                # Dashboard propriétaire
├── data/                   # flotte & données de démo (cars.js, fleet.js)
└── styles/                 # tokens.css (design system) + global.css
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

- [ ] Brancher l'authentification réelle + KYC sur un prestataire
- [ ] Intégrer le PSP (acomptes, cautions, refacturation)
- [ ] Photothèque véhicules + galerie immersive sur la fiche
- [ ] Calendrier de disponibilités interactif (côté client et pro)
- [ ] Messagerie client ↔ loueur
- [ ] Onboarding pro + annuaire de l'écosystème (garages, assurances…)
- [ ] App mobile (React Native — la charte et les tokens sont déjà transposables)
```

> Stack : React 19 · Vite · framer-motion · react-router-dom · lucide-react.
> Design system généré via la skill UI/UX Pro Max, adapté à la charte « quiet money » rouge & bleu.
