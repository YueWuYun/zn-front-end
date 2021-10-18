/*pmFWCFu5nhKkBzYmrkBakSyfTwhWpk4XRVJggXxHt0O/7C0qG9iK3AHbi3mv/Fzl*/
import { base, ajax } from 'nc-lightapp-front';
import { jsoncode, requesturl } from '../../util/const.js';
let { NCPopconfirm } = base;
// 使用权参照
import BankaccSubUseTreeGridRef from '../../../../../uapbd/refer/pub/BankaccSubUseTreeGridRef';
import CurrtypeGridRef from '../../../../../uapbd/refer/pubinfo/CurrtypeGridRef';
// 缴款单位计划项目
import FundPlanTreeRef from '../../../../../uapbd/refer/fiacc/FundPlanTreeRef';
//资金组织
import FundOrgTreeRef from '../../../../../uapbd/refer/org/FundOrgTreeRef';
import { buttonVisible } from './buttonVisible';
import { bodyButtonClick } from './bodyButtonClick';
import { setCardShouderBtnUseful } from "../../util/index";
import { orgVersionView } from "../../../../../tmpub/pub/util/version/index.js";
import { loadMultiLang } from "../../../../../tmpub/pub/util/index";
import { afterEvent } from './index';
const formId = jsoncode.formcode;
const tableId = jsoncode.ctablecode;
const pageId = jsoncode.cpageid;
export default function (props) {
	let that = this;
	props.createUIDom(
		{
			pagecode: pageId,//页面id
			//appid: '0001Z61000000001SUL1'//注册按钮的id
			// appid: jsoncode.appid
		},
		function (data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					modifierMeta(that, props, meta)
					props.meta.setMeta(meta, () => {
						//新增时，资金组织可编辑，其余字段不可编辑
						if (props.getUrlParam('status') == 'add') {
							props.initMetaByPkorg();
						}
						//复制或修改时，资金组织不可编辑
						if (props.getUrlParam('status') == 'edit' || props.getUrlParam('status') == 'copy') {
							that.props.form.setFormItemsDisabled(jsoncode.formcode, { 'pk_org': true });
						}
					});
					if (props.getUrlParam('status') == 'copy') {
						//解决从列表态 复制 时子表不能编辑的问题，不明白这样为啥，但是好使，后续若引发bug再修复
						props.cardTable.addRow(tableId);
					}
					//组织多版本
					orgVersionView(props, jsoncode.formcode);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					buttonVisible.call(that, props);
					setCardShouderBtnUseful(that.props);
				}
				if (data.context) {
					let context = data.context;
					that.setState({
						curr_pk_org: context.pk_org,
						curr_orgname: context.org_Name,
						curr_pk_org_v: context.pk_org_v,
						curr_orgname_v: context.org_v_Name,
					});
					if (props.getUrlParam('status') === 'add') {
						that.props.form.setFormItemsValue(jsoncode.formcode,
							{
								'pk_org': {
									value: context.pk_org,
									display: context.org_Name
								},
								'pk_org_v': {
									value: that.state.curr_pk_org_v,
									display: that.state.curr_orgname_v
								}
							}
						);
						if (context.pk_org) {
							let pk_org = {
								value: context.pk_org,
								display: context.org_Name
							};
							//最后一个参数判定为 默认给pk_org赋值时启动 解决oldvalue 和 newvlaue都有值的问题
							afterEvent.call(that, that.props, jsoncode.formcode, "pk_org", pk_org, null, null, null, null, true);
							that.props.resMetaAfterPkorgEdit();
							that.props.form.setFormItemsDisabled(jsoncode.formcode, { 'pk_org': false });
						}
					}
				}
			}
		}
	)
}

