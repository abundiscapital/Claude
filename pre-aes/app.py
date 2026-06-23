# -*- coding: utf-8 -*-
"""
Pré-AES — Outil web de pré-diagnostic environnemental de site par l'open data.

Thèse professionnelle MS ECHD — Ekkoia.
Saisir une adresse -> géolocalisation -> interrogation des API open data
publiques -> agrégation d'un pré-diagnostic par thématique -> restitution
cartographiée, avec signalement explicite de ce qui relève de l'expertise/terrain.

Aucune dépendance externe : uniquement la bibliothèque standard Python 3.
Lancement :  python app.py    puis ouvrir http://localhost:8000
"""

import json
import socket
import datetime
import urllib.parse
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

TIMEOUT = 25
UA = {"User-Agent": "Pre-AES-Ekkoia/1.0 (these MS ECHD)"}
TEMPLATE = Path(__file__).parent / "templates" / "index.html"


# --------------------------------------------------------------------------
#  Helpers HTTP (bibliothèque standard, respecte les proxys via variables d'env)
# --------------------------------------------------------------------------
def http_get(url, params=None, timeout=TIMEOUT):
    if params:
        url = url + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read().decode("utf-8", "replace"))


def http_post(url, data, timeout=TIMEOUT):
    body = urllib.parse.urlencode(data).encode("utf-8")
    req = urllib.request.Request(url, data=body, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read().decode("utf-8", "replace"))


def first(d, *keys):
    """Renvoie la première valeur non vide parmi plusieurs clés possibles."""
    for k in keys:
        if isinstance(d, dict) and d.get(k) not in (None, "", []):
            return d[k]
    return None


TODAY = datetime.date.today().isoformat()


def theme(id, titre, fiabilite, source, lien, terrain=False):
    """Squelette d'un résultat thématique."""
    return {
        "id": id, "titre": titre, "fiabilite": fiabilite,
        "source": source, "lien": lien, "terrain": terrain,
        "date": TODAY, "statut": "indisponible", "items": [],
        "points": [], "note": None,
    }


# --------------------------------------------------------------------------
#  Géocodage — Base Adresse Nationale (BAN)
# --------------------------------------------------------------------------
def geocoder(adresse):
    data = http_get("https://api-adresse.data.gouv.fr/search/",
                    {"q": adresse, "limit": 1})
    feats = data.get("features") or []
    if not feats:
        return None
    f = feats[0]
    lon, lat = f["geometry"]["coordinates"]
    p = f["properties"]
    return {
        "adresse": p.get("label", adresse), "lat": lat, "lon": lon,
        "commune": p.get("city"), "insee": p.get("citycode"),
        "cp": p.get("postcode"), "contexte": p.get("context"),
    }


# --------------------------------------------------------------------------
#  Parcellaire — IGN API Carto (module cadastre)
# --------------------------------------------------------------------------
def theme_parcellaire(lat, lon):
    t = theme("parcellaire", "Localisation & parcellaire", "Élevée",
              "IGN — API Carto (cadastre), BAN",
              "https://apicarto.ign.fr/api/doc/cadastre")
    try:
        geom = json.dumps({"type": "Point", "coordinates": [lon, lat]})
        d = http_get("https://apicarto.ign.fr/api/cadastre/parcelle", {"geom": geom})
        feats = d.get("features") or []
        if feats:
            p = feats[0]["properties"]
            t["items"] = [
                {"label": "Commune", "valeur": f"{p.get('nom_com','-')} ({p.get('code_insee','-')})"},
                {"label": "Section / parcelle", "valeur": f"{p.get('section','-')} {p.get('numero','-')}"},
                {"label": "Contenance cadastrale", "valeur": f"{p.get('contenance','-')} m²"},
            ]
            t["statut"] = "ok"
        else:
            t["statut"] = "partiel"
            t["note"] = "Aucune parcelle retournée pour ce point."
    except Exception as e:
        t["note"] = f"Donnée indisponible ({type(e).__name__})."
    return t


# --------------------------------------------------------------------------
#  Urbanisme — IGN API Carto (module GPU / Géoportail de l'Urbanisme)
# --------------------------------------------------------------------------
def theme_urbanisme(lat, lon):
    t = theme("urbanisme", "Contexte réglementaire (PLU)", "Moyenne à élevée",
              "Géoportail de l'Urbanisme — API Carto (gpu)",
              "https://www.geoportail-urbanisme.gouv.fr/")
    try:
        geom = json.dumps({"type": "Point", "coordinates": [lon, lat]})
        d = http_get("https://apicarto.ign.fr/api/gpu/zone-urba", {"geom": geom})
        feats = d.get("features") or []
        if feats:
            p = feats[0]["properties"]
            t["items"] = [
                {"label": "Type de zone", "valeur": first(p, "typezone") or "-"},
                {"label": "Libellé", "valeur": first(p, "libelle", "libelong") or "-"},
            ]
            t["statut"] = "ok"
        else:
            t["statut"] = "partiel"
            t["note"] = "Pas de zonage PLU numérisé disponible ici (à vérifier sur le GPU)."
    except Exception as e:
        t["note"] = f"Donnée indisponible ({type(e).__name__}). À consulter sur le GPU."
    return t


