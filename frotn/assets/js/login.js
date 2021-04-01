// 入口函数
$(function () {
    // 需求1:点击a连接,显示隐藏盒子
    // 点击去注册a连接,显示注册模块,隐藏登录模块
    $('#link-reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show()
    })
    // 点击去登录a连接,显示登录模块,隐藏注册模块
    $('#link-login').on('click', function () {
        $('.reg-box').hide();
        $('.login-box').show()
    })


    // 需求2:自定义验证规则
    let form = layui.form
    form.verify({
        // 密码规则
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        // 确认密码规则
        repwd: function (value, item) {
            // 确认密码表单的值
            console.log(value);
            // 密码表单的值
            console.log($('.reg-box input[name = password]').val())
            if (value != $('.reg-box input[name = password]').val()) {
                return '两次输入的密码不一致,请再次确认密码!'
            }
        }
    })


    let layer = layui.layer
    // 需求3:注册功能
    $('#form-reg').on('submit', function (e) {
        // 阻止表单默认提交
        e.preventDefault();
        // 发送ajax提交
        $.ajax({
            type: 'POST',
            url: '/api/reguser',
            data: {
                username: $('.reg-box input[name = username]').val(),
                password: $('.reg-box input[name = password]').val()
            },
            success: (res) => {
                console.log(res);
                // 判断状态
                if (res.status != 0) {
                    // return alert(res.message);
                    return layer.msg(res.message, { icon: 5 });
                }
                // alert('恭喜你注册成功')
                layer.msg('恭喜你注册成功', { icon: 6 });
                // 成功后,切换回登录表单
                $('#link-login').click();
                // 清空表单
                $('#form-reg')[0].reset()
            }
        });
    })


    // 需求4:登录功能
    $('#form-login').on('submit', function (e) {
        // console.log(111);
        e.preventDefault()
        $.ajax({
            type: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: (res) => {
                console.log(res);
                // 验证返回状态
                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 5 });
                }
                layer.msg('恭喜你登录成功', { icon: 6 });

                localStorage.setItem('token', res.token)
                // 跳转
                location.href = "/index.html"
            }
        });
    })
})