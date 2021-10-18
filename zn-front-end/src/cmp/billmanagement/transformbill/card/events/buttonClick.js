/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import {
	ajax,
	base,
	toast,
	NCMessage,
	cacheTools,
	cardCache,
	getBusinessInfo,
	print,
	promptBox,
	output
} from 'nc-lightapp-front';
const businessInfo = getBusinessInfo();
import { constant, requesturl, cons, viewmode} from '../../config/config';
import { SHOWMODEL_BULU, SHOWMODEL_ZHIFU, commondata } from '../../../../public/utils/constant';
import Sign from '../../../../../tmpub/pub/util/ca';
import { saveBtn, saveaddBtn, savesubmitBtn } from '../btnClicks/btnClick';
import { checkinput } from '../checkinput/checkinput';
import { MakeBillApp } from '../../../../../tmpub/pub/util/Makebill'; // 制单制证
import { linkVoucherApp } from '../../../../../tmpub/pub/util/LinkUtil'; // 联查凭证
import { imageScan, imageView } from 'sscrp/rppub/components/image';
import { saveCommit } from '../../../../../tmpub/pub/util';
import { buttonVisible } from '../events/buttonVisible'
import { orgVersionView } from "../../../../../tmpub/pub/util/version";
import { CMPEableSscivm } from '../../../../pub/utils/CMPIVPara';//税务参数查询

//加载小应用API
//import api from "./api/index";

