var oDl = document.getElementsByTagName('dl')[0],
    edit = document.getElementsByClassName('edit')[0],
    mask_form_right = document.getElementsByClassName('mask_form_right')[0],
    right = document.getElementsByClassName('right')[0],
    sub = document.getElementsByClassName('sub')[0],
    mask_sub = document.getElementsByClassName('sub')[1],
    id = document.getElementsByClassName('id')[0],
    mask = document.getElementsByClassName('mask')[0],
    dData;





init();

function init() {
    randerForm();
    bindEvent();

}

function bindEvent() {
    // 左边样式事件
    oDl.onclick = function () {
        var event = event || window.event,
            target = event.target || event.srcElement;
        if (target.tagName === 'DD') {
            initList(target);
            block(target)
        }
    };
    // 遮罩层事件 编辑事件
    right.onclick = function () {
        var event = event || window.event,
            target = event.target || event.srcElement;
        if (target.classList.contains('edit')) {
            mask.style.display = 'block'
            var index = target.getAttribute('data-index');
            var mask_form = document.getElementsByClassName('mask_form')[0];
            // console.log(index)
            // console.log(dData[index])
            for (var prop in dData[index]) {
                if (mask_form[prop]) {
                    mask_form[prop].value = dData[index][prop]
                    // console.log(mask_form[prop])
                    // console.log(dData[index])
                    // console.log(prop)
                }
            }

        } else if (target.classList.contains('del')) {
            var t = window.confirm('确认删除？')
            if (!t) {
                return false
            } else {
                var index1 = target.getAttribute('data-index')
                var result = saveData('http://api.duyiedu.com/api/student/delBySno', {
                    appkey: '1305939527_1551688654204',
                    sNo: dData[index1].sNo
                });
                if (result.status === 'success') {
                    alert('删除成功');
                    randerForm()
                } else {
                    alert(result.msg)
                }
                console.log(result)
            }
        }

    };


    //编辑学生
    mask_sub.onclick = function () {
        event.preventDefault();
        var mask_form = document.getElementsByClassName('mask_form')[0];
        var obj1 = Object.assign({
            appkey: '1305939527_1551688654204'
        }, studentData(mask_form))
        var changeStudent = saveData('http://api.duyiedu.com/api/student/updateStudent', obj1);
        if (changeStudent.status === 'fail') {
            alert(changeStudent.msg);
            return false;
        }
        alert('修改成功');
        mask.style.display = 'none';
        randerForm();
        // console.log(changeStudent)
    };


    mask.onclick = function () {
        mask.style.display = 'none'
    };


    mask_form_right.onclick = function () {
        if (event.stopPropagation) {
            event.stopPropagation()
        } else {
            event.cancelBubble = true;
        }
    };
    // 删除事件

    //添加学生and绘制表格
    sub.onclick = function () {
        // event.preventDefault();
        var form = document.getElementsByClassName('form')[0];
        var obj = Object.assign({
            appkey: '1305939527_1551688654204'
        }, studentData(form))
        console.log(obj)
        var addStudentData = saveData('http://api.duyiedu.com/api/student/addStudent', obj);
        if (addStudentData.status === 'fail') {
            alert(addStudentData.msg)
            return false;
        }
        console.log(addStudentData)
        alert('添加成功');
        randerForm();
    }

}

function initList(dom) {
    document.getElementsByClassName('active')[0].classList.remove('active');
    dom.classList.add('active');
}

function block(dom) {
    var className = dom.getAttribute('data');
    document.getElementsByClassName('block')[0].classList.remove('block');
    document.getElementsByClassName(className)[0].classList.add('block')
}

function saveData(url, param) {
    var result = null;
    var xhr = null;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    if (typeof param == 'string') {
        xhr.open('GET', url + '?' + param, false);
    } else if (typeof param == 'object') {
        var str = "";
        for (var prop in param) {
            str += prop + '=' + param[prop] + '&';
        }
        xhr.open('GET', url + '?' + str, false);
    } else {
        xhr.open('GET', url + '?' + param.toString(), false);
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                result = JSON.parse(xhr.responseText);
            }
        }
    };
    xhr.send();
    return result;
}



function studentData(formD) {
    var name = formD.name.value;
    var sex = formD.sex.value;
    var sNo = formD.sNo.value;
    var email = formD.email.value;
    var birth = formD.birth.value;
    var phone = formD.phone.value;
    var address = formD.address.value;
    var student = {
        name: name,
        sex: sex,
        sNo: sNo,
        email: email,
        birth: birth,
        phone: phone,
        address: address,
    }
    return student;
}

function randerForm() {
    var findStudent = saveData('http://api.duyiedu.com/api/student/findAll', 'appkey=1305939527_1551688654204');
    var str = ''
    if (findStudent.status === 'fail') {
        alert(findStudent.msg);
        return false;
    }
    var findStudentData = findStudent.data;
    dData = findStudent.data;
    for (var i = 0; i < findStudentData.length; i++) {
        var sData = findStudentData[i],
            cSex = (sData.sex ? '女' : '男')
        str += '<div class="right_tab">\
                    <div class="box1">姓名：<span>' + sData.name + '</span></div>\
                    <div class="box1">性别：<span>' + cSex + '</span></div>\
                    <div class="box1">学号：<span>' + sData.sNo + '</span></div>\
                    <div class="box1">邮箱：<span>' + sData.email + '</span></div>\
                    <div class="box1">出生年：<span>' + sData.birth + '</span></div>\
                    <div class="box1">电话：<span>' + sData.phone + '</span></div>\
                    <div class="box1">地址：<span>' + sData.address + '</span></div>\
                    <div class="box1">\
                        <button class="edit" data-index =' + i + '>编辑</button>\
                        <button class="del"  data-index =' + i + '>删除</button>\
                    </div>\
                </div>'
    }
    id.innerHTML = str
}