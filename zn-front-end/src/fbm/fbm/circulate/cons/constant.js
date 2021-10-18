/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/
/**
 * 公共配置
 */
//模块名称
export const modelname = 'fbm';
//小应用编码
export const app_code = '36180BCI';
//联查小应用编码
export const link_app_code = '36180BCI';
//请求基础路径
export const base_path = '/nccloud/fbm/gather';
//按钮平铺显示数量
export const button_limit = 3;  
//打印输出编码
export const nodekey = '36180BCIP_01';
export const module_id = '36180BCI';
//单据类型
export const billtype = '36HR';

/**
 * 卡片
 */
export const CARD = {
    primary_id: 'pk_circulate',                        //表头主键
    billno: 'vbillno',                                 //单据编号
    page_id: '36180BCI_CARD',                          //页面编码 
    page_id_link: '36180BCI_CARD',                     //联查页面编码
    page_id_approve: '36180BCIA_CARD',                 //审批页面编码
    form_id: 'head',                                   //表头表单编码
    head_btn_code: 'card_head',                        //表头按钮区域
    shoulder_btn_code: 'tabs_head',                    //tab区域肩部区域按钮code
    body_btn_code: 'tabs_body',                        //tab区域表格区域按钮code
    tab_code: 'guarantee',                             //tab区域code编码
    tab_order: ['guarantee'],                          //tab区域排序
    //表体主键
    tab_id: {
        guarantee: 'pk_circulate_b'
    }

}

//缓存标示
export const DATA_SOURCE = 'tm.fbm.circulate.datasource';

//查询区域缓存
export const searchCache = {
    key: 'fbm.fbm.circulate.searchCache', //查询区域缓存Key
    dataSource: 'fbm.fbm.circulate.searchSpace'//查询区域缓存数据的名称空间
}

//接口地址
export const API_URL = {
    queryCard: `${base_path}/circulate.do`,                     //卡片查询
    print: `${base_path}/circulateprint.do`                     //打印
}

/* 
    表头按钮禁用状态
    key:根据哪个字段判断按钮是否禁用
    btnName:按钮编码
 */
export const DISABLE_BTN_PARAM = [{
    
}];

/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/