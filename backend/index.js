const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const db = require('./db');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {cors: {origin: '*'}});

app.use(cors());
app.use(express.json());

// API: Anmelden
app.post('/login', async (req, res) => {
    try {
        //input
        const {name_or_email, password} = req.body;

        let result = undefined;

        //Falls Email gefunden wird
        const [emailResult] = await db.query(
            'SELECT * FROM users WHERE email=?',
            [name_or_email]);
        if (emailResult.length === 1) result = emailResult[0];

        //Falls Name gefunden wird
        const [nameResult] = await db.query(
            'SELECT * FROM users WHERE name =?',
            [name_or_email]);
        if (nameResult.length === 1) result = nameResult[0];

        //Ist result immer noch undefined, wurde weder ein passender Name noch eine E-Mail gefunden
        if (result === undefined || result.password !== password) {
            res.status(500).json({message: 'Benutzername/Email oder Passwort falsch.'});
            return;
        }

        //Kundenobjekt wird erstellt und zur verwendung als Session Token zurückgeschickt
        const user = {
            user_number: result.user_number,
            name: result.name,
            email: result.email,
            password: result.password
        };
        res.status(200).json({user});
    } catch (error) {
        //Last resort Error
        console.error('Fehler beim Login:', error);
        res.status(500).json({message: 'Kein Plan was da abgeht bro. Fix your code'});
    }
});

// API: Registrieren
app.post('/register', async (req, res) => {
    try {
        //input
        const {name, email, password} = req.body;

        //Check nach Emaildoppelung
        const [emailResult] = await db.query(
            'SELECT * FROM users WHERE email = ?',
            email);
        if (emailResult.length !== 0) {
            res.status(501).json({message: 'Email ist bereits in Verwendung.'});
            return;
        }

        //Check nach Namensdoppelung
        const [nameResult] = await db.query(
            'SELECT * FROM users WHERE name = ?',
            name);
        if (nameResult.length !== 0) {
            res.status(502).json({message: 'Nutzername ist bereits vergeben.'});
            return;
        }

        //Nutzer wird erstellt und mit Kundennummer zurückgegeben
        const [result] = await db.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, password]
        );
        const user_number = result.insertId;
        const user = {
            user_number: user_number,
            name: name,
            email: email,
            password: password
        };
        res.status(201).json({user});
    } catch (error) {
        //Last resort Error
        console.error('Fehler bei der Registrierung:', error);
        res.status(500).json({message: 'Kein Plan was da abgeht bro. Fix your code'});
    }
});

// API: Passwort vergessen
app.post('/passwortVergessen', async (req, res) => {
    try {
        //input
        const {email} = req.body;

        //Check ob die Email existiert
        const [result] = await db.query(
            'SELECT * FROM users WHERE email = ?',
            email);
        if (result.length === 0) {
            res.status(501).json({message: 'Email gehört zu keinem Account.'});
            return;
        }
        res.status(201).json({message: 'Email zum Password zurücksetzen wurde geschickt.'});
    } catch (error) {
        //Last resort Error
        console.error('Fehler beim Passwortzurücksetzen:', error);
        res.status(500).json({message: 'Kein Plan was da abgeht bro. Fix your code'});
    }
});

// API: Adresse hinzufügen
app.post('/address', async (req, res) => {
    const {first_name, last_name, email, street, addition, plz, city} = req.body;

    //Check nach Adress-Doppelung
    const [result] = await db.query(
        'SELECT * FROM addresses WHERE \n' +
        '  first_name = ? AND \n' +
        '  last_name = ? AND \n' +
        '  email = ? AND \n' +
        '  street = ? AND \n' +
        '  addition = ? AND \n' +
        '  plz = ? AND \n' +
        '  city = ?',
        [first_name, last_name, email, street, addition, plz, city]
    );

    if (result.length === 0) {
        const [result] = await db.query(
            'INSERT INTO addresses (first_name, last_name, email, street, addition, plz, city) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [first_name, last_name, email, street, addition, plz, city]
        );
        const addressID = result.insertId;
        const address = {
            address_number: addressID,
            first_name: first_name,
            last_name: last_name,
            email: email,
            addition: addition,
            city: city,
            plz: plz,
            street: street,
        };
        res.status(201).json({address});
    } else {
        res.status(201).json({address: result[0]});
    }
});

