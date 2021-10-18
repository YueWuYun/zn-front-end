/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import tableButtonClick from './tableButtonClick';
import buttonUsability from './buttonUsability';
import { Templatedata } from "../../config/Templatedata";//配置的id和area信息
import { setDefOrg2ListSrchArea,go2CardCheck,setDefOrg2AdvanceSrchArea } from '../../../../../tmpub/pub/util/index';
let searchId = Templatedata.list_searchid;
let tableId = Templatedata.list_tableid;
let pageId = Templatedata.list_pageid;
let appcode = Templatedata.app_code;
let printcard_funcode = Templatedata.printcard_funcode;
export default function (props) {
	let self = this;
	let source_flag_dly = this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000021');
	props.createUIDom(
		{
			pagecode: pageId,//页面id
			appcode: appcode,
			appid: Templatedata.list_appid//注册按钮的id
		},
		function (data) {
			if (data) {
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					props.button.setPopContent('deletetableBtn', props.MutiInit.getIntl("36070RBMCP") && props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000056'));
				}
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta.call(self, props, meta);
					setDefOrg2AdvanceSrchArea(props, self.searchId, data);//高级查询区赋值
					props.meta.setMeta(meta, () => {
						props.search.setSearchValByField(searchId, 'source_flag', { value: '9', display: source_flag_dly });//普通查询区赋值/* 国际化处理： 协同单据*/
						props.advancedSearch.setSearchValByField(searchId, 'source_flag', { value: '9', display: source_flag_dly });//给高级查询区赋默认值/* 国际化处理： 协同单据*/
					});
					setDefOrg2ListSrchArea(props, self.searchId, data);//普通查询区赋值
				}
				buttonUsability.call(self, props, '');//列表按钮显影性
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
	let self2 = this;
	meta[searchId].items = meta[searchId].items.map((item, key) => {
		// item.visible = true;
		// item.col = '3';
		return item;
	})
	//操作列点击事件
	meta[tableId].items = meta[tableId].items.map((item, key) => {
		// item.width = 150;
		//单据编号
		if (item.attrcode == 'bill_no') {
			item.render = (text, record, index) => {
				return (
					<a
						style={{ cursor: 'pointer' }}
						onClick={() => {
								//2004-zhanghjr:列表跳卡片并发适配
								go2CardCheck({
									props,
									url: '/nccloud/cmp/recbill/gotocardcheck.do',
									pk: record.pk_recbill.value,
									ts: record.ts.value,
									checkTS: false,
									checkSaga: false,
									fieldPK: 'pk_recbill',
									go2CardFunc: () => {
										props.pushTo('/card', {
											status: 'browse',
											id: record.pk_recbill.value,
											billno: record.bill_status.value
										});
									}
								});

							
						}}
					>
						{record && record.bill_no && record.bill_no.value}
					</a>
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
	//添加操作列
	meta[tableId].items.push({
		attrcode: 'opr',
		label: this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000016'),/* 国际化处理： 操作*/
		fixed: 'right',
		width: '200px',
		visible: true,
		itemtype: 'customer',
		render: (text, record, index) => {

			let buttonAry = [];

			if (record && record.bill_status && record.bill_status.value == '-10') {
				/* 单据状态：已保存  */
				buttonAry = ["unconfirmBtn"];//取消确认
			} else if (record && record.bill_status && record.bill_status.value == '-99') {
				/* 单据状态：暂存 */
				// buttonAry=["edittableBtn"];
			} else if (record.bill_status && record.bill_status.value == '8') {
				/* 单据状态：签字 */
				// buttonAry=["makebilltableBtn"];
			} else if (record.bill_status && record.bill_status.value == '-1') {
				/* 单据状态：待审批 */
				// buttonAry=["unsubmittableBtn"];
			} else if (record.bill_status && record.bill_status.value == '9') {
				/* 单据状态：未确认 */
				buttonAry = ["confirmBtn", "deletetableBtn"];//确认，删除
			}

			return props.button.createOprationButton(buttonAry, {
				area: Templatedata.list_inner,
				buttonLimit: 3,
				onButtonClick: (props, key) => tableButtonClick.call(self2, props, key, text, record, index)
			});

			//begin tm zhanghe 20191120 支持分布式事务异常交互
			// return props.button.createOprationButton(buttonAry, {
			// 	area: Templatedata.list_inner,
			// 	buttonLimit: 3,
			// 	onButtonClick: (props, key) => tableButtonClick.call(self2, props, key, text, record, index)
			// });
			return (props.button.createErrorButton({
				record,
				showBack: false,
				sucessCallBack: () => {
					return props.button.createOprationButton(buttonAry, {
						area: Templatedata.list_inner,
						buttonLimit: 3,
						onButtonClick: (props, key) => tableButtonClick.call(self2, props, key, text, record, index)
					});
				}
			}));
			//end


		}
	});
	//组织用户权限过滤
	meta[searchId].items.map((item) => {

		//参照的档案中没有显示“显示停用”的字段
		item.isShowDisabledData = true;
		//收款账户[子表字段]
		if (item.attrcode === 'items.pk_account') {
			item.queryCondition = () => {
				let search_org_value2 = props.search.getSearchValByField(searchId, 'pk_org');//所选组织
				if (search_org_value2 && search_org_value2.value.firstvalue) {
					search_org_value2 = search_org_value2.value.firstvalue;
				} else {
					search_org_value2 = null;
				}
				let search_buycurr_value = props.search.getSearchValByField(searchId, 'items.pk_currtype');//所选币种
				if (search_buycurr_value && search_buycurr_value.value.firstvalue) {
					search_buycurr_value = search_buycurr_value.value.firstvalue;
				} else {
					search_buycurr_value = null;
				}

				return {
					pk_orgs: search_org_value2,
					pk_currtype: search_buycurr_value,
					refnodename: '使用权参照',/* 国际化处理： 不使用权参照*/
					isDisableDataShow: false,//默认只加载启用的账户
					noConditionOrg: 'Y',
					GridRefActionExt: 'nccloud.web.cmp.ref.CMPBatchOrgBankaccSubDefaultGridRefSqlBuilder'//自定义增加的过滤条件
				};
			}
		}
		// 发送发组织，接收方组织：根据用户权限过滤
		if (item.attrcode == 'pk_org') {
			item.queryCondition = () => {
				return {
					funcode: printcard_funcode,
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				};
			};
		}
	});
	//财务组织:全加载
	meta[searchId].items.find((e) => e.attrcode === 'pk_org').isTreelazyLoad = false;
	//设置参照可以多选
	meta[searchId].items.find((e) => e.attrcode === 'pk_org').isMultiSelectedEnabled = true;
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/