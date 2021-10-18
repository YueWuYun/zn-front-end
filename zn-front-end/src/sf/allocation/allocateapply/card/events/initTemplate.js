/*pmFWCFu5nhKkBzYmrkBakSyfTwhWpk4XRVJggXxHt0O/7C0qG9iK3AHbi3mv/Fzl*/
import { createPage, ajax, base, toast } from 'nc-lightapp-front';
let { NCPopconfirm, NCIcon } = base;
import { bodyButtonClick } from './bodyButtonClick';
import { buttonVisible } from './index';
import { base_url, card_from_id, card_table_id, card_page_id, module_id, app_code, card_editform_id, dataSource, islink } from '../../cons/constant';
import { afterEvent } from './index';
import { orgVersionView } from "../../../../../tmpub/pub/util/version/index.js";
//财务组织(所有集团)
import FinanceOrgAllGroupAllDataTreeRef from '../../../../../uapbd/refer/org/FinanceOrgByAllGroupTreeRef';
import { setCardShouderBtnUseful,getBodyBtnArr } from "../../util/index";
//引入缓存
import { deleteCacheDataForList, setDefData, getDefData } from '../../../../../tmpub/pub/util/cache';
import { setPropCache, saveMultiLangRes, loadMultiLang } from "../../../../../tmpub/pub/util/index";
const formId = card_from_id;
const editFormId = card_editform_id
const tableId = card_table_id;
const pageId = card_page_id;
export default function (props) {
	let that = this;
	props.createUIDom(
		{
			pagecode: pageId,//页面id
			appcode: props.getUrlParam('c')
			// appid: '0001Z610000000026X3G'//注册按钮的id
		},
		function (data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					modifierMeta(props, meta, that)
					props.meta.setMeta(meta, () => {
						//新增时，资金组织可编辑，其余字段不可编辑
						if (props.getUrlParam('status') == 'add') {
							props.initMetaByPkorg();
						}
						//复制或修改时，资金组织不可编辑
						if (props.getUrlParam('status') == 'edit' || props.getUrlParam('status') == 'copy') {
							that.props.form.setFormItemsDisabled(card_from_id, { 'pk_org': true });
							//设定操作信息中字段不可编辑 (疑似原因为修改状态影响 现平台未修复需要手动设定)
							let editItemArr = {
								'billmaker': true, 'approver': true, 'submituser': true, 'returnuser': true,
								'applydate': true, 'dapprovedate': true, 'submitdate': true, 'returndate': true,
							};
							that.props.form.setFormItemsDisabled(card_from_id, editItemArr);
						}
					});
					orgVersionView(that.props, card_from_id);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					buttonVisible.call(that, props);
					setCardShouderBtnUseful(props);
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
						that.props.form.setFormItemsValue(card_from_id,
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
							afterEvent.call(that, that.props, card_from_id, "pk_org", pk_org, null, null, null, null, true);
							that.props.resMetaAfterPkorgEdit();
							that.props.form.setFormItemsDisabled(card_from_id, { 'pk_org': false });
						}
					}
				}
			}
		}
	)
}

