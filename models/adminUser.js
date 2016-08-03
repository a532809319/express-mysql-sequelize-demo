'use strict';

module.exports = function(sequelize, Sequelize) {
	var adminUser = sequelize.define('admin_user', {
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
		tableName: 'admin_user'
	});

	adminUser.sync().then(function(){

		adminUser.findOrCreate({
			where: {
				userName: 'admin',
				passWord: '123456'
			}
		});

	}); //创建表

	return adminUser;
};