# --------------------------------------------------------------------------
#  Risques naturels & technologiques — Géorisques
# --------------------------------------------------------------------------
def theme_risques(lat, lon, insee):
    t = theme("risques", "Risques naturels & technologiques", "Élevée",
              "Géorisques (BRGM / MTE)",
              "https://www.georisques.gouv.fr/")
    items, ok = [], False
    latlon = f"{lon},{lat}"

    # Sismicité
    try:
        d = http_get("https://www.georisques.gouv.fr/api/v1/zonage_sismique",
                     {"latlon": latlon})
        row = (d.get("data") or d.get("results") or [d])
        row = row[0] if isinstance(row, list) and row else row
        val = first(row, "zone_sismicite", "code_zone", "libelle")
        if val:
            items.append({"label": "Sismicité", "valeur": str(val)}); ok = True
    except Exception:
        pass

    # Retrait-gonflement des argiles
    try:
        d = http_get("https://www.georisques.gouv.fr/api/v1/rga", {"latlon": latlon})
        row = (d.get("data") or d.get("results") or [d])
        row = row[0] if isinstance(row, list) and row else row
        val = first(row, "exposition", "alea", "niveau")
        if val:
            items.append({"label": "Retrait-gonflement argiles", "valeur": str(val)}); ok = True
    except Exception:
        pass

    # Radon (par code INSEE)
    if insee:
        try:
            d = http_get("https://www.georisques.gouv.fr/api/v1/radon", {"code_insee": insee})
            row = (d.get("data") or d.get("results") or [d])
            row = row[0] if isinstance(row, list) and row else row
            val = first(row, "classe_potentiel", "classe", "potentiel")
            if val:
                items.append({"label": "Potentiel radon", "valeur": f"classe {val}"}); ok = True
        except Exception:
            pass

    # Catalogue des risques de la commune (GASPAR)
    if insee:
        try:
            d = http_get("https://www.georisques.gouv.fr/api/v1/gaspar/risques",
                         {"code_insee": insee, "page_size": 30})
            rows = d.get("data") or d.get("results") or []
            noms = sorted({first(r, "libelle_risque_long", "libelle_risque") for r in rows
                           if first(r, "libelle_risque_long", "libelle_risque")})
            if noms:
                items.append({"label": "Risques recensés (commune)", "valeur": ", ".join(noms)}); ok = True
        except Exception:
            pass

    t["items"] = items
    t["statut"] = "ok" if ok else "indisponible"
    if not ok:
        t["note"] = "API Géorisques non jointe — à consulter manuellement."
    return t


# --------------------------------------------------------------------------
#  Énergie solaire — PVGIS (Commission européenne)
# --------------------------------------------------------------------------
def theme_solaire(lat, lon):
    t = theme("solaire", "Climat — potentiel solaire", "Élevée (macro-climat)",
              "PVGIS (JRC, Commission européenne)",
              "https://re.jrc.ec.europa.eu/pvg_tools/fr/")
    try:
        d = http_get("https://re.jrc.ec.europa.eu/api/v5_2/PVcalc",
                     {"lat": lat, "lon": lon, "peakpower": 1, "loss": 14,
                      "angle": 35, "aspect": 0, "mountingplace": "building",
                      "outputformat": "json"})
        fixed = d["outputs"]["totals"]["fixed"]
        t["items"] = [
            {"label": "Irradiation plan incliné 35°", "valeur": f"{round(fixed.get('H(i)_y',0))} kWh/m²/an"},
            {"label": "Productible PV (1 kWc, pertes 14%)", "valeur": f"{round(fixed.get('E_y',0))} kWh/an"},
        ]
        t["statut"] = "ok"
    except Exception as e:
        t["note"] = f"Donnée indisponible ({type(e).__name__})."
    return t


