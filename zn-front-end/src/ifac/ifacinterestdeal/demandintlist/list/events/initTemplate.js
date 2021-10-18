/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/
import { base } from 'nc-lightapp-front';
let { NCTooltip } = base;
import buttonUsability from './buttonUsability';

import { voucherLinkBill } from '../../busbutton/voucherLinkBill';
import { list_page_id, list_search_id, list_table_id, app_code, card_page_id, gotocardcheck, pkname } from '../../cons/constant.js';
//import bodyButtonClick from './bodyButtonClick';
import { setDefOrg2AdvanceSrchArea, setDefOrg2ListSrchArea, go2CardCheck } from '../../../../../tmpub/pub/util/index.js';

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
			appcode: props.getUrlParam('c')
		},
		function (data) {
			if (data) {
				if (data.template) {
					let meta = data.template;

					//联查场景标志
					let src = props.getUrlParam('scene');
					if ('fip' == src) {
						initData.call(that, props);
					}

					meta = modifierMeta(that, props, meta);
					props.meta.setMeta(meta);
					//高级查询区加载默认业务单元
					setDefOrg2AdvanceSrchArea(props, list_search_id, data);
					//列表查询区加载默认业务单元
					setDefOrg2ListSrchArea(props, list_search_id, data);
				}
				if (data.button) {
					let scene = props.getUrlParam('scene');
					/* 按钮适配  第一步：将请求回来的按钮组数据设置到页面的 buttons 属性上 */
					let button = data.button;
					props.button.setButtons(button);
					buttonUsability.call(this, props, null);
					let type = props.getUrlParam('type');
					if('tryinter'===type){
						
						props.button.setButtonVisible(['refresh',
						'print',
						'prints',
						'output'
					], false);
					}
					//若为联查不显示刷新
					if (scene=="linksce"||scene=="fip") {
						props.button.setButtonVisible(['refresh'], false);
					}
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

function modifierMeta(that, props, meta) {
	// meta[list_search_id].items = meta[list_search_id].items.map((item, key) => {
	// 	item.visible = true;
	// 	item.col = '3';
	// 	return item;
	// })
	//参照
	//meta[list_search_id].items.find((e) => e.attrcode === 'pk_org').isMultiSelectedEnabled = true;
	//meta[list_table_id].pagination = false;
	//资金组织用户过滤

	meta[list_search_id].items.map((item) => {
		item.isShowDisabledData = true;//显示停用
		if (item.attrcode == 'pk_org') {
			item.queryCondition = () => {
				return {
					funcode: app_code,
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FundOrgPermissionFilter'
				};
			};
		}
	});

	//点击列表编号跳转到卡片界面
	meta[list_table_id].items = meta[list_table_id].items.map((item, key) => {
		//item.width = 150;
		//点击某一列跳转到browse状态
		let type = props.getUrlParam('type');
		let scene = props.getUrlParam('scene');
		if (item.attrcode === 'vbillno') {
			item.render = (text, record, index) => {
				return (
					<a style={{ cursor: 'pointer' }}
						onClick={() => {
							go2CardCheck({
								props,
								url: gotocardcheck,
								pk: record[pkname].value,
								ts: record["ts"].value,
								checkTS: false,
								fieldPK: pkname,
								go2CardFunc: () => {
									props.pushTo("/card", {
										status: 'browse',
										id: record.pk_intlist.value,
										douclick: 'douclick',
										type: type,
										pagecode: card_page_id,
										scene:scene,
										islisttocard: "islisttocard"
									});
								}
							})

						}}
					>{record && record.vbillno && record.vbillno.value}
					</ a>
				);
			};
		}
		return item;
	});


	return meta;
}

function initData(props) {
	//主键信息
	let srcid = props.getUrlParam('id');
	//联查场景标志
	let src = props.getUrlParam('scene');
	if ('fip' == src) {//fip代表会计平台
		voucherLinkBill.call(this, this.props, list_page_id, list_table_id);
	}
}

/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/