// 引入
const express = require('express')
const server = express()
// cors解决跨域问题,当做一个中间件来使用
const cors = require('cors')
server.use(cors())
// 静态数据托管
server.use('/uploads', express.static('uploads'))

// 使用第三方模块,jsonwebtoken 创建token字符串
// const jwt = require('express-jwt')
// jwt用于解析token,并将token中保存的数据 赋值给 req.user
// unless( 约定某个接口不需要身份认证)
// server.use(jwt({
//     secret: 'gz61', // 生成token时的 钥匙，必须统一
//     algorithms: ['HS256'] // 必填，加密算法，无需了解
//     }).unless({
//         path: ['/user/login', '/user/reguster', /^\/uploads\/.*/]
//         // 除了这两个接口，其他都需要认证 放开token对图片的请求
//     }));

    // 通过路由中间件来加载不同的路由
const apiRouter = require('./router/api_router')
const myRouter = require('./router/my_router')
const articleRouter = require('./router/my_article_router')
server.use('/api', apiRouter)
server.use('/my',myRouter)
server.use('/my/article',articleRouter)

// 错误处理中间件
/* server.use((err, req, res, next) => {
    console.log('有错误', err)
    if (err.name === 'UnauthorizedError') {
      // res.status(401).send('invalid token...');
        res.status(401).send({ code: 1, message: '身份认证失败！' });
        }
}); */
    // 启动服务器
server.listen(3002, () => {
        console.log('服务器已在3002端口成功启动!');
    })
