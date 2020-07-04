(function () {
    var obj = {
        init: function () {
            this.$W = $('.wrapper')
            this.bindEvent();
        },
        bindEvent: function () {
            var $W = this.$W
            btn();

            function btn() {
                var flag = true;
                $('.btn').on('click', function () {
                    if (flag) {
                        $('.dl_wrap').find('dl').slideDown();
                        flag = false;
                    } else {
                        $W.find('.dl_wrap').find('dl').slideUp();
                        flag = true;
                    }
                })
                $W.find('header').find('.dl_wrap').hover(function () {
                    console.log(this)
                    $W.find('header').find('.dl_wrap').find('dl').slideDown();
                    flag = false;
                }, function () {
                    $W.find('header').find('.dl_wrap').find('dl').slideUp();
                    flag = true;

                })
            }
        }
    }



    obj.init();
}())