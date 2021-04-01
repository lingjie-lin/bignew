$(function () {

    // 1.检验规则
    let form = layui.form;
    form.verify({
        nickname: function (value) {
            if (value.length > 6)
                return "昵称长度为1~6位之间!"
        }
    })

    // 导出layui
    let layer = layui.layer;

    // 2.用户渲染
    initUserInfo();
    // 封装函数
    function initUserInfo() {
        $.ajax({
            type: 'GET',
            url: '/my/userinfo',
            success: (res) => {
                console.log(res);
                // 判断
                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 5 })
                }
                // 成功后,渲染
                form.val('formUserInfo', res.data)
            }
        });
    }


    // 3.重置按钮
    // $('form').on('reset', function (e) {
    $('#btnReset').on('click', function (e) {
        e.preventDefault();
        // 用上面的用户渲染方法实现重置信息
        initUserInfo();
    })

    // 4.修改用户信息
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: (res) => {
                console.log(res);
                if (res.status != 0) {
                    return layer.msg("用户信息修改失败!")
                }
                layer.msg("恭喜您,修改成功!", { icon: 6 });
                // 调用父页面中的挂在的更新用户信息和头像方法
                window.parent.getUserInfo();
            }
        });
    })


})