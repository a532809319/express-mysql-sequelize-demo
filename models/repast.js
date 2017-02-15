/**
 * 订餐表
 */

// 字段验证
const ALL_VALIDATE = require('../lib/baseDataValidate')
const USER_VALIDATE = ALL_VALIDATE.user
const REPAST_VALIDATE = ALL_VALIDATE.repast

module.exports = (sequelize, DataTypes) => {

    let repast = sequelize.define('repast', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        time: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: REPAST_VALIDATE.time
        },
        doRepastUserId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        doRepastUserName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: REPAST_VALIDATE.state
        }
    })

    repast.sync()

    return repast

}