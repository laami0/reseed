const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');
require('dotenv').config(); // falls du .env nutzt

let schema;
try {
    schema = fs.readFileSync(path.join(__dirname, 'seeds_data.sql'), 'utf8');
} catch (err) {
    console.error('Fehler beim Lesen von seeds_data.sql:', err);
    process.exit(1);
}


// Verbindung zur Datenbank
const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,
});

connection.connect((err) => {
    if (err) {
        console.error('Fehler bei der Verbindung zur Datenbank:', err);
        return;
    }

    // Zuerst prüfen, ob DB existiert, sonst erstellen
    connection.query(`CREATE DATABASE IF NOT EXISTS reseed`, (err) => {
        if (err) {
            console.error('Fehler beim Erstellen der Datenbank:', err);
            connection.end();
            return;
        }

        // Jetzt zur Datenbank wechseln
        connection.changeUser({ database: 'reseed' }, (err) => {
            if (err) {
                console.error('Fehler beim Wechseln zur Datenbank:', err);
                connection.end();
                return;
            }

            // SQL-Schema ausführen
            connection.query(schema, (err) => {
                connection.end();
            });
        });
    });
});
