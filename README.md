# reseed

## ⚙️ Voraussetzungen
- [Node.js](https://nodejs.org/) (empfohlen: LTS-Version)
- npm
- Angular CLI
- [XAMPP](https://www.apachefriends.org/de/index.html) (für MySQL und phpMyAdmin)

Zur Installation von Angular CLI global Folgendes ausführen:
```bash
npm install -g @angular/cli
```

## Lokales Aufsetzen des Projekts

### 1. XAMPP starten und Datenbank einrichten

1. Öffne das **XAMPP Control Panel**
2. Starte den Dienst **MySQL** und auch **Apache**, falls du z.B. phpMyAdmin lokal nutzen willst
3. Öffne im Browser: http://localhost/phpmyadmin
4. Erstelle eine neue Datenbank "reseed" und importiere das Datenbank-Schema

### 2. Backend aufsetzen

```bash
cd backend
npm install
npm run init-db
npm run fill-seeds-table
```

### 3. Frontend aufsetzen

```bash
cd frontend
npm install
```
## Online Datenbank
Falls die online Datenbank verwendet werden soll, im Backend-Ordner in der index.js folgende Zeile austauschen:

Zeile 5
```
const db = require('./db'); -> const db = require('./db_online');
```

## Development server

Zum Starten der vollständigen Anwendung:

1. Führe im backend-Ordner den Befehl aus: 
```bash
node index.js
```
2. Führe im frontend-Ordner den Befehl aus:
```bash
ng serve
```

Falls die Anwendung lokal laufen soll:
3. Öffne das **XAMPP Control Panel**
4. Starte den Dienst **MySQL**
5. Starte **Apache** nur, wenn du phpMyAdmin lokal nutzen willst

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

