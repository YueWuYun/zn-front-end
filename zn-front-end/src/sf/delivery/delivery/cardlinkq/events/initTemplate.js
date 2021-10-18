/*pmFWCFu5nhKkBzYmrkBakSyfTwhWpk4XRVJggXxHt0O/7C0qG9iK3AHbi3mv/Fzl*/
import { createPage, ajax, base, toast  } from 'nc-lightapp-front';

let { NCMessage } = base;
let { NCPopconfirm } = base;
import tableButtonClick from './tableButtonClick';
import buttonVisible from './buttonVisible';

import { app_id, appcode, module_id, base_url, list_search_id,
	list_table_id, button_limit, 
	oid,card_page_id,card_from_id,link_card_page_id,
	card_fromtail_id,card_table_id
} from '../../cons/constant.js';

// 先引入参照，进行表格参照过滤
// 使用权参照
import BankaccSubUseTreeGridRef from '../../../../../uapbd/refer/pub/BankaccSubUseTreeGridRef';
// 内部账户参照
import AccidGridRef from '../../../../../tmpub/refer/accid/AccidGridRef';
// 财务组织
import FinanceOrgTreeRef from '../../../../../uapbd/refer/org/FinanceOrgTreeRef';
// 缴款单位计划项目
import FundPlanTreeRef from '../../../../../uapbd/refer/fiacc/FundPlanTreeRef';

export default function (props) {

	let that = this;
	props.createUIDom(
		{
			//页面id
			pagecode: link_card_page_id,
			// 页面编码
			// appcode: appcode,
			// //注册按钮的id
			// appid: app_id
		},
		function (data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					modifierMeta(that, props, meta)
					props.meta.setMeta(meta);
					let status = props.getUrlParam('status');

					if (status === 'browse') {
						props.cardTable.setStatus(card_table_id, 'browse');
					} else {
						props.cardTable.setStatus(card_table_id, 'edit');
					}
					if (status === 'add') {
						//单据有主组织，新增时,将其他字段设置为不可编辑.
						props.initMetaByPkorg(); 
						let metaFromData = meta[card_from_id];
						metaFromData.items.forEach((val) => {
							if(val.attrcode === 'pk_org'){
								val.visible = true;
								val.disabled = false;
								return;
							}else{
								// val.disabled = true;
							}
						});
					}else{
						let metaFromData = meta[card_from_id];
						metaFromData.items.forEach((val) => {
							if(val.attrcode === 'pk_org' || val.attrcode === 'pk_org_v' ){
								// val.visible = true;
								val.disabled = true;
								return;
							}
						});
					}
				}

				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					// 按钮编辑性
					// buttonVisible(props);
					buttonVisible.call(that, props);
				}
				//修改页面状态
				togglePageShow(props);
			}
		}
	)
}

//根据页面状态，修改编辑态表格
function togglePageShow(props) {
	// 按钮编辑性
	// buttonVisible(props);
}

