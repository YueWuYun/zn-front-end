/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { createPage, ajax, base, toast } from 'nc-lightapp-front';
import beSureBtnClick from './beSureBtnClick';
import tableButtonClick from './tableButtonClick';

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
	meta[list_search_id].items = meta[list_search_id].items.map((item, key) => {
		item.visible = true;
		item.col = '3';
		return item;
	})

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

	meta[list_table_id].items = meta[list_table_id].items.map((item, key) => {
		item.width = 150;
		if (item.attrcode == 'starttime'){
			item.render = (text, record, index) => {
				return (
					<span>
						{record && record.starttime 
							&& seperateDate(record.starttime.value)}
					</span>
				);
			};
		}else if (item.attrcode == 'downtime'){
			item.render = (text, record, index) => {
				return (
					<span>
						{record && record.downtime 
							&& seperateDate(record.downtime.value)}
					</span>
				);
			};
		}else if (item.attrcode == 'closetime'){
			item.render = (text, record, index) => {
				return (
					<span>
						{record && record.closetime 
							&& seperateDate(record.closetime.value)}
					</span>
				);
			};
		}
		return item;
	});
	let multiLang = props.MutiInit.getIntl(module_id);

	//添加操作列
	let material_event = {
        label: '操作',
        itemtype: 'customer',
        attrcode: 'opr',
        width: '180px',
        visible: true,
        fixed: 'right',
        render: (text, record, index) => {
			// closetime 日结时间,creationtime 创建时间,downtime 结束受理时间   
			let buttonAry = [];
			if(record){
				// console.log(index+"starttime",record.starttime&&record.starttime.value);
				// console.log(index+"downtime",record.downtime&&record.downtime.value);
				// console.log(index+"closetime",record.closetime&&record.closetime.value);
				// console.log(index+"closetime",record.closetime&&record.closetime.value);
				if(record.starttime && record.starttime.value){
					if(record.downtime && record.downtime.value){

					}else{
						// 结束受理
						buttonAry.push('endsettle');
					}
				}
				if(record.downtime && record.downtime.value){
					if(record.closetime && record.closetime.value){

					}else{
						// 恢复受理
						buttonAry.push('unendsettle');
						// 日结
						buttonAry.push('dailybal');
					}
				}
				if(record.closetime && record.closetime.value){
					// 取消日结
					buttonAry.push('canceldailybal');
				}
			}
            return props.button.createOprationButton(buttonAry, {
                area: "list_inner",
                buttonLimit: 3,
                onButtonClick: (props, key) => tableButtonClick(props, key, text, record, index)
            });
        }
    };
    meta[list_table_id].items.push(material_event);

	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/