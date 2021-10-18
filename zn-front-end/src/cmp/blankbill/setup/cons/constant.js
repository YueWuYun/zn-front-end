/*HsJGgXoCueKidK+JSYUoEmkeKhyWLrsxj97D+HmahiFILiE6icQLtAK2M83OrqU5*/
/**
 * 公共配置
 */
// 常量
export const BBC_CONST = {
 
    //页面跳转地址
    PAGE_URL: 'cmp/blankbill/setup/',
    LIST_PAGE_URL : '/cmp/blankbill/setup/list/index.html',
    CARD_PAGE_URL : '/cmp/blankbill/setup/card/index.html',

    //状态
    browse: 'browse', 
	edit: 'edit',
	add: 'add',
    copy: 'copy',
    //缓存key
    BBR_CACHEKEY:'cmp.blankbill.setup.CacheKey',
    BBR_PKNAMEKEY:'cmp.blankbill.setup.Pkname',
    BBR_STATEKEY:'cmp.blankbill.setup.stateKey',

    SEARCH_KEY:'bbr_search_key',
    LINK_KEY:'bbr_link_key',
  
};

// 小应用信息
export const APP_INFO = {

    APPCODE:'36070BBC', // 应用编码
    LIST_PAGECODE: '36070BBC_L01', // 列表页面编码
    SEARCH_CODE: 'search_area', // 查询区域编码
    LIST_TABLECODE: 'table_bbc_01', // 表格区域编码
    FORM_BBC_01: 'form_bbc_01',
    FORM_BBC_02: 'form_bbc_02',
    FORM_BBC_03: 'form_bbc_03',
    FORM_BBC_04: 'form_bbc_04',
    FORM_BBC_05: 'form_bbc_05',
    TREE: 'tree'
};

// 字段信息
export const BILL_FIELD = {
    PK_NAME: 'pk_bill_gz', //主键字段
    PK_ORG: 'pk_org', // 财务组织
    VBILLNO: 'bill_number', // 单据编号
    PKNOTETYPE: 'pk_notetype', // 票据类型
    TS: 'ts',  // 时间戳
    BILLPK: 'pk_ebm', // 表体主键
    PSEUDOCOLUMN: 'pseudocolumn' //伪列
};
const REQ_BASE_URL = '/nccloud/cmp/bbc/';
  // 请求后台action路径
export const REQUEST_URL = {
    
    QUERYNOTETYPE: REQ_BASE_URL + 'querynotetype.do',
	QUERYNODE: REQ_BASE_URL + 'querynode.do',
	QUERY: REQ_BASE_URL + 'bbcquery.do',
	SAVE: REQ_BASE_URL + 'bbcsave.do',
	PRINT: REQ_BASE_URL + 'print.do'
    
};

// 注册按钮名称
export const BTN = {
    ADD_GROUP:'addgroup',
    SAVE_BTN:'savebtn',
    EDIT_BTN:'editbtn',
    CANCEL_BTN:'cancelbtn'
};


/**
 * 字段常量:
 * id: 节点主键
 * pid:父级主键
 * code:节点编码
 * name:节点名称
 * pk_group:集团信息
 * pk_checkmethod:检验方法
 * parentcheckitem:上级检验项目
 * analymethod:分析方法
 * iqcindexprfer:质量指标性质
 * ichecktype:检验值类型
 * pk_checkbasis:检测依据
 */
export const FIELD = {
	id: 'pk_checkitem',
	pid: 'parentcheckitem',
	code: 'vcheckitemcode',
	name: 'vcheckitemname',
	pk_group: 'pk_group',
	pk_checkmethod: 'pk_checkmethod',
	parentcheckitem: 'parentcheckitem',
	analymethod: 'analymethod',
	iqcindexprfer: 'iqcindexprfer',
	ichecktype: 'ichecktype',
	pk_checkbasis: 'pk_checkbasis'
};

/**
 * 自定义补充的常量:
 * id:查询树节点向后台传的字段信息
 * pid:上机检验项目id
 * refpk:节点pk标识
 * children:树子节点
 * rootId:初始根节点
 * pagecode:页面编码
 * templetid:模板主键
 * CheckItemEnum:质量指标性质枚举类型,ENUMERATE-计数型,NUMBER-计量型
 */
export const OTHER = {
	id: 'id',
	pid: 'pid',
	refpk: 'refpk',
	children: 'children',
	rootId: '-1',
	pagecode: 'pagecode',
	templetid: 'templetid',
	CheckItemEnum: { ENUMERATE: 1, NUMBER: 0 }
};


/*HsJGgXoCueKidK+JSYUoEmkeKhyWLrsxj97D+HmahiFILiE6icQLtAK2M83OrqU5*/