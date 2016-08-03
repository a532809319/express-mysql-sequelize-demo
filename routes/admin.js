/***
 * 管理后台
 */
'use strict';

var models = require('../models');

var ADMINS = models.adminUser,
	USER = models.user;

var express = require('express');
var router = express.Router();

/*
 * 分页处理数据
 */
function formattingPages(result, pageSize, curPage) {

	return {
		pageSize: pageSize,
		curPage: curPage,
		list: result.rows,
		totalItem: result.count,
		totalPage: Math.floor(result.count / pageSize) + 1
	}

}


router.use(function(req, res, next) {
	console.log('---------- 简单日志 start --------------');
	console.log('这个接口经过了admin，时间是' + (new Date()));
	console.log('访问的URL是：' + req.url);
	console.log('---------- 简单日志 end --------------');
	next();
});

router.all('/login.json', function(req, res, next) {

	var _userName = req.body.userName,
		_passWord = req.body.passWord;

	if (!!!_userName || !!!_passWord) {
		res.json({
			success: false,
			message: '用户名或密码不能为空'
		});
	}

	ADMINS.findOne({
		where: {
			userName: _userName
		}
	}).then(function(user) {

		if (!user) {

			return res.json({
				success: false,
				message: '用户不存在'
			});

		}

		if (_passWord != user.passWord) {

			return res.json({
				success: false,
				message: '密码不正确'
			});

		}

		// 把用户信息写入session
		req.session.userInfo = user;

		console.log(_userName + '登录成功');

		res.json({
			success: true,
			message: '登录成功',
			data: user
		});

	});

});

router.all('/logout.json', function(req, res, next) {
	req.session.userInfo = null;
	res.json({
		success: true,
		message: '用户已退出登录'
	});
});
/*
 * 用户是否登录，登录后才能执行下一步
 */
// router.use(function(req, res, next) {
// 	if (req.session.userInfo) {
// 		next();
// 	} else {
// 		res.json({
// 			success: false,
// 			message: '用户未登录'
// 		});
// 	}
// });
/*
 * 从session中获取当前用户信息
 */
router.all('/getUserInfo.json', function(req, res, next) {
	res.json({
		success: true,
		message: '获取用户信息',
		data: req.session.userInfo
	});
});

/*
 * 获取用户列表
 */

router.all('/getUserList.json', function(req, res, next) {

	var _pageSize = req.body.pageSize || 10,
		_curPage = req.body.curPage || 1;

	USER.findAndCountAll({
		limit: _pageSize,
		offset: _pageSize * (_curPage - 1)
	}).then(function(result) {

		res.json({
			success: true,
			message: '获取用户列表',
			data: formattingPages(result, _pageSize, _curPage) 
		});

	});

});

/*
 * 创建用户
 */

router.all('/createUser.json', function(req, res, next) {

	var _userInfo = req.body,
		_userName = _userInfo.userName,
		_passWord = _userInfo.passWord;

	if (!_userName || !_passWord) {
		return res.json({
			success: false,
			message: '用户数据不完整'
		});
	}

	USER.findOne({
		where: {
			userName: _userName
		}
	}).then(function(user) {

		if (user) {
			res.json({
				success: false,
				message: '用户已存在'
			});
		} else {
			return USER.create(_userInfo);
		}

	}).then(function(user) {

		res.json({
			success: true,
			message: '已成功创建用户'
		});

	}).catch(function(e) {

		res.json({
			success: false,
			message: e
		});

	});

});



module.exports = router;