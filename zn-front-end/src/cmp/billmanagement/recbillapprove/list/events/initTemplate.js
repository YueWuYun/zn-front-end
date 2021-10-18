/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { createPage, ajax, base, toast } from 'nc-lightapp-front';
let { NCPopconfirm, NCIcon } = base;
import tableButtonClick from './tableButtonClick';
import { Templatedata } from "../../config/Templatedata";//配置的id和area信息
let searchId = Templatedata.list_searchid;
let tableId = Templatedata.list_tableid;
let pageId = Templatedata.list_pageid;
let moudleId = Templatedata.list_moduleid;
let appcode = Templatedata.app_code;
let printcard_funcode = Templatedata.printcard_funcode;
export default function (props) {
	let self = this;
	props.createUIDom(
		{
			pagecode: pageId,//页面id
			appcode: appcode,
			appid: Templatedata.list_appid//注册按钮的id
		},
		function (data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta.call(self, props, meta)
					props.meta.setMeta(meta);
				}
				debugger;
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					props.button.setPopContent('deletetableBtn', '确认要删除该信息吗？'); /* 设置操作列上删除按钮的弹窗提示 */
					// props.button.setPopContent('submittableBtn', '确认要提交该信息吗？'); /* 设置操作列上删除按钮的弹窗提示 */
					// props.button.setPopContent('makebilltableBtn', '确认要该信息制单吗？'); /* 设置操作列上删除按钮的弹窗提示 */
					// props.button.setPopContent('unsubmittableBtn', '确认要收回该信息吗？'); /* 设置操作列上删除按钮的弹窗提示 */
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
		item.col = '3';
		return item;
	})
	let self2 = this;
	//操作列点击事件
	meta[tableId].items = meta[tableId].items.map((item, key) => {
		item.width = 150;
		//单据编号
		if (item.attrcode == 'bill_no') {
			item.render = (text, record, index) => {
				return (
					<a
						style={{ textDecoration: '', cursor: 'pointer' }}
						onClick={() => {
							props.linkTo('/cmp/billmanagement/recbill/card/index.html', {
								status: 'browse',
								id: record.pk_recbill.value,
								billno: record.bill_status.value,
								pagecode: record.trade_type.value
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
	let multiLang = props.MutiInit.getIntl(moudleId);
	//添加操作列
	meta[tableId].items.push({
		attrcode: 'opr',
		label: this.props.MutiInit.getIntl("36070RBMAPP") && this.props.MutiInit.getIntl("36070RBMAPP").get('36070RBMAPP-000017'),/* 国际化处理： 操作*/
		fixed: 'right',
		width: '200px',
		visible: true,
		render: (text, record, index) => {

			let buttonAry = [];

			if (record && record.bill_status && record.bill_status.value == '-10') {
				/* 单据状态：已保存  */
				buttonAry = ["submittableBtn", "edittableBtn", "deletetableBtn"];
			} else if (record && record.bill_status && record.bill_status.value == '-99') {
				/* 单据状态：暂存 */
				buttonAry = ["edittableBtn"];
			} else if (record.bill_status && record.bill_status.value == '8') {
				/* 单据状态：签字 */
				buttonAry = ["makebilltableBtn"];
			} else if (record.bill_status && record.bill_status.value == '-1') {
				/* 单据状态：待审批 */
				buttonAry = ["unsubmittableBtn"];
			}else if (record.bill_status && record.bill_status.value == '1'){
				/* 单据状态：审批通过:针对没有审批流直接退回 */
				buttonAry = ["unsubmittableBtn"];
			}			

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
	//设置参照可以多选
	meta[searchId].items.find((e) => e.attrcode === 'pk_org').isMultiSelectedEnabled = true;
	//财务组织:全加载
	meta[searchId].items.find((e) => e.attrcode === 'pk_org').isTreelazyLoad = false;
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/