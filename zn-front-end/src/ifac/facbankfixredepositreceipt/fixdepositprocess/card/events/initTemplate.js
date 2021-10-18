/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/
import { formId, pageCodeCard, billinfo, tableId } from '../../cons/constant';
import { buttonVisible } from './buttonVisible';
import { versionsControl } from "../../../../pub/util/util.js";
import { afterEventEdit } from "./afterEvent";
import { processHeadOlcRateEditable } from '../../cons/constant';
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
					meta = modifierMeta(props, meta);
					props.meta.setMeta(meta);
					versionsControl(props,formId);
				}
				if (data.button) {
					let button = data.button;
					// props.button.setButtons(button);
					props.button.setButtons(button, () => {
						buttonVisible.bind(this, props);
					});
				}
				if (data.context) {
					let context = data.context;
					if (props.getUrlParam('status') === 'add' && props.getUrlParam('status') != 'copy') {
						props.form.setFormStatus(formId, 'add');
						if (context.pk_org) {
							//设置默认组织
							let { pk_org, org_Name, pk_org_v, org_v_Name } = data.context;
							let pkorg = {
								value: context.pk_org,
								display: context.org_Name
							};
							props.form.setFormItemsValue(formId, {
								'pk_org': { value: pk_org, display: org_Name },
							});
							props.form.setFormItemsDisabled(formId, { 'pk_org': false });
							afterEventEdit.call(
								this,
								props,
								formId,
								"pk_org",
								{ display: org_Name, value: pk_org }
							);
						}else{
								props.initMetaByPkorg();
									if(props.getUrlParam('isCopy') === 'copy'){
										if(props.getUrlParam('userjson')){
											let userjson = props.getUrlParam('userjson');
											let {retExtParam} =userjson;
											processHeadOlcRateEditable(props, retExtParam);
										}
								}
							}
					}
					buttonVisible.call(this, props);
				}
			}
		}
	)
}


function modifierMeta(props, meta) {
	//参照过滤
	meta[formId].items.map((item) => {
		switch (item.attrcode) {

			//财务组织过滤
			case 'pk_org' :
			
				item.isShowDisabledData = false;
				item.queryCondition = () => {
					return {
						funcode: '36140FDSR',
						TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
					};
				}
				break;

			case 'pk_depositacc': // 定期账户
			    item.queryCondition = () => {

					let pk_org = props.form.getFormItemsValue(tableId, 'pk_org').value;
					let pk_currtype = props.form.getFormItemsValue(tableId, 'pk_currtype').value;
					let depositdate = props.form.getFormItemsValue(tableId, 'depositdate').value;
			        let pk_depositbank = props.form.getFormItemsValue(tableId, 'pk_depositbank').value;
			        return {
						pk_org: pk_org,
						depositdate: depositdate,
			            pk_depositbank: pk_depositbank,
			            pk_currtype: pk_currtype,
					//xuechh bug修改,(1)银行定期存入回单-定期账户没有根据币种筛选,(2)银行定期存入回单-结算账户和定期账户没有根据存款银行进行筛选，且结算账户只显示活期，定期账户只显示定期
			            GridRefActionExt: 'nccloud.web.ifac.fixdepositprocess.filter.DepositaccFilter' //自定义增加的过滤条件	
			        };
			    };
			    break;
			case 'pk_settleacc': // 结算账户
				item.queryCondition = () => {
					let pk_org = props.form.getFormItemsValue(tableId, 'pk_org').value;
					let pk_currtype = props.form.getFormItemsValue(tableId, 'pk_currtype').value;
					let depositdate = props.form.getFormItemsValue(tableId, 'depositdate').value;
					let pk_depositbank = props.form.getFormItemsValue(tableId, 'pk_depositbank').value;
					return {
						pk_org: pk_org,
						pk_currtype: pk_currtype,
						depositdate: depositdate,
						pk_depositbank: pk_depositbank,
						GridRefActionExt: 'nccloud.web.ifac.fixdepositprocess.filter.SettleaccFilter' //自定义增加的过滤条件 
					};
				};
				break;
				
			case 'businessvariety': // 定期业务品种
			    item.queryCondition = () => {
					let pk_org = props.form.getFormItemsValue(tableId, 'pk_org').value;
					let pk_currtype = props.form.getFormItemsValue(tableId, 'pk_currtype').value;
			        return {
						pk_org: pk_org,
			            pk_currtype: pk_currtype,
					//xuechh bug修改,银行定期存入回单-定期业务品种没有根据币种筛选
			            GridRefActionExt: 'nccloud.web.ifac.fixdepositprocess.filter.Businessvariety' //自定义增加的过滤条件	
			        };
			    };
			    break;

		}

	});
	return meta;
}
/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/