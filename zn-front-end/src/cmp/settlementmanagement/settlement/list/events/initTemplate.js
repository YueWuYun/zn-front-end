/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import tableButtonClick from './tableButtonClick';
import buttonUsable from './buttonUsable.js';//按钮显隐性
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
export default function (props) {
	let _this = this;
	props.createUIDom(
		{
			pagecode: pageId//页面id
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
					props.button.setPopContent(
						'redHandleBtn',
						_this.getLangCode('000023') // '结算红冲不可逆，确认要进行红冲操作吗?'
					);
				}
				buttonUsable.call(_this, props, null);
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
		// item.visible = true;
		// item.col = '3';
		return item;
	})
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
								checkSaga: false,
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
		// else if (item.attrcode == 'pk_org') {
		// 	item.queryCondition = () => {
		// 		return {
		// 			funcode: bill_funcode,
		// 			TreeRefActionExt: 'nccloud.web.cmp.ref.CMPUserPermissionOrgBuilder'
		// 		};
		// 	};
		// }

		//begin tm tangleic 20190730 重复支付数据在组织前增加图标标示
		api.appendIcon({ props, item, field: 'pk_org_v' });
		//end tangleic 
		return item;
	});
	//添加操作列
	meta[tableId].items.push({
		attrcode: 'opr',
		label: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000016'),/* 国际化处理： 操作*/
		fixed: 'right',
		width: '220px',
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
			let aduitstatus = record.aduitstatus && record.aduitstatus.value;
			// 结算人
			let pk_executor = record.pk_executor.value;

			// 归属系统
			let systemcode = record.systemcode.value;

			// 结算状态，为5是已结算
			let settleflag = settlestatus == '5' ? true : false;
			// 未结算状态
			let unsettle = settlestatus == '0' ? true : false;
			if (settleflag) {
				// 结算成功
				buttonAry = ["innerAntiSettle", "makebillBtn"];
				// 添加归属系统资金结算或到账通知生成 可以取消签字 签字判断 2020-02-29
				if ((systemcode == 5 || systemcode == 2) && busistatus == 8) {
					buttonAry.push("innerAntiSign");
				} else if ((systemcode == 5 || systemcode == 2) && busistatus == 1) {
					buttonAry.push("innerSign");
				}
			} else if (unsettle) {
				// 未结算状态
				if (pk_signer) {
					// 已签字未结算状态
					buttonAry = ["innerAntiSign", "innerSettle", "innerNetpayBtn"];
				} else {
					// 未签字未结算状态
					if (aduitstatus && aduitstatus == 0) {
						// 通过审核，未签字
						buttonAry = ["innerEdit", "innerSign"];
					} else {
						// 未通过审核，未结算，保存态
						buttonAry = ["innerEdit"];
					}
				}
			} else if (settlestatus == '2') {
				// 支付失败，支付变更按钮不加，不知道选择哪个子表
				// buttonAry=["settlePayChangeBtn"];
				buttonAry = ["redHandleBtn"];
			} else if (settlestatus == '6') {
				// 部分成功，结算红冲按钮
				buttonAry = ["redHandleBtn"];
			} else if (!unsettle) {
				// 结算过程中状态，不允许任何操作
				buttonAry = [];
			}
			//结算方向 
			// 根据收付方向设置‘网上转账’是否可见
			let direction = record.direction.value;
			if (direction == '0') {
				// 收款 - 不显示网上转账
				if (buttonAry.indexOf("innerNetpayBtn") > -1) buttonAry.splice(buttonAry.indexOf("innerNetpayBtn"), 1);
				// 收款类及工资发放不能 结算红冲
				if (buttonAry.indexOf("redHandleBtn") > -1) buttonAry.splice(buttonAry.indexOf("redHandleBtn"), 1);
			}
			// （网银）审批状态<新增字段>
			let netAppStaus = record.vbillstatus.value;
			if (netAppStaus) {
				if (netAppStaus == 1 || netAppStaus == 2) {
					// 审批通过-不显示取消签字
					if (buttonAry.indexOf("innerAntiSign") > -1) buttonAry.splice(buttonAry.indexOf("innerAntiSign"), 1);
				}
				if (netAppStaus != 1) {
					// 待审批 - 不显示网上转账
					if (buttonAry.indexOf("innerNetpayBtn") > -1) buttonAry.splice(buttonAry.indexOf("innerNetpayBtn"), 1);
				}
			}

			//单据类型
			let pk_tradetype = record.pk_tradetype.value;
			if (pk_tradetype && pk_tradetype == 'DS') {
				// 收款类及工资发放不能 结算红冲
				if (buttonAry.indexOf("redHandleBtn") > -1) buttonAry.splice(buttonAry.indexOf("redHandleBtn"), 1);

			}
			//begin tm lidyu 20191120 分布式异常交互改造

			// return (<div>
			// 	{/* {api.buildWarnIcon(props, { record })} */}
			// 	{props.button.createOprationButton(buttonAry, {
			// 		area: Templatedata.list_inner,
			// 		buttonLimit: 3,
			// 		onButtonClick: (props, key) => tableButtonClick.call(this, props, key, text, record, index)
			// 	})}
			// </div>)
			return (props.button.createErrorButton({
				record,
				showBack: false,
				sucessCallBack: () => {
					return props.button.createOprationButton(buttonAry,
						{
							area: Templatedata.list_inner,//区域编码
							buttonLimit: 3,//按钮显示个数
							onButtonClick: (props, key) => { tableButtonClick.call(this, props, key, text, record, index); }
						});
				}
			}));
			//lidyu end
		}
	});
	// 查询区，组织权限过滤
	meta[searchId].items.map((item) => {
		//参照的档案中没有显示“显示停用”的字段
		item.isShowDisabledData = true;
		if (item.attrcode == 'pk_org') {
			item.queryCondition = () => {
				return {
					funcode: Templatedata.bill_funcode,
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
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