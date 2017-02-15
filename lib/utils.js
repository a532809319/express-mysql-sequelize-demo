/**
 * 单个数字转为双位
 * 
 * @param [number]
 */
const dbNum = (num) => {
    if (+num <= 9) {
        num = '0' + num
    }
    return num
}

/**
 * 时间转换为符合数据库要求的测试
 * 
 * @param 时间戳
 */
const dateToMysqlDate = (st) => {

    let _t = !!st ? new Date(st) : new Date()
    
    let _tt = [
        _t.getFullYear() + '-',
        dbNum(_t.getMonth() + 1) + '-',
        dbNum(_t.getDate()) + ' ',
        dbNum(_t.getHours()) + ':',
        dbNum(_t.getMinutes()) + ':',
        dbNum(_t.getSeconds())
    ].join('')

    return _tt

}

/**
 * 排除空数据
 */
const objRuleOutEmpty = (obj) => {
    for(let key in obj) {
        if(!!!obj[key]){
            delete obj[key]
        }
    }
    return obj
}

module.exports = {
    dbNum,
    dateToMysqlDate,
    objRuleOutEmpty
}
