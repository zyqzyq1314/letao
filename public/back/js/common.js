/**
 * Created by lenovo on 2018/5/9.
 */


//进度条功能
$(function () {

// 希望效果是, 每次ajax提交, 产生进度条, ajax完成, 结束进度条
  /*
   * ajax 全局事件
   *   ajaxComplete 只要请求完成就调用 (不管成功或者失败)
   *   ajaxError 请求失败时调用
   *   ajaxSuccess 请求成功时调用
   *
   *   ajaxSend  请求发送时调用
   *
   *   ajaxStart  第一个ajax开始发送的时候调用
   *   ajaxStop   最后一个ajax结束时调用
   * */
// 禁用进度环
  NProgress.configure({ showSpinner: false });
  
  $(document).ajaxStart(function () {
    //开启进度条
    NProgress.start();
  })
  $(document).ajaxStop(function() {
    // 模拟网络环境
    setTimeout(function() {
      // 结束进度条
      NProgress.done();
    }, 1000);
  });
  
  // 在一进入页面进行登录状态获取
// 如果后端响应头中设置了 Content-Type: application/json
// jquery 会自动识别, 将返回数据类型, 当成json字符串解析成对象
  if ( location.href.indexOf("login.html") === -1 ) {
    $.ajax({
      url: "/employee/checkRootLogin",
      type: "get",
      success: function( info ) {
        console.log( info )
        if ( info.success ) {
          console.log( "登陆了" );
          // 啥也不用干
        }
        
        if ( info.error === 400 ) {
          // 进行拦截, 拦截到登录页
          location.href = "login.html";
        }
      }
    })
  }

})


$(function () {
  // 1. 二级分类切换功能
  $('.category').click(function() {
    $(this).next().stop().slideToggle();
  });
  //2. 菜单栏点击消失,出现
    $('.icon-menu').on('click',function () {
        $('.lt_aside').toggleClass('toggle');
        $('.lt_topbar').toggleClass('toggle');
        $('.lt_main').toggleClass('toggle');
    })
  //点击推出按钮,显示推出模态框
  $('.icon-logout').on('click',function () {
    $('#logoutModal').modal('show');
  })
  //当点击推出按钮时,发送ajax请求,退出出登录
   $('#logoutBtn').on('click',function () {
     console.log(1111);
      $.ajax({
        type:'get',
        url:'/employee/employeeLogout',
         dataType:'json',
          success:function (info) {
            // console.log(info);
            if(info.success){
              location.href="login.html";
            }
          }
      })
   })
})