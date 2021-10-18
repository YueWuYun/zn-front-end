/*pmFWCFu5nhKkBzYmrkBakaVZInJOA2IJRhIwdhfe+QfB4OFkmRCsDBBI8pDiA3+2*/
import { base, ajax } from 'nc-lightapp-front';
import { buttonVisible,getBodyBtnArr } from './buttonVisible';
import { buttonClick } from './buttonClick';
import { card_table_id_edit, app_id, card_from_id, card_table_id, appcode, card_page_id, button_limit, viewmod_deal, link_card_page_id } from '../../cons/constant.js';
//财务组织参照
import FinanceOrgTreeRef from '../../../../../uapbd/refer/org/FinanceOrgTreeRef';
//资金计划参照
import FundPlanTreeRef from '../../../../../uapbd/refer/fiacc/FundPlanTreeRef';
//资金组织参照
import FundOrgTreeRef from '../../../../../uapbd/refer/org/FundOrgTreeRef';
//内部账户
import AccidGridRef from '../../../../../tmpub/refer/accid/AccidGridRef';
//用户
import userDefaultRefer from '../../../../../uap/refer/riart/userDefaultRefer';
import { setCardShouderBtnUseful, versionControl } from "../../util/spepayUtil";
import { saveMultiLangRes, loadMultiLang } from "../../../../../tmpub/pub/util/index";
let { NCPopconfirm } = base;

export const initTemplate = function (props, isClear) {
	const that = this;
	props.createUIDom(
		{
			pagecode: link_card_page_id ,//页面id
			appcode: props.getUrlParam('c')
		},
		function (data) {
			if (data) {
				if (data.template) {
					//状态
					let status = props.getUrlParam('status');
					//是否复制
					let isCopy = props.getUrlParam('isCopy');
					let meta = data.template;
					modifierMeta.call(that,props, meta);
					props.meta.setMeta(meta, () => {
						//新增时，资金组织可编辑，其余字段不可编辑
						if (!isCopy && status == 'add') {
							props.initMetaByPkorg();
						}
						//复制或修改时，资金组织不可编辑
						if (isCopy || status == 'edit') {
							that.props.form.setFormItemsDisabled(card_from_id, { 'pk_org': true });
						}
						versionControl(props);
					});
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					buttonVisible(that);
					setCardShouderBtnUseful(that.props);
				}
			}
		}
	);
}

function modifierMeta(props, meta) {
	let theThat = this
	let status = props.getUrlParam('status');
	meta[card_from_id].status = status;
	meta[card_table_id].status = status;
	//参照历史记录处理
	meta[card_table_id].items.find((e) => e.attrcode === 'pk_getfinanceorg').showHistory = false;
	meta[card_table_id].items.find((e) => e.attrcode === 'pk_accid').showHistory = false;
	meta[card_table_id].items.find((e) => e.attrcode === 'pk_planitem').showHistory = false;
	//设置财务组织可跨集团
	meta[card_table_id].items.find((e) => e.attrcode === 'pk_getfinanceorg').isShowUnit = true;
	//表头字段参照过滤
	meta[card_from_id].items.map((item) => {
		//资金组织权限过滤
		if (item.attrcode == 'pk_org') {
			item.queryCondition = () => {
				return {
					funcode: appcode,
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FundOrgPermissionFilter'
				}
			}
		}
	});

	//表体字段参照过滤
	meta[card_table_id].items.map((item) => {
		bodyItemFilter(props, item)
	});

	//编辑态表体（侧拉）参照过滤
	meta[card_table_id_edit].items.map((item) => {
		bodyItemFilter(props, item)
	});

	let multiLang = props.MutiInit.getIntl('3630');
	let fold =  loadMultiLang(props,'1880000025-000052') // 收起
	let unfold =  loadMultiLang(props,'1880000025-000051') // 展开
	let porCol = {
		attrcode: 'opr',
		//操作
		label: loadMultiLang(props,'1880000025-000021'),/* 国际化处理： 操作*/
		fixed: 'right',
		itemtype: 'customer',
		visible: true,
		width: '200px',
		render(text, record, index) {
			let status = props.getUrlParam('status');
			let { isRowCopy, isOpen } = theThat.state;
			let rowButtons = []
			if(status === 'browse' || status === viewmod_deal){//浏览态
				return <div className="currency-opr-col">{
					props.button.createOprationButton(getBodyBtnArr(props, record),
						{
							area: 'card_inner',
							buttonLimit: '3',
							onButtonClick: (props, key) => { buttonClick.call(theThat, props, key, text, record, index) }
						})
				}</div>;
			}else{
				rowButtons = isRowCopy ? ['CopyAtThisLine'] : ['Open', 'CopyThisLine', 'InsertLine', 'DeleteLine']
				return props.button.createOprationButton(rowButtons, {
					area: "card_inner",
					buttonLimit: button_limit,
					onButtonClick: (props, key) => buttonClick.call(theThat, props, key, text, record, index)
				});
			}			
		}
	};
	meta[card_table_id].items.push(porCol);
	return meta;
}

/**
 * 表体参照过滤
 * @param {*} props 
 * @param {*} item 
 */
const bodyItemFilter = function (props, item) {
	//办理财务组织参照过滤
	if (item.attrcode == 'pk_getfinanceorg') {
		item.queryCondition = () => {
			return {
				pk_fundpayorg: (props.form.getFormItemsValue(card_from_id, 'pk_org') || {}).value,
				TreeRefActionExt: 'nccloud.web.fts.pub.filter.DefaultFundFinanceOrgFilter'
			};
		};
	}
	//内部账户参照过滤
	else if (item.attrcode == 'pk_accid') {
		item.render = function (text, record, index) {
			return (
				AccidGridRef({
					queryCondition: () => {
						return {
							pk_getfinanceorg: (record.values.pk_getfinanceorg || {}).value,
							pk_currtype: (props.form.getFormItemsValue(card_from_id, 'pk_currtype') || {}).value,
							pk_org: (props.form.getFormItemsValue(card_from_id, 'pk_org') || {}).value,
							GridRefActionExt: 'nccloud.web.fts.specialtransfer.spepay.filter.PkAccidFilter'
						};
					}
				})
			);
		}
	}
	//资金计划项目参照过滤
	else if (item.attrcode == 'pk_planitem') {
		item.render = function (text, record, index) {
			return (
				FundPlanTreeRef({
					queryCondition: () => {
						return {
							pk_org: (props.form.getFormItemsValue(card_from_id, 'pk_org') || {}).value,
							pk_group: (props.form.getFormItemsValue(card_from_id, 'pk_group') || {}).value,
							GridRefActionExt: 'nccloud.web.fts.specialtransfer.spepay.filter.PkPlanItemFilter'
						};
					}
				})
			);
		}
	}
	//付款人
	else if (item.attrcode == 'busioperator') {
		item.render = function (text, record, index) {
			return (
				userDefaultRefer({
					queryCondition: () => {
						return {
							pk_org: (props.form.getFormItemsValue(card_from_id, 'pk_org') || {}).value,
							pk_group: (props.form.getFormItemsValue(card_from_id, 'pk_group') || {}).value
						};
					}
				})
			);
		}
	}
}

/*pmFWCFu5nhKkBzYmrkBakaVZInJOA2IJRhIwdhfe+QfB4OFkmRCsDBBI8pDiA3+2*/