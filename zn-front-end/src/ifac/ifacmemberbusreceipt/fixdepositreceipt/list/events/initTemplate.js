/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/
import { bodyButtonClick } from './bodyButtonClick';
import { createPage, ajax, base, toast, cardCache,excelImportconfig} from 'nc-lightapp-front';
import { list, card, appCode, btnLimit,baseReqUrl } from '../../cons/constant.js';
import { setDefOrg2ListSrchArea, setDefOrg2AdvanceSrchArea } from 'src/tmpub/pub/util/index';
import { COMMON_BTN,BTN_AREA } from '../../cons/constant';
import { voucherLinkBill } from './voucherLinkBill';
import { go2CardCheck } from "../../../../../tmpub/pub/util/index";
const { EDIT_INNER_BTN, DELETE_INNER_BTN, CONFIRM_INNER_BTN, UNCONFIRM_INNER_BTN } = COMMON_BTN;

export default function (props) {
	props.createUIDom(
		{
			pagecode: this.pageId,//页面code
			appcode: appCode
		},
		(data) => {//console.log(data, 'data')
			if (data) {
				if (data.template) {
					let meta = data.template;
					//联查场景标志
					let src = props.getUrlParam('scene');
					if ('fip' == src ) {
						initData.call(this, props);
					}

					meta = modifierMeta.call(this, props, meta)
					setDefOrg2AdvanceSrchArea(props, this.searchId, data);
					props.meta.setMeta(meta);
					setDefOrg2ListSrchArea(props, this.searchId, data);
				}
				if (data.button) {
					/* 按钮适配  第一步：将请求回来的按钮组数据设置到页面的 buttons 属性上 */
					let button = data.button;
					props.button.setButtons(button);
					//联查场景标志
					let src = props.getUrlParam('scene');
					if('fip' == src){
						props.button.setButtonVisible([
							'Tally',
							'tally',
							'unTally'
						], false);
					}
					props.button.setPopContent(DELETE_INNER_BTN, this.state.json['36340FDSR-000004']);/* 国际化处理： 确定要删除吗？*/
				}
			}
		}
	)
}
function initData(props) {
	//主键信息
	let srcid = props.getUrlParam('id');
	//联查场景标志
	let src = props.getUrlParam('scene');
	if ('fip' == src) {//fip代表会计平台
		voucherLinkBill.call(this, this.props, list.pageCode, list.tableCode);
	} 
}

