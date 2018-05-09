/**
 * Created by lenovo on 2018/5/9.
 */
 //入口函数,防止发生全局变量污染
$(function () {
  $('#form').bootstrapValidator({
    //2. 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields:{
      //校验用户名，对应name表单的name属性
       username:{
         validators:{
           notEmpty:{
             message:"用户名不能为空"
           },
           stringLength:{
             min:6,
             max:20,
             message:"用户名长度必须在6-20之间"
           },
           // 专门用来配置回调校验提示信息
           callback:{
             message:"用户名不存在"
           }
         }
       },
      password:{
         validators:{
           notEmpty:{
             message:"密码不能为空"
           },
           stringLength:{
             min:6,
             max:12,
             message:"密码长度必须在6-12之间"
           },
           callback:{
             message:"密码不存在"
           }
         }
      },

    }
  });
  
  /*
   * 2 基本登录功能
   * (1) 我们想要通过 ajax 进行登录请求, 这样如果密码错误, 可以很友好的提示
   * (2) 我们又想要使用表单校验插件, 会在表单提交的时候, 进行校验
   *
   * 表单校验插件,
   * 如果在提交时校验成功了, 会自动继续提交, 需要阻止这次提交, 通过 ajax 请求
   * 如果校验失败了, 直接提示用户输入有误, 不会提交
   * */
  
  // 校验成功时, 调用
  $("#form").on('success.form.bv', function (e) {
    //阻止表单的默认提交功能
    e.preventDefault();
    
    //获取 表单元素,使用表单序列化
    var formData=$('#form').serialize()
    //发送ajax请求
    $.ajax({
      type:"post",
      url:"/employee/employeeLogin",
      data:formData,
      dataType:"json",
      success:function (info) {
        console.log(info);
        if(info.success){
          //校验成功,跳转页面
          location.href = "index.html";
         }
         if(info.error===1000){
           alert("用户名不存在");
           //获取表单验证的实例
           // 将密码框, 校验状态改成 错误状态 INVALID
           // updateStatus 三个参数
           // 参数1: 字段名称
           // 参数2: 校验状态  VALID成功  INVALID失败
           // 参数3: 校验规则(主要是用来设置, 提示信息的)
           $('#form').data("bootstrapValidator").updateStatus("username", "INVALID", "callback");
         }
         if(info.error===1001){
           alert('密码错误');
           ('#form').data("bootstrapValidator").updateStatus("password", "INVALID", "callback");
         }
      }
    })
  });
  
  
  //实现表单重置功能
  $('[type="reset"]').on('click',function () {
      $('#form').data('bootstrapValidator').resetForm(true);
  })
  
})