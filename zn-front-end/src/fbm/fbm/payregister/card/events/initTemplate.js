/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import { base, ajax } from 'nc-lightapp-front';
import { CARD, app_code } from '../../cons/constant';
import { buttonVisible } from './buttonVisible';
import { bodyButtonClick } from './bodyButtonClick';
import { afterEvent } from './index';
import BankaccSubUseTreeGridRef from '../../../../../uapbd/refer/pub/BankaccSubUseTreeGridRef';
import CustSupplierFlexGridTreeRef from '../../../../../uapbd/refer/supplier/CustSupplierFlexGridTreeRef';
export default function (props, templateCallback) {
	let appcode = props.getSearchParam("c") || props.getUrlParam("c");
	props.createUIDom(
		{
			pagecode: CARD.page_id,//页面id
			appcode: appcode
		},
		(data) => {
			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta.call(this, meta);
					props.meta.renderTabs(meta, CARD.tab_order, CARD.tab_order);
					// props.meta.setMeta(meta);
					console.log('meta', meta);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					buttonVisible.call(this, props, button);
				}
				props.form.openArea('register');
				props.form.openArea('credit');
				props.form.openArea('issecurity');
				templateCallback && templateCallback();
				if (data.context) {
					let context = data.context;
					if (props.getUrlParam('status') === 'add') {
						//设置默认组织
						let { pk_org, org_Name, pk_org_v, org_v_Name } = context;
						if (pk_org) {
							props.form.setFormItemsValue(this.formId, {
								'pk_org': { value: pk_org, display: org_Name },
								'pk_org_v': { value: pk_org_v, display: org_v_Name }
							});
							afterEvent.call(this, props, this.formId, 'pk_org', { display: org_Name, value: pk_org }, { value: null });
						}
					}
				}
			}
		}
	)
}

