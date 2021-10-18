/*pmFWCFu5nhKkBzYmrkBakSyfTwhWpk4XRVJggXxHt0O/7C0qG9iK3AHbi3mv/Fzl*/
import { base, ajax } from 'nc-lightapp-front';
let { NCPopconfirm } = base;
import { app_id, card_from_id, card_table_id, card_page_id } from '../../cons/constant.js';
import { buttonVisible } from './buttonVisible';
import { setPropCache, saveMultiLangRes, loadMultiLang } from "../../../../../tmpub/pub/util/index";
import { AllocateAgreeCache } from '../../../allocateagreeAppr/cons/constant.js';
import { getDefData, setDefData } from '../../../../../tmpub/pub/util/cache';
import { orgVersionView } from "../../../../../tmpub/pub/util/version/index.js";
import  buttonClick  from './buttonClick';
import { getBodyBtnArr } from "../../util/index";
const formId = card_from_id;
const tableId = card_table_id;
const pageId = card_page_id;

export default function (props) {
	let that = this;
	props.createUIDom(
		{
			pagecode: pageId,//页面id
			appcode: props.getUrlParam('c')
		},
		function (data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					modifierMeta(props, meta, that)
					props.meta.setMeta(meta);
					if (props.getUrlParam('status') != 'browse') {
						// props.initMetaByPkorg();
						//设定操作信息中字段不可编辑 (疑似原因为修改状态影响 现平台未修复需要手动设定)
						let editItemArr = {
							'submituser': true, 'billmaker': true, 'agreeuser': true, 'submitdate': true,
							'dbilldate': true, 'agreedate': true, 'approver': true, 'vapprovenote': true,
							'dapprovedate': 'true', 'unitbillmaker': true, 'unitapprover': true,
						};
						// props.form.setFormItemsDisabled(card_from_id, editItemArr);
						props.form.setFormItemsDisabled('head', editItemArr);
					}
					orgVersionView(that.props, card_from_id);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					buttonVisible(props);
				}
			}
		}
	)
}

function modifierMeta(props, meta, that) {
	let status = props.getUrlParam('status');
	meta[formId].status = status;
	meta[tableId].status = status;
	status = status == 'add' ? 'edit' : status;

	//pk_org 按角色过滤
	meta[formId].items.map((item) => {
		if (item.attrcode == 'pk_org') {
			item.queryCondition = () => {
				return {
					funcode: props.getSearchParam('c'),
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				};
			};
		}
		//下拨组织 会根据交易类型改变参照 这里在编辑前事件中处理
	});

	//参照过滤 表体过滤
	meta[tableId].items.map((item) => {
		//下拨银行账户
		if (item.attrcode == 'pk_bankacc_p') {
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(formId, 'pk_org') && props.form.getFormItemsValue(formId, 'pk_org').value;
				let pk_currtype = props.form.getFormItemsValue(formId, 'pk_currtype') && props.form.getFormItemsValue(formId, 'pk_currtype').value;
				console.log('pk_org', pk_org);
				return { pk_currtype: pk_currtype, pk_org: pk_org, GridRefActionExt: 'nccloud.web.sf.allocation.allocateagree.filter.AllocateAgreePayBankAccFilter' };
			};
		}
		//下拨组织计划项目
		if (item.attrcode == 'pk_planitem_p') {
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(formId, 'pk_org') && props.form.getFormItemsValue(formId, 'pk_org').value;
				return { pk_org: pk_org, TreeRefActionExt: 'nccloud.web.sf.allocation.allocateagree.filter.AllocateAgreeDefaultRefPayPlanItemFilter' };
			};
		}
	});

	//参照过滤 侧拉表体过滤
	meta['allocateagree_b_child2'].items.map((item) => {
		//下拨银行账户
		if (item.attrcode == 'pk_bankacc_p') {
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(formId, 'pk_org') && props.form.getFormItemsValue(formId, 'pk_org').value;
				let pk_currtype = props.form.getFormItemsValue(formId, 'pk_currtype') && props.form.getFormItemsValue(formId, 'pk_currtype').value;
				console.log('pk_org', pk_org);
				return { pk_currtype: pk_currtype, pk_org: pk_org, GridRefActionExt: 'nccloud.web.sf.allocation.allocateagree.filter.AllocateAgreePayBankAccFilter' };
			};
		}
		//下拨组织计划项目
		if (item.attrcode == 'pk_planitem_p') {
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(formId, 'pk_org') && props.form.getFormItemsValue(formId, 'pk_org').value;
				return { pk_org: pk_org, TreeRefActionExt: 'nccloud.web.sf.allocation.allocateagree.filter.AllocateAgreeDefaultRefPayPlanItemFilter' };
			};
		}
	});


	//let multiLang = props.MutiInit.getIntl('36320FAA_C01');
	let porCol = {
		attrcode: 'opr',
		label: loadMultiLang(props, '36320FAA-000019'),/* 国际化处理： 操作*/
		visible: true,
		fixed: 'right',
		width: 200,
		className: "table-opr",
		itemtype: 'customer',
		render(text, record, index) {
			let status = props.cardTable.getStatus(tableId);
			//浏览状态添加展开按钮
			return status === 'browse' ? (
				<div className="currency-opr-col">{
					props.button.createOprationButton(getBodyBtnArr(props, record),
						{
							area: 'card_inner',
							buttonLimit: '3',
							onButtonClick: (props, key) => { buttonClick.call(that, props, key, text, record, index,tableId) }
						})
				}</div>)
				:(<div className="currency-opr-col">{
					props.button.createOprationButton(['Open'], {
						area: "card_inner",
						buttonLimit: 3,
						onButtonClick: (props, key) => buttonClick.call(that, props, key, text, record, index, tableId)
					})
				}
				</div>)
		}
	};
	let islink = getDefData(AllocateAgreeCache, AllocateAgreeCache.islink);
	if (!islink) {
		meta[tableId].items.push(porCol);
	}
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakSyfTwhWpk4XRVJggXxHt0O/7C0qG9iK3AHbi3mv/Fzl*/