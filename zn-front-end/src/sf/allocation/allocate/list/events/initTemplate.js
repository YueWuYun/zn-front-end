/*pmFWCFu5nhKkBzYmrkBakSyfTwhWpk4XRVJggXxHt0O/7C0qG9iK3AHbi3mv/Fzl*/
import { createPage, ajax, base, toast, cardCache } from 'nc-lightapp-front';
let { NCPopconfirm, NCIcon, NCTooltip } = base;
import bodyButtonClick from './bodyButtonClick';
import { go2card, loadSearchCache } from "../../util/index";
import { setButtonUsability } from '../events';
import { setDefOrg2AdvanceSrchArea } from '../../../../../tmpub/pub/util/index'
import { base_url, button, list_table_id, list_page_id, list_search_id, viewmod_deal, billtype, print_nodekey, print_templateid, funcode, dataSource, card_page_id } from '../../cons/constant.js';
import { loadMultiLang } from "../../../../../tmpub/pub/util/index";

let searchId = 'search_allocate_01';
let tableId = 'table_allocate_02';
let pageId = '36320FA_L01';
export default function (props) {
	props.createUIDom(
		{
			pagecode: pageId,//页面id
			appcode: props.getUrlParam('c')
		},
		(data) => {
			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta.call(this, props, meta);
					//高级查询区域家在默认组织
					setDefOrg2AdvanceSrchArea(props, list_search_id, data);
					props.meta.setMeta(meta);

					loadSearchCache(props, data);

				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					setButtonUsability(props);
					props.button.setPopContent('delete_inner', loadMultiLang(props,'36320FA-000060'));/* 国际化处理： 确定要删除吗？*/
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

function modifierMeta(props, meta) {
	meta[list_search_id].items = meta[list_search_id].items.map((item, key) => {
		// item.visible = true;
		item.col = '3';
		return item;
	})
	//刚进页面按钮置灰
	// props.button.setButtonDisabled(button.refreshdisable, true);
	// setButtonUsability(props);
	//设置使用权参照属性值默认
	// meta[list_search_id].items.find((e) => e.attrcode == 'allocate_b.pk_bankacc_r').isShowUnit = true;
	// meta[list_search_id].items.find((e) => e.attrcode == 'allocate_b.pk_bankacc_p').isShowUnit = true;
	// meta[list_search_id].items.find((e) => e.attrcode == 'allocate_b.pk_org_r').isShowUnit = true;
	meta[list_search_id].items.map((item) => {
		if (item.attrcode == 'allocate_b.pk_bankacc_r') {
			item.isShowUnit = true;
		}
		if (item.attrcode == 'allocate_b.pk_bankacc_p') {
			item.isShowUnit = true;
		}
		if (item.attrcode == 'allocate_b.pk_org_r') {
			item.isShowUnit = true;
		}
		item.isShowDisabledData = true;
		// 资金组织过滤
		if (item.attrcode == 'pk_org') {
			item.queryCondition = () => {
				return {
					funcode: props.getSearchParam('c'),
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				};
			}
		}
		//下拨银行账户根据下拨组织过滤
		if (item.attrcode == 'allocate_b.pk_bankacc_p') {
			item.queryCondition = () => {
				let pk_org = props.search.getSearchValByField(searchId, 'pk_org').value.firstvalue;
				let pk_currtype = props.search.getSearchValByField(searchId, 'pk_currtype').value.firstvalue;
				let noConditionOrg = 'N';
				if (pk_org) {
					noConditionOrg = 'Y';
				}
				return {
					pk_currtype: pk_currtype,
					pk_org: pk_org,
					noConditionOrg: noConditionOrg,
					GridRefActionExt: 'nccloud.web.sf.allocation.allocate.filter.AllocateOrgRefPBankAccFilter,nccloud.web.sf.allocation.allocate.filter.AllocateCurrentTypeRefPBankAccFilter,nccloud.web.sf.allocation.allocate.filter.AllocateDefaultRefBankAccFilter,nccloud.web.sf.allocation.allocate.filter.BanksubbaccNoInnerAccFilter,nccloud.web.sf.allocation.allocate.filter.BanksubBaccNoDestroyFilter,nccloud.web.sf.allocation.allocate.filter.BanksubaccNoFrozenFilter,nccloud.web.sf.allocation.allocate.filter.BanksubaccOnlyCurrent,nccloud.web.tmpub.filter.BanksubaccNoInnerAccFilter4NCC,nccloud.web.tmpub.filter.BanksubaccNoDestroyFilter4NCC'
				};
			}

		}
		// 收款银行账户根据币种过滤
		if (item.attrcode == 'allocate_b.pk_bankacc_r') {
			item.queryCondition = () => {
				let pk_org_r = props.search.getSearchValByField(searchId, 'allocate_b.pk_org_r').value.firstvalue;
				let pk_currtype = props.search.getSearchValByField(searchId, 'pk_currtype').value.firstvalue;
				let noConditionOrg = 'N';
				if (pk_org_r) {
					noConditionOrg = 'Y';
				}
				return {
					pk_currtype: pk_currtype,
					pk_org: pk_org_r,
					noConditionOrg: noConditionOrg,
					GridRefActionExt: 'nccloud.web.sf.allocation.allocate.filter.AllocateCurrentTypeRefPBankAccFilter,nccloud.web.sf.allocation.allocate.filter.AllocateDefaultRefBankAccFilter,nccloud.web.sf.allocation.allocate.filter.BanksubbaccNoInnerAccFilter,nccloud.web.sf.allocation.allocate.filter.BanksubBaccNoDestroyFilter,nccloud.web.sf.allocation.allocate.filter.BanksubaccOnlyCurrent,nccloud.web.sf.allocation.allocate.filter.AllocateOrgRefRBankAccFilter'
				};
			}

		}
	});

	meta[tableId].items = meta[tableId].items.map((item, key) => {
		if (item.attrcode == 'vbillno') {
			item.render = (text, record, index) => {
				return (
					// <NCTooltip placement="top" overlay={record.vbillno ? record.vbillno.value : ''}>
					<a
						style={{ cursor: 'pointer' }}
						onClick={() => {
							// props.pushTo('/card', {
							// 	status: 'browse',
							// 	id: record.pk_allocate_h.value
							// });
							go2card(props, { pagecode: card_page_id, status: 'browse', id: record.pk_allocate_h.value }, this.getState.bind(this));
						}}
					>
						{record && record.vbillno && record.vbillno.value}
					</a>
					// </NCTooltip>
				);
			};
		}
		else if (item.attrcode == 'dbilldate') {
			item.render = (text, record, index) => {
				return (
					<span>
						{record.dbilldate && seperateDate(record.dbilldate.value)}
					</span>
				);
			};
		}

		return item;
	});
	let multiLang = props.MutiInit.getIntl('3632');
	//添加操作列
	meta[tableId].items.push({
		attrcode: 'opr',
		label: loadMultiLang(props,'36320FA-000049'),/* 国际化处理： 操作*/
		itemtype: 'customer',
		width: 220,
		visible: true,
		fixed: 'right',
		render: (text, record, index) => {
			let buttonAry = [];
			if (record.billstatus && record.billstatus.value == '1' && record.srcbusitype.value == '7') {
				buttonAry = ['commit_inner', 'edit', 'delete_inner'];
			} else if (record.billstatus && record.billstatus.value == '1' && record.srcbusitype.value != '7') {
				buttonAry = ['decide', 'commit_inner', 'return_inner'];
			}
			else if (record.billstatus && record.billstatus.value == '2') {
				buttonAry = ['uncommit_inner', 'queryapprove'];
			}
			else if (record.billstatus && record.billstatus.value == '3') {
				buttonAry = ['pay_inner', 'e_bank', 'e_bank_browse', 'uncommit_inner', 'queryapprove'];
			} else if (record.billstatus && record.billstatus.value == '4') {
				buttonAry = ['paystatus_inner', 'e_bank_browse', 'queryapprove'];
			}
			else if (record.billstatus && record.billstatus.value == '5' && record.ismakevoucher && record.ismakevoucher.value) {
				buttonAry = ['unmake', 'queryapprove'];
			}
			else if (record.billstatus && record.billstatus.value == '5' && record.ismakevoucher && !record.ismakevoucher.value) {
				buttonAry = ['make', 'unpay_inner', 'queryapprove'];
			}
			//begin tm yangjn 2019-11-20 支持分布式事务异常交互
			// return props.button.createOprationButton(buttonAry, {
			// 	area: "list_inner",
			// 	buttonLimit: 3,
			// 	// itemtype:customer,
			// 	onButtonClick: (props, key) => bodyButtonClick.call(this, props, key, text, record, index)
			// });
			return (props.button.createErrorButton({
				record,
				showBack: false,
				sucessCallBack: () => {
					return props.button.createOprationButton(buttonAry,
						{
							area: "list_inner",//区域编码
							buttonLimit: 3,//按钮显示个数
							onButtonClick: (props, key) => { bodyButtonClick.call(this, props, key, text, record, index); }
						});
				}
			}));
			//end yangjn
		}
	});
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakSyfTwhWpk4XRVJggXxHt0O/7C0qG9iK3AHbi3mv/Fzl*/