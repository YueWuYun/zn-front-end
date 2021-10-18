/*HsJGgXoCueKidK+JSYUoEmkeKhyWLrsxj97D+HmahiFILiE6icQLtAK2M83OrqU5*/
/**
 * 公共配置
 */
//应用编码


const  PAYBILL_CONST={
    //应用ID
    app_id :'0001Z61000000003ONIZ',

    appcode:'36070PBRCOMP',
   //模块编码
   module_id : '2052',
   //查询模板
   oid : '0001Z61000000000QJFP',

   
   //LIST
   list_page_id : '36070PBR_L04',
   list_search_id : 'search_D5',
   list_table_id :'table_D5',
   //card
   card_page_id : '36070PBR_C04',
   card_from_id :'head',
   card_table_id : 'paybilldetail_table',

   formId: 'head', //表头区域

   //url
   base_url : '/nccloud/cmp/paybills/',
   list_page_url : '/cmp/billmanagement/paybillcomp/list/index.html',
   card_page_url : '/cmp/billmanagement/paybillcomp/card/index.html',
   //状态
   browse: 'browse', 
   edit: 'edit',
   add: 'add',
   copy: 'copy',
   //缓存key
   paybillCacheKey:'cmp.billmanagement.paybillcomp.CacheKey',
   paybillPkNamekey:'cmp.billmanagement.paybillcomp.Pkname',
   paybill_stateKey:'cmp.billmanagement.paybillcomp.stateKey',

   paybill_pkname:'pk_paybill',
   search_key:'paybillcomp_search_key',
   SAVED:{  field: 'bill_status',
   value: {
   firstvalue: parseInt(-10),
   secondvalue: null
   },
   oprtype: '=',
   datatype: '203'

   },
   UNCONFIRM:{
       field: 'bill_status',
       value: {
       firstvalue: parseInt(9),
       secondvalue: null
       },
       oprtype: '=',
       datatype: '203'
       }  
};

export {
   PAYBILL_CONST
   
};
export const app_id = '0001Z61000000003ONIZ';
//模块编码
export const module_id = '2052';
//实体id

export const oid = '0001Z61000000000QJFP';
//请求后端基础地址
export const base_url = '/nccloud/cmp/paybills/';
//按钮平铺显示数量
export const button_limit = 4;
/**
 * 列表
 */
//页面编码
export const list_page_id = '36070PBR_L04';
//查询区域编码
export const list_search_id = 'search_D5';
//表格区域编码
export const list_table_id = 'table_D5';

/**
 * 卡片
 */
//页面编码
export const card_page_id = '36070PBR_C04';
//表头表单编码
export const card_from_id = 'head';
//表体表格编码
export const card_table_id = 'paybilldetail_table';

//页面跳转地址
export const page_url = 'cmp/billmanagement/paybill/';

//list页跳转路径
export const list_page_url= '/cmp/billmanagement/paybillcomp/list/index.html';
//cardt页跳转路径
export const card_page_url= '/cmp/billmanagement/paybillcomp/card/index.html';
export const comp_setServal = [
    {

        field: 'source_flag',
        value: {
            firstvalue: '9',
            secondvalue: null
        },
        oprtype: '=',
        display: null
    }
];


/*HsJGgXoCueKidK+JSYUoEmkeKhyWLrsxj97D+HmahiFILiE6icQLtAK2M83OrqU5*/