const express = require('express')
// 使用 GZIP 中间件合并请求
const compression = require('compression')
// session
const expressSession = require('express-session')

const bodyParser = require('body-parser')

const cookieParser = require('cookie-parser')

// log4js
let log4js = require('log4js')

log4js.configure({
    appenders: [{
        type: 'console'
    }, {
        type: 'dateFile',
        filename: './logs/cheese.log',
        pattern: '-yyyy-MM-dd',
        category: 'cheese'
    }]
})

let app = express()

app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(bodyParser.json())

app.use(cookieParser())

app.use(expressSession({
    secret: 'BornSoft',
    resave: false,
    saveUninitialized: true
}))

app.use(log4js.connectLogger(log4js.getLogger('cheese'), {
    level: log4js.levels.INFO
}))

app.use(compression())

// 路由
let apiLogger = log4js.getLogger('cheese')
apiLogger.setLevel('INFO')

app.use('/api', require('./routes/api')(express.Router(), apiLogger))

app.listen(3000, () => {
    console.log('127.0.0.1:3000')
})
