(function () {


    function Turnpage(params) {
        this.wrap = params.wrap;
        this.callback = params.callback || function () {};
        this.allPage = params.allPage || 1;
        this.curPage = params.curPage || 1;
        this.sW = $('<div class="sW"></div>');
        this.randerPage();
    }

    Turnpage.prototype.randerPage = function () {
        this.sW.empty();
        var $Ul = $('<ul class="pageWrap"></ul>');
        var curPage = this.curPage;
        $Ul.append($('<li class="prev_page">上一页</li>'));
        $Ul.append($('<li>1</li>').addClass( (curPage === 1 ? 'self_active' : 'self_num') ));

        if (curPage - 1 > 3) {
            $Ul.append($('<li>...</li>'));
        }

        for (var i = curPage - 2; this.allPage !== 1 && i < curPage + 3; i++) {
            if (i > 1 && i < this.allPage) {
                $Ul.append($('<li class=' + (i === curPage ? '"self_active self_num"' : 'self_num') + '>' + i + '</li>'));
            }
        }
        if (this.allPage - curPage > 2) {
            $Ul.append($('<li>...</li>'));
        }
        this.allPage !== 1 && $Ul.append($('<li>' + this.allPage + '</li>').addClass( (curPage === this.allPage ? 'self_active' : 'self_num') ) );
        $Ul.append($('<li class="next_page">下一页</li>'));
        this.sW.append($Ul);
        this.wrap.append(this.sW)
        // console.log(this, this.wrap)
        this.bindEvent();
    }

    Turnpage.prototype.bindEvent = function () {
        var self = this;
        this.wrap.find('.prev_page').on('click', function () {
            console.log(132)

            self.curPage === 1 ? self.curPage = self.allPage : self.curPage --;
            self.randerPage();
            self.callback(self.curPage);
        })
        this.wrap.find('.next_page').on('click', function () {
            console.log(132)
            self.curPage === self.allPage ? self.curPage = 1 : self.curPage ++;
            self.randerPage();
            self.callback(self.curPage);
        })

        this.wrap.find('.pageWrap').on('click', '.self_num', function () {
            console.log(132)

            self.curPage = parseInt($(this).text());
            self.randerPage();
            self.callback(self.curPage);
        })
    }





    $.fn.extend({
        turnPage: function (options) {
            options.wrap = this;
            new Turnpage(options)
            return this;
        }
    })

}())