$(function () {
    // 为art-template定义时间过滤器
    template.defaults.imports.dateFormat = function (dtStr) {
        let dt = new Date(dtStr)

        let y = dt.getFullYear()
        let m = padZero(dt.getMonth() + 1)
        let d = padZero(dt.getUTCDate())

        let hh = padZero(dt.getUTCHours())
        let mm = padZero(dt.getUTCMinutes())
        let ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss

        // 在个位数的左侧填充0
        function padZero(n) {
            return n > 9 ? n : '0' + n
        }
    }
    // 1.定义提交参数
    let q = {
        pagenum: 1,     	//是	int	页码值
        pagesize: 2,     	//是	int	每页显示多少条数据
        cate_id: '',     	//否	string	文章分类的 Id
        state: '',      //否	string	文章的状态，可选值有：已发布、草稿
    }


    // 2.初始化文章列表
    let layer = layui.layer;
    // 调用函数
    initTable();

    // 封装函数
    function initTable() {
        $.ajax({
            type: 'GET',
            url: '/my/article/list',
            data: q,
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg("文章列表渲染失败!")
                }
                let htmlStr = template('tpl-table', { data: res.data })
                $('tbody').html(htmlStr)
                // 调用分页
                renderPage(res.total);
            }
        });
    }


    // 调用函数
    initCate()
    // 3.封装函数
    let form = layui.form;
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
                let htmlStr = template('tpl-cate', { data: res.data })
                $("[name=cate_id]").html(htmlStr)
                form.render();
            }
        });
    }

    // 4.筛选功能
    $('#form-search').on('submit', function (e) {
        // console.log(111);
        e.preventDefault();

        // 获取
        let state = $('[name=state]').val();
        let cate_id = $('[name=cate_id]').val();
        // 赋值
        q.cate_id = cate_id
        q.state = state

        // 初始化文章列表
        initTable();
    })

    // 5.分页
    let layPage = layui.laypage
    function renderPage(total) {
        // console.log(total);

        // 执行一个laypage实例
        layPage.render({
            elem: 'pageBox',     //ID ,不加#
            count: total,       //数据总数,从服务器端得到
            limit: q.pagesize,  //每页几条
            curr: q.pagenum,    //第几页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function (obj, first) {
                if (!first) {
                    // 页码值赋值给q.pageNum
                    q.pagenum = obj.curr
                    // 每页条数选项赋值给q.pagesize,
                    q.pagesize = obj.limit
                    // 刷新列表
                    initTable();
                }

            }

        })
    }

    // 6. 删除
    $('tbody').on('click', '.btn-delete', function (index) {
        console.log(111);
        let Id = $(this).attr('data-id');

        $.ajax({
            url: '/my/article/delete/' + Id,
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                // 成功,渲染页面
                layer.msg("恭喜您,删除成功!");
                if ($('.btn_delete').length == 1 && q.pagenum > 1) q.pagenum--;
                initTable()
            }
        });
        layer.close(index)
    })



})