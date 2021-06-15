const { Sequelize } = require('sequelize');

const db = new Sequelize("postgres://postgres:061021_Webd3v@localhost:5432/animal-server");

module.exports = db;