/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/
import { bodyButtonClick } from './bodyButtonClick';
import { list, card, appCode, btnLimit } from '../../cons/constant.js';
import { setDefOrg2ListSrchArea, setDefOrg2AdvanceSrchArea } from 'src/tmpub/pub/util/index';
import { COMMON_BTN, BTN_AREA,baseReqUrl } from '../../cons/constant';
import { buttonDisabled } from './buttonClick';
import { go2CardCheck } from "../../../../../tmpub/pub/util/index";
const { EDIT_INNER_BTN, DELETE_INNER_BTN, SUBMIT_INNER_BTN, UNSUBMIT_INNER_BTN, ENTRUST_INNER_BTN, UNENTRUST_INNER_BTN } = COMMON_BTN;

export default function (props) {
	props.createUIDom(
		{
			pagecode: this.pageId,//页面code
			
		},
		(data) => {
			//console.log(data, 'data')
			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta.call(this, props, meta)
					setDefOrg2AdvanceSrchArea(props, this.searchId, data);
					props.meta.setMeta(meta);
					setDefOrg2ListSrchArea(props, this.searchId, data);
				}
				if (data.button) {
					/* 按钮适配  第一步：将请求回来的按钮组数据设置到页面的 buttons 属性上 */
					let button = data.button;
					props.button.setButtons(button);
					props.button.setPopContent(DELETE_INNER_BTN, this.state.json['36340FDSA-000004']);/* 国际化处理： 确定要删除吗？*/
				}
			}
			buttonDisabled.call(this, props);
		}
	)
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
					pk_finorg: (props.search.getSearchValByField(list.searchCode, 'pk_fundorg') || {}).value.firstvalue,
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
					billtype: '36L7',
					GridRefActionExt: 'nccloud.web.ifac.fixdepositapplly.filter.NCCFixdepositApplyObjFilter' //自定义增加的过滤条件	
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
					billtype: '36L7',
					GridRefActionExt: 'nccloud.web.ifac.fixdepositapplly.filter.NCCFixdepositApplySettleaccjFilter' //自定义增加的过滤条件	
				}
			}
		}    
		// if(item.attrcode == 'businessvariety'){// 业务品种
		// 	item.queryCondition = () => {
		// 		//let pk_org = props.form.getFormItemsValue(this.formId, 'pk_org').value;
		// 		let pk_fundorg = (props.search.getSearchValByField(list.searchCode, 'pk_fundorg') || {}).value.firstvalue;
		// 		let pk_currtype = (props.search.getSearchValByField(list.searchCode, 'pk_currtype') || {}).value.firstvalue;
		// 		let applydate = (props.search.getSearchValByField(list.searchCode, 'applydate') || {}).value.firstvalue;
		// 		return {
		// 			//pk_org: pk_org,
		// 			pk_currtype: pk_currtype,
		// 			pk_fundorg: pk_fundorg,
		// 			applydate: applydate,
		// 			GridRefActionExt: 'nccloud.web.ifac.fixdepositapplly.filter.NCCBusinessvarietyFilter' //自定义增加的过滤条件	
		// 		}
		// 	}
		// }
		if(item.attrcode == 'pk_depostrate'){  //定期利率
			item.queryCondition = () => {
				return {
					GridRefActionExt: 'nccloud.web.ifac.depositreceipt.filter.NCCFRATERateFilter'//自定义参照过滤条件
                }
			}
			 
		}

	});
	meta[this.tableId].pagination = true;
	meta[this.tableId].items = meta[this.tableId].items.map((item, key) => {
		//item.width = 150;
		if (item.attrcode == 'vbillcode') {
			let scene = props.getUrlParam('scene');
			if(scene != null){
				item.render = (text, record, index) => {
					return (
						<a
							style={{ color: '#007ace', cursor: 'pointer', overflow: 'hidden', 'text-overflow': 'ellipsis' }}
							onClick={() => {
								go2CardCheck({
									url:`${baseReqUrl}`+'listtocardcheck.do',
									pk:  record[list.primaryId].value,
									ts: record.ts.value,
									checkTS: record.ts.value ? true : false,
									checkSaga:false,
									fieldPK: list.primaryId,
									go2CardFunc: () =>{
										props.pushTo("/card", {
											status: "browse",
											id: record[this.primaryId].value,
											pagecode: card.pageCode,
											scene: scene
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
							style={{ color: '#007ace', cursor: 'pointer', overflow: 'hidden', 'text-overflow': 'ellipsis' }}
							onClick={() => {
								go2CardCheck({
									url:`${baseReqUrl}`+'listtocardcheck.do',
									pk:  record[list.primaryId].value,
									ts: record.ts.value,
									checkTS: record.ts.value ? true : false,
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
	if(props.getUrlParam('scene') != 'linksce' && props.getUrlParam('scene') != 'fip'){
	meta[this.tableId].items.push({
		attrcode: 'opr',
		label: this.state.json['36340FDSA-000019'],/* 国际化处理： 操作*/
		width: 250,
		fixed: 'right',
		className: "table-opr",
		itemtype: 'customer',
		visible: true,
		render: (text, record, index) => {
			let buttonAry = [];
			let vbillstatus = record.vbillstatus && record.vbillstatus.value;
			let billstate = record.billstate && record.billstate.value; //单据状态
			// let busistatus = record.busistatus && record.busistatus.value;
			switch (billstate) {
				case "1": //待提交
					buttonAry = [SUBMIT_INNER_BTN, EDIT_INNER_BTN, DELETE_INNER_BTN,];
					break;
				// case "2": //已委托
				//     buttonAry = [UNENTRUST_INNER_BTN];
				//     break;
				case "2": //待审批
					buttonAry = [UNSUBMIT_INNER_BTN];
					break;
				case "3": //待委托
					buttonAry = [ENTRUST_INNER_BTN,UNSUBMIT_INNER_BTN];
					break;
				case "4": //办理中
				    buttonAry = [ UNENTRUST_INNER_BTN];
				    break;
				default:
					break;
			}

			return props.button.createOprationButton(buttonAry, {
				area: list.bodyCode,
				buttonLimit: btnLimit,
				onButtonClick: (props, key) => bodyButtonClick.call(this, key, record, index)
			});
		}
	});
}
	return meta;
}


/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/