/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { ajax, cardCache } from 'nc-lightapp-front';
import { constant, requesturl } from '../../config/config';
import { buttonVisible } from './buttonVisible.js';
import { commondata } from '../../../../public/utils/constant';
import { orgVersionUtil } from '../../config/orgVersionUtil';
import { hasDefaultOrg } from "../../../../../tmpub/pub/util/index";
import { editdiablefield, sourceflagtranslate } from '../../pubutil/cardfunction';
import { processHeadOlcRateEditable } from '../../pubutil/util';
let { getCacheById } = cardCache;
const pageId = constant.cpagecode;
const formId = constant.formcode1;
const formId2 = constant.formcode2;
const formId3 = constant.formcode3;
const formId4 = constant.formcode4;
export default function (props, json, inlt) {
	let that = this;
	props.createUIDom({
			pagecode: pageId, //页面id
			appid: constant.appregisterpk //注册按钮的id
		},
		function (data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					modifierMeta(props, meta);
					props.meta.setMeta(meta, () => {

						let flag=false;
						let status = props.getUrlParam('status');
						let src = props.getUrlParam('src');
						let pk = props.getUrlParam('id');
						let linksce = props.getUrlParam('scene');
						let data = { pk: pk, pageCode: pageId ,userJson:status };

						if (props.getUrlParam('status') == 'add') {
							// 判断是否存在默认业务单元
							if(!hasDefaultOrg(data)){
								// props.resMetaAfterPkorgEdit();
								props.resMetaAfterPkorgEdit();
								props.initMetaByPkorg(); //单据有主组织，新增时,将其他字段设置为不可编辑. 
							}
						}
						//组织之外的字段不可以编辑
						// if (status === 'add') {
						// 	this.props.resMetaAfterPkorgEdit();
						// 	this.props.initMetaByPkorg();//此方法不可以调用2次，不然rest失败
						// 	this.props.form.setFormItemsDisabled(formId, { 'pk_org': false });//财务组织
						// }
						if (status === 'edit') {
							props.resMetaAfterPkorgEdit();
						}
						if (status === 'copy') {
							props.resMetaAfterPkorgEdit();
						}

						if (status === 'add') {
							// that.setState({ billno: null,showNCbackBtn: false });
							that.props.BillHeadInfo.setBillHeadInfoVisible({
								showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
								showBillCode: false //控制显示单据号：true为显示,false为隐藏 ---非必传
							});

							props.form.EmptyAllFormValue(formId);
							let adddata = { pageCode: pageId };
							//可以调用后台
							ajax({
								url: requesturl.add,
								data: adddata,
								success: (res) => {
									//获取后台返回data				
									if (res.data) {
										props.form.setAllFormValue({ [formId]: res.data[formId] });
										let orgpk = res.data[formId].rows[0].values.pk_org.value;
										let olcrate = res.data[formId].rows[0].values.olcrate.value;
										let sourceflag = res.data[formId].rows[0].values.sourceflag.value;
										if(sourceflag){
											sourceflagtranslate.call(that,sourceflag);
										}
										if (olcrate) {
											props.form.setFormItemsDisabled(formId, {
												'olcrate': true
											});
										}
										if(orgpk){
											props.resMetaAfterPkorgEdit();
										}
									} else {
										props.form.setAllFormValue({ [formId]: { rows: [] } });
									}
								}
							});
							buttonVisible(props,null,null,null,null);
								//设置看片翻页的显隐性
							props.cardPagination.setCardPaginationVisible('cardPaginationBtn', flag);
						}

						//查询单据详情
						if (status === 'browse') {
							if(pk){
								let cardData,billstatus,isinner,balatypepk,settlesatus
								if(pk){
									cardData = getCacheById(pk, constant.cacheDataSource);
									let queryData =  { pk: pk, pageCode: pageId };
									if(cardData){
										props.form.setAllFormValue({ [formId]: cardData[formId] });
										let vbillno = cardData[formId].rows[0].values.vbillno.value;
										let billpk = cardData[formId].rows[0].values.pk_transformbill.value;
										billstatus = cardData[formId].rows[0].values.busistatus.value;
										isinner = cardData[formId].rows[0].values.isinner_pay.value;
										balatypepk = cardData[formId].rows[0].values.pk_balatype.value;
										settlesatus = cardData[formId].rows[0].values.settlesatus.value;

										let sourceflag = cardData[formId].rows[0].values.sourceflag.value;
										if(sourceflag){
											sourceflagtranslate.call(that,sourceflag);
										}

										buttonVisible(props, billstatus, balatypepk, isinner, settlesatus);
										props.form.setFormStatus(formId, 'browse');
										that.setState({ 
											// billno: ':'+vbillno,
											addid: billpk
											// showNCbackBtn: true
											});
											this.props.BillHeadInfo.setBillHeadInfoVisible({
												showBackBtn: true, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
												showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
												billCode: vbillno
											});
											
									}else{
										ajax({
											url: requesturl.querycard,
											data: queryData,
											async: false,
											success: (res) => {
												if (res) {
													if (res.data) {
														props.form.setAllFormValue({ [formId]: res.data[formId] });
														let billno = res.data[formId].rows[0].values.vbillno.value;
														let sourceflag = res.data[formId].rows[0].values.sourceflag.value;
														if(sourceflag){
															sourceflagtranslate.call(that,sourceflag);
														}
														let billid = res.data[formId].rows[0].values.pk_transformbill.value;
														billstatus = res.data[formId].rows[0].values.busistatus.value;
														isinner = res.data[formId].rows[0].values.isinner_pay.value;
														balatypepk = res.data[formId].rows[0].values.pk_balatype.value;
														settlesatus = res.data[formId].rows[0].values.settlesatus.value;
														that.setState({ 
															// billno: ':'+billno,
															addid: billid
															// showNCbackBtn: true
														});
														that.props.BillHeadInfo.setBillHeadInfoVisible({
															showBackBtn: true, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
															showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
															billCode: billno
														});
														props.form.setFormStatus(formId, 'browse');
														buttonVisible(props, billstatus, balatypepk, isinner, settlesatus);
													}else{
														that.emptyData();
													}
												} else {
													that.emptyData();
												}
											}
										});
									}
								}else{
									that.emptyData();
								}
								if(linksce){
									that.setState({ 
										showNCbackBtn: false
									});
									that.props.BillHeadInfo.setBillHeadInfoVisible({
										showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
										// showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
										// billCode: billno
									});
									props.cardPagination.setCardPaginationVisible('cardPaginationBtn', flag);
								}else{
									that.setState({ 
										showNCbackBtn: true
									});
									that.props.BillHeadInfo.setBillHeadInfoVisible({
										showBackBtn: true, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
										// showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
										// billCode: billno
									});
									props.cardPagination.setCardPaginationVisible('cardPaginationBtn', !flag);
								}
								// props.cardPagination.setCardPaginationVisible('cardPaginationBtn', !flag);
							}
						}
						//查询单据详情
						if (status === 'edit') {
							// that.setState({ showNCbackBtn: false });
							that.props.BillHeadInfo.setBillHeadInfoVisible({
								showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
								// showBillCode: false, //控制显示单据号：true为显示,false为隐藏 ---非必传
								// billCode: billno
							});
							ajax({
								url: requesturl.querycard,
								data: data,
								success: (res) => {
									if (res) {
										if (res.data) {
											props.form.setAllFormValue({ [formId]: res.data[formId] });
											let billno = res.data[formId].rows[0].values.vbillno.value;
											that.setState({ billno: ':'+billno });
											props.form.setFormItemsDisabled(formId,{'pk_org': true});
											let sourceflag = res.data[formId].rows[0].values.sourceflag.value;
											if(sourceflag){
												sourceflagtranslate.call(that,sourceflag);
											}
											let pk_srcbilltypecode = res.data[formId].rows[0].values.pk_srcbilltypecode.value;
											if(pk_srcbilltypecode){
												editdiablefield.call(that);
											}
											if(res.data.userjson){
												let userjson = JSON.parse(res.data.userjson);
												let {retExtParam} =userjson;
												//设置组织本币列编辑性
												processHeadOlcRateEditable(props, retExtParam);
											}
											that.disablemoney();
										}
									} else {
										props.form.setAllFormValue({ [formId]: { rows: [] } });
									}
								}
							});
							buttonVisible(props,null,null,null,null);
							//设置看片翻页的显隐性
							props.cardPagination.setCardPaginationVisible('cardPaginationBtn', flag);
						}

						if (status === 'copy') {
							// that.setState({ billno: null,showNCbackBtn: false });
							that.props.BillHeadInfo.setBillHeadInfoVisible({
								showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
								showBillCode: false, //控制显示单据号：true为显示,false为隐藏 ---非必传
								// billCode: billno
							});
							ajax({
								url: requesturl.copy,
								data: data,
								success: (res) => {
									if (res) {
										if (res.data) {
											props.form.setAllFormValue({ [formId]: res.data[formId] });
											props.form.setFormItemsDisabled(formId,{'pk_org': true});
											let sourceflag = res.data[formId].rows[0].values.sourceflag.value;
											if(sourceflag){
												sourceflagtranslate.call(that,sourceflag);
											}
											let pk_srcbilltypecode = res.data[formId].rows[0].values.pk_srcbilltypecode.value;
											if(pk_srcbilltypecode){
												editdiablefield.call(that);
											}
											if(res.data.userjson){
												let userjson = JSON.parse(res.data.userjson);
												let {retExtParam} =userjson;
												//设置组织本币列编辑性
												processHeadOlcRateEditable(props, retExtParam);
											}
											that.disablemoney();
										}
									} else {
										props.form.setAllFormValue({ [formId]: { rows: [] } });
									}
								}
							});
							buttonVisible(props,null,null,null,null);
							//设置看片翻页的显隐性
							props.cardPagination.setCardPaginationVisible('cardPaginationBtn', flag);
						}
					});
					orgVersionUtil.call(that, props, formId)//多版本视图显隐性
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button, () => {
						// buttonVisible(props);
					});
				}
			}
		}
	);
}

