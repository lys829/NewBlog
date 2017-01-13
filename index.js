/**
 * Created by zeng on 17-1-12.
 */

/**
 *  supervisor --harmony index
 */

var path = require('path');
var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var config = require('config-lite');

var routes = require('./routes');
var pkg = require('./package.json');
var winston = require('winston');
var expressWinston = require('express-winston');

var app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));


// session中间件
app.use(session({
    name: config.session.key, //设置cookie中保存session id的名称
    secret: config.session.secret,  //通过设置secret来计算hash并放在cookie中，　使产生的signedCookie防篡改
    cookie: {
        maxAge: config.session.maxAge// 过期时间，过期后 cookie 中的 session id 自动删除
    },
    saveUninitialized: true,
    resave: true, //每次请求都重新设置session cookie
    store: new MongoStore({
        url: config.mongodb
    })
}));

//处理表单及文件上传的中间件
app.use(require('express-formidable')({
    //上传文件目录
    uploadDir: path.join(__dirname, 'public/img'),
    keepExtensions: true //保留后缀
}));

//flash 中间件，显示通知
app.use(flash());

//设置模板全局常亮
app.locals.blog = {
    title: pkg.name,
    description: pkg.description
};

//模板必须的变量
app.use( (req, res, next) => {
    res.locals.user = req.session.user;
    res.locals.success = req.flash('success').toString();
    res.locals.error = req.flash('error').toString();
    next();
});

/**
 * 记录正常请求日志的中间件要放到 routes(app) 之前，记录错误请求日志的中间件要放到 routes(app) 之后
 */
//正常请求的日志
app.use(expressWinston.logger({
    transports: [
        new (winston.transports.Console)({
            json: true,
            colorize: true
        }),
        new winston.transports.File({
            filename: 'logs/success.log'
        })
    ]
}));
routes(app);

//错误请求的日志
app.use(expressWinston.errorLogger({
    transports: [
        new winston.transports.Console({
            json: true,
            colorize: true
        }),
        new winston.transports.File({
            filename: 'logs/error.log'
        })
    ]
}));

//error page
app.use((err, req, res, next) => {
    res.render('error', {
        error: err
    })
});

app.listen(config.port, ()=> {
    console.log(`${pkg.name} listening on port ${config.port}`);
});