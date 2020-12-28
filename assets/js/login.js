$(function () {
    // 点击再去注册按钮
    $('#link_reg').on('click',function () {
        $('.login-box').hide();
        $('.reg-box').show();
    })
    // 点击去登陆按钮
    $('#link_login').on('click', () => {
        $('.reg-box').hide();
        $('.login-box').show();
    })
})