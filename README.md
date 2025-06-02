# 🎯 Smart Choice - Product Recommendation Engine

En AI-driven produktrekommendationsmotor byggd med **Fresh + Deno** som demonstrerar förståelse för Voyados kärnverksamhet inom e-handel, personalisering och kundengagemang.

## 🚀 Teknisk Stack

- **Frontend**: Fresh (Deno) med TypeScript och TailwindCSS
- **Backend**: Deno med Oak framework
- **ML/AI**: Machine learning-algoritmer för rekommendationer
- **Styling**: Modern glassmorphism design med gradients

## 📁 Projektstruktur

```
Smart Product Recommendation Engine/
├── backend/
│   └── main.ts                 # Deno API server med ML-algoritmer
├── frontend/
│   └── fresh-frontend/         # Fresh applikation
│       ├── components/         # Återanvändbara komponenter
│       ├── data/              # Mock data och ML-logik
│       ├── routes/            # Fresh routes (SSR)
│       ├── static/            # Statiska filer
│       ├── types.ts           # TypeScript interfaces
│       └── fresh.config.ts    # Fresh konfiguration
├── description.md             # Detaljerad projektbeskrivning
└── README.md                  # Denna fil
```

## 🎯 Kärnfunktioner

### ✅ Implementerat
- **Kundprofilering**: Detaljerad analys av kundbeteende och preferenser
- **ML-Rekommendationsmotor**: 
  - Collaborative Filtering
  - Content-Based Filtering
  - Hybrid approach med konfidenspoäng
- **Real-time Dashboard**: Interaktiv kundväljare med omedelbar uppdatering
- **Beteendeanalys**: Köphistorik, segment och poängberäkning
- **Modern UI**: Glassmorphism design med responsiv layout

### 🔄 API Endpoints (Backend)
- `GET /api/customers` - Hämta alla kunder
- `GET /api/recommendations/:customerId` - Personliga rekommendationer
- `GET /api/analytics` - Systemstatistik
- `GET /health` - Hälsokontroll

## 🛠️ Installation & Start

### Förutsättningar
- **Deno** installerat (https://deno.land/)

### 1. Starta Backend (Port 8000)
```powershell
# Öppna en extern terminal och navigera till projektet
cd "C:\Users\david\Documents\FSU23D\Egna Projekt\Smart Product Recommendation Engine"

# Starta backend
cd backend
deno run --allow-net --allow-read main.ts
```

### 2. Starta Frontend (Port 8090)
```powershell
# Öppna en ny extern terminal
cd "C:\Users\david\Documents\FSU23D\Egna Projekt\Smart Product Recommendation Engine"

# Starta Fresh frontend
cd frontend/fresh-frontend
deno task start
```

### 3. Öppna Applikationen
- **Frontend**: http://localhost:8090
- **Backend API**: http://localhost:8000/health

## 🧪 Testning

### Manuell testning
1. Öppna http://localhost:8090
2. Välj en kund från dropdown-menyn
3. Se personliga rekommendationer genereras
4. Kontrollera beteendeanalys och konfidenspoäng

### API Testning
```powershell
# Testa backend endpoints
curl http://localhost:8000/health
curl http://localhost:8000/api/customers
curl http://localhost:8000/api/recommendations/1
```

## 👥 Testdata

### Kunder
1. **Emma Andersson** (Mode-entusiast, Stockholm)
2. **Johan Karlsson** (Teknikintresserad, Göteborg)  
3. **Lisa Nilsson** (Skönhetsexpert, Malmö)

### Produkter
- Premium Jeansjacka (Fashion)
- Trådlöst Gaming Headset (Elektronik)
- Anti-Age Serum (Skönhet)
- Läder Axelremsväska (Accessories)
- 4K Gaming Skärm (Elektronik)
- Vitamin C Ansiktsmask (Skönhet)

## 🤖 ML-Algoritmer

### Collaborative Filtering
- Hittar liknande användare baserat på köpbeteende
- Rekommenderar produkter som liknande kunder köpt

### Content-Based Filtering  
- Analyserar produktattribut och kategorier
- Matchar mot kundens favoritkategorier

### Hybrid Approach
- Kombinerar båda metoderna
- Viktad poängberäkning med konfidensintervall
- Slumpmässig variation för diversifiering

## 🎨 Design

- **Färgschema**: Blå till lila gradient bakgrund
- **UI-stil**: Glassmorphism med backdrop-blur effekter
- **Responsiv**: Mobile-first approach
- **Animationer**: Smooth övergångar och hover-effekter

## 🔧 Konfiguration

### Portar
- **Frontend**: 8090 (konfigureras i `fresh.config.ts`)
- **Backend**: 8000 (konfigureras i `backend/main.ts`)

### CORS
Backend är konfigurerad för att acceptera requests från frontend på port 8090.

## 📊 Prestanda

- **Server-Side Rendering**: Fresh ger snabb initial laddning
- **TypeScript**: Typsäkerhet genom hela stacken
- **Deno**: Modern runtime utan node_modules
- **TailwindCSS**: Optimerad CSS-bundle

## 🚀 Deployment

Projektet är förberett för deployment på **Deno Deploy**:

1. Backend kan deployas direkt från `backend/main.ts`
2. Frontend kan deployas från `frontend/fresh-frontend/`
3. Environment variables för produktionsmiljö

## 🐛 Felsökning

### Vanliga problem
- **Port konflikter**: Kontrollera att portarna 8000 och 8090 är lediga
- **CORS-fel**: Verifiera att backend CORS är konfigurerad för rätt frontend-port
- **Deno permissions**: Använd `--allow-net --allow-read` flaggor

### Debug information
Applikationen visar debug-panel längst ner med:
- Antal kunder
- Vald kund
- Antal rekommendationer
- API-status

## 📝 Nästa steg

- [ ] Integrera frontend med backend API
- [ ] Lägg till WebSocket för real-time uppdateringar
- [ ] Implementera A/B-testning av algoritmer
- [ ] Lägg till användarautentisering
- [ ] Databas-integration för persistent data
- [ ] Avancerade ML-modeller med träning

---

**Utvecklad för Voyado** - Demonstrerar förståelse för e-handel, personalisering och kundengagemang genom modern teknologi. 