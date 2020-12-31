// $(() => {
//   initArtCateList();
//   function initArtCateList() {
//     $.ajax({
//       method: "GET",
//       url: "/my/article/cates",
//       success: (res) => {
//         // 模板引擎
//         var htmlStr = template("tpl-table", res);
//         $("tbody").html(htmlStr);
//       },
//     });
//   }
// });
$(function () {
var layer = layui.layer;
  initArtCateList();
  const form = layui.form;
  //   indexEdit();
  function initArtCateList() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        var htmlStr = template("tpl-table", res);
        $("tbody").html(htmlStr);
      },
    });
  }

  // 在按钮的点击事件中，通过 `layer.open()` 展示弹出层
  // 为添加类别按钮绑定点击事件
  
  var indexAdd = null;
  $("#btnAddCate").on("click", function () {
    indexAdd = layer.open({
      // 不显示确定按钮
      type: 1,
      // 设置弹出框的宽高
      area: ["500px", "250px"],
      //   弹出提示内容
      title: "添加文章分类",
      //   弹出提示内容
      content: $("#dialog-add").html(),
    });
  });

  // 通过代理的形式，为 form-add 表单绑定 submit 事件
  $("body").on("submit", "#form-add", function (e) {
    e.preventDefault();
    $.ajax({
      method: "POST",
      url: "/my/article/addcates",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("新增分类失败！");
        }
        initArtCateList();
        layer.msg("新增分类成功！");
        // 根据索引，关闭对应的弹出层
        layer.close(indexAdd);
      },
    });
  });

  var indexEdit = null;
  $("tbody").on("click", ".btn-edit", function () {
    // 弹出一个修改文章分类信息的层
    indexEdit = layer.open({
      type: 1,
      area: ["500px", "250px"],
      title: "修改文章分类",
      content: $("#dialog-edit").html(),
    });
    //   通过 **事件委派** 的形式，为 `btn-edit` 按钮绑定点击事件
    var id = $(this).attr("data-id");
    // 发起请求获取对应分类的数据
    $.ajax({
      method: "GET",
      url: "/my/article/cates/" + id,
      success: function (res) {
        form.val("form-edit", res.data);
      },
    });
  });

  $("body").on("submit", "#form-edit", function (e) {
    e.preventDefault();
    $.ajax({
      method: "POST",
      url: "/my/article/updatecate",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("更新分类数据失败！");
        }
        layer.msg("更新分类数据成功！");
        layer.close(indexEdit);
        initArtCateList();
      },
    });
  });

  // 通过代理的形式，为删除按钮绑定点击事件
  $('tbody').on('click', '.btn-delete', function() {
    var id = $(this).attr('data-id')
    // 提示用户是否要删除
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/' + id,
        success: function (res) {
          console.log(res);
          if (res.status !== 0) {
            return layer.msg('删除分类失败！')
          }
          layer.msg('删除分类成功！')
          layer.close(index)
          initArtCateList()
        }
      })
    })
})
});
