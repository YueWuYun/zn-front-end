/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/
import { base} from 'nc-lightapp-front';
let { NCPopconfirm } = base;
import {  formId, pageCodeCard,save_formId,app_code,FixedWithDrawApplyConst} from '../../cons/constant.js';
import { buttonVisible } from './buttonVisible';
import { setDefData} from '../../../../../tmpub/pub/util/cache';
import { afterEvent } from './index';
import { orgVersionView } from "../../../../../tmpub/pub/util/version/index";


export default function (props) {
	let that = this;
	props.createUIDom(
		{
			pagecode: pageCodeCard,//页面id
			appcode: props.getUrlParam('c')  //复制小应用时传输
		},
		function (data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					modifierMeta(that, props, meta)
					props.meta.setMeta(meta);
					orgVersionView(props, formId);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
				}
				if (data.context) {
					let context = data.context;
					if (props.getUrlParam('status') === 'add' && !that.isCopy) {	
						that.props.form.setFormStatus(formId,'add');
						if(context.pk_group){
							//设置默认组织
							let { pk_group, group_Name} = data.context;
							// let	pkorg = {
							// 	value: context.pk_group,
							// 	display: context.group_Name
							// };
							props.form.setFormItemsValue(formId, {
								'pk_group': { value: pk_group, display: group_Name },
							});
						}
						if(context.pk_org){
							//璁剧疆榛樿缁勭粐
							let { pk_org, org_Name} = data.context;
							let	pkorg = {
								value: context.pk_org,
								display: context.org_Name
							};
							props.form.setFormItemsValue(formId, {
								'pk_org': { value: pk_org, display: org_Name },
							});
							afterEvent.call(that,that.props, formId, "pk_org", pkorg, null, null, null, null, true);
							// that.props.resMetaAfterPkorgEdit();
							that.props.form.setFormItemsDisabled(formId, { 'pk_org': false });
						}else{
							props.initMetaByPkorg(); 
						}
					}else if(props.getUrlParam('status') === 'edit'){
						that.props.form.setFormItemsDisabled(formId, { 'pk_org': true });
					}
					buttonVisible.call(this,props);
				}
			}
		}
	)
}

function modifierMeta(that, props, meta) {
	//参照过滤
    meta[formId].items.map((item) => {
		//显示停用
        item.isShowDisabledData = true;
        //财务组织
        if (item.attrcode == "pk_org") {
			item.isTreelazyLoad = false;
			item.isShowDisabledData =false;
            item.queryCondition = () => {
                return {
                    funcode: app_code,
                    TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
                };
            };
        }
	});
	//参照过滤
    meta[save_formId].items.map((item) => {
		//资金组织参照过滤
		if (item.attrcode == 'pk_fundorg') {
			item.isTreelazyLoad = false;
			item.queryCondition = () => {
				return {
					pk_org: props.form.getFormItemsValue(formId, 'pk_org').value,
					TreeRefActionExt: 'nccloud.web.ifac.fixeddatewithdrawapply.filter.NCCPkfundFilter'
				}
			}
		}
		//存单号（定期存单）
		if (item.attrcode == 'pk_depositreceipt') {
			item.isTreelazyLoad = false;
			item.queryCondition = () => {
				return {
					pk_depositorg: props.form.getFormItemsValue(formId, 'pk_org').value,
					pk_fundorg: props.form.getFormItemsValue(formId, 'pk_fundorg').value,
					GridRefActionExt: 'nccloud.web.ifac.fixeddatewithdrawapply.filter.NCCPkDepositreceiptFilter'
				};
			};
		}
		//结算账户参照过滤
		if (item.attrcode == 'pk_settleacc') {
			item.isTreelazyLoad = false;
			item.queryCondition = () => {
				return {
					pk_org: props.form.getFormItemsValue(formId, 'pk_org').value,
					pk_fundorg: props.form.getFormItemsValue(formId, 'pk_fundorg').value,
					pk_currtype: props.form.getFormItemsValue(formId, 'pk_currtype').value,
					GridRefActionExt: 'nccloud.web.ifac.fixeddatewithdrawapply.filter.NCCPkSettleaccFilter'
				}
			}
		}
		//定期账户参照过滤
		if (item.attrcode == 'pk_depositacc') {
			item.isTreelazyLoad = false;
			item.queryCondition = () => {
				return {
					pk_org: props.form.getFormItemsValue(formId, 'pk_org').value,
					pk_fundorg: props.form.getFormItemsValue(formId, 'pk_fundorg').value,
					pk_currtype: props.form.getFormItemsValue(formId, 'pk_currtype').value,
					GridRefActionExt: 'nccloud.web.ifac.fixeddatewithdrawapply.filter.NCCPkDepositaccFilter'
				}
			}
		}
	});
	return meta;
}
/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/