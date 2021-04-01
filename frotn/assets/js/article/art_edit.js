$(function () {
    let form = layui.form;
    let lauer = layui.layer;

    // 0.设置表单信息
    // 用等号切割,然后使用后面的值
    // alert(location.search.split('=')[1])
    // 封装函数
    function initForm() {
        let id = location.search.split('=')[1];
        $.ajax({
            type: 'GET',
            url: '/my/article/' + id,
            success: (res) => {
                // console.log(res);
                // 判断
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                // 成功,渲染到表单中,进行修改
                form.val('form-edit', res.data);
                // 赋值tinymce
                tinyMCE.activeEditor.setContent(res.data.content);
                // 加载图片
                if (!res.data.cover_img) {
                    return layer.msg("用户未上传头像!");
                }
                let newImgURL = baseURL + res.data.cover_img;
                $image
                    .cropper('destroy')      // 销毁旧的裁剪区域
                    .attr('src', newImgURL)  // 重新设置图片路径
                    .cropper(options)        // 重新初始化裁剪区域

            }
        });
    }


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
                // 上行代码只是把内容赋值到body一个不属于DOM对象的列表中,解构存在,但无法在页面中显示
                // 调用form.render方法,把select里的内容渲染到dd列表(属于DOM对象)
                form.render();
                // 文章分类渲染完毕后再调用,初始化form的方法
                initForm();
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
                location.href = '/article/art_list.html'
                /*setTimeout(function () {
                        window.parent.document.getElementById('art_list').click();
                 }, 1500) */
            }
        });
    }


})