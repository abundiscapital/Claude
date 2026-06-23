# Pré-AES — Outil web de pré-diagnostic environnemental de site

Prototype de la thèse professionnelle **MS ECHD / Ekkoia** :
*« Jusqu'où peut-on fiabiliser et automatiser le pré-diagnostic de site par l'open data,
et où l'expertise reste-t-elle irremplaçable ? »*

À partir d'une **adresse**, l'outil géolocalise le site, interroge en direct les **API
open data publiques**, agrège un **pré-diagnostic par thématique** d'AES, l'affiche sur une
carte et **signale explicitement** ce qui relève de l'expertise et de la visite de terrain.

---

## 1. Lancer l'outil (2 minutes, sans rien installer)

Il suffit d'avoir **Python 3.8+** (déjà présent sur Mac/Linux ; sur Windows :
[python.org](https://www.python.org/downloads/), cocher « Add to PATH »).

```bash
cd pre-aes
python app.py
```

Puis ouvrir **http://localhost:8000** dans le navigateur, saisir une adresse, cliquer
sur **Analyser le site**. (Aucune dépendance à installer : l'outil n'utilise que la
bibliothèque standard de Python.)

> Sur certaines machines la commande est `python3 app.py`.
> Pour changer de port : `python app.py 8080`.

---

## 2. Ce que l'outil fait

| Thématique AES | Source open data interrogée | Automatisation |
|---|---|---|
| Localisation & parcellaire | BAN + IGN API Carto (cadastre) | Élevée |
| Contexte réglementaire (PLU) | Géoportail de l'Urbanisme (API Carto GPU) | Moyenne à élevée |
| Risques naturels & technologiques | Géorisques (sismicité, argiles, radon, GASPAR) | Élevée |
| Potentiel solaire | PVGIS (Commission européenne) | Élevée |
| Qualité de l'air | Open-Meteo Air Quality (CAMS) | Moyenne |
| Climat (vent/température) | Open-Meteo | Moyenne |
| Biodiversité (occurrences) | GBIF | Moyenne / Faible |
| Mobilité & accessibilité | OpenStreetMap (Overpass) | Élevée |
| **Paysage, état écologique réel, usages, microclimat** | **— (visite de site)** | **Non automatisable** |

Les quatre dernières lignes sont volontairement présentées comme **cartes « TERRAIN »** :
elles matérialisent la *frontière* au cœur de la thèse — l'outil ne les remplit pas, il
rappelle qu'elles relèvent de l'expert.

---

## 3. Lecture des résultats

Chaque carte porte un statut couleur :

- 🟢 **AUTO** : donnée récupérée automatiquement ;
- 🟠 **PARTIEL** : donnée incomplète ou à interpréter ;
- ⚪ **INDISPO** : API non jointe / pas de donnée → à consulter manuellement ;
- 🔵 **TERRAIN** : non automatisable, réservé à l'expertise / visite de site.

Chaque donnée affiche sa **source**, sa **fiabilité** et la **date de consultation**.
Le bouton **Exporter / Imprimer** génère un PDF du pré-rapport (via l'impression du navigateur).

---

## 4. Limites assumées (à exploiter dans la thèse)

- **Fiabilité inégale** : élevée pour les données officielles (Géorisques, cadastre),
  plus faible pour les données modélisées (air) ou contributives (OSM, GBIF).
- **Dépendance aux API** : un service momentanément indisponible bascule la carte en INDISPO.
- **Couverture territoriale** : variable (le PLU n'est pas numérisé partout ; l'Île-de-France
  est très bien dotée, ce qui peut *surestimer* l'automatisable).
- **GBIF ≠ état écologique** : présence documentée d'espèces, pas un relevé de terrain.
- **Climat = conditions ponctuelles** : à remplacer par les **normales Météo-France** pour une AES.

Ces limites ne sont pas des défauts à cacher : elles **sont le sujet**. Documentez-les
avec vos mesures réelles dans la partie « Discussion ».

---

## 5. Pour aller plus loin

- **Ajouter une source** : écrire une fonction `theme_xxx(lat, lon)` dans `app.py` (sur le
  modèle des autres) et l'ajouter à la liste `autos` de `diagnostic()`.
- **Enrichissement Île-de-France** : Airparif, Bruitparif, Île-de-France Mobilités (PRIM),
  Institut Paris Region (MOS) — la plupart nécessitent une clé API gratuite.
- **Pré-rapport Word** : remplacer l'impression navigateur par une génération `.docx`.
- **Mettre en ligne** (URL partageable) : déployer gratuitement sur Render, Railway ou
  PythonAnywhere (le serveur écoute déjà sur `0.0.0.0`).

---

## 6. Sources & licences

Données diffusées par leurs producteurs respectifs sous licences ouvertes (Licence Ouverte
Etalab, ODbL pour OpenStreetMap, etc.). Citer les sources dans tout livrable. Cet outil est
un **prototype académique** : il ne se substitue ni à une étude réglementaire, ni au conseil
engagé d'un bureau d'AMO.
