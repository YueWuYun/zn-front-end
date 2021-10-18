/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/
import { createPage, ajax, base, toast, cardCache} from 'nc-lightapp-front';
import { constant, requesturl, buttonDisable }  from '../../config/config';
import buttonVisible from './buttonVisible';
let {setDefData, getDefData } = cardCache;
let searchcode = constant.searchcode;
let ltablecode = constant.ltablecode;
let cacheDataSource = constant.cacheDataSource;
import {
    setDefOrg2ListSrchArea,
    setDefOrg2AdvanceSrchArea
} from "src/tmpub/pub/util/index";

export default function(props) {
	props.createUIDom(
		{
			pagecode: constant.lpagecode,
			appcode: props.getUrlParam('c')
		},
		(data) => {
			if (data) {
				if (data.template) {
					let meta = data.template;

					meta = modifierMeta.call(this, props, meta);
					props.meta.setMeta(meta);

					// 给列表查询区域赋默认业务单元(在setMeta之后使用)
					setDefOrg2ListSrchArea(props, searchcode, data);
					setDefOrg2AdvanceSrchArea(props, searchcode, data);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					buttonVisible.call(this, props, null);
				}
			}
		}
	);
}

function seperateDate(date) {
	if (typeof date !== 'string') return;
	let result = date.split(' ') && date.split(' ')[0];
	return result;
}

function modifierMeta(props, meta) {

	meta[ltablecode].pagination = true;

	meta[constant.ltablecode].items = meta[constant.ltablecode].items.map((item, key) => {
		//点击某一列跳转到browse状态
		if (item.attrcode == 'vbillno') {
			
		} else if (item.attrcode == 'dbilldate') {
			item.render = (text, record, index) => {
				return <span>{record.dbilldate && seperateDate(record.dbilldate.value)}</span>;
			};
		} else if (item.attrcode == 'doperatedate') {// 制单日期
			item.render = (text, record, index) => {
				return <span>{record.doperatedate && seperateDate(record.doperatedate.value)}</span>;
			};
		}
		return item;
	});
	//参展过滤
	meta[searchcode].items.map((item) => {

		item.isShowDisabledData = true;

		// 资金组织：根据用户权限过滤
		if (item.attrcode == 'pk_org') {
			item.queryCondition = () => {
				return {
					funcode: constant.appcode,
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FundOrgPermissionFilter'
				};
			};
		}

		//定期利率参照过滤
		if (item.attrcode == 'pk_depostrate') {
			//item.isTreelazyLoad = false;
			item.queryCondition = () => {
				return {
					ratetype:"FRATE",
					//pk_org: (props.search.getSearchValByField(ist.searchCode, 'pk_org') || {}).value.firstvalue,
					GridRefActionExt: 'nccloud.web.ifac.regularvarietyset.filter.RegularsetDepositrateFilter'
				}					   
			}
		}

		//银行账户
		// if (item.attrcode === 'pk_bankaccount') {
		// 	item.queryCondition = () => {
		// 		let search_org_value = props.search.getSearchValByField(searchcode, 'pk_org');//所选组织
		// 		if (search_org_value && search_org_value.value.firstvalue) {
		// 			search_org_value = search_org_value.value.firstvalue;
		// 		} else {
		// 			search_org_value = null;
		// 		}
		// 		let search_currency_value = props.search.getSearchValByField(searchcode, 'pk_curr');//所选买入币种
		// 		if (search_currency_value && search_currency_value.value.firstvalue) {
		// 			search_currency_value = search_currency_value.value.firstvalue;
		// 		} else {
		// 			search_currency_value = null;
		// 		}

		// 		return {
		// 			pk_org: search_org_value,
		// 			pk_currtype: search_currency_value,
		// 			refnodename: '使用权参照',/* 国际化处理： 使用权参照*/
		// 			isDisableDataShow: false,//默认只加载启用的账户
		// 			noConditionOrg: 'Y',//是否加载参照默认条件
		// 			GridRefActionExt: 'nccloud.web.cmp.ref.CMPBankaccGridRefNotInnerAccSqlBuilder'//自定义增加的过滤条件
		// 		};
		// 	}
		// }

		// if (item.attrcode === 'dbilldate') {

		// }

	});

	// 添加操作列,实际没有操作列，为了适配云原生。
	if(props.getUrlParam('scene') != 'linksce' && props.getUrlParam('scene') != 'fip'){
		meta[constant.ltablecode].items.push({
			attrcode: 'opr',
			// label: this.state.json['36140RFD-000066'],/* 国际化处理： 操作*/
			width: 0,
			fixed: 'right',
			className:"table-opr",
			itemtype: 'customer',
			visible: true,
			render: (text, record, index) => {
				let buttonAry = [];
				if(record.billstate && record.billstate.value == '1'){// 已记账
					buttonAry = ['untallytablebtn'];
				}else if(record.billstate && record.billstate.value == '0'){// 未记账
					buttonAry = ['edittablebtn','tallytablebtn'];
				}
				
				return props.button.createErrorButton(buttonAry, {
					area: "list_inner",
					buttonLimit: 3,
					onButtonClick: (props, key) => bodyButtonClick.call(this, props, key, text, record, index)
				});
			}
		});
	}

	//设置参照可以多选和是否清楚记录
	meta[searchcode].items.find((e) => e.attrcode === 'pk_org').isMultiSelectedEnabled = true;
	meta[searchcode].items.find((e) => e.attrcode === 'pk_org').showHistory = true;
	meta[searchcode].items.find((e) => e.attrcode === 'pk_org').isTreelazyLoad = false;	//财务组织:全加载
	
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/