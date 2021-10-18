/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/
import { bodyButtonClick } from './bodyButtonClick';
import { list, card, appCode, btnLimit, baseReqUrl, javaUrl } from '../../cons/constant.js';
import { setDefOrg2ListSrchArea, setDefOrg2AdvanceSrchArea } from 'src/tmpub/pub/util/index';
import { COMMON_BTN, BTN_AREA } from '../../../../public/cons/constant';
import { voucherLinkBill } from './voucherLinkBill';
import { buttonDisabled } from './buttonClick';
import { go2CardCheck } from '../../../../../tmpub/pub/util/index.js';
const { EDIT_INNER_BTN, DELETE_INNER_BTN, SUBMIT_INNER_BTN, BACK_INNER_BTN, UNSUBMIT_INNER_BTN, ENTRUST_INNER_BTN, UNENTRUST_INNER_BTN } = COMMON_BTN;

export default function (props) {
	props.createUIDom(
		{
			pagecode: this.pageId,//页面code
			//appcode: appCode
		},
		(data) => {
			//console.log(data, 'data')
			if (data) {
				if (data.template) {
					let meta = data.template;
					//联查场景标志
					let src = props.getUrlParam('scene');
					if ('fip' == src) {
						initData.call(this, props);
					}

					meta = modifierMeta.call(this, props, meta)
					setDefOrg2AdvanceSrchArea(props, this.searchId, data);
					props.meta.setMeta(meta);
					setDefOrg2ListSrchArea(props, this.searchId, data);
				}
				if (data.button) {
					/* 按钮适配  第一步：将请求回来的按钮组数据设置到页面的 buttons 属性上 */
					let button = data.button;
					props.button.setButtons(button);
					props.button.setPopContent(DELETE_INNER_BTN, this.state.json['36340FDR-000004']);/* 国际化处理： 确定要删除吗？*/
				}
				buttonDisabled.call(this, props);
			}
		}
	)
}
function initData(props) {
	//主键信息
	let srcid = props.getUrlParam('id');
	//联查场景标志
	let src = props.getUrlParam('scene');
	if ('fip' == src) {//fip代表会计平台
		voucherLinkBill.call(this, this.props, list.pageCode, list.tableCode);
	}
}

