/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { createPage, ajax, base, cardCache ,viewModel} from 'nc-lightapp-front'; 
import buttonClick from './buttonClick'; 
import { searchBtnClick, listInitData } from './searchBtnClick';
//引入常量定义
import { APP_INFO, LIST_PAGE_INFO, URL_INFO, UI_CONF, CARD_PAGE_INFO, SRCTYPE, CACHE_KEY ,PROP_EXT_OBJ,ITEM_INFO} from '../../cons/constant';
import { SCENE } from "../../../../../tmpub/pub/cons/constant";
import { buttonVisible } from "./buttonVisible";
import { go2card, loadSearchCache, getCahceValue, autoLoadData } from "../../util/index";
import { loadSearchCondition } from '../../../../pub/utils/CMPButtonUtil';
import { setPropCache, getPropCache, loadMultiLang } from "../../../../../tmpub/pub/util/index";
let { NCPopconfirm, NCIcon ,NCTooltip} = base;
import { setDefOrg2AdvanceSrchArea, setDefOrg2ListSrchArea,go2CardCheck } from "../../../../../tmpub/pub/util/index";
//引入内部账户参照
import { AccidGridRef } from "../../../../../tmpub/refer/accid/AccidGridRef";
let { setGlobalStorage, getGlobalStorage, removeGlobalStorage } = viewModel;
import appBase from "../../base";
const { cons, api } = appBase;

export default function (props) {  	//从页面级缓存中获取页面对象（List对象）
	const that = getPropCache(props, APP_INFO.FUNCODE, PROP_EXT_OBJ.CONTAIN);
	//构建DOM请求(平台提供api)
	props.createUIDom(
		{ pagecode: LIST_PAGE_INFO.PAGE_CODE },
		(data) => {
			if (!data) {
				return;
			}
			//处理模板
			if (data.template) {
				let meta = data.template;
				//个性化处理模板
				meta = modifierMeta.call(that, props, meta, data)
				//高级查询区域加载默认业务单元
				setDefOrg2AdvanceSrchArea(props, LIST_PAGE_INFO.SEARCH_CODE, data);
				//业务数据初始化
				initData.call(that, props);
				//发布小应用默认交易类型赋值
				if(data.context&&data.context.paramMap){
					let { transtype, pk_transtype,transtype_name } = data.context.paramMap;
					setGlobalStorage('sessionStorage', 'transtype_name', transtype_name);
					if(transtype&&pk_transtype){
					   //遍历查询区域字段 发布小应用给交易类型赋值
					   meta[LIST_PAGE_INFO.SEARCH_CODE].items.map((item) => {
							if (item.attrcode =='pk_trantypeid') {
								item.visible=true;
								item.initialvalue = { 'display': transtype_name, 'value': pk_transtype },
								item.disabled=true;
							}
					   });	
					}					
					let tradeType={refcode: transtype, refname: transtype_name, refpk: pk_transtype}
					setGlobalStorage('sessionStorage', 'sessionTP', JSON.stringify(tradeType), ()=>{
						//存储缓存失败的处理函数
						//联查需要处理缓存存储失败的情况，失败时，把缓存信息转后台存放
					});
			 	}
				//加载模板数据
				props.meta.setMeta(meta);
				//列表查询区域加载默认业务单元
				setDefOrg2ListSrchArea(props, LIST_PAGE_INFO.SEARCH_CODE, data);
			}
			//处理按钮
			if (data.button) {
				let button = data.button;
				props.button.setButtons(button);
				buttonVisible(props);
				props.button.setPopContent('deletetableBtn', loadMultiLang(props, '36070APM--000032'));/* 国际化处理： 确认要删除吗?*/
				props.button.setPopContent('generatetableBtn', loadMultiLang(props, '36070APM--000013'));/* 国际化处理： 您确定要生成付款单据吗？一旦生成，则不可以取消生成！*/
				
			}
		}
	)
}

