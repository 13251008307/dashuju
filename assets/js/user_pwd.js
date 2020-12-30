$(function() {
    var form = layui.form
  
    form.verify({
      pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
      samePwd: function(value) {
        if (value === $('[name=oldPwd]').val()) {
          return '新旧密码不能相同！'
        }
        },
      // 记得起去HTML中为密码框分别添加对应的校验规则
      rePwd: function(value) {
        if (value !== $('[name=newPwd]').val()) {
          return '两次密码不一致！'
        }
      }
    })




//     - 给form表单绑定 submit 事件，在事件处理函数里面取消默认行为
// - 查阅接口文档，利用 `$.ajax()` 来发送 `post` 请求
// - 利用 `$(this).serialize()` 来设置提交的数据
// - 如果 服务器返回的 `status` 不等于0，说明失败，利用 l`ayui.layer.msg` 来进行提示
// - 如果更新成功，重置一下表单内容
$('.layui-form').on('submit', function(e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/updatepwd',
      data: $(this).serialize(),
      success: function(res) {
        if (res.status !== 0) {
          return layui.layer.msg('更新密码失败！')
        }
        layui.layer.msg('更新密码成功！')
        // 重置表单
        $('.layui-form')[0].reset()
      }
    })
  })
  })