/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import { setDefOrg2AdvanceSrchArea, setDefOrg2ListSrchArea } from "../../../../../tmpub/pub/util";
import { excelImportconfig, cardCache } from 'nc-lightapp-front';
import { CARD_PAGE_CODE, CARD_FORM_CODE, CARD_FORM_CODE8, CARD_FORM_CODE3 } from "./../../cons/const";
import { buttonVisiable, afterEvent } from "./index";
let { setDefData } = cardCache;
import {
	orgVersionView
} from "../../../../../tmpub/pub/util/version/index";


export function initTemplate(props, callback) {

	let that = this;
	props.createUIDom(
		{
			pagecode: CARD_PAGE_CODE,//页面id
			appcode: this.appcode,//注册按钮的id
		},
		function (data) {
			if (data) {
				let status = props.getUrlParam('status');
				//财务组织多版本实现
				orgVersionView(props, CARD_FORM_CODE);
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta(that, props, meta);
					props.meta.setMeta(meta);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					buttonVisiable.call(that, props);
					// props.button.setPopContent('delete_inner', props.MutiInit.getIntl("36320FDA") && props.MutiInit.getIntl("36320FDA").get('36320FDA--000063'));/* 国际化处理： 确认要删除该信息吗？*/

					// props.button.setUploadConfig("ImportData", excelimportconfig);
				}
				props.form.closeArea('36180BP_C01_form6');
				if (data.context) {
					let form = that.props.form;
					let context = data.context;
					that.setState({
						curr_pk_org: context.pk_org,
						curr_orgname: context.org_Name,
						curr_pk_org_v: context.pk_org_v,
						curr_orgname_v: context.org_v_Name,
					});
					if (status === 'add') {
						//新增时,将其他字段设置为不可编辑.
						props.initMetaByPkorg();
						form.setFormItemsValue(CARD_FORM_CODE,
							{
								'pk_org': {
									value: context.pk_org,
									display: context.org_Name
								},
								'pk_org_v': {
									value: that.state.curr_pk_org_v,
									display: that.state.curr_orgname_v
								}
							}
						);
						if (context.pk_org) {
							let pk_org = {
								value: context.pk_org,
								display: context.org_Name
							};
							afterEvent.call(that, that.props, CARD_FORM_CODE, "pk_org", pk_org, null, null, null, null, true);
							that.props.resMetaAfterPkorgEdit();
							form.setFormItemsDisabled(CARD_FORM_CODE, { 'pk_org': false });
						}
					}
					//从列表跳转到卡片需要在这里判断一次代理付款信息页签是否显示
					let isagent = form.getFormItemsValue(CARD_FORM_CODE, "isagent") && form.getFormItemsValue(CARD_FORM_CODE, "isagent").value;
					afterEvent.call(that, that.props, CARD_FORM_CODE, "isagent", isagent, null, null, null, null, true);
				}
			}
		},
	)
}

