/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/
import { base } from 'nc-lightapp-front';
let { NCTooltip,NCMenu } = base;
import { pageCodeList, searchId, tableId, app_code,gotocardcheck, pageCodeCard,rowcode,headcode,attrCode,pkname,formId } from '../../cons/constant.js';
import {loadMultiLang,setDefOrg2AdvanceSrchArea,setDefOrg2ListSrchArea,go2CardCheck} from '../../../../../tmpub/pub/util/index.js';
import { buttonVisible } from './buttonVisible';
const { Item } = NCMenu;
import { voucherLinkBill } from './voucherLinkBill';
export default function (props) {
	let that = this;
	
	props.createUIDom( 
		{
			pagecode: pageCodeList,//页面id 
			appcode:props.getUrlParam('c')
		},
		function (data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					//联查场景标志
					let src = props.getUrlParam('scene');
					if ('fip' == src ) {
						initData.call(this, props);
					}
					meta = modifierMeta(that, props, meta);
					props.meta.setMeta(meta);
					//高级查询区加载默认业务单元
					setDefOrg2AdvanceSrchArea(props,searchId,data);
					//列表查询区加载默认业务单元
					setDefOrg2ListSrchArea(props,searchId,data);
				}
				if (data.button) {
					/* 按钮适配  第一步：将请求回来的按钮组数据设置到页面的 buttons 属性上 */
					let button = data.button;
					let scene = props.getUrlParam('scene');
					props.button.setButtons(button);
					if(scene=="fip"){
						props.button.setButtonVisible(['Tally',
						'TallyGroup','Refresh',
						'UnTally'], false);
					}
				}
			}
			buttonVisible.call(this,props);
			
		}
	)
}
function initData(props) {
	//主键信息
	let srcid = props.getUrlParam('id');
	//联查场景标志
	let src = props.getUrlParam('scene');
	if ('fip' == src) {//fip代表会计平台
		voucherLinkBill.call(this,props, pageCodeList, formId);
	} 
}
function modifierMeta(that, props, meta) {
	let scene=props.getUrlParam('scene');
	meta[tableId].pagination = true;
	meta[tableId].items = meta[tableId].items.map((item, key) => {
		item.isShowDisabledData = false;
		if (item.attrcode == attrCode) {
			item.render = (text, record, index) => {
				return (
					<a
						style={{ cursor: 'pointer' }}
						onClick={() => {
							go2CardCheck({
								props,
								url: gotocardcheck,
								pk: record[pkname].value,
								ts: record["ts"].value,
								checkTS: false,
								fieldPK: pkname,
								go2CardFunc: () => {
									props.pushTo('/card', {
										status: 'browse',
										id: record[pkname].value,
										islisttocard: "islisttocard",
										scene
									});
								}
							})
						}}
					>
						{record && record[attrCode] && record[attrCode].value}
					</a>
				);
			};
		}
		return item;
	});
	// pk_depositreceipt   存单号 pk_varieties 定期业务品种
	meta[searchId].items.map((item) => {
		item.isShowDisabledData = true;
		if (item.attrcode == 'pk_org' ) {
			item.queryCondition = () => {
				return {
					funcode: app_code,
					//TreeRefActionExt: 'nccloud.web.tmpub.filter.FundOrgPermissionFilter'
					
					pk_finorg: (props.search.getSearchValByField(searchId, 'pk_depositorg') || {}).value.firstvalue, 
					TreeRefActionExt:"nccloud.web.ifac.filter.FundFinanceOrgRelationFilter"    
				};
			};
		}

		//资金组织过滤
		if (item.attrcode == 'pk_depositorg') {
			item.queryCondition = () => {
				return {
					funcode: app_code,
					pk_fundpayorg: (props.search.getSearchValByField(searchId, 'pk_org') || {}).value.firstvalue, 
					TreeRefActionExt: 'nccloud.web.ifac.filter.FinanceFundOrgRelationFilter'
				};
			};
		}
		if (item.attrcode == 'pk_depositreceipt' ) {
			item.queryCondition = () => {
				item.queryCondition = () => {
					return {
						funcode: app_code,
						pk_depositorg: (props.search.getSearchValByField(searchId, 'pk_org') || {}).value.firstvalue, 
						//TreeRefActionExt:"ifac.refer.depositreceipt.DepositReceiptALLRef"
					};
				};
			};
		}
		if (item.attrcode == 'pk_varieties' ) {
			item.queryCondition = () => {
				let pk_depositorg = props.search.getSearchValByField(searchId, 'pk_depositorg').value.firstvalue;
				return {
					pk_org: pk_depositorg,
					funcode: app_code,
					
				};
			};
		}
		//定期利率参照过滤
		if (item.attrcode == 'pk_depostrate') {
			//item.isTreelazyLoad = false;
			item.queryCondition = () => {
				return {
					ratetype:"FRATE",
					//pk_org: (props.search.getSearchValByField(ist.searchCode, 'pk_org') || {}).value.firstvalue,
					GridRefActionExt: 'nccloud.web.ifac.regularvarietyset.filter.RegularsetDepositrateFilter'
				}					   
			}
		}
		//活期
		if (item.attrcode == 'pk_aiacrate') {
			item.isTreelazyLoad = false;
			item.queryCondition = () => {
				return {
					ratetype:"CRATE",
					pk_org: (props.search.getSearchValByField(searchId, 'pk_org') || {}).value.firstvalue,
					GridRefActionExt: 'nccloud.web.ifac.regularvarietyset.filter.RegularsetAiacrateFilter'
				}					   
			}
		}
			//定期账户参照过滤
			if (item.attrcode == 'pk_depositacc') {
				item.isTreelazyLoad = false;
				item.queryCondition = () => {
					return {
						funcode:app_code,
						isSelect:"Y",
						noConditionOrg:'Y',
						pk_currtype: (props.search.getSearchValByField(searchId, 'pk_currtype') || {}).value.firstvalue,
						pk_org: (props.search.getSearchValByField(searchId, 'pk_org') || {}).value.firstvalue,
						pk_fundorg: (props.search.getSearchValByField(searchId, 'pk_depositorg') || {}).value.firstvalue,
						GridRefActionExt: 'nccloud.web.ifac.fixeddatewithdrawapply.filter.NCCPkDepositaccFilter'
					}
				}
			}
			//结算账户参照过滤
			if (item.attrcode == 'pk_settleacc') {
				item.isTreelazyLoad = false;
				item.queryCondition = () => {
					return {
						funcode:app_code,
						isSelect:"Y",
						noConditionOrg:'Y',
						pk_org: (props.search.getSearchValByField(searchId, 'pk_org') || {}).value.firstvalue,
						pk_fundorg: (props.search.getSearchValByField(searchId, 'pk_depositorg') || {}).value.firstvalue,
						pk_currtype: (props.search.getSearchValByField(searchId, 'pk_currtype') || {}).value.firstvalue,
						GridRefActionExt: 'nccloud.web.ifac.fixeddatewithdrawapply.filter.NCCPkSettleaccFilter'
					}
				}
			}
	});
	meta[tableId].items.push({
		attrcode: 'opr',
		label: loadMultiLang(props, '36300-000032')/* 国际化处理： 操作*/,
		width: 0,
		fixed: 'right',
		className: "table-opr",
		visible: true,
		itemtype: 'customer',
		render: (text, record, index) => {
			return (props.button.createErrorButton({
				record,
				showBack: false,
				sucessCallBack: () => {
					let buttonAry=[];
					return props.button.createOprationButton(buttonAry,
						{
							area: rowcode,//区域编码
							buttonLimit: 3,//按钮显示个数
							// onButtonClick: (props, key) => { buttonClick.call(that, props, key, text, record, index); }
						});
				}
			}));
			//end tangleic
		}
	});
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/