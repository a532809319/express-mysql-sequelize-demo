'use strict';

module.exports = function(sequelize, Sequelize) {
	var user = sequelize.define('user', {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		userName: {
			type: Sequelize.STRING
		},
		passWord: {
			type: Sequelize.STRING
		}
	}, {
		tableName: 'user'
	});

	user.sync(); //创建表

	return user;
};