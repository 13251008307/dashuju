$(() => {
  const form = layui.form;
  const laypage = layui.laypage;
  // 定义一个查询的参数对象，将来请求数据的时候，
  // 需要将请求参数对象提交到服务器
  const q = {
    pagenum: 1, // 页码值，默认请求第一页的数据
    pagesize: 2, // 每页显示几条数据，默认每页显示2条
    cate_id: "", // 文章分类的 Id
    state: "", // 文章的发布状态
  };

  // 通过 `template.defaults.imports` 定义过滤器
  // 定义美化时间的过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date);

    var y = dt.getFullYear();
    var m = padZero(dt.getMonth() + 1);
    var d = padZero(dt.getDate());

    var hh = padZero(dt.getHours());
    var mm = padZero(dt.getMinutes());
    var ss = padZero(dt.getSeconds());

    return "${}-${}-${}  ${}:${}:${}";
  };
  // 定义补零的函数
  function padZero(n) {
    return n > 9 ? n : "0" + n;
  }

  //调用执行甘薯
  initTable();
  initCate();
  // 获取文章列表数据的方法
  function initTable() {
    $.ajax({
      method: "GET",
      url: "/my/article/list",
      data: q,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取文章列表失败！");
        }
        // 使用模板引擎渲染页面的数据
        var htmlStr = template("tpl-table", res);
        $("tbody").html(htmlStr);
        renderPage(res.total);
      },
    });
  }
  // 初始化文章分类的方法
  function initCate() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取分类数据失败！");
        }
        // 调用模板引擎渲染分类的可选项
        var htmlStr = template("tpl-cate", res);
        // console.log(html(htmlStr));
        $("[name=cate_id]").html(htmlStr);
        // 通过 layui 重新渲染表单区域的UI结构
        form.render();
      },
    });
  }

  //   - 需要先绑定表单的 `submit` 事件
  //   - 在事件里面获取到表单中选中的值
  //   - 然后把这个值同步到我们 参数对象 `q` 里面
  //   - 再次调用 `initTable()` 方法即可

  $("#form-search").on("submit", function (e) {
    e.preventDefault();
    // 获取表单中选中项的值
    var cate_id = $("[name=cate_id]").val();
    var state = $("[name=state]").val();
    // 为查询参数对象 q 中对应的属性赋值
    q.cate_id = cate_id;
    q.state = state;
    // 根据最新的筛选条件，重新渲染表格的数据
    initTable();
  });

  //   定义渲染分页的方法，接收一个总数量的参数
  function renderPage(total) {
    // console.log(total)
    //执行一个laypage实例
    laypage.render({
      elem: "pagBox", //注意，这里的 test1 是 ID，不用加 # 号
      count: total, //数据总数，从服务端得到
      limit: q.pagesize,
      curr: q.pagenum,
      // 顺序很重要
      layout: ["count", "limit", "prev", "page", "next", "skip"],
      limits: [2, 3, 5, 10],
      //   分页发生切换时，触发jump回调
      jump: function (obj, first) {
        // 把最新的页码值，赋值到q这个查询参数对象中
        // console.log(obj.curr);
        // 把最新的页码值，赋值到 q 这个查询参数对象中
        // console.log(first);
        q.pagenum = obj.curr;
        q.pagesize = obj.limit;
        // 根据最新的 q 获取对应的数据列表，并渲染表格
        if (!first) {
          initTable();
        }
      },
    });
  }

  // - 弹出确认取消框提示用户
  // - 用户点击确认，发送请求，删除当前文章，携带文章`id`
  // - 请求成功之后，获取最新的文章列表信息
  // - 关闭当前弹出层
  //   为删除按钮绑定点击事件处理函数
  $("tbody").on("click", ".btn-delete", function () {
      const len = $('btn-delete').length;
    // 获取到文章的 id
    var id = $(this).attr("data-id");
    // 询问用户是否要删除数据
    layer.confirm("确认删除?", { icon: 3, title: "提示" }, function (index) {
      $.ajax({
        method: "GET",
        url: "/my/article/delete/" + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg("删除文章失败！");
          }
          layer.msg("删除文章成功！");
          // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
          // 如果没有剩余的数据了,则让页码值 -1 之后,
          // 再重新调用 initTable 方法
          // 4
          if (len === 1) {
            // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
            // 页码值最小必须是 1
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
          }
          initTable();
        },
      });

      layer.close(index);
    });
  });
});
