require("dotenv").config();
const { Database } = require('@sqlitecloud/drivers');
const db = new Database(`sqlitecloud://cjkehlulhk.g2.sqlite.cloud:8860/emplsDataBase.db?apikey=2CbRCRsxOblXcRvASyRzuCKf7GNWiN8ttfYDYrTGjek`);

module.exports= db;

