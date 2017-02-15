# rouduoduo

> 学习使用 `express `、`sequelize `、`mysql `、`express-session` 写一个简单的读、存、改、删的小应用
> 
> 使用supervisor启动应用

## Build Setup

``` bash
# install dependencies
npm install

# install supervisor
npm i supervisor

# localhost:3000
npm run dev
```

## 更新和瞎逼逼
> 2017-02-15

把原来的代码删了，导入了一个新的代码，同样也是用的原来的那些工具(主要工具)，`express `、`sequelize `、`mysql `、`express-session`。

新增加了一个日志工具`log4js`。

在`models`中，根据`models`的文件自动添加，并非原来手动添加。

依旧是半吊子代码，不过对`Promise`进行了一点点的优化。

听了后端同事讲了他们如何做一些东西，似懂非懂，接下来就是提取公共操作等。`什么人`、`做`、`什么事`能理解一些。

在查询数据，对比时间的时候，学到了一些关于`Date`的小事件，有趣。



> 2016-08-04

我也不知道更新了什么，大概就是前段时间用`express-myconnection`链接数据库，现在改成了`sequelize`,慢慢踩坑中。

目前完成了的接口：

* `/admin/login.json` 管理员登录
* `/admin/createUser.json` 创建会员
* `/admin/getUserList.json` 获取用户列表

大概就是这些吧，在开发中，所以把那个未登录的判断注释了。

好粗糙的一个玩意，最开始也是为了给一个前端小项目做数据支持的作用，现在也是这样的，不过是顺带用一些新东西。

哦，对了，现在只是提供接口，其他什么都没有。


