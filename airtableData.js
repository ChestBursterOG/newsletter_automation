const Airtable = require('airtable');

require('dotenv').config();

const airtable = new Airtable({ apiKey: process.env.AIRTABLE_DATABASE1_API_KEY });
const base = airtable.base(process.env.AIRTABLE_DATABASE1_BASE_ID);
const table = base.table(process.env.AIRTABLE_DATABASE1_TABLE_NAME);


module.exports = { table }