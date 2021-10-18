/*pmFWCFu5nhKkBzYmrkBakaVZInJOA2IJRhIwdhfe+QfB4OFkmRCsDBBI8pDiA3+2*/
import { base, ajax } from 'nc-lightapp-front';
import { buttonVisible } from './buttonVisible';
import { buttonClick } from './buttonClick';
import { card_table_id_edit, app_id, card_from_id, list_search_id,card_table_id, card_page_id, button_limit, appcode, viewmod_deal } from '../../cons/constant.js';
//财务组织参照
import FinanceOrgTreeRef from '../../../../../uapbd/refer/org/FinanceOrgTreeRef';
//资金计划参照
import FundPlanTreeRef from '../../../../../uapbd/refer/fiacc/FundPlanTreeRef';
//资金组织参照
import FundOrgTreeRef from '../../../../../uapbd/refer/org/FundOrgTreeRef';
//内部账户
import AccidGridRef from '../../../../../tmpub/refer/accid/AccidGridRef';
import { setCardShouderBtnUseful, versionControl } from "../../util/spegatherUtil";
import { setDefOrg2AdvanceSrchArea } from '../../../../../tmpub/pub/util/index'
import  {afterEvent}  from './index';
let { NCPopconfirm } = base;

export const initTemplate = function (props) {
	const that = this;
	props.createUIDom(
		{
			pagecode: card_page_id, //页面id
			appcode: props.getUrlParam('c')
		},
		function (data) {
			if (data) {
				//状态
				let status = props.getUrlParam('status');
				//是否复制
				let isCopy = props.getUrlParam('isCopy');
				if (data.template) {					
					let meta = data.template;
					modifierMeta(props, meta, that);

					//高级查询区域家在默认组织
					// setDefOrg2AdvanceSrchArea(props, list_search_id, data);		

					props.meta.setMeta(meta, () => {
						//新增时，资金组织可编辑，其余字段不可编辑
						if (!isCopy && status == 'add') {
							props.initMetaByPkorg();
						} else if(isCopy && status == 'add') {
							props.resMetaAfterPkorgEdit();
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
				if (data.context) {
					let context = data.context;
					that.setState({
						curr_pk_org: context.pk_org,
						curr_orgname: context.org_Name,
						curr_pk_org_v: context.pk_org_v,
						curr_orgname_v: context.org_v_Name,
					});
					if (status === 'add' && !isCopy) {
						that.props.form.setFormItemsValue(card_from_id,
							{
								'pk_org':{
									value: context.pk_org,
									display: context.org_Name
								},
								'pk_org_v':{
									value: that.state.curr_pk_org_v,
									display: that.state.curr_orgname_v
								}
							}
						);
						if(context.pk_org){
							let	pk_org = {
								value: context.pk_org,
								display: context.org_Name
							};
							afterEvent.call(that,that.props, card_from_id, "pk_org", pk_org, null, null, null, null, true);
							// that.props.resMetaAfterPkorgEdit();
							that.props.form.setFormItemsDisabled(card_from_id, { 'pk_org': false });
							// that.props.cardTable.addRow(card_table_id);
						}
					}
				}
			}
		}
	);
}

function modifierMeta(props, meta, that) {
	let status = props.getUrlParam('status');
	meta[card_from_id].status = status;
	meta[card_table_id].status = status;
	//参照历史记录处理
	meta[card_table_id].items.find((e) => e.attrcode === 'pk_payfinanceorg').showHistory = false;
	meta[card_table_id].items.find((e) => e.attrcode === 'pk_accid').showHistory = false;
	meta[card_table_id].items.find((e) => e.attrcode === 'pk_planitem').showHistory = false;
	//设置财务组织可跨集团
	meta[card_table_id].items.find((e) => e.attrcode === 'pk_payfinanceorg').isShowUnit = true;
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
		
		if (item.attrcode == 'pk_costcenter') {
			item.queryCondition = () => {
				return {					
					pk_org:(props.form.getFormItemsValue(card_from_id, 'pk_org') || {}).value,
					TreeRefActionExt: 'nccloud.web.uapbd.ref.fiacc.CostCenterTreeRef'
				}
			}
		}
		if (item.attrcode == 'pk_fundplanitem') {
			item.queryCondition = () => {
				return {
					pk_org: (props.form.getFormItemsValue(card_from_id, 'pk_org') || {}).value,
					pk_group: (props.form.getFormItemsValue(card_from_id, 'pk_group') || {}).value,
					GridRefActionExt: 'nccloud.web.fts.specialtransfer.spegather.filter.PkPlanItemFilter'
				};
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

	let porCol = {
		attrcode: 'opr',
		//操作
		label: that.state.json['36300STG-000021'],/* 国际化处理： 操作*/
		fixed: 'right',
		itemtype: 'customer',
		visible: true,
		width: '200px',
		render(text, record, index) {
			let status = props.getUrlParam('status');
			let { isRowCopy, isOpen } = that.state;
			let rowButtons = []
			if(status === 'browse'){ //浏览态
				return <div className="currency-opr-col">{
					props.button.createOprationButton(record.expandRowStatus ? ['closedown'] : ['opendown'],
						{
							area: 'card_inner',
							buttonLimit: '3',
							onButtonClick: (props, key) => { buttonClick.call(this, props, key, text, record, index) }
						})
				}</div>;
			}else{//编辑态
				rowButtons = isRowCopy ? ['CopyAtLine'] : ['Open', 'CopyThisLine', 'InsertLine', 'DeleteLine']
				return props.button.createOprationButton(rowButtons, {
					area: "card_inner",
					buttonLimit: button_limit,
					onButtonClick: (props, key) => buttonClick.call(that, props, key, text, record, index)
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
	if (item.attrcode == 'pk_payfinanceorg') {
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
							pk_payfinanceorg: (record.values.pk_payfinanceorg && record.values.pk_payfinanceorg.value) || 'empty',
							pk_currtype: (props.form.getFormItemsValue(card_from_id, 'pk_currtype') || {}).value,
							pk_org: (props.form.getFormItemsValue(card_from_id, 'pk_org') || {}).value,
							GridRefActionExt: 'nccloud.web.fts.specialtransfer.spegather.filter.PkAccidFilter'
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
							GridRefActionExt: 'nccloud.web.fts.specialtransfer.spegather.filter.PkPlanItemFilter'
						};
					}
				})
			);
		}
	}
}


//卡片表体行级按钮数组
export const getBodyBtnArr = function (props, record,copyflag) {
    let status = props.getUrlParam('status');
    if ('browse' == status) {
        return record.expandRowStatus ? ['closedown'] : ['opendown'];
    }
    else if ('decide' == status) {
        return [];
    }
    
}
/*pmFWCFu5nhKkBzYmrkBakaVZInJOA2IJRhIwdhfe+QfB4OFkmRCsDBBI8pDiA3+2*/