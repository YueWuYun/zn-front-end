/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { ajax, base } from 'nc-lightapp-front';
let { NCPopconfirm, NCIcon, NCMessage } = base;

let tableId = 'table_closecheck_01';
let pageId = '36070CA_L02';
let appcode ='36070CA';

export default function(props) {
	//请求模板数据
	props.createUIDom(
		{
            pagecode: pageId,//页面pageid
            appcode:appcode,//小应用code
			appid: ''//注册按钮的id
		},
		function (data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta(props, meta)
					props.meta.setMeta(meta);
				}
				
			}
		}
	)
	// let meta = {
    //         "code": "36070CAC_L01",
    //         "pageid": "36070CAC_L01",
    //         "pobdoc": {
    //             "items": [
    //                 {
    //                     "itemtype": "input",
    //                     "visible": true,
    //                     "label": "单据类型",
    //                     "code": "billtype",
    //                     "maxlength": "20",
    //                     "metapath": "billtype"
    //                   },
    //                    {
    //                     "itemtype": "input",
    //                     "visible": true,
    //                     "label": "月末检查不合格单据",
    //                     "code": "message",
    //                     "maxlength": "20",
    //                     "metapath": "message"
    //                   }
    //             ],
    //             "moduletype": "table",
    //             "pagination": false,
    //             "code": "table_curexchange_01",
    //             "name": "关账检查页面"
    //         },
    //         "relation": {}
    //     };
    // meta = modifierMeta(props, meta);
    // props.meta.setMeta(meta);
}

function modifierMeta(props, meta) {
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/