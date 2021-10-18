/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { createPage, ajax, base, toast } from 'nc-lightapp-front';
let { NCPopconfirm, NCIcon } = base;

import { 
    app_id, module_id, list_page_id, list_search_id, list_table_id, appcode 
} from '../../cons/constant.js';

let searchId = list_search_id;
let tableId = list_table_id;
let pageId = list_page_id;
export default function (props) {
	props.createUIDom(
		{
			//页面id
			pagecode: pageId,
			//注册按钮的id
			// appid: app_id,
		},
		function (data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta(props, meta)
					props.meta.setMeta(meta);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
				}
			}
		}
	)
}

function seperateDate(date){
	if (typeof date !=='string') return ;
	// let result = date.split(' ') && date.split(' ')[0];
	let result = date;
	return result;
}

function modifierMeta(props, meta) {
	meta[searchId].items = meta[searchId].items.map((item, key) => {
		item.visible = true;
		item.col = '3';
		return item;
	})

	// 查询条件多选
	meta[searchId].items.find((e) => e.attrcode === 'pk_org').isMultiSelectedEnabled = true;
	// 资金组织用户过滤
	meta[list_search_id].items.map((item) => {
		if (item.attrcode == 'pk_org' ) {
			item.queryCondition = () => {
				return {
					funcode: appcode,
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FundOrgPermissionFilter'
				};
			};
		}
	});

	meta[tableId].items = meta[tableId].items.map((item, key) => {
		item.width = 150;
		if (item.attrcode == 'starttime'){
			item.render = (text, record, index) => {
				return (
					<span>
						{record && record.starttime && seperateDate(record.starttime.value)}
					</span>
				);
			};
		}else if (item.attrcode == 'downtime'){
			item.render = (text, record, index) => {
				return (
					<span>
						{record && record.downtime && seperateDate(record.downtime.value)}
					</span>
				);
			};
		}else if (item.attrcode == 'closetime'){
			item.render = (text, record, index) => {
				return (
					<span>
						{record && record.closetime && seperateDate(record.closetime.value)}
					</span>
				);
			};
		}
		return item;
	});
	let multiLang = props.MutiInit.getIntl(module_id);
	//添加操作列
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/