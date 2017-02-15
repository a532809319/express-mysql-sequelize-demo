/** 
 * 公共的正则表达式
 */
var REGEXP_COMMON = {
    // 数字、字母、字符
    NUM_LETTER_CHAR: /^[a-z\d\~\!\@\#\$\%\^\_\+\=\-\,\.]+$/gi,
    // 电话号码
    mobile: /^1(3|4|5|7|8)\d{9}$/g,
    // 座机 3-4位区号，-可有可无，7-8位电话号码
    tel: /^(\d{3,4}-?)?\d{7,8}$/g
}

/**
 * user 用户表 字段验证规则
 */
const user = {
    passWord: {
        is: REGEXP_COMMON.NUM_LETTER_CHAR,
        len: [6, 16]
    },
    email: {
        isEmail: true
    },
    sex: {
        isIn: [['0', '1']]
    },
    mobile: {
        is: REGEXP_COMMON.mobile
    },
    tel: {
        is: REGEXP_COMMON.tel
    },
    onTheJob: {
        isIn: [['0', '1']]
    }
}

const repast = {
    time: {
        isDate: true
    },
    state: {
        isIn: [['0', '1']]
    }
}

module.exports = {
    user,
    repast
}