/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/
import { app_id, card_from_id, card_table_id, card_page_id,app_code } from '../../cons/constant.js';
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
					
					if (props.getUrlParam('status') == 'edit') {
						props.form.setFormItemsDisabled(formId,{'pk_org':true});
						that.toggleShow();
					}
					
					
					if (props.getUrlParam('status') == 'browse') {
						props.form.setFormItemsDisabled(formId,{'isgroupaccount':true});
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
	//参照//成本中心跨集团参照
    meta[card_from_id].items.find((e) => e.attrcode == 'pk_capitalcenter').isShowUnit = true;
	//开户银行过滤
	meta[card_from_id].items.map((item) => {

		
		// if (item.attrcode == 'pk_org') {
		// 	item.isShowDisabledData = false;
		// 	item.queryCondition = () => {
		// 		return {
		// 			funcode: '36340CDIR',
		// 			TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
		// 		};
		// 	}
		// }

		
	    });


	let porCol = {
		attrcode: 'opr',
		label: that.state.json['36340CDIR-000047'],
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