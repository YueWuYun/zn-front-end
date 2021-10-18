/*pmFWCFu5nhKkBzYmrkBakaVZInJOA2IJRhIwdhfe+QfB4OFkmRCsDBBI8pDiA3+2*/
import { createPage, ajax, base, cardCache } from 'nc-lightapp-front';
import buttonClick from './buttonClick';
import { searchBtnClick, listInitData } from './searchBtnClick';
import { loadSearchCache, goTocard, setListButtonUseful, getCahceValue, autoLoadData } from '../../util/spegatherUtil';
//引入常量定义
import {
	app_id, base_url, list_page_id, list_search_id, list_table_id, button_limit,
	appcode, sourcebill, card_page_url, list_page_url, hasQuery, dataSource, linklist_page_id, list_head_buttons, islink
} from '../../cons/constant.js';
import { SCENE } from "../../../../../tmpub/pub/cons/constant";
let { NCPopconfirm, NCIcon, NCTooltip } = base;
let { setDefData } = cardCache;

export default function (props) {
	let that = this;
	props.createUIDom(
		{
			pagecode: linklist_page_id//页面id
		},
		function (data) {
			if (data) {
				if (data.template) {
					//在缓存中添加联查标识
					setDefData(dataSource, islink, true);

					let meta = data.template;
					//begin mt tanlgeic 20181113 修改调用方式，不要再将上下文对象作为参数调用!!!low!!!
					// meta = modifierMeta(props, meta, that)
					meta = modifierMeta.call(that, props, meta)
					//end tangleic
					props.meta.setMeta(meta);
					initData.call(that, props);
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

//begin tm tangleic 20181113 不要将上下文对象作为参数调用
// function modifierMeta(props, meta, that) {
function modifierMeta(props, meta) {
	const that = this;
	//end tangleic

	//修改列渲染样式
	// meta[list_search_id].items = meta[list_search_id].items.map((item, key) => {
	// 	//item.visible = true;
	// 	item.col = '3';
	// 	return item;
	// });
	//设置资金组织可多选
	// meta[list_search_id].items.find((e) => e.attrcode === 'pk_org').isMultiSelectedEnabled = true;
	// //设置财务组织跨集团
	// meta[list_search_id].items.find((e) => e.attrcode === 'spegatherb.pk_payfinanceorg').isShowUnit = true;
	// //查询区域的参照过滤
	// meta[list_search_id].items.map((item) => {
	// 	//资金组织参照过滤
	// 	if (item.attrcode == 'pk_org') {
	// 		item.isTreelazyLoad = false;
	// 		item.queryCondition = () => {
	// 			return {
	// 				funcode: appcode,
	// 				TreeRefActionExt: 'nccloud.web.tmpub.filter.FundOrgPermissionFilter'
	// 			}
	// 		}
	// 	}
	// });

	meta[list_table_id].items = meta[list_table_id].items.map((item, key) => {
		item.width = 150;
		if (item.attrcode == 'vbillno') {
			item.render = (text, record, index) => {
				return (
						<a
							style={{ cursor: 'pointer' }}
							onClick={() => {
								goTocard(props, { status: 'browse', id: record.pk_spegather_h.value, from: 'list', scene: SCENE.LINK }, that.getState.bind(that));
								//begin tm tangleic 20181117跳转卡片时如果时联查则在url中注入联查场景
								// if (islinked) {
								// 	goTocard(props, { status: 'browse', id: record.pk_spegather_h.value, from: 'list', scene: SCENE.LINK }, that.getState.bind(that));
								// } else {
								// 	goTocard(props, { status: 'browse', id: record.pk_spegather_h.value, from: 'list' }, that.getState.bind(that));
								// }
								//end tangleic
							}}
						>
							{
								record.vbillno ? record.vbillno.value : ''
							}
						</a>
				);
			};
		}
		return item;
	});
	//begin tm tangleic 2018116 被联查列表没有操作列
	//添加操作列
	// let multiLang = props.MutiInit.getIntl('3632');
	// meta[list_table_id].items.push({
	// 	attrcode: 'opr',
	// 	label: that.state.json['36300STG-000021'],/* 国际化处理： 操作*/
	// 	width: 200,
	// 	fixed: 'right',
	// 	className: "table-opr",
	// 	visible: true,
	// 	render: (text, record, index) => {
	// 		let buttonArr = [];
	// 		return props.button.createOprationButton(buttonArr, {
	// 			area: "list_inner",
	// 			buttonLimit: button_limit,
	// 			onButtonClick: (props, key) => buttonClick.call(that, props, key, text, record, index)
	// 		});
	// 	}
	// });
	//end tangleic
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
			buttonArr = ['Decide', 'Commit', 'Back'];
		}
		//来源模块为“资金结算”
		else {
			buttonArr = ['Commit', 'Edit', 'Delete'];
		}
	}
	//待审核
	else if (billstatus == '2') {
		buttonArr = ['Uncommit'];
	}
	//转账成功（审核成功）但没制证
	else if (billstatus == '3' && !ismakevoucher) {
		buttonArr = ['Premit', 'Uncommit'];
	}
	//审批通过且制证
	else if (ismakevoucher && vbillstatus == '1') {
		buttonArr = ['UnPremit'];
	}
	return buttonArr;
}

function initData(props) {
	let id = props.getUrlParam('id');
	//预算明细主键
	let pk_ntbparadimvo = props.getUrlParam('pk_ntbparadimvo');
	//联查场景标志
	let scene = props.getUrlParam('scene');
	//是否已查询标志
	let hasQryFlag = cardCache.getDefData(hasQuery, dataSource);
	//如果有预算明细主键，则表明是从预算联查过滤，进行数据初始化
	if (pk_ntbparadimvo) {
		//缓存中设置联查标志
		cardCache.setDefData(islink, dataSource, true);
		listInitData.call(this, props, 'tbb');
		//凭证反联查 
	} else if (scene == 'fip') {
		//缓存中设置联查标志
		cardCache.setDefData(islink, dataSource, true);
		voucherLinkBill.call(this, props);
	} else if (id) {
		//缓存中设置联查标志
		cardCache.setDefData(islink, dataSource, true);
		listInitData.call(this, props, 'link');
	}
	//如果已查询过，则从缓存中加载列表界面数据
	else if (hasQryFlag) {
		getCahceValue(props, this.updateState.bind(this));
	}
	//如果未查询，则自动加载数据
	else {
		//autoLoadData.call(this, props);
	}
}

// 凭证联查单据
function voucherLinkBill(props) {
	let checkedData = [];
	//缓存中的key为’checkedData’,
	checkedData = cacheTools.get('checkedData');
	if (checkedData && checkedData.length > 0) {
		//分页信息
		let pageInfo = JSON.stringify(props.table.getTablePageInfo(list_table_id));
		let extParam = { pageInfo };
		let data = {
			operatingLogVO: checkedData,
			pageCode: linklist_page_id,
			extParam
		};
		ajax({
			url: base_url + 'spegathervoucherlinkbill.do',
			data: data,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (data) {
						let grid = data.grid;
						//begin tm tangleic 20181116 无论数据多少条都需要将数据加载到列表表格，避免从卡片返回列表后列表是空的
						props.table.setAllTableData(list_table_id, grid[list_table_id]);
						//end tangleic

						let rowlenght = grid[list_table_id].rows;
						if (rowlenght.length == 1) {
							//缓存中设置联查标志
							cardCache.setDefData(islink, dataSource, true);
							let record = rowlenght[0];
							//1条数据跳转到卡片页面
							props.pushTo("/card", {
								status: 'browse',
								id: record.values.pk_spegather_h && record.values.pk_spegather_h.value,
								scene: SCENE.LINK,
							});
						}
						//begin tm tangleic 20181116 无论数据多少条都需要将数据加载到列表表格，避免从卡片返回列表后列表是空的
						// else {
						//多条数据跳转到列表页面
						// props.table.setAllTableData(list_table_id, data[list_table_id]);
						// }
						//end tangleic
					} else {
						props.table.setAllTableData(list_table_id, { rows: [] });
					}
				}
			}
		});
	}
}

/*pmFWCFu5nhKkBzYmrkBakaVZInJOA2IJRhIwdhfe+QfB4OFkmRCsDBBI8pDiA3+2*/