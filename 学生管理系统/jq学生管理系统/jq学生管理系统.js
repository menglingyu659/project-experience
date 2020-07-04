(function () {
    var curPage = 1;
    var studentData = null;
    var flag = true;
    var searchFlag = 1;
    var value;
    page_rander()
    bindEvent()


    function bindEvent() {
        // 左边样式事件对应右边样式事件

        $('dl').on('click', 'dd', function (e) {
            var $Active = $('.active'),
                $this = $(this);
            $Active.removeClass('active');
            $this.addClass('active');
            $('.block').slideUp(500).removeClass('block');
            $('.' + $this.data('id')).slideDown(500).addClass('block');
        })
        //添加学生提交事件
        $('#sub').on('click', function (e) {
            addStu();
            // event.preventDefault();
            return false;
        })

        //编辑按钮点击事件
        $('.id').on('click', '.edit', function () {
            $('.mask').slideDown(300);
            var index = $(this).data('index'),
                mask_form = $('.mask_form')[0],
                s_index = studentData[index];
            console.log(s_index)

            for (var prop in s_index) {
                console.log(prop, mask_form[prop])
                if (mask_form[prop]) {
                    mask_form[prop].value = s_index[prop];
                }
            }
        })
        //遮罩层消失事件
        $('.mask').on('click', function () {
            $(this).slideUp(300);
        })
        $('.mask_form').on('click', function () {
            event.stopPropagation();
        })

        //修改学生提交事件
        $('.mask_sub').on('click', function () {
            changeStu();
            return false;
        })
        //删除学生
        $('.id').on('click', '.del', function () {
            if (!confirm('是否确定删除？')) {
                return false;
            }
            deleteStu($(this).data('index'));
        })
        //搜索渲染表格提交事件并且
        //取消header——wrap默认事件
        $('.search_btn').on('click', function () {
            value = $('#search').val();
            curPage = 1;
            flag = true;
            search_rander();
            $('dd').eq(0).trigger('click');
            return false;
        })
    }


    function studentDatafn(formD) {
        var student = {};
        var formArr = formD.serializeArray();
        console.log(formArr)
        formArr.forEach(function (ele, index) {
            student[ele.name] = ele.value;
        });
        return student;
    }
    //搜索筛选and渲染表格
    function search_rander() {
        if (value === '') {
            page_rander();
            return
        }
        method('/api/student/searchStudent', {
            appkey: '1305939527_1551688654204',
            sex: -1,
            search: value,
            page: curPage,
            size: 10
        }, function (data) {
            var data = data.data;
            studentData = data.searchList;
            randerForm(studentData)
            $('.id').turnPage({
                curPage: curPage,
                allPage: Math.ceil(data.cont / 10),
                callback: function (params) {
                    curPage = params;
                    search_rander();
                }
            })
        })
    }

    //用页数渲染表格
    function page_rander() {
        if (flag) {
            curPage = 1;
            flag = false;
        };
        method('/api/student/findByPage', {
            size: 10,
            page: curPage,
            appkey: '1305939527_1551688654204'
        }, function (data) {
            var data = data.data;
            studentData = data.findByPage;
            randerForm(studentData);
            $('.id').turnPage({
                curPage: curPage,
                allPage: Math.ceil(data.cont / 10),
                callback: function (params) {
                    curPage = params;
                    page_rander();
                }
            })
        })
    }
    //渲染表格的总函数
    function randerForm(studentData) {

        var str = '';
        studentData.forEach(function (ele, index) {
            str += '<div class="right_tab">\
                <div class="box1">姓名：<span>' + ele.name + '</span></div>\
                <div class="box1">性别：<span>' + (ele.sex ? '女' : '男') + '</span></div>\
                <div class="box1">学号：<span>' + ele.sNo + '</span></div>\
                <div class="box1">邮箱：<span>' + ele.email + '</span></div>\
                <div class="box1">出生年：<span>' + ele.birth + '</span></div>\
                <div class="box1">电话：<span>' + ele.phone + '</span></div>\
                <div class="box1">地址：<span>' + ele.address + '</span></div>\
                <div class="box1">\
                    <button class="edit" data-index =' + index + '>编辑</button>\
                    <button class="del"  data-index =' + index + '>删除</button>\
                </div>\
            </div>'
        });
        $('.id').html(str);

    }
    //添加学生

    function addStu() {
        var obj = Object.assign({
            appkey: '1305939527_1551688654204'
        }, studentDatafn($('.form')));
        console.log(obj)
        method('api/student/addStudent', obj, function () {
            alert('添加成功');
            page_rander();
            location.reload();
            // $('dd').eq(0).trigger('click');
            // $('.form')[0].reset();
        })
    }

    //修改学生
    function changeStu() {
        var obj1 = Object.assign({
            appkey: '1305939527_1551688654204'
        }, studentDatafn($('.mask_form')));
        method('api/student/updateStudent', obj1, function () {
            alert('修改成功');
            flag ? search_rander() : page_rander();
            $('dd').eq(0).trigger('click');

            $('.mask').slideUp(300)
        })
    }


    //删除学生
    function deleteStu(index) {
        var sIndex = studentData[index];
        method('api/student/delBySno', {
            appkey: '1305939527_1551688654204',
            sNo: sIndex.sNo
        }, function () {
            page_rander();
            $('dd').eq(0).trigger('click');

            alert('删除成功');
        })
    }

    function method(api, data, callback) {
        $.ajax({
            url: 'http://api.duyiedu.com/' + api,
            type: 'GET',
            data: data,
            dataType: 'json'
        }).then(function (data) {
            if (data.status === 'success') {
                callback(data)
            } else if (data.status === 'fail') {
                alert(data.msg)
            }
        })
    }










}())