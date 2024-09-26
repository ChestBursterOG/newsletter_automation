const log = require('./log');
const { Client } = require('pg');

const PG_HOST = 'localhost';
const PG_USER = 'postgres';
const PG_PASSWORD = 'chestburster';
const PG_DATABASE = 'newsletter-TEDx';
const PG_PORT = 5432;

const pgClient = new Client({
  host: PG_HOST,
  user: PG_USER,
  password: PG_PASSWORD,
  database: PG_DATABASE,
  port: PG_PORT,
});

pgClient.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Connection error', err.stack));

async function pobierzListeOdbiorcowPostgre() {
    try {
        log('Pobieranie adresów z bazy danych Postgre');

        const result = await pgClient.query('SELECT email FROM users');

        log('Liczba odbiorców: ' + result.rows.length);

        return result.rows.map(row => row.email);
    } catch (error) {
        log('Wystąpił błąd podczas pobierania listy odbiorców z PostgreSQL: ' + error);
        return [];
    }
}

module.exports = { 
    pobierzListeOdbiorcowPostgre, 
}