# --------------------------------------------------------------------------
#  Qualité de l'air — Open-Meteo Air Quality
# --------------------------------------------------------------------------
def theme_air(lat, lon):
    t = theme("air", "Qualité de l'air (indicatif)", "Moyenne (modélisé)",
              "Open-Meteo Air Quality (CAMS) — à valider via Airparif/Atmo",
              "https://www.airparif.fr/")
    try:
        d = http_get("https://air-quality-api.open-meteo.com/v1/air-quality",
                     {"latitude": lat, "longitude": lon,
                      "current": "pm2_5,pm10,nitrogen_dioxide,ozone",
                      "timezone": "Europe/Paris"})
        c, u = d.get("current", {}), d.get("current_units", {})
        for k, lbl in [("pm2_5", "PM2.5"), ("pm10", "PM10"),
                       ("nitrogen_dioxide", "NO₂"), ("ozone", "O₃")]:
            if c.get(k) is not None:
                t["items"].append({"label": lbl, "valeur": f"{c[k]} {u.get(k,'')}"})
        t["statut"] = "ok" if t["items"] else "indisponible"
    except Exception as e:
        t["note"] = f"Donnée indisponible ({type(e).__name__})."
    return t


# --------------------------------------------------------------------------
#  Climat / microclimat — Open-Meteo (conditions courantes, indicatif)
# --------------------------------------------------------------------------
def theme_climat(lat, lon):
    t = theme("climat", "Climat — vent & température (indicatif)", "Moyenne",
              "Open-Meteo — à compléter par les normales Météo-France",
              "https://meteofrance.com/")
    try:
        d = http_get("https://api.open-meteo.com/v1/forecast",
                     {"latitude": lat, "longitude": lon,
                      "current": "temperature_2m,wind_speed_10m,wind_direction_10m",
                      "timezone": "Europe/Paris"})
        c, u = d.get("current", {}), d.get("current_units", {})
        if c:
            t["items"] = [
                {"label": "Température (instant.)", "valeur": f"{c.get('temperature_2m','-')} {u.get('temperature_2m','')}"},
                {"label": "Vent (vitesse)", "valeur": f"{c.get('wind_speed_10m','-')} {u.get('wind_speed_10m','')}"},
                {"label": "Vent (direction)", "valeur": f"{c.get('wind_direction_10m','-')}°"},
            ]
            t["statut"] = "partiel"
            t["note"] = "Conditions ponctuelles : à remplacer par les normales climatiques pour l'AES."
    except Exception as e:
        t["note"] = f"Donnée indisponible ({type(e).__name__})."
    return t


# --------------------------------------------------------------------------
#  Biodiversité — GBIF (occurrences d'espèces à proximité)
# --------------------------------------------------------------------------
def theme_biodiversite(lat, lon):
    t = theme("biodiversite", "Biodiversité (occurrences à proximité)", "Moyenne / Faible",
              "GBIF — occurrences ; zonages à vérifier sur l'INPN",
              "https://inpn.mnhn.fr/", terrain=False)
    try:
        d = http_get("https://api.gbif.org/v1/occurrence/search",
                     {"decimalLatitude": f"{lat-0.004},{lat+0.004}",
                      "decimalLongitude": f"{lon-0.004},{lon+0.004}",
                      "limit": 0, "facet": "scientificName", "facetLimit": 6})
        count = d.get("count", 0)
        facets = (d.get("facets") or [{}])[0].get("counts", [])
        t["items"] = [{"label": "Occurrences (~500 m)", "valeur": str(count)}]
        for f in facets[:6]:
            t["items"].append({"label": f.get("name", "-"), "valeur": f"{f.get('count','-')} obs."})
        t["statut"] = "ok" if count else "partiel"
        t["note"] = ("Indicatif : présence documentée, NON un état écologique du site. "
                     "ZNIEFF/Natura 2000 et relevé faune-flore = expertise écologue + terrain.")
    except Exception as e:
        t["note"] = f"Donnée indisponible ({type(e).__name__}). Vérifier zonages sur l'INPN."
    return t


