/*pmFWCFu5nhKkBzYmrkBakaVZInJOA2IJRhIwdhfe+QfB4OFkmRCsDBBI8pDiA3+2*/
import { createPage, ajax, base, cardCache, cacheTools } from 'nc-lightapp-front';
import buttonClick from './buttonClick';
import { searchBtnClick, listInitData } from './searchBtnClick';
//引入常量定义
import { app_id, base_url, list_page_id, appcode, list_search_id, list_table_id, button_limit, card_page_id, sourceModel, card_page_url, hasQuery, dataSource, link_list_page_id } from '../../cons/constant.js';
import { goTocard, goTolinkcard, setListButtonUseful, getCahceValue, autoLoadData } from '../../util/spepayUtil';
let { NCPopconfirm, NCIcon, NCTooltip } = base;
import { saveMultiLangRes, loadMultiLang } from "../../../../../tmpub/pub/util/index";
import { link_card_page_id } from '../../../../../sf/allocation/allocate/cons/constant';

export default function (props) {
	let that = this;
	props.createUIDom(
		{
			pagecode: link_list_page_id,//页面id
			appcode: props.getUrlParam('c')
		},
		function (data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta(props, meta, that)
					props.meta.setMeta(meta);
					initData.call(that, props);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					props.button.setPopContent('BodyDelete', loadMultiLang(props, '1880000025-000006'));/* 国际化处理： 确定要删除所选数据吗？*/
					// setListButtonUseful.call(that);
				}
			}
		}
	)
}

function modifierMeta(props, meta, that) {
	const cardURL = card_page_url;
	//修改列渲染样式
	// meta[list_search_id].items = meta[list_search_id].items.map((item, key) => {
	// 	//item.visible = true;
	// 	item.col = '3';
	// 	return item;
	// });
	// //设置资金组织可多选
	// meta[list_search_id].items.find((e) => e.attrcode === 'pk_org').isMultiSelectedEnabled = true;
	// //设置财务组织跨集团
	// meta[list_search_id].items.find((e) => e.attrcode === 'spetransferb.pk_getfinanceorg').isShowUnit = true;
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
		if (item.attrcode == 'vbillno') {
			item.render = (text, record, index) => {
				return (
					<NCTooltip placement="top" overlay={record.vbillno ? record.vbillno.value : ''}>
						<a
							style={{ cursor: 'pointer' }}
							onClick={() => {
								goTolinkcard(props, { status: 'browse', id: record.pk_spepay_h.value, from: 'list' }, that.getState.bind(that));
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

	//begin tm tangleic 2018116 被联查列表没有操作列
	//添加操作列
	// let multiLang = props.MutiInit.getIntl('3632');
	// meta[list_table_id].items.push({
	// 	attrcode: 'opr',
	// 	label: loadMultiLang(props, '1880000025-000021'),/* 国际化处理： 操作*/
	// 	itemtype: 'customer',
	// 	width: 200,
	// 	fixed: 'right',
	// 	className: "table-opr",
	// 	visible: true,
	// 	render: (text, record, index) => {
	// 		let buttonArr = getBodyButton(record);
	// 		return props.button.createOprationButton(buttonArr, {
	// 			area: "list_body",
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
	//待提交
	if (billstatus == '5') {
		//来源模块为“现金管理”
		if (recmodul == sourceModel.ModuleCode_CMP) {
			buttonArr = ['Decide', 'BodyCommit', 'Back'];
		}
		//来源模块为“资金结算”
		else {
			buttonArr = ['BodyCommit', 'Edit', 'BodyDelete'];
		}
	}
	//待审核
	else if (billstatus == '2') {
		buttonArr = ['BodyUnCommit'];
	}
	//转账成功（审核成功）但没制证
	else if (billstatus == '3' && !ismakevoucher) {
		buttonArr = ['MakeVoucher', 'BodyUnCommit'];
	}
	//审批通过且制证
	else if (vbillstatus == '1' && ismakevoucher) {
		buttonArr = ['UnMakeVoucher'];
	}
	return buttonArr;
}

function initData(props) {
	//预算明细主键
	let pk_ntbparadimvo = props.getUrlParam('pk_ntbparadimvo');
	//是否已查询标志
	let hasQryFlag = cardCache.getDefData(hasQuery, dataSource);
	//如果有预算明细主键，则表明是从预算联查过滤，进行数据初始化
	if (pk_ntbparadimvo) {
		listInitData.call(this, props);
	}

	//src修改为scene
	let src = props.getUrlParam('scene');
	if (src) {
		//fip代表会计平台
		if ('fip' == src) {
			voucherLinkBill.call(this, props);
		}
	}

	//如果已查询过，则从缓存中加载列表界面数据
	else if (hasQryFlag) {
		getCahceValue(props, this.updateState.bind(this));
	}
	//如果未查询，则自动加载数据
	else {
		//autoLoadData.call(this, props);
	}
	let listdata = cardCache.getDefData('listData', dataSource);
	if (listdata && listdata.rows && listdata.rows.length > 0) {
		props.table.setAllTableData(list_table_id, listdata);
	}
}

// 凭证联查单据
function voucherLinkBill(props) {
	debugger
	let checkedData = [];
	//缓存中的key为’checkedData’,
	checkedData = cacheTools.get('checkedData');
	if (checkedData && checkedData.length > 0) {
		//分页信息
		let pageInfo = JSON.stringify(props.table.getTablePageInfo(list_table_id));
		let extParam = { pageInfo };
		let data = {
			operatingLogVO: checkedData,
			pageCode: link_list_page_id,
			extParam
		};
		ajax({
			url: base_url + 'spepayvoucherlinkbill.do',
			data: data,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (data) {
						// majfd 添加分页信息 2019-07-16
						let grid = data.grid;
						//begin tm tangleic 20181116 无论数据多少条都需要将数据加载到列表表格，避免从卡片返回列表后列表是空的
						props.table.setAllTableData(list_table_id, grid[list_table_id]);
						//end tangleic

						let rowlenght = grid[list_table_id].rows;
						//modify tangleic 不懂这步操作的意义在那里，没用，注掉了
						// cardCache.setDefData('listData', dataSource, data[list_table_id]);
						//end tangleic
						if (rowlenght.length == 1) {
							let record = rowlenght[0];
							cardCache.setDefData(hasQuery, dataSource, 'true');
							//1条数据跳转到卡片页面
							props.pushTo("/linkcard", {
								pagecode:link_card_page_id,
								status: 'browse',
								id: record.values.pk_spepay_h && record.values.pk_spepay_h.value,
								scene: "linksce",
							});
						}
						//begin tm tangleic 20181116 无论数据多少条都需要将数据加载到列表表格，避免从卡片返回列表后列表是空的
						// else {
						// //多条数据跳转到列表页面
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