let { getCacheById, updateCache, addCache, getCurrentLastId, getNextId, deleteCacheById } = cardCache;
export default async function(props, id) {
	const formcode1 = constant.formcode1;
	const cpagecode = constant.cpagecode;
	const appcode = constant.appcode;
	const cardpath = constant.cardpath;
	// 联查src
	const linksrc = constant.linksrc;
	// 单据类型
	const billtype = constant.billtype;
	// 打印
	const printfuncode = constant.printfuncode;
	const printnodekey = constant.printnodekey;
	const printtemplateid = constant.printtemplateid;
	const iweb = commondata.iweb;
	let that = this;
	// 提交、收回、结算、取消结算公共请求参数
	let requestdata = {
		pageCode: constant.cpagecode,
		pk: this.props.form.getFormItemsValue(this.formId, 'pk_transformbill').value,
		ts: this.props.form.getFormItemsValue(this.formId, 'ts').value
	};
	// 对数据进行签名加密
	async function signdata(signdata,head) {
		if(!head){
			head = 'head';
		}
		let ressigndata = await Sign({
			isSign: true,
			isKey: false,
			data: signdata,
			encryptVOClassName: constant.encryptVOClassName,
			head
		});
		if (ressigndata.isStop) {
			return;
		}
		return ressigndata.data;
	}
	
	
	// 输入密钥
	async function ca_iskey() {
		let ressigndata = await Sign({
			isSign: false,
			isKey: true,
			data: null,
			encryptVOClassName: null
			// head: 'form'
		});
		if (ressigndata.isStop) {
			return;
		}
	}
	// 组装验证公式请求数据
	function savevalidateData() {
		let billdata = props.form.getAllFormValue(formcode1);
		let validateData = {
			pageid: cpagecode,
			model: {
				areacode: constant.formcode1,
				rows: billdata.rows,
				areaType: 'form'
			}
		};
		return validateData;
	}
	switch (id) {
		// 新增
		case 'addBtn':
			props.pushTo(cardpath, {
				pagecode: constant.cpagecode,
				status: 'add',
				addid: this.state.addid
			});
			this.renderHtmlByStatus();
			break;
		// 修改
		case 'editBtn':
			let editid = props.getUrlParam('id');
			if (editid) {
				editid = this.props.form.getFormItemsValue(this.formId, 'pk_transformbill').value;
			}
			let querydata = {
				pk: editid
			};
			ajax({
				url: requesturl.editpermission,
				data: querydata,
				success: (res) => {
					if (res.success) {
						props.pushTo(cardpath, {
							pagecode: constant.cpagecode,
							status: 'edit',
							id: editid
						});
						this.renderHtmlByStatus();
					}
				}
			});
			break;
		// 复制
		case 'copyBtn':
			props.pushTo(cardpath, {
				pagecode: constant.cpagecode,
				status: 'copy',
				id: props.getUrlParam('id')
			});
			this.renderHtmlByStatus();
			break;
		// 删除
		case 'deleteBtn':
			promptBox({
				color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
				title: this.state.json['36070TBR-000013'], // 弹框表头信息/* 国际化处理： 确认删除*/
				content: this.state.json['36070TBR-000014'], //this.modalContent(), //弹框内容，可以是字符串或dom/* 国际化处理： 确认删除所选数据吗?*/
				// noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
				// noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
				// beSureBtnName: "确定",          // 确定按钮名称, 默认为"确定",非必输
				// cancelBtnName: "取消",         // 取消按钮名称, 默认为"取消",非必输
				// hasCloseBtn:false,             //显示“X”按钮，默认不显示，不显示是false，显示是true
				beSureBtnClick: this.delConfirm.bind(this) // 确定按钮点击调用函数,非必输
				// cancelBtnClick: functionCancel,  // 取消按钮点击调用函数,非必输
				// closeBtnClick:functionClose, //关闭按钮点击调用函数，非必输
				// closeByClickBackDrop:false,//点击遮罩关闭提示框，默认是false点击不关闭,点击关闭是true
			});
			break;
		// 保存
		case 'saveBtn':
			let savedata = props.createFormAfterEventData(this.pageId, this.formId);
			let flag = props.form.isCheckNow(this.formId);
			if (flag) {
				if (checkinput.call(this, props)) {
					// ca签名
					savedata = await signdata(savedata,'form');
					if (savedata) {
						savedata.form.userjson = savedata.userjson;
						let savevalidatedata = savevalidateData();
						let saveobj = {};
						saveobj[formcode1] = 'form';
						props.validateToSave(savevalidatedata, saveBtn.bind(this, props, savedata), saveobj, '');
					}
				}
			}
			break;
		// 保存新增
		case 'saveaddBtn':
			let saveadddata = props.createFormAfterEventData(this.pageId, this.formId);
			let flag2 = props.form.isCheckNow(this.formId);
			if (flag2) {
				if (checkinput.call(this, props)) {
					// 签名ca
					saveadddata = await signdata(saveadddata,'form');
					if (saveadddata) {
						let saveaddvalidatedata = savevalidateData();
						saveadddata.form.userjson = saveadddata.userjson;
						let saveobj = {};
						saveobj[formcode1] = 'form';
						props.validateToSave(
							saveaddvalidatedata,
							saveaddBtn.bind(this, props, saveadddata),
							saveobj,
							''
						);
					}
				}
			}
			break;
		// 	//保存提交
		// case 'savesubmitBtn':
		// 	let savesubmitdata = props.createFormAfterEventData(this.pageId, this.formId);
		// 	let subflag = props.form.isCheckNow(this.formId);
		// 	if (subflag) {
		// 		if (checkinput.call(this, props)) {
		// 			// 签名ca
		// 			savesubmitdata = await signdata(savesubmitdata);
		// 			if (savesubmitdata) {
		// 				savesubmitdata.form.userjson = savesubmitdata.userjson;
		// 				let savesubmitvalidatedata = savevalidateData();
		// 				let saveobj = {};
		// 				saveobj[formcode1] = 'form';
		// 				props.validateToSave(savesubmitvalidatedata, savesubmitBtn.bind(this, props, savesubmitdata), saveobj, '');
		// 			}
		// 		}
		// 	}
		// 	break;

		//lidyu   微服务改造修改保存提交逻辑
		//保存提交
		case 'savesubmitBtn':			
			savecommit.call(this, props,null,signdata.bind(this));			
			break;
		// 提交
		case 'submitBtn':
			ajax({
				url: requesturl.commitcard,
				data: requestdata,
				success: (res) => {
					let { data } = res;
					if (res.success) {
						if (data) {
							let { appointmap } = data;
							if (appointmap) {
								if (
									appointmap.workflow &&
									(appointmap.workflow == 'approveflow' || appointmap.workflow == 'workflow')
								) {
									this.setState({
										compositedata: appointmap,
										compositedisplay: true
									});
								}
							} else {
								this.cacheUpdate(res.data.form);
								toast({
									color: 'success',
									content: this.state.json['36070TBR-000002'] /* 国际化处理： 提交成功*/
								});
							}
						}
					}
				}
			});
			break;
		// 收回
		case 'unsubmitBtn':
			ajax({
				url: requesturl.uncommitcard,
				data: requestdata,
				success: (res) => {
					if (res.success) {
						this.cacheUpdate(res.data);
						toast({
							color: 'success',
							content: this.state.json['36070TBR-000003'] /* 国际化处理： 收回成功*/
						});
					}
				}
			});
			break;
		// 返回
		case 'backBtn':
			props.pushTo(constant.listpath, { pagecode: constant.lpagecode });
			break;
		// 取消
		case 'cancelBtn':
			promptBox({
				color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
				title: this.state.json['36070TBR-000019'], // 弹框表头信息/* 国际化处理： 确认取消*/
				content: this.state.json['36070TBR-000020'], //this.modalContent(), //弹框内容，可以是字符串或dom/* 国际化处理： 确认是否取消?*/
				// noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
				// noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
				// beSureBtnName: "确定",          // 确定按钮名称, 默认为"确定",非必输
				// cancelBtnName: "取消",         // 取消按钮名称, 默认为"取消",非必输
				// hasCloseBtn:false,             //显示“X”按钮，默认不显示，不显示是false，显示是true
				beSureBtnClick: this.cancelModalBeSure.bind(this), // 确定按钮点击调用函数,非必输
				cancelBtnClick: this.cancelModalCancel.bind(this) // 取消按钮点击调用函数,非必输
				// closeBtnClick:functionClose, //关闭按钮点击调用函数，非必输
				// closeByClickBackDrop:false,//点击遮罩关闭提示框，默认是false点击不关闭,点击关闭是true
			});
			break;
		// 结算
		case 'settleBtn':
			ajax({
				url: requesturl.settlecard,
				data: requestdata,
				success: (res) => {
					if (res.success) {
						this.cacheUpdate(res.data);
						toast({
							color: 'success',
							content: this.state.json['36070TBR-000004'] /* 国际化处理： 结算成功*/
						});
					}
				}
			});
			break;
		// 取消结算
		case 'unsettleBtn':
			ajax({
				url: requesturl.unsettlecard,
				data: requestdata,
				success: (res) => {
					if (res.success) {
						this.cacheUpdate(res.data);
						toast({
							color: 'success',
							content: this.state.json['36070TBR-000005'] /* 国际化处理： 取消结算成功*/
						});
					}
				}
			});
			break;
		// 委托办理
		case 'entrustBtn':
			// 签名
			let ressigndata = await Sign({
				data: null,
				encryptVOClassName: null,
				isSign: false,
				isKey: true
			});
			if (ressigndata.isStop) {
				return;
			}
			ajax({
				url: requesturl.transferftscard,
				data: requestdata,
				success: (res) => {
					if (res.success) {
						this.cacheUpdate(res.data);
						toast({
							color: 'success',
							content: this.state.json['36070TBR-000006'] /* 国际化处理： 委托办理成功*/
						});
					}
				}
			});
			break;
		// 取消委托办理
		case 'unentrustBtn':
			ajax({
				url: requesturl.untransferftscard,
				data: requestdata,
				success: (res) => {
					if (res.success) {
						this.cacheUpdate(res.data);
						toast({
							color: 'success',
							content: this.state.json['36070TBR-000007'] /* 国际化处理： 取消委托办理成功*/
						});
					}
				}
			});
			break;
		// 红冲
		case 'redhandleBtn':
			ajax({
				url: requesturl.redhandlecard,
				data: requestdata,
				success: (res) => {
					if (res.success) {
						this.cacheUpdate(res.data);
						toast({
							color: 'success',
							content:
								that.props.MutiInit.getIntl('36070TBR') &&
								this.props.MutiInit.getIntl('36070TBR').get('36070TBR-000008') /* 国际化处理： 红冲成功*/
						});
					}
				}
			});
			break;
		// 联查单据
		case 'querybillBtn':
			let pk_transformbill = props.form.getFormItemsValue(this.formId, 'pk_transformbill').value;
			let pk_srcbilltypecode = props.form.getFormItemsValue(this.formId, 'pk_srcbilltypecode').value;
			if(pk_srcbilltypecode && pk_srcbilltypecode == '36S3'){
				toast({
					color: 'warning',
					content: this.state.json['36070TBR-000084'] /* 国际化处理： 到账通知不支持单据追溯!*/
				});
				return;
			}
			//处理选择数据
			this.setState({
				billId: pk_transformbill, //单据id
				billtrackshow: !this.state.billtrackshow
			});
			break;
		// 联查划入账户余额
		case 'inaccbalanceBtn':
			let inaccbalanceArr = [];
			let inpk_org = props.form.getFormItemsValue(this.formId, 'pk_org').value;
			let transforminaccount = props.form.getFormItemsValue(this.formId, 'transforminaccount').value;
			let inaccbalancedata = {
				pk_org: inpk_org, //财务组织id
				pk_account: transforminaccount, //银行账户id，没有可不写，和现金账户二选一
				pk_cashaccount: null //现金账户id，没有可不写
			};
			inaccbalanceArr.push(inaccbalancedata);
			this.setState({
				showOriginalData: inaccbalanceArr,
				showOriginal: true
			});
			break;
		// 联查划出账户余额
		case 'outaccbalanceBtn':
			let outaccbalanceArr = [];
			let pk_orgo = props.form.getFormItemsValue(this.formId, 'pk_org').value;
			let transformoutaccount = props.form.getFormItemsValue(this.formId, 'transformoutaccount').value;
			let outaccbalancedata = {
				pk_org: pk_orgo, //财务组织id
				pk_account: transformoutaccount, //银行账户id，没有可不写，和现金账户二选一
				pk_cashaccount: null //现金账户id，没有可不写
			};
			outaccbalanceArr.push(outaccbalancedata); //现金账户
			this.setState({
				showOriginalData: outaccbalanceArr,
				showOriginal: true
			});
			break;
		// 联查凭证
		case 'voucherBtn':
			// 获取单据id
			let pk_transformbillv = props.form.getFormItemsValue(this.formId, 'pk_transformbill').value;
			let vbillnov = props.form.getFormItemsValue(this.formId, 'vbillno').value;
			let pk_groupv = props.form.getFormItemsValue(this.formId, 'pk_group').value;
			let pk_orgv = props.form.getFormItemsValue(this.formId, 'pk_org').value;
			linkVoucherApp(this.props, pk_transformbillv, pk_groupv, pk_orgv, billtype, vbillnov);
			break;
		// 联查审批详情
		case 'approveopinionBtn':
			let pk_transformbilla = props.form.getFormItemsValue(this.formId, 'pk_transformbill').value;
			this.setState({
				billId: pk_transformbilla, //单据id
				approveshow: !this.state.approveshow
			});
			break;

		// 联查支付确认单
		case 'payconfirmBtn':
			let payconfirm_pk_tfb = props.form.getFormItemsValue(this.formId, 'pk_transformbill').value;
			props.openTo(commondata.confirmpay_path, {
				appcode: commondata.confirmpay_appcode,
				pagecode: commondata.confirmpay_pagecode,
				yurrefs: payconfirm_pk_tfb,
				id: payconfirm_pk_tfb,
				type: commondata.link
			});
			break;
		// 制单
		case 'makebillBtn':
			//处理选择数据
			let pk_transformbillmb = props.form.getFormItemsValue(this.formId, 'pk_transformbill').value;
			MakeBillApp(this.props, constant.appcode, pk_transformbillmb, billtype);
			break;
		// 附件
		case 'enclosureBtn':
			let pk_transformbille = props.form.getFormItemsValue(this.formId, 'pk_transformbill').value;
			let vbillnoe = props.form.getFormItemsValue(this.formId, 'vbillno').value;
			this.setState({
				billId: pk_transformbille, //单据id
				billno: vbillnoe, // 单据编号
				showUploader: !this.state.showUploader,
				target: null
			});
			break;
		// 打印
		case 'printBtn':
			print(
				'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
				requesturl.print,
				{
					// billtype: billtype, //单据类型
					// funcode: printfuncode, //功能节点编码，即模板编码
					appcode: appcode, //
					nodekey: printnodekey, //模板节点标识
					oids: [ this.props.form.getFormItemsValue(this.formId, 'pk_transformbill').value ]
				}
			);
			break;
		// 输出
		case 'outputBtn':
			output({
				url: requesturl.print,
				data: {
					nodekey: printnodekey,
					appcode: appcode,
					oids: [ this.props.form.getFormItemsValue(this.formId, 'pk_transformbill').value ],
					outputType: 'output'
				}
			});
			break;
		//影像查看
		case 'imgreviewBtn':
			if(CMPEableSscivm.call(this)){
				return ;
			};		
			let imgreviewdata = props.form.getAllFormValue(formcode1);
			// let openShowbillid = imgreviewdata.rows[0].values.pk_transformbill.value; //单据pk(billid)
			var billInfoMap = {};
			billInfoMap.pk_billid = imgreviewdata.rows[0].values.pk_transformbill.value;
			billInfoMap.pk_billtype = imgreviewdata.rows[0].values.pk_billtypecode.value;
			billInfoMap.pk_tradetype = imgreviewdata.rows[0].values.pk_billtypecode.value;
			billInfoMap.pk_org = imgreviewdata.rows[0].values.pk_org.value;
			imageView(billInfoMap, iweb);
			break;
		//影像扫描
		case 'imgscanBtn':
			if(CMPEableSscivm.call(this)){
				return ;
			};		
			let imgscandata = props.form.getAllFormValue(formcode1);
			// let openbillid = imgreviewdata.rows[0].values.pk_transformbill.value; //单据pk(billid)
			var billInfoMap = {};
			billInfoMap.pk_billid = imgscandata.rows[0].values.pk_transformbill.value;
			billInfoMap.pk_billtype = imgscandata.rows[0].values.pk_billtypecode.value;
			billInfoMap.pk_tradetype = imgscandata.rows[0].values.pk_billtypecode.value;
			billInfoMap.pk_org = imgscandata.rows[0].values.pk_org.value;
			billInfoMap.BillType = imgscandata.rows[0].values.pk_billtypecode.value;
			billInfoMap.BillDate = imgscandata.rows[0].values.creationtime.value;
			billInfoMap.Busi_Serial_No = imgscandata.rows[0].values.pk_transformbill.value; //.pk_mtapp_bill.value;
			// billInfoMap.pk_billtype = imgscandata.rows[0].values.pk_billtypeid.value; //pk_billtype.value;
			billInfoMap.OrgNo = imgscandata.rows[0].values.pk_org.value; //pk_org.value;
			billInfoMap.BillCode = imgscandata.rows[0].values.vbillno.value; //vbillno.value;
			billInfoMap.OrgName = imgscandata.rows[0].values.pk_org.display; //pk_org.display;
			billInfoMap.Cash = imgscandata.rows[0].values.amount.value; //orig_amount.value;
			imageScan(billInfoMap, iweb);
			break;
		// 网银补录信息
		case 'cyberbankeditBtn':
			this.setState({
				modelType: SHOWMODEL_BULU
			});
			ajax({
				url: requesturl.netbankedit,
				data: requestdata,
				success: (res) => {
					let { success, data } = res;
					if (success) {
						if (data) {
							that.setState(
								{
									onLineData: data || [],
									SHOWMODEL_BULU
								},
								() => {
									that.setState({
										showBuLu: true
									});
								}
							);
						}
					}
				}
			});
			break;
		// 网上付款
		case 'onlinepaymentBtn':
			this.setState({
				modelType: SHOWMODEL_ZHIFU
			});
			ajax({
				url: requesturl.onlinepayquery,
				data: requestdata,
				success: (res) => {
					let { success, data } = res;
					if (success) {
						if (data) {
							if (data.eabnksvos.length != 0) {
								that.setState(
									{
										onLineData: data.eabnksvos || [],
										SHOWMODEL_ZHIFU
									},
									() => {
										that.setState({
											showBuLu: true
										});
									}
								);
							}
							if (data.failMsg.length != 0) {
								toast({
									color: 'warning',
									content: data.failMsg[0]
								});
							}
						}
					}
				}
			});
			break;
		// 更新网银支付状态
		case 'updatecyberbankheadBtn':
			let dataArr10 = [];
			let pk_transformbillmu = props.form.getFormItemsValue(this.formId, 'pk_transformbill').value;
			//处理选择数据
			dataArr10.push(pk_transformbillmu); //主键数组
			//自定义请求数据
			let data10 = {
				pks: dataArr10
			};
			ajax({
				url: requesturl.updatenetbank,
				data: data10,
				success: (res) => {
					let { success } = res;
					if (success) {
						toast({
							color: 'success',
							content: this.state.json['36070TBR-000039'] /* 国际化处理： 更新网银支付成功*/
						});
					}
				}
			});
			break;
		// 刷新
		case 'refreshBtn':
			let transformbillpk = props.form.getFormItemsValue(this.formId, 'pk_transformbill').value;
			let data = {
				pk: transformbillpk,
				pageCode: constant.cpagecode
			};
			ajax({
				url: requesturl.querycard,
				data: data,
				success: (res) => {
					if (res) {
						if (res.data) {
							this.props.form.setAllFormValue({
								[this.formId]: res.data[this.formId]
							});
							let billno = res.data[this.formId].rows[0].values.vbillno.value;
							this.props.BillHeadInfo.setBillHeadInfoVisible({
								// showBackBtn: true, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
								showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
								billCode: billno
							});
							this.cacheUpdate(res.data);
						}
					} else {
						this.props.form.setAllFormValue({
							[this.formId]: {
								rows: []
							}
						});
					}
				}
			});
			break;
		default:
			break;
	}
}

