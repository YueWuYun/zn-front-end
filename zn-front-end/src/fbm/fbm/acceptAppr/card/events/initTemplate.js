/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import { setDefOrg2AdvanceSrchArea, setDefOrg2ListSrchArea } from "../../../../../tmpub/pub/util";
import { excelImportconfig,cardCache } from 'nc-lightapp-front';
import { CARD_PAGE_CODE,CARD_FORM_CODE, CARD_FORM_CODE2, CARD_FORM_CODE3 } from "./../../cons/const";
import { buttonVisiable,afterEvent } from "./index";
let { setDefData } =  cardCache


export function initTemplate(props,callback){
    
	let that = this;
	props.createUIDom(
		{
			pagecode: CARD_PAGE_CODE,//页面id
			appcode: this.appcode,//注册按钮的id
		},
		function (data) {
			if (data) {
				let status = props.getUrlParam('status');
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta(that, props, meta)
					props.meta.setMeta(meta);	
					
					if (status === 'browse') {
						// props.cardTable.setStatus(card_table_id, 'browse');
						let metaFromData = meta[CARD_FORM_CODE];
						metaFromData.items.forEach((val) => {
							if(val.attrcode === 'pk_org'){
								val.visible = true;	
								val.disabled = false;
								return;
							}
							else if(val.attrcode === 'pk_org_v'){
								val.visible = false;
								val.disabled = false;
								return;
							}
						});
					} else {
						// props.cardTable.setStatus(card_table_id, 'edit');
						meta[CARD_FORM_CODE].items.forEach((val) => {
							if(val.attrcode === 'pk_org'){
								val.visible = true;
								val.disabled = false;
								return;
							}
							else if(val.attrcode === 'pk_org_v'){
								val.visible = false;
								val.disabled = false;
								return;
							}
						});
					}

					if (status === 'add') {
						//单据有主组织，新增时,将其他字段设置为不可编辑.
						props.initMetaByPkorg(); 
						let metaFromData = meta[CARD_FORM_CODE];
						metaFromData.items.forEach((val) => {
							if(val.attrcode === 'pk_org'){
								// val.visible = true;
								val.disabled = false;
								return;
							}
						});
					}else if(status === 'copy'){
						let metaFromData = meta[CARD_FORM_CODE];
						metaFromData.items.forEach((val) => {
							if(val.attrcode === 'pk_org'){
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
						curr_orgname_v: context.org_v_Name,
					});
					if (status === 'add') {
						that.props.form.setFormItemsValue(CARD_FORM_CODE,
							{
								'pk_org':{
									value: context.pk_org,
									display: context.org_Name
								},
								'pk_org_v':{
									value: that.state.curr_pk_org_v,
									display: that.state.curr_orgname_v
								}
							}
						);
						if(context.pk_org){
							let	pk_org = {
								value: context.pk_org,
								display: context.org_Name
							};
							afterEvent.call(that,that.props, CARD_FORM_CODE, "pk_org", pk_org, null, null, null, null, true);
							// that.props.resMetaAfterPkorgEdit();
							// that.props.form.setFormItemsDisabled(CARD_FORM_CODE, { 'pk_org': false });
						}
					}
					//从列表跳转到卡片需要在这里判断一次代理付款信息页签是否显示
					let isagent = that.props.form.getFormItemsValue(CARD_FORM_CODE, "isagent") 
						&& that.props.form.getFormItemsValue(CARD_FORM_CODE, "isagent").value;
					afterEvent.call(that, that.props, CARD_FORM_CODE, "isagent", isagent, null, null, null, null, true);
				}
			}
		},
	)
}

function modifierMeta(that,props, meta){
    
	meta[CARD_FORM_CODE].items.map((item) => {

		//财务组织用户过滤
		if (item.attrcode == 'pk_org' ) {
			// item.showHistory = false;
			item.queryCondition = () => {
				return {
					funcode: props.appcode,
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				};
			};
		}
		//票据号码过滤
		if (item.attrcode == 'pk_register'){
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(CARD_FORM_CODE,'pk_org');
				let pk_register = props.form.getFormItemsValue(CARD_FORM_CODE,'pk_register');
				let initflag = props.form.getFormItemsValue(CARD_FORM_CODE,'initflag');
				let isagent = props.form.getFormItemsValue(CARD_FORM_CODE,'isagent');
				return {
					pk_register: pk_register && pk_register.value,
					pk_org: pk_org && pk_org.value,
					initflag: initflag && initflag.value,
					isagent: isagent && isagent.value,
					GridRefActionExt: "nccloud.web.fbm.fbm.accept.filter.AcceptPkRegisterFilter4NCC"
				};
			};
		}
		// //承兑计划项目
		// if (item.attrcode == 'acceptplanitem'){
		// 	debugger
		// 	item.queryCondition = () => {
		// 		return {
		// 			TreeRefActionExt: "nccloud.web.fbm.fbm.accept.filter.AcceptPlanItemFilter4NCC"
		// 		};
		// 	};
		// }
		//持票单位银行账户
		if (item.attrcode == 'holderacc'){
			item.queryCondition = () => {
				let holdunit = props.form.getFormItemsValue(CARD_FORM_CODE,'holdunit');
				let pk_register = props.form.getFormItemsValue(CARD_FORM_CODE,'pk_register');
				let pk_holderbank = props.form.getFormItemsValue(CARD_FORM_CODE,'pk_holderbank');
				let holderacc = props.form.getFormItemsValue(CARD_FORM_CODE,'holderacc');
				let pk_curr = props.form.getFormItemsValue(CARD_FORM_CODE,'pk_curr');
				return {
					pk_cust : holdunit && holdunit.value,
					pk_register: pk_register && pk_register.value,
					pk_holderbank: pk_holderbank && pk_holderbank.value,
					holderacc: holderacc && holderacc.value,
					pk_curr: pk_curr && pk_curr.value,
					GridRefActionExt: "nccloud.web.fbm.fbm.accept.filter.AcceptHolderAccFilter4NCC,nccloud.web.fbm.fbm.accept.filter.SecurityAccFilter4NCC"
				};
			};
		}
	});

	meta[CARD_FORM_CODE3].items.map((item) => {

		//返回保证金帐户
		if(item.attrcode == 'backsecaccount'){
			item.queryCondition = () => {
				let pk_curr = props.form.getFormItemsValue(CARD_FORM_CODE,'pk_curr');
				return {
					pk_curr: pk_curr && pk_curr.value,
					GridRefActionExt:"nccloud.web.fbm.fbm.accept.filter.BackSecAccFilter4NCC,nccloud.web.fbm.fbm.accept.filter.SecurityAccFilter4NCC"
				}
			}
		}
		
	});
    return meta;
}
/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/