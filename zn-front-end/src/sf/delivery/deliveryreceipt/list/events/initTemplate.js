/*pmFWCFu5nhKkBzYmrkBakSyfTwhWpk4XRVJggXxHt0O/7C0qG9iK3AHbi3mv/Fzl*/
import { createPage, ajax, base, toast } from 'nc-lightapp-front';
let { NCPopconfirm, NCIcon, NCTooltip } = base;
import buttonClick from './buttonClick';
import { base_url, list_table_id, list_page_id, list_search_id, dataSource, card_page_id, islink } from '../../cons/constant.js';
//引入查询、列表区域缓存封装方法
import { go2card, loadSearchCache } from "../../util/index";
import { setButtonUsability } from '../events';
//引入缓存
import { deleteCacheDataForList, setDefData, getDefData } from '../../../../../tmpub/pub/util/cache';
//引入查询区域赋值方法
import { setDefOrg2ListSrchArea, setDefOrg2AdvanceSrchArea } from '../../../../../tmpub/pub/util/index.js';
import { setPropCache, saveMultiLangRes, loadMultiLang } from "../../../../../tmpub/pub/util/index";

let searchId = '36320FCR_list_search';
let tableId = '36320FCR_list_table';
let pageId = '36320FCR_L01';
export default function (props) {
	let that = this;
	props.createUIDom(
		{
			pagecode: pageId,//页面id
			appcode: props.getUrlParam('c'),
			appid: '0001Z61000000002DA9E'//注册按钮的id
		},
		function (data) {
			if (data) {
				if (data.template) {
					//判断是否被联查(有三种场景来源单据、凭证、预算)
					let querytype = props.getUrlParam('linkquerytype');//来源单据
					let src = props.getUrlParam('scene');//凭证
					let pk_ntbparadimvo = props.getUrlParam('pk_ntbparadimvo');//预算	
					//联查场景 添加联查标志缓存
					if (querytype || src == 'fip' || pk_ntbparadimvo) {
						setDefData(dataSource, islink, true);
					}

					let meta = data.template;
					meta = modifierMeta(props, meta, that)
					//给高级查询区域 赋值
					setDefOrg2AdvanceSrchArea(props, searchId, data);

					props.meta.setMeta(meta);
					loadSearchCache(props);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					setButtonUsability(props);
					//被联查时 没有刷新 记账 取消记账
					if (getDefData(dataSource, islink)) {
						props.button.setButtonVisible(['Bookkeeping', 'UnBookkeeping', 'Refresh'], false);
					}
				}
				if (!getDefData(dataSource, islink)) {
					if (data.context) {
						let context = data.context;
						// 设置查询区某个字段的值
						props.search.setSearchValByField(searchId, 'pk_org',
							{
								value: context.pk_org,
								display: context.org_Name
							});
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

function modifierMeta(props, meta, that) {

	//上收组织跨集团参照
	meta[searchId].items.find((e) => e.attrcode == 'pk_org_r').isShowUnit = true;	

	meta[searchId].items.map((item) => {
		//参照的档案中显示"显示停用"
        item.isShowDisabledData = true;  		
		//财务组织根据角色权限显示
		if (item.attrcode == 'pk_org') {
			item.queryCondition = () => {
				return {
					funcode: "36320FCR",
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				};
			};
		}

		//币种过滤 付款银行账户
		//根据 pk_org 过滤 付款银行账户pk_bankacc_p
		if (item.attrcode == 'pk_bankacc_p') {
			item.queryCondition = () => {
				debugger
				//币种
				let search_currtype_p = props.search.getSearchValByField('36320FCR_list_search', 'pk_currtype');//币种
				if (search_currtype_p) {
					search_currtype_p = search_currtype_p.value.firstvalue;
				} else {
					search_currtype_p = null;
				}
				//下拨组织
				let search_payorg_value = props.search.getSearchValByField('36320FCR_list_search', 'pk_org');
				if (search_payorg_value) {
					search_payorg_value = search_payorg_value.value.firstvalue;
				} else {
					search_payorg_value = null;
				}
				return {
					pk_currtype: search_currtype_p,
					pk_org: search_payorg_value,
					refnodename: loadMultiLang(props,'36320FCR-000046'),/* 国际化处理： 使用权参照*/
					noConditionOrg: 'Y',
					GridRefActionExt: 'nccloud.web.sf.allocation.allocateapply.filter.QueryTempCurrtypeFilterBankacc,' +//根据币种过滤
						'nccloud.web.sf.allocation.allocateapply.filter.QueryTempPayorgFilterBankacc'//根据 下拨组织过滤
				};
			};
		}

		//币种过滤 上收银行账户 与上面走同一逻辑
		if (item.attrcode == 'pk_bankacc_r') {
			item.queryCondition = () => {
				//币种过滤
				let search_currtype_r = props.search.getSearchValByField('36320FCR_list_search', 'pk_currtype');//币种
				if (search_currtype_r) {
					search_currtype_r = search_currtype_r.value.firstvalue;
				} else {
					search_currtype_r = null;
				}
				//上收组织
				let search_payorg_value = props.search.getSearchValByField('36320FCR_list_search', 'pk_org_r');
				if (search_payorg_value) {
					search_payorg_value = search_payorg_value.value.firstvalue;
				} else {
					search_payorg_value = null;
				}
				return {
					pk_currtype: search_currtype_r,
					pk_org: search_payorg_value,
					refnodename: loadMultiLang(props,'36320FCR-000046'),/* 国际化处理： 使用权参照*/
					noConditionOrg: 'Y',
					GridRefActionExt: 'nccloud.web.sf.allocation.allocateapply.filter.QueryTempCurrtypeFilterBankacc,' +//根据币种过滤
						'nccloud.web.sf.allocation.allocateapply.filter.QueryTempPayorgFilterBankacc'//根据 上收组织过滤
				};
			};
		}
	});

	meta[searchId].items = meta[searchId].items.map((item, key) => {
		//		item.visible = true;
		item.col = '3';
		return item;
	})
	meta[tableId].pagination = true;
	meta[tableId].items = meta[tableId].items.map((item, key) => {
		// item.width = 150;
		if (item.attrcode == 'vbillno') {
			item.render = (text, record, index) => {
				return (
					// <NCTooltip placement="top" overlay={record.vbillno ? record.vbillno.value : ''}>
						<a
							style={{ cursor: 'pointer' }}
							onClick={() => {
								go2card(props, {
									pagecode: card_page_id, status: 'browse',
									id: record.pk_deliveryreceipt.value
								},
									that.getState.bind(that));
							}}
						>
							{record && record.vbillno && record.vbillno.value}
						</a>
					// </NCTooltip>
				);
			};
		}
		return item;
	});
	let multiLang = props.MutiInit.getIntl('3632');
	//非联查情况 添加操作列
	if (!getDefData(dataSource, islink)) {
		//添加操作列
		meta[tableId].items.push({
			attrcode: 'opr',
			//		label: multiLang && multiLang.get('3630-0005'),
			label: loadMultiLang(props,'36320FCR-000047'),/* 国际化处理： 操作*/
			itemtype:'customer',//隐藏气泡样式
			width: 250,
			fixed: 'right',
			className: "table-opr",
			visible: true,
			render: (text, record, index) => {
				let buttonAry = [];
				//是否记账
				if (record.istally.value == false) {//没有记账 显示记账
					buttonAry = ['BookkeepingInner'];
				} else {//已经记账 判断是否制证
					if (record.isvoucher.value == false) {//没有制证 显示取消记账和制证
						buttonAry = ['UnBookkeepingInner', 'Certification'];
					} else if (record.isvoucher.value == true) {//已经制证 显示取消制证
						buttonAry = ['UnCertification'];
					}
				}
				// return props.button.createOprationButton(buttonAry, {
				// 	area: "list_inner",
				// 	buttonLimit: 3,
				// 	onButtonClick: (props, key) => buttonClick.call(that, props, key, text, record, index)
				// });
				return (props.button.createErrorButton({
					record,
					showBack: false,
					sucessCallBack: () => {
						return props.button.createOprationButton(buttonAry,
							{
								area: "list_inner",//区域编码
								buttonLimit: 3,//按钮显示个数
								onButtonClick: (props, key) => { buttonClick.call(this, props, key, text, record, index); }
							});
					}
				}));
			}
		});
	}

	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakSyfTwhWpk4XRVJggXxHt0O/7C0qG9iK3AHbi3mv/Fzl*/