function modifierMeta(props, meta) {
	meta[this.searchId].items.find((e) => e.attrcode === 'pk_fundorg').isMultiSelectedEnabled = true;
	// meta[this.searchId].items.find((e) => e.attrcode === 'pk_fundorg').queryCondition = {
	// 	funcode: props.getSearchParam('c'),//appcode获取
	// 	TreeRefActionExt: 'nccloud.web.tmpub.filter.FundOrgPermissionFilter'
	// };
	meta[this.searchId].items.find((e) => e.attrcode === 'pk_org').isMultiSelectedEnabled = true;
	// meta[this.searchId].items.find((e) => e.attrcode === 'pk_org').queryCondition = {
	// 	funcode: props.getSearchParam('c'),//appcode获取
	// 	TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
	// };
	//查询区域参照过滤
	meta[this.searchId].items.map((item) => {
		item.isShowDisabledData = true;
		//财务组织参照过滤
		if (item.attrcode == 'pk_org') {
			item.isTreelazyLoad = false;
			item.queryCondition = () => {
				return {
					funcode: appCode,
					TreeRefActionExt: 'nccloud.web.ifac.filter.FundFinanceOrgRelationFilter'
				}
			}
		}
		//资金组织参照过滤
		if (item.attrcode == 'pk_fundorg') {
			item.isTreelazyLoad = false;
			item.queryCondition = () => {
				return {
					funcode: appCode,
					pk_finorg: (props.search.getSearchValByField(list.searchCode, 'pk_org') || {}).value.firstvalue,
					TreeRefActionExt: 'nccloud.web.ifac.filter.FinanceFundOrgRelationFilter'
				}
			}
		}
		if (item.attrcode == 'pk_depositacc') { // 定期账户
			item.queryCondition = () => {
				let pk_org = (props.search.getSearchValByField(list.searchCode, 'pk_org') || {}).value.firstvalue;
				let pk_fundorg = (props.search.getSearchValByField(list.searchCode, 'pk_fundorg') || {}).value.firstvalue;
				let pk_currtype = (props.search.getSearchValByField(list.searchCode, 'pk_currtype') || {}).value.firstvalue;
				return {
					pk_org: pk_org,
					pk_currtype: pk_currtype,
					pk_fundorg: pk_fundorg,
					isDisableDataShow: false,//默认只加载启用的账户
					noConditionOrg: 'N',
					refnodename: '使用权参照',
					billtype: '36LJ',
					GridRefActionExt: 'nccloud.web.ifac.fixdepositreceipt.filter.NCCFixdepositReceiptObjFilter' //自定义增加的过滤条件	
				}
			}
		}
		if (item.attrcode == 'pk_settleacc') { // 结算账户
			item.queryCondition = () => {
				let pk_org = (props.search.getSearchValByField(list.searchCode, 'pk_org') || {}).value.firstvalue;
				let pk_fundorg = (props.search.getSearchValByField(list.searchCode, 'pk_fundorg') || {}).value.firstvalue;
				let pk_currtype = (props.search.getSearchValByField(list.searchCode, 'pk_currtype') || {}).value.firstvalue;
				return {
					pk_org: pk_org,
					pk_currtype: pk_currtype,
					pk_fundorg: pk_fundorg,
					isDisableDataShow: false,//默认只加载启用的账户
					noConditionOrg: 'Y',
					refnodename: '使用权参照',
					billtype: '36LJ',
					GridRefActionExt: 'nccloud.web.ifac.fixdepositapplly.filter.NCCFixdepositApplySettleaccjFilter' //自定义增加的过滤条件	
				}
			}
		}    
	});
	meta[this.tableId].pagination = true;
	meta[this.tableId].items = meta[this.tableId].items.map((item, key) => {
		item.width = 150;
		if (item.attrcode == 'vbillcode') {
			let scene = props.getUrlParam('scene');
			if(scene != null){
				item.render = (text, record, index) => {
					return (
						<a
							style={{ color: '#007ace', cursor: 'pointer',overflow:'hidden','text-overflow':'ellipsis' }}
							onClick={() => {
								go2CardCheck({
									url:`${baseReqUrl}`+'listtocardcheck.do',
									pk:  record[list.primaryId].value,
									ts: record.ts.value,
									checkTS:  false,
									checkSaga:false,
									fieldPK: list.primaryId,
									go2CardFunc: () =>{
										props.pushTo("/card", {
											status: "browse",
											id: record[this.primaryId].value,
											pagecode: card.pageCode,
											scene: scene,
											list: 'list'
										});
								}	
							})  
								
							}}
						>
							{record && record.vbillcode && record.vbillcode.value}
						</a>
					);
				};
			}else{
				item.render = (text, record, index) => {
					return (
						<a
							style={{ color: '#007ace', cursor: 'pointer',overflow:'hidden','text-overflow':'ellipsis' }}
							onClick={() => {
								go2CardCheck({
									url:`${baseReqUrl}`+'listtocardcheck.do',
									pk:  record[list.primaryId].value,
									ts: record.ts.value,
									checkTS: false,
									checkSaga:false,
									fieldPK: list.primaryId,
									go2CardFunc: () =>{
										props.pushTo("/card", {
											status: "browse",
											id: record[this.primaryId].value,
											pagecode: card.pageCode
										});
								}	
							})  
								
							}}
						>
							{record && record.vbillcode && record.vbillcode.value}
						</a>
					);
				};
			}
		}
		return item;
	});
	
	//添加操作列
	// meta[this.tableId].items.push({
	// 	attrcode: 'opr',
	// 	label: this.state.json['36340FDSR-000019'],/* 国际化处理： 操作*/
	// 	width: 250,
	// 	fixed: 'right',
	// 	className: "table-opr",
	// 	itemtype:'customer',
	// 	visible: true,
	// 	render: (text, record, index) => {
	// 		let buttonAry = [];
    //         let vbillstatus = record.vbillstatus && record.vbillstatus.value;
    //         let billstate = record.billstate && record.billstate.value;
    //         switch (billstate) {
    //             case "1": //待确认
    //                 buttonAry = [ EDIT_INNER_BTN, DELETE_INNER_BTN, CONFIRM_INNER_BTN ];
    //                 break;
    //             case "2": //已确认
    //                 buttonAry = [UNCONFIRM_INNER_BTN];
    //                 break;
    //             default:
    //                 break;
    //         }
			
	// 		return props.button.createOprationButton(buttonAry, {
	// 			area: list.bodyCode,
	// 			buttonLimit: btnLimit,
	// 			onButtonClick: (props, key) => bodyButtonClick.call( this,props, key, record, index)
	// 		});
	// 	}
	// });
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/