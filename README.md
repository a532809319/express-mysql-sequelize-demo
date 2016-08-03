# rouduoduo

> 学习使用 `express `、`sequelize `、`mysql `、`express-session` 写一个简单的读、存、改、删的小应用
> 
> 使用supervisor启动应用

## Build Setup

``` bash
# install dependencies
npm install

# localhost:3000
npm run dev
```

## 更新和瞎逼逼
> 2016-08-04

我也不知道更新了什么，大概就是前段时间用`express-myconnection`链接数据库，现在改成了`sequelize`,慢慢踩坑中。

目前完成了的接口：

* `/admin/login.json` 管理员登录
* `/admin/createUser.json` 创建会员
* `/admin/getUserList.json` 获取用户列表

大概就是这些吧，在开发中，所以把那个未登录的判断注释了

好粗糙的一个玩意，最开始也是为了给一个前端小项目做数据支持的作用，现在也是这样的，不过是顺带用一些新东西。

哦，对了，现在只是提供接口，其他什么都没有。


