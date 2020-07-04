(function () {
    location.hash = 'student_list';
    var obj = {
        init: function () {
            this.$W = $('.wrapper');
            this.bindEvent();
            this.editStudent();
        },
        bindEvent: function () {
            var $W = this.$W,
                self = this;
            // 添加学生点击提交事件
            $W.find('.add_student').find('.sub').click(function () {
                self.addStudent();
                return false;
            })
            $W.find('aside').find('dd').click(function () {
                $('.active').removeClass('active')
                $(this).addClass('active');
                var hash = $(this).attr('data-hash');
                console.log($(this).attr('data-hash'));
                location.hash = hash;
                ($(this)[0] === $W.find('aside').find('dd')[0] && renderObj.ajax());
            })
            //删除点击事件
            $W.find('section').find('thead').on('click', '.del', function () {
                self.deleteStudent($(this));
            })
        },
        addStudent: function () {
            var self = this,
                $W = this.$W;
            $.ajax({
                url: 'http://api.duyiedu.com/api/student/addStudent',
                type: 'GET',
                dataType: 'json',
                data: Object.assign({
                    appkey: '1305939527_1551688654204'
                }, self.student($W.find('.add_student').find('.form')))
            }).then(function (data) {
                console.log(data)
                if (data.status === 'success') {
                    alert('添加成功~')
                    $W.find('aside').find('dd').eq(0).trigger('click');
                }
            }, function (data) {
                alert(data.msg)
            })

        },
        student: function ($form) {
            var $W = this.$W;
            var student = {};
            var arr = $form.serializeArray();
            arr.forEach(function (ele) {
                student[ele.name] = ele.value;
            })
            return student;
        },
        editStudent: function () {
            var $W = this.$W,
                self = this;
            $W.find('section').find('thead').on('click', '.edit', function () {
                console.log(this);
                var obj = renderObj.studentData[$(this).parents('tr').index()];
                var form = $('.mask').slideDown().find('.mask_form_right').find('.mask_form')[0];
                console.log(obj.sNo);
                for (var prop in obj) {
                    form[prop] && (form[prop].value = obj[prop]);
                }
            })
            $('.mask').click(function () {
                $(this).slideUp();
            })

            $('.mask').find('.mask_form_right').click(function () {
                event.stopPropagation();
            })
            //编辑学生点击提交事件
            $('.mask').find('.mask_sub').click(function () {
                $.ajax({
                    url: 'http://api.duyiedu.com/api/student/updateStudent',
                    type: 'GET',
                    dataType: 'json',
                    data: Object.assign({
                        appkey: '1305939527_1551688654204'
                    }, self.student($('.mask').find('.mask_form')))
                }).then(function (data) {
                    if (data.status === 'success') {
                        console.log(data)
                        alert('修改成功！');
                        $('.mask').slideUp();
                        $W.find('aside').find('dd').eq(0).trigger('click');
                    }
                }, function (data) {
                    alert(data.msg)
                })
                return false;
            })


        },
        deleteStudent: function ($this) {
            var $W = this.$W;
            $.ajax({
                url: 'http://api.duyiedu.com/api/student/delBySno',
                type: 'GET',
                dataType: 'json',
                data: {
                    appkey: '1305939527_1551688654204',
                    sNo: renderObj.studentData[$this.parents('tr').index()].sNo,
                }
            }).then(function (data) {
                if (data.status === 'success') {
                    if (window.confirm('是否确定删除？？？')) {
                        alert('删除成功');
                        $W.find('aside').find('dd').eq(0).trigger('click');
                    }
                }
            }, function (data) {
                alert(data.msg)
            })
        },
        







    }










    obj.init();
}())