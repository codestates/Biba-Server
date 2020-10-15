require('dotenv').config(); // no-var-requires

module.exports = {
  "development": {
    "username": "root",
    "password": process.env.DB_PD,
    "database": "Biba",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
