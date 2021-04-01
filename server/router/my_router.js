// 引入
const express = require('express')
const router = express.Router()
const con = require('../util/mysql')

// post方式上传formData文件
const multer = require('multer')
// const upload = multer({data:'uploads'})
// 精细化去设置，如何去保存文件

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
    console.log('file', file)
    // const filenameArr = file.originalname.split('.');
    cb(null, file.originalname) //  + "." +filenameArr[filenameArr.length-1]);
    }
})
const upload = multer({ storage })
// 普通键值对解析方法
router.use(express.urlencoded())
// 写接口
// 获取用户基本信息
router.get('/userinfo', (req, res) => {
    // 1.获取参数
    //   如何获取get方式在请求行中传递的数据？ req.query中
    console.log('获取到的用户的基本信息是:', req.query);
    const { username } = req.query
    // 2. 拼接sql语句
    let sqlStr = `select id,username,nickname,email,userPic from users`
    // console.log(sqlStr);
    // 拼接用户传递的参数
    if (username) {
        sqlStr += ` where username="${username}"`
        console.log(sqlStr);
    }
    // 3. 去数据库做查询
    con.query(sqlStr, (err, result) => {
        if (err) {
            console.log(err);
            res.json({ status: 1, msg: '获取失败' })
            return
        }
        res.json({status: 0, msg: '获取成功',data:result})
    })
})
// 接收图片上传
router.post('/uploadPic', upload.single('file_data'), (req, res) => {
    // 如果文件上传成功
    console.log('文件上传成功', req.file);
    res.json({
        code: 200,
        msg: '文件上传成功!',
        src:'http://127.0.0.1:3002/uploads/'+req.file.filename
    })
})
// 更新用户基本信息
router.post('/userinfo', (req, res) => {
    // 1.获取参数
    console.log('更新用户获取的参数是:', req.body);
    const { id, nickname, email,userPic } = req.body
    let condition = []
    if (nickname) {
        condition.push(`nickname="${nickname}"`)
    }
    if (email) {
        condition.push(`email="${email}"`)
    }
    if (userPic) {
        condition.push(`userPic="${userPic}"`)
    }
    const conStr = condition.join()
    // 2.拼接sql,添加到users表中
    let sqlStr = `update users set ${conStr} where id=${id}`
    console.log(sqlStr);
    // 3.操作数据库
    con.query(sqlStr, (err, result) => {
        console.log(err);
        if (err) {
            res.json({ status: 1, msg: '数据更新失败!' })
            return
        }
        res.json({status:0,msg:'数据更新成功!',data:result})
    })
})
// 重置密码
router.post('/updatepwd', (req, res) => {
    // 1.获取参数
    console.log('重置密码传递的参数是:', req.body);
    const { oldPwd, newPwd, id } = req.body
    // 2.拼接字符串
    let sqlStr = `update users set password="${newPwd}" where id=${id} and password=${oldPwd}`
    console.log(sqlStr);
    // 3.执行sql操作数据库
    con.query(sqlStr, (err, result) => {
        if (err) {
            console.log(err);
            res.json({ status: 1, msg: '修改密码失败!' })
            return
        }
        res.json({status:0,msg:'修改密码成功!'})
    })
    // res.send('ok')
})
// 导出
module.exports = router