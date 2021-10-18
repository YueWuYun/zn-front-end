/*pmFWCFu5nhKkBzYmrkBakaVZInJOA2IJRhIwdhfe+QfB4OFkmRCsDBBI8pDiA3+2*/
import { createPage, ajax, base, cardCache } from 'nc-lightapp-front';
import buttonClick from './buttonClick';
import { listInitData } from './searchBtnClick';
import {  goTocard, getCahceValue } from '../../util/spepayUtil';
//引入常量定义
import { list_page_id, list_search_id, list_table_id, button_limit, appcode, hasQuery, dataSource, islink,base_url
} from '../../cons/constant.js';
//引入缓存
import { setDefData, getDefData } from '../../../../../tmpub/pub/util/cache';
import { setDefOrg2AdvanceSrchArea, setDefOrg2ListSrchArea } from "../../../../../tmpub/pub/util/index";
import { loadMultiLang } from "../../../../../tmpub/pub/util/index";


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
					meta = modifierMeta.call(this, props, meta)
					props.meta.setMeta(meta);
					//列表查询区域加载默认业务单元
					setDefOrg2ListSrchArea(props, list_search_id, data);
					initData.call(this, props);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					//begin tm tangleic 20181211 表体删除增加交互提示框
					// props.button.setPopContent('Delete', loadMultiLang(props,'1880000025-000006'));/* 国际化处理： 确定要删除所选数据吗？*/
					props.button.setPopContent('BodyDelete', loadMultiLang(props, '1880000025-000006'));/* 国际化处理： 确定要删除所选数据吗？*/
					//end tangleic 
				}
			}
		}.bind(this)
	)
}

function modifierMeta(props, meta) {
	//修改列渲染样式
	meta[list_search_id].items = meta[list_search_id].items.map((item, key) => {
		//item.visible = true;
		item.col = '3';
		return item;
	});
	//设置资金组织可多选
	meta[list_search_id].items.find((e) => e.attrcode === 'pk_org').isMultiSelectedEnabled = true;
	//查询区域的参照过滤
	(meta[list_search_id].items.find((e) => e.attrcode === 'pk_costcenter') || {}).isShowUnit = true;
	meta[list_search_id].items.map((item) => {
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
		if (item.attrcode == 'spetransferb.pk_accid') {
			item.queryCondition = () => {
				return {
					//begin tm tangleic 20190110 内部账户参照的实现逻辑，如果注入了单据编号，就不会对销户，冻结状态进行过滤
					billtype: '36JB',
					//end tangleic
					isSelect: true,
					pk_getfinanceorg:props.search.getSearchValByField(list_search_id, 'pk_getfinanceorg').value.firstvalue||'empty',
					pk_org: (props.search.getSearchValByField(list_search_id, 'pk_org').value || {}).firstvalue,
					pk_currtype: (props.search.getSearchValByField(list_search_id, 'pk_currtype').value || {}).firstvalue,
					GridRefActionExt: 'nccloud.web.fts.specialtransfer.spepay.filter.PkAccidFilter'
				}
			}
		}
	});
	let islinked = getDefData(dataSource, islink);
	meta[list_table_id].items = meta[list_table_id].items.map((item, key) => {
		if (item.attrcode == 'vbillno') {
			item.render = (text, record, index) => {
				return (
					// <NCTooltip placement="top" overlay={record.vbillno ? record.vbillno.value : ''}>
					<a
						style={{ cursor: 'pointer' }}
						onClick={() => {
							let ts=record.ts.value;
							let pk=record.pk_spepay_h.value;
							let url=base_url+'paycheckts.do';
							ajax({
								url,
								data: {pk,ts},
								success: (res) => {
									goTocard(props, { status: 'browse', id: record.pk_spepay_h.value, from: 'list',ts:record.ts.value }, this.getState.bind(this), islinked);
								}
							});
							
						}}
					>
						{
							record.vbillno ? record.vbillno.value : ''
						}
					</a>
					//</NCTooltip>
				);
			};
		}
		return item;
	});
	//添加操作列
	let multiLang = props.MutiInit.getIntl('3632');
	meta[list_table_id].items.push({
		attrcode: 'opr',
		label: loadMultiLang(props, '1880000025-000021'),/* 国际化处理： 操作*/
		width: 200,
		fixed: 'right',
		itemtype: 'customer',
		className: "table-opr", 
		visible: true,
		render: (text, record, index) => {
			return (props.button.createErrorButton({
				record: record,
				showBack: false,  //不显示回退，默认显示
				sucessCallBack: () => {
					//状态切换成功后，显示业务
					let buttonArr = getBodyButton(record, islinked);
					return props.button.createOprationButton(buttonArr, 
						{
							rowIndex: index,
							area: "list_body",
							buttonLimit: button_limit,
							onButtonClick: (props, key) => buttonClick.call(this, props, key, text, record, index),
						});
				}
			}));
		}
	});
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
	if (billstatus == '5') {//待经办
		//来源模块为“现金管理”
		if (recmodul == 'CMP') {
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
	else if (ismakevoucher && vbillstatus == '1') {
		buttonArr = ['UnMakeVoucher'];
	}
	//此时是被联查场景 没有操作列按钮
	else if (islinked) {
		buttonArr = [];
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
		listInitData.call(this, props);
		//凭证反联查  这里在linklist中实现
	}
	// else if (scene == 'fip') {
	// 	voucherLinkBill.call(this, props);
	// }
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