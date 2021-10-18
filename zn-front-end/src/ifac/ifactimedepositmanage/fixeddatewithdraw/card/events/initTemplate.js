/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/
import { base, ajax,cardCache } from 'nc-lightapp-front';
let { NCPopconfirm } = base;
import {formId, pageCodeCard,app_code,save_formId,FixedWithDrawConst} from '../../cons/constant.js';
import { setDefData} from '../../../../../tmpub/pub/util/cache';
import { orgVersionView } from "../../../../../tmpub/pub/util/version/index";
import { afterEvent } from './index';
import { buttonVisible } from './buttonVisible';


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
					}else if(props.getUrlParam('status') === 'edit' ){
						that.props.form.setFormItemsDisabled(formId, { 'pk_org': true });
					}
					buttonVisible.call(that,that.props); 
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
        //资金组织
        if (item.attrcode == "pk_org") {
			item.isShowDisabledData =false;
			item.isTreelazyLoad = false;
            item.queryCondition = () => {
                return {
                    funcode: app_code,
                    TreeRefActionExt: 'nccloud.web.tmpub.filter.FundOrgPermissionFilter'
                };
            };
        }
	});
	//参照过滤
    meta[save_formId].items.map((item) => {
		//存单号（定期存单）
	if (item.attrcode == 'pk_depositreceipt') {
		item.isTreelazyLoad = false;
		item.queryCondition = () => {
			return {
				pk_org: props.form.getFormItemsValue(formId, 'pk_org').value,
				pk_depositorg: props.form.getFormItemsValue(formId, 'pk_depositorg').value,
				GridRefActionExt: 'nccloud.web.ifac.fixeddatewithdraw.filter.NCCPkDepositreceiptFilter'
			};
		};
	}
	//存款单位
	if (item.attrcode == 'pk_depositorg') {
		item.isTreelazyLoad = false;
		item.queryCondition = () => {
			return {
				pk_org: props.form.getFormItemsValue(formId, 'pk_org').value,
				TreeRefActionExt: 'nccloud.web.ifac.fixeddatewithdraw.filter.NCCPkDepositorgFilter'
			};
		};
	}
	//结算账户参照过滤
	if (item.attrcode == 'pk_settleacc') {
		item.isTreelazyLoad = false;
		item.queryCondition = () => {
			return {
				pk_org: props.form.getFormItemsValue(formId, 'pk_org').value,
				pk_depositorg: props.form.getFormItemsValue(formId, 'pk_depositorg').value,
				pk_currtype: props.form.getFormItemsValue(formId, 'pk_currtype').value,
				GridRefActionExt: 'nccloud.web.ifac.fixeddatewithdraw.filter.NCCPkSettleaccFilter'
			}
		}
	}
	});
	return meta;
}
/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/