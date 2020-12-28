$(function () {
  // 点击再去注册按钮
  $("#link_reg").on("click", function () {
    $(".login-box").hide();
    $(".reg-box").show();
  });
  // 点击去登陆按钮
  $("#link_login").on("click", () => {
    $(".reg-box").hide();
    $(".login-box").show();
  });

  // 得到form模块对象
  // let form = layui.form;
  // let layer = layui.layer;
  let { form, layer } = layui;
  // 通过form.verify（）函数自定义校验规则
  form.verify({
    // 自定义了一个叫做 pwd 校验规则
    pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
    // 校验两次密码是否一致的规则
    repwd: function (value) {
      // 通过形参拿到的是确认密码框中的内容
      // 还需要拿到密码框中的内容
      // 然后进行一次等于的判断
      // 如果判断失败,则return一个提示消息即可
      var pwd = $(".reg-box [name=password]").val();
      if (pwd !== value) {
        return "两次密码不一致！";
      }
    },
  });

  // 监听注册表单的提交事件
  $("#form_reg").on("submit", function (e) {
    // 1. 阻止默认的提交行为
    e.preventDefault();
    // 2. 发起Ajax的POST请求
    // var data = {
    //   username: $('#form_reg [name=username]').val(),
    //   password: $('#form_reg [name=password]').val()
    // }
    // $.post('http://ajax.frontend.itheima.net/api/reguser', data, function(res) {
    //     if (res.status !== 0) {
    //       return layer.msg(res.message)
    //     }
    //  layer.msg('注册成功，请登录！')
    //     // 模拟人的点击行为
    //     $('#link_login').click()
    // })

    $.ajax({
      url: "/api/reguser",
      method: "POST",
      data: {
        username: $("#form_reg [name=username]").val(),
        password: $("#form_reg [name=password]").val(),
      },
      success: function (res) {
        if (res.stutas !== 0) {
          layer.msg(res.message || "注册失败");
          return;
        }
        layer.msg(res.message || "注册成功");
        // 模拟人的点击行为
        $("#link_login").click();
      },
    });
  });
//   // 监听登录表单的提交事件
//   $("#form_login").submit(function (e) {
//     // 阻止默认提交行为
//     e.preventDefault();
//     $.ajax({
//       url: "http://ajax.frontend.itheima.net/api/login",
//       method: "POST",
//       // 快速获取表单中的数据
//       data: $(this).serialize(),
//       success: function (res) {
//         if (res.status !== 0) {
//           return layer.msg("登录失败！");
//         }
//         layer.msg("登录成功！");
//         // 将登录成功得到的 token 字符串，保存到 localStorage 中
//         localStorage.setItem("token", res.token);
//         // 跳转到后台主页
//         location.href = "/index.html";
//       },
//     });
//   });

  $("#form_login").submit(function (e) {
    // 阻止默认提交行为
    e.preventDefault();
    $.ajax({
      url: "/api/login",
      method: "POST",
      // 快速获取表单中的书库
      data: $(this).serialize(),
      success: (res) => {
        if (res.status !== 0) {
          return layer.msg("登陆失败!");
        }
        layer.msg("登陆成功！");
        // 将登陆成功的得到的token 字符串，保存到localStorage中
        localStorage.setItem("token", res.token);
        // 跳转到后台主页
        location.href = "/index.html";
      },
    });
  });
});
