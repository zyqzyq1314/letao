/**
 * Created by lenovo on 2018/5/12.
 */
$(function () {
  
  //当前页
  var currentPage=1;
  var pageSize=5;
  // 声明一个数组, 专门用于存储需要进行上传提交的图片对象 (地址, 名称)
  var picArr = [];
  render();
  //1发送ajax请求,渲染页面,配置分页插件
  function render() {
    //发送ajax请求
     $.ajax({
       url:'/product/queryProductDetailList',
       type:'get',
       data:{
         page:currentPage,
         pageSize:pageSize
       },
        success:function (info) {
          console.log(info);
          //将模板和数据组合
          var htmlStr=template('productTmp',info);
          $('.lt_content tbody').html(htmlStr);
            //配置分页插件
          $('#paginator').bootstrapPaginator({
            bootstrapMajorVersion:3,
            currentPage:info.page,
            totalPages:Math.ceil(info.total/info.size),
            onPageClicked:function (a,b,c,page) {
               //更新当前页
               currentPage=page;
               render();
            }
          })
        }
     })
    
  }

  //2点击显示模态框
   $('#addBtn').click(function () {
       $('#addModal').modal('show');
       
       //发送ajax请求,获取二级分类名称渲染到页面
     $.ajax({
       url:'/category/querySecondCategoryPaging',
       type:'get',
       data:{
         page:1,
         pageSize:100
       },
       success:function (info) {
         console.log(info)
          //将数据和模板进行组合
         var htmlStr=template('dropdownTpl',info);
         $('.dropdown-menu').html(htmlStr);
       }
     })
   })
  
  //3给每一个a添加点击事件
  $('.dropdown-menu').on('click','a',function () {
        //获取当前a的值
    var txt=$(this).text();
    //将值设置给选择二级分类名称
      $('#dropdownText').text(txt);
      //获取id,设置到隐藏的表单里面
    var id = $(this).data("id");
    $('[name="brandId"]').val( id );
    // 如果用户选择了二级分类, 需要更新 brandId 隐藏域的校验状态 为 VALID
    // 参数1: 校验的字段
    // 参数2: 校验的状态
    // 参数3: 校验的规则, 失败时的提示信息
    $('#form').data("bootstrapValidator").updateStatus("brandId", "VALID");
    
  })
  
  //4设置文件上传
  $("#fileupload").fileupload({
    dataType:"json",
    //e：事件对象
    //data：图片上传后的对象，通过e.result.picAddr可以获取上传后的图片地址
    // 在 jquery.fileupload 内部已经对文件上传的 ajax 操作进行了封装
    // 如果是单文件, 发送一次图片上传请求
    // 如果是多文件, 发送多次图片上传请求, 会遍历所选择的图片, 进行多次请求 (意味着会有多次响应)
    done:function (e, data) {
      // console.log(data);  data对象的result属性上面存储的有图片的地址
      //每选择添加一张图片,就会发送一次ajax请求,返回一个图片的地址
      var picUrl = data.result.picAddr;
      // 图片对象
      var picObj = data.result;
      //添加图片到图片预览当中
       $('#imgBox').prepend('<img src="'+ picUrl+'" alt="" width=100 >');
      // 还需要加图片对象, 添加到数组中
      // 数组常用操作: unshift, shift, push, pop, ( map reduce forEach every some filter 了解 )
      picArr.unshift(picObj);
      //图片预览当中只能有三张图片,每次添加图片都是添加在上一个图片的前面
        if(picArr.length>3){
           //删除数组中第一张图片
           picArr.pop();
          // 删除图片中的最后一个
          // 需求: 获取盒子中的最后一个图片子元素
          // img:last-of-type 找到最后一个img类型的子元素
          $('#imgBox img:last-of-type').remove();
        }
        //如果满足三张图片了,手动更新隐藏域的验证状态
      if ( picArr.length === 3 ) {
        $('#form').data("bootstrapValidator").updateStatus("picStatus", "VALID");
      }
      
    }
  });
  
  // 5. 表单校验功能
    $('#form').bootstrapValidator({
      //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
      //由于本页面的模态框有隐藏域表单参加验证,因此需要把hidden去掉
      excluded: [],
      //2. 指定校验时的图标显示，默认是bootstrap风格
      feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
      },
      fields:{
         //选择二级分类
        brandId:{
           validators:{
             notEmpty:{
               message:"请选择二级分类"
             }
           }
         },
        //商品名称
        proName:{
          validators:{
            notEmpty:{
              message:"请输入商品名称"
            }
          }
        },
        //商品描述
        proDesc:{
          validators:{
            notEmpty:{
              message:"请输入商品描述"
            }
          }
        },
        //商品库存
        // \d 表示数字
        // * 表示零个或多个
        // + 表示1个或多个
        // ? 表示0个或1个
        // {n} 表示出现 n 次
        num:{
          validators:{
            notEmpty:{
              message:"商品库存"
            },
            regexp: {
              regexp: /^[1-9]\d*$/,
              message: '第一个数不能为0'
            }
          }
        },
        //选商品尺码
        size:{
          validators:{
            notEmpty:{
              message:"选商品尺码"
            },
            regexp: {
              regexp: /^\d{2}-\d{2}$/,
              message: '商品尺码要求, 两位数字-两位数字, 例如: 32-40'
            }
          }
        },
        //商品原价
        oldPrice:{
          validators:{
            notEmpty:{
              message:"商品原价"
            }
          }
        },
        //商品现价
        price:{
          validators:{
            notEmpty:{
              message:"商品现价"
            }
          }
        },
        // 图片是否上传满三张的校验
        picStatus:{
          validators:{
            notEmpty:{
              message:"请上传三张图片"
            }
          }
        },
      }
    })
  //6表单验证成功的时候,
  $('#form').on("success.form.bv", function( e ) {
       //阻止表单默认的提交事件
       e.preventDefault();
       //获取表单里面的数据
    console.log($('#form').serialize());
    var params=$('#form').serialize();//获取不到图片,
    params += "&picName1=" + picArr[0].picName + "&picAddr1="+ picArr[0].picAddr;
    params += "&picName2=" + picArr[1].picName + "&picAddr2="+ picArr[1].picAddr;
    params += "&picName3=" + picArr[2].picName + "&picAddr3="+ picArr[2].picAddr;
     //发送ajax请求
       $.ajax({
         url:'/product/addProduct',
         type:'post',
         data:params,
         success:function (info) {
            if(info.success){
              //请求成功
              //关闭模态框
              $('#addModal').modal('hide');
              // 重置所有内容和校验状态
               $('#form').data('bootstrapValidator').resetForm(true);
               //更新第一页
              currentPage=1;
              //重新渲染页面
              render();
              // 重置文本
              $('#dropdownText').text("请选择二级分类");
  
              // 删除所有图片, 找到所有的图片, 让他自杀
              $('#imgBox img').remove();
  
              // 清空数组
              picArr = [];
            }
         }
       })
     
  })
  
  });