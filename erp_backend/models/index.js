//Traer el constructor Sequelize y el objeto DataTypes para definir los tipos de campos en los modelos
const {Sequelize, DataTypes} = require('sequelize');

// Configuración: Base de datos SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
});

const db = {};
db.Sequelize = sequelize;
db.sequelize = sequelize;

// Importar el modelo de Producto
db.Product = require('./Product').default(sequelize, DataTypes);

module.exports = db;