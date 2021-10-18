/*pmFWCFu5nhKkBzYmrkBakSyfTwhWpk4XRVJggXxHt0O/7C0qG9iK3AHbi3mv/Fzl*/
import { createPage, ajax, base, toast } from 'nc-lightapp-front';
let { NCPopconfirm, NCIcon, NCTooltip } = base;
//引入查询、列表区域缓存封装方法
import { go2card, loadSearchCache } from "../../util/index";
import { base_url, list_table_id, list_page_id, list_search_code, dataSource, card_page_id, islink } from '../../cons/constant.js';
import { setButtonUsability } from '../events';
//引入缓存
import { deleteCacheDataForList, setDefData, getDefData } from '../../../../../tmpub/pub/util/cache';
//引入查询区域赋值方法
import { setDefOrg2ListSrchArea, setDefOrg2AdvanceSrchArea } from '../../../../../tmpub/pub/util/index.js';
import { setPropCache, saveMultiLangRes, loadMultiLang } from "../../../../../tmpub/pub/util/index";

let searchId = '36320FARF_list_search';
let tableId = '36320FARF_list_table';
let pageId = '36320FARF_L01';
export default function (props) {
	let that = this;
	props.createUIDom(
		{
			pagecode: pageId,//页面id
			appid: '0001Z61000000002MI32'//注册按钮的id
		},
		function (data) {
			if (data) {
				if (data.template) {
					//判断是否被联查
					let querytype = props.getUrlParam('linkquerytype');
					if (querytype) {
						setDefData(dataSource, islink, true);
					}
					let meta = data.template;
					meta = modifierMeta(props, meta, that)
					//给高级查询区域 赋值
					debugger
					let { pk_org, org_Name } = data.context;
					//遍历查询区域字段，将默认业务单元赋值给组织字段
					meta[searchId].items.map((item) => {
						if (item.attrcode == 'pk_org_p') {
							item.initialvalue = { 'display': org_Name, 'value': pk_org }
						}
					});

					props.meta.setMeta(meta);
					loadSearchCache(props);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);

					if (getDefData(dataSource, islink)) {
						//没有刷新按钮
						props.button.setButtonVisible(['Refresh'], false);
					}
					setButtonUsability(props);
				}
				if (!getDefData(dataSource, islink)) {
					if (data.context) {
						let context = data.context;
						// 设置查询区某个字段的值
						props.search.setSearchValByField(list_search_code, 'pk_org_p',
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
	
	//收款单位跨集团参照
	meta[searchId].items.find((e) => e.attrcode == 'pk_org_r').isShowUnit = true;

	meta[searchId].items.map((item) => {
		//参照的档案中显示"显示停用"
        item.isShowDisabledData = true;  		
		//财务组织根据角色权限显示
		if (item.attrcode == 'pk_org_p') {
			item.queryCondition = () => {
				return {
					funcode: "36320FARF",
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				};
			};
		}

		//币种过滤 下拨银行账户
		//根据 下拨组织pk_payorg 过滤 下拨银行账户pk_bankacc_p
		if (item.attrcode == 'pk_bankacc_p') {
			item.queryCondition = () => {
				//币种
				let search_currtype_p = props.search.getSearchValByField('36320FARF_list_search', 'pk_currtype');//币种
				if (search_currtype_p) {
					search_currtype_p = search_currtype_p.value.firstvalue;
				} else {
					search_currtype_p = null;
				}
				//下拨组织
				let search_payorg_value = props.search.getSearchValByField('36320FARF_list_search', 'pk_org_p');
				if (search_payorg_value) {
					search_payorg_value = search_payorg_value.value.firstvalue;
				} else {
					search_payorg_value = null;
				}
				return {
					pk_currtype: search_currtype_p,
					pk_org: search_payorg_value,
					refnodename: loadMultiLang(props,'36320FARF-000024'),/* 国际化处理： 使用权参照*/
					noConditionOrg: 'Y',
					GridRefActionExt: 'nccloud.web.sf.allocation.allocateapply.filter.QueryTempCurrtypeFilterBankacc,' +//根据币种过滤
						'nccloud.web.sf.allocation.allocateapply.filter.QueryTempPayorgFilterBankacc'//根据 下拨组织过滤
				};
			};
		}

		//币种过滤 收款银行账户 与上面走同一逻辑
		if (item.attrcode == 'pk_bankacc_r') {
			item.queryCondition = () => {
				//币种过滤
				let search_currtype_r = props.search.getSearchValByField('36320FARF_list_search', 'pk_currtype');//币种
				if (search_currtype_r) {
					search_currtype_r = search_currtype_r.value.firstvalue;
				} else {
					search_currtype_r = null;
				}
				//上收组织
				let search_payorg_value = props.search.getSearchValByField('36320FARF_list_search', 'pk_org_r');
				if (search_payorg_value) {
					search_payorg_value = search_payorg_value.value.firstvalue;
				} else {
					search_payorg_value = null;
				}
				return {
					pk_currtype: search_currtype_r,
					pk_org: search_payorg_value,
					refnodename: loadMultiLang(props,'36320FARF-000024'),/* 国际化处理： 使用权参照*/
					noConditionOrg: 'Y',
					GridRefActionExt: 'nccloud.web.sf.allocation.allocateapply.filter.QueryTempCurrtypeFilterBankacc,' +//根据币种过滤
						'nccloud.web.sf.allocation.allocateapply.filter.QueryTempPayorgFilterBankacc'//根据 上收组织过滤
				};
			};
		}

	});
	let islinked = getDefData(dataSource, islink);
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
								id: record.pk_allocatereceipt.value
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
	//添加操作列
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakSyfTwhWpk4XRVJggXxHt0O/7C0qG9iK3AHbi3mv/Fzl*/