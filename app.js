'use strict';

var express = require('express'),
	// mysql = require('mysql'),
	// myConnection = require('express-myconnection'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	routesAdmin = require('./routes/admin');

var app = express(),
	dbOptions = {
		host: 'localhost',
		user: 'root',
		password: '',
		port: 3306,
		database: 'mai'
	};

// app.use(myConnection(mysql, dbOptions, 'single'));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(session({
	secret: 'OnlyLingStudio',
	resave: false,
	saveUninitialized: true
}));

function errorHandler(err, req, res, next) {
	res.status(500).json('出错了，你说怎么办');
}

app.use('/admin', routesAdmin);

//configure the port number using and environment number
var portNumber = process.env.CRUD_PORT_NR || 3000;
//start everything up
app.listen(portNumber, function() {
	console.log('Create, Read, Update, and Delete (CRUD) example server listening on:', portNumber);
});