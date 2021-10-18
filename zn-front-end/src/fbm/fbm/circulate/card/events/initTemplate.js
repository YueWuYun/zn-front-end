/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import { base, ajax } from 'nc-lightapp-front';
import { CARD, app_code } from '../../cons/constant';
import { buttonVisible } from './buttonVisible';
import { afterEvent } from './index';

export default function (props, templateCallback) {
	props.createUIDom(
		{
			pagecode: CARD.page_id,//页面id
			appcode: app_code
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
	//表头财务组织
	meta[this.formId].items.map(item => { 
		if (item.attrcode === 'pk_org') { //组织
			item.queryCondition = () => {
				return {
					funcode: this.props.getSearchParam('c'),//appcode获取
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				};
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
	});

	  
	//表体票据编号参照过滤
	meta['guarantee'].items.map(item => {
		if (item.attrcode == 'pk_register' ) {
			item.isMultiSelectedEnabled=true;
			item.queryCondition = () => {	
				let  guaData = this.props.cardTable.getColValue('guarantee', 'pk_register').filter(item => item.value !== '' && item.value !==null).map(item  => item.value);
				let guaDatas = guaData.toString();		
				return {
					pk_register:guaDatas,
					pk_org: this.props.form.getFormItemsValue(this.formId, 'pk_org').value, // 财务组织
                    pk_curr: this.props.form.getFormItemsValue(this.formId, 'pk_curr').value, //币种 
					returntype: this.props.form.getFormItemsValue(this.formId, 'returntype').value, //退票类型
					GridRefActionExt:"nccloud.web.fbm.fbm.rreturn.filter.RreturnRegisterStatusFilter"			
				};
			};
		}

	});
	
	for (let item of Object.keys(meta.gridrelation)) {
		meta[item].items.push({
			attrcode: 'opr',
			label: '操作',
			itemtype: 'customer',
			fixed: 'right',
			className: 'table-opr',
			visible: true,
			width: 200,
			render: (text, record, index) => {

			}
		})
	}

	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/