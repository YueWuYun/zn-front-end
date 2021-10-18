/*HsJGgXoCueKidK+JSYUoEmuQjoTL2dgtp3731v4xEhhy2a7+impkFn4udMrvHqZJ*/
/**
 * 公共配置
 */
//应用编码
export const app_id = '1001Z610000000000TCI';
//模块编码
export const module_id = '3614';
//实体id
// export const oid = '0001Z61000000005QF0P';   导入模板

// export const oid = '1001Z61000000002NWYD';
                         
//请求后端基础地址
export const base_url = '/nccloud/ifac/*/';
//按钮平铺显示数量
export const button_limit = 2;
//单据类型
// export const bill_type = '36B2';

//功能节点编码，即模板编码
export const fun_code = '36140AIAC';

//模板节点标识
export const node_key = 'CARD'; 

//打印模板id
// export const printTemplate_ID = '1001Z61000000002DFNM';

export const app_code = '36140AIAC';
/**
 * 列表
 */
//页面编码
export const list_page_id = '36140AIAC_L01';
//查询区域编码
export const list_search_id = '36140AIAC_L01_search';
//表格区域编码
export const list_table_id = 'head';

/**
 * 卡片
 */
//页面编码
export const card_page_id = '36140AIAC_C01';
//表头表单编码
export const card_from_id = 'head';
//表体表格编码
export const card_table_id = '36140AIAC_C01_table_edit';
//表体表格编码展开
export const card_table_id_edit = '36140AIAC_C01_table_browse_open';
//查看版本编码
export const card_version_id = '36140AIAC_C01_version';



export const dataSourceTam = 'tm.fac.interestobj.cache';
// //查询条件缓存数据key
export const search_key = 'query_condition';

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
    'pk_org':true,
    'effectivedate':false,
    'floatingpercent':false,
    'pk_ratecode':false,
    'pk_settledate':false,
    'pk_account_g':false,
    'memo':false
}

export const setEditDisabled = {
    'pk_org':true,
    'modifier':true,
    'modifiedtime':true,
    'creationtime':true,
    'creator':true,
    'objcode':false,
    'intobjname':false

}

export const setAddDisabled = {
    'pk_ratecode': false,
	'pk_settledate': false,
    'pk_org':false,
    'modifier':true,
    'modifiedtime':true,
    'creationtime':true,
    'creator':true
}
//列表查询区缓存
export const searchArea = 'interestobj_search_key';

export const openaccountapplyCacheKey = 'tm.fac.facdemanddepositset.interestobj';

//主键
export const pk_name = 'pk_accintobj';
    
/*HsJGgXoCueKidK+JSYUoEmuQjoTL2dgtp3731v4xEhhy2a7+impkFn4udMrvHqZJ*/