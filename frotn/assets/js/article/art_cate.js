$(function () {

    var layer = layui.layer

    // 1.文章类别展示
    initArtCateList();

    function initArtCateList() {
        $.ajax({
            url: '/my/article/cates',
            success: (res) => {
                console.log(res);
                // 调用模板
                // var htmlStr = template('tpl-art-cate', { data: res.data })
                var htmlStr = template('tpl-art-cate', res)
                $('tbody').html(htmlStr)
            }
        });
    };

    // 2.显示添加文章分类列表
    $('#btnAdd').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $('#dialog-add').html(),
        });
    });

    // 3.提交文章分类添加(事件委托)
    let indexAdd = null;
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();

        $.ajax({
            type: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: (res) => {
                console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                //成功,重新渲染
                initArtCateList();
                layer.msg('恭喜您,文章类别添加成功!')
                layer.close(indexAdd)
            }
        });
    });

    // 4.修改,展示表单
    let indexEdit = null
    let form = layui.form;
    $('tbody').on('click', '.btn-edit', function () {
        // 利用框架代码,显示提示添加文章类别区域
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '250px'],
            content: $('#dialog-edit').html(),
        });

        // 4.2获取Id,发送ajax获取数据,熏染到页面
        let Id = $(this).attr('data-id');
        $.ajax({
            type: 'GET',
            url: '/my/article/cates/' + Id,
            success: (res) => {
                // console.log(res);
                form.val('form-edit', res.data)
            }
        });
    });


    // 4.修改,提示
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();

        $.ajax({
            type: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                //成功,重新渲染
                initArtCateList();
                layer.msg('恭喜您,文章类别更新成功!')
                layer.close(indexEdit)
            }
        });
    });


    // 5.删除
    $('body').on('click', '.btn-delete', function () {
        // 先获取Id,进入函数中this代指就改变了
        let Id = $(this).attr('data-id');
        // console.log(Id);
        // 显示对话框
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' },
            function (index) {
                $.ajax({
                    type: 'GET',
                    url: '/my/article/deletecate/' + Id,
                    success: (res) => {
                        console.log(res);
                        if (res.status != 0) {
                            return layer.msg(res.message)
                        }
                        //成功,重新渲染
                        initArtCateList();
                        layer.msg('恭喜您,文章类别删除成功!')
                        layer.close(index)
                    }
                });
            })

    })
})