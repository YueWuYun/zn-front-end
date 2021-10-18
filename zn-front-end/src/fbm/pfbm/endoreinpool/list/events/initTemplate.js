/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import { createPage, ajax, base, toast, excelImportconfig } from 'nc-lightapp-front';
import { bodyButtonClick } from './index';
import { CARD, LIST, button_limit, btns } from '../../cons/constant.js';
import { initList } from '../../../../public/container/page';
import { setDefOrg2ListSrchArea, setDefOrg2AdvanceSrchArea } from 'src/tmpub/pub/util/index';
export default function (props) {
	let app_code = props.getSearchParam('c');
	let excelimportconfig = excelImportconfig(props, "fbm", '36HT', true, "", { "appcode": app_code, "pagecode": CARD.page_id });
	let pagecode = LIST.page_id;
	let scene = this.props.getUrlParam("scene");
	let pk_ntbparadimvo = this.props.getUrlParam("pk_ntbparadimvo"); //预算反联查
	if (scene === "linksce" || scene === "fip" || pk_ntbparadimvo) {
		pagecode = LIST.page_id_link;
	}
	props.createUIDom(
		{
			pagecode: pagecode,//页面code
			appcode: app_code
		},
		(data) => {
			if (data) {
				if (data.button) {
					/* 按钮适配  第一步：将请求回来的按钮组数据设置到页面的 buttons 属性上 */
					let button = data.button;
					props.button.setButtons(button);
					let multiLang = this.props.MutiInit.getIntl(this.moduleId); //this.moduleId
					props.button.setPopContent('DeleteInner', multiLang && multiLang.get('36200ET-000004'));/* 国际化处理： 确认要删除吗?*/
					props.button.setButtonDisabled(LIST.disabled_btn, true);
					props.button.setUploadConfig("QuickImport", excelimportconfig);
				}
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta.call(this, props, meta);
					//给高级查询区域赋默认业务单元(在setMeta之前使用)
					setDefOrg2AdvanceSrchArea(props, LIST.search_id, data);
					props.meta.setMeta(meta);
					//给列表查询区域赋默认业务单元(在setMeta之后使用)
					setDefOrg2ListSrchArea(props, LIST.search_id, data);
					templateCallback.call(this, meta);
				}
			}
		}
	)
}

