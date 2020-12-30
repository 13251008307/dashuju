$(function () {
  const { form, layer } = layui;

  form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return "昵称长度必须在 1 ~ 6 个字符之间！";
      }
    },
  });
  initUserInfo();
  // 初始化用户的基本信息
  function initUserInfo() {
    $.ajax({
      method: "GET",
      url: "/my/userinfo",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取用户信息失败！");
        }
        console.log(res);
        //获取对应的form表单，并从远程数据库中调取对应的登录信息
        form.val("formUserInfo", res.data);
      },
    });
  }
  // 重置表单的数据
  // 给重置按钮设置点击事件
    $("#btnReset").on("click", function (e)  {
     
    e.preventDefault();
    initUserInfo();
  });
    
    // 监听表单提交事件
    $('.layui-form').on('submit', function (e) {
        // 阻止表单默认事件
        console.log(1);
        e.preventDefault();
        // 发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            // 获取远程数据中的值
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！')
                };
                layer.msg('更新用户信息成功！')
                // 调用父页面中的方法，重新渲染用户的头像和用户的信息
                window.parent.getUserInfo();
                
            }
        })
    })




})
