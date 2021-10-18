/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import { base, ajax, cardCache, toast, excelImportconfig } from 'nc-lightapp-front';
import {
	CARD_FORM_CODE,
	CARD_PAGE_CODE,
	CARD_TABLE_CODE1,
	CARD_TABLE_CODE2,
	CARD_TABLE_CODE3
} from './../../cons/constant';
import { buttonVisiable, afterEvent } from './../events';

export function initTemplate(props, callback) {
	let that = this;
	props.createUIDom(
		{
			pagecode: CARD_PAGE_CODE, //页面id
			appcode: this.appcode //注册按钮的id
		},
		function (data) {
			if (data) {
				let status = props.getUrlParam('status');
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta(that, props, meta);
					props.meta.setMeta(meta);

					if (status === 'browse') {
						// props.cardTable.setStatus(card_table_id, 'browse');
						let metaFromData = meta[CARD_FORM_CODE];
						metaFromData.items.forEach((val) => {
							if (val.attrcode === 'pk_org') {
								val.visible = false;
								val.disabled = true;
								return;
							} else if (val.attrcode === 'pk_org_v') {
								val.visible = true;
								val.disabled = false;
								return;
							}
						});
					} else {
						// props.cardTable.setStatus(card_table_id, 'edit');
						meta[CARD_FORM_CODE].items.forEach((val) => {
							if (val.attrcode === 'pk_org') {
								val.visible = true;
								val.disabled = false;
								return;
							} else if (val.attrcode === 'pk_org_v') {
								val.visible = false;
								val.disabled = true;
								return;
							}
						});
					}

					if (status === 'add') {
						//单据有主组织，新增时,将其他字段设置为不可编辑.
						props.initMetaByPkorg();
						let metaFromData = meta[CARD_FORM_CODE];
						metaFromData.items.forEach((val) => {
							if (val.attrcode === 'pk_org') {
								// val.visible = true;
								val.disabled = false;
								return;
							}
						});
					} else if (status === 'copy') {
						let metaFromData = meta[CARD_FORM_CODE];
						metaFromData.items.forEach((val) => {
							if (val.attrcode === 'pk_org') {
								// val.visible = true;
								val.disabled = true;
								return;
							}
						});
					}
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					buttonVisiable.call(that, props);
					// props.button.setPopContent('delete_inner', props.MutiInit.getIntl("36320FDA") && props.MutiInit.getIntl("36320FDA").get('36320FDA--000063'));/* 国际化处理： 确认要删除该信息吗？*/

					// props.button.setUploadConfig("ImportData", excelimportconfig);
				}
				if (data.context) {
					let context = data.context;
					that.setState({
						curr_pk_org: context.pk_org,
						curr_orgname: context.org_Name,
						curr_pk_org_v: context.pk_org_v,
						curr_orgname_v: context.org_v_Name
					});
					if (status === 'add') {
						that.props.form.setFormItemsValue(CARD_FORM_CODE, {
							pk_org: {
								value: context.pk_org,
								display: context.org_Name
							},
							pk_org_v: {
								value: that.state.curr_pk_org_v,
								display: that.state.curr_orgname_v
							}
						});
						if (context.pk_org) {
							let pk_org = {
								value: context.pk_org,
								display: context.org_Name
							};
							afterEvent.call(
								that,
								that.props,
								CARD_FORM_CODE,
								'pk_org',
								pk_org,
								null,
								null,
								null,
								null,
								true
							);
							// that.props.resMetaAfterPkorgEdit();
							// that.props.form.setFormItemsDisabled(CARD_FORM_CODE, { 'pk_org': false });
						}
					}
				}
			}
		}
	);
}

