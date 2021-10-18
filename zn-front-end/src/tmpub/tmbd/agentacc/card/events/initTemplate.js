/*pmFWCFu5nhKkBzYmrkBakbCMu6f0sBuWPo0bHXm/6A30+lD1yHlipP2IPXs6cy+K*/
import { appcode, card_from_id, card_table_id, card_page_id } from '../../cons/constant.js';
import { versionControl } from "../../util/util.js";
import {bodyButtonClick} from './bodyButtonClick';
import {buttonVisible} from './buttonVisible';
const formId = card_from_id;
const tableId = card_table_id;
const pageId = card_page_id;
export default function (props) {
	let that = this;
	props.createUIDom(
		{
			pagecode: pageId,//页面id
			//appid: app_id//注册按钮的id
		},
		function (data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					modifierMeta(that, props, meta);
					props.meta.setMeta(meta,()=>{
					});
					if(props.getUrlParam('status') == 'add'){
						props.form.setFormItemsValue(formId,{ 'pk_org': { value:data.context.pk_org,display:data.context.org_Name} });
                        that.toggleShow();
					}
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					// props.button.setPopContent('Deleteline', props.MutiInit.getIntl("36010SA") && props.MutiInit.getIntl("36010SA").get('36010SA-000043'));/* 国际化处理： 确定删除该成员单位吗？*/
				}
				versionControl(props);
				buttonVisible.call(that, props);//按钮显隐性
			}
		}
	)
}

function modifierMeta(that, props, meta) {
	let status = props.getUrlParam('status');
	meta[formId].status = status;
	meta[tableId].status = status;
	meta[tableId].items.find((e) => e.attrcode === 'pk_financeorg').isShowUnit = true;
	//参照过滤
	meta[formId].items.map((item) => {
		item.isShowDisabledData = true;
		//资金组织
		if (item.attrcode == 'pk_org' ) {
			item.queryCondition = () => {
				return {
					funcode: appcode,
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FundOrgPermissionFilter'
				};
			};
		}
		//代理结算账户
		if (item.attrcode == 'pk_bankaccount') {
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(formId, 'pk_org').value;
				let creationtime = props.form.getFormItemsValue('end', 'creationtime').value;
				return {
					pk_orgs: pk_org,
					creationtime: creationtime,
					noConditionOrg:'Y',
					GridRefActionExt: 'nccloud.web.tmpub.agentacc.filter.AgentAccMultiBankAccFilter' //自定义参照过滤条件
				};
			};
		}
	});
	meta[tableId].items.map((item) => {
		//财务组织跨集团
		if (item.attrcode == 'pk_financeorg' ) {
			item.isShowUnit = true;
		}
	});

	let porCol = {
		attrcode: 'opr',
		// label: that.state.json['36010SA-000015'],	/* 国际化处理： 操作*/
		label: props.MutiInit.getIntl("36010SA") && props.MutiInit.getIntl("36010SA").get('36010SA-000015'),
		visible: true,
		itemtype: 'customer',
		width: '260px',
		fixed: 'right',
		render: (text, record, index) => {
			let buttonAry =
				props.getUrlParam('status') === 'browse'
					? []
					: (that.state.pasteflag ? ['Pasteline'] : ['Copyline', 'Insertline', 'Deleteline']);
			return props.button.createOprationButton(buttonAry, {
				area: "card_body_inner",
				buttonLimit: 4,
				onButtonClick: (props, key) => bodyButtonClick.call(that, props, key, text, record, index, tableId)
			});
		}
	};
    meta[tableId].items.push(porCol);
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakbCMu6f0sBuWPo0bHXm/6A30+lD1yHlipP2IPXs6cy+K*/