/*CeVnHyz3mE0DtbDpJxyRtV2xQ3WydCYkOo0KWRxi+SSxX9bTfEn5Dc615DlLU6Mw*/
import { oprBtnVisible, listButtonVisible } from "./events";
import { bodyButtonClick } from "./editListOprButton";
import { searchButtonClick } from "./editListSearch";

/** 
* 整表编辑页面initTemplate
* @author dongyue7
*/

export default function (props) {
	props.createUIDom(
		{
			pagecode: this.pageId,//页面code
			appcode: this.appId
		},
		(data) => {
			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta.call(this, props, meta);
					props.meta.setMeta(meta);
					this.setState({showToast: false, meta: meta});
					searchButtonClick.call(this, this.props);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					listButtonVisible.call(this, props);
				}
			}
		}
	)
}

function modifierMeta(props, meta) {
	meta[this.tableId].items.push({
		itemtype: 'customer',
		attrcode: 'opr',
		label: '操作',
		width: 200,
		fixed: 'right',
		className: "table-opr",
		visible: true,
		itemtype:'customer',
		render: (text, record, index) => {
			let values = record.values;
			let buttonAry = oprBtnVisible.call(this, values[this.sysMark].value, values[this.enableFlag].value, this.pageId);
			return props.button.createOprationButton(buttonAry, {
				area: "list_inner",
				buttonLimit: 3,
				onButtonClick: (props, key) => bodyButtonClick.call(this, props, key, record)
			});
		}
	});
	return meta;
}

/*CeVnHyz3mE0DtbDpJxyRtV2xQ3WydCYkOo0KWRxi+SSxX9bTfEn5Dc615DlLU6Mw*/