/**
 * 用户表
 */

// 字段验证
const USER_VALIDATE = require('../lib/baseDataValidate').user

module.exports = (sequelize, DataTypes) => {

    let user = sequelize.define('user', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // notNull: true
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: USER_VALIDATE.email
        },
        passWord: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: USER_VALIDATE.passWord
        },
        sex: {
            type: DataTypes.STRING,
            validate: USER_VALIDATE.sex
        },
        mobile: {
            type: DataTypes.STRING,
            validate: USER_VALIDATE.mobile
        },
        tel: {
            type: DataTypes.STRING,
            validate: USER_VALIDATE.tel
        },
        department: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // notNull: true
            }
        },
        position: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // notNull: true
            }
        },
        onTheJob: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: USER_VALIDATE.onTheJob
        },
        leaveTime: {
            type: DataTypes.STRING,
            validate: {
                // notNull: true
            }
        }
    })

    user.sync()

    return user

}