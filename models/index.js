var Sequelize = require('sequelize')
var sequelize = new Sequelize('born', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306,
    timezone: '+08:00'
})

var fs = require('fs')
var path = require('path')

var db = {}

fs.readdirSync(__dirname)
    .filter((file) => {
        return (file.indexOf('.') !== 0 ) && (file !== 'index.js')
    })
    .forEach((file, i) => {
        let modal = sequelize.import(path.join(__dirname, file))
        db[modal.name] = modal
    })

Object.keys(db).forEach((modelName) => {
    if('associate' in db[modelName]) {
        db[modelName].associate(db)
    }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db