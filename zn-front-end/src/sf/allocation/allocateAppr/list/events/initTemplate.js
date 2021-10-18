/*pmFWCFu5nhKkBzYmrkBakSyfTwhWpk4XRVJggXxHt0O/7C0qG9iK3AHbi3mv/Fzl*/
import { createPage, ajax, base, toast,cardCache } from 'nc-lightapp-front';
let { NCPopconfirm, NCIcon,NCTooltip } = base;
import bodyButtonClick from './bodyButtonClick';
import { go2card ,loadSearchCache} from "../../util/index";
import {setButtonUsability} from '../events';
import { base_url,button, list_table_id, list_page_id, list_search_id, viewmod_deal, billtype, print_nodekey, print_templateid, funcode,dataSource, card_page_id } from '../../cons/constant.js';
import { loadMultiLang } from "../../../../../tmpub/pub/util/index";

let searchId = 'search_allocate_01';
let tableId = 'table_allocate_02';
let pageId = '36320FA_L01';
export default function (props) {
	props.createUIDom(
		{
			pagecode: pageId,//页面id
		},
		(data) => {
			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta.call(this, props, meta);
					props.meta.setMeta(meta);
					loadSearchCache(props,data);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					setButtonUsability(props);
					props.button.setPopContent('delete_inner', loadMultiLang(props,'1880000025-000050'));/* 国际化处理： 确定要删除吗？*/
				}
			}
		}
	)
}

function seperateDate(date){
	if (typeof date !=='string') return ;
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
	meta[list_search_id].items.find((e) => e.attrcode == 'allocate_b.pk_bankacc_r').isShowUnit =true;
	meta[list_search_id].items.find((e) => e.attrcode == 'allocate_b.pk_bankacc_p').isShowUnit =true;
	meta[list_search_id].items.map((item) => {
		// 资金组织过滤
		if(item.attrcode=='pk_org') {
			item.queryCondition= () => {
				return {
					funcode:props.getSearchParam('c'),
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				};
			}
		}
		//下拨银行账户根据下拨组织过滤
		if (item.attrcode == 'allocate_b.pk_bankacc_p') {
			item.queryCondition = () => {
				let pk_org=props.search.getSearchValByField(searchId,'pk_org').value.firstvalue;
				let pk_currtype=props.search.getSearchValByField(searchId,'pk_currtype').value.firstvalue;
				let noConditionOrg='N';
				if(pk_org) {
					noConditionOrg='Y';
				}
				return {
					pk_currtype:pk_currtype,
					pk_org:pk_org,
					noConditionOrg:noConditionOrg,
					GridRefActionExt: 'nccloud.web.sf.allocation.allocate.filter.AllocateOrgRefPBankAccFilter,nccloud.web.sf.allocation.allocate.filter.AllocateCurrentTypeRefPBankAccFilter,nccloud.web.sf.allocation.allocate.filter.AllocateDefaultRefBankAccFilter,nccloud.web.sf.allocation.allocate.filter.BanksubbaccNoInnerAccFilter,nccloud.web.sf.allocation.allocate.filter.BanksubBaccNoDestroyFilter,nccloud.web.sf.allocation.allocate.filter.BanksubaccNoFrozenFilter,nccloud.web.sf.allocation.allocate.filter.BanksubaccOnlyCurrent,nccloud.web.tmpub.filter.BanksubaccNoInnerAccFilter4NCC,nccloud.web.tmpub.filter.BanksubaccNoDestroyFilter4NCC'
				};
			}
					
		}
		// 收款银行账户根据币种过滤
		if (item.attrcode == 'allocate_b.pk_bankacc_r') {
			item.queryCondition= () => {
				let pk_org_r=props.search.getSearchValByField(searchId,'allocate_b.pk_org_r').value.firstvalue;			
				let pk_currtype=props.search.getSearchValByField(searchId,'pk_currtype').value.firstvalue;
				let noConditionOrg='N';
				if(pk_org_r) {
					noConditionOrg='Y';
				}
				return {
					pk_currtype:pk_currtype,
					pk_org: pk_org_r,
					noConditionOrg:noConditionOrg,
					GridRefActionExt: 'nccloud.web.sf.allocation.allocate.filter.AllocateCurrentTypeRefPBankAccFilter,nccloud.web.sf.allocation.allocate.filter.AllocateDefaultRefBankAccFilter,nccloud.web.sf.allocation.allocate.filter.BanksubbaccNoInnerAccFilter,nccloud.web.sf.allocation.allocate.filter.BanksubBaccNoDestroyFilter,nccloud.web.sf.allocation.allocate.filter.BanksubaccOnlyCurrent,nccloud.web.sf.allocation.allocate.filter.AllocateOrgRefRBankAccFilter'
				};
			}
					
		}
	});

	meta[tableId].items = meta[tableId].items.map((item, key) => {
		item.width = 150;
		if (item.attrcode == 'vbillno') {
			item.render = (text, record, index) => {
				return (
					<NCTooltip placement="top" overlay={record.vbillno ? record.vbillno.value : ''}>
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
						{record&&record.vbillno && record.vbillno.value}
					</a>
					</NCTooltip>
				);
			};
		}
		else if (item.attrcode == 'dbilldate'){
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
	
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakSyfTwhWpk4XRVJggXxHt0O/7C0qG9iK3AHbi3mv/Fzl*/