function modifierMeta(props, meta) {
	let scene = props.getUrlParam("scene");
	//meta[this.tableId].pagination = true;
	let src = props.getUrlParam('scene');
	let islinkquery = props.getUrlParam('islinkquery');
	if(!islinkquery&&!src){
		meta[this.tableId].pagination = true;
	}else{
		meta[this.tableId].pagination = false;
	}
	//存款单位跨集团参照
	meta[this.searchId].items.find((e) => e.attrcode == 'pk_depositorg').isShowUnit = true;
	meta[this.searchId].items.find((e) => e.attrcode === 'pk_org').isMultiSelectedEnabled = true;
	// meta[this.searchId].items.find((e) => e.attrcode === 'pk_org').queryCondition = {
	// 	funcode: props.getSearchParam('c'),//appcode获取
	// 	TreeRefActionExt: 'nccloud.web.tmpub.filter.FundOrgPermissionFilter'
	// };
	//查询区域参照过滤
	meta[this.searchId].items.map((item) => {
		item.isShowDisabledData = true;
		//资金组织参照过滤
		if (item.attrcode == 'pk_org') {
			item.isTreelazyLoad = false;
			item.queryCondition = () => {
				return {
					funcode: appCode,
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FundOrgPermissionFilter'
				}
			}
		}
		//存款单位参照过滤
		if (item.attrcode == 'pk_depositorg') {
			item.isTreelazyLoad = false;
			item.queryCondition = () => {
				return {
					// isSelect: "Y",
					// pk_org: (props.search.getSearchValByField(this.searchId, 'pk_org') || {}).value.firstvalue,
					// TreeRefActionExt: 'nnccloud.web.ifac.depositprocess.filter.DepositProcessOrgjFilter'
					funcode: appCode,
					pk_fundpayorg: (props.search.getSearchValByField(this.searchId, 'pk_org') || {}).value.firstvalue,
					TreeRefActionExt: "nccloud.web.tmpub.filter.FundFinanceOrgRelationFilter"
				}
			}
		}
		//定期账户参照过滤
		if (item.attrcode == 'pk_depositacc') {
			item.isTreelazyLoad = false;
			item.queryCondition = () => {
				return {
					isSelect: "Y",
					billtype: true,
					pk_currtype: (props.search.getSearchValByField(this.searchId, 'pk_currtype') || {}).value.firstvalue,
					pk_org: (props.search.getSearchValByField(this.searchId, 'pk_org') || {}).value.firstvalue,
					pk_depositorg: (props.search.getSearchValByField(this.searchId, 'pk_depositorg') || {}).value.firstvalue,
					GridRefActionExt: 'nccloud.web.ifac.fixeddatewithdraw.filter.NCCPkDepositaccFilter'
				}
			}
		}
		//结算账户参照过滤
		if (item.attrcode == 'pk_settleacc') {
			item.isTreelazyLoad = false;
			item.queryCondition = () => {
				return {
					isSelect: "Y",
					pk_org: (props.search.getSearchValByField(this.searchId, 'pk_org') || {}).value.firstvalue,
					pk_depositorg: (props.search.getSearchValByField(this.searchId, 'pk_depositorg') || {}).value.firstvalue,
					pk_currtype: (props.search.getSearchValByField(this.searchId, 'pk_currtype') || {}).value.firstvalue,
					GridRefActionExt: 'nccloud.web.ifac.fixeddatewithdraw.filter.NCCPkSettleaccFilter'
				}
			}
		}
		//定期利率参照过滤
		if (item.attrcode == 'pk_depositrate') {
			//item.isTreelazyLoad = false;
			item.queryCondition = () => {
				return {
					ratetype: "FRATE",
					//pk_org: (props.search.getSearchValByField(ist.searchCode, 'pk_org') || {}).value.firstvalue,
					GridRefActionExt: 'nccloud.web.ifac.regularvarietyset.filter.RegularsetDepositrateFilter'
				}
			}
		}
		//活期利率参照过滤
		if (item.attrcode == 'pk_aiacrate') {
			item.isTreelazyLoad = false;
			item.queryCondition = () => {
				return {
					ratetype: "CRATE",
					pk_org: (props.search.getSearchValByField(list.searchCode, 'pk_org') || {}).value.firstvalue,
					GridRefActionExt: 'nccloud.web.ifac.regularvarietyset.filter.RegularsetAiacrateFilter'
				}
			}
		}
	});
	
	meta[this.tableId].items = meta[this.tableId].items.map((item, key) => {
		//item.width = 150;
		//点击某一列跳转到browse状态
		let type = props.getUrlParam('type');
		let src = props.getUrlParam('scene');
		if (item.attrcode == 'vbillcode') {
			item.render = (text, record, index) => {
				return (
					<a
						style={{ color: '#007ace', cursor: 'pointer', overflow: 'hidden', 'text-overflow': 'ellipsis' }}
						onClick={() => {
							go2CardCheck({
								props,
								url: `${baseReqUrl}${javaUrl.check2card}.do`,
								pk: record.pk_deposit.value,
								ts: record.ts.value,
								fieldPK: 'pk_deposit',
								//动作编码（权限检查 空则不检查）
								actionCode: null,
								//权限编码（权限检查 空则不检查）
								permissionCode: null,
								//是否进行saga检查(默认检查，不涉及云原生改造的单据不用检查)
								checkSaga: false,
								checkTS: false,
								go2CardFunc: () => {
									props.pushTo("/card", {
										status: 'browse',
										id: record.pk_deposit.value,
										douclick: 'douclick',
										type: type,
										scene: src,
										pagecode: card.pageCode
									});
								}
							})
							// props.pushTo("/card", {
							// 	status: "browse",
							// 	id: record[this.primaryId].value,
							// 	pagecode: card.pageCode
							// });
						}}
					>
						{record && record.vbillcode && record.vbillcode.value}
					</a>
				);
			};
		}
		return item;
	});

	//添加操作列
	if (scene != 'fip' && scene != 'linksce') {
		meta[this.tableId].items.push({
			attrcode: 'opr',
			label: this.state.json['36340FDR-000019'],/* 国际化处理： 操作*/
			width: 250,
			fixed: 'right',
			className: "table-opr",
			itemtype: 'customer',
			visible: true,
			render: (text, record, index) => {
				let buttonAry = [];
				let vbillstatus = record.vbillstatus && record.vbillstatus.value;
				let vbillstate = record.vbillstate && record.vbillstate.value; //单据状态
				let saga_status = record.saga_status && record.saga_status.value;
				let srcbillcode = record.srcbillcode && record.srcbillcode.value; //单据状态
				switch (vbillstate) {
					case "1": //待提交
						if (saga_status === '1') {
							buttonAry = [];
						} else {
							if (!srcbillcode) {
								buttonAry = [SUBMIT_INNER_BTN, EDIT_INNER_BTN, DELETE_INNER_BTN];
							} else {
								buttonAry = [SUBMIT_INNER_BTN, EDIT_INNER_BTN, BACK_INNER_BTN];
							}
						}
						break;
					case "2": //待审批
						if (saga_status === '1') {
							buttonAry = [];
						} else {
							buttonAry = [UNSUBMIT_INNER_BTN];
						}
						break;
					case "3": //审批完成
						buttonAry = [];
						break;
					default:
						break;
				}
				return (props.button.createErrorButton({
					record,
					showBack: false,
					sucessCallBack: () => {
						return props.button.createOprationButton(buttonAry, {
							area: list.bodyCode,
							buttonLimit: btnLimit,
							onButtonClick: (props, key) => bodyButtonClick.call(this, key, record, index)
						});
					}
				}));
			}
		});
	}
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/