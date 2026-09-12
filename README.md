# Fridge Chef

Sag der App, was im Kühlschrank liegt — sie macht daraus drei bewusst
unterschiedliche Rezeptideen: eine leichte, eine herzhafte und eine kreative.

Next.js 16 (App Router) · React 19 · Tailwind 4 · läuft als Docker-Container auf Unraid.

## Wie die Rezepte entstehen

Drei Quellen, in dieser Reihenfolge:

1. **Lokal** — 30 kuratierte Rezepte in `lib/recipes.ts`, immer verfügbar, keine API nötig.
2. **Online** — Spoonacular springt ein, wenn lokal weniger als 3 Treffer übrig bleiben.
3. **KI** — eine lokale Ollama-Instanz generiert zusätzlich 2 Ideen, passend zu den Zutaten
   und zu den gesetzten Filtern. Wird per `<Suspense>` nachgestreamt, blockiert also
   die Ergebnisseite nicht.

Alle drei durchlaufen dasselbe Matching (`lib/matching.ts`): Zutaten werden über
Aliase normalisiert (»Eier« ↔ `egg`), Diät-Tags für Online- und KI-Rezepte werden
aus der Zutatenliste abgeleitet (`lib/diet.ts`), damit Filter auch dort greifen.

## Features

- Zutaten per Text, Chips oder **Kühlschrank-Foto** — das Bild wird im Browser auf
  1024 px verkleinert und an ein Vision-Modell auf dem eigenen Ollama-Server geschickt
- 8 Filter (vegetarisch, vegan, glutenfrei, …) — gelten auch für KI-Vorschläge
- »Nur mit meinen Zutaten« blendet alles aus, wo eine Pflichtzutat fehlt
- Einkaufsliste über mehrere Rezepte hinweg, abhakbar und teilbar
- Portionsrechner auf der Rezeptseite
- Favoriten, gespeichert im Browser
- Vorratskammer wird gemerkt — beim nächsten Besuch steht alles noch da
- PWA mit Offline-Shell, Dark Mode

## Entwicklung

```bash
npm install
cp .env.example .env.local   # alle Keys optional
npm run dev
```

Ohne jeden API-Key funktioniert die App — dann eben nur mit den 30 lokalen Rezepten.

## Deployment (Docker / Unraid)

```bash
docker compose up -d --build
```

Läuft danach auf Port `3800`.

Das Volume auf `/data` ist wichtig: dort landen die zur Laufzeit generierten
Rezepte, damit Links auf KI- und Online-Rezepte einen Neustart überleben.
Compose legt dafür ein **benanntes Volume** an, kein Bind-Mount — der Container
läuft als nicht-privilegierter User (uid 1001), und ein Bind-Mount behält die
Rechte des Host-Verzeichnisses. Auf Unraid gehört `appdata` `nobody:users`, der
Container dürfte dort also nicht schreiben und fiele still auf reinen
Speicherbetrieb zurück.

Wer trotzdem einen Bind-Mount will (etwa fürs appdata-Backup), muss ihn einmal
übereignen:

```bash
mkdir -p ./data && chown -R 1001:1001 ./data
```

Ob es geklappt hat, sagt der Health-Endpoint: `"persistent": true`.

Der Container bringt einen `HEALTHCHECK` mit, der `/api/health` abfragt. Dieser
Endpoint zeigt auch, welche Features gerade aktiv sind:

```bash
curl http://localhost:3800/api/health
```

## Konfiguration

| Variable | Pflicht | Zweck |
| --- | --- | --- |
| `SPOONACULAR_API_KEY` | nein | Online-Rezepte als Fallback |
| `OLLAMA_BASE_URL` | nein | KI-Rezeptideen, z. B. `http://192.168.1.164:11434` |
| `OLLAMA_MODEL` | nein | Textmodell, Standard `llama3.2:3b` |
| `OLLAMA_VISION_MODEL` | nein | Bilderkennung, z. B. `gemma3:4b`. Leer = Foto-Button aus |
| `UNSPLASH_ACCESS_KEY` | nein | Bilder für KI-Rezepte |
| `DATA_DIR` | nein | Ablage der generierten Rezepte, im Container `/data` |

Für die Bilderkennung braucht es ein multimodales Modell auf dem Ollama-Host.
`gemma3:4b` ist getestet und liefert brauchbare Ergebnisse bei ~3 GB:

```bash
ollama pull gemma3:4b
```

Alternativ `llava:7b` oder `qwen2.5vl:7b`. Ein reines Textmodell wie `llama3.2:3b`
funktioniert hier **nicht** — es ignoriert das Bild.

> Keys gehören in `.env.local` oder in die Unraid-Container-Variablen — **nie**
> in `docker-compose.yml`, die Datei liegt in einem öffentlichen Repo.

## Tests

```bash
npm test
```

Deckt die Diät-Heuristik ab — der Teil, bei dem ein falscher Tag jemandem mit
veganer Ernährung Fleisch vorschlagen würde. Die Fälle halten die Stolperstellen
fest: deutsche Komposita ("Kalbfleisch"), pflanzliche Produkte mit Milch-Namen
("Kokosmilch"), und Wörter, die nur so aussehen ("Weisswein" enthält kein Ei).
