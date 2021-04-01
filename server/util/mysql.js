// 加载mysql
let mysql = require('mysql');
// 创建对象
let connection = mysql.createConnection({
    host: 'localhost',    //要连接的束缚器地址
    port: 3306,           //端口号
    user: 'root',         //数据库的用户名
    password: 'root',     //数据库的密码
    database: 'bignew'       //数据库名称
});
// 连接mysql服务器
connection.connect((err) => {
    // 如果有错误对象,表示连接失败
    if (err) return console.log('数据库连接失败!');
    // 连接成功
    console.log('数据库连接成功');
})

// 导出
module.exports = connection