/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import tableButtonClick from './tableButtonClick';
import { Templatedata } from "../../config/Templatedata";//配置的id和area信息
import { setDefOrg2AdvanceSrchArea } from '../../../../../tmpub/pub/util/index';
import { setDefOrg2ListSrchArea } from '../../../../../tmpub/pub/util/index';
import appBase from '../../../base'
import { cache } from '../../../../../tmpub/pub/cons/constant';
import { cardCache} from 'nc-lightapp-front';
import { go2CardCheck } from "../../../../../tmpub/pub/util";


const { api } = appBase;
let searchId = Templatedata.list_searchid;
let tableId = Templatedata.list_tableid;
let pageId = Templatedata.list_pageid;
let moudleId = Templatedata.list_moduleid;
let bill_funcode = Templatedata.bill_funcode;
export default function (props) {
	let _this = this;
	props.createUIDom(
		{
			pagecode: pageId,//页面id
			appcode: Templatedata.list_appcode//注册按钮的id
		},
		function (data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta.call(_this, props, meta);
					setDefOrg2AdvanceSrchArea(props, _this.searchId, data);//高级查询区赋值
					props.meta.setMeta(meta);
					setDefOrg2ListSrchArea(props, _this.searchId, data);//普通查询区赋值
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					// let content =  props.MutiInit.getIntl("36070OP") && props.MutiInit.getIntl("36070OP").get('36070OP-000061')
					// if (!content) {
					// 	content = '确定进行网上支付？';
					// }
					// props.button.setPopContent(
					// 	'innerNetpayBtn', content);
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
	let that = this;
	meta[searchId].items = meta[searchId].items.map((item, key) => {
		// item.visible = true;//否则预置查询方案模版设置显隐性不好用
		// item.col = '3';
		return item;
	})
	// 查询区，组织权限过滤
	meta[searchId].items.map((item) => {
		//参照的档案中没有显示“显示停用”的字段
		item.isShowDisabledData = true;
		if (item.attrcode == 'pk_org') {
			item.queryCondition = () => {
				return {
					funcode: bill_funcode,
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				};
			};
		}
	});
	//操作列点击事件
	meta[tableId].items = meta[tableId].items.map((item, key) => {
		// item.width = 150;

		//单据编号
		if (item.attrcode == 'billcode') {
			item.render = (text, record, index) => {
				return (
					<a
						style={{ cursor: 'pointer' }}  // textDecoration: 'underline',
						onClick={() => {
							//tm begin lidyu 并发交互跳转卡片检查 20200311
							let ts = record.ts.value;
							go2CardCheck({
								props,
								url: Templatedata.gotocardcheck,
								pk: record.pk_settlement.value,
								ts: ts,
								checkTS: false,
								fieldPK: Templatedata.pkname,
								actionCode : null ,
								permissionCode: null ,
								go2CardFunc: () => {
									that.setStateCache();
									props.pushTo('/card', {
										status: 'browse',
										id: record.pk_settlement.value
								
							});
								}
							})
							//tm end lidyu 并发交互跳转卡片检查 20200311  					
						}}
					>
						{record && record.billcode && record.billcode.value}
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
		// 财务组织：根据用户权限过滤
		else if (item.attrcode == 'pk_org') {
			item.queryCondition = () => {
				return {
					funcode: bill_funcode,
					TreeRefActionExt: 'nccloud.web.cmp.ref.CMPUserPermissionOrgBuilder'
				};
			};
		}
		//begin tm tangleic 20190730 重复支付数据在组织前增加图标标示
		api.appendIcon({ props, item, field: 'pk_org_v' });
		//end tangleic 

		//财务组织:权限过滤,移到上方去了
		//meta[searchId].items.find((e) => e.attrcode === 'pk_org').isTreelazyLoad = false;
		//meta[searchId].items.find((e) => e.attrcode === 'pk_org').showHistory = false;
		return item;
	});
	//添加操作列
	meta[tableId].items.push({
		attrcode: 'opr',
		label: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000008'),/* 国际化处理： 操作*/
		fixed: 'right',
		width: '200px',
		visible: true,
		itemtype: 'customer',
		render: (text, record, index) => {

			let buttonAry = [];

			// 这个是业务单据状态，里面有保存和审批通过状态
			let busistatus = record.busistatus.value;
			// 结算状态
			let settlestatus = record.settlestatus.value;
			// 签字人
			let pk_signer = record.pk_signer.value;
			// 业务单据审批状态
			let aduitstatus = record.aduitstatus.value;
			// 结算人
			let pk_executor = record.pk_executor.value;
			// 交易类型，'DS'为工资结算单据，只展示网上支付
			let pk_tradetype = record.pk_tradetype.value;
			// 结算状态，为5是已结算
			let settleflag = settlestatus == '5' ? true : false;
			// 未结算状态
			let unsettle = settlestatus == '0' ? true : false;

			if (unsettle) {
				// 未结算
				if (busistatus == '8') {
					// 8是签字态，只有未结算且签字态的让点击网上转账
					if (pk_tradetype && 'DS' == pk_tradetype) {
						// 工资单据且未结算只有网上支付按钮
						buttonAry = ["innerNetpayBtn"];
					} else {
						buttonAry = ["innerNetpayBtn"];
					}
				} else {
					buttonAry = [];
				}
			} else if (settlestatus == '1') {
				// 支付中
				// buttonAry=["innerUpdatePayStatusBtn"];
			} else if (settlestatus == '2') {
				// 支付失败
				// buttonAry=["innerRedHandleBtn"];
			} else if (settlestatus == '6') {
				buttonAry = ["innerNetpayBtn"];
				// 部分成功
			} else {
				buttonAry = [];
			}
			//结算方向 
			// 根据收付方向设置‘网上转账’是否可见
			let direction = record.direction.value;
			if (direction == '0') {
				let index = buttonAry.indexOf("innerNetpayBtn");
				if (index > -1) {
					// 收款 - 不显示网上转账
					buttonAry.splice(index, 1);
				}
				index = buttonAry.indexOf("redHandleBtn");
				if (index > -1) {
					// 收款类及工资发放不能 结算红冲
					buttonAry.splice(index, 1);
				}

			}
			//单据类型
			let pktradetype = record.pk_tradetype.value;
			if (pktradetype && pktradetype == 'DS') {
				// 收款类及工资发放不能 结算红冲
				let index = buttonAry.indexOf("redHandleBtn");
				if (index > -1) {
					buttonAry.splice(index, 1);
				}


			}
			//begin tm lidyu 20191120 分布式异常交互改造
			// return (
			// 	<div>
			// 		{/* {api.buildWarnIcon(props, { record })} */}
			// 		{/* {props.button.createOprationButton(buttonAry, {
			// 			area: Templatedata.list_inner,
			// 			buttonLimit: 3,
			// 			onButtonClick: (props, key) => tableButtonClick.call(this, props, key, text, record, index)
			// 		})} */}
			// 	</div>)
			return (props.button.createErrorButton({
				record,
				showBack: false,
				sucessCallBack: () => {
					return props.button.createOprationButton(buttonAry,
						{
							area: 'list_inner',//区域编码
							buttonLimit: 3,//按钮显示个数
							onButtonClick: (props, key) => { tableButtonClick.call(this, props, key, text, record, index); }
						});
				}
			}));
			//lidyu end
		}
	});
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/