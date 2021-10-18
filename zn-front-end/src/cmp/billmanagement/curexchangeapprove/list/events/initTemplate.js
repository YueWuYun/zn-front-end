/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { createPage, ajax, base, toast } from 'nc-lightapp-front';
import tableButtonClick from './tableButtonClick';
import { Templatedata } from "../../config/Templatedata";//配置的id和area信息
let { NCPopconfirm, NCIcon } = base;

let searchId = Templatedata.list_searchid;
let tableId = Templatedata.list_tableid;
let pageId = Templatedata.list_pageid;
let appId = Templatedata.list_appid;
let oid = Templatedata.list_oid;
let querytype = Templatedata.list_querytype;
let list_inner = Templatedata.list_inner;
//请求url
let inittemp_query = Templatedata.inittemp_query;
let printcard_funcode = Templatedata.printcard_funcode;
let appcode = Templatedata.app_code;
export default function (props) {
	let self = this;
	props.createUIDom(
		{
			pagecode: pageId,//页面id
			appcode: appcode,//小应用code
			appid: appId//注册按钮的id
		},
		function (data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta.call(self, props, meta)
					props.meta.setMeta(meta);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					props.button.setPopContent('deleteinnerBtn', '确认要删除该信息吗？'); /* 设置操作列上删除按钮的弹窗提示 */
					// props.button.setPopContent('submitBtn', '确认要提交该信息吗？'); /* 设置操作列上删除按钮的弹窗提示 */
					// props.button.setPopContent('unsubmitBtn', '确认要收回该信息吗？'); /* 设置操作列上删除按钮的弹窗提示 */
					// props.button.setPopContent('settleBtn', '确认要结算该信息吗？'); /* 设置操作列上删除按钮的弹窗提示 */
					// props.button.setPopContent('unsettleBtn', '确认要取消结算该信息吗？'); /* 设置操作列上删除按钮的弹窗提示 */
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
	meta[searchId].items = meta[searchId].items.map((item, key) => {
		// item.visible = true;
		// item.col = '3';
		return item;
	})
	let self2 = this;
	meta[tableId].items = meta[tableId].items.map((item, key) => {

		// meta[tableId].items.find((e) => e.attrcode === 'vbillno').isMultiSelectedEnabled = true;

		//点击某一列跳转到browse状态
		if (item.attrcode === 'vbillno') {
			// item.width = 170;//模版修改table的宽度
			item.render = (text, record, index) => {

				return (
					<a
						style={{ textDecoration: 'underline', cursor: 'pointer' }}
						onClick={() => {
							props.linkTo('/cmp/billmanagement/curexchange/card/index.html', {
								status: 'browse',
								id: record.pk_cruexchange.value,
								pk: record.busistatus.value
							});
						}}
					>
						{record && record.vbillno && record.vbillno.value}
					</a>
				);
			};
		}


		return item;
	});
	let multiLang = props.MutiInit.getIntl('2052');
	//添加操作列
	meta[tableId].items.push({
		attrcode: 'opr',
		label: this.props.MutiInit.getIntl("36070FCEAPP") && this.props.MutiInit.getIntl("36070FCEAPP").get('36070FCEAPP-000081'),/* 国际化处理： 操作*/
		width: '200px',
		fixed: 'right',
		visible: true,
		render: (text, record, index) => {
			let buttonAry = [];
			if (record && record.busistatus && record.busistatus.value == 1) {
				/* 单据状态：已保存  */
				buttonAry = ["submitBtn", "editinnerBtn", "deleteinnerBtn"];
			} else if (record && record.busistatus && record.busistatus.value == 2) {
				/* 单据状态：待审批 */
				buttonAry = ["unsubmitBtn"];
			} else if (record.busistatus && record.busistatus.value == 3) {
				/* 单据状态：待办理 */
				buttonAry = ["settleBtn","unsubmitBtn"];
			} else if (record.busistatus && record.busistatus.value == 4) {
				/* 单据状态：已完毕 */
				buttonAry = ["unsettleBtn"];
			}

			return props.button.createOprationButton(buttonAry, {
				area: list_inner,
				buttonLimit: 3,
				onButtonClick: (props, key) => tableButtonClick.call(self2, props, key, text, record, index)
			});


		}
	});

	//参展过滤
	meta[searchId].items.map((item) => {
		//卖出账户
		if (item.attrcode === 'pk_sellacct') {

			item.queryCondition = () => {
				let search_org_value = props.search.getSearchValByField(searchId, 'pk_org');//所选组织
				if (search_org_value && search_org_value.value.firstvalue) {
					search_org_value = search_org_value.value.firstvalue;
				} else {
					search_org_value = null;
				}
				let search_sellcurr_value = props.search.getSearchValByField(searchId, 'pk_sellcurrtype');//所选卖出币种
				if (search_sellcurr_value && search_sellcurr_value.value.firstvalue) {
					search_sellcurr_value = search_sellcurr_value.value.firstvalue;
				} else {
					search_sellcurr_value = null;
				}
				
				return {
					pk_org: search_org_value,
					pk_currtype: search_sellcurr_value,
					refnodename: this.props.MutiInit.getIntl("36070FCEAPP") && this.props.MutiInit.getIntl("36070FCEAPP").get('36070FCEAPP-000082'),/* 国际化处理： 自定义使用权参照过滤*/
					isDisableDataShow:false,//默认只加载启用的账户
					noConditionOrg:'Y',
					GridRefActionExt: 'nccloud.web.cmp.ref.CMPRecBillBankaccSubDefaultGridRefSqlBuilder'//自定义增加的过滤条件
				};

			}
		}
		//买入账户
		if (item.attrcode === 'pk_buyacct') {

			item.queryCondition = () => {
				let search_org_value2 = props.search.getSearchValByField(searchId, 'pk_org');//所选组织
				if (search_org_value2 && search_org_value2.value.firstvalue) {
					search_org_value2 = search_org_value2.value.firstvalue;
				} else {
					search_org_value2 = null;
				}
				let search_buycurr_value = props.search.getSearchValByField(searchId, 'pk_buycurrtype');//所选买入币种
				if (search_buycurr_value && search_buycurr_value.value.firstvalue) {
					search_buycurr_value = search_buycurr_value.value.firstvalue;
				} else {
					search_buycurr_value = null;
				}
				
				return {
					pk_org: search_org_value2,
					pk_currtype: search_buycurr_value,
					refnodename: this.props.MutiInit.getIntl("36070FCEAPP") && this.props.MutiInit.getIntl("36070FCEAPP").get('36070FCEAPP-000083'),/* 国际化处理： 不使用权参照*/
					isDisableDataShow:false,//默认只加载启用的账户
					noConditionOrg:'Y',
					GridRefActionExt: 'nccloud.web.cmp.ref.CMPRecBillBankaccSubDefaultGridRefSqlBuilder'//自定义增加的过滤条件
				};
			}
		}
		// 发送发组织，接收方组织：根据用户权限过滤
		if (item.attrcode == 'pk_org') {
			item.queryCondition = () => {
				return {
					funcode: printcard_funcode,
					TreeRefActionExt: 'nccloud.web.cmp.ref.CMPUserPermissionOrgBuilder'
				};
			};
		}
	});
	//设置参照可以多选和是否清楚记录
	meta[searchId].items.find((e) => e.attrcode === 'pk_org').isMultiSelectedEnabled = true;
	meta[searchId].items.find((e) => e.attrcode === 'pk_org').showHistory = true;
	meta[searchId].items.find((e) => e.attrcode === 'pk_buyacct').showHistory = false;
	meta[searchId].items.find((e) => e.attrcode === 'pk_sellacct').showHistory = false;
	//财务组织:全加载
	meta[searchId].items.find((e) => e.attrcode === 'pk_org').isTreelazyLoad = false;

	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/