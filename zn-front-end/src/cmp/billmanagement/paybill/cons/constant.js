/*HsJGgXoCueKidK+JSYUoEmkeKhyWLrsxj97D+HmahiFILiE6icQLtAK2M83OrqU5*/
/**
 * 公共配置
 */
//应用编码

const  PAYBILL_CONST={
     //应用ID
     app_id :'0001Z61000000001PJBL',
     appcode:'36070PBR',
    //模块编码
    module_id : '2052',
    //查询模板
    oid : '0001Z61000000000OX2D',

    
    //LIST
    list_page_id : '36070PBR_D5_list',
    list_search_id : 'search_D5',
    list_table_id :'table_D5',
    //card
    card_page_id : '36070PBR_D5_card',
    card_from_id :'head',
    card_table_id : 'paybilldetail_table',

   //到账通知
    release_page_id : '36070PBR_C05',
    release_from_id :'mainform_paybill_01',
    release_table_id : 'table_paybill_01',

    formId: 'head', //表头区域
    tableId: 'paybilldetail_table', //表体区域
    searchId: 'search_D5',
    //url
    upload_url:'/nccloud/cmp/paybills/enclosurequery.do',
    base_url : '/nccloud/cmp/paybills/',
    list_page_url : '/cmp/billmanagement/paybill/list/index.html',
    card_page_url : '/cmp/billmanagement/paybill/card/index.html',
    //状态
    browse: 'browse', 
	edit: 'edit',
	add: 'add',
    copy: 'copy',
    //缓存key
    paybillCacheKey:'cmp.billmanagement.paybill.CacheKey',
    paybillPkNamekey:'cmp.billmanagement.paybill.Pkname',
    paybill_stateKey:'cmp.billmanagement.paybill.stateKey',

    paybill_pkname:'pk_paybill',
    search_key:'paybill_search_key',
    link_key:'paybill_link_key',
    SAVED:{  field: 'bill_status',
    value: {
    firstvalue: parseInt(-10),
    secondvalue: null
    },
    oprtype: '=',
    datatype: '203'

    },

     DataArr :  ['pk_currtype','pk_balatype','note_type','pk_tradetypeid','pk_account','pk_oppaccount','objecttype',
     'local_rate','group_rate','global_rate','pk_supplier','mon_account','accountname','pk_customer', 'pk_busiman', 'accountopenbank', 'accountcode',
     'pk_accountname'],
    APPROVING:[{
        field: 'bill_status',
        value: {
        firstvalue: parseInt(2),
        secondvalue: null
        },
        oprtype: '=',
        datatype: '203'
        }, {
        field: 'bill_status',
        value: {
        firstvalue: parseInt(-1),
        secondvalue: null
        },
        oprtype: '=',
        datatype: '203'
        }],
        //网银补录 来源模块
       sourceModel_CMP :"CMP",
       //网银补录参数
       SHOWMODEL_BULU :0
      
};




export {
    PAYBILL_CONST

	
};
export const app_id = '0001Z61000000001PJBL';
//模块编码
export const module_id = '2052';
//实体id
export const oid = '0001Z61000000000OX2D';
//请求后端基础地址
export const base_url = '/nccloud/cmp/paybills/';


//按钮平铺显示数量
export const button_limit = 4;
/**
 * 列表
 */
//页面编码
export const list_page_id = '36070PBR_D5_list';
//查询区域编码
export const list_search_id = 'search_D5';
//表格区域编码
export const list_table_id = 'table_D5';

/**
 * 卡片
 */
//页面编码
export const card_page_id = '36070PBR_D5_card';
//表头表单编码
export const card_from_id = 'head';
//表体表格编码
export const card_table_id = 'paybilldetail_table';


/**
 * 到账通知卡片
 */
//页面编码
export const release_page_id = '36070PBR_C05';
//表头表单编码
export const release_from_id = 'mainform_paybill_01';
//表体表格编码
export const release_table_id = 'table_paybill_01';





//页面跳转地址
export const page_url = 'cmp/billmanagement/paybill/';

//list页跳转路径
export const list_page_url= '/cmp/billmanagement/paybill/list/index.html';
//cardt页跳转路径
export const card_page_url= '/cmp/billmanagement/paybill/card/index.html';


/*HsJGgXoCueKidK+JSYUoEmkeKhyWLrsxj97D+HmahiFILiE6icQLtAK2M83OrqU5*/