# Examinationsuppgift - Trullo

## Teoretiska resonemang

- Motivera ditt val av databas

  Mitt val av databas var baserat på vad jag behövde utbilda mig i. MongoDB har varit rätt nytt och jag har kunnat lära mig mycket inom mongoose(ODM). Hade även tanken på att spara utrymme i databasen med att hoppa över vissa fält när dem inte används, det skutade dock med att jag använder value av null vid läge där objektet är tomt, ett exempel på detta är assignTo i task modellen.

- Redogör vad de olika teknikerna (ex. verktyg, npm-paket, etc.) gör i applikationen

  Denna kanban lösning är gjord med en backend med express och mongoDB samt mongoose för modeller. Jag har användt mig att typescript i denna uppgift som har skapat dist mappar för att kunna compilea typescript koden.

  Vid autentisering så har jag användt jsonwebtoken för att skapa en bearer token, använder även bcrypt för att kryptera samt kontrollerar lösenordet vid läge att man loggar in.

- Redogör översiktligt hur applikationen fungerar

  Applicationen har som uppgift att kunna skapa project som är kopplade till användare, därifrån ska man kunna skapa uppgifter och följa uppgiftens status för att se vilket steg av processen uppgiften är på samt om någon har tilldelats uppgiften för att kunna enklare strukutrera projektet, denna lösning kallas kanban.

  Jag har skapat crud funktioner till de 3 olika collections samt autentiserar via middleware för att se så användaren ska kunna ha tillgång till att göra ändringar beroende på roll. I detta fall använder jag jsonwebtoken som skapas vid läge där man loggar in sedan så skickas bearer token via header i fetchen.

  Jag har även sparat vissa endpoints för att enkelt kunna hämta alla project och task samt users för att enklare kunna felsöka samt visa upp de olika collections. Dessa funktioner saknar middleware för att så enkelt som möjligt kunna få tag i informationen.

## Körguide

- Installerar alla verktyg och npm-paket.

  `npm i`

- Compilar koden från typescript till javascript.

  `tsc --watch`

- Skapar test objekt i de 3 olika collections för att kunna testa apiet.

  `npm run seed`

- Startar servern för att kunna få kontakt med databasen.

  `npm run dev`

Extra:

- Jag har skapat en [example.env](.example.env) fil för att enklare kunna skapa en connection till db.
- Min [seed](src/script/seed.ts) skapar flera användare, för att få tag i den första som har skapats så kan man använda.

  email:`user1@example.com`

  lösenord:`Password1`

- Använd `http://localhost:3000/project/user` för att få tillgång till alla project som är kopplade till användaren, jag har användt populate för att kunna visa upp alla tasks också, för att enkelt få en helhets bild på projektet, detta kopplas till användaren via jwt.
