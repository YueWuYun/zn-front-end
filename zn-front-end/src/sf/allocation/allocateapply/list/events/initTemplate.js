/*pmFWCFu5nhKkBzYmrkBakSyfTwhWpk4XRVJggXxHt0O/7C0qG9iK3AHbi3mv/Fzl*/
import { createPage, ajax, base, toast } from 'nc-lightapp-front';
let { NCPopconfirm, NCIcon } = base;
import bodyButtonClick from './bodyButtonClick';
import { setButtonUsability } from '../events';
import { list_page_code, list_search_code, grid_code, appid, card_page_id, app_code, dataSource, islink } from '../../cons/constant.js';
//引入查询、列表区域缓存封装方法
import { go2card, loadSearchCache } from "../../util/index";
//引入查询区域赋值方法
import { setDefOrg2ListSrchArea, setDefOrg2AdvanceSrchArea } from '../../../../../tmpub/pub/util/index.js';
//引入缓存
import { deleteCacheDataForList, setDefData, getDefData } from '../../../../../tmpub/pub/util/cache';
import { setPropCache, saveMultiLangRes, loadMultiLang } from "../../../../../tmpub/pub/util/index";

let searchId = list_search_code;
let tableId = grid_code;
let pageId = list_page_code;
export default function (props) {
	let that = this;
	props.createUIDom(
		{
			pagecode: pageId,//页面id
			appcode: props.getUrlParam('c'),
			appid: appid//注册按钮的id
		},
		function (data) {
			if (data) {
				if (data.template) {

					//判断是否被联查(有三种场景来源单据、凭证、预算)
					let querytype = props.getUrlParam('srcbillid');//来源单据(核准)
					let src = props.getUrlParam('scene');//凭证
					let pk_ntbparadimvo = props.getUrlParam('pk_ntbparadimvo');//预算	
					//联查场景 添加联查标志缓存
					if (querytype || src == 'fip' || pk_ntbparadimvo) {
						setDefData(dataSource, islink, true);
					}

					let meta = data.template;
					meta = modifierMeta(that, props, meta)
					//给高级查询区域 赋值
					setDefOrg2AdvanceSrchArea(props, searchId, data);
					props.meta.setMeta(meta);
					loadSearchCache(props);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					setButtonUsability(props);
					/* 国际化处理： 确认删除该数据？*/
					props.button.setPopContent('DeleteInner', loadMultiLang(props,'36320AA-000060'));
					//被联查时 只有附件 联查 打印
					if (getDefData(dataSource, islink)) {
						props.button.setButtonVisible(['Refresh', 'Add','Commit','Uncommit','Entrust','Unentrust','Delete','Copy'], false);
					}
				}
				if (!getDefData(dataSource, islink)) {
					if (data.context) {
						let context = data.context;
						// 设置查询区某个字段的值
						props.search.setSearchValByField(list_search_code, 'pk_org',
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

function modifierMeta(that, props, meta) {

	//下拨组织跨集团处理
	// meta[searchId].items.find((e) => e.attrcode == 'pk_payorg').isShowUnit = true;

	meta[searchId].items.map((item) => {
		if (item.attrcode == 'pk_payorg') {
			item.isShowUnit = true;
		}
		//参照的档案中显示"显示停用"
        item.isShowDisabledData = true;  		
		//财务组织根据角色权限显示
		if (item.attrcode == 'pk_org') {
			item.queryCondition = () => {
				return {
					// funcode: app_code,
					funcode: props.getSearchParam('c'),//动态获取appcode 用于复制时过滤
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				};
			};
		}

		//币种过滤内部账户 过滤内容在参照中都有过滤 此处不处理 只在后端添加默认条件
		if (item.attrcode == 'allocateapply_b.pk_accid') {
			item.queryCondition = () => {
				let search_currtype_value = props.search.getSearchValByField('search_allocateapply_01', 'pk_currtype');//币种
				if (search_currtype_value) {
					search_currtype_value = search_currtype_value.value.firstvalue;
				} else {
					search_currtype_value = null;
				}
				let search_org_value = props.search.getSearchValByField('search_allocateapply_01', 'pk_org');//币种
				if (search_org_value) {
					search_org_value = search_org_value.value.firstvalue;
				} else {
					search_org_value = null;
				}
				return {
					pk_org: search_org_value,
					pk_currtype: search_currtype_value,
					GridRefActionExt: 'nccloud.web.sf.allocation.allocateapply.filter.QueryTempCurrtypeFilterInnerAcc'
				};
			};
		}

		//币种过滤 下拨银行账户
		//根据 下拨组织pk_payorg 过滤 下拨银行账户pk_bankacc_p
		if (item.attrcode == 'allocateapply_b.pk_bankacc_p') {
			item.queryCondition = () => {
				//币种
				let search_currtype_value = props.search.getSearchValByField('search_allocateapply_01', 'pk_currtype');//币种
				if (search_currtype_value) {
					search_currtype_value = search_currtype_value.value.firstvalue;
				} else {
					search_currtype_value = null;
				}
				//下拨组织
				let search_payorg_value = props.search.getSearchValByField('search_allocateapply_01', 'pk_payorg');
				if (search_payorg_value) {
					search_payorg_value = search_payorg_value.value.firstvalue;
				} else {
					search_payorg_value = null;
				}
				return {
					pk_currtype: search_currtype_value,
					pk_org: search_payorg_value,
					noConditionOrg: 'Y',
					GridRefActionExt: 'nccloud.web.sf.allocation.allocateapply.filter.QueryTempCurrtypeFilterBankacc'//根据币种过滤
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
					<a
						style={{ cursor: 'pointer' }}
						onClick={() => {
							go2card(props, {
								pagecode: card_page_id, status: 'browse',
								id: record.pk_allocateapply_h.value
							},
								that.getState.bind(that));
						}}
					>
						{record && record.vbillno && record.vbillno.value}
					</a>
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
			label: loadMultiLang(props,'36320AA-000026'),/* 国际化处理： 操作*/
			itemtype: 'customer',//隐藏气泡样式
			width: 200,
			fixed: 'right',
			className: "table-opr",
			visible: true,
			render: (text, record, index) => {
				let buttonAry = [];
				if (record.billstatus && record.billstatus.value == '1') {//待审批
					buttonAry = ['UncommitInner', 'ApproveInfoInner'];
				} else if (record.billstatus && record.billstatus.value == '2') {//待委托
					buttonAry = ['EntrustInner', 'ApproveInfoInner', 'UncommitInner'];
				} else if (record.billstatus && record.billstatus.value == '3') {//处理中
					buttonAry = ['CancelEntrustInner', 'ApproveInfoInner'];
				} else if (record.billstatus && record.billstatus.value == '4') {//处理完毕
					buttonAry = ['ApproveInfoInner'];
				} else if (record.billstatus && record.billstatus.value == '5') {//待提交
					buttonAry = ['CommitInner', 'EditInner', 'DeleteInner'];
				}
				return props.button.createOprationButton(buttonAry, {
					area: "list_inner",
					buttonLimit: 3,
					onButtonClick: (props, key) => bodyButtonClick.call(that, props, key, text, record, index)
				});
			}
		});
	}
	if (getDefData(dataSource, islink)) {
		//被联查页面不显示 翻页
		meta[tableId].pagination = false;
	}
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakSyfTwhWpk4XRVJggXxHt0O/7C0qG9iK3AHbi3mv/Fzl*/