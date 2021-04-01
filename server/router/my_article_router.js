// 引入
const { json } = require('express')
const express = require('express')
const router = express.Router()
const con = require('../util/mysql')
// post请求解析普通键值对方式
router.use(express.urlencoded())
// 写接口
// 获取文章分类列表
router.get('/cates', (req, res) => {
    // 1.获取参数
    console.log('获取文章分类传递的参数是:', req.query);
    const { id,name,slug } = req.query
    // 2.拼接sql语句
    let sqlStr = `select * from categories`
    // console.log(sqlStr);
    // 执行Sql操作数据库
    con.query(sqlStr, (err, result) => {
        if (err) {
            console.log(err);
            res.json({ status: 1, msg: '获取失败' })
            return
        }
        res.json({status:0,msg:'获取成功',data:result})
    })
    // 错误
    //  Cannot set headers after they are sent to the client
    // 无法设置发送客户端后的标头
    // res.send('ok')
})
// 新增文章分类
router.post('/addcates', (req, res) => {
    // 1.获取参数
    console.log('新增文章分类传递的参数是:', req.body);
    const { name, slug } = req.body
    // 2.拼接qls语句
    let sqlStr = `insert into categories (name,slug) value("${name}","${slug}")`
    // console.log(sqlStr);
    // 3.执行sql操作数据库
    con.query(sqlStr, (err, result) => {
        if (err) {
            console.log(err);
            res.json({ status: 1, msg: '添加失败!' })
            return
        }
        res.json({status:0,msg:'添加成功!'})
    })
    // res.send('ok')
})
// 根据id删除文章分类
router.get('/deletecate', (req, res) => {
    // 1.获取参数
    console.log('根据id删除文章内容传递的参数是:', req.query);
    const { id } = req.query
    // 2.拼接sql语句
    let sqlStr = `delete  from categories where id=${id}`
    console.log(sqlStr);
    // 3.执行sql操作数据库
    con.query(sqlStr, (err, result) => {
        if (err) {
            console.log(err);
            res.json({ status: 1, msg: '删除失败!' })
            return
        }
        res.json({status:0,msg:'删除文章分类成功!'})
    })
    // res.send('ok')
})
// 根据id获取文章分类
router.get('/getCatesById', (req, res) => {
    // 1.获取参数
    console.log('根据id获取文章分类传递的参数是:', req.query);
    const { id,name,slug } = req.query
    // 2.拼接sql语句
    let sqlStr =   `select id,name,slug from categories where id=${id}`
    // console.log(sqlStr);
    // 3.执行sql操作数据库
    con.query(sqlStr, (err, result) => {
        if (err) {
            console.log(err);
            res.json({ status: 1, msg: '获取失败!' })
            return
        }
        res.json({status:0,msg:'获取成功!',data:result})
    })
    // res.send('ok')
})
// 根据id更新文章分类
router.post('/updatecate', (req, res) => {
    // 1.获取参数
    console.log('根据id更新文章分类传递的参数是:', req.body);
    const { id,name,slug } = req.body
    // 2.拼接sql语句
    let sqlStr =   `update categories set name="${name}",slug="${slug}" where id=${id}`
    // console.log(sqlStr);
    // 3.执行sql操作数据库
    con.query(sqlStr, (err, result) => {
        if (err) {
            console.log(err);
            res.json({ status: 1, msg: '更新失败!' })
            return
        }
        res.json({status:0,msg:'更新成功!'})
    })
    // res.send('ok')
})

// 导出
module.exports = router