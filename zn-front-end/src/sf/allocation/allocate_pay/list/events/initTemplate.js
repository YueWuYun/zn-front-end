/*pmFWCFu5nhKkBzYmrkBakSyfTwhWpk4XRVJggXxHt0O/7C0qG9iK3AHbi3mv/Fzl*/
import { createPage, ajax, base, toast } from 'nc-lightapp-front';
let { NCPopconfirm, NCIcon ,NCTooltip} = base;
import bodyButtonClick from './bodyButtonClick';
import {list_search_id, card_page_id, } from '../../cons/constant'
import {loadSearchCache, } from "../../util/index"
import {go2card, } from "../../util/index"
import { setDefOrg2AdvanceSrchArea } from '../../../../../tmpub/pub/util/index'
import { setButtonUsability } from '../events';

let searchId = 'search_allocate_01';
let tableId = 'table_allocate_02';
let pageId = '36320FA_PAY_L01';
export default function (props) {
	props.createUIDom(
		{
			pagecode: pageId,//页面id
			// appid: '0001Z61000000004ETQ0'//注册按钮的id
		},
		(data) => {
			if (data) {
				if (data.template) {
					let meta = data.template;
					console.log(meta)
					meta = modifierMeta.call(this, props, meta);
					//高级查询区域家在默认组织
					setDefOrg2AdvanceSrchArea(props, list_search_id, data);					

					props.meta.setMeta(meta);
					//加载缓存数据
					loadSearchCache(props);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					// setButtonUsability(props);
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

function modifierMeta (props, meta) {
	meta[searchId].items = meta[searchId].items.map((item, key) => {
		// item.visible = true;
		// item.col = '3';
		return item;
	})

	//设置资金组织可多选
	meta[list_search_id].items.find((e) => e.attrcode === 'pk_org').isMultiSelectedEnabled = true;
	// meta[list_search_id].items.find((e) => e.attrcode == 'allocate_b.pk_org_r').isShowUnit = true;
	meta[list_search_id].items.map((item) => {
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

		//下拨银行账户过滤
		if (item.attrcode == 'allocate_b.pk_bankacc_p') {
			item.queryCondition = () => {
				let pk_orgsearchVal = props.search.getSearchValByField(list_search_id, 'pk_org');
				let bankacc_r_pk_org ='';
				if(pk_orgsearchVal){
					// 取search区域的值
					bankacc_r_pk_org = pk_orgsearchVal.value.firstvalue.split(',')[0];
				}
				return {
					// 这里对record.values.materiel要做一下非空校验
					pk_org: bankacc_r_pk_org, 
					refnodename: props.MutiInit.getIntl("36320FA_PAY") && props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000065'),/* 国际化处理： 使用权参照*/
					//自定义增加的过滤条件
					GridRefActionExt: 'nccloud.web.sf.allocation.allocate.filter.AllocateOrgRefPBankAccFilter,nccloud.web.sf.allocation.allocate.filter.AllocateCurrentTypeRefPBankAccFilter,nccloud.web.sf.allocation.allocate.filter.AllocateDefaultRefBankAccFilter,nccloud.web.sf.allocation.allocate.filter.BanksubbaccNoInnerAccFilter,nccloud.web.sf.allocation.allocate.filter.BanksubBaccNoDestroyFilter,nccloud.web.sf.allocation.allocate.filter.BanksubaccNoFrozenFilter,nccloud.web.sf.allocation.allocate.filter.BanksubaccOnlyCurrent,nccloud.web.tmpub.filter.BanksubaccNoInnerAccFilter4NCC,nccloud.web.tmpub.filter.BanksubaccNoDestroyFilter4NCC'
				};
			}	
		}
		
		//收款银行账户过滤
		if (item.attrcode == 'allocate_b.pk_bankacc_r') {
			item.queryCondition = () => {
				let pk_orgsearchVal = props.search.getSearchValByField(list_search_id, 'allocate_b.pk_org_r');
				let bankacc_r_pk_org ='';
				if(pk_orgsearchVal){
					// 取search区域的值
					bankacc_r_pk_org = pk_orgsearchVal.value.firstvalue.split(',')[0];
				}
				return {
					// 这里对record.values.materiel要做一下非空校验
					pk_org: bankacc_r_pk_org, 
					refnodename: props.MutiInit.getIntl("36320FA_PAY") && props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000065'),/* 国际化处理： 使用权参照*/
					//自定义增加的过滤条件
					GridRefActionExt: 'nccloud.web.sf.allocation.allocate.filter.AllocateCurrentTypeRefPBankAccFilter,nccloud.web.sf.allocation.allocate.filter.AllocateDefaultRefBankAccFilter,nccloud.web.sf.allocation.allocate.filter.BanksubbaccNoInnerAccFilter,nccloud.web.sf.allocation.allocate.filter.BanksubBaccNoDestroyFilter,nccloud.web.sf.allocation.allocate.filter.BanksubaccOnlyCurrent,nccloud.web.sf.allocation.allocate.filter.AllocateOrgRefRBankAccFilter'
				};
			}	
		}	
	});

	meta[tableId].items = meta[tableId].items.map((item) => {
		if (item.attrcode == 'vbillno') {
			item.render = (text, record, index) => {
				return (
					// <NCTooltip placement="top" overlay={record.vbillno ? record.vbillno.value : ''}>
					<a
						style={{cursor: 'pointer' }}
						onClick={() => {
							go2card(props,{pagecode:card_page_id,status: 'browse',id: record.pk_allocate_h.value},this.getState.bind(this));
						}}
					>
						{record&&record.vbillno && record.vbillno.value}
					</a>
					// </NCTooltip>
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
	
	//添加操作列
	meta[tableId].items.push({
		attrcode: 'opr',
		label: props.MutiInit.getIntl("36320FA_PAY") && props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000069')/*  操作 */,
		itemtype:'customer',
		width: 250,
		visible: true,
		fixed: 'right',
		render: (text, record, index) => {
			console.log(record.vbillstatus,99)
			let buttonAry = [];			
			//待支付
			if(record.billstatus && record.billstatus.value == '3'){
				buttonAry = ['pay_inner',"mergepay_inner",'netpayBL','netpayLL','approveDetail'];
			}
			//支付中
			else if(record.billstatus && record.billstatus.value == '4'){
				buttonAry = ['approveDetail','netpayLL']
			}
			//转账成功		
			else if(record.billstatus && record.billstatus.value == '5'){
				if(record.ismakevoucher.value){
					buttonAry = ['paycancel_inner','approveDetail','accreditationCancel_inner']
				}else{
					buttonAry = ['paycancel_inner','approveDetail','accreditation_inner']
				}				
			}
			//已作废
			else if(record.billstatus && record.billstatus.value == '6'){
				buttonAry = ['approveDetail']
			}	
			// return props.button.createOprationButton(buttonAry, {
			// 	area: "list_inner",
			// 	buttonLimit: 2,
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
		}
	});
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakSyfTwhWpk4XRVJggXxHt0O/7C0qG9iK3AHbi3mv/Fzl*/