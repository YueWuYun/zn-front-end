/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
/**
 * 背书办理卡片界面 模版初始化
 * @author：gaokung
 */
import { CARD, CARD_BTN } from '../../cons/constant.js';
import { afterEvent } from './index';
export default function() {
	let props = this.props;
	let appcode = props.getSearchParam('c') || props.getUrlParam('c');
	// 保存打印输出信息
	// this.setState({
	// 	printOutputInfo: {
	// 		//打印输出使用
	// 		funcode: appcode, //功能节点编码，即模板编码
	// 		nodekey: 'NCC36180ET'//模板节点标识
	// 	}
	// });
	props.createUIDom(
		{
			pagecode: CARD.pageCode, // 页面编码
			appcode: appcode // 应用编码
		},
		(data) => {
			let { button, template, context } = data;
			if (button) {
				props.button.setButtons(button);
				// 先设置所有按钮不可见
				let allBtn = [];
				for (let value in CARD_BTN) {
					allBtn.push(CARD_BTN[value]);
				}
				props.button.setButtonVisible(allBtn, false);
			}
			
			if (template) {
				let meta = modifierMeta.call(this, template, props);
				props.meta.setMeta(meta);
				let status = props.getUrlParam('status');
				if (status === 'browse') {
					// props.cardTable.setStatus(card_table_id, 'browse');
					let metaFromData = meta[CARD.formHeadCode];
					metaFromData.items.forEach((val) => {
						if(val.attrcode === 'pk_org'){
							val.visible = false;	
							val.disabled = true;
							return;
						}
						else if(val.attrcode === 'pk_org_v'){
							val.visible = true;
							val.disabled = true;
							return;
						}
						// 不需要控制 问题号：NCCLOUD-200550
						// if(val.attrcode === 'pk_outorg'){
						// 	val.visible = false;	
						// 	val.disabled = true;
						// 	return;
						// }
						// else if(val.attrcode === 'pk_outorg_v'){
						// 	val.visible = true;
						// 	val.disabled = true;
						// 	return;
						// }
						// if(val.attrcode === 'pk_outpayorg'){
						// 	val.visible = false;	
						// 	val.disabled = true;
						// 	return;
						// }
						// else if(val.attrcode === 'pk_outpayorg_v'){
						// 	val.visible = true;
						// 	val.disabled = true;
						// 	return;
						// }
					});
				} else {
					// props.cardTable.setStatus(card_table_id, 'edit');
					meta[CARD.formHeadCode].items.forEach((val) => {
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
						// 不需要控制 问题号：NCCLOUD-200550
						// if(val.attrcode === 'pk_outorg'){
						// 	val.visible = true;
						// 	val.disabled = false;
						// 	return;
						// }
						// else if(val.attrcode === 'pk_outorg_v'){
						// 	val.visible = false;
						// 	val.disabled = false;
						// 	return;
						// }
						// if(val.attrcode === 'pk_outpayorg'){
						// 	val.visible = true;
						// 	val.disabled = false;
						// 	return;
						// }
						// else if(val.attrcode === 'pk_outpayorg_v'){
						// 	val.visible = false;
						// 	val.disabled = false;
						// 	return;
						// }
					});
				}
			}
			if (data.context) {
				let context = data.context;
				// 保存默认的财务组织
				this.setState({
					curr_pk_org: context.pk_org,
					curr_orgname: context.org_Name,
					curr_pk_org_v: context.pk_org_v,
					curr_orgname_v: context.org_v_Name
				});
			}
			// this.setState({
			// 	isInitTemplate:true
			// })
			/**
			 * 有时componentDidMount会在本回调函数执行之前调用，
			 * 所以不能在componentDidMount处理画面显示，
			 * 必须等此函数结束，即模板配置加载完成后再处理画面显示
			 */
			this.setUIDisplay();
		}
	);
}
function modifierMeta(meta, props) {
	//参照过滤事件、全部抽象成请求，只是这是平台封装的
	let appcode = this.props.getUrlParam("c")||this.props.getSearchParam("c");
	meta[CARD.formHeadCode].items.map((item) => {
		//财务组织用户过滤
		if (item.attrcode == 'pk_org' ) {
			// item.showHistory = false;
			item.queryCondition = () => {
				return {
					funcode: appcode,
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				};
			};
		}
		if (item.attrcode == 'endorsee' ) {
			item.showHistory = true;
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(CARD.formHeadCode, 'pk_org' ) && props.form.getFormItemsValue(CARD.formHeadCode, 'pk_org' ).value;
				let pk_group = props.form.getFormItemsValue(CARD.formHeadCode, 'pk_group' ) && props.form.getFormItemsValue(CARD.formHeadCode, 'pk_group' ).value;
				return {
					pk_org:pk_org,
					unitPks: pk_org + ',' + pk_group,
					GridRefActionExt: 'nccloud.web.fbm.fbm.endore.filter.EndoreEndorseeFilter4NCC'
				};
			};
		}
		if (item.attrcode === 'pk_register') {
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(CARD.formHeadCode, 'pk_org').value;
				let busdate = props.form.getFormItemsValue(CARD.formHeadCode, 'busdate').value;
				let opbilltype = props.form.getFormItemsValue(CARD.formHeadCode, 'opbilltype') && props.form.getFormItemsValue(CARD.formHeadCode, 'opbilltype').value;
				return {
					pk_org: pk_org,
					opbilltype: opbilltype,
					busdate: busdate,
					GridRefActionExt: 'nccloud.web.fbm.fbm.endore.filter.EndoreRegisterFilter4NCC,nccloud.web.fbm.fbm.endore.filter.EndoreOpbilltypeBillnoRefFilter'
				};
			};
		}
		if (item.attrcode === 'endoreplanitem') {
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(CARD.formHeadCode, 'pk_org').value;
				return {
					pk_org: pk_org
				};
			};
		}		
		if (item.attrcode.indexOf("def") > -1) {
			//自定义档案按照组织或者集团过滤
			item.queryCondition = (p) => {
				let pk_org = props.form.getFormItemsValue(CARD.formHeadCode, 'pk_org' ) && props.form.getFormItemsValue(CARD.formHeadCode, 'pk_org' ).value;
				let pk_group = props.form.getFormItemsValue(CARD.formHeadCode, 'pk_group' ) && props.form.getFormItemsValue(CARD.formHeadCode, 'pk_group' ).value;
				return {
					pk_org: pk_org,
					pk_group: pk_group
				};
			}
		}
	});
	meta[CARD.onlineBankBillPoolCode].items.map((item) => {
		if (item.attrcode === 'endorebankacc') {
			item.showHistory = true;
			item.queryCondition = () => {
				return {
					isenableelecbill:'Y',
					pk_org: props.form.getFormItemsValue(CARD.formHeadCode, 'pk_org' ) && props.form.getFormItemsValue(CARD.formHeadCode, 'pk_org' ).value,
					GridRefActionExt: 'nccloud.web.fbm.ref.filter.BankAccDefaultGridRefFilter'
				};
			};
		}
		if (item.attrcode === 'endorseebankacc') {
			item.showHistory = true;
			item.refName_db = this.props.MutiInit.getIntl("36180ET") && this.props.MutiInit.getIntl("36180ET").get('36180ET-000064')/* 国际化处理： 客商银行账户*/;
			item.queryCondition = () => {
				return {
					accclass: this.state.CUS_SUP_TYPE,// 1=客户银行账户，2=客商银行账户，3=供应商银行账户
					pk_cust: props.form.getFormItemsValue(CARD.formHeadCode, 'endorsee') && props.form.getFormItemsValue(CARD.formHeadCode, 'endorsee').value,
				};
			};
		}
	});
	//清算信息
	meta[CARD.clearInfoCode].items.map(item => {
		if (item.attrcode === 'pk_outorg' || item.attrcode === 'pk_outpayorg' ) { //财务组织
			item.queryCondition = () => {
				return {
					funcode: this.props.getSearchParam('c'),//appcode获取
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				};
			};
		}
		if (item.attrcode === 'pk_outorg_inneracc' || item.attrcode === 'pk_outpayorg_inneracc' ) { //财务组织
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(CARD.formHeadCode,'pk_org')
				let pk_curr = props.form.getFormItemsValue(CARD.formHeadCode,'pk_curr')
				return {
					pk_org: pk_org && pk_org.value,
					pk_curr:pk_curr && pk_curr.value,	
					GridRefActionExt:"nccloud.web.fbm.ref.filter.OutorgInnerAccGridRefFilter"				
				};
			};
		}
	});	
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/