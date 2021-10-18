/**
 * 显示公式前端处理
 * @author  zhaochxs
 */

/**
 *
 * @param props
 * @param res 经后台formulaHandle处理过的数据
 * @param data 页面区域
 */
 export  function showFormular(props,res,data){
     if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
         props.dealFormulamsg(
             res.formulamsg,  //参数一：返回的公式对象
             data                //参数二：界面使用的表格类型
         );
     }
 }

