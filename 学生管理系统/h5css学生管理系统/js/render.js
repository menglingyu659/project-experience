var renderObj = (function () {
    obj = {
        init: function () {
            this.$W = $('.wrapper');
            this.size = 20;
            this.curPage = 1;
            this.cont = 1;
            this.flag = true;
            this.ajax(true);
            this.search();
        },
        turnPage: function (flagP) {
            var $W = this.$W,
                self = this;
            $W.find('.turn_page').empty();
            console.log(this.cont, this.size)
            $W.find('.turn_page').turnPage({
                curPage: this.curPage,
                allPage: Math.ceil(this.cont / this.size),
                callback: function (data) {
                    self.flag = false;
                    self.curPage = data;
                    flagP ? self.ajax(false) : self.search()();
                }
            })
        },
        ajax: function () {
            var self = this;
            $.ajax({
                url: 'http://api.duyiedu.com/api/student/findByPage',
                type: 'GET',
                data: {
                    appkey: '1305939527_1551688654204',
                    page: this.curPage,
                    size: this.size,
                },
                dataType: 'json',
            }).then(function (data) {
                if (data.status === 'success') {
                    var data = data.data;
                    self.studentData = data.findByPage;
                    self.cont = data.cont;
                    self.turnPage(true);
                    self.render();
                    console.log(data)
                }
            }, function (data) {
                alert(data.msg)
            })
        },
        render: function () {
            var str = '',
                self = this,
                $W = this.$W,
                studentData = self.studentData;
            studentData.forEach(function (ele, index) {
                str += ' <tr>\
                <td class="box1">姓名：<span>' + ele.name + '</span></td>\
                   <td class="box1">性别：<span>' + (ele.sex ? "女" : "男") + '</span></td>\
                   <td class="box1">学号：<span>' + ele.sNo + '</span></td>\
                   <td class="box1">邮箱：<span>' + ele.email + '</span></td>\
                   <td class="box1">出生年：<span>' + ele.birth + '</span></td>\
                   <td class="box1">电话：<span>' + ele.phone + '</span></td>\
                   <td class="box1">地址：<span>' + ele.address + '</span></td>\
                   <td class="box1">\
                       <button class="edit" data-index=' + index + '>编辑</button>\
                       <button class="del" data-index=' + index + '>删除</button>\
                   </td>\
               </tr>'
            })
            $W.find('thead').html(str)
        },
        search: function () {
            var self = this,
                $W = self.$W;
            $W.find('header').find('.search_btn').click(function () {
                self.value = $W.find('header').find('.search_text').val();
                self.curPage = 1;
                if (self.value === '') {
                    self.ajax();
                }
                ajax();
                // console.log(value)
                return false;
            })



            return ajax = function () {
                $.ajax({
                    url: 'http://api.duyiedu.com/api/student/searchStudent',
                    type: 'GET',
                    dataType: 'json',
                    data: {
                        appkey: '1305939527_1551688654204',
                        sex: -1,
                        page: self.curPage,
                        size: self.size,
                        search: self.value,
                    }
                }).then(function (data) {
                    if (data.status === 'success') {
                        console.log(data)
                        var data = data.data;
                        self.studentData = data.searchList;
                        self.cont = data.cont;
                        self.render();
                        self.turnPage(false);
                    }
                }, function (data) {
                    alert(data.msg)
                })


            }





        }





    }
    obj.init();
    return obj;



}())