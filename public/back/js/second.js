/**
 * Created by lenovo on 2018/5/11.
 */
$(function () {
   //1.发送ajax请求,获取数据,渲染到页面上
    
  var  currentPage=1;
  var pageSize=5;
  //2进入页面,就调用方法,渲染页面
    render();
    function render() {
      //发送ajax请求
      $.ajax({
        url:'/category/querySecondCategoryPaging',
        type:'get',
        data:{
          page:currentPage,
          pageSize:pageSize
        },
        success:function (info) {
           // console.log(info);
           //将模板和数据组合起来
          var htmlStr=template('secondTmp',info);
          //添加到页面
           $('.lt_content tbody').html(htmlStr);
           //配置分页标签
           $('.paginator').bootstrapPaginator({
             bootstrapMajorVersion:3,
             //配置当前页
             currentPage:currentPage,
             //总页数
             totalPages:Math.ceil(info.total/info.size),
             //注册标签页的点击事件
             onPageClicked:function (a,b,c,page) {
               //更新当前页
               currentPage=page;
               //重新渲染页面
               render();
             }
           })
        }
      })
    }
    
    //3点击添加分类按钮,显示模态框
    $('#addBtn').click(function () {
       //显示模态框
       $('#addModal').modal('show');
       
       //发送ajax请求,获取一级列表的条数
      $.ajax({
        type: "GET",
        url: "/category/queryTopCategoryPaging",
        // 这里为了模拟一个接口, 可以获取所有的一级分类, page: 1, pageSize: 100
        data: {
          page: 1,
          pageSize: 100
        },
        success: function( info ) {
          console.log( info );
          var htmlStr = template("dropdownTpl", info);
          // 渲染到下拉框中
          $('.dropdown-menu').html( htmlStr );
        }
      })
    })
   //4.通过下拉框进行事件委托,给所有a绑定点击事件
  $('.dropdown-menu').on('click','a',function () {
      //点击,获取当前的文本
       var txt=$(this).text();
       //设置文本
    $('#dropdownText').text(txt);
  })
})