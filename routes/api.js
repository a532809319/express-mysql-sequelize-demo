// let express = require('express')
// let router = express.Router()

module.exports = (router, logger) => {

    const MODEL_ALL = require('../models')
    const MODEL_USER = MODEL_ALL.user
    const MODEL_REPAST = MODEL_ALL.repast

    const utils = require('../lib/utils')

    router.use(function (req, res, next) {
        logger.info('这个接口经过了api，访问的URL是：' + req.url)
        logger.info('query数据：' + JSON.stringify(req.query))
        logger.info('body数据：' + JSON.stringify(req.body))
        next()
    })

    // 退出登录 清空session
    router.all('/logout.json', (req, res, next) => {
        logger.info("退出登录")

        req.session.userInfo = null
        req.session.administrator = false

        res.json({
            success: true,
            message: '已退出登录'
        })
    })

    // 管理员登录 admin 123456
    router.post('/adminLogin.json', (req, res, next) => {
        let _body = req.body
        let userName = _body.userName
        let passWord = _body.passWord

        let _success = true
        let _message = '登录成功！'

        if (!!!userName || !!!passWord) {
            _success = false
            _message = '请输入用户名或密码'
        }

        if (_success && userName != 'admin') {
            _success = false
            _message = '请输入正确的用户名'
        }

        if (_success && passWord != '123456') {
            _success = false
            _message = '请输入正确的密码'
        }

        if (_success) {
            // 把用户信息写入session
            req.session.userInfo = {
                userName
            }
            req.session.administrator = true
        }

        logger.info(_message)

        res.json({
            success: _success,
            message: _message
        })

    })

    // 用户登录
    router.post('/login.json', (req, res, next) => {

        let _body = req.body
        let userName = _body.userName
        let passWord = _body.passWord

        MODEL_USER.findOne({
            where: {
                userName
            }
        }).then((user) => {
            let _success = true
            let _message = ''

            if (!!user) {
                if (user.passWord === passWord) {
                    // 0-> 离职，1-> 在职
                    if (user.onTheJob === '0') {
                        _success = false
                        _message = '用户已离职'
                    } else {
                        _message = '登录成功！'
                        req.session.userInfo = user
                    }
                } else {
                    _success = false
                    _message = '密码错误'
                }
            } else {
                _success = false
                _message = '用户名错误'
            }

            logger.info(_message)

            res.json({
                success: _success,
                message: _message
            })

        })

    })

    // 服务器时间 毫秒
    router.get('/serverTime.json', (req, res, next) => {
        res.json({
            success: true,
            data: (new Date()).getTime()
        })
    })

    // 数据验证
    router.post('/validate/userDataIsOnly.json', (req, res, next) => {

        let _body = req.body

        let valids = []

        Object.keys(_body).forEach((key, i) => {
            let _obj = {}
            _obj[key] = _body[key]
            valids.push(_obj)
        })

        let queryDataIsOnly = (obj) => {

            return new Promise((resolve, reject) => {

                MODEL_USER.findOne({
                    where: obj
                }).then((user) => {
                    if (!!user) {
                        resolve(false)
                    } else {
                        resolve(true)
                    }
                }).catch(() => {
                    resolve(false)
                })

            })

        }

        if (!!!valids.length) {

            res.json({
                success: false,
                message: '没有可以验证的数据'
            })

        } else if (valids.length === 1) {

            queryDataIsOnly(valids[0])
                .then((isOnly) => {
                    res.json({
                        success: isOnly
                    })
                })

        } else {

            let loopQuery = (arr) => {

                let _qs = []
                let _q = (obj, key) => {

                    return new Promise((resolve, reject) => {

                        queryDataIsOnly(obj)
                            .then((isOnly) => {
                                let _obj = {}
                                _obj[key] = isOnly
                                resolve(_obj)
                            })

                    })

                }

                arr.forEach((obj, i) => {

                    let _key = ''

                    Object.keys(obj).forEach((key) => {
                        _key = key
                    })

                    _qs.push(_q(obj, _key))

                })

                return Promise.all(_qs)

            }

            loopQuery(valids)
                .then((value) => {
                    res.json({
                        success: value
                    })
                })

        }

    })

    // 以下服务，必须登录后才能使用
    // router.use((req, res, next) => {

    //     if (req.session.userInfo) {
    //         next()
    //     } else {
    //         res.json({
    //             success: false,
    //             message: '请登录'
    //         })
    //     }

    // })

    // 公共错误回调
    const errCallBack = (res) => {
        return (err) => {
            logger.info(err)

            res.json({
                success: false,
                message: err
            })
        }
    }

    // 用户数据
    router.route('/user.json')
        // 通过 id 获取用户数据
        .get((req, res, next) => {

            let _query = req.query
            let id = _query.id

            if (!!!id) {
                logger.info('用户id不存在')

                return res.json({
                    success: false,
                    message: '用户id不能为空'
                })
            }

            MODEL_USER.findOne({
                where: {
                    id
                }
            }).then((user) => {
                res.json({
                    success: !!user,
                    data: user
                })
            })

        })
        // 更新 或 创建 用户
        .post((req, res, next) => {

            let _body = req.body
            let id = _body.id

            if (!!id) {

                MODEL_USER.findOne({
                    where: {
                        id
                    }
                })
                    .then((user) => {
                        if (!!user) {
                            logger.info('找到用户并判断权限')

                            let isAdmin = req.session.administrator

                            // 管理员 或 当前用户 才能更新资料
                            if (isAdmin || user.userName === _body.userName) {
                                if (isAdmin) {
                                    logger.info('管理员权限')
                                } else {
                                    logger.info('当前用户')
                                }
                                logger.info('权限通过，更新用户状态')

                                return user.update(_body)
                            } else {
                                logger.info('无权操作')

                                return Promise.reject('无权操作')
                            }

                        } else {
                            logger.info('并没有通过用户id找到用户')

                            return Promise.reject('并没有通过用户id找到用户')
                        }
                    })
                    .then(() => {
                        logger.info('更新用户后返回用户信息')

                        res.json({
                            success: true,
                            message: '更新成功！'
                        })
                    })
                    .catch((err) => {
                        logger.info('user.json 更新用户中报错了')
                        logger.info(err)

                        res.json({
                            success: false,
                            message: err
                        })
                    })

            } else {

                MODEL_USER.findOne({
                    where: {
                        userName: _body.userName
                    }
                })
                    .then((user) => {

                        if (!!user) {
                            logger.info('用户已存在')

                            res.json({
                                success: false,
                                message: '用户已存在'
                            })
                        } else {
                            logger.info('用户不存在，创建用户')

                            if (!!_body.email && _body.email.split('@')[0] != _body.userName) {
                                logger.info('用户名和邮箱前缀名不一致')
                                res.json({
                                    success: false,
                                    message: '用户名和邮箱前缀名不一致'
                                })
                            } else {
                                return MODEL_USER.create(_body)
                            }

                        }

                    })
                    .then((user) => {
                        logger.info('创建用户后返回用户信息')

                        res.json({
                            success: true,
                            message: _body.userName + ' 创建成功！',
                            userInfo: user
                        })
                    })
                    .catch((err) => {
                        logger.info('user.json 创建用户中报错了')
                        logger.info(err)

                        res.json({
                            success: false,
                            message: err
                        })
                    })

            }

        })
        // 删除用户
        .delete((req, res, next) => {

            // 删除权限
            if (!!!req.session.administrator) {
                return res.json({
                    success: false,
                    message: '管理员才能进行该操作'
                })
            }

            let _body = req.body
            let id = _body.id

            MODEL_USER.findOne({
                where: {
                    id
                }
            })
                .then((user) => {

                    if (!!user) {
                        logger.info('删除用户，用户存在')

                        return user.destroy()
                    } else {
                        logger.info('删除用户，用户不存在')

                        return Promise.reject('删除用户，用户不存在')
                    }

                })
                .then(() => {
                    logger.info('id为' + id + '的用户已被删除')

                    res.json({
                        success: true,
                        message: 'id为' + id + '的用户已被删除'
                    })
                })
                .catch((err) => {
                    logger.info('删除用户出错了')
                    logger.info(err)
                    res.json({
                        success: false,
                        message: err
                    })
                })

        })

    // 订餐数据

    // 是否合法时间
    const doRepastIsRightTime = (time) => {

        let _time = new (time ? Date(time) : Date())
        let _today = new Date()
        let _whatDay = _time.getDay()
        const _whatHours = _today.getHours()
        const _whatMinutes = _today.getMinutes()
        
    }

    router.route('/repast.json')
        // 订餐
        .post((req, res, next) => {

            // 周一至周五 15:00 - 17:30
            // 周六至周日 10:00 - 11:30  15:00 - 17:30
            logger.info('核对订餐时间')

            const _today = new Date()
            const _whatDay = _today.getDay()
            const _whatHours = _today.getHours()
            const _whatMinutes = _today.getMinutes()

            logger.info(_whatDay + '-' + _whatHours + '-' + _whatMinutes)

            const compareTime = (startH, startM, endH, endM) => {

                if ((_whatHours >= startH && _whatMinutes >= startM) && (_whatHours <= endH && _whatMinutes <= endM)) {
                    return true
                } else {
                    return false
                }

            }

            if (((_whatDay === 0 || _whatDay === 6) ? !compareTime(10, 0, 11, 30) : true) && !compareTime(15, 0, 17, 30)) {
                return res.json({
                    success: false,
                    message: '不在订餐时间范围内'
                })
            }

            let _body = req.body

            // 填写订单的用户是否和session用户相同
            if (_body.doRepastUserId != req.session.userInfo.id) {
                logger.info('订单人错误(' + _body.doRepastUserId + '--' + req.session.userInfo.id + ')')

                return res.json({
                    success: false,
                    message: '订单人错误'
                })
            }

            // 查询取餐人是否存在
            logger.info('查询取餐人是否存在(' + _body.userName + ')')

            MODEL_USER.findOne({
                where: {
                    userName: _body.userName
                }
            })
                .then((user) => {

                    if (!!user) {
                        logger.info('取餐人存在')

                        _body.userId = user.id
                        _body.time = utils.dateToMysqlDate(_today.getTime())
                        _body.state = '1'
                        _body.doRepastUserName = req.session.userInfo.userName
                        _body.doRepastUserId = req.session.userInfo.id

                        logger.info('查询当前人是否已经定了餐')

                        let _yyyymmdd = [
                            _today.getFullYear(),
                            utils.dbNum(_today.getMonth() + 1),
                            utils.dbNum(_today.getDate())
                        ].join('-')

                        return MODEL_REPAST.findAll({
                            where: {
                                userId: _body.userId,
                                state: '1',
                                time: {
                                    $gte: _yyyymmdd + ' 00:00:00',
                                    $lte: _yyyymmdd + ' 23:59:59'
                                }
                            }
                        })

                    } else {
                        return Promise.reject('取餐人不存在')
                    }

                })
                .then((repasts) => {

                    // 周一至周五 只能有一个订餐
                    // 周六至周日 可以有两个订餐
                    if (_whatDay === 0 || _whatDay === 6) {
                        if (repasts.length <= 1) { }
                    } else {
                        if (repasts.length >= 1) {
                            return Promise.reject('已经定了餐')
                        }
                    }

                    logger.info('可以订餐')

                    return MODEL_REPAST.create(_body)

                })
                .then((repast) => {
                    res.json({
                        success: true,
                        data: repast
                    })
                })
                .catch(errCallBack(res))

        })
        // 取消订餐
        .delete((req, res, next) => {

            let id = req.body.id

            if (!!!id) {
                return res.json({
                    success: false,
                    message: '没有订单id'
                })
            }

            MODEL_REPAST.findOne({
                where: {
                    id
                }
            })
                .then((repast) => {
                    if (!!!repast) {
                        return Promise.reject('并没有订单')
                    }

                    // 是否可以操作订单

                })
                .catch(errCallBack(res))

        })

    // 获取某天到某天某人的订餐数据
    router.get('/todayRepast.json', (req, res, next) => {
        /**
         * 查询订餐信息
         * @param userId 用户id
         * @param userName 用户名称
         * @param startTime 查询的开始时间 2017-01-01 默认是今天
         * @param endTime 查询的结束时间 2017-01-01 默认是今天
         */

        let _today = utils.dateToMysqlDate().split(' ')[0]

        let _query = req.query
        let userId = _query.userId
        let userName = _query.userName
        let startTime = _query.startTime || _today
        let endTime = _query.endTIme || _today

        logger.info('查询某天(' + startTime + ')某天(' + endTime + ')到某天的某人(' + userId + ')(' + userName + ')的订餐数据')

        // 空数据排除
        let _where = {
            userId,
            userName,
            time: {
                $gte: startTime + ' 00:00:00',
                $lte: endTime + ' 23:59:59'
            }
        }

        _where = utils.objRuleOutEmpty(_where)

        MODEL_REPAST.findAll({
            where: _where
        })
            .then((users) => {

                return res.json({
                    success: true,
                    data: users
                })

            })
            .catch(errCallBack(res))

    })

    // 伪造订餐数据
    router.post('/makeRepast.json', (req, res, next) => {

        let _body = req.body

        _body.time = utils.dateToMysqlDate()
        _body.state = '1'

        MODEL_REPAST.create(_body)
            .then((repast) => {
                res.json({
                    success: true,
                    data: repast
                })
            })
            .catch(errCallBack(res))


    })
    // 测试是否可以订餐
    router.post('/canDoRepast.json', (req, res, next) => {
        // 周一至周五 15:00 - 17:30
        // 周六至周日 10:00 - 11:30  15:00 - 17:30
        logger.info('核对订餐时间(星期、小时、分钟)')

        const _today = new Date()
        const _whatDay = _today.getDay()
        const _whatHours = _today.getHours()
        const _whatMinutes = _today.getMinutes()

        logger.info(_whatDay + '-' + _whatHours + '-' + _whatMinutes)

        const compareTime = (startH, startM, endH, endM) => {

            if ((_whatHours >= startH && _whatMinutes >= startM) && (_whatHours <= endH && _whatMinutes <= endM)) {
                return true
            } else {
                return false
            }

        }

        // if (((_whatDay === 0 || _whatDay === 6) ? !compareTime(10, 0, 11, 30) : true) && !compareTime(15, 0, 17, 30)) {
        //     reject('不在订餐时间范围内')
        // }

        MODEL_USER.findOne({
            where: {
                userName: req.body.userName
            }
        })
            .then((user) => {
                if (!!!user) {
                    return Promise.reject('用户不存在')
                }

                logger.info('查询当前人是否已经定了餐')

                let _yyyymmdd = [
                    _today.getFullYear(),
                    utils.dbNum(_today.getMonth() + 1),
                    utils.dbNum(_today.getDate())
                ].join('-')

                return MODEL_REPAST.findAll({
                    where: {
                        userId: user.dataValues.id,
                        state: '1',
                        time: {
                            $gte: _yyyymmdd + ' 00:00:00',
                            $lte: _yyyymmdd + ' 23:59:59'
                        }
                    }
                })

            })
            .then((repasts) => {

                logger.info(repasts.length)

                // 周一至周五 只能有一个订餐
                // 周六至周日 可以有两个订餐
                if (_whatDay === 0 || _whatDay === 6) {
                    if (repasts.length <= 1) { }
                } else {
                    if (repasts.length >= 1) {
                        return Promise.reject('已经定了餐')
                    }
                }

                res.json({
                    success: true
                })

            })
            .catch(errCallBack(res))
    })

    return router
}
