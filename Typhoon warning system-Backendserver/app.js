const express = require('express');

const typhoonRouter = require('./routes/typhoon');

const app = express();

// 自定义跨域中间件
const allowCors = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
};
app.use(allowCors);//使用跨域中间件

app.use('/typhoon', typhoonRouter);

app.use('/', (req, res, next) => {
    res.send('Typhoon API')
});

app.listen(18888, () => {
    console.log('running at http://localhost:18888');
})