'use strict';

// var fs = require('fs');
// var path = require('path');
var Sequelize = require('sequelize');
var sequelize = new Sequelize('mai', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306
});

var db = {};

db.adminUser = require('./adminUser')(sequelize, Sequelize);
db.user = require('./user')(sequelize, Sequelize);

// fs
//   .readdirSync(__dirname)
//   .filter(function(file) {
//     return (file.indexOf('.') !== 0) && (file !== 'index.js');
//   })
//   .forEach(function(file) {
//     var model = sequelize.import(path.join(__dirname, file));
//     db[model.name] = model;
//   });

// Object.keys(db).forEach(function(modelName) {
//   if ('associate' in db[modelName]) {
//     db[modelName].associate(db);
//   }
// });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;