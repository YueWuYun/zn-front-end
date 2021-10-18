/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/
import { base } from 'nc-lightapp-front';
let { NCTooltip } = base;
import buttonUsability from './buttonUsability';
import { list_page_id, list_search_id, list_table_id, app_code, card_page_id } from '../../cons/constant.js';
import bodyButtonClick from './bodyButtonClick';
import {setDefOrg2AdvanceSrchArea,setDefOrg2ListSrchArea} from '../../../../../tmpub/pub/util/index.js';

export default function (props) {
	let that = this;
	let appcode = '';
	let appUrl = decodeURIComponent(window.location.href).split('?');
	if (appUrl && appUrl[1]) {
		let appPrams = appUrl[1].split('&');
		if (appPrams && appPrams instanceof Array) {
			appPrams.find((item) => {
				if (item.indexOf('ar') != -1 && item.split('=')) {
					appcode = item.split('=')[1] && item.split('=')[1];
				}
			});
		}
	}
	props.createUIDom(
		{
			pagecode: list_page_id,//页面id 
			appcode:props.getUrlParam('c')
		},
		function (data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta(that, props, meta);
					props.meta.setMeta(meta);
					//高级查询区加载默认业务单元
					setDefOrg2AdvanceSrchArea(props,list_search_id,data);
					//列表查询区加载默认业务单元
					setDefOrg2ListSrchArea(props,list_search_id,data);
				}
				if (data.button) {
					/* 按钮适配  第一步：将请求回来的按钮组数据设置到页面的 buttons 属性上 */
					let button = data.button;
					props.button.setButtons(button);
					buttonUsability.call(this, props,null);
				}
			}
		}
	)
}

function seperateDate(date){
	if (typeof date !=='string') return ;
	let result = date.split(' ') && date.split(' ')[0];
	return result;
}

function modifierMeta(that, props, meta) {
	meta[list_table_id].pagination = true;
	//资金组织用户过滤
	
	meta[list_search_id].items.map((item) => {
		item.isShowDisabledData = true;//显示停用
		if (item.attrcode == 'pk_org' ) {
			item.queryCondition = () => {
				return {
					funcode: app_code,
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				};
			};
		}
	});

	let multiLang = props.MutiInit.getIntl('3634');
	//添加操作列
	meta['head'].items.push({
		attrcode: 'opr',
		//label: that.state.json['36140FDIC-000019']/**国际化处理：操作 */,
		width: 0,
		fixed: 'right',
		className:"table-opr",
		itemtype: 'customer',

		visible: true,
		render: (text, record, index) => {
			return (props.button.createErrorButton({
				record,
				showBack: false				
			}));
		}
		// render: (text, record, index) => {
		// 	return (props.button.createErrorButton({
		// 		record,
		// 		showBack: false,
		// 		sucessCallBack: () => {
		// 			let buttonAry = ["calculategrid","preaccruedgrid","uncalculategrid","unpreaccruedgrid"];
		// 			return props.button.createOprationButton(buttonAry, {
		// 				area: "list_inner",
		// 				buttonLimit: 3,
		// 				onButtonClick: (props, key) => bodyButtonClick.call(that, props, key, text, record, index)
		// 			});

		// 		}
		// 	}));
		// }
	});
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/