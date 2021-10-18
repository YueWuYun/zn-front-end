/*pmFWCFu5nhKkBzYmrkBakaVZInJOA2IJRhIwdhfe+QfB4OFkmRCsDBBI8pDiA3+2*/
import { createPage, ajax, base, cardCache } from 'nc-lightapp-front';
import buttonClick from './buttonClick';
import { searchBtnClick, listInitData } from './searchBtnClick';
import { loadSearchCache, goTocard, setListButtonUseful, getCahceValue, autoLoadData } from '../../util/spegatherUtil';
//引入常量定义
import {
	app_id, base_url, list_page_id, list_search_id, list_table_id, button_limit, appcode,
	sourcebill, card_page_url, list_page_url, hasQuery, dataSource, islink, list_head_buttons
} from '../../cons/constant.js';
import { SCENE } from "../../../../../tmpub/pub/cons/constant";
//引入缓存
import { deleteCacheDataForList, setDefData, getDefData } from '../../../../../tmpub/pub/util/cache';
import { setDefOrg2AdvanceSrchArea, setDefOrg2ListSrchArea } from "../../../../../tmpub/pub/util/index";

let { NCPopconfirm, NCIcon, NCTooltip } = base;


export default function (props) {
	let that = this;
	props.createUIDom(
		{
			pagecode: list_page_id,//页面id
			appcode: props.getUrlParam('c')
		},
		function (data) {
			if (data) {
				if (data.template) {
					//预算明细主键
					let pk_ntbparadimvo = props.getUrlParam('pk_ntbparadimvo');
					if (pk_ntbparadimvo) {
						//缓存添加联查标识
						setDefData(dataSource, islink, true);
					}
					let meta = data.template;
					//高级查询区域加载默认业务单元
					setDefOrg2AdvanceSrchArea(props, list_search_id, data);
					initData.call(that, props);
					meta = modifierMeta(props, meta, that)
					props.meta.setMeta(meta);
					//判断是否被联查
					if (!getDefData(dataSource, islink)) {
						//列表查询区域加载默认业务单元
						setDefOrg2ListSrchArea(props, list_search_id, data);
					}

				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					props.button.setPopContent('Delete', that.state.json['36300STG-000006']);/* 国际化处理： 确定要删除所选数据吗？*/
					//判断是否被联查
					if (getDefData(dataSource, islink)) {
						props.button.setButtonVisible(list_head_buttons, false);
						//begin tm tangleic 20181030 被联查新增按钮不可用 
						props.button.setButtonVisible(['Add'], false);
						props.button.setButtonVisible(['Refresh'], false);
						//end tangleic
						props.button.setButtonVisible(['linkgroup', 'LinkViewApprove', 'LinkSourceBill', 'LinkSendBill', 'LinkQueryVoucher',
							'LinkNtbPlan','ReturnBill', 'Print', 'OutPut', 'File'], true);
					}
					// setListButtonUseful.call(that);
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
	//设置财务组织跨集团
	meta[list_search_id].items.find((e) => e.attrcode === 'spegatherb.pk_payfinanceorg').isShowUnit = true;
	(meta[list_search_id].items.find((e) => e.attrcode === 'pk_costcenter') || {}).isShowUnit = true;
	//查询区域的参照过滤
	meta[list_search_id].items.map((item) => {
		//参照的档案中显示"显示停用"
        item.isShowDisabledData = true;  
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
		//begin tm tangleic 20180110 查询区域增加内部账户的参照过滤
		if (item.attrcode == 'spegatherb.pk_accid') {
			item.queryCondition = () => {
				return {
					//begin tm tangleic 20190110 内部账户参照的实现逻辑，如果注入了单据编号，就不会对销户，冻结状态进行过滤
					billtype: '36JA',
					//end tangleic
					isSelect: true,
					pk_payfinanceorg:props.search.getSearchValByField(list_search_id, 'pk_payfinanceorg').value.firstvalue||'empty',
					pk_org: (props.search.getSearchValByField(list_search_id, 'pk_org').value || {}).firstvalue,
					pk_currtype: (props.search.getSearchValByField(list_search_id, 'pk_currtype').value || {}).firstvalue,
					GridRefActionExt: 'nccloud.web.fts.specialtransfer.spegather.filter.PkAccidFilter'
				}
			}
		}
		//end tangleic
	});
	let islinked = getDefData(dataSource, islink);
	meta[list_table_id].items = meta[list_table_id].items.map((item, key) => {
		// item.width = 150;
		if (item.attrcode == 'vbillno') {
			item.render = (text, record, index) => {
				return (
					// <NCTooltip placement="top" overlay={record.vbillno ? record.vbillno.value : ''}>
					<a
						style={{ cursor: 'pointer' }}
						onClick={() => {
							let ts=record.ts.value;
							let pk=record.pk_spegather_h.value;
							let url=base_url+'gathercheckts.do';
							ajax({
								url,
								data: {pk,ts},
								success: (res) => {
									if (islinked) {
										goTocard(props, { status: 'browse', id: record.pk_spegather_h.value,ts:record.ts.value,
										 from: 'list', scene: SCENE.LINK }, that.getState.bind(that));
									} else {
										goTocard(props, { status: 'browse', id: record.pk_spegather_h.value, ts:record.ts.value,
										from: 'list' }, that.getState.bind(that));
									}
								}
							});
							
							//end tangleic
						}}
					>
						{
							record.vbillno ? record.vbillno.value : ''
						}
					</a>
					// </NCTooltip>
				);
			};
		}
		return item;
	});
	//begin tm tangleic 20181116 获取联查标志，联查场景则不加操作列
	if (!islinked) {
		//end tangleic
		//添加操作列
		let multiLang = props.MutiInit.getIntl('3632');
		meta[list_table_id].items.push({
			attrcode: 'opr',
			label: that.state.json['36300STG-000021'],/* 国际化处理： 操作*/
			width: 200,
			fixed: 'right',
			itemtype: 'customer',
			className: "table-opr",
			visible: true,
			render: (text, record, index) => {
				return (props.button.createErrorButton({
						 record: record,
						 //showBack: false,  //不显示回退，默认显示
						 sucessCallBack: () => {
							 //状态切换成功后，显示业务
							 let buttonArr = getBodyButton(record, islinked);
							 return props.button.createOprationButton(buttonArr, {
								rowIndex: index,
								area: "list_inner",
								buttonLimit: button_limit,
								onButtonClick: (props, key) => buttonClick.call(that, props, key, text, record, index),
								popContainer: document.querySelector(
									".header2"
								),
							});
						 }
					 }));
			}
		});
		//begin tm tangleic 20181116 获取联查标志，联查场景则不加操作列
	}
	//end tangleic
	return meta;
}
/**
 * 获取表体按钮组
 * @param {*} record 行数据
 */
function getBodyButton(record, islinked) {
	//单据状态
	let billstatus = record && record.billstatus && record.billstatus.value;
	//审批状态
	let vbillstatus = record && record.vbillstatus && record.vbillstatus.value;
	//制证标识
	let ismakevoucher = record && record.ismakevoucher && record.ismakevoucher.value;
	//来源模块
	let recmodul = record && record.recmodul && record.recmodul.value;
	let buttonArr;
	//begin tm tangleic 20181030 被联查列表没有操作按钮
	if (islinked) {
		buttonArr = [];
	}
	//end tangleic
	else if (billstatus == '5') {//待经办
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
	}
	//begin tm tangleic 20181030 凭证反联查
	else if (scene == SCENE.FIP) {
		//缓存中设置联查标志
		cardCache.setDefData(islink, dataSource, true);
		listInitData.call(this, props, 'voucher');
	}
	//end tangleic
	//如果已查询过，则从缓存中加载列表界面数据
	else if (hasQryFlag) {
		getCahceValue(props, this.updateState.bind(this));
	}
	//如果未查询，则自动加载数据
	else {
		//autoLoadData.call(this, props);
	}
}

/*pmFWCFu5nhKkBzYmrkBakaVZInJOA2IJRhIwdhfe+QfB4OFkmRCsDBBI8pDiA3+2*/