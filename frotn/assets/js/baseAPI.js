// 开发环境服务器地址
let baseURL = 'http://api-breakingnews-web.itheima.net'


// 拦截所有ajax请求
// 处理参数
$.ajaxPrefilter(function (options) {
    // 拼接对应服务器地址
    options.url = baseURL + options.url

    // 2.身份认证
    if (options.url.indexOf("/my/") !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || '',
        }
    }

    // 3.拦截所有响应,判断身份证信息
    options.complete = function (res) {
        // console.log(res.responseJSON);
        let obj = res.responseJSON;
        if (obj.status == 1 && obj.message == '身份证认证失败！') {
            console.log(11111);
            // 清空本地token
            localStorage.removeItem('token');

            // 页面跳转
            location.href = '/login.html';
        }
    }
})