# --------------------------------------------------------------------------
#  Mobilité — OpenStreetMap via Overpass (arrêts & gares à proximité)
# --------------------------------------------------------------------------
def theme_mobilite(lat, lon):
    t = theme("mobilite", "Mobilité & accessibilité", "Élevée",
              "OpenStreetMap (Overpass) ; à recouper avec IDFM/transport.data.gouv",
              "https://transport.data.gouv.fr/")
    try:
        q = (f"[out:json][timeout:25];("
             f"node[highway=bus_stop](around:400,{lat},{lon});"
             f"node[railway=station](around:1200,{lat},{lon});"
             f"node[railway=subway_entrance](around:800,{lat},{lon});"
             f"node[railway=tram_stop](around:600,{lat},{lon}););out body 60;")
        d = http_post("https://overpass-api.de/api/interpreter", {"data": q})
        els = d.get("elements", [])
        bus = sum(1 for e in els if e.get("tags", {}).get("highway") == "bus_stop")
        gares = [e for e in els if e.get("tags", {}).get("railway") in ("station", "subway_entrance", "tram_stop")]
        t["items"] = [{"label": "Arrêts de bus (<400 m)", "valeur": str(bus)},
                      {"label": "Gares / stations (<1,2 km)", "valeur": str(len(gares))}]
        for e in gares[:5]:
            nom = e.get("tags", {}).get("name", "station")
            t["items"].append({"label": "Station", "valeur": nom})
            t["points"].append({"lat": e.get("lat"), "lon": e.get("lon"), "label": nom})
        t["statut"] = "ok" if els else "partiel"
    except Exception as e:
        t["note"] = f"Donnée indisponible ({type(e).__name__})."
    return t


# --------------------------------------------------------------------------
#  Thématiques NON automatisables — réservées à l'expertise / au terrain
#  (matérialisent la « frontière » au cœur de la thèse)
# --------------------------------------------------------------------------
def themes_terrain():
    defs = [
        ("paysage", "Paysage & patrimoine",
         "Qualité paysagère, co-visibilités, ambiances urbaines : visite de site indispensable."),
        ("bio_terrain", "État écologique réel du site",
         "Relevé faune-flore par un écologue ; les bases listent le potentiel, pas l'existant."),
        ("usages", "Usages, riverains & ambiances",
         "Usages informels, nuisances perçues, contexte social : observation de terrain."),
        ("microclimat", "Microclimat (masques solaires, vents)",
         "Masques bâtis réels et effets aérauliques locaux : modélisation 3D + terrain."),
    ]
    out = []
    for id, titre, note in defs:
        t = theme(id, titre, "—", "Expertise & visite de site", "", terrain=True)
        t["statut"] = "terrain"
        t["note"] = note
        out.append(t)
    return out


# --------------------------------------------------------------------------
#  Orchestrateur
# --------------------------------------------------------------------------
def _demo_payload():
    """Jeu de données de DÉMONSTRATION (hors-ligne) — clairement étiqueté.
    Permet de visualiser l'outil sans accès réseau ; ne sont PAS des données réelles."""
    site = {"adresse": "2 Rue Saint-Dominique, 75007 Paris — DÉMO", "lat": 48.8607,
            "lon": 2.3206, "commune": "Paris", "insee": "75107", "cp": "75007",
            "contexte": "75, Paris, Île-de-France"}

    def mk(id, titre, fia, src, statut, items, note=None, points=None, lien="#"):
        t = theme(id, titre, fia, src, lien)
        t.update(statut=statut, items=items, note=note, points=points or [])
        return t

    autos = [
        mk("parcellaire", "Localisation & parcellaire", "Élevée", "IGN API Carto (cadastre), BAN", "ok",
           [{"label": "Commune", "valeur": "Paris (75107)"},
            {"label": "Section / parcelle", "valeur": "AB 0042"},
            {"label": "Contenance cadastrale", "valeur": "1 240 m²"}]),
        mk("urbanisme", "Contexte réglementaire (PLU)", "Moyenne à élevée", "Géoportail de l'Urbanisme", "ok",
           [{"label": "Type de zone", "valeur": "UG"},
            {"label": "Libellé", "valeur": "Zone urbaine générale"}]),
        mk("risques", "Risques naturels & technologiques", "Élevée", "Géorisques (BRGM / MTE)", "ok",
           [{"label": "Sismicité", "valeur": "1 (très faible)"},
            {"label": "Retrait-gonflement argiles", "valeur": "Faible"},
            {"label": "Potentiel radon", "valeur": "classe 1"},
            {"label": "Risques recensés (commune)", "valeur": "Inondation, Mouvement de terrain, TMD"}]),
        mk("solaire", "Climat — potentiel solaire", "Élevée (macro-climat)", "PVGIS (JRC, CE)", "ok",
           [{"label": "Irradiation plan incliné 35°", "valeur": "1 256 kWh/m²/an"},
            {"label": "Productible PV (1 kWc, pertes 14%)", "valeur": "1 142 kWh/an"}]),
        mk("air", "Qualité de l'air (indicatif)", "Moyenne (modélisé)", "Open-Meteo Air Quality (CAMS)", "ok",
           [{"label": "PM2.5", "valeur": "11.3 µg/m³"}, {"label": "PM10", "valeur": "18.7 µg/m³"},
            {"label": "NO₂", "valeur": "27.4 µg/m³"}, {"label": "O₃", "valeur": "54.0 µg/m³"}],
           note="Modélisé : à valider via Airparif."),
        mk("climat", "Climat — vent & température (indicatif)", "Moyenne", "Open-Meteo", "partiel",
           [{"label": "Température (instant.)", "valeur": "19.4 °C"},
            {"label": "Vent (vitesse)", "valeur": "12 km/h"},
            {"label": "Vent (direction)", "valeur": "230°"}],
           note="Conditions ponctuelles : à remplacer par les normales Météo-France."),
        mk("biodiversite", "Biodiversité (occurrences à proximité)", "Moyenne / Faible", "GBIF", "ok",
           [{"label": "Occurrences (~500 m)", "valeur": "642"},
            {"label": "Apis mellifera", "valeur": "37 obs."},
            {"label": "Turdus merula", "valeur": "29 obs."},
            {"label": "Pieris rapae", "valeur": "12 obs."}],
           note="Indicatif : présence documentée, NON un état écologique. ZNIEFF/Natura 2000 + relevé = écologue/terrain."),
        mk("mobilite", "Mobilité & accessibilité", "Élevée", "OpenStreetMap (Overpass)", "ok",
           [{"label": "Arrêts de bus (<400 m)", "valeur": "6"},
            {"label": "Gares / stations (<1,2 km)", "valeur": "3"},
            {"label": "Station", "valeur": "Invalides"},
            {"label": "Station", "valeur": "La Tour-Maubourg"}],
           points=[{"lat": 48.8616, "lon": 2.3146, "label": "Invalides"},
                   {"lat": 48.8579, "lon": 2.3106, "label": "La Tour-Maubourg"}]),
    ]
    couverts = sum(1 for t in autos if t["statut"] in ("ok", "partiel"))
    return {"site": site, "themes": autos + themes_terrain(), "demo": True,
            "completude": round(100 * couverts / len(autos)),
            "nb_auto": len(autos), "nb_couverts": couverts}


