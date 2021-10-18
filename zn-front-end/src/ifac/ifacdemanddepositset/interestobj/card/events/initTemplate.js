/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/
import { app_id, card_from_id, card_table_id, card_page_id,app_code,card_table_id_edit } from '../../cons/constant.js';
import { versionsControl } from "../../../../pub/util/util.js";
import { buttonVisible } from './buttonVisible';
import { bodyButtonClick } from './bodyButtonClick';

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
					if(props.getUrlParam('status') == 'add'){
						// props.initMetaByPkorg();
						props.form.setFormItemsValue(formId,{ 'pk_org': { value:data.context.pk_org,display:data.context.org_Name} });
						that.toggleShow();
					}
					if (props.getUrlParam('status') == 'edit' || props.getUrlParam('status') == 'copy') {
						props.form.setFormItemsDisabled(formId,{'pk_org':true});
						that.toggleShow();
					}
					
					
					if (props.getUrlParam('status') == 'browse') {
						props.form.setFormItemsDisabled(formId,{'isgroupaccount':true});
						that.toggleShow();
					}
					if (props.getUrlParam('status') == 'edit' && props.getUrlParam('copyFlag') == 'copy') {
						props.form.setFormItemsDisabled(formId,{'pk_org':true});
						that.toggleShow();
					}
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
	meta[card_table_id].status = status;
    //成本中心跨集团参照
    meta[card_from_id].items.find((e) => e.attrcode == 'pk_capitalcenter').isShowUnit = true;
	//开户银行过滤
	meta[card_from_id].items.map((item) => {

		//资金组织过滤
		if (item.attrcode == 'pk_org') {
			item.isShowDisabledData = false;
			item.queryCondition = () => {
				return {
					funcode: '36340AIAC',
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FundOrgPermissionFilter'
				};
			}
		}

		//利率编码过滤
        if (item.attrcode == 'pk_ratecode') {
            item.queryCondition = () => {
                let begdate = props.form.getFormItemsValue(card_from_id, 'begdate').value;
                if(begdate === null){
					return {
                	};
				}else{
					return {
						revisedate: begdate,
						GridRefActionExt: 'nccloud.web.ifac.interestobj.filter.NCCRateFilter'//自定义参照过滤条件
	                };
				}
                
            }
        }

		//划入账户过滤过滤
        if (item.attrcode == 'pk_account_g') {
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
						GridRefActionExt: 'nccloud.web.ifac.interestobj.filter.NCCAccountFilter'//自定义参照过滤条件
	                };
				}
                
            };
        }
	});


	//子表
	meta[card_table_id].items.map((item) => {

		//子表账户编码过滤
        if (item.attrcode == 'pk_accid') {
            item.queryCondition = () => {
                let pk_org = props.form.getFormItemsValue(card_from_id, 'pk_org').value;
				let pk_currtype = props.form.getFormItemsValue(card_from_id, 'pk_currtype').value;
                if(pk_org === null){
					return {
                	};
				}else{
					return {
						pk_org: pk_org,
						pk_currtype: pk_currtype,
						GridRefActionExt: 'nccloud.web.ifac.interestobj.filter.NCCAccountFilter'//自定义参照过滤条件
	                };
				}
                
            };
        }
	});
	//子表
	meta[card_table_id_edit].items.map((item) => {

		//子表账户编码过滤
        if (item.attrcode == 'pk_accid') {
            item.queryCondition = () => {
                let pk_org = props.form.getFormItemsValue(card_from_id, 'pk_org').value;
				let pk_currtype = props.form.getFormItemsValue(card_from_id, 'pk_currtype').value;
                if(pk_org === null){
					return {
                	};
				}else{
					return {
						pk_org: pk_org,
						pk_currtype: pk_currtype,
						GridRefActionExt: 'nccloud.web.ifac.interestobj.filter.NCCAccountFilter'//自定义参照过滤条件
	                };
				}
                
            };
        }
	});
	

	let porCol = {
		attrcode: 'opr',
		label: that.state.json['36340AIAC-000047'],
		visible: true,
		itemtype: 'customer',
		width: '200px',
		fixed: 'right',
		render: (text, record, index) => {
			let buttonAry =
				props.getUrlParam('status') === 'browse'
					? record.expandRowStatus ? ['Closeline'] : ['Openline']
					: ['OpenlineEdit', 'InsertRow'];
			return props.button.createOprationButton(buttonAry, {
				area: "card_body_inner",
				buttonLimit: 3,
				onButtonClick: (props, key) => bodyButtonClick.call(that, props, key, text, record, index, tableId)
			});
		}
	};
	meta[tableId].items.push(porCol);
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/