function modifierMeta(that, props, meta) {
	let status = props.getUrlParam('status');
	if(status === 'decide'){
		meta[card_from_id].status = 'edit';
		meta[card_table_id].status = 'edit';
	}else{
		meta[card_from_id].status = status;
		meta[card_table_id].status = status;
	}

	//财务组织用户过滤
	meta[card_from_id].items.map((item) => {
		item.showHistory = false;
		if (item.attrcode == 'pk_org' ) {
			item.queryCondition = () => {
				return {
					funcode: props.getSearchParam('c'),
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				};
			};
		}
	});

	//table中 参照过滤
	meta[card_table_id].items.map((item) => {
		// 上收组织和缴款组织联动
		if (item.attrcode == 'pk_org_p') {
			item.showHistory = false;
			item.render = function (text, record, index) {
				return (
					FinanceOrgTreeRef({
						queryCondition: () => {
							let pk_org_p_busitype = props.form.getFormItemsValue(card_from_id, 'busitype');
							if (pk_org_p_busitype && pk_org_p_busitype.value) {
								pk_org_p_busitype = pk_org_p_busitype.value;
							} else {
								pk_org_p_busitype = null;
							}

							let pk_org_p_pk_group = props.form.getFormItemsValue(card_from_id, 'pk_group');
							if (pk_org_p_pk_group && pk_org_p_pk_group.value) {
								pk_org_p_pk_group = pk_org_p_pk_group.value;
							} else {
								pk_org_p_pk_group = null;
							}

							// 取pk_org，用于自定义过滤
							let pk_org_p_pk_org = props.form.getFormItemsValue(card_from_id, 'pk_org');
							if (pk_org_p_pk_org && pk_org_p_pk_org.value) {
								pk_org_p_pk_org = pk_org_p_pk_org.value;
							} else {
								pk_org_p_pk_org = null;
							}
							return {
								// 底层过滤集团用pk_org做key
								pk_org: pk_org_p_pk_org,
								busitype: pk_org_p_busitype,
								pk_group: pk_org_p_pk_group,
								//自定义增加的过滤条件
								TreeRefActionExt: 'nccloud.web.sf.delivery.delivery.filter.DeliveryOrgRelationRefPayOrgFilter4NCC'
							};
						}
					})
				);
			}
		}
		// 缴款单位银行账户
		if (item.attrcode == 'pk_bankacc_p') {
			item.showHistory = false;
			item.render = function (text, record, index) {
				return (
					BankaccSubUseTreeGridRef({
						queryCondition: () => {
							let bankacc_p_pk_org_p = props.cardTable.getValByKeyAndIndex(card_table_id, index, 'pk_org_p');
							if (bankacc_p_pk_org_p && bankacc_p_pk_org_p.value) {
								bankacc_p_pk_org_p = bankacc_p_pk_org_p.value;
							} else {
								bankacc_p_pk_org_p = null;
							}

							let bankacc_p_currtype = props.form.getFormItemsValue(card_from_id, 'pk_currtype');
							if (bankacc_p_currtype && bankacc_p_currtype.value) {
								bankacc_p_currtype = bankacc_p_currtype.value;
							} else {
								bankacc_p_currtype = null;
							}

							return {
								pk_org: bankacc_p_pk_org_p, 
								pk_currtype: bankacc_p_currtype,
								refnodename: that.props.MutiInit.getIntl("36320FDA") && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000048'),/* 国际化处理： 使用权参照*/
								//自定义增加的过滤条件
								GridRefActionExt: 'nccloud.web.tmpub.filter.BanksubaccNoInnerAccFilter4NCC,nccloud.web.tmpub.filter.BanksubaccNoFrozenFilter4NCC,nccloud.web.tmpub.filter.BanksubaccOnlyCurrent4NCC,nccloud.web.sf.delivery.delivery.filter.DefaultPayBankRefAccFilter4NCC'
							};
						}
					})
				);
			}
		}
		// 上收银行账户
		if (item.attrcode == 'pk_bankacc_r') {
			item.showHistory = false;
			item.render = function (text, record, index) {
				return (
					BankaccSubUseTreeGridRef({
						queryCondition: () => {
							let bankacc_r_pk_org = props.form.getFormItemsValue(card_from_id, 'pk_org');
							if (bankacc_r_pk_org && bankacc_r_pk_org.value) {
								bankacc_r_pk_org = bankacc_r_pk_org.value;
							} else {
								bankacc_r_pk_org = null;
							}
							
							let bankacc_r_currtype = props.form.getFormItemsValue(card_from_id, 'pk_currtype');
							if (bankacc_r_currtype && bankacc_r_currtype.value) {
								bankacc_r_currtype = bankacc_r_currtype.value;
							} else {
								bankacc_r_currtype = null;
							}
							return {
								// 这里对record.values.materiel要做一下非空校验
								pk_org: bankacc_r_pk_org, 
								pk_currtype: bankacc_r_currtype,
								refnodename: that.props.MutiInit.getIntl("36320FDA") && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000048'),/* 国际化处理： 使用权参照*/
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
							let pk_planitem_p_pk_org_p = props.cardTable.getValByKeyAndIndex(card_table_id, index, 'pk_org_p');
							if (pk_planitem_p_pk_org_p && pk_planitem_p_pk_org_p.value) {
								pk_planitem_p_pk_org_p = pk_planitem_p_pk_org_p.value;
							} else {
								pk_planitem_p_pk_org_p = props.form.getFormItemsValue(card_from_id, 'pk_org').value;
							}
							
							let pk_planitem_p_pk_group = props.form.getFormItemsValue(card_from_id, 'pk_group');
							if (pk_planitem_p_pk_group && pk_planitem_p_pk_group.value) {
								pk_planitem_p_pk_group = pk_planitem_p_pk_group.value;
							} else {
								pk_planitem_p_pk_group = null;
							}
							return {
								pk_org: pk_planitem_p_pk_org_p, 
								pk_group: pk_planitem_p_pk_group,
								//自定义增加的过滤条件
							};
						}
					})
				);
			}
		}
		// 上收单位计划项目 
		if (item.attrcode == 'pk_planitem_r') {
			item.render = function (text, record, index) {
				return (
					FundPlanTreeRef({
						queryCondition: () => {
							let pk_planitem_r_pk_org = props.form.getFormItemsValue(card_from_id, 'pk_org');
							if (pk_planitem_r_pk_org && pk_planitem_r_pk_org.value) {
								pk_planitem_r_pk_org = pk_planitem_r_pk_org.value;
							} else {
								pk_planitem_r_pk_org = null;
							}
							
							let pk_planitem_p_pk_group = props.form.getFormItemsValue(card_from_id, 'pk_group');
							if (pk_planitem_p_pk_group && pk_planitem_p_pk_group.value) {
								pk_planitem_p_pk_group = pk_planitem_p_pk_group.value;
							} else {
								pk_planitem_p_pk_group = null;
							}
							return {
								pk_org: pk_planitem_r_pk_org, 
								pk_group: pk_planitem_p_pk_group,
								//自定义增加的过滤条件
							};
						}
					})
				);
			}
		}
		// 缴款单位内部账户
		if (item.attrcode == 'pk_accid') {
			item.showHistory = false;
			item.render = function (text, record, index) {
				return (
					AccidGridRef({
						queryCondition: () => {
							let accid_pk_org_p = props.cardTable.getValByKeyAndIndex(card_table_id, index, 'pk_org_p');
							if (accid_pk_org_p && accid_pk_org_p.value) {
								accid_pk_org_p = accid_pk_org_p.value;
							} else {
								accid_pk_org_p = null;
							}

							let accid_pk_org = props.form.getFormItemsValue(card_from_id, 'pk_org');
							if (accid_pk_org && accid_pk_org.value) {
								accid_pk_org = accid_pk_org.value;
							} else {
								accid_pk_org = null;
							}

							let accid_currtype = props.form.getFormItemsValue(card_from_id, 'pk_currtype');
							if (accid_currtype && accid_currtype.value) {
								accid_currtype = accid_currtype.value;
							} else {
								accid_currtype = null;
							}

							return {
								pk_org: accid_pk_org,
								pk_ownerorg: accid_pk_org_p,
								pk_currtype: accid_currtype,
								//自定义增加的过滤条件
								GridRefActionExt: 'nccloud.web.sf.delivery.delivery.filter.DefaultRefAccFilter4NCC'
							};
						}
					})
				);
			}
		}

	});
	let multiLang = props.MutiInit.getIntl('36320FDA');
	let fold = multiLang.get('36320FDA--000121');/* 国际化处理： 收起*/
	let unfold = multiLang.get('36320FDA--000122');/* 国际化处理： 展开*/
	let porCol = {
		attrcode: 'opr',
		label: multiLang.get('36320FDA--000049'),/* 国际化处理： 操作*/
		fixed: 'right',
		itemtype: 'customer',
		visible: true,
		width: '200px',
		render(text, record, index) {
			let status = props.getUrlParam("status");
			// 经办 表体不能新增删除数据
			let buttonAry = 
			    // 浏览态 展开和收回
				status === "browse" ? record.expandRowStatus ? ['unopen_inner']:['open_inner']
				// 经办 展开
				:status === 'decide' ? ['editline_inner']: 
				// 复制行 粘贴至此
				that.state.pasteflag ? ["copythis"]
				// 侧拉展开 增行 删行 复制行
				:['editline_inner','addline_inner', 'delline_inner','copyline_inner'];
			return props.button.createOprationButton(buttonAry, {
					area: 'card_body_inner',
					buttonLimit: 3,
					onButtonClick: (props, key) => tableButtonClick.call(that, props, key, text, record, index)
				});
		}
	};
	meta[card_table_id].items.push(porCol);

	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakSyfTwhWpk4XRVJggXxHt0O/7C0qG9iK3AHbi3mv/Fzl*/