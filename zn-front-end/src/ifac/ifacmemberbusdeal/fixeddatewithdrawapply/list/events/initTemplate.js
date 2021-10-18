/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/
import { base } from 'nc-lightapp-front';
let { NCTooltip, NCMenu } = base;
import { buttonVisible } from './buttonVisible';
import { bodyButtonClick } from './bodyButtonClick';
import { pageCodeList, searchId, tableId, app_code, app_id, pageCodeCard, attrCode, pkname,base_url } from '../../cons/constant.js';
import { loadMultiLang, setDefOrg2AdvanceSrchArea, setDefOrg2ListSrchArea,go2CardCheck } from '../../../../../tmpub/pub/util/index.js';
const { Item } = NCMenu;
export default function (props) {
	let that = this;

	props.createUIDom(
		{
			pagecode: pageCodeList,//页面id 
			appcode: props.getUrlParam('c')
		},
		function (data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta(that, props, meta);
					props.meta.setMeta(meta);
					//高级查询区加载默认业务单元
					setDefOrg2AdvanceSrchArea(props, searchId, data);
					//列表查询区加载默认业务单元
					setDefOrg2ListSrchArea(props, searchId, data);
				}
				if (data.button) {
					/* 按钮适配  第一步：将请求回来的按钮组数据设置到页面的 buttons 属性上 */
					let button = data.button;
					props.button.setButtons(button);
				}
			}
			buttonVisible.call(this, props);
			props.button.setPopContent('TableDelete', loadMultiLang(props, '36340FDWA-000035'));/* 国际化处理： 确认要删除吗?*/
		}
	)
}
function modifierMeta(that, props, meta) {
	meta[tableId].pagination = true;
	//币种设置为多选
	meta[searchId].items.find((e) => e.attrcode === 'pk_currtype').isMultiSelectedEnabled = true;
	meta[searchId].items.find((e) => e.attrcode === 'pk_group').isMultiSelectedEnabled = true;
	meta[searchId].items.find((e) => e.attrcode === 'pk_depostrate').isMultiSelectedEnabled = true;
	meta[searchId].items.find((e) => e.attrcode === 'pk_aiacrate').isMultiSelectedEnabled = true;
	meta[searchId].items.find((e) => e.attrcode === 'billmaker').isMultiSelectedEnabled = true;
	meta[searchId].items.find((e) => e.attrcode === 'approver').isMultiSelectedEnabled = true;
	meta[searchId].items.find((e) => e.attrcode === 'creator').isMultiSelectedEnabled = true;
	meta[searchId].items.find((e) => e.attrcode === 'modifier').isMultiSelectedEnabled = true;
	//查询区域参照过滤
	meta[searchId].items.map((item) => { 
		item.isShowDisabledData = true;
		//财务组织参照过滤
		if (item.attrcode == 'pk_org') {
			item.isTreelazyLoad = false;
			item.queryCondition = () => {
				return {
					funcode: app_code,
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				}
			}
		}
		//资金组织参照过滤
		if (item.attrcode == 'pk_fundorg') {
			item.isShowUnit = true; 
			item.isTreelazyLoad = false;
			item.queryCondition = () => {
				return {
					pk_finorg: (props.search.getSearchValByField(searchId, 'pk_org') || {}).value.firstvalue,
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceFundOrgRelationFilter'
				}
			}
		}
		//定期利率参照过滤
		if (item.attrcode == 'pk_depostrate') {
			item.isTreelazyLoad = false;
			item.queryCondition = () => {
				return {
					ratetype:"FRATE",
					pk_org: (props.search.getSearchValByField(searchId, 'pk_org') || {}).value.firstvalue,
					GridRefActionExt: 'nccloud.web.tmpub.tmbd.ratecode.action'
				}					   
			}
		}
		//活期利率参照过滤
		if (item.attrcode == 'pk_aiacrate') {
			item.isTreelazyLoad = false;
			item.queryCondition = () => {
				return {
					ratetype:"CRATE",
					pk_org: (props.search.getSearchValByField(searchId, 'pk_org') || {}).value.firstvalue,
					GridRefActionExt: 'nccloud.web.tmpub.tmbd.ratecode.action'
				}					   
			}
		}
		//存单号（定期存单）参照过滤
		if (item.attrcode == 'pk_depositreceipt') {
			item.isTreelazyLoad = false;
			item.queryCondition = () => {
				return {
					isSelect:"Y",
					pk_fundorg: (props.search.getSearchValByField(searchId, 'pk_fundorg') || {}).value.firstvalue,
					pk_depositorg: (props.search.getSearchValByField(searchId, 'pk_org') || {}).value.firstvalue,
					pk_currtype: (props.search.getSearchValByField(searchId, 'pk_currtype') || {}).value.firstvalue,
					GridRefActionExt: 'nccloud.web.ifac.fixeddatewithdrawapply.filter.NCCPkDepositreceiptFilter'
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
					pk_fundorg: (props.search.getSearchValByField(searchId, 'pk_fundorg') || {}).value.firstvalue,
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
					pk_fundorg: (props.search.getSearchValByField(searchId, 'pk_fundorg') || {}).value.firstvalue,
					pk_currtype: (props.search.getSearchValByField(searchId, 'pk_currtype') || {}).value.firstvalue,
					GridRefActionExt: 'nccloud.web.ifac.fixeddatewithdrawapply.filter.NCCPkSettleaccFilter'
				}
			}
		}
	});
	let link = props.getUrlParam('scene');
	meta[tableId].items = meta[tableId].items.map((item, key) => {
		if (item.attrcode == attrCode) {
			item.render = (text, record, index) => {
				return (
					<a
						style={{ cursor: 'pointer' }} 
						onClick={() => {
							go2CardCheck({
								props,
								url: base_url + 'FDWAgotocardcheck.do',
								pk:record[pkname].value,
								ts:record["ts"].value,
								fieldPK: pkname,
								//动作编码（权限检查 空则不检查）
								actionCode:null,
								//权限编码（权限检查 空则不检查）
								permissionCode:null,
								//是否进行saga检查(默认检查，不涉及云原生改造的单据不用检查)
								checkSaga : false,
								//是否进行ts检查（默认检查，非操作按钮导致的跳转不用检查）
								checkTS : false,
								go2CardFunc: () => {
									props.pushTo('/card', {
										status: 'browse',
										id: record[pkname].value,
										scene:link,
									});
								}
							});
							
						}}
					>
						{record && record[attrCode] && record[attrCode].value}
					</a>
				);
			};
		}
		return item;
	});
	//添加操作列
	if (!link) {
		meta[tableId].items.push({
			attrcode: 'opr',
			label: loadMultiLang(props, '36340FDWA-000017'),
			// label: '操作',
			itemtype: 'customer',
			width: 200,
			fixed: 'right',
			className: "table-opr",
			visible: true,
			render: (text, record, index) => {
				let isnet = true;
				let buttonAry = [];
				if (record.billstate && record.billstate.value == '1') {
					buttonAry = ['TableCommit', 'TableEdit', 'TableDelete'];
				} else if (record.billstate && record.billstate.value == '2') {
					buttonAry = ['TableUnCommit'];
				} else if (record.billstate && record.billstate.value == '3') {
					buttonAry = ['TableConsign','TableUnCommit'];
				} else {
					buttonAry = ['TableUnConsign'];
				}
				return props.button.createOprationButton(buttonAry, {
					area: "list_inner",
					buttonLimit: 3,
					onButtonClick: (props, key) => bodyButtonClick.call(that, props, key, text, record, index)
				});
			}
		});
	}
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/