/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/
import { app_id, card_from_id, card_table_id, card_page_id,app_code } from '../../cons/constant.js';
import { versionControl } from "../../../../pub/util/util.js";
//import { buttonVisible } from './buttonVisible';
import { bodyButtonClick } from './bodyButtonClick';

const formId = card_from_id;
const tableId = card_table_id;
const pageId = card_page_id;

export default function (props) {
	let that = this;
	props.createUIDom(
		{
			pagecode: pageId,//页面id
			appcode:props.getUrlParam('c')
		},
		function (data) {
			if (data) {
				if (data.template) {
						let meta = data.template;
						meta = modifierMeta(that, props, meta);
						props.meta.setMeta(meta,()=>{
					});
					versionControl(props);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button, () => {
						//buttonVisible(props);
					});
					let type = props.getUrlParam('type');
					if('tryinter'===type){
						
						props.button.setButtonVisible(['refresh',
						'print',
						'prints',
						'output'
					], false);
					}
					if('intercard'===type){
					props.button.setButtonVisible(['linkquerygroup',
			'print',
			'prints',
			'output',
			'amount',
			'interestobj',
			'voucher'], true);
				}
			}
			}
		}
	) 
}

function modifierMeta(that, props, meta) {
	let status = props.getUrlParam('status');
	meta[card_from_id].status = status;
	meta[card_table_id].status = status;
	let porCol = {
		attrcode: 'opr',
		label: that.state.json['36340CDIB-000005']/**国际化处理：操作 */,
		visible: true,
		itemtype: 'customer',
		width: '200px',
		fixed: 'right',
		render: (text, record, index) => {
			let buttonAry = record.expandRowStatus ? ['close'] : ['open']
			return props.button.createOprationButton(buttonAry, {
				area: "card_body_inner",
				buttonLimit: 1,
				onButtonClick: (props, key) => bodyButtonClick.call(that, props, key, text, record, index, tableId)
			});
		}
	};
	meta[tableId].items.push(porCol);
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/