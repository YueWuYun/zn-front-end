/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { list_search_id, list_page_id, list_table_id, appcode, btn_list_inner, BTN } from '../../cons/constant.js';
import { getLang } from "../../util/index";
import bodyButtonClick from './bodyButtonClick';
import buttonUsability from './buttonUsability';
import { setDefOrg2ListSrchArea, setDefOrg2AdvanceSrchArea } from '../../../../../tmpub/pub/util'
let searchId = list_search_id;
let tableId = list_table_id;
let pageId = list_page_id;

export default function (props) {
	let that = this;
	props.createUIDom(
		{
			pagecode: pageId,//页面id
		},
		function (data) {
			if (data) {
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
				}
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta(that, props, meta);
					setDefOrg2AdvanceSrchArea(props, list_search_id, data);
					props.meta.setMeta(meta);
					setDefOrg2ListSrchArea(props, list_search_id, data);
				}
				buttonUsability.call(that, props, '');	//列表按钮置灰
			}
		}
	)
}

function modifierMeta(that, props, meta) {
	meta[searchId].items = meta[searchId].items.map((item, key) => {
		item.col = '3';
		return item;
	})
	meta[searchId].items.find((e) => e.attrcode === 'pk_org').isMultiSelectedEnabled = true;
	meta[searchId].items.map((item) => {
		if (item.attrcode == 'pk_org') {
			item.queryCondition = () => {
				return {
					funcode: appcode,
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter' //自定义参照过滤条件
				};
			};
		}
	});
	//添加操作列
	let material_event = {
		label: getLang(props, '000001'),	/* 国际化处理： 操作*/
		itemtype: 'customer',
		attrcode: 'opr',
		width: '180px',
		visible: true,
		fixed: 'right',
		render: (text, record, index) => {
			let buttonAry = [BTN.LIST.EDIT];
			return props.button.createOprationButton(buttonAry, {
				area: btn_list_inner,
				buttonLimit: 3,
				onButtonClick: (props, key) => bodyButtonClick.call(that, props, key, text, record, index)
			});
		}
	};
	meta[tableId].items.push(material_event);
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/