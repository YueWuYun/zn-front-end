/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import {
	ajax,
	toast,
	print,
	cardCache,
	promptBox,
	output
} from 'nc-lightapp-front';
import {
	constant,
	requesturl
} from '../../config/config';
import {
	commondata
} from '../../../../public/utils/constant';
import {
	saveBtn,
	saveaddBtn,
	savesubmitBtn
} from '../btnClicks/btnClick';
import { checkinput } from '../checkinput/checkinput';

import { imageScan, imageView } from 'sscrp/rppub/components/image'; // 影像扫描和查看

import { MakeBillApp } from '../../../../../tmpub/pub/util/Makebill'; //制单制证
import { linkVoucherApp } from '../../../../../tmpub/pub/util/LinkUtil'; // 联查凭证
//引入常量定义
import { APP_INFO, URL_INFO, CARD_PAGE_INFO, ITEM_INFO } from '../../cons/constant.js';
//引入公共api
import {cardOperator} from '../../../../pub/utils/CMPButtonUtil';
import { CMPEableSscivm } from '../../../../pub/utils/CMPIVPara';
let {
	updateCache
} = cardCache;
export default function (props, id) {

	// let status = props.getUrlParam('status');
	const formcode1 = constant.formcode1;
	let cpagecode = constant.cpagecode;
	const appcode = constant.appcode;
	const cardpath = constant.cardpath;
	// 联查src
	// const linksrc = constant.linksrc;
	// 单据类型
	const billtype = constant.billtype;
	// 打印
	const printfuncode = constant.printfuncode;
	const printnodekey = constant.printnodekey;
	const printtemplateid = constant.printtemplateid;
	const iweb = commondata.iweb;
	// 提交、收回、结算、取消结算公共请求参数
	let requestdata = {
		pageCode: cpagecode,
		pk: this.props.form.getFormItemsValue(this.formId, 'pk_cashdraw').value,
		ts: this.props.form.getFormItemsValue(this.formId, 'ts').value
	};
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
		}
		return validateData;
	}
	switch (id) {
		//新增
		case 'addBtn':
			props.pushTo(cardpath, {
				pagecode: constant.cpagecode,
				status: 'add',
				addid: this.state.addid
			});
			this.renderHtmlByStatus();
			break;
			//复制
		case 'copyBtn':
			props.pushTo(cardpath, {
				pagecode: constant.cpagecode,
				status: 'copy',
				id: props.getUrlParam('id'),
			})
			this.renderHtmlByStatus();
			break;
			//修改、编辑
		case 'editBtn':
			let editid = props.getUrlParam('id');
			if(editid){
				editid = this.props.form.getFormItemsValue(this.formId, 'pk_cashdraw').value;
			}
			let querydata = {pk: editid};
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
			//删除
		case 'deleteBtn':
			promptBox({
				color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
				title: this.state.json['36070WC-000009'], // 弹框表头信息/* 国际化处理： 确认删除*/
				content: this.state.json['36070WC-000010'], //this.modalContent(), //弹框内容，可以是字符串或dom/* 国际化处理： 确认删除所选数据吗?*/
				// noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
				// noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
				// beSureBtnName: "确定",          // 确定按钮名称, 默认为"确定",非必输
				// cancelBtnName: "取消",         // 取消按钮名称, 默认为"取消",非必输
				// hasCloseBtn:false,             //显示“X”按钮，默认不显示，不显示是false，显示是true
				beSureBtnClick: this.delConfirm.bind(this),   // 确定按钮点击调用函数,非必输
				// cancelBtnClick: functionCancel,  // 取消按钮点击调用函数,非必输
				// closeBtnClick:functionClose, //关闭按钮点击调用函数，非必输
				// closeByClickBackDrop:false,//点击遮罩关闭提示框，默认是false点击不关闭,点击关闭是true
			});
			break;
			// 保存
		case 'saveBtn':
			let flag = props.form.isCheckNow(this.formId);
			if (flag) {
				if(checkinput.call(this, props)){
					let savedata = savevalidateData();
					let saveobj = {};
					saveobj[formcode1] = 'form';
					props.validateToSave(savedata, saveBtn.bind(this, props), saveobj, '');
				}
			}
			break;
			//保存新增
		case 'saveaddBtn':
			let flag2 = props.form.isCheckNow(this.formId);
			if (flag2) {
				if(checkinput.call(this, props)){
					let saveadddata = savevalidateData();
					let saveobj = {};
					saveobj[formcode1] = 'form';
					props.validateToSave(saveadddata, saveaddBtn.bind(this, props), saveobj, '');
				}
			}
			break;
			//保存提交
		case 'savesubmitBtn':
			let subflag = props.form.isCheckNow(this.formId);
			if (subflag) {
				if(checkinput.call(this, props)){
					let savesubmitdata = savevalidateData();
					let saveobj = {};
					saveobj[formcode1] = 'form';
					props.validateToSave(savesubmitdata, savesubmitBtn.bind(this, props), saveobj, '');
				}
			}
			break;
			//提交
		case 'submitBtn':
			ajax({
				url: requesturl.commitcard,
				data: {
					pageCode: cpagecode,
					pk: this.props.form.getFormItemsValue(this.formId, 'pk_cashdraw').value,
					ts: this.props.form.getFormItemsValue(this.formId, 'ts').value,
					btncode:'submitBtn'
				},
				success: (res) => {
					let { success, data } = res;
					if (res.success) {
						if (data) {
							let {appointmap} = data;
							if (appointmap) {
								if (appointmap.workflow &&
									(appointmap.workflow == 'approveflow' || appointmap.workflow == 'workflow')) {
									this.setState({
										compositedata: appointmap,
										compositedisplay: true,
									});
								}
							} else {
								toast({
									color: 'success',
									content: this.state.json['36070WC-000001'] /* 国际化处理： 提交成功*/
								});
								this.buttonAfter(res.data.form);
							}
						}
					}
				}
			});
			break;
			//收回
		case 'unsubmitBtn':
			ajax({
				url: requesturl.uncommitcard,
				data: requestdata,
				success: (res) => {
					if (res.success) {
						let id = res.data[formcode1].rows[0].values.pk_cashdraw.value
						updateCache(this.pkname, id, res.data, formcode1, this.cacheDataSource, res.data[formcode1].rows[0].values);
						toast({
							color: 'success',
							content: this.state.json['36070WC-000002'] /* 国际化处理： 收回成功*/
						});
						this.buttonAfter(res.data);
					}
				}
			});
			break;
			// 委托付款
		case 'transfer':
			cardOperator(props, CARD_PAGE_INFO.PAGE_CODE, CARD_PAGE_INFO.HEAD_CODE, [], ITEM_INFO.PK, URL_INFO.COMMON.COMMIT  , this.state.json['36070WC-000049'], APP_INFO.DATA_SOURCE, this.buttonAfter.bind(this), true);
			break;
			// 取消委托
		case 'canceltransfer':
			cardOperator(props, CARD_PAGE_INFO.PAGE_CODE, CARD_PAGE_INFO.HEAD_CODE, [], ITEM_INFO.PK, URL_INFO.COMMON.UNCOMMIT  , this.state.json['36070WC-000050'], APP_INFO.DATA_SOURCE, this.buttonAfter.bind(this), true);
			break;
			// 结算
		case 'settleBtn':
			ajax({
				url: requesturl.settlecard,
				data: requestdata,
				success: (res) => {
					if (res.success) {
						let id = res.data[formcode1].rows[0].values.pk_cashdraw.value
						updateCache(this.pkname, id, res.data, formcode1, this.cacheDataSource, res.data[formcode1].rows[0].values);
						toast({
							color: 'success',
							content: this.state.json['36070WC-000003'] /* 国际化处理： 结算成功*/
						});
						this.buttonAfter(res.data);
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
						let id = res.data[formcode1].rows[0].values.pk_cashdraw.value

						toast({
							color: 'success',
							content: this.state.json['36070WC-000004'] /* 国际化处理： 取消结算成功*/
						});
						this.buttonAfter(res.data);
					}
				}
			});
			break;
			// 取消
		case 'cancelBtn':
			// 页面回退
			promptBox({
				color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
				title: this.state.json['36070WC-000015'], // 弹框表头信息/* 国际化处理： 确认取消*/
				content: this.state.json['36070WC-000016'], //this.modalContent(), //弹框内容，可以是字符串或dom/* 国际化处理： 确认是否取消?*/
				// noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
				// noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
				// beSureBtnName: "确定",          // 确定按钮名称, 默认为"确定",非必输
				// cancelBtnName: "取消",         // 取消按钮名称, 默认为"取消",非必输
				// hasCloseBtn:false,             //显示“X”按钮，默认不显示，不显示是false，显示是true
				beSureBtnClick: this.cancelModalBeSure.bind(this),   // 确定按钮点击调用函数,非必输
				cancelBtnClick: this.cancelModalCancel.bind(this),  // 取消按钮点击调用函数,非必输
				// closeBtnClick:functionClose, //关闭按钮点击调用函数，非必输
				// closeByClickBackDrop:false,//点击遮罩关闭提示框，默认是false点击不关闭,点击关闭是true
			});
			break;
			// 联查账户余额
		case 'cashbalanceBtn':
			let cashbalanceArr = [];
			let pk_cashaccount = props.form.getFormItemsValue(this.formId, 'pk_cashaccount').value;
			let pk_orgc = props.form.getFormItemsValue(this.formId, 'pk_org').value;
			//修改请求联查方式
			let query_datac = {
				pk_org: pk_orgc, //财务组织id
				pk_account: null, //银行账户id，没有可不写，和现金账户二选一
				pk_cashaccount: pk_cashaccount //现金账户id，没有可不写
			}
			cashbalanceArr.push(query_datac); //现金账户
			this.setState({
				showOriginalData: cashbalanceArr,
				showOriginal: true,
			});
			break;
			// 联查银行账户余额
		case 'bankaccbalanceBtn':
			let bankaccbalanceArr = [];
			let pk_bankaccount = props.form.getFormItemsValue(this.formId, 'pk_bankaccount').value;
			let pk_orgb = props.form.getFormItemsValue(this.formId, 'pk_org').value;
			let query_datab = {
				pk_org: pk_orgb, //财务组织id
				pk_account: pk_bankaccount, //银行账户id，没有可不写，和现金账户二选一
				pk_cashaccount: null //现金账户id，没有可不写
			}
			bankaccbalanceArr.push(query_datab); //现金账户
			this.setState({
				showOriginalData: bankaccbalanceArr,
				showOriginal: true,
			});
			break;
			// 联查审批意见
		case 'approveopinionBtn':
			let pk_cashdrawa = props.form.getFormItemsValue(this.formId, 'pk_cashdraw').value;
			this.setState({
				billId: pk_cashdrawa, //单据id
				approveshow: !this.state.approveshow
			})
			break;
			// 联查凭证
		case 'voucherBtn':
			//处理选择数据
			let pk_cashdrawv = props.form.getFormItemsValue(this.formId, 'pk_cashdraw').value;
			let billnov = props.form.getFormItemsValue(this.formId, 'billno').value;
			let pk_groupv = props.form.getFormItemsValue(this.formId, 'pk_group').value;
			let pk_orgv = props.form.getFormItemsValue(this.formId, 'pk_org').value;
			linkVoucherApp(this.props,pk_cashdrawv,pk_groupv,pk_orgv,billtype,billnov,);
			break;
			// 制单
		case 'makebillBtn':
			//处理选择数据
			let pk_cashdrawmb = props.form.getFormItemsValue(this.formId, 'pk_cashdraw').value;
			let tableName = ITEM_INFO.tableName;
			let pkfieldName = ITEM_INFO.PK;
			MakeBillApp(this.props, constant.appcode, pk_cashdrawmb, billtype,tableName,pkfieldName);
			break;
			// 附件
		case 'enclosureBtn':
			let pk_cashdrawe = props.form.getFormItemsValue(this.formId, 'pk_cashdraw').value;
			let billnoe = props.form.getFormItemsValue(this.formId, 'billno').value;
			this.setState({
				billId: pk_cashdrawe, //单据id
				billno: billnoe, // 单据编号
				showUploader: !this.state.showUploader,
				target: null
			})
			break;
			// 打印
		case 'printBtn':
			print(
				'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
				requesturl.print, {
					// billtype: billtype, //单据类型
					// funcode: printfuncode, //功能节点编码，即模板编码
					appcode: appcode, //appcode
					nodekey: printnodekey, //模板节点标识
					// printTemplateID: printtemplateid, //模板id
					oids: [this.props.form.getFormItemsValue(this.formId, 'pk_cashdraw').value]
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
					oids: [this.props.form.getFormItemsValue(this.formId, 'pk_cashdraw').value],
					outputType: 'output'
				}
			});
			break;
			//影像查看
		case 'imgreviewBtn':
			if(CMPEableSscivm.call(this)){
				 return ;
			};
			let imgreviewbillid = props.getUrlParam('id'); //单据pk(billid)
			let imgreviewdata = props.form.getAllFormValue(formcode1);
			let billInfoMap = {};
			billInfoMap.pk_billid = imgreviewbillid;
			billInfoMap.pk_billtype = imgreviewdata.rows[0].values.billtypecode.value;
			billInfoMap.pk_tradetype = imgreviewdata.rows[0].values.billtypecode.value;
			billInfoMap.pk_org = imgreviewdata.rows[0].values.pk_org.value;
			imageView(billInfoMap, iweb);
			break;
			//影像扫描
		case 'imgscanBtn': 
			if(CMPEableSscivm.call(this)){
			 	return ;
			};
			let imgscandata = props.form.getAllFormValue(formcode1);
			let imgscanbillid = props.getUrlParam('id'); //单据pk(billid)
			let imgscanbillInfoMap = {};
			imgscanbillInfoMap.pk_billid = imgscanbillid;
			imgscanbillInfoMap.pk_billtype = imgscandata.rows[0].values.billtypecode.value;
			imgscanbillInfoMap.pk_tradetype = imgscandata.rows[0].values.billtypecode.value;
			imgscanbillInfoMap.pk_org = imgscandata.rows[0].values.pk_org.value;
			imgscanbillInfoMap.BillType = imgscandata.rows[0].values.billtypecode.value;
			imgscanbillInfoMap.BillDate = imgscandata.rows[0].values.creationtime.value;
			imgscanbillInfoMap.Busi_Serial_No = imgscandata.rows[0].values.pk_cashdraw.value; //.pk_mtapp_bill.value;
			imgscanbillInfoMap.OrgNo = imgscandata.rows[0].values.pk_org.value; //pk_org.value;
			imgscanbillInfoMap.BillCode = imgscandata.rows[0].values.billno.value; //vbillno.value;
			imgscanbillInfoMap.OrgName = imgscandata.rows[0].values.pk_org.display; //pk_org.display;
			imgscanbillInfoMap.Cash = imgscandata.rows[0].values.money.value; //orig_amount.value;
			imageScan(imgscanbillInfoMap, iweb);
			break;
			// 刷新
		case 'refreshBtn':
			let cashdrawpk = props.form.getFormItemsValue(this.formId, 'pk_cashdraw').value;
			let data = {pk: cashdrawpk,pageCode: this.pageId};
			ajax({
				url: requesturl.querycard,
				data: data,
				success: (res) => {
					if (res) {
						if (res.data) {
							this.props.form.setAllFormValue({
								[this.formId]: res.data[this.formId]
							});
							let billno = res.data[this.formId].rows[0].values.billno.value;
							this.props.BillHeadInfo.setBillHeadInfoVisible({
								// showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
								showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
								billCode: billno
							});
							this.buttonAfter(res.data);
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

/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/