export const savecommit = function(props, assign, processSaveData) {
	saveCommit(props, {
		//页面编码
		pageCode: constant.cpagecode,
		//表头区域编码
		headCode: constant.formcode1,
		//表体区域编码（多表体传数组，没有表体不传）
		bodyCode: null,
		//请求url
		url: requesturl.savesubmit,
		//指派信息
		assign,
		//展示指派框的逻辑
		showAssignFunc: (res) => {
			let { data } = res;
			let { workflow } = data;
			if ((workflow && workflow == 'approveflow') || workflow == 'workflow') {
				this.setState({
					assignData: data,
					assignShow: true,
					assignType: constant.assignType.savecommit
				});
			}
		},
		//更新界面数据的逻辑
		updateViewFunc: (res) => {
			saveUpdateView(props, res, () => {
				toast({
					color: 'success',
					content: this.state.json['36070TBR-000002'] /* 国际化处理： 提交成功！*/
				});
			});
		},
		saveValidate:false,
		processSaveData
	});
};
/**保存动作更新界面数据 */
const saveUpdateView = function(props, res, callback) {
	//界面状态
	let status = props.getUrlParam('status');
	let { data } = res;
	let { head, body } = data;
	if (!head) {
		return;
	}
	//更新表头数据
	props.form.setAllFormValue({ [constant.formcode1]: head[constant.formcode1] });
	//更新表体(兼顾差异化和非差异化)
	if (body) {
		body = updateBody(props, body);
		if (body) {
			data.body = body;
		}
	}
	let pk = head[constant.formcode1].rows[0].values[constant.pk].value;
	let billstatus= head[constant.formcode1].rows[0].values[constant.busistatus].value;
	let settlestatus=head[constant.formcode1].rows[0].values[constant.settlesatus].value;
	let pk_batatypepk=head[constant.formcode1].rows[0].values[constant.pk_balatype].value;
	let isinner=head[constant.formcode1].rows[0].values[constant.isinner_pay].value;

	//新增时，向缓存中追加数据
	if (viewmode.add == status) {
		cardCache.addCache(pk, data, constant.formcode1, constant.cacheDataSource);
	} else {
		//其余更新缓存中的数据
		cardCache.updateCache(constant.pk, pk, data, constant.formcode1, constant.cacheDataSource);
	}

	props.setUrlParam({ status: 'browse'}); 
	//刷新界面
	repaintView(props,billstatus,settlestatus,pk_batatypepk,isinner);
	//repaintView(props, viewmode.browse, { id: pk });

	//执行回调
	if (callback && typeof callback == 'function') {
		callback();
	} else {
		toast({ color: 'success', content: this.state.json['36070TBR-000000'] }); /* 国际化处理： 保存成功！*/
	}
};
/**
 * 更新表体，兼容差异化处理
 * @param {*} props 
 * @param {*} body 
 */
