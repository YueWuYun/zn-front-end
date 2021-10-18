/*HsJGgXoCueKidK+JSYUoEit8HjXWTk45EvayaeQ5pnOmTlkZtC8etYSK3z8tDKqX*/
/**
 * 公共配置
 */

//小应用编码
export const app_code = '36010IRCO';
//请求基础路径
export const base_path = '/nccloud/tmpub/tmbd';
//按钮平铺显示数量
export const button_limit = 3;
//打印输出编码
export const nodekey = '36010IRCO_card';

export const module_id = '';
/**
 * 列表
 */
export const LIST = {
    disabled_btn: ['Delete', 'Copy', 'Print', 'Preview', 'Output'],  //默认禁用按钮
    page_id : '36010IRCO_list',                     //页面编码
    search_id : 'search',                           //查询区域编码
    table_id : 'table',                             //表格区域编码
    head_btn_code: 'form_head',                     //表头按钮区域
    search_oid: '1001Z610000000012UY8',            //查询区域oid
    primary_id: 'pk_ratecode'                       //列表页面主键
}


/**
 * 卡片
 */
export const CARD = {
    primary_id: 'pk_ratecode',                      //表头主键
    page_id : '36010IRCO_card',                     //页面编码
    form_id : 'head',                               //表头表单编码
    interest_id: 'interest',                        //利率信息表单编码
    primary_id: 'pk_ratecode',                      //主键id
    head_btn_code: 'form_head',                     //表头按钮区域
    shoulder_btn_code: 'tabs_head',                 //tab区域肩部区域按钮code
    body_btn_code: 'tabs_body',                     //tab区域表格区域按钮code
    //tab-table编码
    // tab1_id: 'rationrate',                          //定额利率
    // tab2_id: 'overduerate',                         //逾期利率
    // tab3_id: 'advancerate',                         //提前利率
    tab_code: 'rationrate',                         //tab区域code编码
    tab_order: ['rationrate', 'advancerate'], //tab区域排序(逾期利率'overduerate')
    //表体主键
    tabId: {
        tab1: 'pk_ration_d',
        // tab2: 'pk_headover_d',
        tab3: 'pk_headover_d'
    }
}

//缓存标示
export const DATA_SOURCE = 'tm.pub.interestrateOrg.datasource';

//查询区域缓存
export const searchCache = {
    key: 'tm.pub.interestrate.searchCache', //查询区域缓存Key
    dataSource: 'tm.pub.interestrate.searchSpace'//查询区域缓存数据的名称空间
}

//接口地址
export const API_URL = {
    save: `${base_path}/ratecodesave.do`,                   //保存
    delete: `${base_path}/ratecodedelete.do`,               //删除
    queryCard: `${base_path}/ratecodequerycard.do`,         //卡片查询
    queryList: `${base_path}/ratecodequerypage.do`,         //列表查询
    queryListPks: `${base_path}/ratecodequerybypks.do`,     //列表分页查询
    enable: `${base_path}/ratecodeenable.do`,               //启用
    disable: `${base_path}/ratecodedisable.do`,             //停用
    createVersion: `${base_path}/ratecreateversion.do`,     //创建版本
    deleteVersion: `${base_path}/ratedeleteversion.do`,     //删除版本
    queryVersion: `${base_path}/ratecodeversionlist.do`,            //查看版本
    versioncard: `${base_path}/ratecodeversioncard.do`,     //查看版本卡片数据
    print: `${base_path}/rateprint.do`,                     //打印
    queryParaint: `${base_path}/ratecodequeryparaint.do`,   //获取精度
    checkRef: `${base_path}/ratecheckref.do`,               //引用校验
}

export const OPR_NAME = {
    delete: '删除',
    deleteVersion: '删除版本'
}
/*HsJGgXoCueKidK+JSYUoEit8HjXWTk45EvayaeQ5pnOmTlkZtC8etYSK3z8tDKqX*/