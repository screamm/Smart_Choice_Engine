# Installation & Felsökning

## Problem identifierat
Fresh frontend-servern kan inte starta eftersom Deno inte är installerat.

## Lösning: Installera Deno

### Option 1: PowerShell (Rekommenderad för Windows)
Öppna PowerShell som administratör och kör:
```powershell
irm https://deno.land/install.ps1 | iex
```

### Option 2: Winget
```powershell
winget install deno
```

### Option 3: Scoop
```powershell
scoop install deno
```

### Option 4: Chocolatey
```powershell
choco install deno
```

## Efter installation

1. **Starta om din terminal/PowerShell**

2. **Verifiera installationen:**
```bash
deno --version
```

3. **Starta Fresh frontend-servern:**
```bash
cd frontend/fresh-frontend
deno task start
```

4. **Verifiera att servern är igång:**
   - Fresh frontend: http://localhost:8090
   - Backend API: http://localhost:8000

## Förväntat resultat
När både servrar är igång kommer du att kunna:
- ✅ Se kundlistan
- ✅ Klicka på kunder och se rekommendationer
- ✅ A/B testing dashboard fungerar
- ✅ Real-time updates fungerar

## Debugging tips
Om det fortfarande inte fungerar efter Deno installation:

1. **Kolla om Fresh servern är igång:**
```bash
netstat -ano | findstr :8090
```

2. **Kolla backend servern:**
```bash
netstat -ano | findstr :8000
```

3. **Testa API manuellt:**
```bash
curl http://localhost:8000/api/customers
curl http://localhost:8000/api/recommendations/1
```

## Nästa steg
Efter att du har installerat Deno och startat servrarna, testa att:
1. Gå till http://localhost:8090
2. Klicka på en kund i listan
3. Se att rekommendationerna laddas och visas
4. Testa A/B testing knapparna (om Advanced Mode är aktiverat) 