export const updateBody = function (props, body) {
    //rowid存在则按照差异化处理
    if (body[constant.formcode5] && body[constant.formcode5].rows && body[constant.formcode5].rows[0] && body[constant.formcode5].rows[0].rowid) {
        body[constant.formcode5] = props.cardTable.updateDataByRowId(constant.formcode5, body[constant.formcode5]);
    }
    //否则直接更新表体
    else {
        props.cardTable.setTableData(constant.formcode5, body[constant.formcode5]);
    }
    return body;
}
/**
* 重绘界面（没有对按钮可见性控制，buttonvisile是在card里，害怕再次出现互相引用的问题）
* @param {*} props 页面内置对象
* @param {*} viewmode 视图类型(add/edit/browse)
* @param {*} urlParam 地址栏参数 
* @param {*} vbillno 单据编号
*/
export const repaintView = function (props,billstatus,settlestatus,pk_batatypepk,isinner) {
    // if (!urlParam) {
    //     urlParam = {};
    // }
    // if (!urlParam.status) {
    //     urlParam['status'] = viewmode;
	// }
	 //从地址栏获取状态
	 status = props.getUrlParam("status");
	 //判断是否是浏览态
	let viewmode1 = (status == viewmode.copy ? viewmode.add : status);
    //更新地址栏参数
    //props.setUrlParam(urlParam);
    //组织版本试图
    orgVersionView(props, constant.formcode1);
    //设置页面组件的显示状态
    props.form.setFormStatus(constant.formcode1, viewmode1 == viewmode.copy ? viewmode.edit : viewmode1);
    //表体只有编辑和浏览两种状态
    props.cardTable.setStatus(constant.formcode5, (viewmode1 == viewmode.add || viewmode1 == viewmode.edit || viewmode1 == viewmode.decide) ? viewmode.edit : viewmode.browse);
    //刷新标题栏
    props.BillHeadInfo.setBillHeadInfoVisible({
        showBackBtn: viewmode1 == viewmode.browse,   //是否显示返回按钮
        showBillCode: viewmode1 != viewmode.add,     //是否显示单据编号
        billCode: props.form.getFormItemsValue( constant.formcode1, constant.vbillno).value
    });

	//按钮控制
	buttonVisible(props,billstatus,pk_batatypepk,isinner,settlestatus);
	//多版本控制
	//versionControl(props);
    //刷新表体头部按钮
    //tableHeadBtnVisible(props);
}


/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/