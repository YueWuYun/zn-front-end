/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/
import { base, ajax, cardCache } from 'nc-lightapp-front';
let { NCPopconfirm } = base;
import { app_id, formId, pageCodeCard, tableId, app_code, busType, CurrExConst, SettleattrCode, DepositattrCode } from '../../cons/constant.js';
import { buttonVisible } from './buttonVisible';
import { beforeEvent, afterEvent } from './index';
import { paymentBeforeUtil } from './beforeEvent';
import { orgVersionView } from "../../../../../tmpub/pub/util/version/index";
import { getDefData, setDefData } from '../../../../../tmpub/pub/util/cache';
import { addDefReferFilter } from "../../../../../tmpub/pub/util";


export default function (props) {
	let that = this;
	props.createUIDom(
		{
			pagecode: pageCodeCard//页面id
			// appcode: props.getUrlParam('c')  //复制小应用时传输
		},
		function (data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					modifierMeta(that, props, meta)
					props.meta.setMeta(meta);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					// buttonVisible.call(that, props);
					// props.button.setPopContent('delete','确认要删除该信息吗？');
				}
				if (data.context) {
					let context = data.context;
					if (props.getUrlParam('status') === 'add') {
					// if (props.getUrlParam('status') === 'add' && !that.isCopy) {
						that.props.form.setFormStatus(formId, 'add');
						if (context.pk_org) {
							//设置默认组织
							let { pk_org, org_Name, } = data.context;
							let pkorg = {
								value: context.pk_org,
								display: context.org_Name
							};
							props.form.setFormItemsValue(formId, {
								'pk_org': { value: props.getUrlParam('pkorg'), display: props.getUrlParam('orgname') },
							});
							//afterEvent.call(that,that.props, formId, "pk_org", pkorg, null, null, null, null, true);
							// that.props.resMetaAfterPkorgEdit();
							props.resMetaAfterPkorgEdit();
							that.props.form.setFormItemsDisabled(formId, { 'pk_org': false });

						}
						props.initMetaByPkorg();

						// this.toggleShow();	
					}else if(props.getUrlParam('status') === 'edit'||props.getUrlParam('isCopy')!='copy'){
						that.props.form.setFormItemsDisabled(formId, { 'pk_org': true });
						that.props.form.setFormItemsDisabled(formId, { 'billmaker': true });
						that.props.form.setFormItemsDisabled(formId, { 'operatedate': true });
						that.props.form.setFormItemsDisabled(formId, { 'tallyor': true });
						that.props.form.setFormItemsDisabled(formId, { 'tallydate': true });
						that.props.form.setFormItemsDisabled(formId, { 'creator': true });
						that.props.form.setFormItemsDisabled(formId, { 'creationtime': true });
						that.props.form.setFormItemsDisabled(formId, { 'modifier': true });
						that.props.form.setFormItemsDisabled(formId, { 'modifiedtime': true });
						
					}
					buttonVisible.call(this, props);
				}
			}
		}
	)
}

function modifierMeta(that, props, meta) {


	//财务组织:全加载
	meta[tableId].items.find((e) => e.attrcode === 'pk_org').isTreelazyLoad = false;
	//资金组织:全加载
	//  meta[this.formId].items.find((e) => e.attrcode === 'pk_fundorg').isTreelazyLoad = false;
	//参照过滤

	meta[tableId].items.map((item) => {
		switch (item.attrcode) {

			case 'pk_org':
				item.isShowDisabledData = false;
				item.isTreelazyLoad = false;
				item.queryCondition = () => {
					return {
						funcode: app_code,
						TreeRefActionExt: 'nccloud.web.tmpub.filter.FundOrgPermissionFilter'
					};
				};

			case 'pk_depositreceipt': // 定期存单
				item.queryCondition = () => {
					// 贷款单位
					let pk_org = props.form.getFormItemsValue(tableId, 'pk_org').value;
					let pk_depositbank = props.form.getFormItemsValue(tableId, 'pk_depositbank').value;
					// let pk_currtype = props.form.getFormItemsValue(this.formId, 'pk_currtype').value;
					// pk_depositbank

					return {
						pk_org: pk_org,
						pk_depositbank: pk_depositbank,
						isDisableDataShow: false,//默认只加载启用的账户
						noConditionOrg: 'N',
						GridRefActionExt: 'nccloud.web.fac.bankfixeddatewithdraw.filter.NCCAccidFilter' //自定义增加的过滤条件	
					};
				};
				break;
			case 'pk_settleacc': // 结算账户
				item.queryCondition = () => {
					let pk_org = props.form.getFormItemsValue(tableId, 'pk_org').value;
					let pk_currtype = props.form.getFormItemsValue(tableId, 'pk_currtype').value;
					// let pk_depositbank = props.form.getFormItemsValue(tableId, 'pk_depositbank').value;
					return {
						pk_org: pk_org,
						pk_currtype: pk_currtype,
						//  pk_depositbank:pk_depositbank,
						isDisableDataShow: false,//默认只加载启用的账户
						noConditionOrg: 'N',
						GridRefActionExt: 'nccloud.web.fac.bankfixeddatewithdraw.filter.NCCAccountFilter' //自定义增加的过滤条件	
					};
				};
				break;

		}

	});
	return meta;
}
/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/