/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { createPage, ajax, base} from 'nc-lightapp-front';
// import data from '../restmoney.json';
import restmoney from './restmoney.js';
//import intl from 'react-intl-universal';
// import refer from './refer.js';
//import AccountDefaultModelTreeRef from '../../../../../uapbd/refer/fiacc/AccountDefaultModelTreeRef';
// let { NCPopconfirm, NCIcon } = base;
// let searchId = 'search_area';
let tableId = 'restmoney';
// let pageId = '360701OBP_L01';
//let refPath = '../../../../uapbd/refer/org/FinanceOrgTreeRef/index.js'

export default function (props) {
	let data = restmoney.call(this);
	if (data.template) {
		let meta = data.template;
		meta = modifierMeta(props, meta)
		props.meta.setMeta(meta);
	}
	// props.createUIDom(
	// 	{
	// 		pagecode: pageId,//页面id
	// 		appcode: '360701OB'//注册按钮的id  0001Z31000000000YCY2 0001Z31000000002QMYF
	// 	},
	// 	function (data) {
	// 		console.log('templet:  ', data)
	// 		if (data) {
	// 			if (data.template) {
	// 				let meta = data.template;
	// 				meta = modifierMeta(props, meta)
	// 				props.meta.setMeta(meta);
	// 			}
	// 			if (data.button) {
	// 				let button = data.button;
	// 				props.button.setButtons(button);
	// 			}
	// 		}
	// 	}
	// )
}


function modifierMeta(props, meta) {

	meta[tableId].items = meta[tableId].items.map((item, key) => {
		item.width = 150;
		return item;
	});
	
	meta[tableId].showcheck = true;
	meta[tableId].pagination = false;
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/