/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/
import { app_id, card_from_id, card_table_id, card_page_id,app_code } from '../../cons/constant.js';
import { versionsControl } from "../../../../pub/util/util.js";
import { buttonVisible } from './buttonVisible';


const formId = card_from_id;
const tableId = card_table_id;
const pageId = card_page_id;

export default function (props) {
	let that = this;
	props.createUIDom(
		{
			pagecode: pageId//页面id
		},
		function (data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta(that, props, meta);
					props.meta.setMeta(meta,()=>{
					});
					
					
					versionsControl(props,card_from_id);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button, () => {
						buttonVisible(props);
					});
				}
			}
		}
	) 
}

function modifierMeta(that, props, meta) {
	let status = props.getUrlParam('status');
	meta[card_from_id].status = status;
	// meta[card_table_id].status = status;
	
	//开户银行过滤
	meta[card_from_id].items.map((item) => {

		
		if (item.attrcode == 'pk_org') {
			item.isShowDisabledData = false;
			item.queryCondition = () => {
				return {
					funcode: '36341FDLQ',
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				};
			}
		}
		//定期账户过滤过滤
        if (item.attrcode == 'pk_depositacc') {
            item.queryCondition = () => {
                let pk_org = props.form.getFormItemsValue(card_from_id, 'pk_org').value;
				let pk_currtype = props.form.getFormItemsValue(card_from_id, 'pk_currtype').value;
                if(pk_org === null || pk_currtype === null){
					return {
                	};
				}else{
					return {
						pk_org: pk_org,
						pk_currtype:pk_currtype,
						GridRefActionExt: 'nccloud.web.ifac.depositreceipt.filter.NCCAccountFilter'//自定义参照过滤条件
	                };
				}
                
            };
        }
		//结算账户过滤过滤
        if (item.attrcode == 'pk_depositorg') {
            item.queryCondition = () => {
                let pk_org = props.form.getFormItemsValue(card_from_id, 'pk_org').value;
				let pk_currtype = props.form.getFormItemsValue(card_from_id, 'pk_currtype').value;
                if(pk_org === null || pk_currtype === null){
					return {
                	};
				}else{
					return {
						pk_org: pk_org,
						pk_currtype:pk_currtype,
						GridRefActionExt: 'nccloud.web.ifac.depositreceipt.filter.NCCAccountFilter'//自定义参照过滤条件
	                };
				}
                
            };
        }
		//活期利率编码过滤
		if (item.attrcode == 'pk_aiacrate') {
            item.queryCondition = () => {
	            return {
					GridRefActionExt: 'nccloud.web.ifac.depositreceipt.filter.NCCRateFilter'//自定义参照过滤条件
                };
			}
        }
		//定期利率编码过滤
		if (item.attrcode == 'pk_depostrate') {
            item.queryCondition = () => {
	            return {
					GridRefActionExt: 'nccloud.web.ifac.depositreceipt.filter.NCCRateFilter'//自定义参照过滤条件
                };
			}
        }
		
	});


	
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/