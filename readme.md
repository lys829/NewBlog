### 全局安装
supervisor
pm2

### 文件
1. models: 存放操作数据库的文件
2. public: 存放静态文件，如样式、图片等
3. routes: 存放路由文件
4. views: 存放模板文件
5. index.js: 程序主文件
6. package.json: 存储项目名、描述、作者、依赖等等信息

### 依赖模块

1. express: web 框架
* express-session: session 中间件
* connect-mongo: 将 session 存储于 mongodb，结合 express-session 使用
* connect-flash: 页面通知提示的中间件，基于 session 实现
* ejs: 模板
* express-formidable: 接收表单及文件的上传中间件
* config-lite: 读取配置文件
* marked: markdown 解析
* moment: 时间格式化
* mongolass: mongodb 驱动
* objectid-to-timestamp: 根据 ObjectId 生成时间戳
* sha1: sha1 加密，用于密码加密
* winston: 日志
* express-winston: 基于 winston 的用于 express 的日志中间件


### 页面结构
1. 注册
    * 注册页 `GET /signup`
    * 登录 `POST /signin`

2. 登出 `GET /signout`
3. 查看文章
    * 主页 `GET /posts`
    * 个人主页 `get /posts?author=xx`
    * 查看一篇文章(包含留言) `GEt /posts/:postId`
5. 发表
    * 发表文章页 `GET /posts/create`
    * 发表文章 `POST /posts`
6. 修改文章
    * 修改文章页 `GET /posts/:postId/edit`
    * 修改文章  `POST /posts/:postId/edit`
7. 删除文章 `GET /posts/:postId/remove`
8. 留言
    * 创建留言 `POST /posts/:postId/comment`
    * 删除留言 `GET /posts/:postId/comment/:commentId/remove`

### 常用命令
* supervisor --harmony index
* `pm2 start/stop` 启动/停止程序
* `pm2 reload/restart [id|name]` 重启程序
* `pm2 logs [id|name]` 查看日志
* `pm2 l/list` 列出程序列表