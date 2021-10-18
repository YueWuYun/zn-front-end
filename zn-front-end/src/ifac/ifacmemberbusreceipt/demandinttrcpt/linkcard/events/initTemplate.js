/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/
import { base, ajax } from 'nc-lightapp-front';
let { NCPopconfirm } = base;
import { app_id, qcard_from_id, qcard_table_id, qcard_page_id,app_code } from '../../cons/constant.js';
import { buttonVisible } from './buttonVisible';
import { bodyButtonClick } from './bodyButtonClick';
const formId = qcard_from_id;
const tableId = qcard_table_id;
const pageId = qcard_page_id;

export default function (props) {
	let that = this;
	props.createUIDom(
		{
			pagecode: pageId,//页面id
			// appcode: app_code,
			// appid: app_id//注册按钮的id
		},
		function (data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta(that, props, meta);
					props.meta.setMeta(meta,()=>{
					});
					
					if (props.getUrlParam('status') == 'browse') {
						props.form.setFormItemsDisabled(formId,{'isgroupaccount':true});
					}
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
	meta[qcard_from_id].status = status;
	meta[qcard_table_id].status = status;
	//参照//成本中心跨集团参照
    meta[qcard_from_id].items.find((e) => e.attrcode == 'pk_capitalcenter').isShowUnit = true;
	//开户银行过滤
	meta[qcard_from_id].items.map((item) => {
        if (item.attrcode == 'pk_bank') {
            item.queryCondition = () => {
                let pk_banktype = props.form.getFormItemsValue(qcard_from_id, 'pk_banktype').value;
                if(pk_banktype === null){
					return {
                	};
				}else{
					return {
						pk_banktype: pk_banktype,
						// GridRefActionExt: 'nccloud.web.tam.ref.*'//自定义参照过滤条件
	                };
				}
                
            };
        }
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
					: ['OpenlineEdit', 'Insertline'];
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