function modifierMeta(props, meta, data) {
	const that = this;
	//有默认业务单元
	if (data.context && data.context.pk_org) {
		let { pk_org, org_Name } = data.context;
		meta[LIST_PAGE_INFO.SEARCH_CODE].items.map((item) => {
			if (item.attrcode == 'pk_org') {
				item.initialvalue = {
					display: org_Name, value: pk_org
				}
			}
		});
	}
	//修改列渲染样式
	meta[LIST_PAGE_INFO.SEARCH_CODE].items = meta[LIST_PAGE_INFO.SEARCH_CODE].items.map((item, key) => {
		// item.visible = true;
		// item.col = '3';
		return item;
	});
	//参照
	meta[LIST_PAGE_INFO.SEARCH_CODE].items.find((e) => e.attrcode === 'pk_org').isMultiSelectedEnabled = true;
	meta[LIST_PAGE_INFO.TABLE_CODE].pagination = true;
	//查询区域参照过滤
	meta[LIST_PAGE_INFO.SEARCH_CODE].items.map((item) => {
		item.isShowUnit = false;
        item.isShowDisabledData = true;
        item.unitValueIsNeeded = false; //参照item.unitValueIsNeeded为true时：只有选业务单元才会发请求
		//组织参照过滤
		if (item.attrcode == 'pk_org') {
			// item.queryCondition = () => {
			// 	item.isTreelazyLoad = false;
			// 	return {
			// 		funcode: props.getSearchParam("c"),
			// 		TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
			// 	};
			// };
			item.queryCondition = () => {
				item.isTreelazyLoad = false;
				return {
					funcode: props.getSearchParam("c"),
					TreeRefActionExt: 'nccloud.web.cmp.ref.CMPApplyOrgBuilder'
				};
			};
		}
		//组织参照过滤
		else if (item.attrcode == 'pk_acceptorg') {
			item.queryCondition = () => {
				item.isTreelazyLoad = false;
				return {
					funcode: props.getSearchParam("c"),
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				};
			};
		}	
		else if (item.attrcode == 'pk_decidedept') {						
			item.queryCondition = () => {	   
				return {
					pk_org:(props.search.getSearchValByField(LIST_PAGE_INFO.SEARCH_CODE, 'pk_acceptorg').value || {}).firstvalue,
					// GridRefActionExt: 'nccloud.web.cmp.apply.apply.filter.DecidedeptRefbyFinanceorgFilter'//自定义参照过滤条件
                };
            };
		} 
		else if (item.attrcode == 'pk_resuser') {				
			item.queryCondition = () => {	
				return {
					// pk_acceptorg:(props.search.getSearchValByField(LIST_PAGE_INFO.SEARCH_CODE, 'pk_acceptorg').value || {}).firstvalue,
					pk_org:(props.search.getSearchValByField(LIST_PAGE_INFO.SEARCH_CODE, 'pk_acceptorg').value || {}).firstvalue,
					// GridRefActionExt: 'nccloud.web.cmp.apply.apply.filter.ResuserRefByFinanceorgFilter'//自定义参照过滤条件
                };
            };
		} 	
		else if(item.attrcode == 'customer'){
			 item.queryCondition = () => {
	             return {
	                pk_org: (props.search.getSearchValByField(LIST_PAGE_INFO.SEARCH_CODE, 'pk_acceptorg').value || {}).firstvalue,
				 };
			};	
		}	
		else if(item.attrcode.startsWith('vdef')){
			item.queryCondition = () => {
				return {
					pk_org: (props.search.getSearchValByField(LIST_PAGE_INFO.SEARCH_CODE, 'pk_acceptorg').value || {}).firstvalue,
				};
			};
		}	
		else if (item.attrcode == 'pk_supplier') {
            item.queryCondition = () => {
                return {
	                pk_org: (props.search.getSearchValByField(LIST_PAGE_INFO.SEARCH_CODE, 'pk_acceptorg').value || {}).firstvalue,
					// GridRefActionExt: 'nccloud.web.cmp.apply.apply.filter.SelfSupplierRefFilter'//自定义参照过滤条件					
                };
            };
		}	  		
	});

	//付款银行账号
	meta[LIST_PAGE_INFO.SEARCH_CODE].items.map((item) => {
		item.isShowUnit = false;
        item.isShowDisabledData = true;
        item.unitValueIsNeeded = false; //参照item.unitValueIsNeeded为true时：只有选业务单元才会发请求
		if (item.attrcode == 'pk_bankacc_p') {
			item.queryCondition = () => {
				let pk_org=props.search.getSearchValByField(LIST_PAGE_INFO.SEARCH_CODE,'pk_org').value.firstvalue;
				let currtype=props.search.getSearchValByField(LIST_PAGE_INFO.SEARCH_CODE,'pk_currtype').value.firstvalue;
				return {
					pk_orgs: pk_org,
					pk_currtype: currtype,
					refnodename: props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBRCOMP-000017'),/* 国际化处理： 使用权参照*/
					noConditionOrg:'Y',
					GridRefActionExt: 'nccloud.web.cmp.ref.CMPBatchOrgBankaccSubDefaultGridRefSqlBuilder' //自定义参照过滤条件
				};
			};
		}
	});

	meta[LIST_PAGE_INFO.TABLE_CODE].items = meta[LIST_PAGE_INFO.TABLE_CODE].items.map((item, key) => {
		if (item.attrcode == 'vbillno') {
			item.render = (text, record, index) => {
				return (
					<a
						// style={{ textDecoration: 'underline', cursor: 'pointer' }}
						style={{  cursor: 'pointer' }}
						onClick={() => {
							go2CardCheck({
								props,url:URL_INFO.LIST.LIST2CARD_CHECK,pk:record.pk_apply.value,ts:record.ts.value,fieldPK:ITEM_INFO.PK,actionCode:null,permissionCode:null,checkSaga:false,checkTS:false,go2CardFunc:()=>{
									go2card(props, { pagecode: CARD_PAGE_INFO.PAGE_CODE, status: 'browse', id: record.pk_apply.value }, that.getState.bind(that));
								}
							});	
							
						}}
					>
						{
							record.vbillno ? record.vbillno.value : ''
						}
					</a>
				);
			};
		}
		return item;
	});
	//非联查场景才会渲染操作列
	if (!isLink(props)) {
		//添加操作列	
		meta[LIST_PAGE_INFO.TABLE_CODE].items.push({
			attrcode: 'opr',
			label: loadMultiLang(props, '36070APM--000016'),//操作/* 国际化处理： 操作*/
			fixed: 'right',
			className: "table-opr",
			visible: true,
			itemtype:'customer',
			render: (text, record, index) => {
				//begin tm zhanghe 20191120 支持分布式事务异常交互
				// return props.button.createOprationButton(getBodyButton(record), {
				// 	area: "list_inner",
				// 	buttonLimit: UI_CONF.BUTTON_LIMIT,
				// 	onButtonClick: (props, key) => buttonClick.call(that, props, key, text, record, index)
				// });
				return (props.button.createErrorButton({
                    record,
                    showBack: false,
                    sucessCallBack: () => {
						return props.button.createOprationButton(getBodyButton(record), {
							area: "list_inner",
							buttonLimit: UI_CONF.BUTTON_LIMIT,
							onButtonClick: (props, key) => buttonClick.call(that, props, key, text, record, index)
						});
                    }
				}));
				//end
			}
		});
	}
	return meta;
}
/**
 * 获取表体按钮组
 * @param {*} record 行数据
 */
