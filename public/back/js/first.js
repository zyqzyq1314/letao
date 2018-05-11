/**
 * Created by lenovo on 2018/5/11.
 */
$(function () {
     var currentPage=1;
     var  pageSize=5;
     
     //1发送ajax请求.获取后台数据,渲染页面
      render();
      function render() {
        $.ajax({
          url:'/category/queryTopCategoryPaging',
          type:'get',
          data:{
            page:currentPage,
            pageSize:pageSize
          },
          success:function (info) {
            // console.log(info);
            //将模板和数据组合
            var htmlStr=template('firstTmp',info);
            //将数据渲染到页面
            $('.lt_content tbody').html(htmlStr);
            //配置分页插件
            $('.paginator').bootstrapPaginator({
              //修改版本
              bootstrapMajorVersion:3,
              //设置当前页
              currentPage:info.page,
              totalPages:Math.ceil(info.total/info.size),
              //设置页数的点击事件
              onPageClicked:function (a,b,c,page) {
                //更新当前页
                currentPage=page;
                render();
              }
            })
          }
    
        })
      }
      
      
      //  2点击添加分类,显示模态框
   $('#addBtn').on('click',function () {
       //显示模态框
       $('#addModal').modal('show');
       
   })
  // 3. 进行表单校验配置
  $('#form').bootstrapValidator({
    // 指定校验时的图标显示
    feedbackIcons: {
      // 校验成功的
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    
    // 配置字段  categoryName
    fields: {
      categoryName: {
        validators: {
          // 非空校验
          notEmpty: {
            message: "请输入一级分类"
          }
        }
      }
    }
    
  });
  
  //4阻止表单的默认提交行为,使用ajax提交
    $('#form').on('success.form.bv',function (e) {
      e.preventDefault();
      $.ajax({
        url:'/category/addTopCategory',
        type:'post',
        data:$('#form').serialize(),
        success:function (info) {
          console.log(info);
           if(info.success){
             //隐藏模态框
             $('#addModal').modal('hide');
             //添加成功
               currentPage=1;
               render();
             // 需要重置内容加状态
             // 如果传 true 表示 内容 和 状态 都进行重置
             $('#form').data("bootstrapValidator").resetForm( true );
           }
        }
      })
    })
  
})