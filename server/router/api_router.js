// 引入
const express = require('express')
const router = express.Router()
const con = require('../util/mysql')
// 加载token字符串模块
// const jwt = require('jsonwebtoken')
// post普通键值对的解析方法
router.use(express.urlencoded())
// 写接口
// 注册
router.post('/reguser', (req, res) => {
    // 1. 获取参数
    console.log('注册传递的参数是:', req.body);
    const { username, password } = req.body
    // console.log(username,password);
    // 2. 根据注册业务的要求，先去看一下名字有没有占用！
    const sqlStrSelect = `select username from user  where username="${username}"`
    // console.log(sqlStrSelect);
    // res.send('ok')

    //    根据用户名去做一次查询 如果找到了结果，说明名字被占用了
    //    如果查询结果为空，说明名字可以使用
    con.query(sqlStrSelect, (err, result) => {
        console.log(result);
        // 说明查询出错
        if (err) {
            console.log(err);
            res.json({ code: 500, msg: '服务器错误!' })
            return
        }
        // 说明名字被占用了
        if (result.length > 0) {
            res.json({ code: 201, msg: '名字被占用!' })
            return
        }
        // 说明没被占用
        // 3.拼接sql语句
        let sqlStr = `insert into users (username,password) value("${username}","${password}")`
        console.log(sqlStr);
        // 4. 执行sql操作数据库
        con.query(sqlStr, (err, result) => {
            if (err) {
                console.log(err);
                res.json({ status: 1, msg: '添加失败!' })
                return
            }
            // 5. 根据操作结果，做不同的响应
            res.json({status:0,msg:'添加成功!'})
            // res.send('ok')
        })
    })
})

// 登录
router.post('/login', (req, res) => {
    // 1. 接收参数
    console.log('登录传递的参数是:', req.body);
    const { username,password } = req.body
    // 2. 拼接sql字符串, 思路:根据用户名和密码去做查询，如果查找到了，说明登陆成功，
    let sqlStr = `select * from users where username="${username}" and password="${password}"`
    console.log(sqlStr);
    // 3. 执行sql
    con.query(sqlStr, (err, result) => {
        // 4. 根据结果进行返回
        //   查不到，说明错误
        if (err) {
            console.log(err);
            res.json({ code:500, msg: '服务器错误!' })
            return
        }
        if (result.length > 0) {
            // 查到了,登录成功,返回token
            /* const token = 'Bearer ' + jwt.sign(
                {name: userName}, 
                'gz61',  // 加密的密码，要与express-jwt中的验证密码一致
                {expiresIn: 2*60*60 } // 过期时间，单位是秒
            ) */
            res.json({status:0,msg:'登录成功!'})
        } else {
            res.json({ status: 1, msg: '登录失败,账号密码有误!' })
        }

    })
})

// 导出
module.exports = router