/*HsJGgXoCueKidK+JSYUoEmuQjoTL2dgtp3731v4xEhhy2a7+impkFn4udMrvHqZJ*/
/**
 * 公共配置
 */
//应用编码
export const app_id = '1001Z610000000000TIJ';
//模块编码
export const module_id = '3614';
                         
//请求后端基础地址
export const base_url = '/nccloud/ifac/*/';
//按钮平铺显示数量
export const button_limit = 2;


//功能节点编码，即模板编码
export const fun_code = '36140FDLB';

//模板节点标识
export const node_key = 'CARD'; 


export const app_code = '36140FDLB';
/**
 * 列表
 */
//页面编码
export const list_page_id = '36140FDLB_L01';
//查询区域编码
export const list_search_id = '36140FDLB_L01_search';
//表格区域编码
export const list_table_id = 'head';

/**
 * 卡片
 */
//页面编码
export const card_page_id = '36140FDLB_C01';
//表头表单编码
export const card_from_id = 'head';
//表体表格编码
export const card_table_id = '36140FDLB_C01_table';




export const dataSourceTam = 'tm.fac.depositreceipt.cache';
// //查询条件缓存数据key
export const search_key = 'query_condition';

export const aggvo = 'nc.vo.fac.depositreceipt.AggDepositReceiptVO';




export const setNull = {

   // 'creator':null,
    // vbillno:null,
    'creator':null,
    'creationtime':null,
    'modifiedtime':null,
    //'billmaker_date':null,
   // 'billmaker':null,
    //'billmaker_time':null,
    //'busistatus':'1',
    //'vbillstatus':'-1',
    'modifier':null,
    'objcode':null,
    'pk_accintobj':null,
    'intobjname':null
    };

export const setDisabled = {
    'pk_org':false,
    'effectivedate':false,
    'floatingpercent':false,
    'pk_ratecode':false,
    'pk_settledate':false,
    'pk_account_g':false,
    'memo':false
}
//列表查询区缓存
export const searchArea = 'depositreceipt_search_key';

export const openaccountapplyCacheKey = 'tm.fac.factimedepositmange.depositreceipt';

//主键
export const pk_name = 'pk_depositreceipt';

/*HsJGgXoCueKidK+JSYUoEmuQjoTL2dgtp3731v4xEhhy2a7+impkFn4udMrvHqZJ*/