function modifierMeta(that, props, meta) {
	//收票登记表
	meta[CARD_FORM_CODE].items.map((item) => {
		//财务组织用户过滤
		if (item.attrcode == 'pk_org') {
			// item.showHistory = false;
			item.queryCondition = () => {
				return {
					funcode: that.appcode,
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				};
			};
		}

		//付票单位过滤
		if (item.attrcode === 'paybillunit') {
			item.checkStrictly = false;
			item.showHistory = true;
			item.queryCondition = () => {
				return {
					pk_org: props.form.getFormItemsValue(CARD_FORM_CODE, 'pk_org').value,
					pk_group: props.form.getFormItemsValue(CARD_FORM_CODE, 'pk_group').value,
				};
			};
		}

		//业务组织过滤
		if (item.attrcode == 'pk_entrustorg') {
			// item.showHistory = false;
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(CARD_FORM_CODE, 'pk_org');
				return {
					pkorg: pk_org && pk_org.value,
					TreeRefActionExt: 'nccloud.web.fbm.fbm.gather.filter.GatherOrgRelationDataRefModelFilter4NCC'
				};
			};
		}

		//收票计划项目
		if (item.attrcode == "gatherplanitem") {
			item.queryCondition = () => {
				let data = props.form.getFormItemsValue(CARD_FORM_CODE, "pk_org").value;
				return { pk_org: data };
			};
		}

		//自定义项参照
		if (item.attrcode.indexOf("def") > -1) {
			item.queryCondition = (p) => {
				// let GridRefActionExt, TreeRefActionExt;
				// if (p) {
				// 	if (p.refType == 'grid' || p.refType == 'gridTree') {
				// 		GridRefActionExt = 'nccloud.web.arap.ref.before.CrossRuleSqlBuilder';
				// 	} else if (p.refType == 'tree') {
				// 		TreeRefActionExt = 'nccloud.web.arap.ref.before.CrossRuleSqlBuilder';
				// 	}
				// }
				// let UsualGirdRefActionExt = 'nccloud.web.arap.ref.before.CrossRuleSqlBuilder';
				let pk_org = props.form.getFormItemsValue(CARD_FORM_CODE, 'pk_org').value;
				let pk_group = props.form.getFormItemsValue(CARD_FORM_CODE, 'pk_group').value;
				return {
					pk_org: pk_org,
					pk_group: pk_group,
					// GridRefActionExt: GridRefActionExt,
					// TreeRefActionExt: TreeRefActionExt,
					// UsualGirdRefActionExt: UsualGirdRefActionExt
				};
			}
		}
	});

	// 票据基本信息
	meta[CARD_TABLE_CODE1].items.map((item) => {
		if (
			item.attrcode === 'hidepayunit' ||
			item.attrcode === 'hidepaybank' ||
			item.attrcode === 'hidereceiveunit' ||
			item.attrcode === 'hidereceivebank' ||
			item.attrcode === 'signagrbank' ||
			item.attrcode === 'pk_signagrbank' ||
			item.attrcode === 'acceptorbankaccount' ||
			item.attrcode === 'acceptorbank' ||
			item.attrcode === 'pk_acceptorbank'
		) {
			//出票人
			item.checkStrictly = false;
			item.showHistory = true;
		}

		//票据类型过滤
		if (item.attrcode === 'fbmbilltype') {
			item.queryCondition = () => {
				return {
					GridRefActionExt: 'nccloud.web.fbm.fbm.sign.filter.GatherFbmbilltypeRefModelFilter'
				};
			};
		}

		if (item.attrcode === 'pk_signagrbank') { //承兑人{客商档案}
			item.checkStrictly = false;
			item.queryCondition = () => {
				return {
					pk_org: props.form.getFormItemsValue(CARD_FORM_CODE, 'pk_org').value,
					pk_group: props.form.getFormItemsValue(CARD_FORM_CODE, 'pk_group').value,
				};
			};

		}

		if (item.attrcode == 'hidepaybankacc') {
			item.checkStrictly = false;
			item.showHistory = true;
			item.queryCondition = () => {
				let hidepayunit = props.form.getFormItemsValue(CARD_FORM_CODE, 'hidepayunit');
				let pk_curr = props.form.getFormItemsValue(CARD_FORM_CODE, 'pk_curr');

				return {
					pk_cust: hidepayunit && hidepayunit.value,
					pk_curr: pk_curr && pk_curr.value,
					GridRefActionExt: 'nccloud.web.fbm.fbm.gather.filter.GatherBankAccFilter2Cust4NCC'
				};
			};
		}

		if (item.attrcode == 'hidereceivebankacc') {
			item.checkStrictly = false;
			item.showHistory = true;
			item.queryCondition = () => {
				let hidereceiveunit = props.form.getFormItemsValue(CARD_FORM_CODE, 'hidereceiveunit');
				let pk_curr = props.form.getFormItemsValue(CARD_FORM_CODE, 'pk_curr');
				return {
					pk_cust: hidereceiveunit && hidereceiveunit.value,
					pk_curr: pk_curr && pk_curr.value,
					GridRefActionExt: 'nccloud.web.fbm.fbm.gather.filter.GatherBankAccFilter2Cust4NCC'
				};
			};
		}

		// 出票人
		if (item.attrcode == "hidepayunit") {
			item.queryCondition = () => {
				return {
					pk_org: props.form.getFormItemsValue(CARD_FORM_CODE, 'pk_org').value,
					pk_group: props.form.getFormItemsValue(CARD_FORM_CODE, 'pk_group').value,
				};
			};
		}
		// 收款人
		if (item.attrcode == 'hidereceiveunit') {
			item.checkStrictly = false;
			item.showHistory = true;
			item.queryCondition = () => {
				return {
					pk_org: props.form.getFormItemsValue(CARD_FORM_CODE, 'pk_org').value,
					pk_group: props.form.getFormItemsValue(CARD_FORM_CODE, 'pk_group').value,
				};
			};
		}

		//出票人、收款人(文本)
		if (item.attrcode === 'payunit' || item.attrcode === 'receiveunit') {
			item.checkStrictly = false;
			item.showHistory = true;
			item.fieldDisplayed = 'refname';
			item.itemtype = 'refer';
			item.refcode = 'uapbd/refer/supplier/CustSupplierFlexGridTreeRef/index';
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(CARD_FORM_CODE, 'pk_org') && props.form.getFormItemsValue(CARD_FORM_CODE, 'pk_org').value;
				let pk_group = props.form.getFormItemsValue(CARD_FORM_CODE, 'pk_group') && props.form.getFormItemsValue(CARD_FORM_CODE, 'pk_group').value;
				return {
					pk_org: pk_org,
					pk_group: pk_group,
				};
			};
		}

		//出票人账户(文本)
		if (item.attrcode == 'paybankacc') {
			item.checkStrictly = false;
			item.showHistory = true;
			item.itemtype = 'refer';
			item.fieldDisplayed = 'refcode';
			item.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index';
			item.queryCondition = () => {
				let hidepayunit = props.form.getFormItemsValue(CARD_FORM_CODE, 'hidepayunit')
				let pk_curr = props.form.getFormItemsValue(CARD_FORM_CODE, 'pk_curr')
				return {
					pk_cust: hidepayunit && hidepayunit.value,
					pk_curr: pk_curr && pk_curr.value,
					GridRefActionExt: "nccloud.web.fbm.fbm.gather.filter.GatherBankAccFilter2Cust4NCC"
				};
			};
		}

		//收款人账户(文本)
		if (item.attrcode == 'receivebankacc') {
			item.checkStrictly = false;
			item.showHistory = true;
			item.itemtype = 'refer';
			item.fieldDisplayed = 'refcode';
			item.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index';
			item.queryCondition = () => {
				let hidereceiveunit = props.form.getFormItemsValue(CARD_FORM_CODE, 'hidereceiveunit')
				let pk_curr = props.form.getFormItemsValue(CARD_FORM_CODE, 'pk_curr')
				return {
					pk_cust: hidereceiveunit && hidereceiveunit.value,
					pk_curr: pk_curr && pk_curr.value,
					GridRefActionExt: "nccloud.web.fbm.fbm.gather.filter.GatherBankAccFilter2Cust4NCC"
				};
			};
		}

		//出票人开户银行、收款人开户银行(文本)
		if (item.attrcode === 'paybank' || item.attrcode === 'receivebank') {
			item.checkStrictly = false;
			item.showHistory = true;
			item.fieldDisplayed = 'refname';
			item.itemtype = 'refer';
			item.refcode = 'uapbd/refer/bankacc/BankDocDefaultGridTreeRef/index';
		}
	});

	// 电票网银信息
	meta[CARD_TABLE_CODE2].items.map((item) => {
		// 电票签约账号
		if (item.attrcode == 'receiveaccount') {
			item.showHistory = true;
			return (
				item.queryCondition = () => {
					let pk_org = props.form.getFormItemsValue(CARD_FORM_CODE, 'pk_org').value;
					return {
						isenableelecbill: 'Y',
						pk_org: pk_org, // 组织
						GridRefActionExt: 'nccloud.web.fbm.ref.filter.BankAccDefaultGridRefFilter'
					};
				}
			);
		}
	});
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/