function modifierMeta(meta) {
	//表头
	meta[this.formId].items.map(item => {
		if (item.attrcode === 'pk_org') { //组织
			item.queryCondition = () => {
				return {
					funcode: this.props.getSearchParam('c'),//appcode获取
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				};
			};
		}
		if (item.attrcode === 'receiveaccount') { //电票签约账户
			item.showHistory = true;
			item.queryCondition = () => {
				let data = this.props.form.getFormItemsValue(
					this.formId,
					"pk_org"
				).value;
				return {
					isenableelecbill: 'Y',
					pk_org: data,
					GridRefActionExt: 'nccloud.web.fbm.ref.filter.BankAccDefaultGridRefFilter'
				};
			}

			// item.render = function (text, record, index) {
			// 	return (
			// 		BankaccSubUseTreeGridRef({
			// 			queryCondition: () => {
			// 				let pk_org = this.props.form.getFormItemsValue(formId, 'pk_org').value;
			// 				return {
			// 					pk_org: pk_org, //
			// 					refName: '使用权参照',
			// 					GridRefActionExt: 'nccloud.web.fbm.ref.filter.BankAccDefaultGridRefFilter'
			// 				};
			// 			}
			// 		})
			// 	);
			// }
		}
		// if (item.attrcode == 'receiveaccount') {
		// 	item.checkStrictly = false;
		// 	item.render = function(text, record, index) {
		// 		return (
		// 			BankaccSubUseTreeGridRef({
		// 				queryCondition : () => {
		// 					let pk_org =  props.form.getFormItemsValue(
		// 						"head",
		// 						"pk_org"
		// 					).value;
		// 					return {
		// 						pk_org: pk_org, 

		// 					};
		// 				}
		// 			})
		// 		);
		// 	}
		// };
		if (item.attrcode === 'dept') { //部门过滤
			item.showHistory = true;
			item.queryCondition = () => {
				return {
					pk_org: this.props.form.getFormItemsValue(this.formId, 'pk_org').value,

				};
			};
		};
		if (item.attrcode === 'invstfincvartyid') { //融资品种过滤
			item.queryCondition = () => {
				return { variety_category: "FBM", type: "1" };
			};
		}

	});
	meta['register'].items.map(item => {
		if (item.attrcode === "pk_payacc") {//出票人账号
			item.checkStrictly = false;
			item.showHistory = true;
			item.queryCondition = () => {
				return {
					refnodename:
						this.props.MutiInit.getIntl("36180BPB") && this.props.MutiInit.getIntl("36180BPB").get('36180BPB-000003'),/* 国际化处理： 使用权参照*/
					pk_org: this.props.form.getFormItemsValue(this.formId, "pk_org")
						.value,
					pk_curr:
						this.props.form.getFormItemsValue(this.formId, "pk_curr") &&
						this.props.form.getFormItemsValue(this.formId, "pk_curr").value,
					GridRefActionExt:
						"nccloud.web.fbm.fbm.sign.filter.SignPkcurrFilter,nccloud.web.fbm.fbm.sign.filter.NotSecurityPayAccRefModelFilter,nccloud.web.fbm.fbm.sign.filter.PayBankAccRefModelFilter"
				};
			};
		}



		if (item.attrcode === 'pk_payunit') { //出票人
			item.showHistory = true;
			item.queryCondition = () => {
				return {
					funcode: this.props.getSearchParam('c'),//appcode获取
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				};
			};
		}



		if (item.attrcode === 'hidereceiveunit') { //收款人
			item.checkStrictly = false;
			item.showHistory = true;
			item.queryCondition = () => {
				let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org') && this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
				let pk_group = this.props.form.getFormItemsValue(this.formId, 'pk_group') && this.props.form.getFormItemsValue(this.formId, 'pk_group').value;
				return {
					pk_org: pk_org,
					pk_group: pk_group,
					//GridRefActionExt: "nccloud.web.fbm.fbm.sign.filter.ReceiveCustRefModelFilter"
				};
			};
		}
		if (item.attrcode === 'receiveunit') { //收款人(文本)
			item.checkStrictly = false;
			item.showHistory = true;
			item.fieldDisplayed = 'refname';
			item.itemtype = 'refer';
			item.refcode = 'uapbd/refer/supplier/CustSupplierFlexGridTreeRef/index';
			item.queryCondition = () => {
				let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org') && this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
				let pk_group = this.props.form.getFormItemsValue(this.formId, 'pk_group') && this.props.form.getFormItemsValue(this.formId, 'pk_group').value;
				return {
					pk_org: pk_org,
					pk_group: pk_group,
					//GridRefActionExt: "nccloud.web.fbm.fbm.sign.filter.ReceiveCustRefModelFilter"
				};
			};

		}

		if (item.attrcode === 'hidereceivebank') { //收款银行
			item.checkStrictly = false;
			item.showHistory = true;
		}
		if (item.attrcode === 'receivebank') { //收款银行(文本)
			item.checkStrictly = false;
			item.showHistory = true;
			item.fieldDisplayed = 'refname';
			item.itemtype = 'refer';
			item.refcode = 'uapbd/refer/bankacc/BankDocDefaultGridTreeRef/index';
		}
		if (item.attrcode === 'pk_acceptor') { //承兑人{银行档案}
			item.checkStrictly = false;
			item.showHistory = true;
		}
		if (item.attrcode === 'acceptunit') { //承兑人{客商档案}
			item.checkStrictly = false;
			item.queryCondition = () => {
				let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org') && this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
				let pk_group = this.props.form.getFormItemsValue(this.formId, 'pk_group') && this.props.form.getFormItemsValue(this.formId, 'pk_group').value;
				return {
					pk_org: pk_org,
					pk_group: pk_group,
				};
			};

		}
		if (item.attrcode === 'pk_acceptorbank') { //承兑人开户行名
			item.queryCondition = () => {
				let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org') && this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
				let pk_group = this.props.form.getFormItemsValue(this.formId, 'pk_group') && this.props.form.getFormItemsValue(this.formId, 'pk_group').value;
				return {
					pk_org: pk_org,
					pk_group: pk_group,
				};
			};
		}
		if (item.attrcode === 'hideacceptbankacc') { //承兑人账号
			item.checkStrictly = false;
			item.showHistory = true;
			item.queryCondition = () => {
				return {
					accclass: '1',
					pk_cust: this.props.form.getFormItemsValue(this.formId, 'pk_acceptor').value,
				};
			};
		}


		if (item.attrcode == 'hidereceivebankacc') {//收款人账号
			item.checkStrictly = false;
			item.showHistory = true;
			item.queryCondition = () => {
				let hidereceiveunit = this.props.form.getFormItemsValue(this.formId, 'hidereceiveunit')
				let pk_curr = this.props.form.getFormItemsValue(this.formId, 'pk_curr')
				return {
					pk_cust: hidereceiveunit && hidereceiveunit.value,
					pk_curr: pk_curr && pk_curr.value,
					GridRefActionExt: "nccloud.web.fbm.fbm.gather.filter.GatherBankAccFilter2Cust4NCC"
				};
			};
		}
		if (item.attrcode == 'receivebankacc') {//收款人账号(文本)
			item.checkStrictly = false;
			item.showHistory = true;
			item.fieldDisplayed = 'refcode';
			item.itemtype = 'refer';
			item.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index';
			item.queryCondition = () => {
				let hidereceiveunit = this.props.form.getFormItemsValue(this.formId, 'hidereceiveunit')
				let pk_curr = this.props.form.getFormItemsValue(this.formId, 'pk_curr')
				return {
					pk_cust: hidereceiveunit && hidereceiveunit.value,
					pk_curr: pk_curr && pk_curr.value,
					GridRefActionExt: "nccloud.web.fbm.fbm.gather.filter.GatherBankAccFilter2Cust4NCC"
				};
			};
		}

		if (item.attrcode === 'fbmbilltype') {
			item.queryCondition = () => {

				return {
					GridRefActionExt: 'nccloud.web.fbm.fbm.sign.filter.GatherFbmbilltypeRefModelFilter'
				};
			};
		}



		//自定义项参照
		if (item.attrcode.indexOf("def") > -1) {
			item.queryCondition = (p) => {

				let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
				let pk_group = this.props.form.getFormItemsValue(this.formId, 'pk_group').value;
				return {
					pk_org: pk_org,
					pk_group: pk_group,
				};
			}
		}


	});
	//授信信息
	meta['credit'].items.map(item => {
		if (item.attrcode === 'ccno') { //授信协议添加过滤
			item.queryCondition = () => {
				return {
					orgunit: this.props.form.getFormItemsValue(this.formId, 'pk_org').value, //组织
					pk_group: this.props.form.getFormItemsValue(this.formId, 'pk_group').value, //集团
					// currtype: this.props.form.getFormItemsValue(this.formId, 'pk_currtype').value, //币种 去掉币种过滤
					begindate: this.props.form.getFormItemsValue(this.formId, 'invoicedate').value, //开始日期
					//ccbank: this.props.form.getFormItemsValue(this.formId, 'ccbank').value, //授信类别
					bankdoc: this.props.form.getFormItemsValue(this.formId, 'ccbank').value, //授信银行
					protocolstatus: 'NOEXECUTE,EXECUTING'
				};
			};
		}
		if (item.attrcode === 'pk_cctype') { //授信类别根据授信协议过滤
			item.queryCondition = () => {
				let pk_protocol = this.props.form.getFormItemsValue(this.formId, 'ccno').value;
				let pk_cctype;
				if (pk_protocol) {
					ajax({
						url: '/nccloud/ccc/bankprotocol/CCTypeGridRef.do',
						async: false,
						data: { pk: pk_protocol },
						success: (res) => {
							if (res.data) {
								pk_cctype = res.data.join();
							}
						}
					});
				}
				return { pk_cctype: pk_cctype || 'null' };
			};
		}
	});
	//保证金
	meta['issecurity'].items.map(item => {
		if (item.attrcode === 'securityaccount') { //保证金账户过滤
			item.checkStrictly = false;
			item.queryCondition = () => {
				return {
					pk_org: this.props.form.getFormItemsValue(this.formId, 'pk_org').value, //组织
					pk_currtype: this.props.form.getFormItemsValue(this.formId, 'pk_curr').value, //币种
					busidate: this.props.form.getFormItemsValue(this.formId, 'paybilldate').value, //币种
					GridRefActionExt: "nccloud.web.fbm.fbm.sign.filter.SecurityAccRefModelFilter,nccloud.web.fbm.fbm.sign.filter.SignPkcurrFilter"
				};
			};
		}
	});

	//担保信息 表体和侧拉框
	['guarantee', 'guarantee2'].forEach(area => {
		meta[area].items.map(item => {
			if (item.attrcode === 'pk_guarantee') { //担保合同添加过滤
				item.queryCondition = () => {
					let guaranteetype = this.props.form.getFormItemsValue(this.formId, 'impawnmode').value; //担保方式
					let guatype = null;
					if (guaranteetype == 'CREDIT') {
						guatype = '4';
					} else if (guaranteetype == 'ASSURE') {
						guatype = '1';
					} else if (guaranteetype == 'IMPAWN') {
						guatype = '3';
					} else if (guaranteetype == 'PLEDGE') {
						guatype = '2';
					} else if (guaranteetype == 'MIXED') {
						guatype = '4';
					}
					return {
						isFbm: "1",
						pk_debtor: this.props.form.getFormItemsValue(this.formId, 'pk_org').value, //债务人
						guatype: guatype, //担保方式
						guastartdate: this.props.form.getFormItemsValue(this.formId, 'invoicedate').value, //开始日期
						guaenddate: this.props.form.getFormItemsValue(this.formId, 'enddate').value, //开始日期，没写错，就是传开始时间
						pk_currtype: this.props.form.getFormItemsValue(this.formId, 'pk_curr').value //合同类型为担保合同

					};
				};
			}
		});
	});


	for (let item of Object.keys(meta.gridrelation)) {
		meta[item].items.push({
			attrcode: 'opr',
			label: this.props.MutiInit.getIntl("36180BPB") && this.props.MutiInit.getIntl("36180BPB").get('36180BPB-000004'),/* 国际化处理： 操作*/
			itemtype: 'customer',
			fixed: 'right',
			className: 'table-opr',
			visible: true,
			width: 200,
			render: (text, record, index) => {
				let buttonAry = [];
				if (this.props.getUrlParam('status') === 'browse') { //浏览态
					buttonAry = [record.expandRowStatus ? 'fold' : 'unfold'];
				} else {
					buttonAry = ['expand', 'insertRow', 'delRow'];
				}
				return this.props.button.createOprationButton(buttonAry, {
					area: CARD.body_btn_code,
					onButtonClick: (props, key) => bodyButtonClick.call(this, props, key, text, record, index)
				});
			}
		})
	}

	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/