// API: Saatgut Bestand überprüfen
app.get('/seeds/:seed_number/stock', async (req, res) => {
    try {
        const seedNumber = parseInt(req.params.seed_number, 10);

        if (isNaN(seedNumber)) {
            return res.status(400).json({error: 'Ungültige seed_number'});
        }

        const [rows] = await db.query(
            'SELECT stock FROM seeds WHERE seed_number = ?',
            [seedNumber]
        );

        if (rows.length === 0) {
            return res.status(404).json({error: 'Seed nicht gefunden'});
        }

        const stock = rows[0].stock;

        res.status(200).json({stock});
    } catch (error) {
        console.error('Error in GET /seeds/:seed_number/stock:', error);
        res.status(500).json({error: 'Interner Serverfehler'});
    }
});

// API: Monatsstatistik für die angepflanzten Samen
app.get('/planting-chart', async (req, res) => {
    try {
        const userNumber = req.query.user_number ? parseInt(req.query.user_number, 10) : null;

        const sql = `
            SELECT
                DATE_FORMAT(created_at, '%b') AS label,
                COUNT(*) AS value
            FROM rents
            WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
            ${userNumber !== null ? 'AND user_number = ?' : ''}
            GROUP BY YEAR(created_at), MONTH(created_at)
            ORDER BY YEAR(created_at), MONTH(created_at)
        `;

        const params = userNumber !== null ? [userNumber] : [];
        const [rows] = await db.query(sql, params);

        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const lastSixMonths = [];
        const now = new Date();

        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const label = monthNames[date.getMonth()];
            lastSixMonths.push({ label, value: 0 });
        }

        rows.forEach((row) => {
            const monthIndex = lastSixMonths.findIndex(item => item.label === row.label);
            if (monthIndex !== -1) {
                lastSixMonths[monthIndex].value = Number(row.value);
            }
        });

        res.status(200).json(lastSixMonths);
    } catch (error) {
        res.status(500).json({ error: 'Interner Serverfehler' });
    }
});


// API: Bestellung hinzufügen
app.post('/order', async (req, res) => {
    try {
        const {order, cartItems} = req.body;
        const {user, address, delivery_type} = order;

        // Pflichtfelder prüfen
        if (!user.user_number || !address.address_number) {
            return res.status(400).json({error: 'Fehlende Adress- oder Benutzerinformationen'});
        }

        const [result] = await db.query(
            `INSERT INTO orders (user_number, address_number, delivery_type) VALUES (?, ?, ?)`,
            [user.user_number, address.address_number, delivery_type]
        );

        const orderID = result.insertId;

        const newOrder = {
            order_number: orderID,
            user,
            address,
            delivery_type,
        };


        for (let i = 0; i < cartItems.length; i++) {
            const seed = cartItems[i].seed;
            const [positionResult] = await db.query(
                'INSERT INTO order_positions (order_number, seed_number, amount) VALUES (?, ?, ?)',
                [orderID, seed.seed_number, cartItems[i].quantity]
            );
            if (positionResult.warningStatus !== 0) {
                res.status(501).json({message: 'Beim Hinzufügen der Bestelloposition mit der SeedID ' + seed.seed_number + ' ist ein Fehler aufgetreten.'});
                return;
            }

            const [rentResult] = await db.query(
                'INSERT INTO rents (order_number, seed_number, user_number, status) VALUES (?, ?, ?, ?)',
                [orderID, seed.seed_number, user.user_number, 'angepflanzt']
            );
            if (rentResult.warningStatus !== 0) {
                res.status(501).json({message: 'Beim Hinzufügen der Ausleihe mit der SeedID ' + seed.seed_number + ' und der OrderID ' + orderID + ' ist ein Fehler aufgetreten.'});
                return;
            }

            const [seedResult] = await db.query(
                'UPDATE seeds SET stock = stock-? WHERE seed_number = ?',
                [cartItems[i].quantity, seed.seed_number]
            );
            if (seedResult.serverStatus !== 2) {
                res.status(501).json({message: 'Beim Update des Bestandes mit der SeedID ' + seed.seed_number + ' ist ein Fehler aufgetreten.'});
                return;
            }

            const [newStockResult] = await db.query(
              'SELECT * from seeds WHERE seed_number = ?', seed.seed_number
            );
            io.emit('new-stock', newStockResult[0]); // Echtzeit-Update an alle Clients
        }

        res.status(201).json({order: newOrder});
    } catch (error) {
        console.error('Error in /order:', error);
        res.status(500).json({error: 'Interner Serverfehler'});
    }
});

