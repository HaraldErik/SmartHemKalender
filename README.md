# LocalTouchCalendar 📅

En lokalt hostad, touch-vänlig kalenderapplikation designad för att köras på en iPad/surfplatta monterad på väggen eller stående i hemmet. 

## Arkitektur
Projektet består av två delar som båda körs på det lokala nätverket för maximal säkerhet (ingen port forwarding krävs).
- **Frontend:** React.js / PWA (Progressive Web App). Helt optimerad för touch-skärmar.
- **Backend:** Node.js (Express) / Python (FastAPI) med en lokal SQLite-databas.

## Funktioner
- [ ] Månads-, vecko- och dagsvy
- [ ] Skapa och redigera lokala händelser
- [ ] Färgkodning för olika personer/kategorier
- [ ] Helskärmsläge på iPad (PWA)
- [ ] (Framtid) Read-only synk från Google/Apple Calendar

## Kom igång (Utveckling)

### Backend
1. Navigera till `/backend`
2. Installera beroenden: `npm install` (eller `pip install -r requirements.txt`)
3. Starta servern: `npm run dev`

### Frontend
1. Navigera till `/frontend`
2. Installera beroenden: `npm install`
3. Starta webbservern: `npm start`
4. Öppna `http://localhost:3000` i din webbläsare.