function modifierMeta(props, meta, that) {
	let status = props.getUrlParam('status');
	meta[formId].status = status;
	meta[tableId].status = status;
	status = status === 'add' ? 'edit' : status

	//下拨组织跨集团处理
	meta[formId].items.find((e) => e.attrcode == 'pk_payorg').isShowUnit = true;

	//pk_org 按角色过滤
	meta[formId].items.map((item) => {
		if (item.attrcode == 'pk_org') {
			item.queryCondition = () => {
				return {
					// funcode: app_code,
					funcode: props.getSearchParam('c'),//动态获取appcode 用于复制时过滤
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				};
			};
		}
		//下拨组织 会根据交易类型改变参照 这里在编辑前事件中处理
	});


	//参照过滤 表体过滤
	meta[tableId].items.map((item) => {
		//币种影响银行账户 以及 收款银行账户默认参照过滤条件
		if (item.attrcode == 'pk_bankacc_r') {
			item.showHistory = false;
			item.queryCondition = () => {
				return {
					pk_org: props.form.getFormItemsValue(formId, 'pk_org').value,
					refnodename: loadMultiLang(props, '36320AA-000025'),/* 国际化处理： 使用权参照*/
					pk_currtype: props.form.getFormItemsValue(formId, 'pk_currtype').value,
					GridRefActionExt:
						'nccloud.web.sf.allocation.allocateapply.filter.AllocateApplyCurrentRefBankAccFilter,' +
						'nccloud.web.sf.allocation.allocateapply.filter.DefaultRefRBankAccFilter'
				};
			};
		}
		/**
		 * 下拨组织如果是资金组织时影响内部账户  需要与编辑后事件中 银行账户陪着过滤
			币种影响内部账户
			内部账户默认过滤
		 */
		if (item.attrcode == 'pk_accid') {
			item.queryCondition = () => {
				return {
					pk_payorg: props.form.getFormItemsValue(formId, 'pk_payorg').value,
					//用以区分 后台参照类中的pk_org 命名不同会引起冲突
					pk_org_allocateapply: props.form.getFormItemsValue(formId, 'pk_org').value,
					pk_currtype: props.form.getFormItemsValue(formId, 'pk_currtype').value,
					GridRefActionExt:
						'nccloud.web.sf.allocation.allocateapply.filter.AllocateApplyPayOrgRefAccFilter,' +
						'nccloud.web.sf.allocation.allocateapply.filter.AllocateApplyCurrentTypeRefAccFilter,' +
						'nccloud.web.sf.allocation.allocateapply.filter.DefaultRefAccFilter'
					//'nccloud.web.sf.delivery.delivery.filter.DefaultRefAccFilter4NCC'
				};
			};
		}
		//添加 pk_payorg过滤 与 币种过滤
		//下拨申请单下拨银行账户默认过滤
		if (item.attrcode == 'pk_bankacc_p') {
			item.queryCondition = () => {
				let pk_payorg_filter = props.form.getFormItemsValue(formId, 'pk_payorg');//币种
				if (pk_payorg_filter.value != null) {
					pk_payorg_filter = pk_payorg_filter.value;
				} else {
					pk_payorg_filter = '';
				}
				return {
					pk_org: pk_payorg_filter,
					pk_currtype: props.form.getFormItemsValue(formId, 'pk_currtype').value,
					refnodename: loadMultiLang(props, '36320AA-000025'),/* 国际化处理： 使用权参照*/
					//noConditionOrg: 'Y',
					GridRefActionExt:
						'nccloud.web.sf.allocation.allocateapply.filter.DefaultRefPBankAccFilter'//默认过滤 + 组织过滤
						+ ',nccloud.web.sf.delivery.delivery.filter.DefaultPayBankRefAccFilter4NCC'//币种
				};
			};
		}

		//币种影响客商银行账户 后台查询问题 待平台修改
		if (item.attrcode == 'pk_custbankacc') {
			item.queryCondition = () => {
				return {
					pk_cust: props.cardTable.getChangedRows(card_table_id)[0].values.pk_company_r.value,
					pk_currtype: props.form.getFormItemsValue(formId, 'pk_currtype').value,
					accclass: 2,//收款客商 参数为‘2’ 
					GridRefActionExt:
						'nccloud.web.sf.allocation.allocateapply.filter.AllocateApplyCurrentRefCustBankAccFilter'
				};
			};
		}
		//计划项目过滤 状态未封存，且建立日期小于等于业务日期
		if (item.attrcode == 'pk_planitem_r') {
			item.queryCondition = () => {
				return {
					pk_org: props.form.getFormItemsValue(formId, 'pk_org').value,
					TreeRefActionExt:
						'nccloud.web.sf.allocation.allocateapply.filter.AllocateApplyDefaultRefPlanItemFilter'
				};
			};
		}
		//收款客商过滤
		if (item.attrcode == 'pk_company_r') {
			item.queryCondition = () => {
				return {
					pk_org: props.form.getFormItemsValue(formId, 'pk_org').value
				};
			};
		}
	});
	//参照过滤 侧拉表体过滤
	meta[editFormId].items.map((item) => {
		//币种影响银行账户 以及 收款银行账户默认参照过滤条件
		if (item.attrcode == 'pk_bankacc_r') {
			item.showHistory = false;
			item.queryCondition = () => {
				return {
					pk_org: props.form.getFormItemsValue(formId, 'pk_org').value,
					refnodename: loadMultiLang(props, '36320AA-000025'),/* 国际化处理： 使用权参照*/
					pk_currtype: props.form.getFormItemsValue(formId, 'pk_currtype').value,
					GridRefActionExt:
						'nccloud.web.sf.allocation.allocateapply.filter.AllocateApplyCurrentRefBankAccFilter,' +
						'nccloud.web.sf.allocation.allocateapply.filter.DefaultRefRBankAccFilter'
				};
			};
		}
		/**
		 * 下拨组织如果是资金组织时影响内部账户  需要与编辑后事件中 银行账户陪着过滤
			币种影响内部账户
			内部账户默认过滤
		 */
		if (item.attrcode == 'pk_accid') {
			item.queryCondition = () => {
				return {
					pk_payorg: props.form.getFormItemsValue(formId, 'pk_payorg').value,
					//用以区分 后台参照类中的pk_org 命名不同会引起冲突
					pk_org_allocateapply: props.form.getFormItemsValue(formId, 'pk_org').value,
					pk_currtype: props.form.getFormItemsValue(formId, 'pk_currtype').value,
					GridRefActionExt:
						'nccloud.web.sf.allocation.allocateapply.filter.AllocateApplyPayOrgRefAccFilter,' +
						'nccloud.web.sf.allocation.allocateapply.filter.AllocateApplyCurrentTypeRefAccFilter,' +
						'nccloud.web.sf.allocation.allocateapply.filter.DefaultRefAccFilter'
					//'nccloud.web.sf.delivery.delivery.filter.DefaultRefAccFilter4NCC'
				};
			};
		}
		//添加 pk_payorg过滤 与 币种过滤
		//下拨申请单下拨银行账户默认过滤
		if (item.attrcode == 'pk_bankacc_p') {
			item.queryCondition = () => {
				let pk_payorg_filter = props.form.getFormItemsValue(formId, 'pk_payorg');//币种
				if (pk_payorg_filter.value != null) {
					pk_payorg_filter = pk_payorg_filter.value;
				} else {
					pk_payorg_filter = '';
				}
				return {
					pk_org: pk_payorg_filter,
					pk_currtype: props.form.getFormItemsValue(formId, 'pk_currtype').value,
					refnodename: loadMultiLang(props, '36320AA-000025'),/* 国际化处理： 使用权参照*/
					//noConditionOrg: 'Y',
					GridRefActionExt:
						// 'nccloud.web.sf.allocation.allocateapply.filter.DefaultRefPBankAccFilter'//默认过滤 + 组织过滤
						// + ',nccloud.web.sf.delivery.delivery.filter.DefaultPayBankRefAccFilter4NCC'//币种
						'nccloud.web.sf.allocation.allocateagree.filter.AllocateAgreePayBankAccFilter'
				};
			};
		}

		//币种影响客商银行账户 后台查询问题 待平台修改
		if (item.attrcode == 'pk_custbankacc') {
			item.queryCondition = () => {
				return {
					pk_cust: props.cardTable.getChangedRows(card_table_id)[0].values.pk_company_r.value,
					pk_currtype: props.form.getFormItemsValue(formId, 'pk_currtype').value,
					accclass: 2,//收款客商 参数为‘2’ 
					GridRefActionExt:
						'nccloud.web.sf.allocation.allocateapply.filter.AllocateApplyCurrentRefCustBankAccFilter'
				};
			};
		}
		//计划项目过滤 状态未封存，且建立日期小于等于业务日期
		if (item.attrcode == 'pk_planitem_r') {
			item.queryCondition = () => {
				return {
					pk_org: props.form.getFormItemsValue(formId, 'pk_org').value,
					TreeRefActionExt:
						'nccloud.web.sf.allocation.allocateapply.filter.AllocateApplyDefaultRefPlanItemFilter'
				};
			};
		}
		//收款客商过滤
		if (item.attrcode == 'pk_company_r') {
			item.queryCondition = () => {
				return {
					pk_org: props.form.getFormItemsValue(formId, 'pk_org').value
				};
			};
		}		
	});

	//table操作列
	let multiLang = props.MutiInit.getIntl(module_id);
	let porCol = {
		attrcode: 'opr',
		label: loadMultiLang(props, '36320AA-000026'),/* 国际化处理： 操作*/
		fixed: 'right',
		itemtype: 'customer',
		visible: true,
		width: '200px',
		render(text, record, index) {
			let status = props.cardTable.getStatus(card_table_id);
			// let innerButton = that.state.copyflag1 ? ['CopyAtLine']:['Open','CopyThisLine', 'InsertLine', 'DeleteLine'];
			let innerButton = [];
			//status === "browse"? ['OpenInfo'] : that.state.pasteflag ? ['PasteThis']:['Open'];
			if (status === "browse") {//游览态
				return <div className="currency-opr-col">{
					props.button.createOprationButton(getBodyBtnArr(props, record),
						{
							area: 'table_inner',
							buttonLimit: '3',
							onButtonClick: (props, key) => { bodyButtonClick.call(that, props, key, text, record, index) }
						})
				}</div>;
			} else {//编辑态
				innerButton = that.state.pasteflag ? ['PasteThis'] : ['Open'];
				return props.button.createOprationButton(innerButton, {
					area: "table_inner",
					buttonLimit: 2,
					onButtonClick: (props, key) => bodyButtonClick.call(that, props, key, text, record, index, 'table_allocateapply_01')
				})
			}

		}
	};
	meta[tableId].items.push(porCol);
	return meta;
}
/*pmFWCFu5nhKkBzYmrkBakSyfTwhWpk4XRVJggXxHt0O/7C0qG9iK3AHbi3mv/Fzl*/