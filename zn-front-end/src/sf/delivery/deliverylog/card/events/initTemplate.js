/*pmFWCFu5nhKkBzYmrkBakSyfTwhWpk4XRVJggXxHt0O/7C0qG9iK3AHbi3mv/Fzl*/
import { base, ajax } from 'nc-lightapp-front';
let { NCPopconfirm } = base;
import { bodyButtonClick } from './bodyButtonClick';
const formId = 'form_deliverylog_01';
const tableId = 'table_deliverylog_C01';
const pageId = '36321ACLQ_C01';
export default function(props) {
	props.createUIDom(
		{
			pagecode: pageId,//页面id
			appcode: props.getUrlParam('c')  //复制小应用时传输
		}, 
		function (data){
			if(data){
				if(data.template){
					let meta = data.template;
					modifierMeta(props, meta)
					props.meta.setMeta(meta);
					if(props.getUrlParam('status') != 'browse'){
						props.cardTable.addRow(tableId);
					}
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
				}
			}   
		}
	)
}

function modifierMeta(props, meta) {
	let status = props.getUrlParam('status');
	meta[formId].status = status;
	meta[tableId].status = status;
	
	meta[formId].items.map((item) => {
		if (item.attrcode == 'pk_org_v') {
			item.queryCondition = () => {
				let data = props.form.getFormItemsValue(formId, 'vbillcode').value;
				return { vbillcode: data };
			};
		}
	});
	//let multiLang = props.MutiInit.getIntl('2052');
	let porCol = {
		attrcode: 'opr',
		label: props.MutiInit.getIntl("36321ACLQ") && props.MutiInit.getIntl("36321ACLQ").get('36321ACLQ-000000'),/* 国际化处理： 操作*/
		visible: true,
		fixed: 'right',
		width:200,
		className:"table-opr",
		itemtype: 'customer',
		render(text, record, index) {
			let status = props.cardTable.getStatus(tableId);
			let innerButton = [];
			if(status === 'browse'){
				innerButton = record.expandRowStatus ? ['CloseDown'] : ['OpenDown'];
			}
			return (<div className="currency-opr-col">{
				props.button.createOprationButton(innerButton, {
					area: "card_inner",
					buttonLimit: 3,
					onButtonClick: (props, key) => bodyButtonClick(props, key, text, record, index, tableId)
				})
			}
			</div>);
		}
	};
	meta[tableId].items.push(porCol);

	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakSyfTwhWpk4XRVJggXxHt0O/7C0qG9iK3AHbi3mv/Fzl*/