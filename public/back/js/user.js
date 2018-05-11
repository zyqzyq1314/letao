/**
 * Created by lenovo on 2018/5/11.
 */
 
//1发送ajax请求,渲染数据到页面,且配置分页插件
   $(function () {
      //当前页
     var currentPage=1;
     //每一页条数
     var pageSize=5;
     
     //已进入页面就徐璈发送请求,渲染页面
     render();
     function render() {
       // 向后台发送ajax请求,获取用户,渲染到页面上
       $.ajax({
         type:'get',
         url:"/user/queryUser",
         data:{
           page:currentPage,
           pageSize:pageSize
         },
         dataType:'json',
         success:function (info) {
           console.log(info);
           //将数据和模板进行组装
           var htmlStr=template('tmp',info);
           //将数据渲染到页面上
           $('.lt_content tbody').html(htmlStr);
           //   配置分页插件
           $('.Paginator').bootstrapPaginator({
             //修改插件的版本
             bootstrapMajorVersion:3,
             currentPage:info.page,
             //  求出总页数
             totalPages:Math.ceil(info.total/info.size),
             //设置分页按钮的点击事件,点击切换对应的数据
             // 页码点击事件
             // type 可以标记按钮的功能类型
             // page 表示将要渲染的页码
             onPageClicked:function (a,b,type,page) {
                //更新当前页
                 currentPage=page;
                 render();
             }
        
           })
         }
       })
     }
     
     // 2. 点击启用禁用按钮, 显示模态框, 通过事件委托做
     $('.lt_content tbody').on('click','.btn',function () {
       //让模态框显示出来
       $('#userModal').modal('show');
       //获取当前操作元素的id,然后通过状态来判断应该禁用还是启用
       // 用户id, 以data- 开头的自定义属性, 可以直接 data("id") 就可以获取
       var id = $(this).parent().data("id");
       //修改isDelete的值
       var isDelete=$(this).hasClass('btn-success') ? 1:0;
       //点击模态框的确定按钮,然后根据isDelete改变按钮状态
       // 添加点击事件, 让某个用户启用禁用, 说白了, 就是重复注册了
       // 之前注册的还存在, 导致代码重复执行了
       // 通过 off() 可以将之前重复注册的事件移除, 再进行事件绑定, 可以保证只有一个事件绑定了
       $('#submitBtn').off().click(function () {
         //点击发送ajax请求,设置按钮状态
         $.ajax({
           type:'post',
           url:"/user/updateUser",
           data:{
             id:id,
             isDelete:isDelete
           },
           success:function (info) {
             $('#userModal').modal('hide');
             //重新渲染页面
             render();
           }
        
         })
       })
     })
   })
   
   

