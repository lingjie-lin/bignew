$(function () {
    // 1.定义校验规则
    let form = layui.form;
    // let layer = layui.layer
    form.verify({
        // 1.1密码
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        // 1.2新密码,新旧不重复
        samePwd: function (value) {
            // value是新密码,旧密码需要获取
            if (value === $('[name = oldPwd').val()) {
                return ('原密码和新密码不能相同');
                // return layer.msg('原密码和新密码不能相同', { icon: 5 })

            }
        },
        // 1.3确认密码,和新密码一致
        rePWd: function (value) {
            if (value != $('[name = newPwd').val()) {
                return ('新密码两次输入不一致!')
            }

        }


    })

    // 2.表单提交
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: (res) => {
                console.log(res);
                if (res.status != 0) {
                    return layui.layer.msg(res.message);
                }
                // 成功,提示,清空表单,跳转页面
                layui.layer.msg('恭喜您,修改密码成功!');
                $('.layui-form')[0].reset();
                // location.href = '/login.html'

            }
        });
    })




})