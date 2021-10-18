/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { createPage, ajax, base, toast } from 'nc-lightapp-front';
import tableButtonClick from './tableButtonClick';
import { Templatedata } from "../../config/Templatedata";//配置的id和area信息
let { NCPopconfirm, NCIcon } = base;

let searchId = Templatedata.list_searchid;
let tableId = Templatedata.list_tableid;
let pageId = Templatedata.list_advpageid;
let appId = Templatedata.list_appid;
let oid = Templatedata.list_oid;
let querytype = Templatedata.list_querytype;
let list_inner = Templatedata.list_inner;
//请求url
let inittemp_query = Templatedata.inittemp_query;
let printcard_funcode = Templatedata.printcard_funcode;
let appcode = Templatedata.app_code;
export default function (props) {
	let self = this;
	props.createUIDom(
		{
			pagecode: pageId,//页面id
			appcode: appcode,//小应用code
			appid: appId//注册按钮的id
		},
		function (data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta.call(self, props, meta)
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
function seperateDate(date) {
	if (typeof date !== 'string') return;
	let result = date.split(' ') && date.split(' ')[0];
	return result;
}

function modifierMeta(props, meta) {
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/