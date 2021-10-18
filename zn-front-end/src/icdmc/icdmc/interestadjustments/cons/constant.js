/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/
/**
 * 公共配置
*/
//请求后台接口基础路径
export const baseReqUrl = '/nccloud/icdmc/interestadjustments/';   
//按钮平铺显示数量
export const btnLimit = 3;
//appcode
export const appCode = '36360ICIA';
//appcode--联查
export const appCode_appro = '36360ICIAA';
//小应用ID(??, 多语使用) 
export const moduleId= '';
// 审批使用
export const billtype= '36CV';
//打印输出编码
export const printData= {
    appcode: appCode,
    nodekey: '36360ICIAC',
};
//调用后台相关接口地址
export const javaUrl= {
    list: 'interestadjustlistqry',                             //列表详情
    pks: 'interestadjustqrybypks',                             //列表分页pks
    commit: 'interestadjustcommit',                            //提交
    uncommit: 'interestadjustuncommit',                        //收回
    delete: 'interestadjustdelete',                            //删除
    print: 'interestadjustprint',                              //打印输出
    card: 'interestadjustcardqry',                             //卡片详情
    save: 'interestadjustsave',                                //卡片修改新增保存
    savecommit: 'interestadjustsavecommit',                    //卡片保存提交
    afterEvent: 'interestadjustafteredit',                     //编辑后事件
    queryinterest: 'queryinterestlistpk',                      //联查利息清单
    copy: 'interestadjustcopy',                                //卡片复制
    // coordination: 'interestcoordination',                      //协同
    // uncoordination: 'interestuncoordination',                  //取消协同
    // returncoordination: 'interestreturncoordination'           //退回-协同推单
    gotocardcheck: 'gotocardcheck' // 列表跳卡片检查
}; 


/**
 * 列表
*/
// 列表页面相关编码
export const list= {
    pageCode: '36360ICIA_L01',                                 //列表页面code
    btnCode: 'list_head',                                       //列表页面按钮区域code
    searchCode: 'list_search',                                  //列表页面查询区域code
    tableCode: 'list_table',                                    //列表页面表格区域code
    bodyCode: 'list_inner',                                     //列表页面表格区域按钮code
    searchOid: '1001Z61000000000WSKA',                          //列表页面查询区域oid
    listCache: 'icdmc.icdm.interestadjustments.tableData',         //列表页面缓存
    primaryId: 'pk_interestadj',                         //列表页面主键ID
    tabStatus: ['DTJ', 'SPZ', 'all'],                           //状态页签的key 
    tabContainer: 'groupData',                                  //后台保存页签数量的key 
    searchKey: 'interestadjustments.list.search.key',            //查询区域缓存的key 
    statusKey: 'interestadjustments.list.status.key',            //tab状态区域缓存的key
    statusNumKey: 'interestadjustments.list.statusNum.key',      //tab状态区域数量缓存的key
    tabKey: 'vbillstatus',                                       //tab状态区域传到后台的key
};  

/**
 * 卡片
*/
// 卡片页面相关编码
export const card= {
    pageCode: '36360ICIA_C01',                             //卡片页面code
    pageCode_appro: '36360ICIAA_C01',                      //卡片页面code--联查
    primaryId: 'pk_interestadj',                     //卡片页面主键ID
    headCode: 'header',                                     //卡片页面主表区域code
    btnCode: 'btn_head',                                    //卡片页面按钮区域code
    cardCache: 'icdmc.icdmc.interestadjustments.cacheKey',      //卡片页面缓存
};

// export const busistatusvalue={
//     busistatus_unexecuted:'3',                              //未执行
//     busistatus_executed:'4',                                //在执行
// }

// 返回操作数据的状态
export const datastatus= {
    allsuccess: 0 , //全部成功
    allfail: 1 , //全部失败
    partialsuccess:2//部分成功

}
/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/