function getBodyButton(record) {
	//单据状态
	let billstatus = record && record.busistatus && record.busistatus.value;	
	let buttonAry;
	//待提交
	if (billstatus == '1') {		
		buttonAry = ["committableBtn","edittableBtn", "deletetableBtn"];
	}
	//待审批
	else if (billstatus == '2') {
		buttonAry = ["backtableBtn"];
	}
	//待生成
	else if (billstatus == '3' ||billstatus == '4') {
		buttonAry = ["generatetableBtn","backtableBtn"];
	}	
	else {
		buttonAry = [];
	}
	return buttonAry;
}

function initData(props) { 
	//主键信息
	let id = props.getUrlParam('id');
	//联查场景标志
	let scene = props.getUrlParam('scene');
	//预算反联查参数
	let tbbParam = props.getUrlParam('pk_ntbparadimvo');
	//是否已查询标志
	let hasQryFlag = cardCache.getDefData(CACHE_KEY.HAS_QRY, APP_INFO.DATA_SOURCE);
	//设置是否联查场景到缓存
	cardCache.setDefData(CACHE_KEY.ISLINK, APP_INFO.DATA_SOURCE, isLink(props));	
	//有预算反联查参数，预算反联查
	if (tbbParam) {
		listInitData.call(this, props, 'tbb');
		cardCache.setDefData(CACHE_KEY.HASBACK, APP_INFO.DATA_SOURCE, true);
	}
	//如果存在id，则表明是联查场景
	else if (id) {
		listInitData.call(this, props, 'link');
	}
	//如果已查询过，则从缓存中加载列表界面数据
	else if (hasQryFlag) {
		getCahceValue(props, this.updateState.bind(this));
	}
	//如果未查询，则自动加载数据
	else {
		// autoLoadData.call(this, props);
	}
}

/**
 * 判断是否联查场景
 * @param {*} props 
 */
const isLink = function (props) {
	//主键信息
	let id = props.getUrlParam('id');
	//联查场景标志
	let scene = props.getUrlParam('scene');
	//预算反联查参数
	let tbbParam = props.getUrlParam('pk_ntbparadimvo');
	//获取缓存中的是否联查标志
	let islink = cardCache.getDefData(CACHE_KEY.ISLINK, APP_INFO.DATA_SOURCE);
	return (id || scene == SCENE.LINK || tbbParam || islink) ? true : false;
}


/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/