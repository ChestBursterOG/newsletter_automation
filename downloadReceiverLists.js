const log = require('./log');
const { table } = require('./airtableData');

async function pobierzListeOdbiorcow() {
    try {
        log('Pobieranie adresów z bazy danych');
        const records = await table.select({ fields: ['Email'] }).all();
        log('Liczba odbiorców: ' + records.length);
        return records.map(record => record.get('Email'));
    } catch (error) {
        log('Wystąpił błąd podczas pobierania listy odbiorców z Airtable:' + error);
        return [];
    }
}

async function pobierzOdbiorcowV1() {
    try {
        log('Pobieranie adresów z bazy danych');
        const records = await table.select({ fields: ['Email', 'V1'] }).all();
        return records.filter(record => record.get('V1')).map(record => record.get('Email'));
    } catch (error) {
        log('Wystąpił błąd podczas pobierania listy odbiorców z Airtable:', error);
        return [];
    }
}

async function pobierzOdbiorcowV2() {
    try {
        log('Pobieranie adresów z bazy danych');
        const records = await table.select({ fields: ['Email', 'V2'] }).all();
        return records.filter(record => record.get('V2')).map(record => record.get('Email'));
    } catch (error) {
        log('Wystąpił błąd podczas pobierania listy odbiorców z Airtable:', error);
        return [];
    }
}

async function pobierzOdbiorcowV3() {
    try {
        log('Pobieranie adresów z bazy danych');
        const records = await table.select({ fields: ['Email', 'V3'] }).all();
        return records.filter(record => record.get('V3')).map(record => record.get('Email'));
    } catch (error) {
        log('Wystąpił błąd podczas pobierania listy odbiorców z Airtable:', error);
        return [];
    }
}

module.exports = { 
    pobierzListeOdbiorcow, 
    pobierzOdbiorcowV1,
    pobierzOdbiorcowV2,
    pobierzOdbiorcowV3
}