def diagnostic(adresse):
    site = geocoder(adresse)
    if not site:
        return {"erreur": "Adresse introuvable (Base Adresse Nationale)."}
    lat, lon, insee = site["lat"], site["lon"], site.get("insee")
    autos = [
        theme_parcellaire(lat, lon), theme_urbanisme(lat, lon),
        theme_risques(lat, lon, insee), theme_solaire(lat, lon),
        theme_air(lat, lon), theme_climat(lat, lon),
        theme_biodiversite(lat, lon), theme_mobilite(lat, lon),
    ]
    couverts = sum(1 for t in autos if t["statut"] in ("ok", "partiel"))
    completude = round(100 * couverts / len(autos))
    return {"site": site, "themes": autos + themes_terrain(),
            "completude": completude, "nb_auto": len(autos),
            "nb_couverts": couverts}


# --------------------------------------------------------------------------
#  Serveur HTTP (bibliothèque standard)
# --------------------------------------------------------------------------
class Handler(BaseHTTPRequestHandler):
    def _send(self, code, body, ctype="application/json; charset=utf-8"):
        data = body if isinstance(body, bytes) else body.encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path in ("/", "/index.html"):
            try:
                self._send(200, TEMPLATE.read_text(encoding="utf-8"),
                           "text/html; charset=utf-8")
            except Exception as e:
                self._send(500, f"Template manquant : {e}", "text/plain; charset=utf-8")
        elif parsed.path == "/api/diagnostic":
            qs = urllib.parse.parse_qs(parsed.query)
            if (qs.get("demo") or [""])[0]:
                self._send(200, json.dumps(_demo_payload(), ensure_ascii=False))
                return
            adresse = (qs.get("adresse") or [""])[0].strip()
            if not adresse:
                self._send(400, json.dumps({"erreur": "Paramètre 'adresse' requis."}))
                return
            try:
                self._send(200, json.dumps(diagnostic(adresse), ensure_ascii=False))
            except Exception as e:
                self._send(500, json.dumps({"erreur": f"{type(e).__name__}: {e}"}, ensure_ascii=False))
        else:
            self._send(404, json.dumps({"erreur": "introuvable"}))

    def log_message(self, *a):
        pass  # silence


def main(port=8000):
    socket.setdefaulttimeout(TIMEOUT)
    srv = ThreadingHTTPServer(("0.0.0.0", port), Handler)
    print(f"Pré-AES en écoute sur http://localhost:{port}  (Ctrl+C pour arrêter)")
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        srv.shutdown()


if __name__ == "__main__":
    import sys
    main(int(sys.argv[1]) if len(sys.argv) > 1 else 8000)