// API: Bestellung
app.get('/get-order/:id', async (req, res) => {
    const order_number = req.params.id;

    try {
        const [order] = await db.query(
            'SELECT * FROM orders WHERE order_number = ?',
            order_number
        );

        const user_number = order[0].user_number;
        const [user] = await db.query(
            'SELECT * FROM users WHERE user_number = ?',
            user_number
        );

        const address_number = order[0].address_number;
        const [address] = await db.query(
            'SELECT * FROM addresses WHERE address_number = ?',
            address_number
        );

        const orderObject = {
            order_number: order_number,
            user: user[0],
            address: address[0],
            delivery_type: order[0].delivery_type
        }

        res.status(201).json({order: orderObject});
    } catch (error) {
        console.error('Error in /get-order/:id :', error);
        res.status(500).json({error: 'Interner Serverfehler'});
    }
});


// API: Bestellpositionen
app.get('/order-positions/:id', async (req, res) => {
    const order_number = req.params.id;

    try {
        const [orderPositions] = await db.query(
            'SELECT \n' +
            '  op.position_number,\n' +
            '  op.order_number,\n' +
            '  op.seed_number,\n' +
            '  op.amount,\n' +
            '  s.dt_name,\n' +
            '  s.lt_name,\n' +
            '  GROUP_CONCAT(DISTINCT c.name ORDER BY c.name SEPARATOR \', \') AS category_names \n' +
            'FROM order_positions op \n' +
            'JOIN seeds s ON op.seed_number = s.seed_number \n' +
            'LEFT JOIN seed_categories sc ON s.seed_number = sc.seed_number \n' +
            'LEFT JOIN categories c ON sc.category_number = c.category_number \n' +
            'WHERE op.order_number = ? \n' +
            'GROUP BY op.position_number;',
            [order_number]
        );

        res.status(201).json({orderPositions: orderPositions});
    } catch (error) {
        console.error('Error in /order-positions/:id :', error);
        res.status(500).json({error: 'Interner Serverfehler'});
    }
});

// API: Ausleihen finden
app.get('/rents', async (req, res) => {
    try {
        const user_number = req.query.user_number;
        const [rentResult] = await db.query(
            'SELECT \n' +
            '  r.*,\n' +
            '  s.seed_number,\n' +
            '  s.dt_name,\n' +
            '  s.lt_name,\n' +
            '  s.description,\n' +
            '  s.growth_weeks,\n' +
            '  GROUP_CONCAT(DISTINCT c.name ORDER BY c.name SEPARATOR \', \') AS category_names \n' +
            '  FROM rents r \n' +
            '  JOIN seeds s ON r.seed_number = s.seed_number \n' +
            '  LEFT JOIN seed_categories sc ON s.seed_number = sc.seed_number \n' +
            '  LEFT JOIN categories c ON sc.category_number = c.category_number \n' +
            '  WHERE r.user_number = ? \n' +
            '  GROUP BY r.rent_number ;',
            [user_number]
        );

        res.status(200).json({rents: rentResult});
    } catch (error) {
        console.error('Error in /rents :', error);
        res.status(500).json({error: 'Interner Serverfehler'});
    }
});

//Bestimmte Ausleihe finden
app.get('/get-rent/:id', async (req, res) => {
    const rent_number = req.params.id;
    try {
        const [rentResult] = await db.query(
            'SELECT * FROM rents WHERE rent_number = ?',
            [rent_number]
        );
        const seed_number = rentResult[0].seed_number;

        const [seedResult] = await db.query(
            'SELECT * FROM seeds WHERE seed_number = ?',
            seed_number
        );

        res.status(200).json({seed: seedResult[0]});
    } catch (error) {
        console.error('Error in /get-rent :', error);
        res.status(500).json({error: 'Interner Serverfehler'});
    }
});


// API: Saatgut zurückschicken
app.post('/zurueckschicken', async (req, res) => {
  try {
    const { rent_number } = req.body;

    // Prüfen, ob der Benutzer dieses Saatgut ausgeliehen hat
    const [rentResult] = await db.query(
      'SELECT * FROM rents WHERE rent_number = ?',
      [rent_number]
    );
    if (rentResult.length === 0) {
      return res.status(403).json({ message: 'Du hast dieses Saatgut nicht ausgeliehen.' });
    }

    // Status aktualisieren
    await db.query(
      'UPDATE rents SET status = "zurueckgegeben", updated_at = NOW() WHERE rent_number = ?',
      [rent_number]
    );

    res.status(200).json({ message: 'Saatgut wurde erfolgreich zurückgegeben.' });

  } catch (error) {
    console.error('Fehler beim Zurückschicken:', error);
    res.status(500).json({ message: 'Ein Fehler ist aufgetreten beim Zurückgeben.' });
  }
});