function modifierMeta(that, props, meta) {
	let status = props.getUrlParam('status');
	meta[formId].status = status;
	meta[tableId].status = status;
	//上收组织跨集团
	meta[formId].items.find((e) => e.attrcode == 'pk_gatherorg').isShowUnit = true;
	//参照历史记录不显示
	meta[tableId].items.find((e) => e.attrcode === 'pk_bankacc_p').showHistory = false;
	meta['childform2_deliveryapply_01'].items.find((e) => e.attrcode === 'pk_bankacc_p').showHistory = false;

	meta[formId].items.map((item) => {
		if (item.attrcode == 'pk_org_v') {
			item.queryCondition = () => {
				let data = props.form.getFormItemsValue(formId, 'vbillcode').value;
				return { vbillcode: data };
			};
		}
		if (item.attrcode == 'pk_org') {
			item.queryCondition = () => {
				return {
					//funcode: jsoncode.appcode,
					//用来解决复制小应用的组织权限
					funcode: props.getSearchParam('c'),
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				};
			};
		}
		// 上收组织 根据用户权限过滤
		// 上收组织根据pk_org进行过滤，参考delivery  beforeEvent.js  pk_org_p，先一放
		// if (item.attrcode == 'pk_gatherorg') {
		// 	item.queryCondition = () => {
		// 		return {
		// 			funcode: jsoncode.appcode,
		// 			// 过滤已停用
		// 			isShowDisabledData: 'N',
		// 			TreeRefActionExt: 'nccloud.web.tmpub.filter.FundOrgPermissionFilter'
		// 		};
		// 	};
		// }
	});
	meta[tableId].items.map((item) => {
		// 	//缴款银行账户参照过滤
		if (item.attrcode == 'pk_bankacc_p') {
			item.render = function (text, record, index) {
				return (
					BankaccSubUseTreeGridRef({
						queryCondition: () => {
							return {
								pk_org: props.form.getFormItemsValue(formId, 'pk_org').value,
								refnodename: loadMultiLang(props, '36320DA-000021'),/* 国际化处理： 使用权参照*/
								pk_currtype: props.form.getFormItemsValue(formId, 'pk_currtype').value,
								GridRefActionExt: 'nccloud.web.sf.delivery.deliveryapply.filter.DefaultPayBankRefAccFilter,nccloud.web.sf.delivery.deliveryapply.filter.DeliveryApplyCurrencyRefBankAccFilter'
							};
						}
					})
				);
			}
		}
		//上面的是自己写的，有点问题，先用allocateapply业务的
		if (item.attrcode == 'pk_accid') {
			item.queryCondition = () => {
				return {
					pk_payorg: props.form.getFormItemsValue(formId, 'pk_gatherorg').value,
					//用以区分 后台参照类中的pk_org 命名不同会引起冲突
					pk_org_allocateapply: props.form.getFormItemsValue(formId, 'pk_org').value,
					pk_currtype: props.form.getFormItemsValue(formId, 'pk_currtype').value,
					GridRefActionExt:
						'nccloud.web.sf.allocation.allocateapply.filter.AllocateApplyPayOrgRefAccFilter,' +
						'nccloud.web.sf.allocation.allocateapply.filter.AllocateApplyCurrentTypeRefAccFilter,' +
						'nccloud.web.sf.allocation.allocateapply.filter.DefaultRefAccFilter'
				};
			};
		}
		// 上收银行账户 上面的是自己写的，有点问题，先用delivery业务的
		if (item.attrcode == 'pk_bankacc_r') {
			item.showHistory = false;
			item.render = function (text, record, index) {
				return (
					BankaccSubUseTreeGridRef({
						queryCondition: () => {
							//这块与delivery业务不同，因为其需要参照上收组织取值
							let bankacc_r_pk_org = props.form.getFormItemsValue(formId, 'pk_gatherorg');
							if (bankacc_r_pk_org && bankacc_r_pk_org.value) {
								bankacc_r_pk_org = bankacc_r_pk_org.value;
							} else {
								//这块与delivery业务不同，因为其需要参照上收组织取值，若上收组织没值，需要看财务组织的取值，同老nc
								bankacc_r_pk_org = props.form.getFormItemsValue(formId, 'pk_org') && props.form.getFormItemsValue(formId, 'pk_org').value;
							}
							let bankacc_r_currtype = props.form.getFormItemsValue(formId, 'pk_currtype');
							if (bankacc_r_currtype && bankacc_r_currtype.value) {
								bankacc_r_currtype = bankacc_r_currtype.value;
							} else {
								bankacc_r_currtype = null;
							}
							return {
								// 这里对record.values.materiel要做一下非空校验
								pk_org: bankacc_r_pk_org,
								pk_currtype: bankacc_r_currtype,
								refnodename: loadMultiLang(props, '36320DA-000021'),/* 国际化处理： 使用权参照*/
								//自定义增加的过滤条件
								GridRefActionExt: 'nccloud.web.tmpub.filter.BanksubaccNoInnerAccFilter4NCC,nccloud.web.tmpub.filter.BanksubaccNoFrozenFilter4NCC,nccloud.web.tmpub.filter.BanksubaccOnlyCurrent4NCC,nccloud.web.sf.delivery.delivery.filter.DefaultPayBankRefAccFilter4NCC'
							};
						}
					})
				);
			}
		}
		// 缴款单位计划项目 
		if (item.attrcode == 'pk_planitem_p') {
			item.render = function (text, record, index) {
				return (
					FundPlanTreeRef({
						queryCondition: () => {
							let pk_planitem_p_pk_org_p = props.cardTable.getValByKeyAndIndex(jsoncode.ctablecode, index, 'pk_org');
							if (pk_planitem_p_pk_org_p && pk_planitem_p_pk_org_p.value) {
								pk_planitem_p_pk_org_p = pk_planitem_p_pk_org_p.value;
							} else {
								pk_planitem_p_pk_org_p = null;
							}

							let pk_planitem_p_pk_group = props.form.getFormItemsValue(jsoncode.ctablecode, 'pk_group');
							if (pk_planitem_p_pk_group && pk_planitem_p_pk_group.value) {
								pk_planitem_p_pk_group = pk_planitem_p_pk_group.value;
							} else {
								pk_planitem_p_pk_group = null;
							}
							return {
								pk_org: pk_planitem_p_pk_org_p,
								//pk_group: pk_planitem_p_pk_group,
								//自定义增加的过滤条件
							};
						}
					})
				);
			}
		}
	});
	meta['childform2_deliveryapply_01'].items.map((item) => {
		// 	//缴款银行账户参照过滤
		if (item.attrcode == 'pk_bankacc_p') {
			item.render = function (text, record, index) {
				return (
					BankaccSubUseTreeGridRef({
						queryCondition: () => {
							return {
								pk_org: props.form.getFormItemsValue(formId, 'pk_org').value,
								refnodename: loadMultiLang(props, '36320DA-000021'),/* 国际化处理： 使用权参照*/
								pk_currtype: props.form.getFormItemsValue(formId, 'pk_currtype').value,
								GridRefActionExt: 'nccloud.web.sf.delivery.deliveryapply.filter.DefaultPayBankRefAccFilter,nccloud.web.sf.delivery.deliveryapply.filter.DeliveryApplyCurrencyRefBankAccFilter'
							};
						}
					})
				);
			}
		}

		//上面的是自己写的，有点问题，先用allocateapply业务的
		if (item.attrcode == 'pk_accid') {
			item.queryCondition = () => {
				return {
					pk_payorg: props.form.getFormItemsValue(formId, 'pk_gatherorg').value,
					//用以区分 后台参照类中的pk_org 命名不同会引起冲突
					pk_org_allocateapply: props.form.getFormItemsValue(formId, 'pk_org').value,
					pk_currtype: props.form.getFormItemsValue(formId, 'pk_currtype').value,
					GridRefActionExt:
						'nccloud.web.sf.allocation.allocateapply.filter.AllocateApplyPayOrgRefAccFilter,' +
						'nccloud.web.sf.allocation.allocateapply.filter.AllocateApplyCurrentTypeRefAccFilter,' +
						'nccloud.web.sf.allocation.allocateapply.filter.DefaultRefAccFilter'
				};
			};
		}

		// 缴款单位计划项目 
		if (item.attrcode == 'pk_planitem_p') {
			item.render = function (text, record, index) {
				return (
					FundPlanTreeRef({
						queryCondition: () => {
							let pk_planitem_p_pk_org_p = props.cardTable.getValByKeyAndIndex(jsoncode.ctablecode, index, 'pk_org');
							if (pk_planitem_p_pk_org_p && pk_planitem_p_pk_org_p.value) {
								pk_planitem_p_pk_org_p = pk_planitem_p_pk_org_p.value;
							} else {
								pk_planitem_p_pk_org_p = null;
							}

							let pk_planitem_p_pk_group = props.form.getFormItemsValue(jsoncode.ctablecode, 'pk_group');
							if (pk_planitem_p_pk_group && pk_planitem_p_pk_group.value) {
								pk_planitem_p_pk_group = pk_planitem_p_pk_group.value;
							} else {
								pk_planitem_p_pk_group = null;
							}
							return {
								pk_org: pk_planitem_p_pk_org_p,
								//pk_group: pk_planitem_p_pk_group,
								//自定义增加的过滤条件
							};
						}
					})
				);
			}
		}
	});
	let multiLang = props.MutiInit.getIntl('2052');
	let porCol = {
		attrcode: 'opr',
		label: loadMultiLang(props, '36320DA-000022'),/* 国际化处理： 操作*/
		visible: true,
		fixed: 'right',
		width: 200,
		className: "table-opr",
		itemtype: 'customer',
		render(text, record, index) {
			return props.button.createOprationButton(record.expandRowStatus ? ['closedown'] : ['opendown'], {
				area: 'card_inner',
				buttonLimit: 3,
				onButtonClick: (props, key) => bodyButtonClick.call(that, props, key, text, record, index)
			});
		}
	};
	meta[tableId].items.push(porCol);

	return meta;
}


/*pmFWCFu5nhKkBzYmrkBakSyfTwhWpk4XRVJggXxHt0O/7C0qG9iK3AHbi3mv/Fzl*/