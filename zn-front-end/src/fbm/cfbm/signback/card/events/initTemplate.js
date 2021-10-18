/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import { base, ajax } from 'nc-lightapp-front';
import { CARD, app_code } from '../../cons/constant';
import { buttonVisible } from './buttonVisible';
import { bodyButtonClick } from './bodyButtonClick';
import { afterEvent } from './index';
import { orgVersionView } from "../../../../../tmpub/pub/util/version/index";


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
					props.meta.setMeta(meta);
					console.log('meta', meta);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					buttonVisible.call(this, props, button);
				}
				orgVersionView(props, this.formId, "pk_signorg", "pk_signorg_v");
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
		if (item.attrcode === "pk_org") {
			//组织
			item.queryCondition = () => {
				return {
					funcode: this.props.getSearchParam("c"), //appcode获取
					TreeRefActionExt:
						"nccloud.web.tmpub.filter.FinanceOrgPermissionFilter"
				};
			};
		}

		//自定义项参照
		if (item.attrcode.indexOf("def") > -1) {
			//自定义档案按照组织或者集团过滤
			item.queryCondition = p => {
				let pk_org = this.props.form.getFormItemsValue(this.formId, "pk_org").value;
				let pk_group = this.props.form.getFormItemsValue(
					this.formId,
					"pk_group"
				).value;
				return {
					pk_org: pk_org,
					pk_group: pk_group
				};
			};
		}

	});

	for (let item of Object.keys(meta.gridrelation)) {
		meta[item].items.push({
			attrcode: 'opr',
			label: this.props.MutiInit.getIntl("36370BSR") && this.props.MutiInit.getIntl("36370BSR").get('36370BSR-000002'),/* 国际化处理： 操作*//* 国际化处理： 操作*/
			itemtype: 'customer',
			fixed: 'right',
			className: 'table-opr',
			visible: true,
			width: 200,
			render: (text, record, index) => {
				let buttonAry = ['formalprint'];
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