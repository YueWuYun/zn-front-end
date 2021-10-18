/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/
import { base } from 'nc-lightapp-front';
let { NCTooltip } = base;
import buttonUsability from './buttonUsability';

import { voucherLinkBill } from '../../busbutton/voucherLinkBill';
import { list_page_id, list_search_id, list_table_id, app_code, card_page_id } from '../../cons/constant.js';
import {requesturl} from '../../cons/requesturl.js';
import {setDefOrg2AdvanceSrchArea,setDefOrg2ListSrchArea,go2CardCheck} from '../../../../../tmpub/pub/util/index.js';

export default function (props) {
	let that = this;
	let appcode = '';
	let appUrl = decodeURIComponent(window.location.href).split('?');
	if (appUrl && appUrl[1]) {
		let appPrams = appUrl[1].split('&');
		if (appPrams && appPrams instanceof Array) {
			appPrams.find((item) => {
				if (item.indexOf('ar') != -1 && item.split('=')) {
					appcode = item.split('=')[1] && item.split('=')[1];
				}
			});
		}
	}
	props.createUIDom(
		{
			pagecode: list_page_id,//页面id 
			appcode:props.getUrlParam('c')
		},
		function (data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					//联查场景标志
					let src = props.getUrlParam('scene');
					let back = props.getUrlParam('back');
					if ('fip' == src &&!back) {
						initData.call(that, props);
					}

					meta = modifierMeta(that, props, meta);
					props.meta.setMeta(meta);
					//高级查询区加载默认业务单元
					setDefOrg2AdvanceSrchArea(props,list_search_id,data);
					//列表查询区加载默认业务单元
					setDefOrg2ListSrchArea(props,list_search_id,data);
				}
				if (data.button) {
					/* 按钮适配  第一步：将请求回来的按钮组数据设置到页面的 buttons 属性上 */
					let button = data.button;
					props.button.setButtons(button);
					buttonUsability.call(this, props,null);
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

function modifierMeta(that, props, meta) {
	//meta[list_table_id].pagination = true;
	let src = props.getUrlParam('scene');
	let islinkquery = props.getUrlParam('islinkquery');
	if(!islinkquery&&!src){
		meta[list_table_id].pagination = true;
	}else{
		meta[list_table_id].pagination = false;
	}

	meta[list_search_id].items.map((item) => {
		item.isShowDisabledData = true;//显示停用
		if (item.attrcode == 'pk_org' ) {
			item.queryCondition = () => {
				return {
					funcode: app_code,
					pk_fundpayorg: (props.search.getSearchValByField(list_search_id, 'pk_depositorg') || {}).value.firstvalue, 
					TreeRefActionExt:"nccloud.web.ifac.filter.FundFinanceOrgRelationFilter"
				};
			};
		}

		if (item.attrcode == 'pk_depositorg' ) {
			item.queryCondition = () => {
				return {
					funcode: app_code,
					pk_finorg: (props.search.getSearchValByField(list_search_id, 'pk_org') || {}).value.firstvalue, 
					TreeRefActionExt: 'nccloud.web.ifac.filter.FinanceFundOrgRelationFilter'
				};
			};
		}

		if (item.attrcode == 'pk_depositrate') {
			item.queryCondition = () => {
				return {
					pk_org: (props.search.getSearchValByField(list_search_id, 'pk_depositorg') || {}).value.firstvalue,
					pk_currtype: (props.search.getSearchValByField(list_search_id, 'pk_currtype') || {}).value.firstvalue,
					isDisableDataShow: false,//默认只加载启用的账户
					noConditionOrg: 'N',
					refnodename: '使用权参照',
					billtype: '36L1',
					GridRefActionExt: 'nccloud.web.fac.bankregularset.filter.BankRegularsetDepositrateFilter' //自定义增加的过滤条件	
				};
			}
		}

		//活期利率参照过滤
		if (item.attrcode == 'pk_aiacrate') {
			item.isTreelazyLoad = false;
			item.queryCondition = () => {
				return {
					ratetype:"CRATE",
					pk_org: (props.search.getSearchValByField(list.searchCode, 'pk_depositorg') || {}).value.firstvalue,
					GridRefActionExt: 'nccloud.web.ifac.regularvarietyset.filter.RegularsetAiacrateFilter'
				}					   
			}
		}

		if (item.attrcode == 'depositcode') {
			item.queryCondition = () => {
				return {
					funcode: app_code,
					pk_depositorg: (props.search.getSearchValByField(list_search_id, 'pk_org') || {}).value.firstvalue, 
				};
			};
		}

		if (item.attrcode == 'pk_depositacc') {
			item.queryCondition = () => {
				return {
					funcode: app_code,
					isSelect:'Y',
					noConditionOrg:'Y',
					pk_org: (props.search.getSearchValByField(list_search_id, 'pk_org') || {}).value.firstvalue,
					pk_currtype: (props.search.getSearchValByField(list_search_id, 'pk_currtype') || {}).value.firstvalue,
					pk_fundorg: (props.search.getSearchValByField(list_search_id, 'pk_depositorg') || {}).value.firstvalue,
					GridRefActionExt: 'nccloud.web.ifac.fixeddatewithdrawapply.filter.NCCPkDepositaccFilter' //自定义增加的过滤条件	
				};
			}
		}

		if (item.attrcode == 'pk_settleacc') {
			item.queryCondition = () => {
				return {
					funcode: app_code,
					isSelect:'Y',
					noConditionOrg:'Y',
					pk_org: (props.search.getSearchValByField(list_search_id, 'pk_org') || {}).value.firstvalue,
					pk_currtype: (props.search.getSearchValByField(list_search_id, 'pk_currtype') || {}).value.firstvalue,
					pk_fundorg: (props.search.getSearchValByField(list_search_id, 'pk_depositorg') || {}).value.firstvalue,
					GridRefActionExt: 'nccloud.web.ifac.fixeddatewithdrawapply.filter.NCCPkSettleaccFilter'
				};
			}
		}

	});

	//点击列表编号跳转到卡片界面
	meta[list_table_id].items = meta[list_table_id].items.map((item, key) => {
        //item.width = 150;
        //点击某一列跳转到browse状态
		let type = props.getUrlParam('type');
		let src = props.getUrlParam('scene');
        if (item.attrcode === 'vbillcode') {
            item.render = (text, record, index) => {
                return (
                    <a style={{ cursor: 'pointer' }}
                        onClick={() => {

							go2CardCheck({
								 props,
								 url: requesturl.check2card,
								 pk: record.pk_interest.value,
								 ts: record.ts.value,
								 //checkTS: record.ts.value ? true : false,
								 checkTS: false,
								 checkSaga: false,
								 fieldPK: 'pk_interest',
								 go2CardFunc: () =>{
									props.pushTo("/card", {
										status: 'browse',
	                               	    id: record.pk_interest.value,
									    douclick:'douclick',
									    type:type,
									    scene:src,
	                                    pagecode: card_page_id
                            		});
	   							}	
   							})              
                        }}
                    >{record && record.vbillcode && record.vbillcode.value}
                    </ a>
                );
            };
        }
        return item;
    });

	meta['head'].items.push({
		attrcode: 'opr',
		width: 0,
		fixed: 'right',
		className:"table-opr",
		itemtype: 'customer',

		visible: true,
		render: (text, record, index) => {
			return (props.button.createErrorButton({
				record,
				showBack: false				
			}));
		}
	});
	return meta;
}

function initData(props) {
	//主键信息
	let srcid = props.getUrlParam('id');
	//联查场景标志
	let src = props.getUrlParam('scene');
	if ('fip' == src) {//fip代表会计平台
		voucherLinkBill.call(this, this.props, list_page_id, list_table_id);
	} 
}

/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/