function modifierMeta(that, props, meta) {

	//表头
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
		if (item.attrcode.indexOf("def") > -1) {
			//自定义档案按照组织或者集团过滤
			item.queryCondition = p => {
				let pk_org = props.form.getFormItemsValue(CARD_FORM_CODE, "pk_org").value;
				let pk_group = props.form.getFormItemsValue(CARD_FORM_CODE, "pk_group").value;
				return {
					pk_org: pk_org,
					pk_group: pk_group
				};
			};
		}
		//票据号码过滤
		if (item.attrcode == 'pk_register') {
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(CARD_FORM_CODE, 'pk_org');
				let initflag = props.form.getFormItemsValue(CARD_FORM_CODE, 'initflag');
				let isagent = props.form.getFormItemsValue(CARD_FORM_CODE, 'isagent');
				let pk_accept = props.form.getFormItemsValue(CARD_FORM_CODE, 'pk_accept');
				return {
					pk_org: pk_org && pk_org.value,
					initflag: initflag && initflag.value,
					isagent: isagent && isagent.value,
					pk_accept: pk_accept && pk_accept.value,
					GridRefActionExt: "nccloud.web.fbm.fbm.accept.filter.AcceptPkRegisterFilter4NCC"
				};
			};
		}
		//持票单位  客商参照需要传pk_org和pk_group
		if (item.attrcode == 'holdunit') {
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(CARD_FORM_CODE, 'pk_org');
				let pk_group = props.form.getFormItemsValue(CARD_FORM_CODE, 'pk_group');
				return {
					pk_org: pk_org && pk_org.value,
					pk_group: pk_group && pk_group.value
				};
			};
		}
		//承兑计划项目
		if (item.attrcode == 'acceptplanitem') {
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(CARD_FORM_CODE, 'pk_org');
				return {
					pk_org: pk_org && pk_org.value
				};
			};
		}
		//持票单位银行账户
		if (item.attrcode == 'holderacc') {
			item.fieldDisplayed = "refcode";
			item.showHistory = true;
			item.queryCondition = () => {
				let holdunit = props.form.getFormItemsValue(CARD_FORM_CODE, 'holdunit');
				let pk_register = props.form.getFormItemsValue(CARD_FORM_CODE, 'pk_register');
				let pk_holderbank = props.form.getFormItemsValue(CARD_FORM_CODE, 'pk_holderbank');
				let holderacc = props.form.getFormItemsValue(CARD_FORM_CODE, 'holderacc');
				let pk_curr = props.form.getFormItemsValue(CARD_FORM_CODE, 'pk_curr');
				return {
					pk_cust: holdunit && holdunit.value,
					pk_register: pk_register && pk_register.value,
					pk_holderbank: pk_holderbank && pk_holderbank.value,
					holderacc: holderacc && holderacc.value,
					pk_curr: pk_curr && pk_curr.value,
					GridRefActionExt: "nccloud.web.fbm.fbm.accept.filter.AcceptHolderAccFilter4NCC"
				};
			};
		}
	});

	//保证金页签
	meta[CARD_FORM_CODE3].items.map((item) => {

		//返回保证金帐户
		if (item.attrcode == 'backsecaccount') {
			item.showHistory = true;
			item.queryCondition = () => {
				let pk_curr = props.form.getFormItemsValue(CARD_FORM_CODE, 'pk_curr');
				let pk_org = props.form.getFormItemsValue(CARD_FORM_CODE, 'pk_org');
				return {
					pk_org: pk_org && pk_org.value, //组织
					pk_curr: pk_curr && pk_curr.value,
					GridRefActionExt: "nccloud.web.fbm.fbm.accept.filter.BackSecAccFilter4NCC"
				}
			}
		}
	});

	//代理开票信息页签
	meta[CARD_FORM_CODE8].items.map((item) => {
		//内部结算账户
		if (item.attrcode == 'pk_inbalaacc') {
			item.queryCondition = () => {
				let pk_curr = props.form.getFormItemsValue(CARD_FORM_CODE, 'pk_curr');
				let pk_usebillorg = props.form.getFormItemsValue(CARD_FORM_CODE, 'pk_usebillorg');
				let pk_payfundorg = props.form.getFormItemsValue(CARD_FORM_CODE, 'pk_payfundorg');
				return {
					pk_curr: pk_curr && pk_curr.value,
					pk_usebillorg: pk_usebillorg && pk_usebillorg.value,
					pk_payfundorg: pk_payfundorg && pk_payfundorg.value,
					GridRefActionExt: "nccloud.web.fbm.fbm.accept.filter.AcceptInBalaAccFilter4NCC"
				}
			}
		}
		//传出内部清算户
		if (item.attrcode == 'pk_outreckonacc') {
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(CARD_FORM_CODE, 'pk_org');
				let pk_outfundorg = props.form.getFormItemsValue(CARD_FORM_CODE, 'pk_outfundorg');
				let pk_currtype = props.form.getFormItemsValue(CARD_FORM_CODE,'pk_curr');
				return {
					pk_org: pk_org && pk_org.value,
					pk_outfundorg: pk_outfundorg && pk_outfundorg.value,
					pk_currtype:pk_currtype && pk_currtype.value,
					GridRefActionExt: "nccloud.web.fbm.fbm.accept.filter.AcceptInnerReckonAccFilter4NCC"
				}
			}
		}
		//传出资金组织
		if (item.attrcode == 'pk_outfundorg') {
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(CARD_FORM_CODE, 'pk_org');
				let pk_group = props.form.getFormItemsValue(CARD_FORM_CODE, 'pk_group');
				return {
					pk_org: pk_org && pk_org.value,
					pk_group: pk_group && pk_group.value,
					TreeRefActionExt: "nccloud.web.fbm.fbm.accept.filter.AcceptPayFundOrgFilter4NCC"
				}
			}
		}
	})
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/