// API: Kein Saatgut
app.post('/give-back', async (req, res) => {
  try {
    const { rent_number } = req.body;

    // Prüfen, ob der Benutzer dieses Saatgut ausgeliehen hat
    const [rentResult] = await db.query(
      'SELECT * FROM rents WHERE rent_number = ?',
      [rent_number]
    );
    if (rentResult.length === 0) {
      res.status(403).json({ message: 'Du hast dieses Saatgut nicht ausgeliehen.' });
      return;
    }

    // Status aktualisieren
    await db.query(
      'UPDATE rents SET status = "kein saatgut", updated_at = NOW() WHERE rent_number = ?',
      [rent_number]
    );

    res.status(200).json({ message: 'Schade.' });
  } catch (error) {
    console.error('Fehler beim Zurückschicken:', error);
    res.status(500).json({ message: 'Ein Fehler ist aufgetreten bei der Angabe "kein Saatgut.' });
  }
});

// API: Pflanzen Detailseite
app.get('/saatgut-detail/:id', async (req, res) => {
    const saatgut_nummer = req.params.id;

    try {
        const [rows] = await db.query('SELECT \n' +
            '  s.seed_number,\n' +
            '  s.dt_name,\n' +
            '  s.lt_name,\n' +
            '  s.description,\n' +
            '  s.stock,\n' +
            '  s.water,\n' +
            '  s.plant_time,\n' +
            '  s.climate,\n' +
            '  s.sun,\n' +
            '  s.growth_weeks,\n' +
            '  s.created_at,\n' +
            '  GROUP_CONCAT(c.name ORDER BY c.name SEPARATOR \', \') AS category_names\n' +
            'FROM \n' +
            '  seeds s\n' +
            'LEFT JOIN \n' +
            '  seed_categories sc ON s.seed_number = sc.seed_number\n' +
            'LEFT JOIN \n' +
            '  categories c ON sc.category_number = c.category_number\n' +
            'WHERE \n' +
            '  s.seed_number = ?\n' +
            'GROUP BY \n' +
            '  s.seed_number,\n' +
            '  s.dt_name,\n' +
            '  s.lt_name,\n' +
            '  s.description,\n' +
            '  s.stock,\n' +
            '  s.water,\n' +
            '  s.plant_time,\n' +
            '  s.climate,\n' +
            '  s.sun,\n' +
            '  s.growth_weeks,\n' +
            '  s.created_at;', [saatgut_nummer]);
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Error in /saatgut-detail/:id :', error);
        res.status(500).json({error: 'Interner Serverfehler'});
    }
});

// API: pflanzen suchen
app.get('/saatgut', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT\n' +
            '  seeds.seed_number,\n' +
            '  seeds.dt_name,\n' +
            '  seeds.lt_name,\n' +
            '  seeds.description,\n' +
            '  seeds.stock,\n' +
            '  seeds.water,\n' +
            '  seeds.plant_time,\n' +
            '  seeds.climate,\n' +
            '  seeds.sun,\n' +
            '  seeds.growth_weeks,\n' +
            '  seeds.created_at,\n' +
            '  GROUP_CONCAT(\' \', categories.name) AS category_names\n' +
            'FROM seeds\n' +
            'LEFT JOIN seed_categories ON seeds.seed_number = seed_categories.seed_number\n' +
            'LEFT JOIN categories ON seed_categories.category_number = categories.category_number\n' +
            'GROUP BY\n' +
            '  seeds.seed_number,\n' +
            '  seeds.dt_name,\n' +
            '  seeds.lt_name,\n' +
            '  seeds.description,\n' +
            '  seeds.stock,\n' +
            '  seeds.water,\n' +
            '  seeds.plant_time,\n' +
            '  seeds.climate,\n' +
            '  seeds.sun,\n' +
            '  seeds.growth_weeks,\n' +
            '  seeds.created_at;\n');
        res.status(201).json(rows);
    } catch (error) {
        console.error('Error in /saatgut :', error);
        res.status(500).json({error: 'Interner Serverfehler'});
    }
});


// Socket.IO-Verbindung
io.on('connection', (socket) => {
    socket.on('disconnect', () => {
    });
});

server.listen(3000);


// Ab hier nur noch alter stuff vom template

// API: Alle Benutzer abrufen
app.get('/users', async (req, res) => {
    const [rows] = await db.query('SELECT * FROM users');
    res.json(rows);
});

// API: Benutzer hinzufügen
app.post('/users', async (req, res) => {
    const {name, email} = req.body;
    await db.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
    io.emit('new-user', {name, email}); // Echtzeit-Update an alle Clients
    res.status(201).json({message: 'Created'});
});
