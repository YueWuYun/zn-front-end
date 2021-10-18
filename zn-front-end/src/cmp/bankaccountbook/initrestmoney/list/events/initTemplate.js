/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import tableButtonClick from './tableButtonClick';
import {setButtonVisible} from './initRestMoneyDate';
//import { connectableObservableDescriptor } from 'rxjs/observable/ConnectableObservable';
// 现金账户
import CashAccountGridRef  from '../../../../../uapbd/refer/sminfo/CashAccountGridRef';
// 银行账户
// import  BankaccDefaultTreeGridRef from '../../../../../uapbd/refer/pub/BankaccDefaultTreeGridRef';
// 使用权参照，用于期初余额银行账户参照
import BankaccSubUseTreeGridRef from '../../../../../uapbd/refer/pub/BankaccSubUseTreeGridRef';
import {query} from './searchAfterEvent';

let searchId = 'search_area';
let tableId = 'table_area';
let pageId = '360701OB_L01';
let bill_funcode = '360701OB';

import { setDefOrg2ListSrchArea, setDefOrg2AdvanceSrchArea } from "../../../../../tmpub/pub/util/index";

export default function (props,json) {
	let _this = this;
	props.createUIDom(
		{
			pagecode: pageId,//页面id
			appcode: '360701OB'//注册按钮的id
		},
		function (data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta.call(_this,props, meta, null, null ,json)
					props.meta.setMeta(meta);

					// 给列表查询区域赋默认业务单元(在setMeta之后使用)
					setDefOrg2ListSrchArea(props, searchId, data);
					setDefOrg2AdvanceSrchArea(props, searchId, data);
					//获取默认业务单元
					let { pk_org, org_Name } = data.context;
					let searchData = { pk_org: pk_org };
					// 此处查询组织的建账日期
					query.call(_this, searchData);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					setButtonVisible(props,true);
				}
			}
		}
	)
}

function modifierMeta(props, meta ,record,index,json) {
	
	meta[searchId].items = meta[searchId].items.map((item, key) => {
		item.visible = true;
		item.col = '3';
		//参照的档案中没有显示“显示停用”的字段
		item.isShowDisabledData = true;
		if (item.attrcode == 'pk_org') {
			item.queryCondition = () => {
                return {
                    funcode: bill_funcode,
                    TreeRefActionExt: 'nccloud.web.cmp.ref.CMPUserPermissionOrgBuilder'
                };
            };
		}
		meta[searchId].items.find((e) => e.attrcode === 'pk_org').isTreelazyLoad = false;
		return item;
	})

	meta[tableId].items = meta[tableId].items.map((item, key) => {
		// item.width = 210;
		if (item.attrcode === 'pk_account') {
			//参照过滤-现金账户
			//条件根据pk_org进行过滤
			item.render = function(text, record, index) {
				// 选择的资金形态，需要根据资金形态对账户进行银行账户或者现金账户的参照
				let selectTree = props.syncTree.getSelectNode('tree');
				let fundform = null;
				if(selectTree && selectTree.refcode && selectTree.refcode!="-1"){
					fundform = selectTree.refcode;
				}
				if (fundform && fundform=='1') {
					item.refName = json['360701OB-000059'];//模板默认的是‘现金账户’，这里当选择银行存款时把模板的refName改为‘银行账户’；（模板的优先级比下面的return中的refName:'使用权参照'高！）
					return (
						BankaccSubUseTreeGridRef({
							queryCondition : () => {
							let pk_org =  props.search.getSearchValByField(searchId,"pk_org").value.firstvalue;
							return {
								pk_org: pk_org, // 这里对record.values.materiel要做一下非空校验
								// refnodename:this.props.MutiInit.getIntl("360701OB") && this.props.MutiInit.getIntl("360701OB").get('360701OB-000028')/* 国际化处理： 使用权参照*/
								//refName:'使用权参照',
								refName: json['360701OB-000028'],
								GridRefActionExt: 'nccloud.web.cmp.ref.CMPInitRecBillBankaccSubDefaultGridRefSqlBuilder'
							};
						}
					})
				);
			}else{
				item.refName = json['360701OB-000060'];
				// 现金账户不需要根据pk_org过滤
				return (
					CashAccountGridRef({
						queryCondition: () => {
							let pk_org =  props.search.getSearchValByField(searchId,"pk_org").value.firstvalue;
								return {
									pk_org: pk_org ,
									//refnodename:'现金账户参照'
									refnodename: json['360701OB-000061']
								};
							}
						})
					);
				}
			}
        }
		// 财务组织：根据用户权限过滤
		if (item.attrcode == 'pk_org') {
            item.queryCondition = () => {
                return {
                    funcode: bill_funcode,
                    TreeRefActionExt: 'nccloud.web.cmp.ref.CMPUserPermissionOrgBuilder'
                };
            };
		    //财务组织:全加载
		}
	    meta[tableId].items.find((e) => e.attrcode === 'pk_org').isTreelazyLoad = false;
		return item;
	});
	let multiLang = props.MutiInit.getIntl('2052');
	//添加操作列
	meta[tableId].items.push({
		attrcode: 'opr',
		itemtype: 'customer',
		label: json['360701OB-000029'],//multiLang && multiLang.get('20521030-0005'),/* 国际化处理： 操作*/
		width: 200,
		fixed: 'right',
		visible: true,
		renderStatus:'edit',
		render: (text, record, index) => {
			// debugger;
			//console.log(1,2,3,4);
			//let tableKey = this.state.tableButtonKey;
			let isEdit = props.editTable.getStatus(this.tableId) == 'edit';
			let buttonAry = record && record.values && record.values.approver 
					&& record.values.approver.value 
                    ? [ "innerantiaudit"]
					: [ "inneraudit","inneredit","innerdelete" ];
			if(!record || !record.values || !record.values.pk_initdata 
				|| !record.values.pk_initdata.value || isEdit){
				buttonAry = [];
			}
            return props.button.createOprationButton(buttonAry, {
                area: "list_inner",
                buttonLimit: 3,
                onButtonClick: (props, key) => tableButtonClick.call(this,props, key, text, record, index)
            });
		}
	});
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/