function modifierMeta(props, meta) {
	if (meta[this.searchId] && meta[this.searchId].items) {
		meta[this.searchId].items.map(item => {
			if (item.attrcode === 'pk_org') { //财务组织过滤
				item.isMultiSelectedEnabled = true; //财务组织多选
				item.queryCondition = () => {
					return {
						funcode: this.props.getSearchParam('c'),//appcode获取
						TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
					};
				};
			}
			// 票据类别根据票据大类过滤
			else if (item.attrcode == 'pk_register.fbmbilltype') {
				item.queryCondition = () => {
					return {
						GridRefActionExt: 'nccloud.web.fbm.fbm.sign.filter.GatherFbmbilltypeRefModelFilter'
					};
				};
			}
			// 被背书单位
			if (item.attrcode === 'endorsee') {
				item.queryCondition = () => {
					let pk_org = this.props.search.getSearchValByField(this.searchId, 'pk_org');
					if (pk_org && pk_org.value && pk_org.value.firstvalue) {
						return {
							pk_org: pk_org.value.firstvalue,
						};
					}else{
						return {};
					}
				};
			}
			// 自定义项过滤
			else if (item.attrcode.indexOf("def") > -1) {
				//自定义档案按照组织或者集团过滤
				item.queryCondition = (p) => {
					let pk_org = this.props.search.getSearchValByField(this.searchId, 'pk_org');
					if (pk_org && pk_org.value && pk_org.value.firstvalue) {
						return {
							pk_org: pk_org.value.firstvalue
						};
					}
				}
			}
		});
	}
	meta[this.tableId].pagination = true;
	meta[this.tableId].items = meta[this.tableId].items.map((item, key) => {
		// item.width = 150;
		if (item.attrcode == this.billNo) {
			item.render = (text, record, index) => {
				let pagecode = LIST.page_id;
				let scene = this.props.getUrlParam("scene");
				let pk_ntbparadimvo = this.props.getUrlParam("pk_ntbparadimvo"); //预算反联查
				if ((scene && scene === "linksce") || pk_ntbparadimvo) {
					pagecode = LIST.page_id_link;
					scene = 'linksce';
				}
				return (
					<a
						style={{ cursor: 'pointer' }}
						onClick={() => {
							props.pushTo('/card', {
								status: 'browse',
								id: record[this.primaryId].value,
								pagecode: CARD.page_id,
								scene: scene
							});
						}}
					>
						{record[this.billNo] && record[this.billNo].value}
					</a>
				);
			};
		}
		return item;
	});

	//添加操作列
	let multiLang = this.props.MutiInit.getIntl(this.moduleId); //this.moduleId
	meta[this.tableId].items.push({
		itemtype: 'customer',
		attrcode: 'opr',
		label: multiLang && multiLang.get('36200ET-000005'),/* 国际化处理： 操作*/
		width: 200,
		fixed: 'right',
		className: "table-opr",
		visible: true,
		render: (text, record, index) => {
			return props.button.createErrorButton({
				record: record,
				//showBack: false, // 是否显示回退按钮         
				sucessCallBack: () => {
					let vbillstatus = record.vbillstatus.value;
					let paymentstatus = record.paymentstatus.value;
					let onlinebankflag = record.onlinebankflag.value; // true or false
					let disableflag = record.disableflag.value; // true or false
					let voucher = record.voucher.value;// true or false
					//  syscode 来源系统  INPUT=手工录入，CMP=现金管理，FTS=资金结算，ARAP=应收应付，
					let syscode = record.syscode.value;
					let ecdswithdrawstatus = record.ecdswithdrawstatus.value;

					let buttonAry = [];
					if (!vbillstatus) {
						vbillstatus == -1
					}
					if (syscode == 'INPUT') {
						if (vbillstatus == '-1') {
							// 待提交
							buttonAry = ['CommitInner', 'EditInner', 'DeleteInner'];
						} else if (vbillstatus == 3 || vbillstatus == 0 || vbillstatus == 2) {
							// 提交态，待审批
							buttonAry = ['UnCommitInner'];
						} else if (vbillstatus == '1' && !disableflag && !voucher) {
							// 审批通过
							if (paymentstatus && paymentstatus == '1') {
								// 支付指令发送成功 ,'CancelCommandInner'
								buttonAry = ['MakeVoucherInner'];
							} else if (paymentstatus == '3') {
								// 支付指令不明
							} else if (paymentstatus == '2') {
								// 支付失败
								buttonAry = ['CommandInner', 'DisabledInner'];
							} else if (onlinebankflag) {
								// 网银
								buttonAry = ['CommandInner', 'UnCommitInner'];
							} else {
								// 非网银
								buttonAry = ['MakeVoucherInner', 'UnCommitInner'];
							}
						}
						if (voucher) {
							// 已制证
							buttonAry = ['CancelVoucherInner'];
						}
					} else {
						if (onlinebankflag && !disableflag && !voucher) {
							// 支付失败
							if (paymentstatus == '2') {
								buttonAry = ['CommandInner', 'DisabledInner'];
							}
							// 交易不明
							else if (paymentstatus == '3') {
								// 撤回指令状态
								if (!ecdswithdrawstatus && ecdswithdrawstatus != '1') {
									// 撤回失败才可以再次撤回
									showBtn.push(btns.takeCommandBtn);
								} else if (ecdswithdrawstatus == '2') {
									showBtn.push(btns.takeCommandBtn);
								}
							}
						}
					}
					if (disableflag) {
						// 已作废
						buttonAry = ['CancelDisabledInner'];
					}
					return props.button.createOprationButton(buttonAry, {
						area: "list_inner",
						buttonLimit: button_limit,
						onButtonClick: (props, key) => bodyButtonClick.call(this, key, record, index)
					});
				}
			});
		}
	});
	return meta;
}

//模板加载后的回调函数
function templateCallback(meta) {
	initList.call(this);
}

/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/