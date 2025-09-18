require("dotenv").config();
const { Database } = require('@sqlitecloud/drivers');
const db = new Database(`sqlitecloud://cwumt50cnz.g3.sqlite.cloud:8860/emplsDataBase.db?apikey=${process.env.DB_API_KEY}`);


module.exports= db;