function modifierMeta(props, meta) {
	let status = props.getUrlParam('status');
	// meta[formId].status = status;
	if (status === 'copy') {
		meta[formId].status = 'edit';
	} else {
		meta[formId].status = status;
	}

	meta[formId].items.map((item) => {
		// 财务组织：根据用户权限过滤
		if (item.attrcode == 'pk_org') {
			item.queryCondition = () => {
				return {
					funcode: constant.appcode,
					TreeRefActionExt: commondata.financeOrgPermissionFilter //'nccloud.web.cmp.ref.CMPUserPermissionOrgBuilder'
				};
			};
		}
		else if(item.attrcode.startsWith('vdef')){
			item.queryCondition = () => {
				let dataObject = {
					model: props.form.getAllFormValue(formId),
					pageid: constant.cpagecode
				}
				let data = JSON.stringify(dataObject);
				return {
					pk_org: (props.form.getFormItemsValue(formId, 'pk_org') || {}).value,
					crossRuleConditionsVO: data,
					VOClassName: 'TransformBillVO',
					tradeType: '36S4',
					itemKey: item.attrcode,
					GridRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'//默认单据控制规则
				};
			};
		}
		
	});
	//财务组织:全加载
	meta[formId].items.find((e) => e.attrcode === 'pk_org').isTreelazyLoad = false;


	//参照过滤
	meta[formId2].items.map((item) => {

		//划出银行
		if (item.attrcode === 'transformoutbank') {
			item.queryCondition = () => {
				let pkorg = props.form.getFormItemsValue(formId, 'pk_org').value;
				return {
					pk_org: pkorg
				};
			};
		}

		//划出银行账户
		if (item.attrcode === 'transformoutaccount') {
			item.queryCondition = () => {
				debugger;
				let pkorg = props.form.getFormItemsValue(formId, 'pk_org').value;
				let transformoutbank = props.form.getFormItemsValue(formId, 'transformoutbank').value;
				let pk_currtype = props.form.getFormItemsValue(formId, 'pk_currtype').value;
				let bill_date = props.form.getFormItemsValue(formId, 'billdate').value;//单据日期，业务日期
				console.log("transformoutbank = "+transformoutbank);
				return { 
					pk_org: pkorg,
					bill_date:bill_date,
					pk_currtype: pk_currtype,
					pk_bankdoc: transformoutbank,
					isDisableDataShow: false,//默认只加载启用的账户
					noConditionOrg: 'N',
					refnodename: commondata.refnodename, //'使用权参照',
					GridRefActionExt: constant.bankaccsubref //  'nccloud.web.cmp.ref.CMPRecBillBankaccSubDefaultGridRefSqlBuilder'//自定义增加的过滤条件	
				};
			};
		}
		//划入银行
		if (item.attrcode === 'transforminbank') {
			item.queryCondition = () => {
				let pkorg = props.form.getFormItemsValue(formId, 'pk_org').value;
				return {
					pk_org: pkorg
				};
			};
		}
		//划入银行账户
		if (item.attrcode === 'transforminaccount') {
			item.queryCondition = () => {
				let pkorg = props.form.getFormItemsValue(formId, 'pk_org').value;
				let transforminbank = props.form.getFormItemsValue(formId, 'transforminbank').value;
				let pk_currtype = props.form.getFormItemsValue(formId, 'pk_currtype').value;
				let bill_date = props.form.getFormItemsValue(formId, 'billdate').value; //单据日期，业务日期

				return {
					pk_org: pkorg,
					pk_currtype: pk_currtype,
					bill_date: bill_date,
					pk_bankdoc: transforminbank,
					isDisableDataShow: false, //默认只加载启用的账户
					noConditionOrg: 'N',
					refnodename: commondata.refnodename,
					GridRefActionExt: constant.bankaccsubref // 'nccloud.web.cmp.ref.CMPRecBillBankaccSubDefaultGridRefSqlBuilder'//自定义增加的过滤条件	
				};
			};
		}

	});

	meta[formId2].items.find((e) => e.attrcode === 'transformoutbank').showHistory = false;
	meta[formId2].items.find((e) => e.attrcode === 'transformoutaccount').showHistory = false;
	meta[formId2].items.find((e) => e.attrcode === 'transforminbank').showHistory = false;
	meta[formId2].items.find((e) => e.attrcode === 'transforminaccount').showHistory = false;

	return meta;
}
/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/