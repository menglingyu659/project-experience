var pieObj = (function () {
    var o = {
        init: function () {
            this.legendData = [];
            this.seriesData = [];
            this.ajax();
        },
        // resize: function () {
        //     var self = this;
        //     $(window).resize(function (e) {
        //         // console.log(e)
        //         if (document.body.offsetWidth == 1255) {
        //             // console.log(135454)
        //             self.init();
        //         }
        //     })
        // },
        ajax: function () {
            var self = this;
            $.ajax({
                url: 'http://api.duyiedu.com/api/student/findAll',
                type: 'GET',
                data: {
                    appkey: '1305939527_1551688654204'
                },
                dataType: 'json'
            }).then(function (data) {
                self.studentData = data.data;
                var studentData = data.data;
                getAreaData(studentData);
                getSexData(studentData);
            })

            function getAreaData(studentData) {
                var obj = {};
                studentData.forEach(function (ele) {
                    if (!obj[ele.address]) {
                        obj[ele.address] = 1;
                    } else {
                        obj[ele.address]++;
                    }
                });
                for (var prop in obj) {
                    var middleObj = {};
                    self.legendData.push(prop);
                    middleObj.value = obj[prop];
                    middleObj.name = prop;
                    self.seriesData.push(middleObj)
                };
                self.getData($('.areaPie')[0], '学生地区比例饼图')
                // console.log(self.legendData, self.seriesData, obj, middleObj, studentData)
            }

            function getSexData(studentData) {
                self.legendData = ['男', '女'];
                self.seriesData = [{
                    name: '男',
                    value: 0
                }, {
                    name: '女',
                    value: 0
                }]
                studentData.forEach(function (ele) {
                    ele.sex == 0 ? self.seriesData[0].value++ : self.seriesData[1].value++
                })
                self.getData($('.sexPie')[0], '学生性别比例饼图')
                // console.log(self.legendData, self.seriesData,studentData)
            }

        },
        getData: function ($Dom, title_text) {
            var myChart = echarts.init($Dom);
            var option = {
                title: {
                    text: title_text,
                    subtext: '信息参考',
                    x: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: this.legendData
                },
                series: [{
                    name: '访问来源',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: this.seriesData,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }]
            };
            myChart.setOption(option);
        }
    }



    o.init();
    // o.resize();
    return o;
}())