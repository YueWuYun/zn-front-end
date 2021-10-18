/*pmFWCFu5nhKkBzYmrkBakaVZInJOA2IJRhIwdhfe+QfB4OFkmRCsDBBI8pDiA3+2*/
import { createPage, ajax, base } from 'nc-lightapp-front';
import buttonClick from './buttonClick';
import { searchBtnClick } from './searchBtnClick';
import { loadSearchCache, goTocard, setListButtonUseful } from '../../util/spegatherUtil';
//引入常量定义
import { app_id, base_url, list_page_id, list_search_id, list_table_id, button_limit, appcode, sourcebill, card_page_url, list_page_url } from '../../cons/constant.js';
let { NCPopconfirm, NCIcon, NCTooltip } = base;


export default function (props) {
	let that = this;
	props.createUIDom(
		{
			pagecode: list_page_id//页面id
		},
		function (data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta(props, meta, that)
					props.meta.setMeta(meta, () => {
						loadSearchCache(props);
					});
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					props.button.setPopContent('Delete', that.state.json['36300STG-000006']);/* 国际化处理： 确定要删除所选数据吗？*/
					setListButtonUseful.call(that);
				}
			}
		}
	)
}

function modifierMeta(props, meta, that) {
	//修改列渲染样式
	meta[list_search_id].items = meta[list_search_id].items.map((item, key) => {
		//item.visible = true;
		item.col = '3';
		return item;
	});
	//设置资金组织可多选
	meta[list_search_id].items.find((e) => e.attrcode === 'pk_org').isMultiSelectedEnabled = true;
	//查询区域的参照过滤
	meta[list_search_id].items.map((item) => {
		//资金组织参照过滤
		if (item.attrcode == 'pk_org') {
			item.isTreelazyLoad = false;
			item.queryCondition = () => {
				return {
					funcode: appcode,
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FundOrgPermissionFilter'
				}
			}
		}
	});
	meta[list_table_id].items = meta[list_table_id].items.map((item, key) => {
		item.width = 150;
		if (item.attrcode == 'vbillno') {
			item.render = (text, record, index) => {
				return (
					<NCTooltip placement="top" overlay={record.vbillno ? record.vbillno.value : ''}>
						<a
							style={{ cursor: 'pointer' }}
							onClick={() => {
								goTocard(props, { status: 'browse', id: record.pk_spegather_h.value, from: 'list' }, that.getState.bind(that));
							}}
						>
							{
								record.vbillno ? record.vbillno.value : ''
							}
						</a>
					</NCTooltip>
				);
			};
		}
		return item;
	});
	//添加操作列
	let multiLang = props.MutiInit.getIntl('3632');
	meta[list_table_id].items.push({
		attrcode: 'opr',
		label: that.state.json['36300STG-000021'],/* 国际化处理： 操作*/
		width: 200,
		fixed: 'right',
		className: "table-opr",
		visible: true,
		render: (text, record, index) => {
			let buttonArr = getBodyButton(record);
			return props.button.createOprationButton(buttonArr, {
				area: "list_inner",
				buttonLimit: button_limit,
				onButtonClick: (props, key) => buttonClick.call(that, props, key, text, record, index)
			});
		}
	});
	return meta;
}
/**
 * 获取表体按钮组
 * @param {*} record 行数据
 */
function getBodyButton(record) {
	//单据状态
	let billstatus = record && record.billstatus && record.billstatus.value;
	//审批状态
	let vbillstatus = record && record.vbillstatus && record.vbillstatus.value;
	//制证标识
	let ismakevoucher = record && record.ismakevoucher && record.ismakevoucher.value;
	//来源模块
	let recmodul = record && record.recmodul && record.recmodul.value;
	let buttonArr;
	if (billstatus == '5') {//待经办
		//来源模块为“现金管理”
		if (recmodul == sourcebill) {
			buttonArr = ['Decide', 'Back', 'Commit'];
		}
		//来源模块为“资金结算”
		else {
			buttonArr = ['Edit', 'Commit', 'Delete'];
		}
	}
	//待审核
	else if (billstatus == '2') {
		buttonArr = ['Uncommit'];
	}
	//转账成功（审核成功）但没制证
	else if (billstatus == '3' && !ismakevoucher) {
		buttonArr = ['Uncommit', 'Premit'];
	}
	//审批通过且制证
	else if (ismakevoucher && vbillstatus == '1') {
		buttonArr = ['UnPremit'];
	}
	return buttonArr;
}

/*pmFWCFu5nhKkBzYmrkBakaVZInJOA2IJRhIwdhfe+QfB4OFkmRCsDBBI8pDiA3+2*/