/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import { base, ajax } from 'nc-lightapp-front';
import { CARD, app_code } from '../../cons/constant';
import { buttonVisible } from './buttonVisible';
import { bodyButtonClick } from './bodyButtonClick';
import { afterEvent } from './index';
import BankaccSubUseTreeGridRef from '../../../../../uapbd/refer/pub/BankaccSubUseTreeGridRef';
import CustSupplierFlexGridTreeRef from '../../../../../uapbd/refer/supplier/CustSupplierFlexGridTreeRef';
export default function (props, templateCallback) {
	let appcode = props.getSearchParam("c") || props.getUrlParam("c");
	props.createUIDom(
		{
			pagecode: CARD.page_id,//页面id
			appcode: appcode
		},
		(data) => {
			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta.call(this, meta);
					props.meta.renderTabs(meta, CARD.tab_order, CARD.tab_order);
					// props.meta.setMeta(meta);
					console.log('meta', meta);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					buttonVisible.call(this, props, button);
				}
				props.form.openArea('billpoolflag');
				templateCallback && templateCallback();
				if (data.context) {
					let context = data.context;
					if (props.getUrlParam('status') === 'add') {
						//设置默认组织
						let { pk_org, org_Name, pk_org_v, org_v_Name } = context;
						if (pk_org) {
							props.form.setFormItemsValue(this.formId, {
								'pk_org': { value: pk_org, display: org_Name },
								'pk_org_v': { value: pk_org_v, display: org_v_Name }
							});
							afterEvent.call(this, props, this.formId, 'pk_org', { display: org_Name, value: pk_org }, { value: null });
						}
					}
				}
			}
		}
	)
}

function modifierMeta(meta) {
	//表头
	meta[this.formId].items.map(item => {
		if (item.attrcode === 'pk_org') { //组织
			item.queryCondition = () => {
				return {
					funcode: this.props.getSearchParam('c'),//appcode获取
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				};
			};
		}
		if (item.attrcode === 'inputperson') { //托管办理人
			item.showHistory = true;
			item.queryCondition = () => {
				return {
					pk_org: this.props.form.getFormItemsValue(this.formId, 'pk_org').value,
				};
			};
		}
		 // 计划项目根据组织过滤
		 if (item.attrcode == "unitplanitem") {
            item.queryCondition = () => {
                let data = this.props.form.getFormItemsValue(
                    this.formId,
                    "pk_org"
                ).value;
                return { pk_org: data };
            };
		}
		

		//自定义项参照
		if (item.attrcode.indexOf("def") > -1) {
			item.queryCondition = (p) => {
				
				let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
				let pk_group = this.props.form.getFormItemsValue(this.formId, 'pk_group').value;
				return {
					pk_org: pk_org,
					pk_group: pk_group,					
				};
			}
		}
		
	})
	//票据池信息
	meta['billpoolflag'].items.map(item => {
		//费率编码
		if (item.attrcode == 'pk_occupyctmanage' ) {

		}
	})
	meta['guarantee'].items.map(item => {
		if (item.attrcode == 'pk_register' ) {
			item.isMultiSelectedEnabled=true;
			item.queryCondition = () => {		
				//let pk_register = this.props.cardTable.getVisibleRows('guarantee').filter(item => item.values.pk_register.value).map(item  => item.values.pk_register.value);
				let  guaData = this.props.cardTable.getColValue('guarantee', 'pk_register').filter(item => item.value !== '' && item.value !==null).map(item  => item.value);
				let guaDatas = guaData.toString();
				//console.log(guaDatas);
				return {
					pk_register:guaDatas,
					inputdate: this.props.form.getFormItemsValue(this.formId, 'inputdate').value, // 财务组织
					pk_org: this.props.form.getFormItemsValue(this.formId, 'pk_org').value, // 财务组织
					pk_curr: this.props.form.getFormItemsValue(this.formId, 'pk_curr').value, //币种 
					GridRefActionExt:"nccloud.web.fbm.fbm.bankkeep.filter.BankKeeppkRegisterFilter"			
				};
			};
		}
		
	});

	meta['guarantee2'].items.map(item => {
		if (item.attrcode == 'pk_register' ) {
			item.queryCondition = () => {	
				let  guaData = this.props.cardTable.getColValue('guarantee', 'pk_register').filter(item => item.value !== '' && item.value !==null).map(item  => item.value);
				let guaDatas = guaData.toString();
				//console.log(guaDatas);
				return {
					pk_register:guaDatas,
					inputdate: this.props.form.getFormItemsValue(this.formId, 'inputdate').value, // 财务组织
					pk_org: this.props.form.getFormItemsValue(this.formId, 'pk_org').value, // 财务组织
					pk_curr: this.props.form.getFormItemsValue(this.formId, 'pk_curr').value, //币种 
					GridRefActionExt:"nccloud.web.fbm.fbm.bankkeep.filter.BankKeeppkRegisterFilter"			
				};
			};
		}
		
	});
	

	for (let item of Object.keys(meta.gridrelation)) {
		meta[item].items.push({
			attrcode: 'opr',
			label: this.props.MutiInit.getIntl("36180BT") && this.props.MutiInit.getIntl("36180BT").get('36180BT-000003'),//* 国际化处理： 操作*//* 国际化处理： this.props.MutiInit.getIntl("36180BT") && this.props.MutiInit.getIntl("36180BT").get('36180BT-000003')*/* 国际化处理： 国际化处理,操作*/
			itemtype: 'customer',
			fixed: 'right',
			className: 'table-opr',
			visible: true,
			width: 200,
			render: (text, record, index) => {
				let buttonAry = [];
				if (this.props.getUrlParam('status') === 'browse') { //浏览态
					buttonAry = [record.expandRowStatus ? 'fold' : 'unfold'];
				}else{
					buttonAry = ['expand','insertRow', 'delRow'];
				}
				return this.props.button.createOprationButton(buttonAry, {
					area: CARD.body_btn_code,
					onButtonClick: (props, key) => bodyButtonClick.call(this, props, key, text, record, index)
				});
			}
		})
	}

	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/