$(function () {
    let form = layui.form;
    let lauer = layui.layer;
    // 调用函数
    initCate()
    // 1.封装函数
    function initCate() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                // 成功,赋值
                let htmlStr = template('tpl-pub', { data: res.data })
                $("[name=cate_id]").html(htmlStr)
                form.render();
            }
        });
    }

    // 2初始化富文本编辑器
    initEditor()


    // 3. 初始化图片裁剪器
    var $image = $('#image')

    // 3.1 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3.2 初始化裁剪区域
    $image.cropper(options)

    // 4.点击按钮,选择图片
    $('#btnChooseImage').on('click', function () {
        $('#coverfile').click();
    });

    // 5.渲染图片路径
    let layer = layui.layer;
    $('#coverfile').change(function (e) {
        var file = e.target.files[0]
        if (file == undefined) {
            $image
                .cropper('destroy')      // 销毁旧的裁剪区域
                .attr('src', '')  // 重新设置图片路径
            return layer.msg('您可以选择一张照片,作为封面!')
        }
        var newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 6.设置状态
    let state = "已发布";
    /* $('#btnSave1').on('click', function () {
        state = '已发布';
    }) */
    $('#btnSave2').on('click', function () {
        state = '草稿';
    })

    // 7.添加文章
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();

        // 创建FromData对象,收集数据
        let fd = new FormData(this);

        // 放入状态
        fd.append('state', state)
        // 放入图片
        $image.cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                console.log(...fd);
                // 发送ajax要在b;lob里面
                publishArticle(fd)
            });
    })

    // 封装ajax
    function publishArticle(fd) {
        $.ajax({
            type: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                layer.msg("恭喜您,发布文章成功!")
                // 跳转页面
                // location.href = '/article/art_list.html'
                setTimeout(function () {
                    window.parent.document.getElementById('art_list').click();
                }, 1500)
            }
        });
    }


})