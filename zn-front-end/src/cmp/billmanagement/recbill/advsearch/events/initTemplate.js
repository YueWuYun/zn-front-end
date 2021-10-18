/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { createPage, ajax, base, toast } from 'nc-lightapp-front';
let { NCPopconfirm, NCIcon } = base;
import tableButtonClick  from './tableButtonClick';
import {Templatedata} from "../../config/Templatedata";//配置的id和area信息
let searchId = Templatedata.list_searchid;
let tableId = Templatedata.list_tableid;
let moudleId = Templatedata.list_moduleid;
export default function (props) {
	let self = this;
	props.createUIDom(
		{
			pagecode: Templatedata.list_advpageid,//页面id
			appcode: Templatedata.app_code,
			appid: Templatedata.list_appid//注册按钮的id
		},
		function (data) {
			if (data) {
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
				}
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta.call(self,props, meta)
					props.meta.setMeta(meta);
				}
				
			}
		}
	)
}

function seperateDate(date) {
	if (typeof date !== 'string') return;
	let result = date.split(' ') && date.split(' ')[0];
	return result;
}

function modifierMeta(props, meta) {
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/